package tum.devoops.letterservice.model;

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
 * Request body for generating a personalized mass-letter PDF for the caller&#39;s receivers.
 */

@Schema(name = "PdfRequest", description = "Request body for generating a personalized mass-letter PDF for the caller's receivers.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class PdfRequest {

  private String template;

  public PdfRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public PdfRequest(String template) {
    this.template = template;
  }

  public PdfRequest template(String template) {
    this.template = template;
    return this;
  }

  /**
   * HTML letter body. Supports per-receiver placeholder tokens (see the operation description); each token is replaced with that receiver's data. One personalized letter — a name and address layout block followed by the substituted template — is rendered per receiver and concatenated into a single PDF. 
   * @return template
   */
  @NotNull 
  @Schema(name = "template", description = "HTML letter body. Supports per-receiver placeholder tokens (see the operation description); each token is replaced with that receiver's data. One personalized letter — a name and address layout block followed by the substituted template — is rendered per receiver and concatenated into a single PDF. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("template")
  public String getTemplate() {
    return template;
  }

  public void setTemplate(String template) {
    this.template = template;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PdfRequest pdfRequest = (PdfRequest) o;
    return Objects.equals(this.template, pdfRequest.template);
  }

  @Override
  public int hashCode() {
    return Objects.hash(template);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PdfRequest {\n");
    sb.append("    template: ").append(toIndentedString(template)).append("\n");
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

