package tum.devoops.feedbackservice.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import tum.devoops.feedbackservice.entity.FeedbackEntity;
import tum.devoops.feedbackservice.entity.TraineeEntity;
import tum.devoops.feedbackservice.entity.TrainerEntity;
import tum.devoops.feedbackservice.exception.BadRequestException;
import tum.devoops.feedbackservice.exception.ForbiddenException;
import tum.devoops.feedbackservice.exception.NotFoundException;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackCreate;
import tum.devoops.feedbackservice.model.FeedbackPartialUpdate;
import tum.devoops.feedbackservice.model.FeedbackSummary;
import tum.devoops.feedbackservice.repository.EventRepository;
import tum.devoops.feedbackservice.repository.FeedbackRepository;
import tum.devoops.feedbackservice.repository.MemberRepository;
import tum.devoops.feedbackservice.repository.TraineeRepository;
import tum.devoops.feedbackservice.repository.TrainerRepository;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private TrainerRepository trainerRepository;
    @Mock
    private TraineeRepository traineeRepository;

    @InjectMocks
    private FeedbackService service;

    private static final UUID REQUESTER_ID = UUID.randomUUID();
    private static final UUID ANOTHER_ID = UUID.randomUUID();
    private static final UUID EVENT_ID = UUID.randomUUID();
    private static final UUID MEMBER_ID = UUID.randomUUID();
    private static final UUID FEEDBACK_ID = UUID.randomUUID();
    private static final UUID TEAM_ID = UUID.randomUUID();

    private FeedbackEntity makeEntity(UUID id, UUID eventId, UUID memberId, UUID creatorId) {
        FeedbackEntity e = new FeedbackEntity();
        e.setId(id);
        e.setEventId(eventId);
        e.setMemberId(memberId);
        e.setCreatorId(creatorId);
        e.setCreatedAt(Instant.now());
        e.setFeedback("test feedback");
        return e;
    }

    private void stubExistingEventAndMember() {
        when(eventRepository.existsById(EVENT_ID)).thenReturn(true);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(true);
    }

    private void stubTrainerOfMember() {
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(new TrainerEntity(new TrainerEntity.Id(TEAM_ID, REQUESTER_ID))));
        when(traineeRepository.findAllById_MemberId(MEMBER_ID))
                .thenReturn(List.of(new TraineeEntity(new TraineeEntity.Id(TEAM_ID, MEMBER_ID))));
    }

    // ─── getAllFeedback ────────────────────────────────────────────────────────

    @Test
    void getAllFeedbackAsAdminReturnsAll() {
        FeedbackEntity e1 = makeEntity(UUID.randomUUID(), EVENT_ID, MEMBER_ID, REQUESTER_ID);
        FeedbackEntity e2 = makeEntity(UUID.randomUUID(), EVENT_ID, ANOTHER_ID, ANOTHER_ID);
        when(feedbackRepository.findAll()).thenReturn(List.of(e1, e2));

        List<FeedbackSummary> result = service.getAllFeedback(REQUESTER_ID, true);

        assertThat(result).hasSize(2);
    }

    @Test
    void getAllFeedbackAsNonAdminReturnsOwnFeedback() {
        FeedbackEntity asCreator = makeEntity(UUID.randomUUID(), EVENT_ID, MEMBER_ID, REQUESTER_ID);
        FeedbackEntity asMember = makeEntity(UUID.randomUUID(), EVENT_ID, REQUESTER_ID, ANOTHER_ID);
        when(feedbackRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of(asCreator));
        when(feedbackRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of(asMember));

        List<FeedbackSummary> result = service.getAllFeedback(REQUESTER_ID, false);

        assertThat(result).hasSize(2);
        assertThat(result).extracting(s -> s.getCreator().getId())
                .contains(REQUESTER_ID, ANOTHER_ID);
    }

    @Test
    void getAllFeedbackDeduplicatesOverlappingEntries() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, REQUESTER_ID, REQUESTER_ID);
        when(feedbackRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of(e));
        when(feedbackRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of(e));

        List<FeedbackSummary> result = service.getAllFeedback(REQUESTER_ID, false);

        assertThat(result).hasSize(1);
    }

    @Test
    void getAllFeedbackReturnsEmptyForNoFeedback() {
        when(feedbackRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of());
        when(feedbackRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of());

        List<FeedbackSummary> result = service.getAllFeedback(REQUESTER_ID, false);

        assertThat(result).isEmpty();
    }

    // ─── createFeedback ───────────────────────────────────────────────────────

    @Test
    void createFeedbackAsAdminSkipsTrainerCheck() {
        stubExistingEventAndMember();
        FeedbackEntity saved = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.save(any())).thenReturn(saved);
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "Great work!");

        Feedback result = service.createFeedback(body, REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(FEEDBACK_ID);
        assertThat(result.getCreator().getId()).isEqualTo(REQUESTER_ID);
    }

    @Test
    void createFeedbackAsTrainerWithSharedTeamSucceeds() {
        stubExistingEventAndMember();
        stubTrainerOfMember();
        FeedbackEntity saved = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.save(any())).thenReturn(saved);
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "Keep it up!");

        Feedback result = service.createFeedback(body, REQUESTER_ID, false);

        assertThat(result.getMember().getId()).isEqualTo(MEMBER_ID);
    }

    @Test
    void createFeedbackAsTrainerWithoutSharedTeamThrowsForbidden() {
        stubExistingEventAndMember();
        UUID otherTeam = UUID.randomUUID();
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(new TrainerEntity(new TrainerEntity.Id(TEAM_ID, REQUESTER_ID))));
        when(traineeRepository.findAllById_MemberId(MEMBER_ID))
                .thenReturn(List.of(new TraineeEntity(new TraineeEntity.Id(otherTeam, MEMBER_ID))));
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void createFeedbackAsTrainerWithNoTeamsThrowsForbidden() {
        stubExistingEventAndMember();
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(traineeRepository.findAllById_MemberId(MEMBER_ID)).thenReturn(List.of());
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void createFeedbackWithNonExistentEventThrowsBadRequest() {
        when(eventRepository.existsById(EVENT_ID)).thenReturn(false);
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Event");
    }

    @Test
    void createFeedbackWithNonExistentMemberThrowsBadRequest() {
        when(eventRepository.existsById(EVENT_ID)).thenReturn(true);
        when(memberRepository.existsById(MEMBER_ID)).thenReturn(false);
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), MEMBER_ID.toString(), "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Member");
    }

    @Test
    void createFeedbackWithInvalidEventUuidThrowsBadRequest() {
        FeedbackCreate body = new FeedbackCreate("not-a-uuid", MEMBER_ID.toString(), "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void createFeedbackWithInvalidMemberUuidThrowsBadRequest() {
        FeedbackCreate body = new FeedbackCreate(EVENT_ID.toString(), "not-a-uuid", "x");

        assertThatThrownBy(() -> service.createFeedback(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class);
    }

    // ─── getFeedbackDetails ───────────────────────────────────────────────────

    @Test
    void getFeedbackDetailsAsAdminReturnsAnyFeedback() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        Feedback result = service.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(FEEDBACK_ID);
    }

    @Test
    void getFeedbackDetailsAsCreatorSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        Feedback result = service.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, false);

        assertThat(result.getCreator().getId()).isEqualTo(REQUESTER_ID);
    }

    @Test
    void getFeedbackDetailsAsMemberSubjectSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, REQUESTER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        Feedback result = service.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, false);

        assertThat(result.getMember().getId()).isEqualTo(REQUESTER_ID);
    }

    @Test
    void getFeedbackDetailsAsUnrelatedUserThrowsForbidden() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> service.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void getFeedbackDetailsNotFoundThrowsNotFoundException() {
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }

    // ─── updateFeedbackDetails ────────────────────────────────────────────────

    @Test
    void updateFeedbackDetailsAsAdminSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        when(feedbackRepository.save(any())).thenReturn(e);

        Feedback result = service.updateFeedbackDetails(
                FEEDBACK_ID, new FeedbackPartialUpdate().feedback("updated"), REQUESTER_ID, true);

        assertThat(result).isNotNull();
    }

    @Test
    void updateFeedbackDetailsAsCreatorSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        when(feedbackRepository.save(any())).thenReturn(e);

        Feedback result = service.updateFeedbackDetails(
                FEEDBACK_ID, new FeedbackPartialUpdate().feedback("updated"), REQUESTER_ID, false);

        assertThat(result).isNotNull();
    }

    @Test
    void updateFeedbackDetailsAsNonCreatorThrowsForbidden() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> service.updateFeedbackDetails(
                        FEEDBACK_ID, new FeedbackPartialUpdate().feedback("x"), REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateFeedbackDetailsNotFoundThrowsNotFoundException() {
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateFeedbackDetails(
                        FEEDBACK_ID, new FeedbackPartialUpdate(), REQUESTER_ID, true))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateFeedbackDetailsWithAllNullFieldsDoesNotModifyEntity() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        ArgumentCaptor<FeedbackEntity> captor = ArgumentCaptor.forClass(FeedbackEntity.class);
        when(feedbackRepository.save(captor.capture())).thenReturn(e);

        service.updateFeedbackDetails(FEEDBACK_ID, new FeedbackPartialUpdate(), REQUESTER_ID, false);

        assertThat(captor.getValue().getFeedback()).isEqualTo("test feedback");
        assertThat(captor.getValue().getEventId()).isEqualTo(EVENT_ID);
        assertThat(captor.getValue().getMemberId()).isEqualTo(MEMBER_ID);
    }

    @Test
    void updateFeedbackDetailsWithNewEventUpdatesEventId() {
        UUID newEventId = UUID.randomUUID();
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        when(eventRepository.existsById(newEventId)).thenReturn(true);
        ArgumentCaptor<FeedbackEntity> captor = ArgumentCaptor.forClass(FeedbackEntity.class);
        when(feedbackRepository.save(captor.capture())).thenReturn(e);

        service.updateFeedbackDetails(
                FEEDBACK_ID, new FeedbackPartialUpdate().event(newEventId.toString()), REQUESTER_ID, false);

        assertThat(captor.getValue().getEventId()).isEqualTo(newEventId);
    }

    @Test
    void updateFeedbackDetailsWithNonExistentEventThrowsBadRequest() {
        UUID newEventId = UUID.randomUUID();
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        when(eventRepository.existsById(newEventId)).thenReturn(false);

        assertThatThrownBy(() -> service.updateFeedbackDetails(
                        FEEDBACK_ID, new FeedbackPartialUpdate().event(newEventId.toString()), REQUESTER_ID, false))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void updateFeedbackDetailsWithNonExistentMemberThrowsBadRequest() {
        UUID newMemberId = UUID.randomUUID();
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));
        when(memberRepository.existsById(newMemberId)).thenReturn(false);

        assertThatThrownBy(() -> service.updateFeedbackDetails(
                        FEEDBACK_ID, new FeedbackPartialUpdate().member(newMemberId.toString()), REQUESTER_ID, false))
                .isInstanceOf(BadRequestException.class);
    }

    // ─── deleteFeedback ───────────────────────────────────────────────────────

    @Test
    void deleteFeedbackAsAdminSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        service.deleteFeedback(FEEDBACK_ID, REQUESTER_ID, true);

        verify(feedbackRepository).delete(e);
    }

    @Test
    void deleteFeedbackAsCreatorSucceeds() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, REQUESTER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        service.deleteFeedback(FEEDBACK_ID, REQUESTER_ID, false);

        verify(feedbackRepository).delete(e);
    }

    @Test
    void deleteFeedbackAsNonCreatorThrowsForbidden() {
        FeedbackEntity e = makeEntity(FEEDBACK_ID, EVENT_ID, MEMBER_ID, ANOTHER_ID);
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.of(e));

        assertThatThrownBy(() -> service.deleteFeedback(FEEDBACK_ID, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void deleteFeedbackNotFoundThrowsNotFoundException() {
        when(feedbackRepository.findById(FEEDBACK_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteFeedback(FEEDBACK_ID, REQUESTER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }
}
