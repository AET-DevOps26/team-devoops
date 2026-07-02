package tum.devoops.memberservice.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tum.devoops.memberservice.entity.DirectorEntity;
import tum.devoops.memberservice.entity.EventEntity;
import tum.devoops.memberservice.entity.FeedbackEntity;
import tum.devoops.memberservice.entity.MemberEntity;
import tum.devoops.memberservice.entity.SportEntity;
import tum.devoops.memberservice.entity.SportEventEntity;
import tum.devoops.memberservice.entity.TeamEntity;
import tum.devoops.memberservice.entity.TeamEventEntity;
import tum.devoops.memberservice.entity.TraineeEntity;
import tum.devoops.memberservice.entity.TrainerEntity;
import tum.devoops.memberservice.model.AdminDashboard;
import tum.devoops.memberservice.model.Dashboard;
import tum.devoops.memberservice.model.DirectorDashboard;
import tum.devoops.memberservice.model.Reference;
import tum.devoops.memberservice.model.TraineeDashboard;
import tum.devoops.memberservice.model.TrainerDashboard;
import tum.devoops.memberservice.repository.DirectorRepository;
import tum.devoops.memberservice.repository.EventRepository;
import tum.devoops.memberservice.repository.FeedbackRepository;
import tum.devoops.memberservice.repository.MemberRepository;
import tum.devoops.memberservice.repository.SportEventRepository;
import tum.devoops.memberservice.repository.SportRepository;
import tum.devoops.memberservice.repository.TeamEventRepository;
import tum.devoops.memberservice.repository.TeamRepository;
import tum.devoops.memberservice.repository.TraineeRepository;
import tum.devoops.memberservice.repository.TrainerRepository;
import tum.devoops.memberservice.repository.TransactionRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock private MemberRepository memberRepository;
    @Mock private SportRepository sportRepository;
    @Mock private TeamRepository teamRepository;
    @Mock private DirectorRepository directorRepository;
    @Mock private TrainerRepository trainerRepository;
    @Mock private TraineeRepository traineeRepository;
    @Mock private EventRepository eventRepository;
    @Mock private TeamEventRepository teamEventRepository;
    @Mock private SportEventRepository sportEventRepository;
    @Mock private FeedbackRepository feedbackRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private ReportQueryService reportQueryService;

    @InjectMocks private DashboardService service;

    private static final UUID REQUESTER_ID = UUID.randomUUID();
    private static final Instant FUTURE = Instant.now().plusSeconds(86_400);
    private static final Instant PAST = Instant.now().minusSeconds(86_400);

    @Test
    void getDashboard_asAdmin_returnsClubWideAggregates() {
        when(memberRepository.count()).thenReturn(42L);
        when(sportRepository.count()).thenReturn(3L);
        when(teamRepository.count()).thenReturn(7L);
        when(directorRepository.count()).thenReturn(2L);
        when(trainerRepository.count()).thenReturn(5L);
        when(transactionRepository.sumAllAmounts()).thenReturn(99_000L);
        when(eventRepository.countInWindow(any(), any())).thenReturn(4L);

        Dashboard result = service.getDashboard(REQUESTER_ID, true);

        assertThat(result).isInstanceOf(AdminDashboard.class);
        AdminDashboard admin = (AdminDashboard) result;
        assertThat(admin.getRole()).isEqualTo("admin");
        assertThat(admin.getTotalMembers()).isEqualTo(42);
        assertThat(admin.getTotalSports()).isEqualTo(3);
        assertThat(admin.getTotalTeams()).isEqualTo(7);
        assertThat(admin.getTotalDirectors()).isEqualTo(2);
        assertThat(admin.getTotalTrainers()).isEqualTo(5);
        assertThat(admin.getTotalBalanceCents()).isEqualTo(99_000);
        assertThat(admin.getEventsThisWeek()).isEqualTo(4);
    }

    @Test
    void getDashboard_asDirector_rollsUpTeamsAndBalances() {
        UUID sportId = UUID.randomUUID();
        UUID teamA = UUID.randomUUID();
        UUID teamB = UUID.randomUUID();
        UUID m1 = UUID.randomUUID();
        UUID m2 = UUID.randomUUID();
        UUID m3 = UUID.randomUUID();
        UUID eSport = UUID.randomUUID();
        UUID eTeam = UUID.randomUUID();

        when(directorRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(director(sportId, REQUESTER_ID)));
        when(sportRepository.findById(sportId)).thenReturn(Optional.of(sport(sportId, "Soccer")));
        when(teamRepository.findAllBySportId(sportId))
                .thenReturn(List.of(team(teamA, "Team A", sportId), team(teamB, "Team B", sportId)));
        when(traineeRepository.findAllById_TeamId(teamA))
                .thenReturn(List.of(trainee(teamA, m1), trainee(teamA, m2)));
        when(traineeRepository.findAllById_TeamId(teamB)).thenReturn(List.of(trainee(teamB, m3)));
        when(transactionRepository.sumAmountByMemberId(m1)).thenReturn(1_000L);
        when(transactionRepository.sumAmountByMemberId(m2)).thenReturn(500L);
        when(transactionRepository.sumAmountByMemberId(m3)).thenReturn(2_000L);
        when(sportEventRepository.findAllById_SportId(sportId)).thenReturn(List.of(sportEvent(eSport, sportId)));
        when(teamEventRepository.findAllById_TeamId(teamA)).thenReturn(List.of(teamEvent(eTeam, teamA)));
        when(teamEventRepository.findAllById_TeamId(teamB)).thenReturn(List.of());
        when(eventRepository.findAllById(any()))
                .thenReturn(List.of(event(eSport, "Upcoming", FUTURE), event(eTeam, "Past", PAST)));

        Dashboard result = service.getDashboard(REQUESTER_ID, false);

        assertThat(result).isInstanceOf(DirectorDashboard.class);
        DirectorDashboard director = (DirectorDashboard) result;
        assertThat(director.getRole()).isEqualTo("director");
        assertThat(director.getSport().getName()).isEqualTo("Soccer");
        assertThat(director.getTotalTeams()).isEqualTo(2);
        assertThat(director.getTotalMembers()).isEqualTo(3);
        assertThat(director.getSportBalanceCents()).isEqualTo(3_500);
        assertThat(director.getUpcomingEvents()).isEqualTo(1);
        assertThat(director.getTeams()).hasSize(2);
        assertThat(director.getTeams().get(0).getTeam().getName()).isEqualTo("Team A");
        assertThat(director.getTeams().get(0).getMemberCount()).isEqualTo(2);
        assertThat(director.getTeams().get(0).getBalanceCents()).isEqualTo(1_500);
        assertThat(director.getTeams().get(1).getMemberCount()).isEqualTo(1);
        assertThat(director.getTeams().get(1).getBalanceCents()).isEqualTo(2_000);
    }

    @Test
    void getDashboard_asTrainer_limitsAuthoredFeedbackToTen() {
        UUID teamId = UUID.randomUUID();
        UUID athlete = UUID.randomUUID();
        UUID feedbackEvent = UUID.randomUUID();
        UUID upcomingEvent = UUID.randomUUID();

        when(directorRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(trainer(teamId, REQUESTER_ID)));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team(teamId, "Team A", UUID.randomUUID())));
        when(traineeRepository.findAllById_TeamId(teamId))
                .thenReturn(List.of(trainee(teamId, UUID.randomUUID()),
                        trainee(teamId, UUID.randomUUID()), trainee(teamId, UUID.randomUUID())));
        when(teamEventRepository.findAllById_TeamId(teamId)).thenReturn(List.of(teamEvent(upcomingEvent, teamId)));
        when(eventRepository.findAllById(any())).thenReturn(List.of(event(upcomingEvent, "Game", FUTURE)));

        List<FeedbackEntity> authored = new ArrayList<>();
        Instant base = Instant.now();
        for (int i = 0; i < 11; i++) {
            authored.add(feedback(UUID.randomUUID(), feedbackEvent, athlete, REQUESTER_ID, base.minusSeconds(i)));
        }
        when(feedbackRepository.findAllByCreatorId(REQUESTER_ID)).thenReturn(authored);
        when(memberRepository.findById(athlete)).thenReturn(Optional.of(member(athlete, "Ann", "Athlete")));
        when(memberRepository.findById(REQUESTER_ID)).thenReturn(Optional.of(member(REQUESTER_ID, "Tim", "Trainer")));
        when(eventRepository.findById(feedbackEvent)).thenReturn(Optional.of(event(feedbackEvent, "Match", base)));

        Dashboard result = service.getDashboard(REQUESTER_ID, false);

        assertThat(result).isInstanceOf(TrainerDashboard.class);
        TrainerDashboard trainer = (TrainerDashboard) result;
        assertThat(trainer.getRole()).isEqualTo("trainer");
        assertThat(trainer.getTeam().getName()).isEqualTo("Team A");
        assertThat(trainer.getTotalMembers()).isEqualTo(3);
        assertThat(trainer.getUpcomingEvents()).isEqualTo(1);
        assertThat(trainer.getRecentFeedback()).hasSize(10);
        assertThat(trainer.getRecentFeedback().get(0).getMember())
                .extracting(Reference::getName).isEqualTo("Ann Athlete");
        assertThat(trainer.getRecentFeedback().get(0).getCreator())
                .extracting(Reference::getName).isEqualTo("Tim Trainer");
        assertThat(trainer.getRecentFeedback().get(0).getEvent())
                .extracting(Reference::getName).isEqualTo("Match");
    }

    @Test
    void getDashboard_asTrainee_includesBalanceNextEventFeedbackAndReports() {
        UUID teamId = UUID.randomUUID();
        UUID sportId = UUID.randomUUID();
        UUID teamEvent = UUID.randomUUID();
        UUID sportEvent = UUID.randomUUID();
        UUID trainerId = UUID.randomUUID();
        UUID feedbackEvent = UUID.randomUUID();
        UUID reportId = UUID.randomUUID();

        when(directorRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(traineeRepository.findAllById_MemberId(REQUESTER_ID))
                .thenReturn(List.of(trainee(teamId, REQUESTER_ID)));
        when(transactionRepository.sumAmountByMemberId(REQUESTER_ID)).thenReturn(2_500L);
        when(teamEventRepository.findAllById_TeamId(teamId)).thenReturn(List.of(teamEvent(teamEvent, teamId)));
        when(teamRepository.findById(teamId)).thenReturn(Optional.of(team(teamId, "Team A", sportId)));
        when(sportEventRepository.findAllById_SportId(sportId)).thenReturn(List.of(sportEvent(sportEvent, sportId)));
        Instant soon = Instant.now().plusSeconds(3_600);
        Instant later = Instant.now().plusSeconds(7_200);
        when(eventRepository.findAllById(any()))
                .thenReturn(List.of(event(teamEvent, "Soon", soon), event(sportEvent, "Later", later)));

        FeedbackEntity recent = feedback(UUID.randomUUID(), feedbackEvent, REQUESTER_ID, trainerId, Instant.now().minusSeconds(86_400));
        FeedbackEntity old = feedback(UUID.randomUUID(), UUID.randomUUID(), REQUESTER_ID, trainerId,
                OffsetDateTime.now(ZoneOffset.UTC).minusMonths(2).toInstant());
        when(feedbackRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of(recent, old));
        when(memberRepository.findById(REQUESTER_ID)).thenReturn(Optional.of(member(REQUESTER_ID, "Tom", "Trainee")));
        when(memberRepository.findById(trainerId)).thenReturn(Optional.of(member(trainerId, "Tim", "Trainer")));
        when(eventRepository.findById(feedbackEvent)).thenReturn(Optional.of(event(feedbackEvent, "Match", soon)));
        when(reportQueryService.recentMemberReports(REQUESTER_ID, 3))
                .thenReturn(List.of(new ReportQueryService.MemberReportRow(
                        reportId, REQUESTER_ID, OffsetDateTime.now(ZoneOffset.UTC))));

        Dashboard result = service.getDashboard(REQUESTER_ID, false);

        assertThat(result).isInstanceOf(TraineeDashboard.class);
        TraineeDashboard trainee = (TraineeDashboard) result;
        assertThat(trainee.getRole()).isEqualTo("trainee");
        assertThat(trainee.getBalanceCents()).isEqualTo(2_500);
        assertThat(trainee.getNextEvent()).isNotNull();
        assertThat(trainee.getNextEvent().getName()).isEqualTo("Soon");
        assertThat(trainee.getUpcomingEvents()).isEqualTo(2);
        assertThat(trainee.getRecentFeedback()).hasSize(1);
        assertThat(trainee.getRecentFeedback().get(0).getCreator())
                .extracting(Reference::getName).isEqualTo("Tim Trainer");
        assertThat(trainee.getRecentReports()).hasSize(1);
        assertThat(trainee.getRecentReports().get(0).getId()).isEqualTo(reportId);
        assertThat(trainee.getRecentReports().get(0).getMember().getName()).isEqualTo("Tom Trainee");
    }

    @Test
    void getDashboard_plainMemberWithNoMembership_returnsEmptyTraineeDashboard() {
        when(directorRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(trainerRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(traineeRepository.findAllById_MemberId(REQUESTER_ID)).thenReturn(List.of());
        when(transactionRepository.sumAmountByMemberId(REQUESTER_ID)).thenReturn(0L);
        when(feedbackRepository.findAllByMemberId(REQUESTER_ID)).thenReturn(List.of());
        when(reportQueryService.recentMemberReports(REQUESTER_ID, 3)).thenReturn(List.of());

        Dashboard result = service.getDashboard(REQUESTER_ID, false);

        assertThat(result).isInstanceOf(TraineeDashboard.class);
        TraineeDashboard trainee = (TraineeDashboard) result;
        assertThat(trainee.getBalanceCents()).isEqualTo(0);
        assertThat(trainee.getNextEvent()).isNull();
        assertThat(trainee.getUpcomingEvents()).isEqualTo(0);
        assertThat(trainee.getRecentFeedback()).isEmpty();
        assertThat(trainee.getRecentReports()).isEmpty();
    }

    // --- entity factories ---

    private static MemberEntity member(UUID id, String first, String last) {
        return new MemberEntity(id, first, last, first + "@example.com", null, null, null, LocalDate.now(), null);
    }

    private static EventEntity event(UUID id, String name, Instant start) {
        EventEntity e = new EventEntity();
        e.setId(id);
        e.setName(name);
        e.setStartTime(start);
        e.setEndTime(start.plusSeconds(3_600));
        return e;
    }

    private static FeedbackEntity feedback(UUID id, UUID eventId, UUID memberId, UUID creatorId, Instant createdAt) {
        FeedbackEntity f = new FeedbackEntity();
        f.setId(id);
        f.setEventId(eventId);
        f.setMemberId(memberId);
        f.setCreatorId(creatorId);
        f.setCreatedAt(createdAt);
        f.setRating(5);
        return f;
    }

    private static SportEntity sport(UUID id, String name) {
        SportEntity s = new SportEntity();
        s.setId(id);
        s.setName(name);
        return s;
    }

    private static TeamEntity team(UUID id, String name, UUID sportId) {
        TeamEntity t = new TeamEntity();
        t.setId(id);
        t.setName(name);
        t.setSportId(sportId);
        return t;
    }

    private static DirectorEntity director(UUID sportId, UUID memberId) {
        return new DirectorEntity(new DirectorEntity.Id(sportId, memberId));
    }

    private static TrainerEntity trainer(UUID teamId, UUID memberId) {
        return new TrainerEntity(new TrainerEntity.Id(teamId, memberId));
    }

    private static TraineeEntity trainee(UUID teamId, UUID memberId) {
        return new TraineeEntity(new TraineeEntity.Id(teamId, memberId));
    }

    private static TeamEventEntity teamEvent(UUID eventId, UUID teamId) {
        return new TeamEventEntity(new TeamEventEntity.Id(eventId, teamId));
    }

    private static SportEventEntity sportEvent(UUID eventId, UUID sportId) {
        return new SportEventEntity(new SportEventEntity.Id(eventId, sportId));
    }
}
