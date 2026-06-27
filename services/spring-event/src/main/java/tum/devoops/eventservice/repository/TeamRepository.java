package tum.devoops.eventservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.TeamEntity;

public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {
}
