package tum.devoops.memberservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Read-only view of organization.teams for dashboard aggregation.
@Entity
@Table(schema = "organization", name = "teams")
@Getter @Setter @NoArgsConstructor
public class TeamEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    // FK to organization.sports(id).
    @Column(name = "sport_id", nullable = false)
    private UUID sportId;
}
