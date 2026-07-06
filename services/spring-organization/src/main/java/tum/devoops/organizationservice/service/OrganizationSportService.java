package tum.devoops.organizationservice.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
import tum.devoops.organizationservice.model.Reference;
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
    @Autowired
    private MemberRoleSyncService memberRoleSyncService;

    @Transactional(readOnly = true)
    public List<Sport> getAllSports() {
        return sportRepository.findAll().stream()
                .map(this::toSport)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Sport getSport(UUID sportId) {
        return toSport(findSportOrThrow(sportId));
    }

    @Transactional
    public Sport createSport(SportCreate body) {
        if (sportRepository.existsByName(body.getName())) {
            throw new ConflictException("Sport already exists: " + body.getName());
        }
        List<UUID> directorIds = resolveDirectorUuids(body.getDirectors());

        SportEntity entity = new SportEntity();
        entity.setName(body.getName());
        entity.setDescription(body.getDescription());
        entity.setCreatedAt(LocalDate.now());
        sportRepository.save(entity);

        saveDirectors(entity.getId(), directorIds);

        memberRoleSyncService.scheduleSync(new HashSet<>(directorIds));

        // Build the response from the resolved ids: within this transaction findById returns
        // the same managed instance, whose directors collection doesn't see the rows saved above.
        return new Sport(entity.getId(), entity.getName(), entity.getDescription(),
                entity.getCreatedAt(), memberReferences(directorIds));
    }

    @Transactional
    public Sport updateSport(UUID sportId, SportPartialUpdate body, UUID requesterId, boolean isAdmin) {
        SportEntity sport = findSportOrThrow(sportId);

        boolean isDirector = directorRepository.findAllById_SportId(sportId).stream()
                .anyMatch(d -> d.getId().getMemberId().equals(requesterId));
        if (!isAdmin && !isDirector) {
            throw new ForbiddenException("Access denied");
        }

        // Renaming is now a plain field update — no foreign keys reference the name.
        if (body.getName() != null && !body.getName().equals(sport.getName())) {
            if (sportRepository.existsByName(body.getName())) {
                throw new ConflictException("Sport already exists: " + body.getName());
            }
            sport.setName(body.getName());
        }
        if (body.getDescription() != null) {
            sport.setDescription(body.getDescription());
        }
        sportRepository.save(sport);

        // null means the directors list was omitted (no change); a non-null list (including empty)
        // replaces the current directors, so an empty list clears them. Only admins may change it.
        Set<UUID> affected = new HashSet<>();
        List<UUID> directorIds;
        if (isAdmin && body.getDirectors() != null) {
            directorRepository.findAllById_SportId(sportId)
                    .forEach(d -> affected.add(d.getId().getMemberId()));
            directorRepository.deleteAllById_SportId(sportId);
            directorIds = resolveDirectorUuids(body.getDirectors());
            saveDirectors(sportId, directorIds);
            affected.addAll(directorIds);
        } else {
            directorIds = directorRepository.findAllById_SportId(sportId).stream()
                    .map(d -> d.getId().getMemberId())
                    .collect(Collectors.toList());
        }
        memberRoleSyncService.scheduleSync(affected);

        // Build the response from the resolved ids rather than sport.getDirectors(): within this
        // transaction the entity's lazy directors collection doesn't see the rows saved above.
        return new Sport(sport.getId(), sport.getName(), sport.getDescription(),
                sport.getCreatedAt(), memberReferences(directorIds));
    }

    @Transactional
    public void deleteSport(UUID sportId) {
        SportEntity sport = findSportOrThrow(sportId);

        Set<UUID> affected = new HashSet<>();
        directorRepository.findAllById_SportId(sportId)
                .forEach(d -> affected.add(d.getId().getMemberId()));

        List<TeamEntity> teams = teamRepository.findAllBySportId(sportId);
        for (TeamEntity team : teams) {
            trainerRepository.findAllById_TeamId(team.getId())
                    .forEach(t -> affected.add(t.getId().getMemberId()));
            traineeRepository.findAllById_TeamId(team.getId())
                    .forEach(t -> affected.add(t.getId().getMemberId()));
            traineeRepository.deleteAllById_TeamId(team.getId());
            trainerRepository.deleteAllById_TeamId(team.getId());
        }
        teamRepository.deleteAll(teams);

        directorRepository.deleteAllById_SportId(sportId);
        sportRepository.delete(sport);

        memberRoleSyncService.scheduleSync(affected);
    }

    private SportEntity findSportOrThrow(UUID sportId) {
        return sportRepository.findById(sportId)
                .orElseThrow(() -> new NotFoundException("Sport not found: " + sportId));
    }

    private List<UUID> resolveDirectorUuids(List<String> directorStrings) {
        if (directorStrings == null) {
            return List.of();
        }
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

    private void saveDirectors(UUID sportId, List<UUID> directorIds) {
        List<DirectorEntity> directors = directorIds.stream()
                .map(id -> new DirectorEntity(new DirectorEntity.Id(sportId, id)))
                .collect(Collectors.toList());
        directorRepository.saveAll(directors);
    }

    private Sport toSport(SportEntity entity) {
        List<UUID> directorIds = entity.getDirectors().stream()
                .map(d -> d.getId().getMemberId())
                .collect(Collectors.toList());
        return new Sport(entity.getId(), entity.getName(), entity.getDescription(),
                entity.getCreatedAt(), memberReferences(directorIds));
    }

    private List<Reference> memberReferences(List<UUID> memberIds) {
        if (memberIds.isEmpty()) {
            return new ArrayList<>();
        }
        Map<UUID, String> names = new HashMap<>();
        memberRepository.findAllById(memberIds)
                .forEach(m -> names.put(m.getId(), m.getFirstName() + " " + m.getLastName()));
        return memberIds.stream()
                .map(id -> new Reference(id, names.get(id)))
                .collect(Collectors.toList());
    }
}
