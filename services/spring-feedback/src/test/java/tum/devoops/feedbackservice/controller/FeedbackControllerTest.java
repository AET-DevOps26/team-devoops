package tum.devoops.feedbackservice.controller;

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

import tum.devoops.feedbackservice.config.SecurityConfig;
import tum.devoops.feedbackservice.exception.BadRequestException;
import tum.devoops.feedbackservice.exception.ForbiddenException;
import tum.devoops.feedbackservice.exception.NotFoundException;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackSummary;
import tum.devoops.feedbackservice.model.Reference;
import tum.devoops.feedbackservice.service.FeedbackService;

@WebMvcTest(FeedbackController.class)
@Import(SecurityConfig.class)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FeedbackService feedbackService;

    private static final UUID REQUESTER_ID = UUID.randomUUID();
    private static final UUID FEEDBACK_ID = UUID.randomUUID();
    private static final UUID EVENT_ID = UUID.randomUUID();
    private static final UUID MEMBER_ID = UUID.randomUUID();

    private Feedback sampleFeedback() {
        return new Feedback(FEEDBACK_ID, new Reference(EVENT_ID, "Training"),
                new Reference(MEMBER_ID, "Mary Member"),
                new Reference(REQUESTER_ID, "Casey Creator"), OffsetDateTime.now(), "Great work!");
    }

    private FeedbackSummary sampleSummary() {
        return new FeedbackSummary(FEEDBACK_ID, new Reference(EVENT_ID, "Training"),
                new Reference(MEMBER_ID, "Mary Member"),
                new Reference(REQUESTER_ID, "Casey Creator"), OffsetDateTime.now());
    }

    private String feedbackCreateJson(UUID eventId, UUID memberId, String text) {
        return "{\"event\":\"" + eventId + "\",\"member\":\"" + memberId + "\",\"feedback\":\"" + text + "\"}";
    }

    private static RequestPostProcessor memberJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_member"));
    }

    private static RequestPostProcessor trainerJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_trainer"));
    }

    // ─── GET /feedback ────────────────────────────────────────────────────────

    @Test
    void getAllFeedbackWithoutAuthReturns401() throws Exception {
        mockMvc.perform(get("/feedback"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllFeedbackWithAuthReturns200AndList() throws Exception {
        when(feedbackService.getAllFeedback(REQUESTER_ID, false)).thenReturn(List.of(sampleSummary()));

        mockMvc.perform(get("/feedback")
                        .with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].event").exists())
                .andExpect(jsonPath("$[0].member").exists())
                .andExpect(jsonPath("$[0].creator").exists());
    }

    @Test
    void getAllFeedbackAsAdminPassesIsAdminTrue() throws Exception {
        when(feedbackService.getAllFeedback(any(), eq(true))).thenReturn(List.of());

        mockMvc.perform(get("/feedback")
                        .with(jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))))
                .andExpect(status().isOk());

        verify(feedbackService).getAllFeedback(REQUESTER_ID, true);
    }

    // ─── POST /feedback ───────────────────────────────────────────────────────

    @Test
    void createFeedbackWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(feedbackCreateJson(EVENT_ID, MEMBER_ID, "x")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createFeedbackWithAuthReturns201AndBody() throws Exception {
        when(feedbackService.createFeedback(any(), eq(REQUESTER_ID), eq(false))).thenReturn(sampleFeedback());

        mockMvc.perform(post("/feedback")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(feedbackCreateJson(EVENT_ID, MEMBER_ID, "Great!")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.event").exists())
                .andExpect(jsonPath("$.member").exists())
                .andExpect(jsonPath("$.creator").exists())
                .andExpect(jsonPath("$.feedback").exists());
    }

    @Test
    void createFeedbackServiceThrowsForbiddenReturns403() throws Exception {
        when(feedbackService.createFeedback(any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(post("/feedback")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(feedbackCreateJson(EVENT_ID, MEMBER_ID, "x")))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void createFeedbackServiceThrowsBadRequestReturns400() throws Exception {
        when(feedbackService.createFeedback(any(), any(), anyBoolean()))
                .thenThrow(new BadRequestException("Event not found"));

        mockMvc.perform(post("/feedback")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(feedbackCreateJson(EVENT_ID, MEMBER_ID, "x")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── GET /feedback/{id} ───────────────────────────────────────────────────

    @Test
    void getFeedbackDetailsWithoutAuthReturns401() throws Exception {
        mockMvc.perform(get("/feedback/{id}", FEEDBACK_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getFeedbackDetailsWithAuthReturns200AndBody() throws Exception {
        when(feedbackService.getFeedbackDetails(FEEDBACK_ID, REQUESTER_ID, false)).thenReturn(sampleFeedback());

        mockMvc.perform(get("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.feedback").exists());
    }

    @Test
    void getFeedbackDetailsServiceThrowsNotFoundReturns404() throws Exception {
        when(feedbackService.getFeedbackDetails(any(), any(), anyBoolean()))
                .thenThrow(new NotFoundException("Not found"));

        mockMvc.perform(get("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void getFeedbackDetailsServiceThrowsForbiddenReturns403() throws Exception {
        when(feedbackService.getFeedbackDetails(any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(get("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── PATCH /feedback/{id} ─────────────────────────────────────────────────

    @Test
    void updateFeedbackDetailsWithoutAuthReturns401() throws Exception {
        mockMvc.perform(patch("/feedback/{id}", FEEDBACK_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"feedback\":\"updated\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateFeedbackDetailsWithAuthReturns200AndBody() throws Exception {
        when(feedbackService.updateFeedbackDetails(eq(FEEDBACK_ID), any(), eq(REQUESTER_ID), eq(false)))
                .thenReturn(sampleFeedback());

        mockMvc.perform(patch("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"feedback\":\"updated\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void updateFeedbackDetailsServiceThrowsForbiddenReturns403() throws Exception {
        when(feedbackService.updateFeedbackDetails(any(), any(), any(), anyBoolean()))
                .thenThrow(new ForbiddenException("Access denied"));

        mockMvc.perform(patch("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"feedback\":\"x\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void updateFeedbackDetailsServiceThrowsNotFoundReturns404() throws Exception {
        when(feedbackService.updateFeedbackDetails(any(), any(), any(), anyBoolean()))
                .thenThrow(new NotFoundException("Not found"));

        mockMvc.perform(patch("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"feedback\":\"x\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── DELETE /feedback/{id} ────────────────────────────────────────────────

    @Test
    void deleteFeedbackWithoutAuthReturns401() throws Exception {
        mockMvc.perform(delete("/feedback/{id}", FEEDBACK_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteFeedbackWithAuthReturns204() throws Exception {
        mockMvc.perform(delete("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteFeedbackServiceThrowsForbiddenReturns403() throws Exception {
        doThrow(new ForbiddenException("Access denied"))
                .when(feedbackService).deleteFeedback(any(), any(), anyBoolean());

        mockMvc.perform(delete("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void deleteFeedbackServiceThrowsNotFoundReturns404() throws Exception {
        doThrow(new NotFoundException("Not found"))
                .when(feedbackService).deleteFeedback(any(), any(), anyBoolean());

        mockMvc.perform(delete("/feedback/{id}", FEEDBACK_ID)
                        .with(memberJwt()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    // ─── @PreAuthorize role checks ────────────────────────────────────────────

    @Test
    void getAllFeedbackWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/feedback")
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void createFeedbackWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(post("/feedback")
                        .with(trainerJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(feedbackCreateJson(EVENT_ID, MEMBER_ID, "x")))
                .andExpect(status().isForbidden());
    }

    @Test
    void getFeedbackDetailsWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/feedback/{id}", FEEDBACK_ID)
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateFeedbackDetailsWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(patch("/feedback/{id}", FEEDBACK_ID)
                        .with(trainerJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"feedback\":\"x\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteFeedbackWithWrongRoleReturns403() throws Exception {
        mockMvc.perform(delete("/feedback/{id}", FEEDBACK_ID)
                        .with(trainerJwt()))
                .andExpect(status().isForbidden());
    }
}
