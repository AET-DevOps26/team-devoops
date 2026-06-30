package tum.devoops.letterservice.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<Void> sendMail(MailRequest mailRequest) {
        letterService.sendMail(mailRequest);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Resource> getPdf(PdfRequest pdfRequest) {
        Resource pdf = letterService.getPdf(pdfRequest);
        return ResponseEntity.status(HttpStatus.OK).body(pdf);
    }
}
