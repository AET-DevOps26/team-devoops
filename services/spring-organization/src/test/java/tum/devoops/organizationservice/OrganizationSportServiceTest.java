package tum.devoops.organizationservice;

import java.time.LocalDate;
import java.util.ArrayList;
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

    private static final UUID ADMIN_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID MEMBER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");

    private SportEntity sportEntity(String name, List<DirectorEntity> directors) {
        SportEntity entity = new SportEntity();
        entity.setName(name);
        entity.setDescription("A test sport");
        entity.setCreatedAt(LocalDate.of(2024, 1, 1));
        entity.setDirectors(directors);
        return entity;
    }

    private DirectorEntity directorEntity(String sportName, UUID memberId) {
        return new DirectorEntity(new DirectorEntity.Id(sportName, memberId));
    }

    private TeamEntity teamEntity(UUID id, String sportName) {
        TeamEntity team = new TeamEntity();
        team.setId(id);
        team.setSportName(sportName);
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
        UUID dirId = UUID.randomUUID();
        SportEntity entity = sportEntity("soccer", List.of(directorEntity("soccer", dirId)));
        when(sportRepository.findAll()).thenReturn(List.of(entity));

        List<Sport> result = service.getAllSports();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("soccer");
        assertThat(result.get(0).getDescription()).isEqualTo("A test sport");
        assertThat(result.get(0).getCreatedAt()).isEqualTo(LocalDate.of(2024, 1, 1));
        assertThat(result.get(0).getDirectors()).containsExactly(dirId.toString());
    }

    // --- getSport ---

    @Test
    void getSport_returnsMappedSport_whenFound() {
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));

        Sport result = service.getSport("soccer");

        assertThat(result.getName()).isEqualTo("soccer");
        assertThat(result.getDirectors()).isEmpty();
    }

    @Test
    void getSport_throwsNotFoundException_whenAbsent() {
        when(sportRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getSport("unknown"))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("unknown");
    }

    // --- createSport ---

    @Test
    void createSport_throwsConflict_whenNameAlreadyExists() {
        when(sportRepository.existsById("soccer")).thenReturn(true);

        assertThatThrownBy(() -> service.createSport(new SportCreate("soccer")))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("soccer");
    }

    @Test
    void createSport_throwsBadRequest_whenDirectorUuidMalformed() {
        when(sportRepository.existsById("soccer")).thenReturn(false);

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of("not-a-uuid"));

        assertThatThrownBy(() -> service.createSport(body))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not-a-uuid");
    }

    @Test
    void createSport_throwsBadRequest_whenDirectorMemberNotFound() {
        when(sportRepository.existsById("soccer")).thenReturn(false);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(false);

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of(MEMBER_ID.toString()));

        assertThatThrownBy(() -> service.createSport(body))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining(MEMBER_ID.toString());
    }

    @Test
    void createSport_savesEntityAndDirectors_andReturnsResult() {
        when(sportRepository.existsById("soccer")).thenReturn(false);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(true);
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(
                        sportEntity("soccer", List.of(directorEntity("soccer", MEMBER_ID)))));

        SportCreate body = new SportCreate("soccer");
        body.setDirectors(List.of(MEMBER_ID.toString()));
        Sport result = service.createSport(body);

        verify(sportRepository).save(any(SportEntity.class));
        verify(directorRepository).saveAll(any());
        verify(memberRoleSyncService).scheduleSync(argThat(ids -> ids.contains(MEMBER_ID)));
        assertThat(result.getName()).isEqualTo("soccer");
        assertThat(result.getDirectors()).containsExactly(MEMBER_ID.toString());
    }

    @Test
    void createSport_savesEntityWithNoDirectors_whenEmptyList() {
        when(sportRepository.existsById("soccer")).thenReturn(false);
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));

        Sport result = service.createSport(new SportCreate("soccer"));

        verify(sportRepository).save(any(SportEntity.class));
        assertThat(result.getDirectors()).isEmpty();
    }

    // --- updateSport ---

    @Test
    void updateSport_throwsNotFoundException_whenSportAbsent() {
        when(sportRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateSport("unknown", new SportPartialUpdate(), MEMBER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateSport_throwsForbidden_whenNotAdminAndNotDirector() {
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());

        assertThatThrownBy(() -> service.updateSport("soccer", new SportPartialUpdate(), MEMBER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateSport_allowsUpdate_whenMemberIsDirector() {
        DirectorEntity director = directorEntity("soccer", MEMBER_ID);
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of(director))))
                .thenReturn(Optional.of(sportEntity("soccer", List.of(director))));
        when(directorRepository.findAllById_SportName("soccer"))
                .thenReturn(List.of(director));

        Sport result = service.updateSport("soccer", new SportPartialUpdate(), MEMBER_ID, false);

        assertThat(result.getName()).isEqualTo("soccer");
    }

    @Test
    void updateSport_updatesDescriptionOnly_whenNoNameChange_asAdmin() {
        SportEntity entity = sportEntity("soccer", List.of());
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));

        SportPartialUpdate body = new SportPartialUpdate();
        body.setDescription("new description");
        service.updateSport("soccer", body, ADMIN_ID, true);

        verify(sportRepository).save(entity);
        verify(directorRepository, never()).deleteAllById_SportName(any());
    }

    @Test
    void updateSport_doesNotReplaceDirectors_whenAdminAndEmptyList() {
        SportEntity entity = sportEntity("soccer", List.of());
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));

        service.updateSport("soccer", new SportPartialUpdate(), ADMIN_ID, true);

        verify(directorRepository, never()).deleteAllById_SportName("soccer");
        verify(directorRepository, never()).saveAll(any());
    }

    @Test
    void updateSport_replacesDirectors_whenAdminAndNonEmptyList() {
        SportEntity entity = sportEntity("soccer", List.of());
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(entity))
                .thenReturn(Optional.of(sportEntity("soccer",
                        List.of(directorEntity("soccer", MEMBER_ID)))));
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(true);

        SportPartialUpdate body = new SportPartialUpdate();
        body.setDirectors(List.of(MEMBER_ID.toString()));
        service.updateSport("soccer", body, ADMIN_ID, true);

        verify(directorRepository).deleteAllById_SportName("soccer");
        verify(directorRepository).saveAll(any());
    }

    @Test
    void updateSport_throwsConflict_whenRenamingToExistingName() {
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(sportRepository.existsById("football")).thenReturn(true);

        SportPartialUpdate body = new SportPartialUpdate();
        body.setName("football");

        assertThatThrownBy(() -> service.updateSport("soccer", body, ADMIN_ID, true))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("football");
    }

    @Test
    void updateSport_renamesSport_migratesTeamsAndDirectors() {
        UUID dirId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();
        DirectorEntity oldDirector = directorEntity("soccer", dirId);
        TeamEntity team = teamEntity(teamId, "soccer");

        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of(oldDirector))));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of(oldDirector));
        when(teamRepository.findAllBySportName("soccer")).thenReturn(List.of(team));
        when(sportRepository.existsById("football")).thenReturn(false);
        when(sportRepository.findById("football"))
                .thenReturn(Optional.of(
                        sportEntity("football", List.of(directorEntity("football", dirId)))));

        SportPartialUpdate body = new SportPartialUpdate();
        body.setName("football");
        Sport result = service.updateSport("soccer", body, ADMIN_ID, true);

        verify(sportRepository).save(argThat(e -> "football".equals(e.getName())));
        verify(teamRepository).saveAll(any());
        verify(directorRepository).deleteAllById_SportName("soccer");
        verify(directorRepository).saveAll(argThat(it -> {
            List<DirectorEntity> saved = new ArrayList<>();
            it.forEach(saved::add);
            return !saved.isEmpty() && "football".equals(saved.get(0).getId().getSportName());
        }));
        verify(sportRepository).delete(any(SportEntity.class));
        assertThat(result.getName()).isEqualTo("football");
    }

    @Test
    void updateSport_replacesDirectors_whenRenaming_andAdminProvidesNewList() {
        UUID newDirId = UUID.randomUUID();
        when(sportRepository.findById("soccer"))
                .thenReturn(Optional.of(sportEntity("soccer", List.of())));
        when(directorRepository.findAllById_SportName("soccer")).thenReturn(List.of());
        when(sportRepository.existsById("football")).thenReturn(false);
        when(memberRepository.existsById(newDirId)).thenReturn(true);
        when(sportRepository.findById("football"))
                .thenReturn(Optional.of(
                        sportEntity("football", List.of(directorEntity("football", newDirId)))));

        SportPartialUpdate body = new SportPartialUpdate();
        body.setName("football");
        body.setDirectors(List.of(newDirId.toString()));
        Sport result = service.updateSport("soccer", body, ADMIN_ID, true);

        verify(directorRepository).saveAll(argThat(it -> {
            List<DirectorEntity> saved = new ArrayList<>();
            it.forEach(saved::add);
            return saved.stream().anyMatch(d -> newDirId.equals(d.getId().getMemberId()));
        }));
        assertThat(result.getDirectors()).containsExactly(newDirId.toString());
    }

    // --- deleteSport ---

    @Test
    void deleteSport_throwsNotFoundException_whenAbsent() {
        when(sportRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteSport("unknown"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteSport_deletesTrainersAndTrainees_perTeam_thenTeamsDirectorsSport() {
        UUID teamId = UUID.randomUUID();
        TeamEntity team = teamEntity(teamId, "soccer");
        SportEntity entity = sportEntity("soccer", List.of());
        when(sportRepository.findById("soccer")).thenReturn(Optional.of(entity));
        when(teamRepository.findAllBySportName("soccer")).thenReturn(List.of(team));

        service.deleteSport("soccer");

        verify(traineeRepository).deleteAllById_TeamId(teamId);
        verify(trainerRepository).deleteAllById_TeamId(teamId);
        verify(teamRepository).deleteAll(List.of(team));
        verify(directorRepository).deleteAllById_SportName("soccer");
        verify(sportRepository).delete(entity);
    }

    @Test
    void deleteSport_deletesDirectorsAndSport_whenNoTeams() {
        SportEntity entity = sportEntity("soccer", List.of());
        when(sportRepository.findById("soccer")).thenReturn(Optional.of(entity));
        when(teamRepository.findAllBySportName("soccer")).thenReturn(List.of());

        service.deleteSport("soccer");

        verify(traineeRepository, never()).deleteAllById_TeamId(any());
        verify(trainerRepository, never()).deleteAllById_TeamId(any());
        verify(directorRepository).deleteAllById_SportName("soccer");
        verify(sportRepository).delete(entity);
    }
}
