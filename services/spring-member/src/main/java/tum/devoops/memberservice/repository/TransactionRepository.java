package tum.devoops.memberservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tum.devoops.memberservice.entity.TransactionEntity;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    // Total balance of a single member (sum of all their transaction amounts, in cents).
    @Query("SELECT COALESCE(SUM(t.amountCents), 0) FROM TransactionEntity t WHERE t.memberId = :memberId")
    long sumAmountByMemberId(@Param("memberId") UUID memberId);

    // Total balance across the whole club (sum of every transaction amount, in cents).
    @Query("SELECT COALESCE(SUM(t.amountCents), 0) FROM TransactionEntity t")
    long sumAllAmounts();
}
