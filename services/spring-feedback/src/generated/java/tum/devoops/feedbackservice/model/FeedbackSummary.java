package tum.devoops.feedbackservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import tum.devoops.feedbackservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * A simplified representation of a Feedback, typically used in list views.
 */

@Schema(name = "FeedbackSummary", description = "A simplified representation of a Feedback, typically used in list views.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class FeedbackSummary {

  private UUID id;

  private Reference event;

  private Reference member;

  private Reference creator = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime createdAt;

  private Integer rating;

  public FeedbackSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public FeedbackSummary(UUID id, Reference event, Reference member, Reference creator, OffsetDateTime createdAt, Integer rating) {
    this.id = id;
    this.event = event;
    this.member = member;
    this.creator = creator;
    this.createdAt = createdAt;
    this.rating = rating;
  }

  public FeedbackSummary id(UUID id) {
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

  public FeedbackSummary event(Reference event) {
    this.event = event;
    return this;
  }

  /**
   * Get event
   * @return event
   */
  @NotNull @Valid 
  @Schema(name = "event", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("event")
  public Reference getEvent() {
    return event;
  }

  public void setEvent(Reference event) {
    this.event = event;
  }

  public FeedbackSummary member(Reference member) {
    this.member = member;
    return this;
  }

  /**
   * Get member
   * @return member
   */
  @NotNull @Valid 
  @Schema(name = "member", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("member")
  public Reference getMember() {
    return member;
  }

  public void setMember(Reference member) {
    this.member = member;
  }

  public FeedbackSummary creator(Reference creator) {
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

  public FeedbackSummary createdAt(OffsetDateTime createdAt) {
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

  public FeedbackSummary rating(Integer rating) {
    this.rating = rating;
    return this;
  }

  /**
   * Get rating
   * minimum: 0
   * maximum: 10
   * @return rating
   */
  @NotNull @Min(0) @Max(10) 
  @Schema(name = "rating", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("rating")
  public Integer getRating() {
    return rating;
  }

  public void setRating(Integer rating) {
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
    FeedbackSummary feedbackSummary = (FeedbackSummary) o;
    return Objects.equals(this.id, feedbackSummary.id) &&
        Objects.equals(this.event, feedbackSummary.event) &&
        Objects.equals(this.member, feedbackSummary.member) &&
        Objects.equals(this.creator, feedbackSummary.creator) &&
        Objects.equals(this.createdAt, feedbackSummary.createdAt) &&
        Objects.equals(this.rating, feedbackSummary.rating);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, event, member, creator, createdAt, rating);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FeedbackSummary {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    event: ").append(toIndentedString(event)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    creator: ").append(toIndentedString(creator)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
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

