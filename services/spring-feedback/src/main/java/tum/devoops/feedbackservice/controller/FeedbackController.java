package tum.devoops.feedbackservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.feedbackservice.api.FeedbackApi;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackSummary;
import tum.devoops.feedbackservice.service.FeedbackService;

@RestController
public class FeedbackController implements FeedbackApi {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @Override
    public ResponseEntity<List<FeedbackSummary>> getAllFeedback() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(feedbackService.getAllFeedback(requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Feedback> getFeedbackDetails(UUID feedbackId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(feedbackService.getFeedbackDetails(feedbackId, requesterId, isAdmin));
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
