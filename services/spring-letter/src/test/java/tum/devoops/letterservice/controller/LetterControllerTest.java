package tum.devoops.letterservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import tum.devoops.letterservice.config.SecurityConfig;
import tum.devoops.letterservice.exception.ForbiddenException;
import tum.devoops.letterservice.exception.MailDeliveryException;
import tum.devoops.letterservice.exception.PdfGenerationException;
import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;
import tum.devoops.letterservice.service.LetterService;

@WebMvcTest(LetterController.class)
@Import(SecurityConfig.class)
class LetterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LetterService letterService;

    private static final UUID REQUESTER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private static final String MAIL_JSON = """
            {"subject":"Hello","template":"<p>Hi {{first_name}}</p>"}
            """;

    private static final String PDF_JSON = """
            {"template":"<p>Hi {{first_name}}</p>"}
            """;

    private static final ByteArrayResource DUMMY_PDF =
            new ByteArrayResource("%PDF-1.4 dummy".getBytes());

    private JwtRequestPostProcessor adminJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_admin"));
    }

    private JwtRequestPostProcessor memberJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_member"));
    }

    // --- sendMail ---

    @Test
    void sendMailWithAdminReturns204() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailWithMemberReturns204() throws Exception {
        // The controller only gates on realm roles (admin/member); LetterService decides
        // director/trainer/trainee access itself, so any authenticated member reaches it.
        mockMvc.perform(post("/letters/mail")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailDelegatesToService() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());

        verify(letterService).sendMail(any(MailRequest.class), eq(REQUESTER_ID), eq(true));
    }

    @Test
    void sendMailWhenServiceRejectsReturns403WithMessage() throws Exception {
        doThrow(new ForbiddenException("Only admins, directors, or trainers can use the letter service."))
                .when(letterService).sendMail(any(MailRequest.class), eq(REQUESTER_ID), eq(false));

        mockMvc.perform(post("/letters/mail")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Only admins, directors, or trainers can use the letter service."));
    }

    @Test
    void sendMailWhenServiceThrowsMailDeliveryReturns500WithMessage() throws Exception {
        doThrow(new MailDeliveryException("Failed to send mail to a@example.com", new Exception("boom")))
                .when(letterService).sendMail(any(MailRequest.class), eq(REQUESTER_ID), eq(true));

        mockMvc.perform(post("/letters/mail")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to send mail to a@example.com"));
    }

    @Test
    void sendMailWithEmptySubjectReturns400() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"subject":"","template":"<p>Hi</p>"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].message").value("subject: size must be between 1 and 2147483647"));
    }

    @Test
    void sendMailWithEmptyTemplateReturns204() throws Exception {
        // Only the subject must be non-empty; an empty template is a valid (if pointless) letter body.
        mockMvc.perform(post("/letters/mail")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"subject":"Hello","template":""}
                                """))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isUnauthorized());
    }

    // --- getPdf ---

    @Test
    void getPdfWithAdminReturns200() throws Exception {
        when(letterService.getPdf(any(), any(), anyBoolean())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getPdfWithMemberReturns200() throws Exception {
        when(letterService.getPdf(any(), any(), anyBoolean())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getPdfDelegatesToService() throws Exception {
        when(letterService.getPdf(any(), any(), anyBoolean())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());

        verify(letterService).getPdf(any(PdfRequest.class), eq(REQUESTER_ID), eq(true));
    }

    @Test
    void getPdfWhenServiceRejectsReturns403WithMessage() throws Exception {
        when(letterService.getPdf(any(), eq(REQUESTER_ID), eq(false)))
                .thenThrow(new ForbiddenException("Only admins, directors, or trainers can use the letter service."));

        mockMvc.perform(post("/letters/pdf")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message")
                        .value("Only admins, directors, or trainers can use the letter service."));
    }

    @Test
    void getPdfWhenServiceThrowsPdfGenerationReturns500WithMessage() throws Exception {
        when(letterService.getPdf(any(), eq(REQUESTER_ID), eq(true)))
                .thenThrow(new PdfGenerationException("Failed to generate PDF", new Exception("boom")));

        mockMvc.perform(post("/letters/pdf")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to generate PDF"));
    }

    @Test
    void getPdfWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/letters/pdf")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isUnauthorized());
    }
}
