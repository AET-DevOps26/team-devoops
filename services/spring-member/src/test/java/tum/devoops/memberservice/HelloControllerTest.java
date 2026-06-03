package tum.devoops.memberservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import tum.devoops.memberservice.config.SecurityConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HelloController.class)
@Import(SecurityConfig.class)
class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "member")
    void helloReturnsExpectedMessage() throws Exception {
        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello world from member-service!"));
    }

    @Test
    @WithMockUser(roles = "admin")
    void helloAdminReturnsExpectedMessage() throws Exception {
        mockMvc.perform(get("/helloAdmin"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello world to admin from member-service!"));
    }

    @Test
    @WithMockUser(roles = "member")
    void helloAdminForbiddenForMember() throws Exception {
        mockMvc.perform(get("/helloAdmin"))
                .andExpect(status().isForbidden());
    }

}
