package tum.devoops.letterservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import tum.devoops.letterservice.entity.DirectorEntity;

import java.util.List;
import java.util.UUID;

public interface DirectorRepository extends JpaRepository<DirectorEntity, DirectorEntity.Id> {

    @Query("SELECT d.id.sportId FROM DirectorEntity d WHERE d.id.memberId = :memberId")
    List<UUID> findSportIdsByMemberId(@Param("memberId") UUID memberId);

    @Query("SELECT d.id.memberId FROM DirectorEntity d WHERE d.id.sportId = :sportId")
    List<UUID> findMemberIdsBySportId(@Param("sportId") UUID sportId);
}
