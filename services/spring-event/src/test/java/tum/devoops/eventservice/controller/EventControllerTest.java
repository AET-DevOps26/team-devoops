package tum.devoops.eventservice.controller;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tum.devoops.eventservice.config.SecurityConfig;
import tum.devoops.eventservice.exception.BadRequestException;
import tum.devoops.eventservice.exception.ForbiddenException;
import tum.devoops.eventservice.exception.NotFoundException;
import tum.devoops.eventservice.model.Event;
import tum.devoops.eventservice.model.EventSummary;
import tum.devoops.eventservice.model.Reference;
import tum.devoops.eventservice.service.EventService;

@WebMvcTest(EventController.class)
@Import(SecurityConfig.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EventService eventService;

    private static final UUID REQUESTER_ID = UUID.randomUUID();
    private static final UUID EVENT_ID = UUID.randomUUID();

    private Event sampleEvent() {
        return new Event(EVENT_ID, "Training session", "Weekly practice",
                OffsetDateTime.parse("2026-07-01T10:00:00Z"),
                OffsetDateTime.parse("2026-07-01T12:00:00Z"),
                new Reference(REQUESTER_ID, "Casey Creator"));
    }

    private EventSummary sampleSummary() {
        return new EventSummary(EVENT_ID, "Training session",
                OffsetDateTime.parse("2026-07-01T10:00:00Z"),
                OffsetDateTime.parse("2026-07-01T12:00:00Z"));
    }

    private String eventCreateJson(String name) {
        return "{\"name\":\"" + name + "\","
                + "\"start_time\":\"2026-07-01T10:00:00Z\","
                + "\"end_time\":\"2026-07-01T12:00:00Z\"}";
    }

    private static RequestPostProcessor memberJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_member"));
    }

    private static RequestPostProcessor adminJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_admin"));
    }

    private static RequestPostProcessor trainerJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_trainer"));
    }

    // ─── GET /events ──────────────────────────────────────────────────────────

    @Test
    void getAllEventsWithoutAuthReturns401() throws Exception {
        mockMvc.perform(get("/events"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllEventsWithAuthReturns200AndList() throws Exception {
        when(eventService.getAllEvents(REQUESTER_ID, false)).thenReturn(List.of(sampleSummary()));

        mockMvc.perform(get("/events")
                        .with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].start_time").exists())
                .andExpect(jsonPath("$[0].end_time").exists());
    }

    @Test
    void getAllEventsAsAdminPassesIsAdminTrue() throws Exception {
        when(eventService.getAllEvents(any(), eq(true))).thenReturn(List.of());

        mockMvc.perform(get("/events")
                        .with(adminJwt()))
                .andExpect(status().isOk());

        verify(eventService).getAllEvents(REQUESTER_ID, true);
    }

    // ─── POST /events ─────────────────────────────────────────────────────────

    @Test
    void createEventWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventCreateJson("Training session")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createEventWithAuthReturns201AndBody() throws Exception {
        when(eventService.createEvent(any(), eq(REQUESTER_ID), eq(false))).thenReturn(sampleEvent());

        mockMvc.perform(post("/events")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventCreateJson("Training session")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.creator").exists())
                .andExpect(jsonPath("$.start_time").exists())
                .andExpect(jsonPath("$.end_time").exists());
    }

    @Test
    void createEventServiceThrowsForbiddenReturns403() throws Exception {
        when(eventService.createEvent(any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(post("/events")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventCreateJson("x")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createEventServiceThrowsBadRequestReturns400() throws Exception {
        when(eventService.createEvent(any(), any(), anyBoolean()))
                .thenThrow(new BadRequestException("Invalid event"));

        mockMvc.perform(post("/events")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventCreateJson("x")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── GET /events/{id} ─────────────────────────────────────────────────────

    @Test
    void getEventDetailsWithoutAuthReturns401() throws Exception {
        mockMvc.perform(get("/events/{id}", EVENT_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getEventDetailsWithAuthReturns200AndBody() throws Exception {
        when(eventService.getEventDetails(EVENT_ID, REQUESTER_ID, false)).thenReturn(sampleEvent());

        mockMvc.perform(get("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    void getEventDetailsServiceThrowsNotFoundReturns404() throws Exception {
        when(eventService.getEventDetails(any(), any(), anyBoolean()))
                .thenThrow(new NotFoundException("Not found"));

        mockMvc.perform(get("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void getEventDetailsServiceThrowsForbiddenReturns403() throws Exception {
        when(eventService.getEventDetails(any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(get("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── PATCH /events/{id} ───────────────────────────────────────────────────

    @Test
    void updateEventDetailsWithoutAuthReturns401() throws Exception {
        mockMvc.perform(patch("/events/{id}", EVENT_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"updated\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateEventDetailsWithAuthReturns200AndBody() throws Exception {
        when(eventService.updateEventDetails(eq(EVENT_ID), any(), eq(REQUESTER_ID), eq(false)))
                .thenReturn(sampleEvent());

        mockMvc.perform(patch("/events/{id}", EVENT_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"updated\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void updateEventDetailsServiceThrowsForbiddenReturns403() throws Exception {
        when(eventService.updateEventDetails(any(), any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(patch("/events/{id}", EVENT_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"x\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void updateEventDetailsServiceThrowsNotFoundReturns404() throws Exception {
        when(eventService.updateEventDetails(any(), any(), any(), anyBoolean()))
                .thenThrow(new NotFoundException("Not found"));

        mockMvc.perform(patch("/events/{id}", EVENT_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"x\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── DELETE /events/{id} ──────────────────────────────────────────────────

    @Test
    void deleteEventWithoutAuthReturns401() throws Exception {
        mockMvc.perform(delete("/events/{id}", EVENT_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteEventWithAuthReturns204() throws Exception {
        mockMvc.perform(delete("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteEventServiceThrowsForbiddenReturns403() throws Exception {
        doThrow(new ForbiddenException("Access denied"))
                .when(eventService).deleteEvent(any(), any(), anyBoolean());

        mockMvc.perform(delete("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void deleteEventServiceThrowsNotFoundReturns404() throws Exception {
        doThrow(new NotFoundException("Not found"))
                .when(eventService).deleteEvent(any(), any(), anyBoolean());

        mockMvc.perform(delete("/events/{id}", EVENT_ID)
                        .with(memberJwt()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── @PreAuthorize role checks ──────────────────────────────────────────────

    @Test
    void getAllEventsWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/events")
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void createEventWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(post("/events")
                        .with(trainerJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventCreateJson("x")))
                .andExpect(status().isForbidden());
    }

    @Test
    void getEventDetailsWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/events/{id}", EVENT_ID)
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateEventDetailsWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(patch("/events/{id}", EVENT_ID)
                        .with(trainerJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"x\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteEventWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(delete("/events/{id}", EVENT_ID)
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }
}
