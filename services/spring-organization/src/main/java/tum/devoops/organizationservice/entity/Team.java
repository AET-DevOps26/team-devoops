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
public class Team {

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

    // FK to organization.sport(name). REFERENCES constraint added in V3 migration.
    @Column(name = "sport_name", nullable = false)
    private String sportName;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<Trainer> trainers;

    @OneToMany
    @JoinColumn(name = "team_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<Trainee> trainees;
}
