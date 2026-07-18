package tum.devoops.letterservice.service;

import io.micrometer.core.instrument.MeterRegistry;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class MailDispatcher {

    private static final Logger LOG = LoggerFactory.getLogger(MailDispatcher.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final MeterRegistry meterRegistry;

    public MailDispatcher(JavaMailSender mailSender,
                           @Value("${spring.mail.username}") String from,
                           MeterRegistry meterRegistry) {
        this.mailSender = mailSender;
        this.from = from;
        this.meterRegistry = meterRegistry;
    }

    @Async
    public void sendAsync(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            meterRegistry.counter("letters_sent_total", "status", "success").increment();
        } catch (MessagingException e) {
            meterRegistry.counter("letters_sent_total", "status", "failure").increment();
            LOG.error("Failed to send mail to {}", to, e);
        }
    }
}
