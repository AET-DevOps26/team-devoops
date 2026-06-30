package tum.devoops.financeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tum.devoops.financeservice.entity.TrainerEntity;

import java.util.List;
import java.util.UUID;

public interface TrainerRepository extends JpaRepository<TrainerEntity, TrainerEntity.Id> {
    @Query("SELECT t.id.teamId FROM TrainerEntity t WHERE t.id.memberId = :memberId")
    List<UUID> findTeamIdByMemberId(@Param("memberId") UUID memberId);
}
