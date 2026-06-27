package tum.devoops.eventservice.converter;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import tum.devoops.eventservice.entity.AttendanceEntity;
import tum.devoops.eventservice.entity.EventEntity;
import tum.devoops.eventservice.entity.SportEventEntity;
import tum.devoops.eventservice.entity.TeamEventEntity;
import tum.devoops.eventservice.model.Event;
import tum.devoops.eventservice.model.EventSummary;
import tum.devoops.eventservice.model.Reference;

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
                                List<TeamEventEntity> teams,
                                Map<UUID, String> memberNames,
                                Map<UUID, String> sportNames,
                                Map<UUID, String> teamNames) {
        Event event = new Event(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getStartTime().atOffset(ZoneOffset.UTC),
                entity.getEndTime().atOffset(ZoneOffset.UTC),
                reference(entity.getCreatorId(), memberNames)
        );
        event.setAttendees(attendances.stream()
                .map(a -> reference(a.getId().getMemberId(), memberNames))
                .collect(Collectors.toList()));
        event.setSportsLinked(sports.stream()
                .map(s -> reference(s.getId().getSportId(), sportNames))
                .collect(Collectors.toList()));
        event.setTeamsLinked(teams.stream()
                .map(t -> reference(t.getId().getTeamId(), teamNames))
                .collect(Collectors.toList()));
        return event;
    }

    private static Reference reference(UUID id, Map<UUID, String> names) {
        return new Reference(id, names.get(id));
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
