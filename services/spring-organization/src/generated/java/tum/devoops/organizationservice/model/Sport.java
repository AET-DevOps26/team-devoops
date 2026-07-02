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
 * The object representation of a Sport within the organization.
 */

@Schema(name = "Sport", description = "The object representation of a Sport within the organization.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Sport {

  private UUID id;

  private String name;

  private String description;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate createdAt;

  @Valid
  private List<@Valid Reference> directors;

  public Sport() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Sport(UUID id, String name, String description, LocalDate createdAt, List<@Valid Reference> directors) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.directors = directors;
  }

  public Sport id(UUID id) {
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

  public Sport name(String name) {
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

  public Sport description(String description) {
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

  public Sport createdAt(LocalDate createdAt) {
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

  public Sport directors(List<@Valid Reference> directors) {
    this.directors = directors;
    return this;
  }

  public Sport addDirectorsItem(Reference directorsItem) {
    if (this.directors == null) {
      this.directors = new ArrayList<>();
    }
    this.directors.add(directorsItem);
    return this;
  }

  /**
   * Get directors
   * @return directors
   */
  @NotNull @Valid 
  @Schema(name = "directors", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("directors")
  public List<@Valid Reference> getDirectors() {
    return directors;
  }

  public void setDirectors(List<@Valid Reference> directors) {
    this.directors = directors;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Sport sport = (Sport) o;
    return Objects.equals(this.id, sport.id) &&
        Objects.equals(this.name, sport.name) &&
        Objects.equals(this.description, sport.description) &&
        Objects.equals(this.createdAt, sport.createdAt) &&
        Objects.equals(this.directors, sport.directors);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, description, createdAt, directors);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Sport {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    directors: ").append(toIndentedString(directors)).append("\n");
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

