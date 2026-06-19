package tum.devoops.feedbackservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.feedbackservice.entity.TrainerEntity;

public interface TrainerRepository extends JpaRepository<TrainerEntity, TrainerEntity.Id> {

    // SELECT * FROM organization.trainers WHERE member_id = ?
    List<TrainerEntity> findAllById_MemberId(UUID memberId);
}
