package tum.devoops.eventservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.eventservice.api.EventsApi;
import tum.devoops.eventservice.model.Event;
import tum.devoops.eventservice.model.EventCreate;
import tum.devoops.eventservice.model.EventPartialUpdate;
import tum.devoops.eventservice.model.EventSummary;
import tum.devoops.eventservice.service.EventService;

@RestController
@PreAuthorize("hasAnyRole('admin', 'member')")
public class EventController implements EventsApi {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @Override
    public ResponseEntity<List<EventSummary>> getAllEvents() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(eventService.getAllEvents(requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Event> createEvent(EventCreate eventCreate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        Event created = eventService.createEvent(eventCreate, requesterId, isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Override
    public ResponseEntity<Event> getEventDetails(UUID eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(eventService.getEventDetails(eventId, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Event> updateEventDetails(UUID eventId, EventPartialUpdate eventPartialUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(eventService.updateEventDetails(eventId, eventPartialUpdate, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Void> deleteEvent(UUID eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        eventService.deleteEvent(eventId, requesterId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    private UUID extractRequesterId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return UUID.fromString(jwt.getSubject());
    }

    private boolean extractIsAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_admin".equals(a.getAuthority()));
    }
}
