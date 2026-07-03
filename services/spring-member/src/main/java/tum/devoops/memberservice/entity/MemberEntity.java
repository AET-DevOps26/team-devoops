package tum.devoops.memberservice.entity;

import java.time.LocalDate;
import java.util.UUID;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;

@Entity
@Table(schema = "member", name = "members")
@Getter @Setter @NoArgsConstructor
public class MemberEntity implements Persistable<UUID> {

    @Id
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

    @Transient
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    private boolean isNew = true;

    public MemberEntity(UUID id, String firstName, String lastName, String email, LocalDate birthday,
                         String phoneNumber, String address, LocalDate joiningDate, String information) {
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

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.isNew = false;
    }

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
