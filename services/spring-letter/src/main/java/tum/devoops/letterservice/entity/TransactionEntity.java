package tum.devoops.letterservice.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Read-only shadow of {@code finance.transactions}, owned by the finance service. Used to
 * compute a receiver's current balance for the {@code {{balance}}} placeholder.
 */
@Entity
@Table(schema = "finance", name = "transactions")
@Getter
@NoArgsConstructor
public class TransactionEntity {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "member_id", insertable = false, updatable = false)
    private UUID memberId;

    @Column(name = "amount_cents", insertable = false, updatable = false)
    private int amountCents;
}
