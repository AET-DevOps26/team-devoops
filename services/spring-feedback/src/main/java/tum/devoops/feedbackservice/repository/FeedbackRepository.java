package tum.devoops.feedbackservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.feedbackservice.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    // SELECT * FROM feedback.feedback WHERE event_id = ?
    List<Feedback> findAllByEventId(UUID eventId);

    // SELECT * FROM feedback.feedback WHERE member_id = ?
    List<Feedback> findAllByMemberId(UUID memberId);

    // SELECT * FROM feedback.feedback WHERE creator_id = ?
    List<Feedback> findAllByCreatorId(UUID creatorId);
}
