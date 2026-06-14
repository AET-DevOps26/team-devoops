package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.TeamEventEntity;

public interface TeamEventRepository extends JpaRepository<TeamEventEntity, TeamEventEntity.Id> {

    // SELECT * FROM event.team_events WHERE event_id = ?
    List<TeamEventEntity> findAllById_EventId(UUID eventId);

    // SELECT * FROM event.team_events WHERE team_id = ?
    List<TeamEventEntity> findAllById_TeamId(UUID teamId);

    // DELETE FROM event.team_events WHERE event_id = ?
    void deleteAllById_EventId(UUID eventId);
}
