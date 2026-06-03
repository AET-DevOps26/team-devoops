package tum.devoops.letterservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tum.devoops.letterservice.config.SecurityConfig;

@WebMvcTest(HelloController.class)
@Import(SecurityConfig.class)
class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    void helloReturnsExpectedMessage() throws Exception {
        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello world from letter-service!"));
    }

    @Test
    void helloRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/hello"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void helloWithValidJwt_returns200() throws Exception {
        mockMvc.perform(get("/hello").with(jwt()))
                .andExpect(status().isOk());
    }

}
