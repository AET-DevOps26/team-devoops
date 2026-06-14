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
@Table(schema = "event", name = "attendances")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Attendance {

    // Composite PK: (event_id, member_id).
    // event_id references event.event(id).
    // member_id references member.member(id) — FK added in V3 migration.
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "event_id", nullable = false)
        private UUID eventId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
