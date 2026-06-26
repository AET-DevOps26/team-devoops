package tum.devoops.financeservice;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tum.devoops.financeservice.entity.MemberEntity;
import tum.devoops.financeservice.entity.TeamEntity;
import tum.devoops.financeservice.entity.TraineeEntity;
import tum.devoops.financeservice.entity.TransactionEntity;
import tum.devoops.financeservice.exception.BadRequestException;
import tum.devoops.financeservice.exception.ForbiddenException;
import tum.devoops.financeservice.exception.NotFoundException;
import tum.devoops.financeservice.model.Transaction;
import tum.devoops.financeservice.model.TransactionCreate;
import tum.devoops.financeservice.repository.DirectorRepository;
import tum.devoops.financeservice.repository.MemberRepository;
import tum.devoops.financeservice.repository.TeamRepository;
import tum.devoops.financeservice.repository.TrainerRepository;
import tum.devoops.financeservice.repository.TransactionRepository;
import tum.devoops.financeservice.service.TransactionService;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock TransactionRepository transactionRepository;
    @Mock MemberRepository memberRepository;
    @Mock DirectorRepository directorRepository;
    @Mock TeamRepository teamRepository;
    @Mock TrainerRepository trainerRepository;

    @InjectMocks
    TransactionService service;

    private static final UUID REQUESTER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID MEMBER_ID    = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID TEAM_ID      = UUID.fromString("00000000-0000-0000-0000-000000000003");
    private static final UUID TX_ID        = UUID.fromString("00000000-0000-0000-0000-000000000099");

    // ── createTransaction: input validation ───────────────────────────────────

    @Test
    void createTransaction_invalidMemberUuid_throwsBadRequest() {
        assertThrows(BadRequestException.class,
                () -> service.createTransaction(new TransactionCreate("not-a-uuid", 500, "Test"), REQUESTER_ID, false));
    }

    @Test
    void createTransaction_memberNotFound_throwsNotFoundException() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    // ── createTransaction: authorization ─────────────────────────────────────

    @Test
    void createTransaction_neitherDirectorNorTrainerNorAdmin_throwsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransaction_adminPassesAuthWithoutDirectorOrTrainerRole() {
        // isAdmin=true short-circuits the director/trainer checks entirely.
        memberExists();
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(TX_ID);
        assertThat(result.getMember()).isEqualTo(MEMBER_ID.toString());
        assertThat(result.getCreator()).isEqualTo(REQUESTER_ID.toString());
    }

    @Test
    void createTransaction_asDirectorOfMembersTeam_returnsCreatedTransaction() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("tennis"));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
        assertThat(result.getAmountCents()).isEqualTo(500);
    }

    @Test
    void createTransaction_asTrainerOfMembersTeam_returnsCreatedTransaction() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(mockTeam(TEAM_ID)));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    // ── isDirectorOfMember edge cases ─────────────────────────────────────────

    @Test
    void createTransaction_directorOfDifferentSport_throwsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("football"));
        when(teamRepository.findTraineesBySportName("football")).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransaction_directorOfMultipleSports_findsMemberInSecondSport() {
        memberExists();
        UUID otherMemberId = UUID.randomUUID();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("football", "tennis"));
        when(teamRepository.findTraineesBySportName("football")).thenReturn(List.of(trainee(otherMemberId)));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(MEMBER_ID)));
        // Short-circuits at director — trainer check never reached.
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    // ── isTrainerOfMember edge cases ──────────────────────────────────────────

    @Test
    void createTransaction_trainerButMemberOnDifferentTeam_throwsForbidden() {
        memberExists();
        UUID otherMemberId = UUID.randomUUID();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(mockTeam(TEAM_ID)));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(otherMemberId)));

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransaction_trainerTeamNotInDatabase_throwsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransaction_trainerOnMultipleTeams_findsMemberInSecondTeam() {
        memberExists();
        UUID otherTeamId = UUID.fromString("00000000-0000-0000-0000-000000000004");
        UUID otherMemberId = UUID.randomUUID();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID, otherTeamId));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(mockTeam(TEAM_ID)));
        when(teamRepository.findById(otherTeamId)).thenReturn(Optional.of(mockTeam(otherTeamId)));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(otherMemberId)));
        when(teamRepository.findTraineesByTeamId(otherTeamId)).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private TransactionCreate validRequest() {
        return new TransactionCreate(MEMBER_ID.toString(), 500, "Membership fee");
    }

    private void memberExists() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.of(new MemberEntity()));
    }

    private TransactionEntity savedEntity() {
        TransactionEntity e = new TransactionEntity();
        e.setId(TX_ID);
        e.setMemberId(MEMBER_ID);
        e.setCreatorId(REQUESTER_ID);
        e.setAmountCents(500);
        e.setCreatedAt(Instant.now());
        e.setTitle("Membership fee");
        e.setDescription("");
        return e;
    }

    private TraineeEntity trainee(UUID memberId) {
        return new TraineeEntity(new TraineeEntity.Id(TEAM_ID, memberId));
    }

    private TeamEntity mockTeam(UUID teamId) {
        TeamEntity team = mock(TeamEntity.class);
        when(team.getId()).thenReturn(teamId);
        return team;
    }
}
