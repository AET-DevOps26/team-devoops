package tum.devoops.memberservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Read-only view of finance.transactions for dashboard balance aggregation.
@Entity
@Table(schema = "finance", name = "transactions")
@Getter @Setter @NoArgsConstructor
public class TransactionEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "member_id", nullable = false)
    private UUID memberId;

    // Amount in cents (positive = credit, negative = debit).
    @Column(name = "amount_cents", nullable = false)
    private int amountCents;
}
