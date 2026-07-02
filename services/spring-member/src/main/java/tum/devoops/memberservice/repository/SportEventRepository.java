package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.SportEventEntity;

public interface SportEventRepository extends JpaRepository<SportEventEntity, SportEventEntity.Id> {

    // SELECT * FROM event.sport_events WHERE sport_id = ?
    List<SportEventEntity> findAllById_SportId(UUID sportId);
}
