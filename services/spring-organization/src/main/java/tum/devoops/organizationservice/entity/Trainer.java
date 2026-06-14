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
@Table(schema = "organization", name = "trainers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Trainer {

    // Composite PK: (team_id, member_id).
    // team_id references organization.team(id).
    // member_id references member.member(id) — FK added in V3 migration.
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "team_id", nullable = false)
        private UUID teamId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
