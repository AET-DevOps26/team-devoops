package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.letterservice.entity.TeamEntity;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {

    List<TeamEntity> findAllBySportId(UUID sportId);
}
