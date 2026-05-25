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
 * A simplified representation of a Transaction, typically used in list views.
 */

@Schema(name = "Transaction", description = "A simplified representation of a Transaction, typically used in list views.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Transaction {

  private String id;

  private String member;

  private String creator;

  private Integer amountCents;

  private String createdAt;

  private String title;

  private String description;

  public Transaction() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Transaction(String id, String member, String creator, Integer amountCents, String createdAt, String title, String description) {
    this.id = id;
    this.member = member;
    this.creator = creator;
    this.amountCents = amountCents;
    this.createdAt = createdAt;
    this.title = title;
    this.description = description;
  }

  public Transaction id(String id) {
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

  public Transaction member(String member) {
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

  public Transaction creator(String creator) {
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

  public Transaction amountCents(Integer amountCents) {
    this.amountCents = amountCents;
    return this;
  }

  /**
   * Get amountCents
   * @return amountCents
   */
  @NotNull 
  @Schema(name = "amount_cents", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("amount_cents")
  public Integer getAmountCents() {
    return amountCents;
  }

  public void setAmountCents(Integer amountCents) {
    this.amountCents = amountCents;
  }

  public Transaction createdAt(String createdAt) {
    this.createdAt = createdAt;
    return this;
  }

  /**
   * Get createdAt
   * @return createdAt
   */
  @NotNull 
  @Schema(name = "created_at", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("created_at")
  public String getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(String createdAt) {
    this.createdAt = createdAt;
  }

  public Transaction title(String title) {
    this.title = title;
    return this;
  }

  /**
   * Get title
   * @return title
   */
  @NotNull 
  @Schema(name = "title", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Transaction description(String description) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Transaction transaction = (Transaction) o;
    return Objects.equals(this.id, transaction.id) &&
        Objects.equals(this.member, transaction.member) &&
        Objects.equals(this.creator, transaction.creator) &&
        Objects.equals(this.amountCents, transaction.amountCents) &&
        Objects.equals(this.createdAt, transaction.createdAt) &&
        Objects.equals(this.title, transaction.title) &&
        Objects.equals(this.description, transaction.description);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, member, creator, amountCents, createdAt, title, description);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Transaction {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    creator: ").append(toIndentedString(creator)).append("\n");
    sb.append("    amountCents: ").append(toIndentedString(amountCents)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
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

