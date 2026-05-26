package tum.devoops.eventservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Data transfer object for partially updating an existing Event (PATCH operation).
 */

@Schema(name = "EventPartialUpdate", description = "Data transfer object for partially updating an existing Event (PATCH operation).")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class EventPartialUpdate {

  private @Nullable String name;

  private @Nullable String description;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime startTime;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime endTime;

  @Valid
  private List<String> attendees = new ArrayList<>();

  @Valid
  private List<String> sportsLinked = new ArrayList<>();

  @Valid
  private List<String> teamsLinked = new ArrayList<>();

  public EventPartialUpdate name(@Nullable String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  
  @Schema(name = "name", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("name")
  public @Nullable String getName() {
    return name;
  }

  public void setName(@Nullable String name) {
    this.name = name;
  }

  public EventPartialUpdate description(@Nullable String description) {
    this.description = description;
    return this;
  }

  /**
   * Get description
   * @return description
   */
  
  @Schema(name = "description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public @Nullable String getDescription() {
    return description;
  }

  public void setDescription(@Nullable String description) {
    this.description = description;
  }

  public EventPartialUpdate startTime(@Nullable OffsetDateTime startTime) {
    this.startTime = startTime;
    return this;
  }

  /**
   * Get startTime
   * @return startTime
   */
  @Valid 
  @Schema(name = "start_time", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("start_time")
  public @Nullable OffsetDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(@Nullable OffsetDateTime startTime) {
    this.startTime = startTime;
  }

  public EventPartialUpdate endTime(@Nullable OffsetDateTime endTime) {
    this.endTime = endTime;
    return this;
  }

  /**
   * Get endTime
   * @return endTime
   */
  @Valid 
  @Schema(name = "end_time", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("end_time")
  public @Nullable OffsetDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(@Nullable OffsetDateTime endTime) {
    this.endTime = endTime;
  }

  public EventPartialUpdate attendees(List<String> attendees) {
    this.attendees = attendees;
    return this;
  }

  public EventPartialUpdate addAttendeesItem(String attendeesItem) {
    if (this.attendees == null) {
      this.attendees = new ArrayList<>();
    }
    this.attendees.add(attendeesItem);
    return this;
  }

  /**
   * Get attendees
   * @return attendees
   */
  
  @Schema(name = "attendees", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("attendees")
  public List<String> getAttendees() {
    return attendees;
  }

  public void setAttendees(List<String> attendees) {
    this.attendees = attendees;
  }

  public EventPartialUpdate sportsLinked(List<String> sportsLinked) {
    this.sportsLinked = sportsLinked;
    return this;
  }

  public EventPartialUpdate addSportsLinkedItem(String sportsLinkedItem) {
    if (this.sportsLinked == null) {
      this.sportsLinked = new ArrayList<>();
    }
    this.sportsLinked.add(sportsLinkedItem);
    return this;
  }

  /**
   * Get sportsLinked
   * @return sportsLinked
   */
  
  @Schema(name = "sports_linked", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("sports_linked")
  public List<String> getSportsLinked() {
    return sportsLinked;
  }

  public void setSportsLinked(List<String> sportsLinked) {
    this.sportsLinked = sportsLinked;
  }

  public EventPartialUpdate teamsLinked(List<String> teamsLinked) {
    this.teamsLinked = teamsLinked;
    return this;
  }

  public EventPartialUpdate addTeamsLinkedItem(String teamsLinkedItem) {
    if (this.teamsLinked == null) {
      this.teamsLinked = new ArrayList<>();
    }
    this.teamsLinked.add(teamsLinkedItem);
    return this;
  }

  /**
   * Get teamsLinked
   * @return teamsLinked
   */
  
  @Schema(name = "teams_linked", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("teams_linked")
  public List<String> getTeamsLinked() {
    return teamsLinked;
  }

  public void setTeamsLinked(List<String> teamsLinked) {
    this.teamsLinked = teamsLinked;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    EventPartialUpdate eventPartialUpdate = (EventPartialUpdate) o;
    return Objects.equals(this.name, eventPartialUpdate.name) &&
        Objects.equals(this.description, eventPartialUpdate.description) &&
        Objects.equals(this.startTime, eventPartialUpdate.startTime) &&
        Objects.equals(this.endTime, eventPartialUpdate.endTime) &&
        Objects.equals(this.attendees, eventPartialUpdate.attendees) &&
        Objects.equals(this.sportsLinked, eventPartialUpdate.sportsLinked) &&
        Objects.equals(this.teamsLinked, eventPartialUpdate.teamsLinked);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, startTime, endTime, attendees, sportsLinked, teamsLinked);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventPartialUpdate {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    startTime: ").append(toIndentedString(startTime)).append("\n");
    sb.append("    endTime: ").append(toIndentedString(endTime)).append("\n");
    sb.append("    attendees: ").append(toIndentedString(attendees)).append("\n");
    sb.append("    sportsLinked: ").append(toIndentedString(sportsLinked)).append("\n");
    sb.append("    teamsLinked: ").append(toIndentedString(teamsLinked)).append("\n");
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

