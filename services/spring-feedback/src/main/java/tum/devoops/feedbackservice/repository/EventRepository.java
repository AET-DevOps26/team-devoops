package tum.devoops.feedbackservice.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.feedbackservice.entity.EventEntity;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
}
