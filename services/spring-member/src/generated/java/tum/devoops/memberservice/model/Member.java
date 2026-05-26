package tum.devoops.memberservice.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * 
 */

@Schema(name = "Member", description = "")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.14.0")
public class Member {

  private UUID id;

  private String firstName;

  private String lastName;

  private String email;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate birthday;

  private String phoneNumber;

  private String address;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate joiningDate;

  private String information;

  public Member() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public Member(UUID id, String firstName, String lastName, String email, LocalDate birthday, String phoneNumber, String address, LocalDate joiningDate, String information) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthday = birthday;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.joiningDate = joiningDate;
    this.information = information;
  }

  public Member id(UUID id) {
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

  public Member firstName(String firstName) {
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

  public Member lastName(String lastName) {
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

  public Member email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  @NotNull 
  @Schema(name = "email", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Member birthday(LocalDate birthday) {
    this.birthday = birthday;
    return this;
  }

  /**
   * Get birthday
   * @return birthday
   */
  @NotNull @Valid 
  @Schema(name = "birthday", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("birthday")
  public LocalDate getBirthday() {
    return birthday;
  }

  public void setBirthday(LocalDate birthday) {
    this.birthday = birthday;
  }

  public Member phoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
    return this;
  }

  /**
   * Get phoneNumber
   * @return phoneNumber
   */
  @NotNull 
  @Schema(name = "phone_number", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("phone_number")
  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public Member address(String address) {
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

  public Member joiningDate(LocalDate joiningDate) {
    this.joiningDate = joiningDate;
    return this;
  }

  /**
   * Get joiningDate
   * @return joiningDate
   */
  @NotNull @Valid 
  @Schema(name = "joining_date", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("joining_date")
  public LocalDate getJoiningDate() {
    return joiningDate;
  }

  public void setJoiningDate(LocalDate joiningDate) {
    this.joiningDate = joiningDate;
  }

  public Member information(String information) {
    this.information = information;
    return this;
  }

  /**
   * Get information
   * @return information
   */
  @NotNull 
  @Schema(name = "information", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("information")
  public String getInformation() {
    return information;
  }

  public void setInformation(String information) {
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
    Member member = (Member) o;
    return Objects.equals(this.id, member.id) &&
        Objects.equals(this.firstName, member.firstName) &&
        Objects.equals(this.lastName, member.lastName) &&
        Objects.equals(this.email, member.email) &&
        Objects.equals(this.birthday, member.birthday) &&
        Objects.equals(this.phoneNumber, member.phoneNumber) &&
        Objects.equals(this.address, member.address) &&
        Objects.equals(this.joiningDate, member.joiningDate) &&
        Objects.equals(this.information, member.information);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, firstName, lastName, email, birthday, phoneNumber, address, joiningDate, information);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Member {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    firstName: ").append(toIndentedString(firstName)).append("\n");
    sb.append("    lastName: ").append(toIndentedString(lastName)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    birthday: ").append(toIndentedString(birthday)).append("\n");
    sb.append("    phoneNumber: ").append(toIndentedString(phoneNumber)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    joiningDate: ").append(toIndentedString(joiningDate)).append("\n");
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

