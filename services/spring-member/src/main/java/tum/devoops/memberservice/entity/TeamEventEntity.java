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

// Read-only view of event.team_events for dashboard aggregation.
@Entity
@Table(schema = "event", name = "team_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TeamEventEntity {

    // Composite PK: (event_id, team_id).
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "event_id", nullable = false)
        private UUID eventId;

        @Column(name = "team_id", nullable = false)
        private UUID teamId;
    }
}
