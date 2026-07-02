package tum.devoops.organizationservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import tum.devoops.organizationservice.model.Reference;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * The object representation of a Team that belongs to a specific Sport.
 */

@Schema(name = "Team", description = "The object representation of a Team that belongs to a specific Sport.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Team {

  private UUID id;

  private String name;

  private String description;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate createdAt;

  private String address;

  private Reference sport;

  @Valid
  private List<@Valid Reference> trainers;

  @Valid
  private List<@Valid Reference> trainees;

  public Team() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Team(UUID id, String name, String description, LocalDate createdAt, String address, Reference sport, List<@Valid Reference> trainers, List<@Valid Reference> trainees) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.address = address;
    this.sport = sport;
    this.trainers = trainers;
    this.trainees = trainees;
  }

  public Team id(UUID id) {
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

  public Team name(String name) {
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

  public Team description(String description) {
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

  public Team createdAt(LocalDate createdAt) {
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
  public LocalDate getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDate createdAt) {
    this.createdAt = createdAt;
  }

  public Team address(String address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
   */
  @NotNull 
  @Schema(name = "address", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("address")
  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public Team sport(Reference sport) {
    this.sport = sport;
    return this;
  }

  /**
   * Get sport
   * @return sport
   */
  @NotNull @Valid 
  @Schema(name = "sport", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("sport")
  public Reference getSport() {
    return sport;
  }

  public void setSport(Reference sport) {
    this.sport = sport;
  }

  public Team trainers(List<@Valid Reference> trainers) {
    this.trainers = trainers;
    return this;
  }

  public Team addTrainersItem(Reference trainersItem) {
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
  @NotNull @Valid 
  @Schema(name = "trainers", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("trainers")
  public List<@Valid Reference> getTrainers() {
    return trainers;
  }

  public void setTrainers(List<@Valid Reference> trainers) {
    this.trainers = trainers;
  }

  public Team trainees(List<@Valid Reference> trainees) {
    this.trainees = trainees;
    return this;
  }

  public Team addTraineesItem(Reference traineesItem) {
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
  @NotNull @Valid 
  @Schema(name = "trainees", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("trainees")
  public List<@Valid Reference> getTrainees() {
    return trainees;
  }

  public void setTrainees(List<@Valid Reference> trainees) {
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
    Team team = (Team) o;
    return Objects.equals(this.id, team.id) &&
        Objects.equals(this.name, team.name) &&
        Objects.equals(this.description, team.description) &&
        Objects.equals(this.createdAt, team.createdAt) &&
        Objects.equals(this.address, team.address) &&
        Objects.equals(this.sport, team.sport) &&
        Objects.equals(this.trainers, team.trainers) &&
        Objects.equals(this.trainees, team.trainees);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, createdAt, address, sport, trainers, trainees);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Team {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
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

