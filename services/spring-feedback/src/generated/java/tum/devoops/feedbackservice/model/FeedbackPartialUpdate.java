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
 * Data transfer object for partially updating an existing Feedback (PATCH operation).
 */

@Schema(name = "FeedbackPartialUpdate", description = "Data transfer object for partially updating an existing Feedback (PATCH operation).")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class FeedbackPartialUpdate {

  private @Nullable String event;

  private @Nullable String member;

  private @Nullable String feedback;

  private @Nullable Integer rating;

  public FeedbackPartialUpdate event(@Nullable String event) {
    this.event = event;
    return this;
  }

  /**
   * Get event
   * @return event
   */
  
  @Schema(name = "event", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("event")
  public @Nullable String getEvent() {
    return event;
  }

  public void setEvent(@Nullable String event) {
    this.event = event;
  }

  public FeedbackPartialUpdate member(@Nullable String member) {
    this.member = member;
    return this;
  }

  /**
   * Get member
   * @return member
   */
  
  @Schema(name = "member", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("member")
  public @Nullable String getMember() {
    return member;
  }

  public void setMember(@Nullable String member) {
    this.member = member;
  }

  public FeedbackPartialUpdate feedback(@Nullable String feedback) {
    this.feedback = feedback;
    return this;
  }

  /**
   * Get feedback
   * @return feedback
   */
  
  @Schema(name = "feedback", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("feedback")
  public @Nullable String getFeedback() {
    return feedback;
  }

  public void setFeedback(@Nullable String feedback) {
    this.feedback = feedback;
  }

  public FeedbackPartialUpdate rating(@Nullable Integer rating) {
    this.rating = rating;
    return this;
  }

  /**
   * Get rating
   * minimum: 0
   * maximum: 10
   * @return rating
   */
  @Min(0) @Max(10) 
  @Schema(name = "rating", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("rating")
  public @Nullable Integer getRating() {
    return rating;
  }

  public void setRating(@Nullable Integer rating) {
    this.rating = rating;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    FeedbackPartialUpdate feedbackPartialUpdate = (FeedbackPartialUpdate) o;
    return Objects.equals(this.event, feedbackPartialUpdate.event) &&
        Objects.equals(this.member, feedbackPartialUpdate.member) &&
        Objects.equals(this.feedback, feedbackPartialUpdate.feedback) &&
        Objects.equals(this.rating, feedbackPartialUpdate.rating);
  }

  @Override
  public int hashCode() {
    return Objects.hash(event, member, feedback, rating);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FeedbackPartialUpdate {\n");
    sb.append("    event: ").append(toIndentedString(event)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    feedback: ").append(toIndentedString(feedback)).append("\n");
    sb.append("    rating: ").append(toIndentedString(rating)).append("\n");
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

