package tum.devoops.feedbackservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Data transfer object for creating a new Feedback.
 */

@Schema(name = "FeedbackCreate", description = "Data transfer object for creating a new Feedback.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class FeedbackCreate {

  private String event;

  private String member;

  private String feedback;

  public FeedbackCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public FeedbackCreate(String event, String member, String feedback) {
    this.event = event;
    this.member = member;
    this.feedback = feedback;
  }

  public FeedbackCreate event(String event) {
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

  public FeedbackCreate member(String member) {
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

  public FeedbackCreate feedback(String feedback) {
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
    FeedbackCreate feedbackCreate = (FeedbackCreate) o;
    return Objects.equals(this.event, feedbackCreate.event) &&
        Objects.equals(this.member, feedbackCreate.member) &&
        Objects.equals(this.feedback, feedbackCreate.feedback);
  }

  @Override
  public int hashCode() {
    return Objects.hash(event, member, feedback);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FeedbackCreate {\n");
    sb.append("    event: ").append(toIndentedString(event)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
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

