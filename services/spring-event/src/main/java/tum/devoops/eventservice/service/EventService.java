package tum.devoops.eventservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
            List<EventEntity> created = eventRepository.findAllByCreatorId(requesterId);
            Set<UUID> createdIds = created.stream()
                    .map(EventEntity::getId)
                    .collect(Collectors.toSet());

            List<UUID> attendedIds = attendanceRepository.findAllById_MemberId(requesterId).stream()
                    .map(a -> a.getId().getEventId())
                    .filter(id -> !createdIds.contains(id))
                    .collect(Collectors.toList());

            List<EventEntity> attended = attendedIds.isEmpty()
                    ? List.of()
                    : eventRepository.findAllById(attendedIds);

            entities = new ArrayList<>(created);
            entities.addAll(attended);
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

        if ((body.getStartTime() != null || body.getEndTime() != null)
                && !entity.getEndTime().isAfter(entity.getStartTime())) {
            throw new BadRequestException("Event end time must be after start time");
        }

        // null means the field was omitted (no change); a non-null list (including empty) replaces
        // the existing links, so an empty list clears them.
        if (body.getAttendees() != null) {
            attendanceRepository.deleteAllById_EventId(eventId);
            attendanceRepository.saveAll(buildAttendanceEntities(eventId, body.getAttendees()));
        }
        if (body.getSportsLinked() != null) {
            sportEventRepository.deleteAllById_EventId(eventId);
            sportEventRepository.saveAll(buildSportEntities(eventId, body.getSportsLinked()));
        }
        if (body.getTeamsLinked() != null) {
            teamEventRepository.deleteAllById_EventId(eventId);
            teamEventRepository.saveAll(buildTeamEntities(eventId, body.getTeamsLinked()));
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

    private void persistLinks(UUID eventId, List<String> attendees, List<UUID> sports, List<String> teams) {
        if (attendees != null) {
            attendanceRepository.saveAll(buildAttendanceEntities(eventId, attendees));
        }
        if (sports != null) {
            sportEventRepository.saveAll(buildSportEntities(eventId, sports));
        }
        if (teams != null) {
            teamEventRepository.saveAll(buildTeamEntities(eventId, teams));
        }
    }

    private List<AttendanceEntity> buildAttendanceEntities(UUID eventId, List<String> attendees) {
        List<AttendanceEntity> result = new ArrayList<>();
        for (String attendee : attendees) {
            UUID memberId = parseUuid(attendee, "attendees");
            result.add(new AttendanceEntity(new AttendanceEntity.Id(eventId, memberId)));
        }
        return result;
    }

    private List<SportEventEntity> buildSportEntities(UUID eventId, List<UUID> sports) {
        List<SportEventEntity> result = new ArrayList<>();
        for (UUID sport : sports) {
            if (sport == null) {
                throw new BadRequestException("'sports_linked' contains a null entry");
            }
            result.add(new SportEventEntity(new SportEventEntity.Id(eventId, sport)));
        }
        return result;
    }

    private List<TeamEventEntity> buildTeamEntities(UUID eventId, List<String> teams) {
        List<TeamEventEntity> result = new ArrayList<>();
        for (String team : teams) {
            UUID teamId = parseUuid(team, "teams_linked");
            result.add(new TeamEventEntity(new TeamEventEntity.Id(eventId, teamId)));
        }
        return result;
    }

    private boolean isAttendee(UUID eventId, UUID requesterId) {
        return attendanceRepository.existsById(new AttendanceEntity.Id(eventId, requesterId));
    }

    private EventEntity findEventOrThrow(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found: " + eventId));
    }

    private UUID parseUuid(String value, String fieldName) {
        if (value == null) {
            throw new BadRequestException("'" + fieldName + "' contains a null entry");
        }
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
