package tum.devoops.memberservice.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Read-only view of feedback.feedback for dashboard aggregation. The feedback text
// column is intentionally not mapped — dashboards only surface summaries.
@Entity
@Table(schema = "feedback", name = "feedback")
@Getter @Setter @NoArgsConstructor
public class FeedbackEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    // Member this feedback is about.
    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    // Member who wrote it; null if the creator was deleted (ON DELETE SET NULL).
    @Column(name = "creator_id")
    private UUID creatorId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "rating", nullable = false)
    private Integer rating;
}
