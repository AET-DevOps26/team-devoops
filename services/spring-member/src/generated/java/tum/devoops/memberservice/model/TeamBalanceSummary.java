package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import tum.devoops.memberservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Per-team rollup of trainee count and aggregate balance.
 */

@Schema(name = "TeamBalanceSummary", description = "Per-team rollup of trainee count and aggregate balance.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class TeamBalanceSummary {

  private Reference team;

  private Integer memberCount;

  private Integer balanceCents;

  public TeamBalanceSummary() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public TeamBalanceSummary(Reference team, Integer memberCount, Integer balanceCents) {
    this.team = team;
    this.memberCount = memberCount;
    this.balanceCents = balanceCents;
  }

  public TeamBalanceSummary team(Reference team) {
    this.team = team;
    return this;
  }

  /**
   * Get team
   * @return team
   */
  @NotNull @Valid 
  @Schema(name = "team", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("team")
  public Reference getTeam() {
    return team;
  }

  public void setTeam(Reference team) {
    this.team = team;
  }

  public TeamBalanceSummary memberCount(Integer memberCount) {
    this.memberCount = memberCount;
    return this;
  }

  /**
   * Get memberCount
   * @return memberCount
   */
  @NotNull 
  @Schema(name = "member_count", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("member_count")
  public Integer getMemberCount() {
    return memberCount;
  }

  public void setMemberCount(Integer memberCount) {
    this.memberCount = memberCount;
  }

  public TeamBalanceSummary balanceCents(Integer balanceCents) {
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
    TeamBalanceSummary teamBalanceSummary = (TeamBalanceSummary) o;
    return Objects.equals(this.team, teamBalanceSummary.team) &&
        Objects.equals(this.memberCount, teamBalanceSummary.memberCount) &&
        Objects.equals(this.balanceCents, teamBalanceSummary.balanceCents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(team, memberCount, balanceCents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TeamBalanceSummary {\n");
    sb.append("    team: ").append(toIndentedString(team)).append("\n");
    sb.append("    memberCount: ").append(toIndentedString(memberCount)).append("\n");
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

