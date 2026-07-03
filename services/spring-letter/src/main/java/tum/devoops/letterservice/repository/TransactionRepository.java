package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.letterservice.entity.TransactionEntity;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    List<TransactionEntity> findAllByMemberId(UUID memberId);
}
