package tum.devoops.letterservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import tum.devoops.letterservice.config.SecurityConfig;
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

    private static final String MAIL_JSON = """
            {"subject":"Hello","template":"<p>Hi {{first_name}}</p>"}
            """;

    private static final String PDF_JSON = """
            {"template":"<p>Hi {{first_name}}</p>"}
            """;

    private static final ByteArrayResource DUMMY_PDF =
            new ByteArrayResource("%PDF-1.4 dummy".getBytes());

    // --- sendMail ---

    @Test
    void sendMailWithAdminReturns204() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_admin")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailWithDirectorReturns204() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_director")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailWithTrainerReturns204() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_trainer")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void sendMailDelegatesToService() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_admin")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isNoContent());

        verify(letterService).sendMail(any(MailRequest.class));
    }

    @Test
    void sendMailWithTraineeReturns403() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_trainee")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void sendMailWithMemberReturns403() throws Exception {
        mockMvc.perform(post("/letters/mail")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_member")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(MAIL_JSON))
                .andExpect(status().isForbidden());
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
        when(letterService.getPdf(any())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_admin")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getPdfWithDirectorReturns200() throws Exception {
        when(letterService.getPdf(any())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_director")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getPdfWithTrainerReturns200() throws Exception {
        when(letterService.getPdf(any())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_trainer")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getPdfDelegatesToService() throws Exception {
        when(letterService.getPdf(any())).thenReturn(DUMMY_PDF);

        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_admin")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isOk());

        verify(letterService).getPdf(any(PdfRequest.class));
    }

    @Test
    void getPdfWithTraineeReturns403() throws Exception {
        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_trainee")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getPdfWithMemberReturns403() throws Exception {
        mockMvc.perform(post("/letters/pdf")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_member")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void getPdfWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/letters/pdf")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(PDF_JSON))
                .andExpect(status().isUnauthorized());
    }
}
