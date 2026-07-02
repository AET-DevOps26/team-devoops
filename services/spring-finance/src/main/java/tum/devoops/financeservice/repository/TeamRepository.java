package tum.devoops.financeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tum.devoops.financeservice.entity.TeamEntity;
import tum.devoops.financeservice.entity.TraineeEntity;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<TeamEntity, UUID> {
    @Query("SELECT t.trainees FROM TeamEntity t WHERE t.sportId = :sportId")
    List<TraineeEntity> findTraineesBySportId(@Param("sportId") UUID sportId);

    @Query("SELECT t.trainees FROM TeamEntity t WHERE t.id = :teamId")
    List<TraineeEntity> findTraineesByTeamId(@Param("teamId") UUID teamId);
}
