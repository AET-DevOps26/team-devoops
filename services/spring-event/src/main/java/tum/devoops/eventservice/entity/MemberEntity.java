package tum.devoops.eventservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Read-only shadow of {@code member.members} (owned by the member service), used to resolve member
 * display names for reference objects in responses. This service never writes to it.
 */
@Entity
@Table(schema = "member", name = "members")
@Getter @Setter @NoArgsConstructor
public class MemberEntity {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "first_name", insertable = false, updatable = false)
    private String firstName;

    @Column(name = "last_name", insertable = false, updatable = false)
    private String lastName;
}
