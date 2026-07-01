package tum.devoops.letterservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Read-only shadow of {@code organization.teams}, owned by the organization service.
 */
@Entity
@Table(schema = "organization", name = "teams")
@Getter
@NoArgsConstructor
public class TeamEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", insertable = false, updatable = false)
    private String name;

    @Column(name = "sport_id", insertable = false, updatable = false)
    private UUID sportId;
}
