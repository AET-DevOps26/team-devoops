package tum.devoops.feedbackservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "member", name = "members")
@Getter
@NoArgsConstructor
public class MemberEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;
}
