package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.SportEvent;

public interface SportEventRepository extends JpaRepository<SportEvent, SportEvent.Id> {

    // SELECT * FROM event.sport_events WHERE event_id = ?
    List<SportEvent> findAllById_EventId(UUID eventId);

    // SELECT * FROM event.sport_events WHERE sport_name = ?
    List<SportEvent> findAllById_SportName(String sportName);

    // DELETE FROM event.sport_events WHERE event_id = ?
    void deleteAllById_EventId(UUID eventId);
}
