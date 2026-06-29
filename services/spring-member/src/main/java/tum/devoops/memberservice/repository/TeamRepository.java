package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.TeamEntity;

public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {

    // SELECT * FROM organization.teams WHERE sport_id = ?
    List<TeamEntity> findAllBySportId(UUID sportId);
}
