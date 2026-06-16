package tum.devoops.memberservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {

    // SELECT * FROM member.members WHERE email = ? LIMIT 1
    Optional<MemberEntity> findByEmail(String email);
}
