package tum.devoops.organizationservice;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import tum.devoops.organizationservice.entity.DirectorEntity;
import tum.devoops.organizationservice.entity.TraineeEntity;
import tum.devoops.organizationservice.entity.TrainerEntity;
import tum.devoops.organizationservice.repository.DirectorRepository;
import tum.devoops.organizationservice.repository.TraineeRepository;
import tum.devoops.organizationservice.repository.TrainerRepository;
import tum.devoops.organizationservice.service.KeycloakRoleService;
import tum.devoops.organizationservice.service.MemberRoleSyncService;

/**
 * Recompute logic of {@link MemberRoleSyncService}. Exercised via the public
 * {@code scheduleSync}, which runs the sync inline when no transaction is active.
 */
@ExtendWith(MockitoExtension.class)
class MemberRoleSyncServiceTest {

    @Mock
    private TrainerRepository trainerRepository;
    @Mock
    private DirectorRepository directorRepository;
    @Mock
    private TraineeRepository traineeRepository;
    @Mock
    private KeycloakRoleService keycloakRoleService;

    @InjectMocks
    private MemberRoleSyncService service;

    private static final UUID MEMBER = UUID.fromString("00000000-0000-0000-0000-000000000007");
    private static final UUID TEAM = UUID.fromString("00000000-0000-0000-0000-000000000010");

    private TrainerEntity trainer(UUID memberId) {
        return new TrainerEntity(new TrainerEntity.Id(TEAM, memberId));
    }

    private TraineeEntity trainee(UUID memberId) {
        return new TraineeEntity(new TraineeEntity.Id(TEAM, memberId));
    }

    private DirectorEntity director(UUID memberId) {
        return new DirectorEntity(new DirectorEntity.Id("soccer", memberId));
    }

    @Test
    void desiresCoach_whenTrainerRowExists() {
        when(trainerRepository.findAllById_MemberId(MEMBER)).thenReturn(List.of(trainer(MEMBER)));

        service.scheduleSync(List.of(MEMBER));

        verify(keycloakRoleService).reconcile(MEMBER, Set.of("Coach"));
    }

    @Test
    void desiresAllThree_whenMemberHoldsEveryRole() {
        when(trainerRepository.findAllById_MemberId(MEMBER)).thenReturn(List.of(trainer(MEMBER)));
        when(directorRepository.findAllById_MemberId(MEMBER)).thenReturn(List.of(director(MEMBER)));
        when(traineeRepository.findAllById_MemberId(MEMBER)).thenReturn(List.of(trainee(MEMBER)));

        service.scheduleSync(List.of(MEMBER));

        verify(keycloakRoleService).reconcile(MEMBER, Set.of("Coach", "Director", "Trainee"));
    }

    @Test
    void desiresEmpty_whenMemberHoldsNoRole() {
        // All repositories return empty by default (Mockito) => no managed roles.
        service.scheduleSync(List.of(MEMBER));

        verify(keycloakRoleService).reconcile(MEMBER, Set.of());
    }

    @Test
    void keepsCoach_whenStillTrainerOfAnotherTeam() {
        // The member was removed from one team but still trains another, so a trainer
        // row remains => Coach stays in the desired set.
        when(trainerRepository.findAllById_MemberId(MEMBER))
                .thenReturn(List.of(new TrainerEntity(
                        new TrainerEntity.Id(UUID.randomUUID(), MEMBER))));

        service.scheduleSync(List.of(MEMBER));

        verify(keycloakRoleService).reconcile(MEMBER, Set.of("Coach"));
    }

    @Test
    void doesNothing_whenNoMembers() {
        service.scheduleSync(List.of());

        verifyNoInteractions(keycloakRoleService);
    }
}
