package tum.devoops.feedbackservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.feedbackservice.entity.FeedbackEntity;

public interface FeedbackRepository extends JpaRepository<FeedbackEntity, UUID> {

    // SELECT * FROM feedback.feedback WHERE event_id = ?
    List<FeedbackEntity> findAllByEventId(UUID eventId);

    // SELECT * FROM feedback.feedback WHERE member_id = ?
    List<FeedbackEntity> findAllByMemberId(UUID memberId);

    // SELECT * FROM feedback.feedback WHERE creator_id = ?
    List<FeedbackEntity> findAllByCreatorId(UUID creatorId);
}
