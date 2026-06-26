package tum.devoops.financeservice.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tum.devoops.financeservice.converter.TransactionConverter;
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

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired TransactionRepository transactionRepository;
    @Autowired MemberRepository memberRepository;
    @Autowired DirectorRepository directorRepository;
    @Autowired TeamRepository teamRepository;
    @Autowired TrainerRepository trainerRepository;

    @Transactional
    public Transaction createTransaction(TransactionCreate transactionCreate, UUID requesterId, boolean isAdmin) {
        UUID memberId;
        try {
            memberId = UUID.fromString(transactionCreate.getMember());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid memberId format.");
        }

        if (memberRepository.findById(memberId).isEmpty()) {
            throw new NotFoundException("Member not found.");
        }

        if (!isAdmin && !isDirectorOfMember(requesterId, memberId) && !isTrainerOfMember(requesterId, memberId)) {
            throw new ForbiddenException("Only admins, directors, or trainers of a member can create transactions for them.");
        }

        TransactionEntity saved = transactionRepository.save(TransactionConverter.toEntity(transactionCreate, memberId, requesterId));
        return TransactionConverter.toTransaction(saved);
    }

    public List<Transaction> getAllTransactions(UUID requesterId, boolean isAdmin) {
        if (isAdmin) {
            return transactionRepository.findAll().stream()
                    .map(TransactionConverter::toTransaction)
                    .toList();
        }

        // Deduplicate by ID in case multiple queries return the same row.
        LinkedHashMap<UUID, TransactionEntity> seen = new LinkedHashMap<>();
        transactionRepository.findAllByMemberId(requesterId).forEach(e -> seen.put(e.getId(), e));
        transactionRepository.findAllByCreatorId(requesterId).forEach(e -> seen.put(e.getId(), e));
        for (UUID managedId : getManagedMemberIds(requesterId)) {
            transactionRepository.findAllByMemberId(managedId).forEach(e -> seen.put(e.getId(), e));
        }
        return seen.values().stream().map(TransactionConverter::toTransaction).toList();
    }

    public Transaction getTransaction(UUID transactionId, UUID requesterId, boolean isAdmin) {
        TransactionEntity entity = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found."));

        UUID memberId = entity.getMemberId();
        boolean canAccess = isAdmin
                || requesterId.equals(memberId)
                || requesterId.equals(entity.getCreatorId())
                || isDirectorOfMember(requesterId, memberId)
                || isTrainerOfMember(requesterId, memberId);

        if (!canAccess) {
            throw new ForbiddenException("Access denied.");
        }

        return TransactionConverter.toTransaction(entity);
    }

    @Transactional
    public void deleteTransaction(UUID transactionId, UUID requesterId, boolean isAdmin) {
        TransactionEntity entity = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found."));

        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Only the creator or an admin can delete this transaction.");
        }

        transactionRepository.delete(entity);
    }

    @Transactional
    public Transaction updateTransaction(UUID transactionId, TransactionPartialUpdate update, UUID requesterId, boolean isAdmin) {
        TransactionEntity entity = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found."));

        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Only the creator or an admin can update this transaction.");
        }

        if (update.getMember() != null) {
            if (!isAdmin) {
                throw new ForbiddenException("Only admins can change the member field.");
            }
            UUID newMemberId;
            try {
                newMemberId = UUID.fromString(update.getMember());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid memberId format.");
            }
            if (memberRepository.findById(newMemberId).isEmpty()) {
                throw new NotFoundException("Member not found.");
            }
            entity.setMemberId(newMemberId);
        }

        if (update.getAmountCents() != null) entity.setAmountCents(update.getAmountCents());
        if (update.getTitle() != null) entity.setTitle(update.getTitle());
        if (update.getDescription() != null) entity.setDescription(update.getDescription());

        return TransactionConverter.toTransaction(transactionRepository.save(entity));
    }

    public List<Balance> getAllBalances(UUID requesterId, boolean isAdmin) {
        List<TransactionEntity> transactions;
        if (isAdmin) {
            transactions = transactionRepository.findAll();
        } else {
            List<UUID> managedIds = getManagedMemberIds(requesterId);
            if (managedIds.isEmpty()) {
                throw new ForbiddenException("Only admins, directors, or trainers can view all balances.");
            }
            LinkedHashMap<UUID, TransactionEntity> seen = new LinkedHashMap<>();
            for (UUID memberId : managedIds) {
                transactionRepository.findAllByMemberId(memberId).forEach(e -> seen.put(e.getId(), e));
            }
            transactions = List.copyOf(seen.values());
        }

        return transactions.stream()
                .collect(Collectors.groupingBy(
                        TransactionEntity::getMemberId,
                        Collectors.summingInt(TransactionEntity::getAmountCents)))
                .entrySet().stream()
                .map(e -> new Balance(e.getKey().toString(), e.getValue()))
                .toList();
    }

    public Balance getMemberBalance(UUID memberId, UUID requesterId, boolean isAdmin) {
        if (memberRepository.findById(memberId).isEmpty()) {
            throw new NotFoundException("Member not found.");
        }

        boolean canAccess = isAdmin
                || requesterId.equals(memberId)
                || isDirectorOfMember(requesterId, memberId)
                || isTrainerOfMember(requesterId, memberId);

        if (!canAccess) {
            throw new ForbiddenException("Access denied.");
        }

        int balance = transactionRepository.findAllByMemberId(memberId).stream()
                .mapToInt(TransactionEntity::getAmountCents)
                .sum();

        return new Balance(memberId.toString(), balance);
    }

    // Returns distinct IDs of all members the requester can manage (as director or trainer).
    private List<UUID> getManagedMemberIds(UUID requesterId) {
        Set<UUID> ids = new LinkedHashSet<>();
        for (String sport : directorRepository.findSportNamesByMemberId(requesterId)) {
            teamRepository.findTraineesBySportName(sport).stream()
                    .map(t -> t.getId().getMemberId())
                    .forEach(ids::add);
        }
        for (UUID teamId : trainerRepository.findTeamIdByMemberId(requesterId)) {
            teamRepository.findById(teamId).ifPresent(team ->
                    teamRepository.findTraineesByTeamId(team.getId()).stream()
                            .map(t -> t.getId().getMemberId())
                            .forEach(ids::add));
        }
        return List.copyOf(ids);
    }

    private boolean isDirectorOfMember(UUID requesterId, UUID memberId) {
        for (String sport : directorRepository.findSportNamesByMemberId(requesterId)) {
            boolean found = teamRepository.findTraineesBySportName(sport).stream()
                    .map(t -> t.getId().getMemberId())
                    .anyMatch(memberId::equals);
            if (found) return true;
        }
        return false;
    }

    private boolean isTrainerOfMember(UUID requesterId, UUID memberId) {
        for (UUID teamId : trainerRepository.findTeamIdByMemberId(requesterId)) {
            Optional<TeamEntity> team = teamRepository.findById(teamId);
            if (team.isPresent()) {
                boolean found = teamRepository.findTraineesByTeamId(team.get().getId()).stream()
                        .map(TraineeEntity::getId)
                        .map(TraineeEntity.Id::getMemberId)
                        .anyMatch(memberId::equals);
                if (found) return true;
            }
        }
        return false;
    }
}
