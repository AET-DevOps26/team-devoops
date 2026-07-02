package tum.devoops.financeservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import tum.devoops.financeservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * The object representation of a Member&#39;s Balance, which includes the total balance in cents.
 */

@Schema(name = "Balance", description = "The object representation of a Member's Balance, which includes the total balance in cents.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Balance {

  private Reference member;

  private Integer balanceCents;

  public Balance() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Balance(Reference member, Integer balanceCents) {
    this.member = member;
    this.balanceCents = balanceCents;
  }

  public Balance member(Reference member) {
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

  public Balance balanceCents(Integer balanceCents) {
    this.balanceCents = balanceCents;
    return this;
  }

  /**
   * Get balanceCents
   * @return balanceCents
   */
  @NotNull 
  @Schema(name = "balance_cents", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("balance_cents")
  public Integer getBalanceCents() {
    return balanceCents;
  }

  public void setBalanceCents(Integer balanceCents) {
    this.balanceCents = balanceCents;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Balance balance = (Balance) o;
    return Objects.equals(this.member, balance.member) &&
        Objects.equals(this.balanceCents, balance.balanceCents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(member, balanceCents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Balance {\n");
    sb.append("    member: ").append(toIndentedString(member)).append("\n");
    sb.append("    balanceCents: ").append(toIndentedString(balanceCents)).append("\n");
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

