package tum.devoops.letterservice.controller;

import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import tum.devoops.letterservice.api.LettersApi;
import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;
import tum.devoops.letterservice.service.LetterService;

@RestController
@PreAuthorize("hasAnyRole('admin', 'director', 'trainer')")
public class LetterController implements LettersApi {

    private final LetterService letterService;

    public LetterController(LetterService letterService) {
        this.letterService = letterService;
    }

    @Override
    @PostMapping(value = "/letters/mail", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> sendMail(@Valid @RequestBody MailRequest mailRequest) {
        letterService.sendMail(mailRequest);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping(
        value = "/letters/pdf",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = { "application/pdf", MediaType.APPLICATION_JSON_VALUE }
    )
    public ResponseEntity<Resource> getPdf(@Valid @RequestBody PdfRequest pdfRequest) {
        Resource pdf = letterService.getPdf(pdfRequest);
        return ResponseEntity.status(HttpStatus.OK).body(pdf);
    }
}
