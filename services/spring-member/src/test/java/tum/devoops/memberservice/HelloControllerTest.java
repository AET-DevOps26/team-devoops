package tum.devoops.memberservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import tum.devoops.memberservice.config.SecurityConfig;
import tum.devoops.memberservice.controller.HelloController;

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

    @Test
    void helloWithJwtMemberRoleReturns200() throws Exception {
        mockMvc.perform(get("/hello")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_member"))))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello world from member-service!"));
    }

    @Test
    void helloAdminWithJwtAdminRoleReturns200() throws Exception {
        mockMvc.perform(get("/helloAdmin")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_admin"))))
                .andExpect(status().isOk())
                .andExpect(content().string("Hello world to admin from member-service!"));
    }

    @Test
    void helloAdminWithJwtMemberRoleReturns403() throws Exception {
        mockMvc.perform(get("/helloAdmin")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_member"))))
                .andExpect(status().isForbidden());
    }

}
