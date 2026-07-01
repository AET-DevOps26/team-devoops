package tum.devoops.letterservice.entity;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Read-only shadow of {@code member.members}, owned by the member service. Used to resolve
 * receiver data for personalized letters; this service never writes to it.
 */
@Entity
@Table(schema = "member", name = "members")
@Getter
@NoArgsConstructor
public class MemberEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "first_name", insertable = false, updatable = false)
    private String firstName;

    @Column(name = "last_name", insertable = false, updatable = false)
    private String lastName;

    @Column(name = "email", insertable = false, updatable = false)
    private String email;

    @Column(name = "address", insertable = false, updatable = false)
    private String address;

    @Column(name = "phone_number", insertable = false, updatable = false)
    private String phoneNumber;

    @Column(name = "birthday", insertable = false, updatable = false)
    private LocalDate birthday;

    @Column(name = "joining_date", insertable = false, updatable = false)
    private LocalDate joiningDate;
}
