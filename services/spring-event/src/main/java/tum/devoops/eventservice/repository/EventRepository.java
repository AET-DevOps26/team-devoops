package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.Event;

public interface EventRepository extends JpaRepository<Event, UUID> {

    // SELECT * FROM event.events WHERE creator_id = ?
    List<Event> findAllByCreatorId(UUID creatorId);
}
