package tum.devoops.eventservice.entity;

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
 * Read-only shadow of {@code organization.trainers}, owned by the organization service.
 */
@Entity
@Table(schema = "organization", name = "trainers")
@Getter
@NoArgsConstructor
public class TrainerEntity {

    // Composite PK: (team_id, member_id).
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "team_id", nullable = false)
        private UUID teamId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
