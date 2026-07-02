package tum.devoops.organizationservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Data transfer object for creating a new Team.
 */

@Schema(name = "TeamCreate", description = "Data transfer object for creating a new Team.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class TeamCreate {

  private String name;

  private @Nullable String description;

  private @Nullable String address;

  private UUID sport;

  @Valid
  private @Nullable List<String> trainers;

  @Valid
  private @Nullable List<String> trainees;

  public TeamCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public TeamCreate(String name, UUID sport) {
    this.name = name;
    this.sport = sport;
  }

  public TeamCreate name(String name) {
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

  public TeamCreate description(@Nullable String description) {
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

  public TeamCreate address(@Nullable String address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
   */
  
  @Schema(name = "address", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("address")
  public @Nullable String getAddress() {
    return address;
  }

  public void setAddress(@Nullable String address) {
    this.address = address;
  }

  public TeamCreate sport(UUID sport) {
    this.sport = sport;
    return this;
  }

  /**
   * ID of the sport this team belongs to.
   * @return sport
   */
  @NotNull @Valid 
  @Schema(name = "sport", description = "ID of the sport this team belongs to.", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("sport")
  public UUID getSport() {
    return sport;
  }

  public void setSport(UUID sport) {
    this.sport = sport;
  }

  public TeamCreate trainers(@Nullable List<String> trainers) {
    this.trainers = trainers;
    return this;
  }

  public TeamCreate addTrainersItem(String trainersItem) {
    if (this.trainers == null) {
      this.trainers = new ArrayList<>();
    }
    this.trainers.add(trainersItem);
    return this;
  }

  /**
   * Get trainers
   * @return trainers
   */
  
  @Schema(name = "trainers", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("trainers")
  public @Nullable List<String> getTrainers() {
    return trainers;
  }

  public void setTrainers(@Nullable List<String> trainers) {
    this.trainers = trainers;
  }

  public TeamCreate trainees(@Nullable List<String> trainees) {
    this.trainees = trainees;
    return this;
  }

  public TeamCreate addTraineesItem(String traineesItem) {
    if (this.trainees == null) {
      this.trainees = new ArrayList<>();
    }
    this.trainees.add(traineesItem);
    return this;
  }

  /**
   * Get trainees
   * @return trainees
   */
  
  @Schema(name = "trainees", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("trainees")
  public @Nullable List<String> getTrainees() {
    return trainees;
  }

  public void setTrainees(@Nullable List<String> trainees) {
    this.trainees = trainees;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TeamCreate teamCreate = (TeamCreate) o;
    return Objects.equals(this.name, teamCreate.name) &&
        Objects.equals(this.description, teamCreate.description) &&
        Objects.equals(this.address, teamCreate.address) &&
        Objects.equals(this.sport, teamCreate.sport) &&
        Objects.equals(this.trainers, teamCreate.trainers) &&
        Objects.equals(this.trainees, teamCreate.trainees);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, address, sport, trainers, trainees);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TeamCreate {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    sport: ").append(toIndentedString(sport)).append("\n");
    sb.append("    trainers: ").append(toIndentedString(trainers)).append("\n");
    sb.append("    trainees: ").append(toIndentedString(trainees)).append("\n");
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

