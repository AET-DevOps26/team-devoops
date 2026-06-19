package tum.devoops.organizationservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.organizationservice.entity.DirectorEntity;
import tum.devoops.organizationservice.entity.SportEntity;
import tum.devoops.organizationservice.entity.TeamEntity;
import tum.devoops.organizationservice.exception.BadRequestException;
import tum.devoops.organizationservice.exception.ConflictException;
import tum.devoops.organizationservice.exception.ForbiddenException;
import tum.devoops.organizationservice.exception.NotFoundException;
import tum.devoops.organizationservice.model.Sport;
import tum.devoops.organizationservice.model.SportCreate;
import tum.devoops.organizationservice.model.SportPartialUpdate;
import tum.devoops.organizationservice.repository.DirectorRepository;
import tum.devoops.organizationservice.repository.MemberRepository;
import tum.devoops.organizationservice.repository.SportRepository;
import tum.devoops.organizationservice.repository.TeamRepository;
import tum.devoops.organizationservice.repository.TraineeRepository;
import tum.devoops.organizationservice.repository.TrainerRepository;

@Service
public class OrganizationSportService {

    @Autowired
    private SportRepository sportRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private TraineeRepository traineeRepository;

    @Transactional(readOnly = true)
    public List<Sport> getAllSports() {
        return sportRepository.findAll().stream()
                .map(this::toSport)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Sport getSport(String sportName) {
        return toSport(findSportOrThrow(sportName));
    }

    @Transactional
    public Sport createSport(SportCreate body) {
        if (sportRepository.existsById(body.getName())) {
            throw new ConflictException("Sport already exists: " + body.getName());
        }
        List<UUID> directorIds = resolveDirectorUuids(body.getDirectors());

        SportEntity entity = new SportEntity();
        entity.setName(body.getName());
        entity.setDescription(body.getDescription());
        entity.setCreatedAt(LocalDate.now());
        sportRepository.save(entity);

        saveDirectors(body.getName(), directorIds);

        return toSport(findSportOrThrow(body.getName()));
    }

    @Transactional
    public Sport updateSport(String sportName, SportPartialUpdate body, UUID requesterId, boolean isAdmin) {
        SportEntity sport = findSportOrThrow(sportName);

        boolean isDirector = directorRepository.findAllById_SportName(sportName).stream()
                .anyMatch(d -> d.getId().getMemberId().equals(requesterId));
        if (!isAdmin && !isDirector) {
            throw new ForbiddenException("Access denied");
        }

        String effectiveName = (body.getName() != null) ? body.getName() : sportName;
        String effectiveDescription = (body.getDescription() != null) ? body.getDescription() : sport.getDescription();

        if (!effectiveName.equals(sportName)) {
            if (sportRepository.existsById(effectiveName)) {
                throw new ConflictException("Sport already exists: " + effectiveName);
            }
            List<DirectorEntity> oldDirectors = directorRepository.findAllById_SportName(sportName);
            List<TeamEntity> teams = teamRepository.findAllBySportName(sportName);
            for (TeamEntity team : teams) {
                team.setSportName(effectiveName);
            }

            SportEntity newSport = new SportEntity();
            newSport.setName(effectiveName);
            newSport.setDescription(effectiveDescription);
            newSport.setCreatedAt(sport.getCreatedAt());
            sportRepository.save(newSport);

            teamRepository.saveAll(teams);
            directorRepository.deleteAllById_SportName(sportName);

            if (isAdmin && !body.getDirectors().isEmpty()) {
                saveDirectors(effectiveName, resolveDirectorUuids(body.getDirectors()));
            } else {
                List<DirectorEntity> migratedDirectors = oldDirectors.stream()
                        .map(d -> new DirectorEntity(
                                new DirectorEntity.Id(effectiveName, d.getId().getMemberId())))
                        .collect(Collectors.toList());
                directorRepository.saveAll(migratedDirectors);
            }

            sportRepository.delete(sport);
        } else {
            sport.setDescription(effectiveDescription);
            sportRepository.save(sport);

            if (isAdmin && !body.getDirectors().isEmpty()) {
                directorRepository.deleteAllById_SportName(sportName);
                saveDirectors(sportName, resolveDirectorUuids(body.getDirectors()));
            }
        }

        return toSport(findSportOrThrow(effectiveName));
    }

    @Transactional
    public void deleteSport(String sportName) {
        SportEntity sport = findSportOrThrow(sportName);

        List<TeamEntity> teams = teamRepository.findAllBySportName(sportName);
        for (TeamEntity team : teams) {
            traineeRepository.deleteAllById_TeamId(team.getId());
            trainerRepository.deleteAllById_TeamId(team.getId());
        }
        teamRepository.deleteAll(teams);

        directorRepository.deleteAllById_SportName(sportName);
        sportRepository.delete(sport);
    }

    private SportEntity findSportOrThrow(String sportName) {
        return sportRepository.findById(sportName)
                .orElseThrow(() -> new NotFoundException("Sport not found: " + sportName));
    }

    private List<UUID> resolveDirectorUuids(List<String> directorStrings) {
        return directorStrings.stream()
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (IllegalArgumentException e) {
                        throw new BadRequestException("Invalid UUID for director: " + s);
                    }
                })
                .peek(id -> {
                    if (!memberRepository.existsById(id)) {
                        throw new BadRequestException("Member not found: " + id);
                    }
                })
                .collect(Collectors.toList());
    }

    private void saveDirectors(String sportName, List<UUID> directorIds) {
        List<DirectorEntity> directors = directorIds.stream()
                .map(id -> new DirectorEntity(new DirectorEntity.Id(sportName, id)))
                .collect(Collectors.toList());
        directorRepository.saveAll(directors);
    }

    private Sport toSport(SportEntity entity) {
        List<String> directors = entity.getDirectors().stream()
                .map(d -> d.getId().getMemberId().toString())
                .collect(Collectors.toList());
        return new Sport(entity.getName(), entity.getDescription(), entity.getCreatedAt(), directors);
    }
}
