package tum.devoops.organizationservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.Trainee;

public interface TraineeRepository extends JpaRepository<Trainee, Trainee.Id> {

    // SELECT * FROM organization.trainees WHERE team_id = ?
    List<Trainee> findAllById_TeamId(UUID teamId);

    // SELECT * FROM organization.trainees WHERE member_id = ?
    List<Trainee> findAllById_MemberId(UUID memberId);

    // DELETE FROM organization.trainees WHERE team_id = ?
    void deleteAllById_TeamId(UUID teamId);
}
