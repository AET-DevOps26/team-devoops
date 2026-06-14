package tum.devoops.financeservice.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(schema = "finance", name = "transactions")
@Getter @Setter @NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    // FK to member.member(id) added in V3 migration.
    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    // UUID of the member who created this transaction.
    // FK to member.member(id) added in V3 migration.
    @Column(name = "creator_id", nullable = false)
    private UUID creatorId;

    // Amount in cents (e.g. 1000 = €10.00). Positive = credit, negative = debit.
    @Column(name = "amount_cents", nullable = false)
    private int amountCents;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
}
