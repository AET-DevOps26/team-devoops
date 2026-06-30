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
import tum.devoops.financeservice.model.Balance;
import tum.devoops.financeservice.model.Transaction;
import tum.devoops.financeservice.model.TransactionCreate;
import tum.devoops.financeservice.model.TransactionPartialUpdate;
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
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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
    void createTransactionInvalidMemberUuidThrowsBadRequest() {
        assertThrows(BadRequestException.class,
                () -> service.createTransaction(new TransactionCreate("not-a-uuid", 500, "Test"), REQUESTER_ID, false));
    }

    @Test
    void createTransactionMemberNotFoundThrowsNotFoundException() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    // ── createTransaction: authorization ─────────────────────────────────────

    @Test
    void createTransactionNeitherDirectorNorTrainerNorAdminThrowsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransactionAdminPassesAuthWithoutDirectorOrTrainerRole() {
        // isAdmin=true short-circuits the director/trainer checks entirely.
        memberExists();
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(TX_ID);
        assertThat(result.getMember().getId()).isEqualTo(MEMBER_ID);
        assertThat(result.getCreator().getId()).isEqualTo(REQUESTER_ID);
    }

    @Test
    void createTransactionAsDirectorOfMembersTeamReturnsCreatedTransaction() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("tennis"));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
        assertThat(result.getAmountCents()).isEqualTo(500);
    }

    @Test
    void createTransactionAsTrainerOfMembersTeamReturnsCreatedTransaction() {
        memberExists();
        TeamEntity team = mockTeam(TEAM_ID);
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    // ── isDirectorOfMember edge cases ─────────────────────────────────────────

    @Test
    void createTransactionDirectorOfDifferentSportThrowsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("football"));
        when(teamRepository.findTraineesBySportName("football")).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransactionDirectorOfMultipleSportsFindsMemberInSecondSport() {
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
    void createTransactionTrainerButMemberOnDifferentTeamThrowsForbidden() {
        memberExists();
        UUID otherMemberId = UUID.randomUUID();
        TeamEntity team = mockTeam(TEAM_ID);
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(otherMemberId)));

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransactionTrainerTeamNotInDatabaseThrowsForbidden() {
        memberExists();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.empty());

        assertThrows(ForbiddenException.class,
                () -> service.createTransaction(validRequest(), REQUESTER_ID, false));
    }

    @Test
    void createTransactionTrainerOnMultipleTeamsFindsMemberInSecondTeam() {
        memberExists();
        UUID otherTeamId = UUID.fromString("00000000-0000-0000-0000-000000000004");
        UUID otherMemberId = UUID.randomUUID();
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        TeamEntity team1 = mockTeam(TEAM_ID);
        TeamEntity team2 = mockTeam(otherTeamId);
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of(TEAM_ID, otherTeamId));
        when(teamRepository.findById(TEAM_ID)).thenReturn(Optional.of(team1));
        when(teamRepository.findById(otherTeamId)).thenReturn(Optional.of(team2));
        when(teamRepository.findTraineesByTeamId(TEAM_ID)).thenReturn(List.of(trainee(otherMemberId)));
        when(teamRepository.findTraineesByTeamId(otherTeamId)).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.save(any())).thenReturn(savedEntity());

        Transaction result = service.createTransaction(validRequest(), REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    // ── getAllTransactions ────────────────────────────────────────────────────

    @Test
    void getAllTransactionsAsAdminReturnsAll() {
        when(transactionRepository.findAll()).thenReturn(List.of(
                txEntity(TX_ID, MEMBER_ID, REQUESTER_ID, 500),
                txEntity(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), 100)));

        List<Transaction> result = service.getAllTransactions(REQUESTER_ID, true);

        assertThat(result).hasSize(2);
    }

    @Test
    void getAllTransactionsAsNonAdminReturnsOwnAndManagedDeduplicated() {
        UUID managedMemberId = UUID.fromString("00000000-0000-0000-0000-0000000000aa");
        UUID asMemberTxId = UUID.fromString("00000000-0000-0000-0000-0000000000a1");
        UUID asCreatorTxId = UUID.fromString("00000000-0000-0000-0000-0000000000a2");
        UUID managedTxId = UUID.fromString("00000000-0000-0000-0000-0000000000a3");

        // Requester is a director of "tennis", which contains managedMemberId.
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("tennis"));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(managedMemberId)));
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        TransactionEntity asMember = txEntity(asMemberTxId, REQUESTER_ID, UUID.randomUUID(), 100);
        TransactionEntity asCreator = txEntity(asCreatorTxId, UUID.randomUUID(), REQUESTER_ID, 200);
        TransactionEntity managed = txEntity(managedTxId, managedMemberId, UUID.randomUUID(), 300);

        when(transactionRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of(asMember));
        when(transactionRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of(asCreator, asMember));
        when(transactionRepository.findAllByMemberId(managedMemberId)).thenReturn(List.of(managed));

        List<Transaction> result = service.getAllTransactions(REQUESTER_ID, false);

        // asMember appears via both queries but must be returned once.
        assertThat(result).extracting(Transaction::getId)
                .containsExactlyInAnyOrder(asMemberTxId, asCreatorTxId, managedTxId);
    }

    @Test
    void getAllTransactionsAsNonAdminWithNothingReturnsEmpty() {
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(transactionRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(transactionRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of());

        assertThat(service.getAllTransactions(REQUESTER_ID, false)).isEmpty();
    }

    // ── getTransaction ────────────────────────────────────────────────────────

    @Test
    void getTransactionNotFoundThrowsNotFoundException() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.getTransaction(TX_ID, REQUESTER_ID, false));
    }

    @Test
    void getTransactionAsAdminReturnsAnyTransaction() {
        UUID otherMember = UUID.randomUUID();
        UUID otherCreator = UUID.randomUUID();
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, otherMember, otherCreator, 500)));

        Transaction result = service.getTransaction(TX_ID, REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(TX_ID);
    }

    @Test
    void getTransactionAsMemberSubjectSucceeds() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, REQUESTER_ID, UUID.randomUUID(), 500)));

        assertThat(service.getTransaction(TX_ID, REQUESTER_ID, false).getId()).isEqualTo(TX_ID);
    }

    @Test
    void getTransactionAsCreatorSucceeds() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, UUID.randomUUID(), REQUESTER_ID, 500)));

        assertThat(service.getTransaction(TX_ID, REQUESTER_ID, false).getId()).isEqualTo(TX_ID);
    }

    @Test
    void getTransactionAsUnrelatedUserThrowsForbidden() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class, () -> service.getTransaction(TX_ID, REQUESTER_ID, false));
    }

    // ── deleteTransaction ─────────────────────────────────────────────────────

    @Test
    void deleteTransactionNotFoundThrowsNotFoundException() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.deleteTransaction(TX_ID, REQUESTER_ID, false));
    }

    @Test
    void deleteTransactionAsCreatorSucceeds() {
        TransactionEntity entity = txEntity(TX_ID, MEMBER_ID, REQUESTER_ID, 500);
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(entity));

        service.deleteTransaction(TX_ID, REQUESTER_ID, false);

        verify(transactionRepository).delete(entity);
    }

    @Test
    void deleteTransactionAsAdminSucceeds() {
        TransactionEntity entity = txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500);
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(entity));

        service.deleteTransaction(TX_ID, REQUESTER_ID, true);

        verify(transactionRepository).delete(entity);
    }

    @Test
    void deleteTransactionAsNonCreatorThrowsForbidden() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));

        assertThrows(ForbiddenException.class, () -> service.deleteTransaction(TX_ID, REQUESTER_ID, false));
        verify(transactionRepository, never()).delete(any());
    }

    // ── updateTransaction ─────────────────────────────────────────────────────

    @Test
    void updateTransactionNotFoundThrowsNotFoundException() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.updateTransaction(TX_ID, new TransactionPartialUpdate().title("x"), REQUESTER_ID, false));
    }

    @Test
    void updateTransactionAsNonCreatorThrowsForbidden() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));

        assertThrows(ForbiddenException.class,
                () -> service.updateTransaction(TX_ID, new TransactionPartialUpdate().title("x"), REQUESTER_ID, false));
    }

    @Test
    void updateTransactionAsCreatorUpdatesEditableFields() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, REQUESTER_ID, 500)));
        when(transactionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = service.updateTransaction(TX_ID,
                new TransactionPartialUpdate().amountCents(999).title("Updated").description("note"),
                REQUESTER_ID, false);

        assertThat(result.getAmountCents()).isEqualTo(999);
        assertThat(result.getTitle()).isEqualTo("Updated");
        assertThat(result.getDescription()).isEqualTo("note");
        assertThat(result.getMember().getId()).isEqualTo(MEMBER_ID);
    }

    @Test
    void updateTransactionCreatorChangingMemberThrowsForbidden() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, REQUESTER_ID, 500)));

        assertThrows(ForbiddenException.class,
                () -> service.updateTransaction(TX_ID,
                        new TransactionPartialUpdate().member(UUID.randomUUID().toString()), REQUESTER_ID, false));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void updateTransactionAdminChangesMemberToExistingMember() {
        UUID newMemberId = UUID.fromString("00000000-0000-0000-0000-0000000000bb");
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));
        when(memberRepository.findById(newMemberId)).thenReturn(Optional.of(new MemberEntity()));
        when(transactionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = service.updateTransaction(TX_ID,
                new TransactionPartialUpdate().member(newMemberId.toString()), REQUESTER_ID, true);

        assertThat(result.getMember().getId()).isEqualTo(newMemberId);
    }

    @Test
    void updateTransactionAdminChangesMemberWithInvalidUuidThrowsBadRequest() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));

        assertThrows(BadRequestException.class,
                () -> service.updateTransaction(TX_ID,
                        new TransactionPartialUpdate().member("not-a-uuid"), REQUESTER_ID, true));
    }

    @Test
    void updateTransactionAdminChangesMemberToNonExistentMemberThrowsNotFound() {
        UUID newMemberId = UUID.fromString("00000000-0000-0000-0000-0000000000cc");
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, UUID.randomUUID(), 500)));
        when(memberRepository.findById(newMemberId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.updateTransaction(TX_ID,
                        new TransactionPartialUpdate().member(newMemberId.toString()), REQUESTER_ID, true));
    }

    @Test
    void updateTransactionWithAllNullFieldsLeavesEntityUnchanged() {
        when(transactionRepository.findById(TX_ID)).thenReturn(Optional.of(txEntity(TX_ID, MEMBER_ID, REQUESTER_ID, 500)));
        when(transactionRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Transaction result = service.updateTransaction(TX_ID, new TransactionPartialUpdate(), REQUESTER_ID, false);

        assertThat(result.getAmountCents()).isEqualTo(500);
        assertThat(result.getTitle()).isEqualTo("Membership fee");
        assertThat(result.getMember().getId()).isEqualTo(MEMBER_ID);
    }

    // ── getAllBalances ────────────────────────────────────────────────────────

    @Test
    void getAllBalancesAsAdminSumsTransactionsPerMember() {
        UUID otherMember = UUID.fromString("00000000-0000-0000-0000-0000000000dd");
        when(transactionRepository.findAll()).thenReturn(List.of(
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 100),
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 200),
                txEntity(UUID.randomUUID(), otherMember, REQUESTER_ID, 50)));

        List<Balance> result = service.getAllBalances(REQUESTER_ID, true);

        assertThat(result).extracting(b -> b.getMember().getId(), Balance::getBalanceCents)
                .containsExactlyInAnyOrder(
                        tuple(MEMBER_ID, 300),
                        tuple(otherMember, 50));
    }

    @Test
    void getAllBalancesAsNonAdminWithNoManagedMembersThrowsForbidden() {
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class, () -> service.getAllBalances(REQUESTER_ID, false));
    }

    @Test
    void getAllBalancesAsDirectorSumsManagedMembersOnly() {
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("tennis"));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(MEMBER_ID)));
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(transactionRepository.findAllByMemberId(MEMBER_ID)).thenReturn(List.of(
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 100),
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, -30)));

        List<Balance> result = service.getAllBalances(REQUESTER_ID, false);

        assertThat(result).extracting(b -> b.getMember().getId(), Balance::getBalanceCents)
                .containsExactly(tuple(MEMBER_ID, 70));
    }

    // ── getMemberBalance ──────────────────────────────────────────────────────

    @Test
    void getMemberBalanceMemberNotFoundThrowsNotFoundException() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.getMemberBalance(MEMBER_ID, REQUESTER_ID, false));
    }

    @Test
    void getMemberBalanceAsSelfReturnsSum() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.of(new MemberEntity()));
        when(transactionRepository.findAllByMemberId(MEMBER_ID)).thenReturn(List.of(
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 100),
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 250)));

        Balance result = service.getMemberBalance(MEMBER_ID, MEMBER_ID, false);

        assertThat(result.getMember().getId()).isEqualTo(MEMBER_ID);
        assertThat(result.getBalanceCents()).isEqualTo(350);
    }

    @Test
    void getMemberBalanceAsAdminReturnsSum() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.of(new MemberEntity()));
        when(transactionRepository.findAllByMemberId(MEMBER_ID)).thenReturn(List.of(
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 500)));

        assertThat(service.getMemberBalance(MEMBER_ID, REQUESTER_ID, true).getBalanceCents()).isEqualTo(500);
    }

    @Test
    void getMemberBalanceAsDirectorOfMemberReturnsSum() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.of(new MemberEntity()));
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of("tennis"));
        when(teamRepository.findTraineesBySportName("tennis")).thenReturn(List.of(trainee(MEMBER_ID)));
        when(transactionRepository.findAllByMemberId(MEMBER_ID)).thenReturn(List.of(
                txEntity(UUID.randomUUID(), MEMBER_ID, REQUESTER_ID, 42)));

        assertThat(service.getMemberBalance(MEMBER_ID, REQUESTER_ID, false).getBalanceCents()).isEqualTo(42);
    }

    @Test
    void getMemberBalanceAsUnrelatedUserThrowsForbidden() {
        when(memberRepository.findById(MEMBER_ID)).thenReturn(Optional.of(new MemberEntity()));
        when(directorRepository.findSportNamesByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findTeamIdByMemberId(REQUESTER_ID)).thenReturn(List.of());

        assertThrows(ForbiddenException.class, () -> service.getMemberBalance(MEMBER_ID, REQUESTER_ID, false));
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private TransactionEntity txEntity(UUID id, UUID memberId, UUID creatorId, int amountCents) {
        TransactionEntity e = new TransactionEntity();
        e.setId(id);
        e.setMemberId(memberId);
        e.setCreatorId(creatorId);
        e.setAmountCents(amountCents);
        e.setCreatedAt(Instant.now());
        e.setTitle("Membership fee");
        e.setDescription("");
        return e;
    }

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
