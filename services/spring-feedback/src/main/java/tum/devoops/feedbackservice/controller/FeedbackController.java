package tum.devoops.feedbackservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.feedbackservice.api.FeedbackApi;
import tum.devoops.feedbackservice.model.Feedback;
import tum.devoops.feedbackservice.model.FeedbackCreate;
import tum.devoops.feedbackservice.model.FeedbackPartialUpdate;
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
    public ResponseEntity<Feedback> createFeedback(FeedbackCreate feedbackCreate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        Feedback created = feedbackService.createFeedback(feedbackCreate, requesterId, isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Override
    public ResponseEntity<Feedback> getFeedbackDetails(UUID feedbackId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(feedbackService.getFeedbackDetails(feedbackId, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Feedback> updateFeedbackDetails(UUID feedbackId, FeedbackPartialUpdate feedbackPartialUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(feedbackService.updateFeedbackDetails(feedbackId, feedbackPartialUpdate, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Void> deleteFeedback(UUID feedbackId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        feedbackService.deleteFeedback(feedbackId, requesterId, isAdmin);
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
