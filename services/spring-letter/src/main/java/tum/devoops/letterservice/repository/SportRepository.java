package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.letterservice.entity.SportEntity;

import java.util.UUID;

public interface SportRepository extends JpaRepository<SportEntity, UUID> {
}
