package tum.devoops.feedbackservice.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "feedback", name = "feedback")
@Getter @Setter @NoArgsConstructor
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    // FK to event.event(id) added in V3 migration.
    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    // UUID of the member this feedback is about.
    // FK to member.member(id) added in V3 migration.
    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    // UUID of the member who wrote this feedback.
    // FK to member.member(id); ON DELETE SET NULL, so this is cleared if the creator is deleted.
    @Column(name = "creator_id")
    private UUID creatorId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "feedback", nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "rating", nullable = false)
    private Integer rating;
}
