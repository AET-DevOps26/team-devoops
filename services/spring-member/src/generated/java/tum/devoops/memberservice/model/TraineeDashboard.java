package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import tum.devoops.memberservice.model.EventSummary;
import tum.devoops.memberservice.model.FeedbackSummary;
import tum.devoops.memberservice.model.MemberReportSummary;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Personal aggregates shown to a trainee/member.
 */

@Schema(name = "TraineeDashboard", description = "Personal aggregates shown to a trainee/member.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class TraineeDashboard implements Dashboard {

  private String role;

  private Integer balanceCents;

  private EventSummary nextEvent = null;

  private Integer upcomingEvents;

  @Valid
  private List<@Valid FeedbackSummary> recentFeedback;

  @Valid
  private List<@Valid MemberReportSummary> recentReports;

  public TraineeDashboard() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public TraineeDashboard(String role, Integer balanceCents, EventSummary nextEvent, Integer upcomingEvents, List<@Valid FeedbackSummary> recentFeedback, List<@Valid MemberReportSummary> recentReports) {
    this.role = role;
    this.balanceCents = balanceCents;
    this.nextEvent = nextEvent;
    this.upcomingEvents = upcomingEvents;
    this.recentFeedback = recentFeedback;
    this.recentReports = recentReports;
  }

  public TraineeDashboard role(String role) {
    this.role = role;
    return this;
  }

  /**
   * Get role
   * @return role
   */
  @NotNull 
  @Schema(name = "role", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("role")
  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public TraineeDashboard balanceCents(Integer balanceCents) {
    this.balanceCents = balanceCents;
    return this;
  }

  /**
   * Get balanceCents
   * @return balanceCents
   */
  @NotNull 
  @Schema(name = "balance_cents", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("balance_cents")
  public Integer getBalanceCents() {
    return balanceCents;
  }

  public void setBalanceCents(Integer balanceCents) {
    this.balanceCents = balanceCents;
  }

  public TraineeDashboard nextEvent(EventSummary nextEvent) {
    this.nextEvent = nextEvent;
    return this;
  }

  /**
   * Get nextEvent
   * @return nextEvent
   */
  @NotNull @Valid 
  @Schema(name = "next_event", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("next_event")
  public EventSummary getNextEvent() {
    return nextEvent;
  }

  public void setNextEvent(EventSummary nextEvent) {
    this.nextEvent = nextEvent;
  }

  public TraineeDashboard upcomingEvents(Integer upcomingEvents) {
    this.upcomingEvents = upcomingEvents;
    return this;
  }

  /**
   * Get upcomingEvents
   * @return upcomingEvents
   */
  @NotNull 
  @Schema(name = "upcoming_events", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("upcoming_events")
  public Integer getUpcomingEvents() {
    return upcomingEvents;
  }

  public void setUpcomingEvents(Integer upcomingEvents) {
    this.upcomingEvents = upcomingEvents;
  }

  public TraineeDashboard recentFeedback(List<@Valid FeedbackSummary> recentFeedback) {
    this.recentFeedback = recentFeedback;
    return this;
  }

  public TraineeDashboard addRecentFeedbackItem(FeedbackSummary recentFeedbackItem) {
    if (this.recentFeedback == null) {
      this.recentFeedback = new ArrayList<>();
    }
    this.recentFeedback.add(recentFeedbackItem);
    return this;
  }

  /**
   * Get recentFeedback
   * @return recentFeedback
   */
  @NotNull @Valid 
  @Schema(name = "recent_feedback", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("recent_feedback")
  public List<@Valid FeedbackSummary> getRecentFeedback() {
    return recentFeedback;
  }

  public void setRecentFeedback(List<@Valid FeedbackSummary> recentFeedback) {
    this.recentFeedback = recentFeedback;
  }

  public TraineeDashboard recentReports(List<@Valid MemberReportSummary> recentReports) {
    this.recentReports = recentReports;
    return this;
  }

  public TraineeDashboard addRecentReportsItem(MemberReportSummary recentReportsItem) {
    if (this.recentReports == null) {
      this.recentReports = new ArrayList<>();
    }
    this.recentReports.add(recentReportsItem);
    return this;
  }

  /**
   * Get recentReports
   * @return recentReports
   */
  @NotNull @Valid 
  @Schema(name = "recent_reports", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("recent_reports")
  public List<@Valid MemberReportSummary> getRecentReports() {
    return recentReports;
  }

  public void setRecentReports(List<@Valid MemberReportSummary> recentReports) {
    this.recentReports = recentReports;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TraineeDashboard traineeDashboard = (TraineeDashboard) o;
    return Objects.equals(this.role, traineeDashboard.role) &&
        Objects.equals(this.balanceCents, traineeDashboard.balanceCents) &&
        Objects.equals(this.nextEvent, traineeDashboard.nextEvent) &&
        Objects.equals(this.upcomingEvents, traineeDashboard.upcomingEvents) &&
        Objects.equals(this.recentFeedback, traineeDashboard.recentFeedback) &&
        Objects.equals(this.recentReports, traineeDashboard.recentReports);
  }

  @Override
  public int hashCode() {
    return Objects.hash(role, balanceCents, nextEvent, upcomingEvents, recentFeedback, recentReports);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TraineeDashboard {\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    balanceCents: ").append(toIndentedString(balanceCents)).append("\n");
    sb.append("    nextEvent: ").append(toIndentedString(nextEvent)).append("\n");
    sb.append("    upcomingEvents: ").append(toIndentedString(upcomingEvents)).append("\n");
    sb.append("    recentFeedback: ").append(toIndentedString(recentFeedback)).append("\n");
    sb.append("    recentReports: ").append(toIndentedString(recentReports)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

