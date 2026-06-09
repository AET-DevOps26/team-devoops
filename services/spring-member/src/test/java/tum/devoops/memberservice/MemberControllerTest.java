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
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
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

    // Test cases for createMember() endpoint

    // Verifies that a user with role "member" is allowed to get all members
    @Test
    @WithMockUser(roles = "member")
    void getMembersAllowedForMember() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    // Verifies that a user wit role "admin" is allowed to get all members
    @Test
    @WithMockUser(roles = "admin")
    void getMembersAllowedForAdmin() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    // Verifies that a user with a role other than "admin" and "member" is not allowed to get all members (401 forbidden)
    @Test
    @WithMockUser(roles = "guest")
    void getMembersForbiddenForWrongRole() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to get all members (403 unauthorized)
    @Test
    @WithAnonymousUser
    void getMembersUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isUnauthorized());
    }

    // Verifies that the content type of the response is application/json
    @Test
    @WithMockUser(roles = "member")
    void getMembersContentType() throws Exception {
        List<MemberSummary> list = List.of();
        when(memberService.getAllMembers()).thenReturn(list);

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Verifies that the endpoint returns an empty list if there are no members
    @Test
    @WithMockUser(roles = "member")
    void getMembersEmptyList() throws Exception {
        List<MemberSummary> list = List.of();
        when(memberService.getAllMembers()).thenReturn(list);

        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    // Verifies that the endpoint returns the list of members correctly when the list is not empty
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

    // Test cases for getMemberById() endpoint

    // Verifies that a user with role "member" is allowed to retrieve a member by ID
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdAllowedForMember() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get(String.format("/%s", randomId), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with role "admin" is allowed to retrieve a member by ID
    @Test
    @WithMockUser(roles = "admin")
    void getMemberByIdAllowedForAdmin() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get(String.format("/%s", randomId), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with a role other than admin and member is not allowed to get a member by ID (403 forbidden)
    @Test
    @WithMockUser(roles = "guest")
    void getMemberByIdForbiddenForWrongRole() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get(String.format("/%s", randomId), UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to get a member by ID (401 unauthorized)
    @Test
    @WithAnonymousUser
    void getMemberByIdUnauthorizedForAnonymous() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get(String.format("/%s", randomId), UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    // Verifies that the content type of the response is application/json
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdContentType() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(get(String.format("/%s", randomId), UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Verifies that the entire member is returned correctly
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdReturnsCorrectMember() throws Exception {
        Member member = new Member(
                UUID.randomUUID(),
                "firstName",
                "lastName",
                "email",
                LocalDate.now(),
                "phoneNumber",
                "address",
                LocalDate.now(),
                "information"
        );

        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s", member.getId())))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(member)));
    }

    // Verifies that a 404 not found is returned, when no member for the given id is found
    void getMemberByIdReturnsNotFound() throws Exception {
        UUID randomId = UUID.randomUUID();
        when(memberService.getMemberById(randomId)).thenReturn(Optional.empty());

        mockMvc.perform(get(String.format("/%s", randomId)))
                .andExpect(status().isNotFound());
    }

}
