package tum.devoops.memberservice.service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tum.devoops.memberservice.entity.DirectorEntity;
import tum.devoops.memberservice.entity.EventEntity;
import tum.devoops.memberservice.entity.FeedbackEntity;
import tum.devoops.memberservice.entity.SportEntity;
import tum.devoops.memberservice.entity.TeamEntity;
import tum.devoops.memberservice.entity.TraineeEntity;
import tum.devoops.memberservice.entity.TrainerEntity;
import tum.devoops.memberservice.model.AdminDashboard;
import tum.devoops.memberservice.model.Dashboard;
import tum.devoops.memberservice.model.DirectorDashboard;
import tum.devoops.memberservice.model.EventSummary;
import tum.devoops.memberservice.model.FeedbackSummary;
import tum.devoops.memberservice.model.MemberReportSummary;
import tum.devoops.memberservice.model.Reference;
import tum.devoops.memberservice.model.TeamBalanceSummary;
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

/**
 * Builds the role-specific dashboard for the calling member by aggregating read-only data across the
 * organization, event, feedback, finance and reports schemas. The caller's highest role decides the
 * shape: admin &gt; director &gt; trainer &gt; trainee. A director directs exactly one sport, a trainer
 * trains exactly one team and a trainee belongs to exactly one team (simplifying assumption).
 */
@Service
public class DashboardService {

    private static final int TRAINER_FEEDBACK_LIMIT = 10;
    private static final int TRAINEE_REPORT_LIMIT = 3;

    // Discriminator values for the Dashboard oneOf (must match the schema's discriminator mapping).
    private static final String ROLE_ADMIN = "admin";
    private static final String ROLE_DIRECTOR = "director";
    private static final String ROLE_TRAINER = "trainer";
    private static final String ROLE_TRAINEE = "trainee";

    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private SportRepository sportRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private DirectorRepository directorRepository;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TeamEventRepository teamEventRepository;
    @Autowired
    private SportEventRepository sportEventRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ReportQueryService reportQueryService;

    @Transactional(readOnly = true)
    public Dashboard getDashboard(UUID requesterId, boolean isAdmin) {
        if (isAdmin) {
            return adminDashboard();
        }
        List<DirectorEntity> directorRoles = directorRepository.findAllById_MemberId(requesterId);
        if (!directorRoles.isEmpty()) {
            return directorDashboard(directorRoles.get(0).getId().getSportId());
        }
        List<TrainerEntity> trainerRoles = trainerRepository.findAllById_MemberId(requesterId);
        if (!trainerRoles.isEmpty()) {
            return trainerDashboard(requesterId, trainerRoles.get(0).getId().getTeamId());
        }
        // Default view: trainee/member (also covers a plain member with no team membership).
        List<TraineeEntity> traineeRoles = traineeRepository.findAllById_MemberId(requesterId);
        UUID teamId = traineeRoles.isEmpty() ? null : traineeRoles.get(0).getId().getTeamId();
        return traineeDashboard(requesterId, teamId);
    }

    private AdminDashboard adminDashboard() {
        Instant[] week = currentWeek();
        return new AdminDashboard(
                ROLE_ADMIN,
                (int) memberRepository.count(),
                (int) sportRepository.count(),
                (int) teamRepository.count(),
                (int) directorRepository.count(),
                (int) trainerRepository.count(),
                (int) transactionRepository.sumAllAmounts(),
                (int) eventRepository.countInWindow(week[0], week[1]));
    }

    private DirectorDashboard directorDashboard(UUID sportId) {
        List<TeamEntity> teams = teamRepository.findAllBySportId(sportId);
        List<TeamBalanceSummary> teamSummaries = new ArrayList<>();
        int totalMembers = 0;
        long sportBalance = 0;
        for (TeamEntity team : teams) {
            List<TraineeEntity> trainees = traineeRepository.findAllById_TeamId(team.getId());
            long teamBalance = 0;
            for (TraineeEntity trainee : trainees) {
                teamBalance += transactionRepository.sumAmountByMemberId(trainee.getId().getMemberId());
            }
            totalMembers += trainees.size();
            sportBalance += teamBalance;
            teamSummaries.add(new TeamBalanceSummary(
                    new Reference(team.getId(), team.getName()),
                    trainees.size(),
                    (int) teamBalance));
        }
        int upcoming = upcomingEvents(sportEventIds(sportId, teams)).size();
        return new DirectorDashboard(
                ROLE_DIRECTOR,
                sportReference(sportId),
                teams.size(),
                totalMembers,
                (int) sportBalance,
                upcoming,
                teamSummaries);
    }

    private TrainerDashboard trainerDashboard(UUID requesterId, UUID teamId) {
        int totalMembers = traineeRepository.findAllById_TeamId(teamId).size();
        int upcoming = upcomingEvents(teamEventIds(teamId)).size();
        List<FeedbackSummary> recentFeedback = feedbackRepository.findAllByCreatorId(requesterId).stream()
                .sorted(Comparator.comparing(FeedbackEntity::getCreatedAt).reversed())
                .limit(TRAINER_FEEDBACK_LIMIT)
                .map(this::feedbackSummary)
                .toList();
        return new TrainerDashboard(
                ROLE_TRAINER,
                teamReference(teamId),
                totalMembers,
                upcoming,
                recentFeedback);
    }

