package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.letterservice.entity.MemberEntity;

import java.util.UUID;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
}
