package tum.devoops.financeservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
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

    @Column(name = "sport_id", nullable = false)
    private UUID sportId;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TrainerEntity> trainers;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TraineeEntity> trainees;
}
