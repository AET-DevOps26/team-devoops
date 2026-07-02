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

// Read-only view of event.sport_events for dashboard aggregation.
@Entity
@Table(schema = "event", name = "sport_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SportEventEntity {

    // Composite PK: (event_id, sport_id).
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "event_id", nullable = false)
        private UUID eventId;

        @Column(name = "sport_id", nullable = false)
        private UUID sportId;
    }
}
