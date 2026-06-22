package tum.devoops.organizationservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
}
