package tum.devoops.letterservice.entity;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Read-only shadow of {@code organization.directors}, owned by the organization service.
 */
@Entity
@Table(schema = "organization", name = "directors")
@Getter
@NoArgsConstructor
public class DirectorEntity {

    // Composite PK: (sport_id, member_id).
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "sport_id", nullable = false)
        private UUID sportId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
