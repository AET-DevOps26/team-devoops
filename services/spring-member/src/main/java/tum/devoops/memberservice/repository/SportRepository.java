package tum.devoops.memberservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.SportEntity;

public interface SportRepository extends JpaRepository<SportEntity, UUID> {
}
