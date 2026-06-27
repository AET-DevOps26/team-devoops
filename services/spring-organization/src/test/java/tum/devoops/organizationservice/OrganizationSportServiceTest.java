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
import static org.mockito.ArgumentMatchers.argThat;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

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
import tum.devoops.organizationservice.service.MemberRoleSyncService;
import tum.devoops.organizationservice.service.OrganizationSportService;

@ExtendWith(MockitoExtension.class)
class OrganizationSportServiceTest {

    @Mock
    private SportRepository sportRepository;
    @Mock
    private DirectorRepository directorRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private TrainerRepository trainerRepository;
    @Mock
    private TraineeRepository traineeRepository;
    @Mock
    private MemberRoleSyncService memberRoleSyncService;

    @InjectMocks
    private OrganizationSportService service;

    private static final UUID SPORT_ID = UUID.fromString("00000000-0000-0000-0000-000000000050");
    private static final UUID ADMIN_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID MEMBER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");

    private SportEntity sportEntity(UUID id, String name, List<DirectorEntity> directors) {
        SportEntity entity = new SportEntity();
        entity.setId(id);
        entity.setName(name);
        entity.setDescription("A test sport");
        entity.setCreatedAt(LocalDate.of(2024, 1, 1));
        entity.setDirectors(directors);
        return entity;
    }

    private DirectorEntity directorEntity(UUID sportId, UUID memberId) {
        return new DirectorEntity(new DirectorEntity.Id(sportId, memberId));
    }

    private TeamEntity teamEntity(UUID id, UUID sportId) {
        TeamEntity team = new TeamEntity();
        team.setId(id);
        team.setSportId(sportId);
        return team;
    }

    // --- getAllSports ---

    @Test
    void getAllSports_returnsEmptyList_whenNoSports() {
        when(sportRepository.findAll()).thenReturn(List.of());

        assertThat(service.getAllSports()).isEmpty();
    }

