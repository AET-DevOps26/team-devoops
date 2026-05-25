package tum.devoops.eventservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * 
 */

@Schema(name = "Event", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Event {

  private String id;

  private String name;

  private String description;

  private String startTime;

  private String endTime;

  @Valid
  private List<String> attendees = new ArrayList<>();

  @Valid
  private List<String> sportsLinked = new ArrayList<>();

  @Valid
  private List<String> teamsLinked = new ArrayList<>();

  private String creator;

  public Event() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Event(String id, String name, String description, String startTime, String endTime, String creator) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.creator = creator;
  }

  public Event id(String id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
   */
  @NotNull 
  @Schema(name = "id", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("id")
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Event name(String name) {
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

  public Event description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Get description
   * @return description
   */
  @NotNull 
  @Schema(name = "description", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Event startTime(String startTime) {
    this.startTime = startTime;
    return this;
  }

  /**
   * Get startTime
   * @return startTime
   */
  @NotNull 
  @Schema(name = "start_time", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("start_time")
  public String getStartTime() {
    return startTime;
  }

  public void setStartTime(String startTime) {
    this.startTime = startTime;
  }

  public Event endTime(String endTime) {
    this.endTime = endTime;
    return this;
  }

  /**
   * Get endTime
   * @return endTime
   */
  @NotNull 
  @Schema(name = "end_time", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("end_time")
  public String getEndTime() {
    return endTime;
  }

  public void setEndTime(String endTime) {
    this.endTime = endTime;
  }

  public Event attendees(List<String> attendees) {
    this.attendees = attendees;
    return this;
  }

  public Event addAttendeesItem(String attendeesItem) {
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

  public Event sportsLinked(List<String> sportsLinked) {
    this.sportsLinked = sportsLinked;
    return this;
  }

  public Event addSportsLinkedItem(String sportsLinkedItem) {
    if (this.sportsLinked == null) {
      this.sportsLinked = new ArrayList<>();
    }
    this.sportsLinked.add(sportsLinkedItem);
    return this;
  }

  /**
   * Names of the sports associated with this event.
   * @return sportsLinked
   */
  
  @Schema(name = "sports_linked", description = "Names of the sports associated with this event.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("sports_linked")
  public List<String> getSportsLinked() {
    return sportsLinked;
  }

  public void setSportsLinked(List<String> sportsLinked) {
    this.sportsLinked = sportsLinked;
  }

  public Event teamsLinked(List<String> teamsLinked) {
    this.teamsLinked = teamsLinked;
    return this;
  }

  public Event addTeamsLinkedItem(String teamsLinkedItem) {
    if (this.teamsLinked == null) {
      this.teamsLinked = new ArrayList<>();
    }
    this.teamsLinked.add(teamsLinkedItem);
    return this;
  }

  /**
   * IDs of the teams associated with this event.
   * @return teamsLinked
   */
  
  @Schema(name = "teams_linked", description = "IDs of the teams associated with this event.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("teams_linked")
  public List<String> getTeamsLinked() {
    return teamsLinked;
  }

  public void setTeamsLinked(List<String> teamsLinked) {
    this.teamsLinked = teamsLinked;
  }

  public Event creator(String creator) {
    this.creator = creator;
    return this;
  }

  /**
   * Get creator
   * @return creator
   */
  @NotNull 
  @Schema(name = "creator", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("creator")
  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Event event = (Event) o;
    return Objects.equals(this.id, event.id) &&
        Objects.equals(this.name, event.name) &&
        Objects.equals(this.description, event.description) &&
        Objects.equals(this.startTime, event.startTime) &&
        Objects.equals(this.endTime, event.endTime) &&
        Objects.equals(this.attendees, event.attendees) &&
        Objects.equals(this.sportsLinked, event.sportsLinked) &&
        Objects.equals(this.teamsLinked, event.teamsLinked) &&
        Objects.equals(this.creator, event.creator);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, startTime, endTime, attendees, sportsLinked, teamsLinked, creator);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Event {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    startTime: ").append(toIndentedString(startTime)).append("\n");
    sb.append("    endTime: ").append(toIndentedString(endTime)).append("\n");
    sb.append("    attendees: ").append(toIndentedString(attendees)).append("\n");
    sb.append("    sportsLinked: ").append(toIndentedString(sportsLinked)).append("\n");
    sb.append("    teamsLinked: ").append(toIndentedString(teamsLinked)).append("\n");
    sb.append("    creator: ").append(toIndentedString(creator)).append("\n");
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

