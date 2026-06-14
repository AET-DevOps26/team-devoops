package tum.devoops.eventservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.EventEntity;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    // SELECT * FROM event.events WHERE creator_id = ?
    List<EventEntity> findAllByCreatorId(UUID creatorId);
}
