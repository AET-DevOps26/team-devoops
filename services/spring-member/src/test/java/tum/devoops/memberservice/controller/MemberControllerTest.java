package tum.devoops.memberservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tum.devoops.memberservice.config.SecurityConfig;
import tum.devoops.memberservice.model.AdminDashboard;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.model.TraineeDashboard;
import tum.devoops.memberservice.service.DashboardService;
import tum.devoops.memberservice.service.MemberService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
@Import(SecurityConfig.class)
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MemberService memberService;

    @MockitoBean
    private DashboardService dashboardService;

    private UUID id;
    private MemberSummary memberSummary;
    private MemberSummary memberSummary1;
    private Member member;
    private MemberCreate memberCreate;
    private MemberPartialUpdate memberPartialUpdate;
    private Member updatedMember;
    private String mockToken;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();

        memberSummary = new MemberSummary(id, "Alice", "Aberdeen", "alice.aberdeen@example.com");
        memberSummary1 = new MemberSummary(UUID.randomUUID(), "Bob", "Builder", "bob.the.builder@example.com");

        member = new Member(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                LocalDate.now(),
                "phoneNumber",
                "address",
                LocalDate.now(),
                "information"
        );

        memberCreate = new MemberCreate();
        memberCreate.setFirstName(member.getFirstName());
        memberCreate.setLastName(member.getLastName());
        memberCreate.setEmail(member.getEmail());
        memberCreate.setPassword("password123");
        memberCreate.setPhoneNumber(member.getPhoneNumber());
        memberCreate.setAddress(member.getAddress());
        memberCreate.setInformation(member.getInformation());
        memberCreate.setBirthday(member.getBirthday());

        memberPartialUpdate = new MemberPartialUpdate();
        memberPartialUpdate.setFirstName("newFirstName");
        memberPartialUpdate.setLastName("newLastName");
        memberPartialUpdate.setEmail("newemail@email.com");

        updatedMember = new Member(
                id,
                "newFirstName",
                "newLastName",
                "newemail@email.com",
                LocalDate.now(),
                "newPhoneNumber",
                "newAddress",
                LocalDate.now(),
                "newInformation"
        );

        mockToken = "mock-token";
    }

    // Test cases for getAllMembers() endpoint

    @Test
    @WithMockUser(roles = "member")
    void getMembersAllowedForMember() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    void getMembersAllowedForAdmin() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "guest")
    void getMembersForbiddenForWrongRole() throws Exception {
        mockMvc.perform(get("/members"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void getMembersUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(get("/members"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "member")
    void getMembersContentType() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMembersEmptyList() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMemberNonEmptyList() throws Exception {
        List<MemberSummary> list = List.of(memberSummary, memberSummary1);
        when(memberService.getAllMembers()).thenReturn(list);
        mockMvc.perform(get("/members"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(list)));
    }

    // Test cases for getMemberDetails() endpoint

    @Test
    @WithMockUser(roles = "member")
    void getMemberDetailsAllowedForMember() throws Exception {
        when(memberService.getMemberById(id)).thenReturn(Optional.of(member));
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    void getMemberDetailsAllowedForAdmin() throws Exception {
        when(memberService.getMemberById(id)).thenReturn(Optional.of(member));
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "guest")
    void getMemberDetailsForbiddenForWrongRole() throws Exception {
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void getMemberDetailsUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "member")
    void getMemberDetailsContentType() throws Exception {
        when(memberService.getMemberById(id)).thenReturn(Optional.of(member));
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMemberDetailsReturnsCorrectMember() throws Exception {
        when(memberService.getMemberById(id)).thenReturn(Optional.of(member));
        mockMvc.perform(get("/members/{id}", id))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(member)));
    }

    @Test
    @WithMockUser(roles = "member")
    void getMemberDetailsReturnsNotFound() throws Exception {
        UUID randomId = UUID.randomUUID();
        when(memberService.getMemberById(randomId)).thenReturn(Optional.empty());
        mockMvc.perform(get("/members/{id}", randomId))
                .andExpect(status().isNotFound());
    }

    // Test cases for createMember() endpoint

    @Test
    void createMemberAllowedForAdmin() throws Exception {
        when(memberService.createMember(eq(memberCreate), anyString())).thenReturn(Optional.of(member));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                        .with(jwt()
                                .jwt(j -> j.tokenValue(mockToken))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        ))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(member)));
    }

    @Test
    @WithMockUser(roles = "member")
    void createMemberForbiddenForMember() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                )
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void createMemberUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createMemberReturnsBadRequestOnKeycloakFailure() throws Exception {
        when(memberService.createMember(any(), anyString())).thenReturn(Optional.empty());

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                        .with(jwt()
                                .jwt(j -> j.tokenValue(mockToken))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        ))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createMemberReturnsConflictOnEmailConflict() throws Exception {
        when(memberService.createMember(any(), anyString()))
                .thenThrow(new IllegalStateException("Email already in use"));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                        .with(jwt()
                                .jwt(j -> j.tokenValue(mockToken))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        ))
                .andExpect(status().isConflict());
    }

    // Test cases for updateMemberDetails() endpoint

    @Test
    void updateMemberAllowedForAdmin() throws Exception {
        when(memberService.updateMember(eq(id), any(MemberPartialUpdate.class), anyString())).thenReturn(Optional.of(updatedMember));

        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(updatedMember)));
    }

    @Test
    void updateMemberForbiddenForMemberOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isForbidden());
    }

    @Test
    void updateMemberAllowedForMemberSameId() throws Exception {
        when(memberService.updateMember(eq(id), any(MemberPartialUpdate.class), anyString())).thenReturn(Optional.of(updatedMember));

        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isOk());
    }

    @Test
    void updateMemberForbiddenForGuestOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isForbidden());
    }

    @Test
    void updateMemberForbiddenForGuestSameId() throws Exception {
        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void updateMemberUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(patch("/members/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateMemberReturnsNotFoundForMissingMember() throws Exception {
        when(memberService.updateMember(eq(id), any(MemberPartialUpdate.class), anyString())).thenReturn(Optional.empty());

        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isNotFound());
    }

    @Test
    void updateMemberReturnsConflictOnEmailConflict() throws Exception {
        when(memberService.updateMember(eq(id), any(MemberPartialUpdate.class), anyString()))
                .thenThrow(new IllegalStateException("Email already in use"));

        mockMvc.perform(patch("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberPartialUpdate))
                )
                .andExpect(status().isConflict());
    }

    // Test cases for deleteMember() endpoint

    @Test
    void deleteMemberAllowedForAdmin() throws Exception {
        when(memberService.deleteMember(eq(id), anyString())).thenReturn(true);

        mockMvc.perform(delete("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                )
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteMemberForbiddenForMember() throws Exception {
        mockMvc.perform(delete("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteMemberForbiddenForGuest() throws Exception {
        mockMvc.perform(delete("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void deleteMemberUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(delete("/members/{id}", id))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteMemberReturnsNotFoundForMissingMember() throws Exception {
        when(memberService.deleteMember(eq(id), anyString())).thenReturn(false);

        mockMvc.perform(delete("/members/{id}", id)
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                )
                .andExpect(status().isNotFound());
    }

    // Test cases for getDashboard() endpoint

    @Test
    void getDashboardReturns200WithTraineeShapeForMember() throws Exception {
        TraineeDashboard dashboard = new TraineeDashboard("trainee", 1500, null, 2, List.of(), List.of());
        when(dashboardService.getDashboard(id, false)).thenReturn(dashboard);

        mockMvc.perform(get("/members/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("trainee"))
                .andExpect(jsonPath("$.balance_cents").value(1500))
                .andExpect(jsonPath("$.upcoming_events").value(2));
    }

    @Test
    void getDashboardReturns200WithAdminShapeForAdmin() throws Exception {
        AdminDashboard dashboard = new AdminDashboard("admin", 42, 3, 7, 2, 5, 99000, 4);
        when(dashboardService.getDashboard(id, true)).thenReturn(dashboard);

        mockMvc.perform(get("/members/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("admin"))
                .andExpect(jsonPath("$.total_members").value(42))
                .andExpect(jsonPath("$.total_balance_cents").value(99000));
    }

    @Test
    void getDashboardReturns403ForDisallowedRole() throws Exception {
        mockMvc.perform(get("/members/dashboard")
                        .with(jwt()
                                .jwt(j -> j.subject(id.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithAnonymousUser
    void getDashboardReturns401WhenAnonymous() throws Exception {
        mockMvc.perform(get("/members/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}
