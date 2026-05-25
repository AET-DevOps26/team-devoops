package tum.devoops.organizationservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * Data transfer object for creating a new Sport.
 */

@Schema(name = "SportCreate", description = "Data transfer object for creating a new Sport.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class SportCreate {

  private String name;

  private @Nullable String description;

  @Valid
  private List<String> directors = new ArrayList<>();

  public SportCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public SportCreate(String name) {
    this.name = name;
  }

  public SportCreate name(String name) {
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

  public SportCreate description(@Nullable String description) {
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

  public SportCreate directors(List<String> directors) {
    this.directors = directors;
    return this;
  }

  public SportCreate addDirectorsItem(String directorsItem) {
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
  
  @Schema(name = "directors", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("directors")
  public List<String> getDirectors() {
    return directors;
  }

  public void setDirectors(List<String> directors) {
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
    SportCreate sportCreate = (SportCreate) o;
    return Objects.equals(this.name, sportCreate.name) &&
        Objects.equals(this.description, sportCreate.description) &&
        Objects.equals(this.directors, sportCreate.directors);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, description, directors);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SportCreate {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
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

