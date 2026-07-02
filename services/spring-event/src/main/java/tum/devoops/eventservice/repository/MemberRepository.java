package tum.devoops.eventservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.MemberEntity;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
}
