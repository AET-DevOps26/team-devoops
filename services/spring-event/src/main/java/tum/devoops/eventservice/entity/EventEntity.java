package tum.devoops.eventservice.entity;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "event", name = "events")
@Getter @Setter @NoArgsConstructor
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    // UUID of the member who created this event.
    // FK to member.member(id) added in V3 migration.
    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    @OneToMany
    @JoinColumn(name = "event_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<AttendanceEntity> attendees;

    @OneToMany
    @JoinColumn(name = "event_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<SportEventEntity> sportsLinked;

    @OneToMany
    @JoinColumn(name = "event_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TeamEventEntity> teamsLinked;
}
