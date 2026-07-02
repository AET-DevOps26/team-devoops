-- Switch finance foreign keys from the default ON DELETE NO ACTION to a non-blocking action.
-- The subject-member reference CASCADEs (deleting the member the transaction is about removes the
-- transaction). The creator reference uses SET NULL: deleting the member who recorded the transaction
-- preserves it (it belongs to another member) and just clears the creator, so creator_id becomes
-- nullable.

ALTER TABLE finance.transactions DROP CONSTRAINT fk_transactions_member;
ALTER TABLE finance.transactions
    ADD CONSTRAINT fk_transactions_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;

ALTER TABLE finance.transactions ALTER COLUMN creator_id DROP NOT NULL;
ALTER TABLE finance.transactions DROP CONSTRAINT fk_transactions_creator;
ALTER TABLE finance.transactions
    ADD CONSTRAINT fk_transactions_creator FOREIGN KEY (creator_id) REFERENCES member.members (id) ON DELETE SET NULL;
