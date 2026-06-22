package tum.devoops.organizationservice;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import tum.devoops.organizationservice.entity.DirectorEntity;
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
import tum.devoops.organizationservice.service.OrganizationTeamService;

@ExtendWith(MockitoExtension.class)
class OrganizationTeamServiceTest {

    @Mock
    private TeamRepository teamRepository;
    @Mock
    private SportRepository sportRepository;
    @Mock
    private DirectorRepository directorRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private TrainerRepository trainerRepository;
    @Mock
    private TraineeRepository traineeRepository;

    @InjectMocks
    private OrganizationTeamService service;

    private static final UUID TEAM_ID = UUID.fromString("00000000-0000-0000-0000-000000000010");
    private static final UUID ADMIN_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID DIRECTOR_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID TRAINER_ID = UUID.fromString("00000000-0000-0000-0000-000000000003");
    private static final UUID TRAINEE_ID = UUID.fromString("00000000-0000-0000-0000-000000000004");

    private TeamEntity teamEntity(UUID id, String sportName,
            List<TrainerEntity> trainers, List<TraineeEntity> trainees) {
        TeamEntity entity = new TeamEntity();
        entity.setId(id);
        entity.setName("Team Alpha");
        entity.setDescription("A test team");
        entity.setAddress("123 Main St");
        entity.setCreatedAt(LocalDate.of(2024, 1, 1));
        entity.setSportName(sportName);
        entity.setTrainers(trainers);
        entity.setTrainees(trainees);
        return entity;
    }

    private TrainerEntity trainerEntity(UUID teamId, UUID memberId) {
        return new TrainerEntity(new TrainerEntity.Id(teamId, memberId));
    }

    private TraineeEntity traineeEntity(UUID teamId, UUID memberId) {
        return new TraineeEntity(new TraineeEntity.Id(teamId, memberId));
    }

    private DirectorEntity directorEntity(String sportName, UUID memberId) {
        return new DirectorEntity(new DirectorEntity.Id(sportName, memberId));
    }

    // --- getAllTeams ---

    @Test
    void getAllTeams_returnsEmptyList_whenNoTeams() {
        when(teamRepository.findAll()).thenReturn(List.of());

        assertThat(service.getAllTeams()).isEmpty();
    }

    @Test
    void getAllTeams_returnsMappedList_whenTeamsExist() {
        TeamEntity entity = teamEntity(TEAM_ID, "soccer",
                List.of(trainerEntity(TEAM_ID, TRAINER_ID)),
                List.of(traineeEntity(TEAM_ID, TRAINEE_ID)));
        when(teamRepository.findAll()).thenReturn(List.of(entity));

        List<Team> result = service.getAllTeams();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(TEAM_ID);
        assertThat(result.get(0).getName()).isEqualTo("Team Alpha");
        assertThat(result.get(0).getTrainers()).containsExactly(TRAINER_ID.toString());
        assertThat(result.get(0).getTrainees()).containsExactly(TRAINEE_ID.toString());
    }

    // --- getTeam ---

    @Test
    void getTeam_returnsMappedTeam_whenFound() {
        TeamEntity entity = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(entity));

        Team result = service.getTeam(TEAM_ID);

