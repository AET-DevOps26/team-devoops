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
 * Data transfer object for creating a new Event.
 */

@Schema(name = "EventCreate", description = "Data transfer object for creating a new Event.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class EventCreate {

  private String name;

  private @Nullable String description;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime startTime;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime endTime;

  @Valid
  private List<String> attendees = new ArrayList<>();

  @Valid
  private List<String> sportsLinked = new ArrayList<>();

  @Valid
  private List<String> teamsLinked = new ArrayList<>();

  public EventCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public EventCreate(String name, OffsetDateTime startTime, OffsetDateTime endTime) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public EventCreate name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  @NotNull 
  @Schema(name = "name", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public EventCreate description(@Nullable String description) {
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

  public EventCreate startTime(OffsetDateTime startTime) {
    this.startTime = startTime;
    return this;
  }

  /**
   * Get startTime
   * @return startTime
   */
  @NotNull @Valid 
  @Schema(name = "start_time", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("start_time")
  public OffsetDateTime getStartTime() {
    return startTime;
  }

  public void setStartTime(OffsetDateTime startTime) {
    this.startTime = startTime;
  }

  public EventCreate endTime(OffsetDateTime endTime) {
    this.endTime = endTime;
    return this;
  }

  /**
   * Get endTime
   * @return endTime
   */
  @NotNull @Valid 
  @Schema(name = "end_time", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("end_time")
  public OffsetDateTime getEndTime() {
    return endTime;
  }

  public void setEndTime(OffsetDateTime endTime) {
    this.endTime = endTime;
  }

  public EventCreate attendees(List<String> attendees) {
    this.attendees = attendees;
    return this;
  }

  public EventCreate addAttendeesItem(String attendeesItem) {
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

  public EventCreate sportsLinked(List<String> sportsLinked) {
    this.sportsLinked = sportsLinked;
    return this;
  }

  public EventCreate addSportsLinkedItem(String sportsLinkedItem) {
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

  public EventCreate teamsLinked(List<String> teamsLinked) {
    this.teamsLinked = teamsLinked;
    return this;
  }

  public EventCreate addTeamsLinkedItem(String teamsLinkedItem) {
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
    EventCreate eventCreate = (EventCreate) o;
    return Objects.equals(this.name, eventCreate.name) &&
        Objects.equals(this.description, eventCreate.description) &&
        Objects.equals(this.startTime, eventCreate.startTime) &&
        Objects.equals(this.endTime, eventCreate.endTime) &&
        Objects.equals(this.attendees, eventCreate.attendees) &&
        Objects.equals(this.sportsLinked, eventCreate.sportsLinked) &&
        Objects.equals(this.teamsLinked, eventCreate.teamsLinked);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, startTime, endTime, attendees, sportsLinked, teamsLinked);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class EventCreate {\n");
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

