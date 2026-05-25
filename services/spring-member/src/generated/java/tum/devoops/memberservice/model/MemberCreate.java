package tum.devoops.memberservice.model;

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
 * Data transfer object for creating a new Member.
 */

@Schema(name = "MemberCreate", description = "Data transfer object for creating a new Member.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class MemberCreate {

  private String firstName;

  private String lastName;

  private @Nullable String email;

  private @Nullable String birthday;

  private @Nullable String phoneNumber;

  private @Nullable String address;

  private @Nullable String information;

  public MemberCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public MemberCreate(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public MemberCreate firstName(String firstName) {
    this.firstName = firstName;
    return this;
  }

  /**
   * Get firstName
   * @return firstName
   */
  @NotNull 
  @Schema(name = "first_name", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("first_name")
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public MemberCreate lastName(String lastName) {
    this.lastName = lastName;
    return this;
  }

  /**
   * Get lastName
   * @return lastName
   */
  @NotNull 
  @Schema(name = "last_name", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("last_name")
  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public MemberCreate email(@Nullable String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  
  @Schema(name = "email", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("email")
  public @Nullable String getEmail() {
    return email;
  }

  public void setEmail(@Nullable String email) {
    this.email = email;
  }

  public MemberCreate birthday(@Nullable String birthday) {
    this.birthday = birthday;
    return this;
  }

  /**
   * Get birthday
   * @return birthday
   */
  
  @Schema(name = "birthday", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("birthday")
  public @Nullable String getBirthday() {
    return birthday;
  }

  public void setBirthday(@Nullable String birthday) {
    this.birthday = birthday;
  }

  public MemberCreate phoneNumber(@Nullable String phoneNumber) {
    this.phoneNumber = phoneNumber;
    return this;
  }

  /**
   * Get phoneNumber
   * @return phoneNumber
   */
  
  @Schema(name = "phone_number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("phone_number")
  public @Nullable String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(@Nullable String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public MemberCreate address(@Nullable String address) {
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

  public MemberCreate information(@Nullable String information) {
    this.information = information;
    return this;
  }

  /**
   * Get information
   * @return information
   */
  
  @Schema(name = "information", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("information")
  public @Nullable String getInformation() {
    return information;
  }

  public void setInformation(@Nullable String information) {
    this.information = information;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    MemberCreate memberCreate = (MemberCreate) o;
    return Objects.equals(this.firstName, memberCreate.firstName) &&
        Objects.equals(this.lastName, memberCreate.lastName) &&
        Objects.equals(this.email, memberCreate.email) &&
        Objects.equals(this.birthday, memberCreate.birthday) &&
        Objects.equals(this.phoneNumber, memberCreate.phoneNumber) &&
        Objects.equals(this.address, memberCreate.address) &&
        Objects.equals(this.information, memberCreate.information);
  }

  @Override
  public int hashCode() {
    return Objects.hash(firstName, lastName, email, birthday, phoneNumber, address, information);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class MemberCreate {\n");
    sb.append("    firstName: ").append(toIndentedString(firstName)).append("\n");
    sb.append("    lastName: ").append(toIndentedString(lastName)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    birthday: ").append(toIndentedString(birthday)).append("\n");
    sb.append("    phoneNumber: ").append(toIndentedString(phoneNumber)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    information: ").append(toIndentedString(information)).append("\n");
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

