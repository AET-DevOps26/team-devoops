package tum.devoops.organizationservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "member", name = "members")
@Getter @Setter @NoArgsConstructor
public class MemberEntity {

    @Id
    @Column(name = "id")
    private UUID id;
}
