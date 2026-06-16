package tum.devoops.organizationservice.entity;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "organization", name = "directors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DirectorEntity {

    // Composite PK: (sport_name, member_id).
    // sport_name references organization.sport(name).
    // member_id references member.member(id) — FK added in V3 migration.
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "sport_name", nullable = false)
        private String sportName;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
