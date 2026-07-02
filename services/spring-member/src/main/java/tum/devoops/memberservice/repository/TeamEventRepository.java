package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.TeamEventEntity;

public interface TeamEventRepository extends JpaRepository<TeamEventEntity, TeamEventEntity.Id> {

    // SELECT * FROM event.team_events WHERE team_id = ?
    List<TeamEventEntity> findAllById_TeamId(UUID teamId);
}
