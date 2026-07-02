package tum.devoops.memberservice.entity;

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
import lombok.Setter;

// Read-only view of organization.trainees for dashboard aggregation.
@Entity
@Table(schema = "organization", name = "trainees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TraineeEntity {

    // Composite PK: (team_id, member_id).
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "team_id", nullable = false)
        private UUID teamId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
