package tum.devoops.eventservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.eventservice.entity.TrainerEntity;

public interface TrainerRepository extends JpaRepository<TrainerEntity, TrainerEntity.Id> {
}
