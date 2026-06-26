package tum.devoops.financeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tum.devoops.financeservice.entity.DirectorEntity;

import java.util.List;
import java.util.UUID;

public interface DirectorRepository extends JpaRepository<DirectorEntity, DirectorEntity.Id> {
    @Query("SELECT d.id.sportName FROM DirectorEntity d WHERE d.id.memberId = :memberId")
    List<String> findSportNamesByMemberId(@Param("memberId") UUID memberId);
}
