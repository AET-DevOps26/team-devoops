package tum.devoops.financeservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.financeservice.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    // SELECT * FROM finance.transactions WHERE member_id = ?
    List<Transaction> findAllByMemberId(UUID memberId);

    // SELECT * FROM finance.transactions WHERE creator_id = ?
    List<Transaction> findAllByCreatorId(UUID creatorId);
}
