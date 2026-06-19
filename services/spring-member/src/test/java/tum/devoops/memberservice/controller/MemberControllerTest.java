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
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.service.MemberService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

    MemberSummary memberSummary;
    MemberSummary memberSummary1;
    private Member member;
    private MemberCreate memberCreate;
    private String mockToken;
    private Member newMember;

    @BeforeEach
    void setUp() {
        UUID id = UUID.randomUUID();

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
        memberCreate.setPhoneNumber(member.getPhoneNumber());
        memberCreate.setAddress(member.getAddress());
        memberCreate.setInformation(member.getInformation());
        memberCreate.setBirthday(member.getBirthday());

        mockToken = "mock-token";

        newMember = new Member(
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
    }

    // Test cases for createMember() endpoint

    // Verifies that a user with role "member" is allowed to get all members
    @Test
    @WithMockUser(roles = "member")
    void getMembersAllowedForMember() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    // Verifies that a user wit role "admin" is allowed to get all members
    @Test
    @WithMockUser(roles = "admin")
    void getMembersAllowedForAdmin() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
    }

    // Verifies that a user with a role other than "admin" and "member" is not allowed to get all members (401 forbidden)
    @Test
    @WithMockUser(roles = "guest")
    void getMembersForbiddenForWrongRole() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
        mockMvc.perform(get("/"))
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to get all members (403 unauthorized)
    @Test
    @WithAnonymousUser
    void getMembersUnauthorizedForAnonymous() throws Exception {
        when(memberService.getAllMembers()).thenReturn(List.of());
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
        List<MemberSummary> list = List.of(memberSummary, memberSummary1);
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
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with role "admin" is allowed to retrieve a member by ID
    @Test
    @WithMockUser(roles = "admin")
    void getMemberByIdAllowedForAdmin() throws Exception {
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with a role other than admin and member is not allowed to get a member by ID (403 forbidden)
    @Test
    @WithMockUser(roles = "guest")
    void getMemberByIdForbiddenForWrongRole() throws Exception {
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId()), UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to get a member by ID (401 unauthorized)
    @Test
    @WithAnonymousUser
    void getMemberByIdUnauthorizedForAnonymous() throws Exception {
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId()), UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    // Verifies that the content type of the response is application/json
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdContentType() throws Exception {
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Verifies that the entire member is returned correctly
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdReturnsCorrectMember() throws Exception {
        when(memberService.getMemberById(member.getId())).thenReturn(Optional.of(member));

        mockMvc.perform(get(String.format("/%s/details", member.getId())))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(member)));
    }

    // Verifies that a 404 not found is returned, when no member for the given id is found
    @Test
    @WithMockUser(roles = "member")
    void getMemberByIdReturnsNotFound() throws Exception {
        UUID randomId = UUID.randomUUID();
        when(memberService.getMemberById(randomId)).thenReturn(Optional.empty());

        mockMvc.perform(get(String.format("/%s/details", randomId)))
                .andExpect(status().isNotFound());
    }

    // Test cases for getMemberSummaryById() endpoint

    // Verifies that a user with role "member" is allowed to retrieve a member by ID
    @Test
    @WithMockUser(roles = "member")
    void getMemberSummaryByIdAllowedForMember() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with role "admin" is allowed to retrieve a member by ID
    @Test
    @WithMockUser(roles = "admin")
    void getMemberSummaryByIdAllowedForAdmin() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk());
    }

    // Verifies that a user with a role other than admin and member is not allowed to get a member by ID (403 forbidden)
    @Test
    @WithMockUser(roles = "guest")
    void getMemberSummaryByIdForbiddenForWrongRole() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId()), UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to get a member by ID (401 unauthorized)
    @Test
    @WithAnonymousUser
    void getMemberSummaryByIdUnauthorizedForAnonymous() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId()), UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    // Verifies that the content type of the response is application/json
    @Test
    @WithMockUser(roles = "member")
    void getMemberSummaryByIdContentType() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId()), UUID.randomUUID()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Verifies that the entire member is returned correctly
    @Test
    @WithMockUser(roles = "member")
    void getMemberSummaryByIdReturnsCorrectMember() throws Exception {
        when(memberService.getMemberSummaryById(member.getId())).thenReturn(Optional.of(memberSummary));

        mockMvc.perform(get(String.format("/%s", member.getId())))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(memberSummary)));
    }

    // Verifies that a 404 not found is returned, when no member for the given id is found
    @Test
    @WithMockUser(roles = "member")
    void getMemberSummaryByIdReturnsNotFound() throws Exception {
        UUID randomId = UUID.randomUUID();
        when(memberService.getMemberById(randomId)).thenReturn(Optional.empty());

        mockMvc.perform(get(String.format("/%s", randomId)))
                .andExpect(status().isNotFound());
    }

    // Test cases for createMember() endpoint

    // Verifies that a user with role "admin" can create a member
    @Test
    void createMemberAllowedForAdmin() throws Exception {
        when(memberService.createMember(memberCreate, mockToken)).thenReturn(Optional.of(member));

        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                        .with(jwt()
                                .jwt(j -> j.tokenValue(mockToken))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        ))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(member)));

    }

    // Verifies that a user with role "member" cannot create a member (403 forbidden)
    @Test
    @WithMockUser(roles = "member")
    void createMemberNotAllowedForAdmin() throws Exception {
        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user cannot create a member (401 unauthorized)
    @Test
    @WithAnonymousUser
    void createMemberNotAllowedForAnonymousUser() throws Exception {
        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                )
                .andExpect(status().isUnauthorized());
    }

    // Verifies that 400 (bad request) is returned when cannot create the member
    @Test
    void createMemberServiceThrows() throws Exception {
        when(memberService.createMember(memberCreate, mockToken)).thenReturn(Optional.empty());

        mockMvc.perform(post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memberCreate))
                        .with(jwt()
                                .jwt(j -> j.tokenValue(mockToken))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        ))
                .andExpect(status().isBadRequest());
    }

    // Test for updateMember() endpoint

    // Verifies that a user with role "admin" is allowed to update a member
    @Test
    void updateMemberAllowedForAdmin() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.of(newMember));

        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(newMember.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(newMember)));
    }

    // Verifies that a user wit role "member" is forbidden to update a member that is not himself (401 forbidden)
    @Test
    void updateMemberNotAllowedForUserOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that a user with role "member" is allowed to update himself
    @Test
    void updateMemberAllowedForUserSameId() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.of(newMember));

        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isOk());
    }

    // Verifies that a user with an undefined role other than "admin" and "member" is not allowed
    // to update a member that is not himself (401 forbidden)
    @Test
    void updateMemberNotAllowedForUndefinedRoleOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that a user with an undefined role other than "admin" and "member" is not allowed
    // to update a member that is himself (401 forbidden)
    @Test
    void updateMemberNotAllowedForUndefinedRoleSameId() throws Exception {
        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to update a member (403 unauthorized)
    @Test
    @WithAnonymousUser
    void updateMemberUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isUnauthorized());
    }

    // Verifies that the content type of the response is application/json
    @Test
    void updateMemberContentType() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.of(newMember));

        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    // Verifies that the endpoint updates the member properly (200 ok)
    @Test
    void updateMemberCorrectUpdateForUserSameId() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.of(newMember));

        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(newMember)));
    }

    // Verify that a non-existing member cannot be updated by an admin
    @Test
    void updateMemberNotFoundNonExistingId() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.empty());

        mockMvc.perform(put(String.format("/%s", UUID.randomUUID()))
                        .with(jwt()
                                .jwt(j -> j.subject(newMember.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isNotFound());
    }

    // Verify that an non-existing member cannot updated by a user even if the id is the same as the user
    @Test
    void updateMemberNotFoundUserSameId() throws Exception {
        when(memberService.updateMember(eq(newMember), anyString())).thenReturn(Optional.empty());

        mockMvc.perform(put(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newMember))
                )
                .andExpect(status().isNotFound());
    }

    // Test for deleteMember() endpoint

    // Verifies that a user with role "admin" is allowed to delete a member (204 no content)
    @Test
    void deleteMemberAllowedForAdmin() throws Exception {
        when(memberService.deleteMember(eq(member.getId()), anyString())).thenReturn(true);

        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                )
                .andExpect(status().isNoContent());
    }

    // Verifies that a user with role "member" is not allowed to delete a member that is not himself
    @Test
    @WithMockUser(roles = "member")
    void deleteMemberNotAllowedForUserOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that a user wit role "member" is forbidden to delete a member even though it is himself (401 forbidden)
    @Test
    void deleteMemberNotAllowedForUserSameId() throws Exception {
        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_member"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that a user with an undefined role other than "admin" and "member" is not allowed
    // to delete a member that is not himself (401 forbidden)
    @Test
    void deleteMemberNotAllowedForUndefinedRoleOtherId() throws Exception {
        UUID randomId = UUID.randomUUID();
        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(randomId.toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that a user with an undefined role other than "admin" and "member" is not allowed
    // to delete a member that is himself (401 forbidden)
    @Test
    void deleteMemberNotAllowedForUndefinedRoleSameId() throws Exception {
        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_guest"))
                        )
                )
                .andExpect(status().isForbidden());
    }

    // Verifies that an anonymous user is not allowed to delete a member (403 unauthorized)
    @Test
    @WithAnonymousUser
    void deleteMemberUnauthorizedForAnonymous() throws Exception {
        mockMvc.perform(delete(String.format("/%s", member.getId())))
                .andExpect(status().isUnauthorized());
    }

    // Verify that a non-existing member cannot be deleted by an admin
    @Test
    @WithMockUser(roles = "admin")
    void deleteMemberNotFoundNonExistingId() throws Exception {
        when(memberService.deleteMember(eq(member.getId()), anyString())).thenReturn(false);

        mockMvc.perform(delete(String.format("/%s", member.getId()))
                        .with(jwt()
                                .jwt(j -> j.subject(member.getId().toString()))
                                .authorities(new SimpleGrantedAuthority("ROLE_admin"))
                        )
                )
                .andExpect(status().isNotFound());
    }
}
