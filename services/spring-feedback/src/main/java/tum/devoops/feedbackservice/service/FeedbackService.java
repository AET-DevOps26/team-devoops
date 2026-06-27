package tum.devoops.feedbackservice.service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.feedbackservice.entity.EventEntity;
import tum.devoops.feedbackservice.entity.FeedbackEntity;
import tum.devoops.feedbackservice.exception.BadRequestException;
import tum.devoops.feedbackservice.exception.ForbiddenException;
import tum.devoops.feedbackservice.exception.NotFoundException;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackCreate;
import tum.devoops.feedbackservice.model.FeedbackPartialUpdate;
import tum.devoops.feedbackservice.model.FeedbackSummary;
import tum.devoops.feedbackservice.model.Reference;
import tum.devoops.feedbackservice.repository.EventRepository;
import tum.devoops.feedbackservice.repository.FeedbackRepository;
import tum.devoops.feedbackservice.repository.MemberRepository;
import tum.devoops.feedbackservice.repository.TraineeRepository;
import tum.devoops.feedbackservice.repository.TrainerRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private TraineeRepository traineeRepository;

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

    @Transactional
    public Feedback createFeedback(FeedbackCreate body, UUID requesterId, boolean isAdmin) {
        UUID eventId = parseUuid(body.getEvent(), "event");
        UUID memberId = parseUuid(body.getMember(), "member");

        if (!eventRepository.existsById(eventId)) {
            throw new BadRequestException("Event not found: " + eventId);
        }
        if (!memberRepository.existsById(memberId)) {
            throw new BadRequestException("Member not found: " + memberId);
        }

        if (!isAdmin) {
            assertTrainerOfMember(requesterId, memberId);
        }

        FeedbackEntity entity = new FeedbackEntity();
        entity.setEventId(eventId);
        entity.setMemberId(memberId);
        entity.setCreatorId(requesterId);
        entity.setCreatedAt(Instant.now());
        entity.setFeedback(body.getFeedback());

        return toFeedback(feedbackRepository.save(entity));
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

    @Transactional
    public Feedback updateFeedbackDetails(UUID feedbackId, FeedbackPartialUpdate body, UUID requesterId, boolean isAdmin) {
        FeedbackEntity entity = findFeedbackOrThrow(feedbackId);
        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Access denied");
        }

        if (body.getEvent() != null) {
            UUID eventId = parseUuid(body.getEvent(), "event");
            if (!eventRepository.existsById(eventId)) {
                throw new BadRequestException("Event not found: " + eventId);
            }
            entity.setEventId(eventId);
        }
        if (body.getMember() != null) {
            UUID memberId = parseUuid(body.getMember(), "member");
            if (!memberRepository.existsById(memberId)) {
                throw new BadRequestException("Member not found: " + memberId);
            }
            entity.setMemberId(memberId);
        }
        if (body.getFeedback() != null) {
            entity.setFeedback(body.getFeedback());
        }

        return toFeedback(feedbackRepository.save(entity));
    }

    @Transactional
    public void deleteFeedback(UUID feedbackId, UUID requesterId, boolean isAdmin) {
        FeedbackEntity entity = findFeedbackOrThrow(feedbackId);
        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Access denied");
        }
        feedbackRepository.delete(entity);
    }

    private void assertTrainerOfMember(UUID trainerId, UUID memberId) {
        Set<UUID> trainerTeams = trainerRepository.findAllById_MemberId(trainerId).stream()
                .map(t -> t.getId().getTeamId())
                .collect(Collectors.toSet());
        Set<UUID> memberTeams = traineeRepository.findAllById_MemberId(memberId).stream()
                .map(t -> t.getId().getTeamId())
                .collect(Collectors.toSet());
        trainerTeams.retainAll(memberTeams);
        if (trainerTeams.isEmpty()) {
            throw new ForbiddenException("Access denied");
        }
    }

    private FeedbackEntity findFeedbackOrThrow(UUID feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new NotFoundException("Feedback not found: " + feedbackId));
    }

    private UUID parseUuid(String value, String fieldName) {
        if (value == null) {
            throw new BadRequestException("Field '" + fieldName + "' is required");
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid UUID for '" + fieldName + "': " + value);
        }
    }

    private Feedback toFeedback(FeedbackEntity entity) {
        return new Feedback(
                entity.getId(),
                eventReference(entity.getEventId()),
                memberReference(entity.getMemberId()),
                memberReference(entity.getCreatorId()),
                entity.getCreatedAt().atOffset(ZoneOffset.UTC),
                entity.getFeedback()
        );
    }

    private FeedbackSummary toFeedbackSummary(FeedbackEntity entity) {
        return new FeedbackSummary(
                entity.getId(),
                eventReference(entity.getEventId()),
                memberReference(entity.getMemberId()),
                memberReference(entity.getCreatorId()),
                entity.getCreatedAt().atOffset(ZoneOffset.UTC)
        );
    }

    private Reference eventReference(UUID eventId) {
        String name = eventRepository.findById(eventId).map(EventEntity::getName).orElse(null);
        return new Reference(eventId, name);
    }

    private Reference memberReference(UUID memberId) {
        String name = memberRepository.findById(memberId)
                .map(m -> m.getFirstName() + " " + m.getLastName()).orElse(null);
        return new Reference(memberId, name);
    }
}
