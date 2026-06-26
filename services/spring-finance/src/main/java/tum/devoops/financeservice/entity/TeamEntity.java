package tum.devoops.financeservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(schema = "organization", name = "teams")
@Getter
@NoArgsConstructor
public class TeamEntity {

    @Id
    @Column(name = "id", nullable = false)
    UUID id;

    @Column(name = "sport_name", nullable = false)
    private String sportName;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TrainerEntity> trainers;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TraineeEntity> trainees;
}
