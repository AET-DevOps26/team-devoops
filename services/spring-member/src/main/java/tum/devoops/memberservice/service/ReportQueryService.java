package tum.devoops.memberservice.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

/**
 * Reads member report summaries from the {@code reports} schema.
 *
 * <p>The reports tables are created at runtime by the Python genai-helper (not via Flyway), so they
 * may not exist when the member service starts. To avoid coupling member-service startup to the
 * genai-helper, reports are read with a plain native query (no mapped {@code @Entity}, so
 * {@code ddl-auto=validate} ignores them) and any access error degrades to an empty list.
 */
@Service
public class ReportQueryService {

    private final JdbcTemplate jdbcTemplate;

    public ReportQueryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /** A row of reports.member_reports, without the generated text. */
    public record MemberReportRow(UUID id, UUID memberId, OffsetDateTime createdAt) {
    }

    /** The most recent {@code limit} reports for a member, newest first; empty if none or unavailable. */
    public List<MemberReportRow> recentMemberReports(UUID memberId, int limit) {
        try {
            return jdbcTemplate.query(
                    "SELECT id, member_id, created_at FROM reports.member_reports "
                            + "WHERE member_id = ? ORDER BY created_at DESC LIMIT ?",
                    (rs, rowNum) -> new MemberReportRow(
                            rs.getObject("id", UUID.class),
                            rs.getObject("member_id", UUID.class),
                            rs.getObject("created_at", OffsetDateTime.class)),
                    memberId, limit);
        } catch (DataAccessException ex) {
            // Table not created yet (genai-helper not started) or otherwise unavailable — degrade gracefully.
            return List.of();
        }
    }
}
