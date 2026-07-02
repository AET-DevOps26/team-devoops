package tum.devoops.financeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(schema = "organization", name = "directors")
@Getter @NoArgsConstructor
public class DirectorEntity {
    @EmbeddedId
    private Id id;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Id implements Serializable {
        @Column(name = "sport_id", nullable = false)
        private UUID sportId;

        @Column(name = "member_id", nullable = false)
        private UUID memberId;
    }
}
