package tum.devoops.financeservice.converter;

import tum.devoops.financeservice.entity.TransactionEntity;
import tum.devoops.financeservice.model.Reference;
import tum.devoops.financeservice.model.Transaction;
import tum.devoops.financeservice.model.TransactionCreate;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.UUID;

public class TransactionConverter {

    public static Transaction toTransaction(TransactionEntity entity, Reference member, Reference creator) {
        return new Transaction(
                entity.getId(),
                member,
                creator,
                entity.getAmountCents(),
                entity.getCreatedAt().atOffset(ZoneOffset.UTC),
                entity.getTitle(),
                entity.getDescription()
        );
    }

    public static TransactionEntity toEntity(TransactionCreate create, UUID memberId, UUID creatorId) {
        TransactionEntity entity = new TransactionEntity();
        entity.setMemberId(memberId);
        entity.setCreatorId(creatorId);
        entity.setAmountCents(create.getAmountCents());
        entity.setCreatedAt(Instant.now());
        entity.setTitle(create.getTitle());
        entity.setDescription(create.getDescription() != null ? create.getDescription() : "");
        return entity;
    }
}
