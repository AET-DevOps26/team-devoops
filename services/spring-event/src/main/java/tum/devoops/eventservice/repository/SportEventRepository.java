package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.SportEventEntity;

public interface SportEventRepository extends JpaRepository<SportEventEntity, SportEventEntity.Id> {

    // SELECT * FROM event.sport_events WHERE event_id = ?
    List<SportEventEntity> findAllById_EventId(UUID eventId);

    // SELECT * FROM event.sport_events WHERE sport_id = ?
    List<SportEventEntity> findAllById_SportId(UUID sportId);

    // DELETE FROM event.sport_events WHERE event_id = ?
    void deleteAllById_EventId(UUID eventId);
}
