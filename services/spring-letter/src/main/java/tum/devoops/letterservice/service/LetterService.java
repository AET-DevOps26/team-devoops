package tum.devoops.letterservice.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import tum.devoops.letterservice.entity.MemberEntity;
import tum.devoops.letterservice.entity.TeamEntity;
import tum.devoops.letterservice.exception.ForbiddenException;
import tum.devoops.letterservice.exception.MailDeliveryException;
import tum.devoops.letterservice.exception.PdfGenerationException;
import tum.devoops.letterservice.model.MailRequest;
import tum.devoops.letterservice.model.PdfRequest;
import tum.devoops.letterservice.repository.DirectorRepository;
import tum.devoops.letterservice.repository.MemberRepository;
import tum.devoops.letterservice.repository.SportRepository;
import tum.devoops.letterservice.repository.TeamRepository;
import tum.devoops.letterservice.repository.TraineeRepository;
import tum.devoops.letterservice.repository.TrainerRepository;
import tum.devoops.letterservice.repository.TransactionRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class LetterService {

    // Tokens are {{snake_case}} per the API description; anything else is left as literal text.
    private static final Pattern TAG_PATTERN = Pattern.compile("\\{\\{([a-z0-9_]+)\\}\\}");

    private final JavaMailSender mailSender;
    private final String from;
    private final MemberRepository memberRepository;
    private final SportRepository sportRepository;
    private final TeamRepository teamRepository;
    private final DirectorRepository directorRepository;
    private final TrainerRepository trainerRepository;
    private final TraineeRepository traineeRepository;
    private final TransactionRepository transactionRepository;
    private final MeterRegistry meterRegistry;

    public LetterService(JavaMailSender mailSender,
                          @Value("${spring.mail.username}") String from,
                          MemberRepository memberRepository,
                          SportRepository sportRepository,
                          TeamRepository teamRepository,
                          DirectorRepository directorRepository,
                          TrainerRepository trainerRepository,
                          TraineeRepository traineeRepository,
                          TransactionRepository transactionRepository,
                          MeterRegistry meterRegistry) {
        this.mailSender = mailSender;
        this.from = from;
        this.memberRepository = memberRepository;
        this.sportRepository = sportRepository;
        this.teamRepository = teamRepository;
        this.directorRepository = directorRepository;
        this.trainerRepository = trainerRepository;
        this.traineeRepository = traineeRepository;
        this.transactionRepository = transactionRepository;
        this.meterRegistry = meterRegistry;
    }

    public void sendMail(MailRequest mailRequest, UUID requesterId, boolean isAdmin) {
        String subject = mailRequest.getSubject();
        String template = mailRequest.getTemplate();

        for (MemberEntity receiver : resolveReceivers(requesterId, isAdmin)) {
            Map<String, String> tokens = tokensFor(receiver);
            String personalizedSubject = replaceTags(subject, tokens);
            String html = replaceTags(template, tokens);
            try {
                sendHtml(receiver.getEmail(), personalizedSubject, html);
                meterRegistry.counter("letters_sent_total", "status", "success").increment();
            } catch (MessagingException e) {
                meterRegistry.counter("letters_sent_total", "status", "failure").increment();
                throw new MailDeliveryException("Failed to send mail to " + receiver.getEmail(), e);
            }
        }
    }

    public Resource getPdf(PdfRequest pdfRequest, UUID requesterId, boolean isAdmin) {
        String template = pdfRequest.getTemplate();

        StringBuilder letters = new StringBuilder();
        for (MemberEntity receiver : resolveReceivers(requesterId, isAdmin)) {
            Map<String, String> tokens = tokensFor(receiver);
            letters.append(renderLetter(tokens.get("full_name"), receiver.getAddress(), replaceTags(template, tokens)));
            meterRegistry.counter("letters_generated_total").increment();
        }

        String html = """
                <html>
                <head>
                <style>
                @page { size: A4; margin: 2.5cm 2cm; }
                body { font-family: sans-serif; font-size: 11pt; }
                .letter + .letter { page-break-before: always; }
                .address-block { margin-bottom: 2.5cm; }
                </style>
                </head>
                <body>%s</body>
                </html>
                """.formatted(letters);
        return new ByteArrayResource(renderPdf(html));
    }

    private static String renderLetter(String fullName, String address, String body) {
        return """
                <div class="letter">
                <div class="address-block">
                <div>%s</div>
                <div>%s</div>
                </div>
                <div class="letter-body">%s</div>
                </div>
                """.formatted(escapeHtml(fullName), escapeHtml(nullToEmpty(address)), body);
    }

    private static byte[] renderPdf(String html) {
        // openhtmltopdf needs well-formed XHTML; jsoup tolerantly parses whatever the template is.
        Document document = Jsoup.parse(html);
        document.outputSettings()
                .syntax(Document.OutputSettings.Syntax.xml)
                .escapeMode(Entities.EscapeMode.xhtml);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            new PdfRendererBuilder()
                    .withHtmlContent(document.html(), null)
                    .toStream(out)
                    .run();
            return out.toByteArray();
        } catch (IOException e) {
            throw new PdfGenerationException("Failed to generate PDF", e);
        }
    }

    private static String escapeHtml(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private void sendHtml(String to, String subject, String html) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }

    // Director/trainer/trainee aren't Spring Security roles here (see LetterController); membership
    // is looked up directly against the organization-schema rows, same pattern as
    // TransactionService.isDirectorOfMember/isTrainerOfMember and FeedbackService.assertTrainerOfMember.
    private List<MemberEntity> resolveReceivers(UUID requesterId, boolean isAdmin) {
        if (isAdmin) {
            return memberRepository.findAll();
        }

        List<UUID> directorSportIds = directorRepository.findSportIdsByMemberId(requesterId);
        if (!directorSportIds.isEmpty()) {
            Set<UUID> receiverIds = new LinkedHashSet<>();
            for (UUID sportId : directorSportIds) {
                receiverIds.addAll(directorRepository.findMemberIdsBySportId(sportId));
                for (TeamEntity team : teamRepository.findAllBySportId(sportId)) {
                    receiverIds.addAll(trainerRepository.findMemberIdsByTeamId(team.getId()));
                    receiverIds.addAll(traineeRepository.findMemberIdsByTeamId(team.getId()));
                }
            }
            return memberRepository.findAllById(receiverIds);
        }

        List<UUID> trainerTeamIds = trainerRepository.findTeamIdsByMemberId(requesterId);
        if (!trainerTeamIds.isEmpty()) {
            Set<UUID> receiverIds = new LinkedHashSet<>();
            for (UUID teamId : trainerTeamIds) {
                receiverIds.addAll(trainerRepository.findMemberIdsByTeamId(teamId));
                receiverIds.addAll(traineeRepository.findMemberIdsByTeamId(teamId));
            }
            return memberRepository.findAllById(receiverIds);
        }

        throw new ForbiddenException("Only admins, directors, or trainers can use the letter service.");
    }

    private Map<String, String> tokensFor(MemberEntity member) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("first_name", nullToEmpty(member.getFirstName()));
        tokens.put("last_name", nullToEmpty(member.getLastName()));
        tokens.put("full_name", (nullToEmpty(member.getFirstName()) + " " + nullToEmpty(member.getLastName())).trim());
        tokens.put("email", nullToEmpty(member.getEmail()));
        tokens.put("address", nullToEmpty(member.getAddress()));
        tokens.put("phone_number", nullToEmpty(member.getPhoneNumber()));
        tokens.put("birthday", member.getBirthday() != null ? member.getBirthday().toString() : "");
        tokens.put("joining_date", member.getJoiningDate() != null ? member.getJoiningDate().toString() : "");

        TeamEntity team = teamOf(member.getId());
        tokens.put("team_name", team != null ? nullToEmpty(team.getName()) : "");
        tokens.put("sport_name", nullToEmpty(sportNameOf(member.getId(), team)));
        tokens.put("balance", formatBalance(balanceOf(member.getId())));
        return tokens;
    }

    // A member belongs to at most one team, either as a trainer or as a trainee.
    private TeamEntity teamOf(UUID memberId) {
        List<UUID> teamIds = trainerRepository.findTeamIdsByMemberId(memberId);
        if (teamIds.isEmpty()) {
            teamIds = traineeRepository.findTeamIdsByMemberId(memberId);
        }
        return teamIds.isEmpty() ? null : teamRepository.findById(teamIds.get(0)).orElse(null);
    }

    private String sportNameOf(UUID memberId, TeamEntity team) {
        UUID sportId;
        if (team != null) {
            sportId = team.getSportId();
        } else {
            List<UUID> sportIds = directorRepository.findSportIdsByMemberId(memberId);
            if (sportIds.isEmpty()) {
                return "";
            }
            sportId = sportIds.get(0);
        }
        return sportRepository.findById(sportId).map(s -> s.getName()).orElse("");
    }

    private int balanceOf(UUID memberId) {
        return transactionRepository.findAllByMemberId(memberId).stream()
                .mapToInt(t -> t.getAmountCents())
                .sum();
    }

    private static String formatBalance(int amountCents) {
        return String.format(Locale.US, "€%.2f", amountCents / 100.0);
    }

    private static String nullToEmpty(String value) {
        return value != null ? value : "";
    }

    private static String replaceTags(String text, Map<String, String> tokens) {
        Matcher matcher = TAG_PATTERN.matcher(text);
        StringBuilder result = new StringBuilder();
        while (matcher.find()) {
            String value = tokens.getOrDefault(matcher.group(1), "");
            matcher.appendReplacement(result, Matcher.quoteReplacement(value));
        }
        matcher.appendTail(result);
        return result.toString();
    }

}
