package tum.devoops.memberservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tum.devoops.memberservice.config.SecurityConfig;
import tum.devoops.memberservice.controller.MemberController;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemberController.class)
@Import(SecurityConfig.class)
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MemberService memberService;

    @Test
    @WithMockUser(roles = "member")
    void getMembersAllowedForMember() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    void getMembersAllowedForAdmin() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "guest")
    void getMembersForbiddenForWrongRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void getMembersUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "member")
    void getMembersContentType() throws Exception {
        List<MemberSummary> list = List.of();
        when(memberService.getAllMembers()).thenReturn(list);

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMembersEmptyList() throws Exception {
        List<MemberSummary> list = List.of();
        when(memberService.getAllMembers()).thenReturn(list);

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMemberNonEmptyList() throws Exception {
        MemberSummary alice = new MemberSummary(UUID.randomUUID(), "Alice", "Aberdeen", "alice.aberdeen@example.com");
        MemberSummary bob = new MemberSummary(UUID.randomUUID(), "Bob", "Builder", "bob.the.builder@example.com");
        List<MemberSummary> list = List.of(alice, bob);
        when(memberService.getAllMembers()).thenReturn(list);

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(list)));
    }

}
