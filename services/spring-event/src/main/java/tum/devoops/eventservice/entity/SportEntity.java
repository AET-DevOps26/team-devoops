package tum.devoops.eventservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Read-only shadow of {@code organization.sports} (owned by the organization service), used to
 * resolve sport display names for reference objects in responses.
 */
@Entity
@Table(schema = "organization", name = "sports")
@Getter @Setter @NoArgsConstructor
public class SportEntity {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", insertable = false, updatable = false)
    private String name;
}
