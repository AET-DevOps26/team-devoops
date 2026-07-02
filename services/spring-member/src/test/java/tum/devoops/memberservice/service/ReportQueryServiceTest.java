package tum.devoops.memberservice.service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportQueryServiceTest {

    @Mock private JdbcTemplate jdbcTemplate;

    @InjectMocks private ReportQueryService service;

    private static final UUID MEMBER_ID = UUID.randomUUID();

    @Test
    @SuppressWarnings("unchecked")
    void recentMemberReports_returnsMappedRows() {
        List<ReportQueryService.MemberReportRow> rows = List.of(
                new ReportQueryService.MemberReportRow(UUID.randomUUID(), MEMBER_ID, OffsetDateTime.now(ZoneOffset.UTC)));
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), any(), any())).thenReturn(rows);

        assertThat(service.recentMemberReports(MEMBER_ID, 3)).isEqualTo(rows);
    }

    @Test
    @SuppressWarnings("unchecked")
    void recentMemberReports_returnsEmptyWhenTableUnavailable() {
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), any(), any()))
                .thenThrow(new InvalidDataAccessResourceUsageException("relation \"reports.member_reports\" does not exist"));

        assertThat(service.recentMemberReports(MEMBER_ID, 3)).isEmpty();
    }
}
