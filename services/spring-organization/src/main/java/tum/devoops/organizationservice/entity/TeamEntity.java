package tum.devoops.organizationservice.entity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "organization", name = "teams")
@Getter @Setter @NoArgsConstructor
public class TeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = true, columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    @Column(name = "address")
    private String address;

    // FK to organization.sports(id).
    @Column(name = "sport_id", nullable = false)
    private UUID sportId;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TrainerEntity> trainers;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TraineeEntity> trainees;
}