    private TraineeDashboard traineeDashboard(UUID requesterId, UUID teamId) {
        List<EventEntity> upcoming = upcomingEvents(traineeEventIds(teamId));
        EventSummary nextEvent = upcoming.isEmpty() ? null : eventSummary(upcoming.get(0));
        Instant monthAgo = OffsetDateTime.now(ZoneOffset.UTC).minusMonths(1).toInstant();
        List<FeedbackSummary> recentFeedback = feedbackRepository.findAllByMemberId(requesterId).stream()
                .filter(f -> f.getCreatedAt().isAfter(monthAgo))
                .sorted(Comparator.comparing(FeedbackEntity::getCreatedAt).reversed())
                .map(this::feedbackSummary)
                .toList();
        List<MemberReportSummary> recentReports =
                reportQueryService.recentMemberReports(requesterId, TRAINEE_REPORT_LIMIT).stream()
                        .map(this::memberReportSummary)
                        .toList();
        return new TraineeDashboard(
                ROLE_TRAINEE,
                (int) transactionRepository.sumAmountByMemberId(requesterId),
                nextEvent,
                upcoming.size(),
                recentFeedback,
                recentReports);
    }

    // --- event helpers ---

    // Distinct event ids linked to a sport directly or via any of its teams.
    private Set<UUID> sportEventIds(UUID sportId, List<TeamEntity> teams) {
        Set<UUID> ids = new LinkedHashSet<>();
        sportEventRepository.findAllById_SportId(sportId).forEach(se -> ids.add(se.getId().getEventId()));
        for (TeamEntity team : teams) {
            teamEventRepository.findAllById_TeamId(team.getId()).forEach(te -> ids.add(te.getId().getEventId()));
        }
        return ids;
    }

    private Set<UUID> teamEventIds(UUID teamId) {
        Set<UUID> ids = new LinkedHashSet<>();
        teamEventRepository.findAllById_TeamId(teamId).forEach(te -> ids.add(te.getId().getEventId()));
        return ids;
    }

    // Event ids relevant to a trainee: their team's events plus their team's sport's events.
    private Set<UUID> traineeEventIds(UUID teamId) {
        Set<UUID> ids = new LinkedHashSet<>();
        if (teamId == null) {
            return ids;
        }
        teamEventRepository.findAllById_TeamId(teamId).forEach(te -> ids.add(te.getId().getEventId()));
        teamRepository.findById(teamId).ifPresent(team ->
                sportEventRepository.findAllById_SportId(team.getSportId())
                        .forEach(se -> ids.add(se.getId().getEventId())));
        return ids;
    }

    // Future events among the given ids, soonest first.
    private List<EventEntity> upcomingEvents(Set<UUID> eventIds) {
        if (eventIds.isEmpty()) {
            return List.of();
        }
        Instant now = Instant.now();
        return eventRepository.findAllById(eventIds).stream()
                .filter(e -> e.getStartTime().isAfter(now))
                .sorted(Comparator.comparing(EventEntity::getStartTime))
                .toList();
    }

    private static Instant[] currentWeek() {
        LocalDate monday = LocalDate.now(ZoneOffset.UTC).with(DayOfWeek.MONDAY);
        Instant start = monday.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant end = monday.plusWeeks(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        return new Instant[]{start, end};
    }

    // --- reference / summary builders ---

    private Reference memberReference(UUID memberId) {
        // memberId is null only for a feedback creator whose member was deleted (ON DELETE SET NULL).
        if (memberId == null) {
            return null;
        }
        String name = memberRepository.findById(memberId)
                .map(m -> m.getFirstName() + " " + m.getLastName()).orElse(null);
        return new Reference(memberId, name);
    }

    private Reference eventReference(UUID eventId) {
        String name = eventRepository.findById(eventId).map(EventEntity::getName).orElse(null);
        return new Reference(eventId, name);
    }

    private Reference sportReference(UUID sportId) {
        String name = sportRepository.findById(sportId).map(SportEntity::getName).orElse(null);
        return new Reference(sportId, name);
    }

    private Reference teamReference(UUID teamId) {
        String name = teamRepository.findById(teamId).map(TeamEntity::getName).orElse(null);
        return new Reference(teamId, name);
    }

    private FeedbackSummary feedbackSummary(FeedbackEntity f) {
        return new FeedbackSummary(
                f.getId(),
                eventReference(f.getEventId()),
                memberReference(f.getMemberId()),
                memberReference(f.getCreatorId()),
                f.getCreatedAt().atOffset(ZoneOffset.UTC),
                f.getRating());
    }

    private EventSummary eventSummary(EventEntity e) {
        return new EventSummary(
                e.getId(),
                e.getName(),
                e.getStartTime().atOffset(ZoneOffset.UTC),
                e.getEndTime().atOffset(ZoneOffset.UTC));
    }

    private MemberReportSummary memberReportSummary(ReportQueryService.MemberReportRow row) {
        return new MemberReportSummary(row.id(), memberReference(row.memberId()), row.createdAt());
    }
}
