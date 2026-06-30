package tum.devoops.financeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tum.devoops.financeservice.entity.MemberEntity;

import java.util.UUID;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
}
