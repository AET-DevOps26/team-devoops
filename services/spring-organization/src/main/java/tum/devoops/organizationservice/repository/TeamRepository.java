package tum.devoops.organizationservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.organizationservice.entity.Team;

public interface TeamRepository extends JpaRepository<Team, UUID> {

    // SELECT * FROM organization.teams WHERE sport_name = ?
    List<Team> findAllBySportName(String sportName);
}
