package tum.devoops.feedbackservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.feedbackservice.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
}