    @Test
    void getAllSports_returnsMappedList_whenSportsExist() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of(directorEntity(SPORT_ID, MEMBER_ID)));
        when(sportRepository.findAll()).thenReturn(List.of(entity));

        List<Sport> result = service.getAllSports();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(SPORT_ID);
        assertThat(result.get(0).getName()).isEqualTo("soccer");
        assertThat(result.get(0).getDirectors()).containsExactly(MEMBER_ID.toString());
    }

    // --- getSport ---

    @Test
    void getSport_returnsMappedSport_whenFound() {
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));

        Sport result = service.getSport(SPORT_ID);

        assertThat(result.getId()).isEqualTo(SPORT_ID);
        assertThat(result.getName()).isEqualTo("soccer");
        assertThat(result.getDirectors()).isEmpty();
    }

    @Test
    void getSport_throwsNotFoundException_whenAbsent() {
        when(sportRepository.findById(SPORT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getSport(SPORT_ID))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining(SPORT_ID.toString());
    }

    // --- createSport ---

    @Test
    void createSport_throwsConflict_whenNameAlreadyExists() {
        when(sportRepository.existsByName("soccer")).thenReturn(true);

        assertThatThrownBy(() -> service.createSport(new SportCreate("soccer")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("soccer");
    }

    @Test
    void createSport_throwsBadRequest_whenDirectorUuidMalformed() {
        when(sportRepository.existsByName("soccer")).thenReturn(false);

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of("not-a-uuid"));

        assertThatThrownBy(() -> service.createSport(body))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not-a-uuid");
    }

    @Test
    void createSport_throwsBadRequest_whenDirectorMemberNotFound() {
        when(sportRepository.existsByName("soccer")).thenReturn(false);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(false);

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of(MEMBER_ID.toString()));

        assertThatThrownBy(() -> service.createSport(body))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining(MEMBER_ID.toString());
    }

    @Test
    void createSport_savesEntityAndDirectors_andReturnsResult() {
        when(sportRepository.existsByName("soccer")).thenReturn(false);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(true);
        when(sportRepository.save(any(SportEntity.class))).thenAnswer(inv -> {
            SportEntity s = inv.getArgument(0);
            s.setId(SPORT_ID);
            return s;
        });
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(
                        sportEntity(SPORT_ID, "soccer", List.of(directorEntity(SPORT_ID, MEMBER_ID)))));

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of(MEMBER_ID.toString()));
        Sport result = service.createSport(body);

        verify(sportRepository).save(any(SportEntity.class));
        verify(directorRepository).saveAll(any());
        verify(memberRoleSyncService).scheduleSync(argThat(ids -> ids.contains(MEMBER_ID)));
        assertThat(result.getId()).isEqualTo(SPORT_ID);
        assertThat(result.getName()).isEqualTo("soccer");
        assertThat(result.getDirectors()).containsExactly(MEMBER_ID.toString());
    }

    @Test
    void createSport_savesEntityWithNoDirectors_whenEmptyList() {
        when(sportRepository.existsByName("soccer")).thenReturn(false);
        when(sportRepository.save(any(SportEntity.class))).thenAnswer(inv -> {
            SportEntity s = inv.getArgument(0);
            s.setId(SPORT_ID);
            return s;
        });
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));

        Sport result = service.createSport(new SportCreate("soccer"));

        verify(sportRepository).save(any(SportEntity.class));
        assertThat(result.getDirectors()).isEmpty();
    }

    // --- updateSport ---

    @Test
    void updateSport_throwsNotFoundException_whenSportAbsent() {
        when(sportRepository.findById(SPORT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateSport(SPORT_ID, new SportPartialUpdate(), MEMBER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateSport_throwsForbidden_whenNotAdminAndNotDirector() {
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));
        when(directorRepository.findAllById_SportId(SPORT_ID)).thenReturn(List.of());

        assertThatThrownBy(() -> service.updateSport(SPORT_ID, new SportPartialUpdate(), MEMBER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateSport_allowsUpdate_whenMemberIsDirector() {
        DirectorEntity director = directorEntity(SPORT_ID, MEMBER_ID);
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of(director))))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of(director))));
        when(directorRepository.findAllById_SportId(SPORT_ID)).thenReturn(List.of(director));

        Sport result = service.updateSport(SPORT_ID, new SportPartialUpdate(), MEMBER_ID, false);

        assertThat(result.getName()).isEqualTo("soccer");
    }

    @Test
    void updateSport_renamesSport_asPlainFieldUpdate() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "football", List.of())));
        when(sportRepository.existsByName("football")).thenReturn(false);

        SportPartialUpdate body = new SportPartialUpdate();
        body.setName("football");
        Sport result = service.updateSport(SPORT_ID, body, ADMIN_ID, true);

        assertThat(entity.getName()).isEqualTo("football");
        verify(sportRepository).save(entity);
        verify(directorRepository, never()).deleteAllById_SportId(any());
        assertThat(result.getName()).isEqualTo("football");
    }

    @Test
    void updateSport_throwsConflict_whenRenamingToExistingName() {
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));
        when(sportRepository.existsByName("football")).thenReturn(true);

        SportPartialUpdate body = new SportPartialUpdate();
        body.setName("football");

        assertThatThrownBy(() -> service.updateSport(SPORT_ID, body, ADMIN_ID, true))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("football");
    }

    @Test
    void updateSport_updatesDescriptionOnly_whenNoDirectorsChange_asAdmin() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));

        SportPartialUpdate body = new SportPartialUpdate();
        body.setDescription("new description");
        service.updateSport(SPORT_ID, body, ADMIN_ID, true);

        assertThat(entity.getDescription()).isEqualTo("new description");
        verify(sportRepository).save(entity);
        verify(directorRepository, never()).deleteAllById_SportId(any());
    }

    @Test
    void updateSport_doesNotReplaceDirectors_whenAdminAndNullList() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));

        service.updateSport(SPORT_ID, new SportPartialUpdate(), ADMIN_ID, true);

        verify(directorRepository, never()).deleteAllById_SportId(SPORT_ID);
        verify(directorRepository, never()).saveAll(any());
    }

    @Test
    void updateSport_clearsDirectors_whenAdminAndEmptyList() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer", List.of())));

        SportPartialUpdate body = new SportPartialUpdate();
        body.setDirectors(List.of());
        service.updateSport(SPORT_ID, body, ADMIN_ID, true);

        verify(directorRepository).deleteAllById_SportId(SPORT_ID);
        verify(directorRepository).saveAll(argThat(it -> !it.iterator().hasNext()));
    }

    @Test
    void updateSport_replacesDirectors_whenAdminAndNonEmptyList() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity(SPORT_ID, "soccer",
                        List.of(directorEntity(SPORT_ID, MEMBER_ID)))));
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(true);

        SportPartialUpdate body = new SportPartialUpdate();
        body.setDirectors(List.of(MEMBER_ID.toString()));
        service.updateSport(SPORT_ID, body, ADMIN_ID, true);

        verify(directorRepository).deleteAllById_SportId(SPORT_ID);
        verify(directorRepository).saveAll(any());
        verify(memberRoleSyncService).scheduleSync(argThat(ids -> ids.contains(MEMBER_ID)));
    }

    // --- deleteSport ---

    @Test
    void deleteSport_throwsNotFoundException_whenAbsent() {
        when(sportRepository.findById(SPORT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteSport(SPORT_ID))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteSport_deletesTrainersAndTrainees_perTeam_thenTeamsDirectorsSport() {
        UUID teamId = UUID.randomUUID();
        TeamEntity team = teamEntity(teamId, SPORT_ID);
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID)).thenReturn(Optional.of(entity));
        when(teamRepository.findAllBySportId(SPORT_ID)).thenReturn(List.of(team));

        service.deleteSport(SPORT_ID);

        verify(traineeRepository).deleteAllById_TeamId(teamId);
        verify(trainerRepository).deleteAllById_TeamId(teamId);
        verify(teamRepository).deleteAll(List.of(team));
        verify(directorRepository).deleteAllById_SportId(SPORT_ID);
        verify(sportRepository).delete(entity);
    }

    @Test
    void deleteSport_deletesDirectorsAndSport_whenNoTeams() {
        SportEntity entity = sportEntity(SPORT_ID, "soccer", List.of());
        when(sportRepository.findById(SPORT_ID)).thenReturn(Optional.of(entity));
        when(teamRepository.findAllBySportId(SPORT_ID)).thenReturn(List.of());

        service.deleteSport(SPORT_ID);

        verify(traineeRepository, never()).deleteAllById_TeamId(any());
        verify(trainerRepository, never()).deleteAllById_TeamId(any());
        verify(directorRepository).deleteAllById_SportId(SPORT_ID);
        verify(sportRepository).delete(entity);
    }
}
