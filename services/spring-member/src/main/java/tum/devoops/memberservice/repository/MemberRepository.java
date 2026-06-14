package tum.devoops.memberservice.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.Member;

public interface MemberRepository extends JpaRepository<Member, UUID> {

    // SELECT * FROM member.members WHERE email = ? LIMIT 1
    Optional<Member> findByEmail(String email);
}
