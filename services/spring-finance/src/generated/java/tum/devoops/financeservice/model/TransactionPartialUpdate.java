package tum.devoops.financeservice.model;

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
 * Data transfer object for partially updating an existing Transaction (PATCH operation).
 */

@Schema(name = "TransactionPartialUpdate", description = "Data transfer object for partially updating an existing Transaction (PATCH operation).")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class TransactionPartialUpdate {

  private @Nullable String member;

  private @Nullable Integer amountCents;

  private @Nullable String title;

  private @Nullable String description;

  public TransactionPartialUpdate member(@Nullable String member) {
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

  public TransactionPartialUpdate amountCents(@Nullable Integer amountCents) {
    this.amountCents = amountCents;
    return this;
  }

  /**
   * Get amountCents
   * @return amountCents
   */
  
  @Schema(name = "amount_cents", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("amount_cents")
  public @Nullable Integer getAmountCents() {
    return amountCents;
  }

  public void setAmountCents(@Nullable Integer amountCents) {
    this.amountCents = amountCents;
  }

  public TransactionPartialUpdate title(@Nullable String title) {
    this.title = title;
    return this;
  }

  /**
   * Get title
   * @return title
   */
  
  @Schema(name = "title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("title")
  public @Nullable String getTitle() {
    return title;
  }

  public void setTitle(@Nullable String title) {
    this.title = title;
  }

  public TransactionPartialUpdate description(@Nullable String description) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TransactionPartialUpdate transactionPartialUpdate = (TransactionPartialUpdate) o;
    return Objects.equals(this.member, transactionPartialUpdate.member) &&
        Objects.equals(this.amountCents, transactionPartialUpdate.amountCents) &&
        Objects.equals(this.title, transactionPartialUpdate.title) &&
        Objects.equals(this.description, transactionPartialUpdate.description);
  }

  @Override
  public int hashCode() {
    return Objects.hash(member, amountCents, title, description);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TransactionPartialUpdate {\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    amountCents: ").append(toIndentedString(amountCents)).append("\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
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

