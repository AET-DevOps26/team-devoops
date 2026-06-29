package tum.devoops.memberservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Read-only view of organization.sports for dashboard aggregation. Owned by the
// organization service; the member service has cross-schema SELECT via the reader role.
@Entity
@Table(schema = "organization", name = "sports")
@Getter @Setter @NoArgsConstructor
public class SportEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
}
