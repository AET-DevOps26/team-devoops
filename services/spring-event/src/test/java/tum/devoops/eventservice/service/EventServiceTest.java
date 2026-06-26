package tum.devoops.eventservice.service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import tum.devoops.eventservice.entity.AttendanceEntity;
import tum.devoops.eventservice.entity.EventEntity;
import tum.devoops.eventservice.entity.SportEventEntity;
import tum.devoops.eventservice.entity.TeamEventEntity;
import tum.devoops.eventservice.exception.BadRequestException;
import tum.devoops.eventservice.exception.ForbiddenException;
import tum.devoops.eventservice.exception.NotFoundException;
import tum.devoops.eventservice.model.Event;
import tum.devoops.eventservice.model.EventCreate;
import tum.devoops.eventservice.model.EventPartialUpdate;
import tum.devoops.eventservice.model.EventSummary;
import tum.devoops.eventservice.repository.AttendanceRepository;
import tum.devoops.eventservice.repository.EventRepository;
import tum.devoops.eventservice.repository.SportEventRepository;
import tum.devoops.eventservice.repository.TeamEventRepository;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private SportEventRepository sportEventRepository;
    @Mock
    private TeamEventRepository teamEventRepository;

    @InjectMocks
    private EventService service;

    private static final UUID REQUESTER_ID = UUID.randomUUID();
    private static final UUID OTHER_ID = UUID.randomUUID();
    private static final UUID EVENT_ID = UUID.randomUUID();
    private static final UUID MEMBER_ID = UUID.randomUUID();
    private static final UUID TEAM_ID = UUID.randomUUID();

    private static final Instant START = Instant.parse("2026-01-01T10:00:00Z");
    private static final Instant END = Instant.parse("2026-01-01T12:00:00Z");

    private EventEntity eventEntity(UUID id, UUID creatorId) {
        EventEntity e = new EventEntity();
        e.setId(id);
        e.setName("Test Event");
        e.setDescription("desc");
        e.setStartTime(START);
        e.setEndTime(END);
        e.setCreatorId(creatorId);
        return e;
    }

    private static OffsetDateTime odt(Instant instant) {
        return instant.atOffset(ZoneOffset.UTC);
    }

    private EventCreate validCreate() {
        return new EventCreate("Test Event", odt(START), odt(END)).description("desc");
    }

    @SuppressWarnings("unchecked")
    private static <T> ArgumentCaptor<List<T>> listCaptor() {
        return ArgumentCaptor.forClass(List.class);
    }

    // ─── getAllEvents ──────────────────────────────────────────────────────────

    @Test
    void getAllEventsAsAdminReturnsAllAndIgnoresAttendance() {
        EventEntity a = eventEntity(UUID.randomUUID(), REQUESTER_ID);
        EventEntity b = eventEntity(UUID.randomUUID(), OTHER_ID);
        when(eventRepository.findAll()).thenReturn(List.of(a, b));

        List<EventSummary> result = service.getAllEvents(REQUESTER_ID, true);

        assertThat(result).hasSize(2);
        verifyNoInteractions(attendanceRepository);
    }

    @Test
    void getAllEventsAsNonAdminUnionsCreatedAndAttended() {
        UUID attendedId = UUID.randomUUID();
        EventEntity created = eventEntity(EVENT_ID, REQUESTER_ID);
        EventEntity attended = eventEntity(attendedId, OTHER_ID);
        when(eventRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of(created));
        when(attendanceRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(new AttendanceEntity(new AttendanceEntity.Id(attendedId, REQUESTER_ID))));
        when(eventRepository.findAllById(List.of(attendedId))).thenReturn(List.of(attended));

        List<EventSummary> result = service.getAllEvents(REQUESTER_ID, false);

        assertThat(result).extracting(EventSummary::getId)
                .containsExactlyInAnyOrder(EVENT_ID, attendedId);
    }

    @Test
    void getAllEventsAsNonAdminDeduplicatesCreatedAndAttended() {
        EventEntity created = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(List.of(created));
        when(attendanceRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(new AttendanceEntity(new AttendanceEntity.Id(EVENT_ID, REQUESTER_ID))));

        List<EventSummary> result = service.getAllEvents(REQUESTER_ID, false);

        assertThat(result).hasSize(1);
        // Already-created event is filtered out, so no batch fetch is issued.
        verify(eventRepository, never()).findAllById(any());
    }

    // ─── createEvent ───────────────────────────────────────────────────────────

    @Test
    void createEventWithEndBeforeStartThrowsBadRequest() {
        EventCreate body = new EventCreate("x", odt(END), odt(START));

        assertThatThrownBy(() -> service.createEvent(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class);
        verify(eventRepository, never()).save(any());
    }

    @Test
    void createEventWithNullTimesThrowsBadRequest() {
        EventCreate body = new EventCreate("x", null, null);

        assertThatThrownBy(() -> service.createEvent(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class);
        verify(eventRepository, never()).save(any());
    }

    @Test
    void createEventPersistsEventAndLinks() {
        EventEntity saved = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.save(any())).thenReturn(saved);
        EventCreate body = validCreate()
                .attendees(List.of(MEMBER_ID.toString()))
                .sportsLinked(List.of("football"))
                .teamsLinked(List.of(TEAM_ID.toString()));

        Event result = service.createEvent(body, REQUESTER_ID, true);

        assertThat(result.getCreator()).isEqualTo(REQUESTER_ID.toString());

        ArgumentCaptor<List<AttendanceEntity>> attendees = listCaptor();
        verify(attendanceRepository).saveAll(attendees.capture());
        assertThat(attendees.getValue()).extracting(a -> a.getId().getMemberId()).containsExactly(MEMBER_ID);

        ArgumentCaptor<List<SportEventEntity>> sports = listCaptor();
        verify(sportEventRepository).saveAll(sports.capture());
        assertThat(sports.getValue()).extracting(s -> s.getId().getSportName()).containsExactly("football");

        ArgumentCaptor<List<TeamEventEntity>> teams = listCaptor();
        verify(teamEventRepository).saveAll(teams.capture());
        assertThat(teams.getValue()).extracting(t -> t.getId().getTeamId()).containsExactly(TEAM_ID);
    }

    @Test
    void createEventWithInvalidAttendeeUuidThrowsBadRequest() {
        when(eventRepository.save(any())).thenReturn(eventEntity(EVENT_ID, REQUESTER_ID));
        EventCreate body = validCreate().attendees(List.of("not-a-uuid"));

        assertThatThrownBy(() -> service.createEvent(body, REQUESTER_ID, true))
                .isInstanceOf(BadRequestException.class);
    }

    // ─── getEventDetails ───────────────────────────────────────────────────────

    @Test
    void getEventDetailsNotFoundThrowsNotFound() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getEventDetails(EVENT_ID, REQUESTER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void getEventDetailsAsUnrelatedUserThrowsForbidden() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, OTHER_ID)));
        when(attendanceRepository.existsById(new AttendanceEntity.Id(EVENT_ID, REQUESTER_ID))).thenReturn(false);

        assertThatThrownBy(() -> service.getEventDetails(EVENT_ID, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void getEventDetailsAsCreatorSucceeds() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, REQUESTER_ID)));

        Event result = service.getEventDetails(EVENT_ID, REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(EVENT_ID);
    }

    @Test
    void getEventDetailsAsAttendeeSucceeds() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, OTHER_ID)));
        when(attendanceRepository.existsById(new AttendanceEntity.Id(EVENT_ID, REQUESTER_ID))).thenReturn(true);

        Event result = service.getEventDetails(EVENT_ID, REQUESTER_ID, false);

        assertThat(result.getId()).isEqualTo(EVENT_ID);
    }

    @Test
    void getEventDetailsAsAdminSucceeds() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, OTHER_ID)));

        Event result = service.getEventDetails(EVENT_ID, REQUESTER_ID, true);

        assertThat(result.getId()).isEqualTo(EVENT_ID);
    }

    // ─── updateEventDetails ──────────────────────────────────────────────────────

    @Test
    void updateEventDetailsNotFoundThrowsNotFound() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateEventDetails(
                        EVENT_ID, new EventPartialUpdate(), REQUESTER_ID, true))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateEventDetailsAsNonCreatorThrowsForbidden() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, OTHER_ID)));

        assertThatThrownBy(() -> service.updateEventDetails(
                        EVENT_ID, new EventPartialUpdate().name("x"), REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void updateEventDetailsAppliesScalarFieldsOnlyWhenPresent() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        ArgumentCaptor<EventEntity> captor = ArgumentCaptor.forClass(EventEntity.class);
        when(eventRepository.save(captor.capture())).thenReturn(entity);

        service.updateEventDetails(EVENT_ID, new EventPartialUpdate().name("Renamed"), REQUESTER_ID, false);

        assertThat(captor.getValue().getName()).isEqualTo("Renamed");
        assertThat(captor.getValue().getDescription()).isEqualTo("desc");
    }

    @Test
    void updateEventDetailsWithEndBeforeStartThrowsBadRequest() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, REQUESTER_ID)));
        // Push start past the existing end time.
        EventPartialUpdate body = new EventPartialUpdate().startTime(odt(END.plusSeconds(3600)));

        assertThatThrownBy(() -> service.updateEventDetails(EVENT_ID, body, REQUESTER_ID, false))
                .isInstanceOf(BadRequestException.class);
        verify(eventRepository, never()).save(any());
    }

    @Test
    void updateEventDetailsWithValidTimePatchSucceeds() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        when(eventRepository.save(any())).thenReturn(entity);
        EventPartialUpdate body = new EventPartialUpdate().startTime(odt(START.plusSeconds(1800)));

        Event result = service.updateEventDetails(EVENT_ID, body, REQUESTER_ID, false);

        assertThat(result).isNotNull();
    }

    @Test
    void updateEventDetailsWithNullListsLeavesLinksUntouched() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        when(eventRepository.save(any())).thenReturn(entity);

        service.updateEventDetails(EVENT_ID, new EventPartialUpdate().name("x"), REQUESTER_ID, false);

        verify(attendanceRepository, never()).deleteAllById_EventId(any());
        verify(attendanceRepository, never()).saveAll(any());
        verify(sportEventRepository, never()).deleteAllById_EventId(any());
        verify(teamEventRepository, never()).deleteAllById_EventId(any());
    }

    @Test
    void updateEventDetailsWithEmptyListClearsLinks() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        when(eventRepository.save(any())).thenReturn(entity);

        service.updateEventDetails(
                EVENT_ID, new EventPartialUpdate().attendees(List.of()), REQUESTER_ID, false);

        verify(attendanceRepository).deleteAllById_EventId(EVENT_ID);
        ArgumentCaptor<List<AttendanceEntity>> captor = listCaptor();
        verify(attendanceRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).isEmpty();
    }

    @Test
    void updateEventDetailsWithPopulatedListReplacesLinks() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        when(eventRepository.save(any())).thenReturn(entity);

        service.updateEventDetails(
                EVENT_ID, new EventPartialUpdate().teamsLinked(List.of(TEAM_ID.toString())), REQUESTER_ID, false);

        verify(teamEventRepository).deleteAllById_EventId(EVENT_ID);
        ArgumentCaptor<List<TeamEventEntity>> captor = listCaptor();
        verify(teamEventRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).extracting(t -> t.getId().getTeamId()).containsExactly(TEAM_ID);
        // Untouched link types are left alone.
        verify(attendanceRepository, never()).deleteAllById_EventId(any());
        verify(sportEventRepository, never()).deleteAllById_EventId(any());
    }

    @Test
    void updateEventDetailsWithNullSportEntryThrowsBadRequest() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));
        List<String> sports = new ArrayList<>();
        sports.add(null);

        assertThatThrownBy(() -> service.updateEventDetails(
                        EVENT_ID, new EventPartialUpdate().sportsLinked(sports), REQUESTER_ID, false))
                .isInstanceOf(BadRequestException.class);
    }

    // ─── deleteEvent ─────────────────────────────────────────────────────────────

    @Test
    void deleteEventNotFoundThrowsNotFound() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deleteEvent(EVENT_ID, REQUESTER_ID, false))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteEventAsNonCreatorThrowsForbidden() {
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(eventEntity(EVENT_ID, OTHER_ID)));

        assertThatThrownBy(() -> service.deleteEvent(EVENT_ID, REQUESTER_ID, false))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void deleteEventAsCreatorRemovesEventAndLinks() {
        EventEntity entity = eventEntity(EVENT_ID, REQUESTER_ID);
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(entity));

        service.deleteEvent(EVENT_ID, REQUESTER_ID, false);

        verify(attendanceRepository).deleteAllById_EventId(EVENT_ID);
        verify(sportEventRepository).deleteAllById_EventId(EVENT_ID);
        verify(teamEventRepository).deleteAllById_EventId(EVENT_ID);
        verify(eventRepository).delete(entity);
    }
}
