package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.TrainerEntity;

public interface TrainerRepository extends JpaRepository<TrainerEntity, TrainerEntity.Id> {

    // SELECT * FROM organization.trainers WHERE member_id = ?
    List<TrainerEntity> findAllById_MemberId(UUID memberId);

    // SELECT * FROM organization.trainers WHERE team_id = ?
    List<TrainerEntity> findAllById_TeamId(UUID teamId);
}
