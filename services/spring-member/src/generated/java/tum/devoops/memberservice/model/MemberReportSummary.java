package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import tum.devoops.memberservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Summary of a stored member report, without its generated text.
 */

@Schema(name = "MemberReportSummary", description = "Summary of a stored member report, without its generated text.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class MemberReportSummary {

  private UUID id;

  private Reference member;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime createdAt;

  public MemberReportSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public MemberReportSummary(UUID id, Reference member, OffsetDateTime createdAt) {
    this.id = id;
    this.member = member;
    this.createdAt = createdAt;
  }

  public MemberReportSummary id(UUID id) {
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

  public MemberReportSummary member(Reference member) {
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

  public MemberReportSummary createdAt(OffsetDateTime createdAt) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    MemberReportSummary memberReportSummary = (MemberReportSummary) o;
    return Objects.equals(this.id, memberReportSummary.id) &&
        Objects.equals(this.member, memberReportSummary.member) &&
        Objects.equals(this.createdAt, memberReportSummary.createdAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, member, createdAt);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class MemberReportSummary {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
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

