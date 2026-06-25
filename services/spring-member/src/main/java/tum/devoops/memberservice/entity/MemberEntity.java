package tum.devoops.memberservice.entity;

import java.time.LocalDate;
import java.util.UUID;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "member", name = "members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "birthday", nullable = true)
    private LocalDate birthday;

    @Column(name = "phone_number", nullable = true)
    private String phoneNumber;

    @Column(name = "address", nullable = true)
    private String address;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "information", nullable = true, columnDefinition = "TEXT")
    private String information;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof MemberEntity other)) {
            return false;
        }
        return Objects.equals(id, other.id)
                && Objects.equals(firstName, other.firstName)
                && Objects.equals(lastName, other.lastName)
                && Objects.equals(email, other.email)
                && Objects.equals(birthday, other.birthday)
                && Objects.equals(phoneNumber, other.phoneNumber)
                && Objects.equals(address, other.address)
                && Objects.equals(joiningDate, other.joiningDate)
                && Objects.equals(information, other.information);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, email, birthday, phoneNumber, address, joiningDate, information);
    }
}