        assertThat(result.getId()).isEqualTo(TEAM_ID);
        assertThat(result.getName()).isEqualTo("Team Alpha");
        assertThat(result.getDescription()).isEqualTo("A test team");
        assertThat(result.getAddress()).isEqualTo("123 Main St");
        assertThat(result.getSport()).isEqualTo("soccer");
        assertThat(result.getCreatedAt()).isEqualTo(LocalDate.of(2024, 1, 1));
    }

    @Test
    void getTeam_throwsNotFoundException_whenAbsent() {
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getTeam(TEAM_ID))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining(TEAM_ID.toString());
    }

    // --- createTeam ---

    @Test
    void createTeam_throwsBadRequest_whenSportNotFound() {
        when(sportRepository.existsById("soccer")).thenReturn(false);

        assertThatThrownBy(() -> service.createTeam(new TeamCreate("Team Alpha", "soccer"), ADMIN_ID, true))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("soccer");
    }

    @Test
    void createTeam_throwsForbidden_whenNotAdminAndNotDirector() {
        UUID callerId = UUID.randomUUID();
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());

        assertThatThrownBy(() -> service.createTeam(new TeamCreate("Team Alpha", "soccer"), callerId, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void createTeam_allowsCreate_whenDirectorOfSport() {
        DirectorEntity director = directorEntity("soccer", DIRECTOR_ID);
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of(director));
        when(teamRepository.save(any(TeamEntity.class))).thenAnswer(inv -> {
            TeamEntity t = inv.getArgument(0);
            t.setId(TEAM_ID);
            return t;
        });
        TeamEntity saved = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(saved));

        Team result = service.createTeam(new TeamCreate("Team Alpha", "soccer"), DIRECTOR_ID, false);

        verify(teamRepository).save(any(TeamEntity.class));
        assertThat(result.getId()).isEqualTo(TEAM_ID);
    }

    @Test
    void createTeam_throwsBadRequest_whenTrainerUuidMalformed() {
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(directorRepository.findAllById_SportName("soccer"))
                .thenReturn(List.of(directorEntity("soccer", DIRECTOR_ID)));

        TeamCreate body = new TeamCreate("Team Alpha", "soccer");
        body.setTrainers(List.of("not-a-uuid"));

        assertThatThrownBy(() -> service.createTeam(body, DIRECTOR_ID, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not-a-uuid");
    }

    @Test
    void createTeam_throwsBadRequest_whenTraineeMemberNotFound() {
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(directorRepository.findAllById_SportName("soccer"))
                .thenReturn(List.of(directorEntity("soccer", DIRECTOR_ID)));
        when(memberRepository.existsById(TRAINEE_ID)).thenReturn(false);

        TeamCreate body = new TeamCreate("Team Alpha", "soccer");
        body.setTrainees(List.of(TRAINEE_ID.toString()));

        assertThatThrownBy(() -> service.createTeam(body, DIRECTOR_ID, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining(TRAINEE_ID.toString());
    }

    @Test
    void createTeam_savesEntityAndTrainersAndTrainees_andReturnsResult() {
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(directorRepository.findAllById_SportName("soccer"))
                .thenReturn(List.of(directorEntity("soccer", DIRECTOR_ID)));
        when(memberRepository.existsById(TRAINER_ID)).thenReturn(true);
        when(memberRepository.existsById(TRAINEE_ID)).thenReturn(true);
        when(teamRepository.save(any(TeamEntity.class))).thenAnswer(inv -> {
            TeamEntity t = inv.getArgument(0);
            t.setId(TEAM_ID);
            return t;
        });
        TeamEntity saved = teamEntity(TEAM_ID, "soccer",
                List.of(trainerEntity(TEAM_ID, TRAINER_ID)),
                List.of(traineeEntity(TEAM_ID, TRAINEE_ID)));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(saved));

        TeamCreate body = new TeamCreate("Team Alpha", "soccer");
        body.setTrainers(List.of(TRAINER_ID.toString()));
        body.setTrainees(List.of(TRAINEE_ID.toString()));
        Team result = service.createTeam(body, DIRECTOR_ID, false);

        verify(teamRepository).save(any(TeamEntity.class));
        verify(trainerRepository).saveAll(any());
        verify(traineeRepository).saveAll(any());
        assertThat(result.getTrainers()).containsExactly(TRAINER_ID.toString());
        assertThat(result.getTrainees()).containsExactly(TRAINEE_ID.toString());
    }

    @Test
    void createTeam_savesEntityWithNoMembers_whenEmptyLists() {
        when(sportRepository.existsById("soccer")).thenReturn(true);
        when(teamRepository.save(any(TeamEntity.class))).thenAnswer(inv -> {
            TeamEntity t = inv.getArgument(0);
            t.setId(TEAM_ID);
            return t;
        });
        TeamEntity saved = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(saved));

        Team result = service.createTeam(new TeamCreate("Team Alpha", "soccer"), ADMIN_ID, true);

        verify(teamRepository).save(any(TeamEntity.class));
        assertThat(result.getTrainers()).isEmpty();
        assertThat(result.getTrainees()).isEmpty();
    }

    // --- updateTeam ---

    @Test
    void updateTeam_throwsNotFoundException_whenTeamAbsent() {
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, new TeamPartialUpdate(), ADMIN_ID, true))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateTeam_throwsForbidden_whenNotAdminNotDirectorNotTrainer() {
        UUID outsiderId = UUID.randomUUID();
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID)).thenReturn(List.of());

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, new TeamPartialUpdate(), outsiderId, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateTeam_allowsUpdate_whenMemberIsTrainer() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        Team result = service.updateTeam(TEAM_ID, new TeamPartialUpdate(), TRAINER_ID, false);

        assertThat(result.getId()).isEqualTo(TEAM_ID);
    }

    @Test
    void updateTeam_allowsUpdate_whenMemberIsDirector() {
        DirectorEntity director = directorEntity("soccer", DIRECTOR_ID);
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of(director));

        Team result = service.updateTeam(TEAM_ID, new TeamPartialUpdate(), DIRECTOR_ID, false);

        assertThat(result.getId()).isEqualTo(TEAM_ID);
    }

    @Test
    void updateTeam_throwsForbidden_whenTrainerTriesToUpdateSport() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setSport("football");

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, body, TRAINER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateTeam_throwsForbidden_whenTrainerTriesToUpdateTrainers() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setTrainers(List.of(TRAINER_ID.toString()));

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, body, TRAINER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateTeam_throwsBadRequest_whenNewSportNotFound() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(sportRepository.existsById("unknown")).thenReturn(false);

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setSport("unknown");

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, body, ADMIN_ID, true))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("unknown");
    }

    @Test
    void updateTeam_updatesScalarFields_whenNonNull() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setName("New Name");
        body.setDescription("New Desc");
        body.setAddress("New Address");
        service.updateTeam(TEAM_ID, body, TRAINER_ID, false);

        assertThat(team.getName()).isEqualTo("New Name");
        assertThat(team.getDescription()).isEqualTo("New Desc");
        assertThat(team.getAddress()).isEqualTo("New Address");
        verify(teamRepository).save(team);
    }

    @Test
    void updateTeam_doesNotUpdateScalarField_whenNull() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        service.updateTeam(TEAM_ID, new TeamPartialUpdate(), TRAINER_ID, false);

        assertThat(team.getName()).isEqualTo("Team Alpha");
        assertThat(team.getDescription()).isEqualTo("A test team");
        assertThat(team.getAddress()).isEqualTo("123 Main St");
    }

    @Test
    void updateTeam_updatesSport_whenAdminSetsNewSport() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "football", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(sportRepository.existsById("football")).thenReturn(true);

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setSport("football");
        Team result = service.updateTeam(TEAM_ID, body, ADMIN_ID, true);

        assertThat(team.getSportName()).isEqualTo("football");
        verify(teamRepository).save(team);
        assertThat(result.getSport()).isEqualTo("football");
    }

    @Test
    void updateTeam_doesNotReplaceTrainers_whenEmptyList() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer", List.of(), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        service.updateTeam(TEAM_ID, new TeamPartialUpdate(), TRAINER_ID, false);

        verify(trainerRepository, never()).deleteAllById_TeamId(any());
        verify(trainerRepository, never()).saveAll(any());
    }

    @Test
    void updateTeam_replacesTrainers_whenNonEmptyList() {
        DirectorEntity director = directorEntity("soccer", DIRECTOR_ID);
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer",
                        List.of(trainerEntity(TEAM_ID, TRAINER_ID)), List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of(director));
        when(memberRepository.existsById(TRAINER_ID)).thenReturn(true);

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setTrainers(List.of(TRAINER_ID.toString()));
        service.updateTeam(TEAM_ID, body, DIRECTOR_ID, false);

        verify(trainerRepository).deleteAllById_TeamId(TEAM_ID);
        verify(trainerRepository).saveAll(any());
    }

    @Test
    void updateTeam_replacesTrainees_whenNonEmptyList() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID))
                .thenReturn(Optional.of(team))
                .thenReturn(Optional.of(teamEntity(TEAM_ID, "soccer",
                        List.of(), List.of(traineeEntity(TEAM_ID, TRAINEE_ID)))));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));
        when(memberRepository.existsById(TRAINEE_ID)).thenReturn(true);

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setTrainees(List.of(TRAINEE_ID.toString()));
        service.updateTeam(TEAM_ID, body, TRAINER_ID, false);

        verify(traineeRepository).deleteAllById_TeamId(TEAM_ID);
        verify(traineeRepository).saveAll(any());
    }

    @Test
    void updateTeam_throwsBadRequest_whenTraineeUuidMalformed() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(trainerRepository.findAllById_TeamId(TEAM_ID))
                .thenReturn(List.of(trainerEntity(TEAM_ID, TRAINER_ID)));

        TeamPartialUpdate body = new TeamPartialUpdate();
        body.setTrainees(List.of("not-a-uuid"));

        assertThatThrownBy(() -> service.updateTeam(TEAM_ID, body, TRAINER_ID, false))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not-a-uuid");
    }

    // --- deleteTeam ---

    @Test
    void deleteTeam_throwsNotFoundException_whenAbsent() {
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteTeam(TEAM_ID, ADMIN_ID, true))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteTeam_throwsForbidden_whenTrainerTriesToDelete() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());

        assertThatThrownBy(() -> service.deleteTeam(TEAM_ID, TRAINER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void deleteTeam_allowsDelete_whenDirectorOfSport() {
        DirectorEntity director = directorEntity("soccer", DIRECTOR_ID);
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of(director));

        service.deleteTeam(TEAM_ID, DIRECTOR_ID, false);

        verify(teamRepository).delete(team);
    }

    @Test
    void deleteTeam_deletesTraineesTrainersAndTeam() {
        TeamEntity team = teamEntity(TEAM_ID, "soccer", List.of(), List.of());
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(directorRepository.findAllById_SportName("soccer"))
                .thenReturn(List.of(directorEntity("soccer", DIRECTOR_ID)));

        service.deleteTeam(TEAM_ID, DIRECTOR_ID, false);

        verify(traineeRepository).deleteAllById_TeamId(TEAM_ID);
        verify(trainerRepository).deleteAllById_TeamId(TEAM_ID);
        verify(teamRepository).delete(team);
    }
}
