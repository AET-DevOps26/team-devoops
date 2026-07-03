package tum.devoops.letterservice.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.letterservice.api.LettersApi;
import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;
import tum.devoops.letterservice.service.LetterService;

import java.util.UUID;

/**
 * Membership roles (director/trainer/trainee) aren't Spring Security authorities in this
 * codebase — they only exist as rows in the organization schema. This controller only gates on
 * the realm roles (admin/member); {@link LetterService} does the director/trainer check itself
 * against those rows, same as e.g. TransactionService/FeedbackService.
 */
@RestController
@PreAuthorize("hasAnyRole('admin', 'member')")
public class LetterController implements LettersApi {

    private final LetterService letterService;

    public LetterController(LetterService letterService) {
        this.letterService = letterService;
    }

    @Override
    public ResponseEntity<Void> sendMail(MailRequest mailRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        letterService.sendMail(mailRequest, extractRequesterId(auth), extractIsAdmin(auth));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Resource> getPdf(PdfRequest pdfRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Resource pdf = letterService.getPdf(pdfRequest, extractRequesterId(auth), extractIsAdmin(auth));
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"letters.pdf\"")
                .body(pdf);
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
