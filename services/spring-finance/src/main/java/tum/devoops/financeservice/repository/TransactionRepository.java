package tum.devoops.financeservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.financeservice.entity.TransactionEntity;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    // SELECT * FROM finance.transactions WHERE member_id = ?
    List<TransactionEntity> findAllByMemberId(UUID memberId);

    // SELECT * FROM finance.transactions WHERE creator_id = ?
    List<TransactionEntity> findAllByCreatorId(UUID creatorId);
}
