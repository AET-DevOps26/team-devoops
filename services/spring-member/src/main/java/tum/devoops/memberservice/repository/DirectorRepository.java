package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.DirectorEntity;

public interface DirectorRepository extends JpaRepository<DirectorEntity, DirectorEntity.Id> {

    // SELECT * FROM organization.directors WHERE member_id = ?
    List<DirectorEntity> findAllById_MemberId(UUID memberId);
}
