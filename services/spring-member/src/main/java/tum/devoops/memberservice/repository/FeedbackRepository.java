package tum.devoops.memberservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import tum.devoops.memberservice.entity.FeedbackEntity;

public interface FeedbackRepository extends JpaRepository<FeedbackEntity, UUID> {

    // SELECT * FROM feedback.feedback WHERE member_id = ?  (feedback about a member)
    List<FeedbackEntity> findAllByMemberId(UUID memberId);

    // SELECT * FROM feedback.feedback WHERE creator_id = ?  (feedback authored by a member)
    List<FeedbackEntity> findAllByCreatorId(UUID creatorId);
}
