package tum.devoops.organizationservice.service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.organizationservice.entity.TeamEntity;
import tum.devoops.organizationservice.entity.TraineeEntity;
import tum.devoops.organizationservice.entity.TrainerEntity;
import tum.devoops.organizationservice.exception.BadRequestException;
import tum.devoops.organizationservice.exception.ForbiddenException;
import tum.devoops.organizationservice.exception.NotFoundException;
import tum.devoops.organizationservice.model.Team;
import tum.devoops.organizationservice.model.TeamCreate;
import tum.devoops.organizationservice.model.TeamPartialUpdate;
import tum.devoops.organizationservice.repository.DirectorRepository;
import tum.devoops.organizationservice.repository.MemberRepository;
import tum.devoops.organizationservice.repository.SportRepository;
import tum.devoops.organizationservice.repository.TeamRepository;
import tum.devoops.organizationservice.repository.TraineeRepository;
import tum.devoops.organizationservice.repository.TrainerRepository;

@Service
public class OrganizationTeamService {

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private SportRepository sportRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private MemberRoleSyncService memberRoleSyncService;

    @Transactional(readOnly = true)
    public List<Team> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::toTeam)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Team getTeam(UUID teamId) {
        return toTeam(findTeamOrThrow(teamId));
    }

    @Transactional
    public Team createTeam(TeamCreate body, UUID requesterId, boolean isAdmin) {
        if (!sportRepository.existsById(body.getSport())) {
            throw new BadRequestException("Sport not found: " + body.getSport());
        }

        boolean isDirectorOfSport = directorRepository.findAllById_SportId(body.getSport()).stream()
                .anyMatch(d -> d.getId().getMemberId().equals(requesterId));
        if (!isAdmin && !isDirectorOfSport) {
            throw new ForbiddenException("Access denied");
        }

        List<UUID> trainerIds = resolveAndValidateMemberUuids(body.getTrainers(), "trainer");
        List<UUID> traineeIds = resolveAndValidateMemberUuids(body.getTrainees(), "trainee");

        TeamEntity team = new TeamEntity();
        team.setName(body.getName());
        team.setDescription(body.getDescription());
        team.setAddress(body.getAddress());
        team.setSportId(body.getSport());
        team.setCreatedAt(LocalDate.now());
        teamRepository.save(team);

        saveTrainers(team.getId(), trainerIds);
        saveTrainees(team.getId(), traineeIds);

        Set<UUID> affected = new HashSet<>(trainerIds);
        affected.addAll(traineeIds);
        memberRoleSyncService.scheduleSync(affected);

        return toTeam(findTeamOrThrow(team.getId()));
    }

    @Transactional
    public Team updateTeam(UUID teamId, TeamPartialUpdate body, UUID requesterId, boolean isAdmin) {
        TeamEntity team = findTeamOrThrow(teamId);

        boolean isDirectorOfSport = directorRepository.findAllById_SportId(team.getSportId()).stream()
                .anyMatch(d -> d.getId().getMemberId().equals(requesterId));
        boolean isTrainerOfTeam = trainerRepository.findAllById_TeamId(teamId).stream()
                .anyMatch(t -> t.getId().getMemberId().equals(requesterId));

        if (!isAdmin && !isDirectorOfSport && !isTrainerOfTeam) {
            throw new ForbiddenException("Access denied");
        }

        if (body.getSport() != null && !isAdmin) {
            throw new ForbiddenException("Only admins can update the sport field");
        }
        if (body.getTrainers() != null && !isAdmin && !isDirectorOfSport) {
            throw new ForbiddenException("Only directors and admins can update the trainers list");
        }

        if (body.getSport() != null) {
            if (!sportRepository.existsById(body.getSport())) {
                throw new BadRequestException("Sport not found: " + body.getSport());
            }
            team.setSportId(body.getSport());
        }
        if (body.getName() != null) {
            team.setName(body.getName());
        }
        if (body.getDescription() != null) {
            team.setDescription(body.getDescription());
        }
        if (body.getAddress() != null) {
            team.setAddress(body.getAddress());
        }
        teamRepository.save(team);

        // null means the list was omitted (no change); a non-null list (including empty) replaces
        // the current members, so an empty list clears them.
        Set<UUID> affected = new HashSet<>();
        if (body.getTrainers() != null) {
            List<UUID> trainerIds = resolveAndValidateMemberUuids(body.getTrainers(), "trainer");
            trainerRepository.findAllById_TeamId(teamId)
                    .forEach(t -> affected.add(t.getId().getMemberId()));
            trainerRepository.deleteAllById_TeamId(teamId);
            saveTrainers(teamId, trainerIds);
            affected.addAll(trainerIds);
        }
        if (body.getTrainees() != null) {
            List<UUID> traineeIds = resolveAndValidateMemberUuids(body.getTrainees(), "trainee");
            traineeRepository.findAllById_TeamId(teamId)
                    .forEach(t -> affected.add(t.getId().getMemberId()));
            traineeRepository.deleteAllById_TeamId(teamId);
            saveTrainees(teamId, traineeIds);
            affected.addAll(traineeIds);
        }
        memberRoleSyncService.scheduleSync(affected);

        return toTeam(findTeamOrThrow(teamId));
    }

    @Transactional
    public void deleteTeam(UUID teamId, UUID requesterId, boolean isAdmin) {
        TeamEntity team = findTeamOrThrow(teamId);

        boolean isDirectorOfSport = directorRepository.findAllById_SportId(team.getSportId()).stream()
                .anyMatch(d -> d.getId().getMemberId().equals(requesterId));
        if (!isAdmin && !isDirectorOfSport) {
            throw new ForbiddenException("Access denied");
        }

        Set<UUID> affected = new HashSet<>();
        trainerRepository.findAllById_TeamId(teamId)
                .forEach(t -> affected.add(t.getId().getMemberId()));
        traineeRepository.findAllById_TeamId(teamId)
                .forEach(t -> affected.add(t.getId().getMemberId()));

        traineeRepository.deleteAllById_TeamId(teamId);
        trainerRepository.deleteAllById_TeamId(teamId);
        teamRepository.delete(team);

        memberRoleSyncService.scheduleSync(affected);
    }

    private TeamEntity findTeamOrThrow(UUID teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new NotFoundException("Team not found: " + teamId));
    }

    private List<UUID> resolveAndValidateMemberUuids(List<String> strings, String role) {
        if (strings == null) {
            return List.of();
        }
        return strings.stream()
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (IllegalArgumentException e) {
                        throw new BadRequestException("Invalid UUID for " + role + ": " + s);
                    }
                })
                .peek(id -> {
                    if (!memberRepository.existsById(id)) {
                        throw new BadRequestException("Member not found: " + id);
                    }
                })
                .collect(Collectors.toList());
    }

    private void saveTrainers(UUID teamId, List<UUID> memberIds) {
        List<TrainerEntity> trainers = memberIds.stream()
                .map(id -> new TrainerEntity(new TrainerEntity.Id(teamId, id)))
                .collect(Collectors.toList());
        trainerRepository.saveAll(trainers);
    }

    private void saveTrainees(UUID teamId, List<UUID> memberIds) {
        List<TraineeEntity> trainees = memberIds.stream()
                .map(id -> new TraineeEntity(new TraineeEntity.Id(teamId, id)))
                .collect(Collectors.toList());
        traineeRepository.saveAll(trainees);
    }

    private Team toTeam(TeamEntity entity) {
        List<String> trainers = entity.getTrainers().stream()
                .map(t -> t.getId().getMemberId().toString())
                .collect(Collectors.toList());
        List<String> trainees = entity.getTrainees().stream()
                .map(t -> t.getId().getMemberId().toString())
                .collect(Collectors.toList());
        return new Team(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCreatedAt(),
                entity.getAddress(),
                entity.getSportId(),
                trainers,
                trainees
        );
    }
}
