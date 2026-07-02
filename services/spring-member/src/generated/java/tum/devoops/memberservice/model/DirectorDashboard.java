package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import tum.devoops.memberservice.model.Reference;
import tum.devoops.memberservice.model.TeamBalanceSummary;
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
 * Aggregates for the sport a director manages.
 */

@Schema(name = "DirectorDashboard", description = "Aggregates for the sport a director manages.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class DirectorDashboard implements Dashboard {

  private String role;

  private Reference sport;

  private Integer totalTeams;

  private Integer totalMembers;

  private Integer sportBalanceCents;

  private Integer upcomingEvents;

  @Valid
  private List<@Valid TeamBalanceSummary> teams;

  public DirectorDashboard() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public DirectorDashboard(String role, Reference sport, Integer totalTeams, Integer totalMembers, Integer sportBalanceCents, Integer upcomingEvents, List<@Valid TeamBalanceSummary> teams) {
    this.role = role;
    this.sport = sport;
    this.totalTeams = totalTeams;
    this.totalMembers = totalMembers;
    this.sportBalanceCents = sportBalanceCents;
    this.upcomingEvents = upcomingEvents;
    this.teams = teams;
  }

  public DirectorDashboard role(String role) {
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

  public DirectorDashboard sport(Reference sport) {
    this.sport = sport;
    return this;
  }

  /**
   * Get sport
   * @return sport
   */
  @NotNull @Valid 
  @Schema(name = "sport", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("sport")
  public Reference getSport() {
    return sport;
  }

  public void setSport(Reference sport) {
    this.sport = sport;
  }

  public DirectorDashboard totalTeams(Integer totalTeams) {
    this.totalTeams = totalTeams;
    return this;
  }

  /**
   * Get totalTeams
   * @return totalTeams
   */
  @NotNull 
  @Schema(name = "total_teams", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_teams")
  public Integer getTotalTeams() {
    return totalTeams;
  }

  public void setTotalTeams(Integer totalTeams) {
    this.totalTeams = totalTeams;
  }

  public DirectorDashboard totalMembers(Integer totalMembers) {
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

  public DirectorDashboard sportBalanceCents(Integer sportBalanceCents) {
    this.sportBalanceCents = sportBalanceCents;
    return this;
  }

  /**
   * Get sportBalanceCents
   * @return sportBalanceCents
   */
  @NotNull 
  @Schema(name = "sport_balance_cents", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("sport_balance_cents")
  public Integer getSportBalanceCents() {
    return sportBalanceCents;
  }

  public void setSportBalanceCents(Integer sportBalanceCents) {
    this.sportBalanceCents = sportBalanceCents;
  }

  public DirectorDashboard upcomingEvents(Integer upcomingEvents) {
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

  public DirectorDashboard teams(List<@Valid TeamBalanceSummary> teams) {
    this.teams = teams;
    return this;
  }

  public DirectorDashboard addTeamsItem(TeamBalanceSummary teamsItem) {
    if (this.teams == null) {
      this.teams = new ArrayList<>();
    }
    this.teams.add(teamsItem);
    return this;
  }

  /**
   * Get teams
   * @return teams
   */
  @NotNull @Valid 
  @Schema(name = "teams", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("teams")
  public List<@Valid TeamBalanceSummary> getTeams() {
    return teams;
  }

  public void setTeams(List<@Valid TeamBalanceSummary> teams) {
    this.teams = teams;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DirectorDashboard directorDashboard = (DirectorDashboard) o;
    return Objects.equals(this.role, directorDashboard.role) &&
        Objects.equals(this.sport, directorDashboard.sport) &&
        Objects.equals(this.totalTeams, directorDashboard.totalTeams) &&
        Objects.equals(this.totalMembers, directorDashboard.totalMembers) &&
        Objects.equals(this.sportBalanceCents, directorDashboard.sportBalanceCents) &&
        Objects.equals(this.upcomingEvents, directorDashboard.upcomingEvents) &&
        Objects.equals(this.teams, directorDashboard.teams);
  }

  @Override
  public int hashCode() {
    return Objects.hash(role, sport, totalTeams, totalMembers, sportBalanceCents, upcomingEvents, teams);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class DirectorDashboard {\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    sport: ").append(toIndentedString(sport)).append("\n");
    sb.append("    totalTeams: ").append(toIndentedString(totalTeams)).append("\n");
    sb.append("    totalMembers: ").append(toIndentedString(totalMembers)).append("\n");
    sb.append("    sportBalanceCents: ").append(toIndentedString(sportBalanceCents)).append("\n");
    sb.append("    upcomingEvents: ").append(toIndentedString(upcomingEvents)).append("\n");
    sb.append("    teams: ").append(toIndentedString(teams)).append("\n");
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

