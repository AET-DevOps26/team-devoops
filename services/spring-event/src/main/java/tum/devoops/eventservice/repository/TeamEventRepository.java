package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.TeamEvent;

public interface TeamEventRepository extends JpaRepository<TeamEvent, TeamEvent.Id> {

    // SELECT * FROM event.team_events WHERE event_id = ?
    List<TeamEvent> findAllById_EventId(UUID eventId);

    // SELECT * FROM event.team_events WHERE team_id = ?
    List<TeamEvent> findAllById_TeamId(UUID teamId);

    // DELETE FROM event.team_events WHERE event_id = ?
    void deleteAllById_EventId(UUID eventId);
}
