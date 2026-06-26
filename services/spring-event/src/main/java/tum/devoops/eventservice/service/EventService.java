package tum.devoops.eventservice.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.eventservice.converter.EventConverter;
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

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private SportEventRepository sportEventRepository;
    @Autowired
    private TeamEventRepository teamEventRepository;

    @Transactional(readOnly = true)
    public List<EventSummary> getAllEvents(UUID requesterId, boolean isAdmin) {
        List<EventEntity> entities;
        if (isAdmin) {
            entities = eventRepository.findAll();
        } else {
            Map<UUID, EventEntity> byId = new LinkedHashMap<>();
            for (EventEntity entity : eventRepository.findAllByCreatorId(requesterId)) {
                byId.putIfAbsent(entity.getId(), entity);
            }
            for (AttendanceEntity attendance : attendanceRepository.findAllById_MemberId(requesterId)) {
                UUID eventId = attendance.getId().getEventId();
                if (!byId.containsKey(eventId)) {
                    eventRepository.findById(eventId).ifPresent(e -> byId.put(eventId, e));
                }
            }
            entities = new ArrayList<>(byId.values());
        }
        return entities.stream().map(EventConverter::toSummary).collect(Collectors.toList());
    }

    @Transactional
    public Event createEvent(EventCreate body, UUID requesterId, boolean isAdmin) {
        if (body.getStartTime() == null || body.getEndTime() == null
                || !body.getEndTime().isAfter(body.getStartTime())) {
            throw new BadRequestException("Event end time must be after start time");
        }

        EventEntity entity = new EventEntity();
        entity.setName(body.getName());
        entity.setDescription(body.getDescription());
        entity.setStartTime(body.getStartTime().toInstant());
        entity.setEndTime(body.getEndTime().toInstant());
        entity.setCreatorId(requesterId);

        EventEntity saved = eventRepository.save(entity);
        persistLinks(saved.getId(), body.getAttendees(), body.getSportsLinked(), body.getTeamsLinked());

        return toEvent(saved);
    }

    @Transactional(readOnly = true)
    public Event getEventDetails(UUID eventId, UUID requesterId, boolean isAdmin) {
        EventEntity entity = findEventOrThrow(eventId);
        boolean isCreator = requesterId.equals(entity.getCreatorId());
        if (!isAdmin && !isCreator && !isAttendee(eventId, requesterId)) {
            throw new ForbiddenException("Access denied");
        }
        return toEvent(entity);
    }

    @Transactional
    public Event updateEventDetails(UUID eventId, EventPartialUpdate body, UUID requesterId, boolean isAdmin) {
        EventEntity entity = findEventOrThrow(eventId);
        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Access denied");
        }

        if (body.getName() != null) {
            entity.setName(body.getName());
        }
        if (body.getDescription() != null) {
            entity.setDescription(body.getDescription());
        }
        if (body.getStartTime() != null) {
            entity.setStartTime(body.getStartTime().toInstant());
        }
        if (body.getEndTime() != null) {
            entity.setEndTime(body.getEndTime().toInstant());
        }

        return toEvent(eventRepository.save(entity));
    }

    @Transactional
    public void deleteEvent(UUID eventId, UUID requesterId, boolean isAdmin) {
        EventEntity entity = findEventOrThrow(eventId);
        if (!isAdmin && !requesterId.equals(entity.getCreatorId())) {
            throw new ForbiddenException("Access denied");
        }
        attendanceRepository.deleteAllById_EventId(eventId);
        sportEventRepository.deleteAllById_EventId(eventId);
        teamEventRepository.deleteAllById_EventId(eventId);
        eventRepository.delete(entity);
    }

    private void persistLinks(UUID eventId, List<String> attendees, List<String> sports, List<String> teams) {
        if (attendees != null) {
            for (String attendee : attendees) {
                UUID memberId = parseUuid(attendee, "attendees");
                attendanceRepository.save(new AttendanceEntity(new AttendanceEntity.Id(eventId, memberId)));
            }
        }
        if (sports != null) {
            for (String sport : sports) {
                sportEventRepository.save(new SportEventEntity(new SportEventEntity.Id(eventId, sport)));
            }
        }
        if (teams != null) {
            for (String team : teams) {
                UUID teamId = parseUuid(team, "teams_linked");
                teamEventRepository.save(new TeamEventEntity(new TeamEventEntity.Id(eventId, teamId)));
            }
        }
    }

    private boolean isAttendee(UUID eventId, UUID requesterId) {
        return attendanceRepository.findAllById_EventId(eventId).stream()
                .anyMatch(a -> requesterId.equals(a.getId().getMemberId()));
    }

    private EventEntity findEventOrThrow(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found: " + eventId));
    }

    private UUID parseUuid(String value, String fieldName) {
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid UUID for '" + fieldName + "': " + value);
        }
    }

    private Event toEvent(EventEntity entity) {
        UUID eventId = entity.getId();
        return EventConverter.toEvent(
                entity,
                attendanceRepository.findAllById_EventId(eventId),
                sportEventRepository.findAllById_EventId(eventId),
                teamEventRepository.findAllById_EventId(eventId)
        );
    }
}
