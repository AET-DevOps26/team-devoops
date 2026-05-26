package tum.devoops.feedbackservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
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

@Schema(name = "Feedback", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Feedback {

  private UUID id;

  private String event;

  private String member;

  private String creator;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime createdAt;

  private String feedback;

  public Feedback() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Feedback(UUID id, String event, String member, String creator, OffsetDateTime createdAt, String feedback) {
    this.id = id;
    this.event = event;
    this.member = member;
    this.creator = creator;
    this.createdAt = createdAt;
    this.feedback = feedback;
  }

  public Feedback id(UUID id) {
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

  public Feedback event(String event) {
    this.event = event;
    return this;
  }

  /**
   * Get event
   * @return event
   */
  @NotNull 
  @Schema(name = "event", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("event")
  public String getEvent() {
    return event;
  }

  public void setEvent(String event) {
    this.event = event;
  }

  public Feedback member(String member) {
    this.member = member;
    return this;
  }

  /**
   * Get member
   * @return member
   */
  @NotNull 
  @Schema(name = "member", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("member")
  public String getMember() {
    return member;
  }

  public void setMember(String member) {
    this.member = member;
  }

  public Feedback creator(String creator) {
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

  public Feedback createdAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
    return this;
  }

  /**
   * Get createdAt
   * @return createdAt
   */
  @NotNull @Valid 
  @Schema(name = "created_at", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("created_at")
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public Feedback feedback(String feedback) {
    this.feedback = feedback;
    return this;
  }

  /**
   * Get feedback
   * @return feedback
   */
  @NotNull 
  @Schema(name = "feedback", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("feedback")
  public String getFeedback() {
    return feedback;
  }

  public void setFeedback(String feedback) {
    this.feedback = feedback;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Feedback feedback = (Feedback) o;
    return Objects.equals(this.id, feedback.id) &&
        Objects.equals(this.event, feedback.event) &&
        Objects.equals(this.member, feedback.member) &&
        Objects.equals(this.creator, feedback.creator) &&
        Objects.equals(this.createdAt, feedback.createdAt) &&
        Objects.equals(this.feedback, feedback.feedback);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, event, member, creator, createdAt, feedback);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Feedback {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    event: ").append(toIndentedString(event)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    creator: ").append(toIndentedString(creator)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    feedback: ").append(toIndentedString(feedback)).append("\n");
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

