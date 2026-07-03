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
 * Request body for sending a personalized mass email to the caller&#39;s receivers.
 */

@Schema(name = "MailRequest", description = "Request body for sending a personalized mass email to the caller's receivers.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class MailRequest {

  private String subject;

  private String template;

  public MailRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public MailRequest(String subject, String template) {
    this.subject = subject;
    this.template = template;
  }

  public MailRequest subject(String subject) {
    this.subject = subject;
    return this;
  }

  /**
   * Subject line of the email. Must not be empty. Supports the same per-receiver placeholder tokens as the template; each token is replaced with that receiver's data before the email is sent. 
   * @return subject
   */
  @NotNull @Size(min = 1) 
  @Schema(name = "subject", description = "Subject line of the email. Must not be empty. Supports the same per-receiver placeholder tokens as the template; each token is replaced with that receiver's data before the email is sent. ", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("subject")
  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public MailRequest template(String template) {
    this.template = template;
    return this;
  }

  /**
   * HTML email body. Supports per-receiver placeholder tokens (see the operation description); each token is replaced with that receiver's data before the email is sent. 
   * @return template
   */
  @NotNull 
  @Schema(name = "template", description = "HTML email body. Supports per-receiver placeholder tokens (see the operation description); each token is replaced with that receiver's data before the email is sent. ", requiredMode = Schema.RequiredMode.REQUIRED)
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
    MailRequest mailRequest = (MailRequest) o;
    return Objects.equals(this.subject, mailRequest.subject) &&
        Objects.equals(this.template, mailRequest.template);
  }

  @Override
  public int hashCode() {
    return Objects.hash(subject, template);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class MailRequest {\n");
    sb.append("    subject: ").append(toIndentedString(subject)).append("\n");
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

