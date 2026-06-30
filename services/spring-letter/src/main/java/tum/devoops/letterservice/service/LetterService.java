package tum.devoops.letterservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;

@Service
public class LetterService {

    private static final byte[] DUMMY_PDF = "%PDF-1.4 dummy".getBytes();

    private JavaMailSender mailSender;
    private final String from;

    public LetterService(JavaMailSender mailSender,
                        @Value("${spring.mail.username}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendText(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    /** HTML email. */
    public void sendHtml(String to, String subject, String html) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true); // true = treat body as HTML
        mailSender.send(message);
    }

    public void sendMail(MailRequest mailRequest) {
        sendText("fabianheinrich02@gmail.com", "Erster Testdurchlauf", "Burschen Heraus!");
    }

    public Resource getPdf(PdfRequest pdfRequest) {
        return new ByteArrayResource(DUMMY_PDF);
    }
}
