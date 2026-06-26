package tum.devoops.financeservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(schema = "organization", name = "trainees")
@Getter
@NoArgsConstructor @AllArgsConstructor
public class TraineeEntity {
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
