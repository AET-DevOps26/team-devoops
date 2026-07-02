package tum.devoops.eventservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import tum.devoops.eventservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * The object representation of an Event (e.g., a training session or a match).
 */

@Schema(name = "Event", description = "The object representation of an Event (e.g., a training session or a match).")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Event {

  private UUID id;

  private String name;

  private String description;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime startTime;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime endTime;

  @Valid
  private @Nullable List<@Valid Reference> attendees;

  @Valid
  private @Nullable List<@Valid Reference> sportsLinked;

  @Valid
  private @Nullable List<@Valid Reference> teamsLinked;

  private Reference creator = null;

  public Event() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Event(UUID id, String name, String description, OffsetDateTime startTime, OffsetDateTime endTime, Reference creator) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
    this.creator = creator;
  }

  public Event id(UUID id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
   */
  @NotNull @Valid 
  @Schema(name = "id", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("id")
  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
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

  public Event startTime(OffsetDateTime startTime) {
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

  public Event endTime(OffsetDateTime endTime) {
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

  public Event attendees(@Nullable List<@Valid Reference> attendees) {
    this.attendees = attendees;
    return this;
  }

  public Event addAttendeesItem(Reference attendeesItem) {
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
  @Valid 
  @Schema(name = "attendees", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("attendees")
  public @Nullable List<@Valid Reference> getAttendees() {
    return attendees;
  }

  public void setAttendees(@Nullable List<@Valid Reference> attendees) {
    this.attendees = attendees;
  }

  public Event sportsLinked(@Nullable List<@Valid Reference> sportsLinked) {
    this.sportsLinked = sportsLinked;
    return this;
  }

  public Event addSportsLinkedItem(Reference sportsLinkedItem) {
    if (this.sportsLinked == null) {
      this.sportsLinked = new ArrayList<>();
    }
    this.sportsLinked.add(sportsLinkedItem);
    return this;
  }

  /**
   * Sports associated with this event.
   * @return sportsLinked
   */
  @Valid 
  @Schema(name = "sports_linked", description = "Sports associated with this event.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("sports_linked")
  public @Nullable List<@Valid Reference> getSportsLinked() {
    return sportsLinked;
  }

  public void setSportsLinked(@Nullable List<@Valid Reference> sportsLinked) {
    this.sportsLinked = sportsLinked;
  }

  public Event teamsLinked(@Nullable List<@Valid Reference> teamsLinked) {
    this.teamsLinked = teamsLinked;
    return this;
  }

  public Event addTeamsLinkedItem(Reference teamsLinkedItem) {
    if (this.teamsLinked == null) {
      this.teamsLinked = new ArrayList<>();
    }
    this.teamsLinked.add(teamsLinkedItem);
    return this;
  }

  /**
   * Teams associated with this event.
   * @return teamsLinked
   */
  @Valid 
  @Schema(name = "teams_linked", description = "Teams associated with this event.", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("teams_linked")
  public @Nullable List<@Valid Reference> getTeamsLinked() {
    return teamsLinked;
  }

  public void setTeamsLinked(@Nullable List<@Valid Reference> teamsLinked) {
    this.teamsLinked = teamsLinked;
  }

  public Event creator(Reference creator) {
    this.creator = creator;
    return this;
  }

  /**
   * Get creator
   * @return creator
   */
  @NotNull @Valid 
  @Schema(name = "creator", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("creator")
  public Reference getCreator() {
    return creator;
  }

  public void setCreator(Reference creator) {
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

