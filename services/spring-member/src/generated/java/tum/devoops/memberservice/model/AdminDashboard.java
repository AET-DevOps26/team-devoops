package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Club-wide aggregates shown to administrators.
 */

@Schema(name = "AdminDashboard", description = "Club-wide aggregates shown to administrators.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class AdminDashboard implements Dashboard {

  private String role;

  private Integer totalMembers;

  private Integer totalSports;

  private Integer totalTeams;

  private Integer totalDirectors;

  private Integer totalTrainers;

  private Integer totalBalanceCents;

  private Integer eventsThisWeek;

  public AdminDashboard() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AdminDashboard(String role, Integer totalMembers, Integer totalSports, Integer totalTeams, Integer totalDirectors, Integer totalTrainers, Integer totalBalanceCents, Integer eventsThisWeek) {
    this.role = role;
    this.totalMembers = totalMembers;
    this.totalSports = totalSports;
    this.totalTeams = totalTeams;
    this.totalDirectors = totalDirectors;
    this.totalTrainers = totalTrainers;
    this.totalBalanceCents = totalBalanceCents;
    this.eventsThisWeek = eventsThisWeek;
  }

  public AdminDashboard role(String role) {
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

  public AdminDashboard totalMembers(Integer totalMembers) {
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

  public AdminDashboard totalSports(Integer totalSports) {
    this.totalSports = totalSports;
    return this;
  }

  /**
   * Get totalSports
   * @return totalSports
   */
  @NotNull 
  @Schema(name = "total_sports", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_sports")
  public Integer getTotalSports() {
    return totalSports;
  }

  public void setTotalSports(Integer totalSports) {
    this.totalSports = totalSports;
  }

  public AdminDashboard totalTeams(Integer totalTeams) {
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

  public AdminDashboard totalDirectors(Integer totalDirectors) {
    this.totalDirectors = totalDirectors;
    return this;
  }

  /**
   * Get totalDirectors
   * @return totalDirectors
   */
  @NotNull 
  @Schema(name = "total_directors", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_directors")
  public Integer getTotalDirectors() {
    return totalDirectors;
  }

  public void setTotalDirectors(Integer totalDirectors) {
    this.totalDirectors = totalDirectors;
  }

  public AdminDashboard totalTrainers(Integer totalTrainers) {
    this.totalTrainers = totalTrainers;
    return this;
  }

  /**
   * Get totalTrainers
   * @return totalTrainers
   */
  @NotNull 
  @Schema(name = "total_trainers", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_trainers")
  public Integer getTotalTrainers() {
    return totalTrainers;
  }

  public void setTotalTrainers(Integer totalTrainers) {
    this.totalTrainers = totalTrainers;
  }

  public AdminDashboard totalBalanceCents(Integer totalBalanceCents) {
    this.totalBalanceCents = totalBalanceCents;
    return this;
  }

  /**
   * Get totalBalanceCents
   * @return totalBalanceCents
   */
  @NotNull 
  @Schema(name = "total_balance_cents", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("total_balance_cents")
  public Integer getTotalBalanceCents() {
    return totalBalanceCents;
  }

  public void setTotalBalanceCents(Integer totalBalanceCents) {
    this.totalBalanceCents = totalBalanceCents;
  }

  public AdminDashboard eventsThisWeek(Integer eventsThisWeek) {
    this.eventsThisWeek = eventsThisWeek;
    return this;
  }

  /**
   * Get eventsThisWeek
   * @return eventsThisWeek
   */
  @NotNull 
  @Schema(name = "events_this_week", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("events_this_week")
  public Integer getEventsThisWeek() {
    return eventsThisWeek;
  }

  public void setEventsThisWeek(Integer eventsThisWeek) {
    this.eventsThisWeek = eventsThisWeek;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AdminDashboard adminDashboard = (AdminDashboard) o;
    return Objects.equals(this.role, adminDashboard.role) &&
        Objects.equals(this.totalMembers, adminDashboard.totalMembers) &&
        Objects.equals(this.totalSports, adminDashboard.totalSports) &&
        Objects.equals(this.totalTeams, adminDashboard.totalTeams) &&
        Objects.equals(this.totalDirectors, adminDashboard.totalDirectors) &&
        Objects.equals(this.totalTrainers, adminDashboard.totalTrainers) &&
        Objects.equals(this.totalBalanceCents, adminDashboard.totalBalanceCents) &&
        Objects.equals(this.eventsThisWeek, adminDashboard.eventsThisWeek);
  }

  @Override
  public int hashCode() {
    return Objects.hash(role, totalMembers, totalSports, totalTeams, totalDirectors, totalTrainers, totalBalanceCents, eventsThisWeek);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AdminDashboard {\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    totalMembers: ").append(toIndentedString(totalMembers)).append("\n");
    sb.append("    totalSports: ").append(toIndentedString(totalSports)).append("\n");
    sb.append("    totalTeams: ").append(toIndentedString(totalTeams)).append("\n");
    sb.append("    totalDirectors: ").append(toIndentedString(totalDirectors)).append("\n");
    sb.append("    totalTrainers: ").append(toIndentedString(totalTrainers)).append("\n");
    sb.append("    totalBalanceCents: ").append(toIndentedString(totalBalanceCents)).append("\n");
    sb.append("    eventsThisWeek: ").append(toIndentedString(eventsThisWeek)).append("\n");
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

