package tum.devoops.feedbackservice.service;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.feedbackservice.entity.FeedbackEntity;
import tum.devoops.feedbackservice.exception.ForbiddenException;
import tum.devoops.feedbackservice.exception.NotFoundException;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackSummary;
import tum.devoops.feedbackservice.repository.EventRepository;
import tum.devoops.feedbackservice.repository.FeedbackRepository;
import tum.devoops.feedbackservice.repository.MemberRepository;
import tum.devoops.feedbackservice.repository.TraineeRepository;
import tum.devoops.feedbackservice.repository.TrainerRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final TraineeRepository traineeRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            EventRepository eventRepository,
            MemberRepository memberRepository,
            TrainerRepository trainerRepository,
            TraineeRepository traineeRepository) {
        this.feedbackRepository = feedbackRepository;
        this.eventRepository = eventRepository;
        this.memberRepository = memberRepository;
        this.trainerRepository = trainerRepository;
        this.traineeRepository = traineeRepository;
    }

    @Transactional(readOnly = true)
    public List<FeedbackSummary> getAllFeedback(UUID requesterId, boolean isAdmin) {
        List<FeedbackEntity> entities;
        if (isAdmin) {
            entities = feedbackRepository.findAll();
        } else {
            Set<UUID> seen = new HashSet<>();
            entities = new ArrayList<>();
            for (FeedbackEntity entity : feedbackRepository.findAllByCreatorId(requesterId)) {
                if (seen.add(entity.getId())) {
                    entities.add(entity);
                }
            }
            for (FeedbackEntity entity : feedbackRepository.findAllByMemberId(requesterId)) {
                if (seen.add(entity.getId())) {
                    entities.add(entity);
                }
            }
        }
        return entities.stream().map(this::toFeedbackSummary).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Feedback getFeedbackDetails(UUID feedbackId, UUID requesterId, boolean isAdmin) {
        FeedbackEntity entity = findFeedbackOrThrow(feedbackId);
        boolean isCreator = requesterId.equals(entity.getCreatorId());
        boolean isMember = requesterId.equals(entity.getMemberId());
        if (!isAdmin && !isCreator && !isMember) {
            throw new ForbiddenException("Access denied");
        }
        return toFeedback(entity);
    }

    private FeedbackEntity findFeedbackOrThrow(UUID feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new NotFoundException("Feedback not found: " + feedbackId));
    }

    private Feedback toFeedback(FeedbackEntity entity) {
        return new Feedback(
                entity.getId(),
                entity.getEventId().toString(),
                entity.getMemberId().toString(),
                entity.getCreatorId().toString(),
                entity.getCreatedAt().atOffset(ZoneOffset.UTC),
                entity.getFeedback()
        );
    }

    private FeedbackSummary toFeedbackSummary(FeedbackEntity entity) {
        return new FeedbackSummary(
                entity.getId(),
                entity.getEventId().toString(),
                entity.getMemberId().toString(),
                entity.getCreatorId().toString(),
                entity.getCreatedAt().atOffset(ZoneOffset.UTC)
        );
    }
}
