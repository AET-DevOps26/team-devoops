package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tum.devoops.letterservice.entity.TrainerEntity;

import java.util.List;
import java.util.UUID;

public interface TrainerRepository extends JpaRepository<TrainerEntity, TrainerEntity.Id> {

    @Query("SELECT t.id.teamId FROM TrainerEntity t WHERE t.id.memberId = :memberId")
    List<UUID> findTeamIdsByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT t.id.memberId FROM TrainerEntity t WHERE t.id.teamId = :teamId")
    List<UUID> findMemberIdsByTeamId(@Param("teamId") UUID teamId);
}
