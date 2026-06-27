package tum.devoops.eventservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.SportEntity;

public interface SportRepository extends JpaRepository<SportEntity, UUID> {
}
