package tum.devoops.organizationservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.SportEntity;

public interface SportRepository extends JpaRepository<SportEntity, UUID> {

    // SELECT s.* FROM organization.sports s
    // JOIN organization.directors d ON d.sport_id = s.id
    // WHERE d.member_id = ?
    List<SportEntity> findAllByDirectors_Id_MemberId(UUID memberId);

    // SELECT EXISTS(SELECT 1 FROM organization.sports WHERE name = ?)
    boolean existsByName(String name);
}
