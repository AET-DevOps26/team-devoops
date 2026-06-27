package tum.devoops.eventservice.converter;

import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

import tum.devoops.eventservice.entity.AttendanceEntity;
import tum.devoops.eventservice.entity.EventEntity;
import tum.devoops.eventservice.entity.SportEventEntity;
import tum.devoops.eventservice.entity.TeamEventEntity;
import tum.devoops.eventservice.model.Event;
import tum.devoops.eventservice.model.EventSummary;

/**
 * Maps {@link EventEntity} (and its link entities) to the API models.
 *
 * <p>Stateless and dependency-free: callers supply the already-fetched link entities so this
 * converter performs no data access.
 */
public final class EventConverter {

    private EventConverter() {
    }

    public static Event toEvent(EventEntity entity,
                                List<AttendanceEntity> attendances,
                                List<SportEventEntity> sports,
                                List<TeamEventEntity> teams) {
        Event event = new Event(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getStartTime().atOffset(ZoneOffset.UTC),
                entity.getEndTime().atOffset(ZoneOffset.UTC),
                entity.getCreatorId().toString()
        );
        event.setAttendees(attendances.stream()
                .map(a -> a.getId().getMemberId().toString())
                .collect(Collectors.toList()));
        event.setSportsLinked(sports.stream()
                .map(s -> s.getId().getSportId())
                .collect(Collectors.toList()));
        event.setTeamsLinked(teams.stream()
                .map(t -> t.getId().getTeamId().toString())
                .collect(Collectors.toList()));
        return event;
    }

    public static EventSummary toSummary(EventEntity entity) {
        return new EventSummary(
                entity.getId(),
                entity.getName(),
                entity.getStartTime().atOffset(ZoneOffset.UTC),
                entity.getEndTime().atOffset(ZoneOffset.UTC)
        );
    }
}
