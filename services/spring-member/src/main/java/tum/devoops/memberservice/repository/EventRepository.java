package tum.devoops.memberservice.repository;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tum.devoops.memberservice.entity.EventEntity;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    // Count events whose start_time falls in [start, end) — used for "events this week".
    @Query("SELECT COUNT(e) FROM EventEntity e WHERE e.startTime >= :start AND e.startTime < :end")
    long countInWindow(@Param("start") Instant start, @Param("end") Instant end);
}
