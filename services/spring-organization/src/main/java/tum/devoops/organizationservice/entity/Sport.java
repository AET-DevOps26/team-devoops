package tum.devoops.organizationservice.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "organization", name = "sports")
@Getter @Setter @NoArgsConstructor
public class Sport {

    @Id
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt;

    // Each Director row links this sport to a member (director role).
    @OneToMany
    @JoinColumn(name = "sport_name", referencedColumnName = "name", insertable = false, updatable = false)
    private List<Director> directors;
}
