package tum.devoops.organizationservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.SportEntity;

public interface SportRepository extends JpaRepository<SportEntity, String> {

    // SELECT s.* FROM organization.sports s
    // JOIN organization.directors d ON d.sport_name = s.name
    // WHERE d.member_id = ?
    List<SportEntity> findAllByDirectors_Id_MemberId(java.util.UUID memberId);
}
