package tum.devoops.organizationservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.DirectorEntity;

public interface DirectorRepository extends JpaRepository<DirectorEntity, DirectorEntity.Id> {

    // SELECT * FROM organization.directors WHERE sport_name = ?
    List<DirectorEntity> findAllById_SportName(String sportName);

    // SELECT * FROM organization.directors WHERE member_id = ?
    List<DirectorEntity> findAllById_MemberId(UUID memberId);

    // DELETE FROM organization.directors WHERE sport_name = ?
    void deleteAllById_SportName(String sportName);
}
