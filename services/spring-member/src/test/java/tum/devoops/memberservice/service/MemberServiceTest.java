package tum.devoops.memberservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.model.Member;
import tum.devoops.memberservice.model.MemberCreate;
import tum.devoops.memberservice.model.MemberPartialUpdate;
import tum.devoops.memberservice.model.MemberSummary;
import tum.devoops.memberservice.repository.MemberRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    private static final String TOKEN = "mock-token";

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private KeycloakService keycloakService;

    @InjectMocks
    private MemberService memberService;

    private UUID id;
    private MemberEntity memberEntity;
    private Member member;
    private MemberSummary expectedSummary;
    private MemberCreate memberCreate;
    private MemberPartialUpdate partialUpdate;

    @BeforeEach
    void setUp() {
        id = UUID.randomUUID();

        memberEntity = new MemberEntity(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                LocalDate.of(1990, 1, 1),
                "phoneNumber",
                "address",
                LocalDate.of(2020, 6, 15),
                "information"
        );

        member = new Member(
                id,
                "firstName",
                "lastName",
                "email@email.com",
                LocalDate.of(1990, 1, 1),
                "phoneNumber",
                "address",
                LocalDate.of(2020, 6, 15),
                "information"
        );

        expectedSummary = new MemberSummary(id, "firstName", "lastName", "email@email.com");

        memberCreate = new MemberCreate();
        memberCreate.setFirstName("firstName");
        memberCreate.setLastName("lastName");
        memberCreate.setEmail("email@email.com");
        memberCreate.setPassword("password123");
        memberCreate.setBirthday(LocalDate.of(1990, 1, 1));
        memberCreate.setPhoneNumber("phoneNumber");
        memberCreate.setAddress("address");
        memberCreate.setInformation("information");

        partialUpdate = new MemberPartialUpdate();
        partialUpdate.setFirstName("firstName");
        partialUpdate.setLastName("lastName");
        partialUpdate.setEmail("email@email.com");
        partialUpdate.setBirthday(LocalDate.of(1990, 1, 1));
        partialUpdate.setPhoneNumber("phoneNumber");
        partialUpdate.setAddress("address");
        partialUpdate.setInformation("information");
    }

    // Test cases for getAllMembers()

    // Verifies that an empty list is returned when the repository holds no members
    @Test
    void getAllMembersReturnsEmptyListWhenNoMembers() {
        when(memberRepository.findAll()).thenReturn(List.of());

        List<MemberSummary> result = memberService.getAllMembers();

        assertTrue(result.isEmpty());
    }

    // Verifies that each entity is converted into a MemberSummary with its fields mapped
    @Test
    void getAllMembersReturnsSummaryPerEntity() {
        when(memberRepository.findAll()).thenReturn(List.of(memberEntity));

        List<MemberSummary> result = memberService.getAllMembers();

        assertEquals(1, result.size());
        assertEquals(expectedSummary, result.getFirst());
    }

    // Test cases for getMemberSummaryById()

    // Verifies that a populated summary is returned when the member exists
    @Test
    void getMemberSummaryByIdReturnsSummaryWhenFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));

        Optional<MemberSummary> result = memberService.getMemberSummaryById(id);

        assertTrue(result.isPresent());
        assertEquals(expectedSummary, result.get());
    }

    // Verifies that an empty optional is returned when the member does not exist
    @Test
    void getMemberSummaryByIdReturnsEmptyWhenNotFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        Optional<MemberSummary> result = memberService.getMemberSummaryById(id);

        assertTrue(result.isEmpty());
    }

    // Test cases for getMemberById()

    // Verifies that the full member is returned when it exists
    @Test
    void getMemberByIdReturnsMemberWhenFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));

        Optional<Member> result = memberService.getMemberById(id);

        assertTrue(result.isPresent());
        assertEquals(member, result.get());
    }

    // Verifies that an empty optional is returned when the member does not exist
    @Test
    void getMemberByIdReturnsEmptyWhenNotFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Member> result = memberService.getMemberById(id);

        assertTrue(result.isEmpty());
    }

    // Test cases for createMember()

    // Verifies that creation throws when a member with the same email already exists
    @Test
    void createMemberThrowsWhenEmailExists() {
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.of(memberEntity));

        assertThrows(IllegalStateException.class, () -> memberService.createMember(memberCreate, TOKEN));

        verifyNoInteractions(keycloakService);
        verify(memberRepository, never()).save(any());
    }

    // Verifies that creation is rejected and nothing is persisted when Keycloak fails
    @Test
    void createMemberReturnsEmptyWhenKeycloakThrows() throws Exception {
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.empty());
        when(keycloakService.createUser(memberCreate, TOKEN)).thenThrow(new RuntimeException("keycloak down"));

        Optional<Member> result = memberService.createMember(memberCreate, TOKEN);

        assertTrue(result.isEmpty());
        verify(memberRepository, never()).save(any());
    }

    // Verifies that a member is created and returned when the email is free and Keycloak succeeds
    @Test
    void createMemberReturnsMemberOnSuccess() throws Exception {
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.empty());
        when(keycloakService.createUser(memberCreate, TOKEN)).thenReturn(id);
        when(memberRepository.save(any(MemberEntity.class))).thenReturn(memberEntity);

        Optional<Member> result = memberService.createMember(memberCreate, TOKEN);

        assertTrue(result.isPresent());
        assertEquals(member, result.get());
        verify(memberRepository).save(any(MemberEntity.class));
    }

    // Test cases for updateMember()

    // Verifies that update is rejected when the member does not exist
    @Test
    void updateMemberReturnsEmptyWhenMemberNotFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Member> result = memberService.updateMember(id, partialUpdate, TOKEN);

        assertTrue(result.isEmpty());
        verifyNoInteractions(keycloakService);
        verify(memberRepository, never()).save(any());
    }

    // Verifies that an update is rejected when the email belongs to a different member
    @Test
    void updateMemberThrowsWhenEmailTakenByOther() {
        MemberEntity otherMember = new MemberEntity(
                UUID.randomUUID(), "other", "other", "email@email.com",
                LocalDate.of(1990, 1, 1), "phoneNumber", "address", LocalDate.of(2020, 6, 15), "information"
        );
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.of(otherMember));

        assertThrows(IllegalStateException.class, () -> memberService.updateMember(id, partialUpdate, TOKEN));

        verifyNoInteractions(keycloakService);
        verify(memberRepository, never()).save(any());
    }

    // Verifies that an update succeeds when the email belongs to the same member
    @Test
    void updateMemberReturnsMemberWhenEmailBelongsToSameMember() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.of(memberEntity));
        when(memberRepository.save(any(MemberEntity.class))).thenReturn(memberEntity);

        Optional<Member> result = memberService.updateMember(id, partialUpdate, TOKEN);

        assertTrue(result.isPresent());
        assertEquals(member, result.get());
        verify(memberRepository).save(any(MemberEntity.class));
    }

    // Verifies that an update succeeds when the email is not used by anyone
    @Test
    void updateMemberReturnsMemberWhenEmailUnused() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.empty());
        when(memberRepository.save(any(MemberEntity.class))).thenReturn(memberEntity);

        Optional<Member> result = memberService.updateMember(id, partialUpdate, TOKEN);

        assertTrue(result.isPresent());
        assertEquals(member, result.get());
        verify(memberRepository).save(any(MemberEntity.class));
    }

    // Verifies that an update is rejected and nothing is persisted when Keycloak fails
    @Test
    void updateMemberReturnsEmptyWhenKeycloakThrows() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));
        when(memberRepository.findByEmail("email@email.com")).thenReturn(Optional.empty());
        doThrow(new RuntimeException("keycloak down")).when(keycloakService).updateUser(any(), any());

        Optional<Member> result = memberService.updateMember(id, partialUpdate, TOKEN);

        assertTrue(result.isEmpty());
        verify(memberRepository, never()).save(any());
    }

    // Test cases for deleteMember()

    // Verifies that deletion fails when the member does not exist in the repository
    @Test
    void deleteMemberReturnsFalseWhenMemberNotFound() {
        when(memberRepository.findById(id)).thenReturn(Optional.empty());

        boolean result = memberService.deleteMember(id, TOKEN);

        assertFalse(result);
        verifyNoInteractions(keycloakService);
        verify(memberRepository, never()).delete(any());
    }

    // Verifies that deletion fails and nothing is removed when Keycloak fails
    @Test
    void deleteMemberReturnsFalseWhenKeycloakThrows() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));
        doThrow(new RuntimeException("keycloak down")).when(keycloakService).deleteUser(id, TOKEN);

        boolean result = memberService.deleteMember(id, TOKEN);

        assertFalse(result);
        verify(memberRepository, never()).delete(any());
    }

    // Verifies that deletion succeeds and the entity is removed when it exists
    @Test
    void deleteMemberReturnsTrueOnSuccess() {
        when(memberRepository.findById(id)).thenReturn(Optional.of(memberEntity));

        boolean result = memberService.deleteMember(id, TOKEN);

        assertTrue(result);
        verify(memberRepository).delete(memberEntity);
    }
}
