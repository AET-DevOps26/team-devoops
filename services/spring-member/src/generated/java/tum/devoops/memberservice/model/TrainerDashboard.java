package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import tum.devoops.memberservice.model.FeedbackSummary;
import tum.devoops.memberservice.model.Reference;
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
 * Aggregates for the team a trainer manages, including feedback they authored.
 */

@Schema(name = "TrainerDashboard", description = "Aggregates for the team a trainer manages, including feedback they authored.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class TrainerDashboard implements Dashboard {

  private String role;

  private Reference team;

  private Integer totalMembers;

  private Integer upcomingEvents;

  @Valid
  private List<@Valid FeedbackSummary> recentFeedback;

  public TrainerDashboard() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public TrainerDashboard(String role, Reference team, Integer totalMembers, Integer upcomingEvents, List<@Valid FeedbackSummary> recentFeedback) {
    this.role = role;
    this.team = team;
    this.totalMembers = totalMembers;
    this.upcomingEvents = upcomingEvents;
    this.recentFeedback = recentFeedback;
  }

  public TrainerDashboard role(String role) {
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

  public TrainerDashboard team(Reference team) {
    this.team = team;
    return this;
  }

  /**
   * Get team
   * @return team
   */
  @NotNull @Valid 
  @Schema(name = "team", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("team")
  public Reference getTeam() {
    return team;
  }

  public void setTeam(Reference team) {
    this.team = team;
  }

  public TrainerDashboard totalMembers(Integer totalMembers) {
    this.totalMembers = totalMembers;
    return this;
  }

  /**
   * Get totalMembers
   * @return totalMembers
   */
  @NotNull 
  @Schema(name = "total_members", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_members")
  public Integer getTotalMembers() {
    return totalMembers;
  }

  public void setTotalMembers(Integer totalMembers) {
    this.totalMembers = totalMembers;
  }

  public TrainerDashboard upcomingEvents(Integer upcomingEvents) {
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

  public TrainerDashboard recentFeedback(List<@Valid FeedbackSummary> recentFeedback) {
    this.recentFeedback = recentFeedback;
    return this;
  }

  public TrainerDashboard addRecentFeedbackItem(FeedbackSummary recentFeedbackItem) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TrainerDashboard trainerDashboard = (TrainerDashboard) o;
    return Objects.equals(this.role, trainerDashboard.role) &&
        Objects.equals(this.team, trainerDashboard.team) &&
        Objects.equals(this.totalMembers, trainerDashboard.totalMembers) &&
        Objects.equals(this.upcomingEvents, trainerDashboard.upcomingEvents) &&
        Objects.equals(this.recentFeedback, trainerDashboard.recentFeedback);
  }

  @Override
  public int hashCode() {
    return Objects.hash(role, team, totalMembers, upcomingEvents, recentFeedback);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TrainerDashboard {\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    team: ").append(toIndentedString(team)).append("\n");
    sb.append("    totalMembers: ").append(toIndentedString(totalMembers)).append("\n");
    sb.append("    upcomingEvents: ").append(toIndentedString(upcomingEvents)).append("\n");
    sb.append("    recentFeedback: ").append(toIndentedString(recentFeedback)).append("\n");
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

