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
import lombok.Setter;

@Entity
@Table(schema = "event", name = "sport_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SportEventEntity {

    // Composite PK: (event_id, sport_name).
    // event_id references event.event(id).
    // sport_name references organization.sport(name) — FK added in V3 migration.
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "event_id", nullable = false)
        private UUID eventId;

        @Column(name = "sport_name", nullable = false)
        private String sportName;
    }
}
