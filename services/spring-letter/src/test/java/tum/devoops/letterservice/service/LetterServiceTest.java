package tum.devoops.letterservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;

import tum.devoops.letterservice.entity.MemberEntity;
import tum.devoops.letterservice.entity.SportEntity;
import tum.devoops.letterservice.entity.TeamEntity;
import tum.devoops.letterservice.entity.TransactionEntity;
import tum.devoops.letterservice.exception.MailDeliveryException;
import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;
import tum.devoops.letterservice.repository.DirectorRepository;
import tum.devoops.letterservice.repository.MemberRepository;
import tum.devoops.letterservice.repository.SportRepository;
import tum.devoops.letterservice.repository.TeamRepository;
import tum.devoops.letterservice.repository.TraineeRepository;
import tum.devoops.letterservice.repository.TrainerRepository;
import tum.devoops.letterservice.repository.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class LetterServiceTest {

    private static final String FROM = "noreply@example.com";

    @Mock
    private JavaMailSender mailSender;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private SportRepository sportRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private DirectorRepository directorRepository;
    @Mock
    private TrainerRepository trainerRepository;
    @Mock
    private TraineeRepository traineeRepository;
    @Mock
    private TransactionRepository transactionRepository;

    private LetterService letterService;

    @BeforeEach
    void setUp() {
        letterService = new LetterService(mailSender, FROM, memberRepository, sportRepository,
                teamRepository, directorRepository, trainerRepository, traineeRepository, transactionRepository);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // --- sendMail: role-based receiver resolution ---

    @Test
    void sendMailAsAdminSendsPersonalizedMailToAllMembers() throws Exception {
        authenticateAs(UUID.randomUUID(), "admin");

        MemberEntity alice = member("Alice", "Anderson", "alice@example.com");
        MemberEntity bob = member("Bob", "Brown", "bob@example.com");
        when(memberRepository.findAll()).thenReturn(List.of(alice, bob));
        stubMimeMessages();

        letterService.sendMail(new MailRequest("Welcome", "<p>Hi {{first_name}}</p>"));

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender, times(2)).send(captor.capture());
        List<MimeMessage> sent = captor.getAllValues();
        assertThat(sent.get(0).getAllRecipients()[0].toString()).isEqualTo("alice@example.com");
        assertThat(extractHtml(sent.get(0))).isEqualTo("<p>Hi Alice</p>");
        assertThat(sent.get(1).getAllRecipients()[0].toString()).isEqualTo("bob@example.com");
        assertThat(extractHtml(sent.get(1))).isEqualTo("<p>Hi Bob</p>");
    }

    @Test
    void sendMailAsDirectorResolvesReceiversViaSportsTeamsAndRoles() {
        UUID senderId = UUID.randomUUID();
        authenticateAs(senderId, "director");

        UUID sportId = UUID.randomUUID();
        UUID teamId = UUID.randomUUID();
        UUID coDirectorId = UUID.randomUUID();
        UUID trainerId = UUID.randomUUID();
        UUID traineeId = UUID.randomUUID();

        when(directorRepository.findSportIdsByMemberId(senderId)).thenReturn(List.of(sportId));
        when(directorRepository.findMemberIdsBySportId(sportId)).thenReturn(List.of(coDirectorId));
        when(teamRepository.findAllBySportId(sportId)).thenReturn(List.of(team(teamId, "Team A", sportId)));
        when(trainerRepository.findMemberIdsByTeamId(teamId)).thenReturn(List.of(trainerId));
        when(traineeRepository.findMemberIdsByTeamId(teamId)).thenReturn(List.of(traineeId));
        when(memberRepository.findAllById(any())).thenReturn(List.of());

        letterService.sendMail(new MailRequest("Subject", "Body"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Iterable<UUID>> captor = ArgumentCaptor.forClass(Iterable.class);
        verify(memberRepository).findAllById(captor.capture());
        assertThat(captor.getValue()).containsExactlyInAnyOrder(coDirectorId, trainerId, traineeId);
    }

    @Test
    void sendMailAsTrainerResolvesReceiversViaTeams() {
        UUID senderId = UUID.randomUUID();
        authenticateAs(senderId, "trainer");

        UUID teamId = UUID.randomUUID();
        UUID coTrainerId = UUID.randomUUID();
        UUID traineeId = UUID.randomUUID();

        when(trainerRepository.findTeamIdsByMemberId(senderId)).thenReturn(List.of(teamId));
        when(trainerRepository.findMemberIdsByTeamId(teamId)).thenReturn(List.of(coTrainerId));
        when(traineeRepository.findMemberIdsByTeamId(teamId)).thenReturn(List.of(traineeId));
        when(memberRepository.findAllById(any())).thenReturn(List.of());

        letterService.sendMail(new MailRequest("Subject", "Body"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Iterable<UUID>> captor = ArgumentCaptor.forClass(Iterable.class);
        verify(memberRepository).findAllById(captor.capture());
        assertThat(captor.getValue()).containsExactlyInAnyOrder(coTrainerId, traineeId);
    }

    @Test
    void sendMailAsTraineeSendsToNoOne() {
        authenticateAs(UUID.randomUUID(), "trainee");
        when(memberRepository.findAllById(any())).thenReturn(List.of());

        letterService.sendMail(new MailRequest("Subject", "Body"));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<Iterable<UUID>> captor = ArgumentCaptor.forClass(Iterable.class);
        verify(memberRepository).findAllById(captor.capture());
        assertThat(captor.getValue()).isEmpty();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    // --- sendMail: token replacement ---

    @Test
    void sendMailReplacesAllKnownTokensAndUnknownTokensWithEmptyString() throws Exception {
        authenticateAs(UUID.randomUUID(), "admin");

        UUID memberId = UUID.randomUUID();
        MemberEntity carol = member(memberId, "Carol", "Clark", "carol@example.com",
                "123 Main St", "+49 170 0000000", LocalDate.of(1990, 5, 1), LocalDate.of(2020, 1, 15));
        when(memberRepository.findAll()).thenReturn(List.of(carol));

        UUID teamId = UUID.randomUUID();
        UUID sportId = UUID.randomUUID();
        when(trainerRepository.findTeamIdsByMemberId(memberId)).thenReturn(List.of(teamId));
        when(teamRepository.findById(teamId)).thenReturn(java.util.Optional.of(team(teamId, "Falcons", sportId)));
        when(sportRepository.findById(sportId)).thenReturn(java.util.Optional.of(sport(sportId, "Basketball")));
        when(transactionRepository.findAllByMemberId(memberId))
                .thenReturn(List.of(transaction(memberId, 5000), transaction(memberId, -2500)));
        stubMimeMessages();

        String template = "{{first_name}} {{last_name}} {{full_name}} {{email}} {{address}} "
                + "{{phone_number}} {{birthday}} {{joining_date}} {{team_name}} {{sport_name}} "
                + "{{balance}} {{unknown_token}}";
        letterService.sendMail(new MailRequest("Subject", template));

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());
        String content = extractHtml(captor.getValue());

        assertThat(content).isEqualTo("Carol Clark Carol Clark carol@example.com 123 Main St "
                + "+49 170 0000000 1990-05-01 2020-01-15 Falcons Basketball €25.00 ");
    }

    @Test
    void sendMailWithMemberWithoutTeamOrSportLeavesTokensEmpty() throws Exception {
        authenticateAs(UUID.randomUUID(), "admin");

        UUID memberId = UUID.randomUUID();
        MemberEntity dan = member(memberId, "Dan", "Doe", "dan@example.com");
        when(memberRepository.findAll()).thenReturn(List.of(dan));
        when(transactionRepository.findAllByMemberId(memberId)).thenReturn(List.of());
        stubMimeMessages();

        letterService.sendMail(new MailRequest("Subject", "[{{team_name}}][{{sport_name}}][{{balance}}]"));

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());
        assertThat(extractHtml(captor.getValue())).isEqualTo("[][][€0.00]");
    }

    @Test
    void sendMailWithDirectorWithoutTeamShowsSportNameFromDirectorRole() throws Exception {
        authenticateAs(UUID.randomUUID(), "admin");

        UUID memberId = UUID.randomUUID();
        MemberEntity eve = member(memberId, "Eve", "Evans", "eve@example.com");
        when(memberRepository.findAll()).thenReturn(List.of(eve));
        when(transactionRepository.findAllByMemberId(memberId)).thenReturn(List.of());

        UUID sportId = UUID.randomUUID();
        when(directorRepository.findSportIdsByMemberId(memberId)).thenReturn(List.of(sportId));
        when(sportRepository.findById(sportId)).thenReturn(java.util.Optional.of(sport(sportId, "Swimming")));
        stubMimeMessages();

        letterService.sendMail(new MailRequest("Subject", "[{{team_name}}][{{sport_name}}]"));

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mailSender).send(captor.capture());
        assertThat(extractHtml(captor.getValue())).isEqualTo("[][Swimming]");
    }

    // --- sendMail: error handling ---

    @Test
    void sendMailWrapsMessagingExceptionInMailDeliveryException() {
        LetterService brokenFromService = new LetterService(mailSender, "not a valid from address",
                memberRepository, sportRepository, teamRepository, directorRepository,
                trainerRepository, traineeRepository, transactionRepository);
        authenticateAs(UUID.randomUUID(), "admin");

        MemberEntity frank = member("Frank", "Foster", "frank@example.com");
        when(memberRepository.findAll()).thenReturn(List.of(frank));
        stubMimeMessages();

        assertThatThrownBy(() -> brokenFromService.sendMail(new MailRequest("Subject", "Body")))
                .isInstanceOf(MailDeliveryException.class)
                .hasMessageContaining("frank@example.com")
                .hasCauseInstanceOf(jakarta.mail.MessagingException.class);
    }

    // --- getPdf ---

    @Test
    void getPdfReturnsDummyPdfResource() throws Exception {
        Resource pdf = letterService.getPdf(new PdfRequest("<p>Hi {{first_name}}</p>"));

        assertThat(pdf.getContentAsByteArray()).isEqualTo("%PDF-1.4 dummy".getBytes());
    }

    // --- helpers ---

    private void stubMimeMessages() {
        when(mailSender.createMimeMessage()).thenAnswer(invocation -> new MimeMessage((Session) null));
    }

    // resolveReceivers() only reads the JWT subject for director/trainer roles, so this stub is
    // unused for admin/trainee auth and must be lenient to avoid Mockito's strict-stubs failure.
    private static void authenticateAs(UUID memberId, String role) {
        Jwt jwt = mock(Jwt.class);
        Mockito.lenient().when(jwt.getSubject()).thenReturn(memberId.toString());
        Authentication authentication = new TestingAuthenticationToken(jwt, null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private static String extractHtml(MimeMessage message) throws Exception {
        Object content = message.getContent();
        while (content instanceof MimeMultipart multipart) {
            content = multipart.getBodyPart(0).getContent();
        }
        return (String) content;
    }

    private static MemberEntity member(String firstName, String lastName, String email) {
        return member(UUID.randomUUID(), firstName, lastName, email, null, null, null, null);
    }

    private static MemberEntity member(UUID id, String firstName, String lastName, String email) {
        return member(id, firstName, lastName, email, null, null, null, null);
    }

    private static MemberEntity member(UUID id, String firstName, String lastName, String email,
            String address, String phoneNumber, LocalDate birthday, LocalDate joiningDate) {
        MemberEntity member = new MemberEntity();
        ReflectionTestUtils.setField(member, "id", id);
        ReflectionTestUtils.setField(member, "firstName", firstName);
        ReflectionTestUtils.setField(member, "lastName", lastName);
        ReflectionTestUtils.setField(member, "email", email);
        ReflectionTestUtils.setField(member, "address", address);
        ReflectionTestUtils.setField(member, "phoneNumber", phoneNumber);
        ReflectionTestUtils.setField(member, "birthday", birthday);
        ReflectionTestUtils.setField(member, "joiningDate", joiningDate);
        return member;
    }

    private static TeamEntity team(UUID id, String name, UUID sportId) {
        TeamEntity team = new TeamEntity();
        ReflectionTestUtils.setField(team, "id", id);
        ReflectionTestUtils.setField(team, "name", name);
        ReflectionTestUtils.setField(team, "sportId", sportId);
        return team;
    }

    private static SportEntity sport(UUID id, String name) {
        SportEntity sport = new SportEntity();
        ReflectionTestUtils.setField(sport, "id", id);
        ReflectionTestUtils.setField(sport, "name", name);
        return sport;
    }

    private static TransactionEntity transaction(UUID memberId, int amountCents) {
        TransactionEntity transaction = new TransactionEntity();
        ReflectionTestUtils.setField(transaction, "id", UUID.randomUUID());
        ReflectionTestUtils.setField(transaction, "memberId", memberId);
        ReflectionTestUtils.setField(transaction, "amountCents", amountCents);
        return transaction;
    }
}
