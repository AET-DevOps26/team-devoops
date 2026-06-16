package tum.devoops.organizationservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.TraineeEntity;

public interface TraineeRepository extends JpaRepository<TraineeEntity, TraineeEntity.Id> {

    // SELECT * FROM organization.trainees WHERE team_id = ?
    List<TraineeEntity> findAllById_TeamId(UUID teamId);

    // SELECT * FROM organization.trainees WHERE member_id = ?
    List<TraineeEntity> findAllById_MemberId(UUID memberId);

    // DELETE FROM organization.trainees WHERE team_id = ?
    void deleteAllById_TeamId(UUID teamId);
}
