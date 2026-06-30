package tum.devoops.letterservice.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;

@Service
public class LetterService {

    private static final byte[] DUMMY_PDF = "%PDF-1.4 dummy".getBytes();

    public void sendMail(MailRequest mailRequest) {
        // stub: no-op
    }

    public Resource getPdf(PdfRequest pdfRequest) {
        return new ByteArrayResource(DUMMY_PDF);
    }
}
