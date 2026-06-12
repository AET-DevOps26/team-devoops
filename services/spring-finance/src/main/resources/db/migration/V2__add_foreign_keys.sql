-- member_id and creator_id reference member.members(id).
-- Added after member service has bootstrapped.
ALTER TABLE finance.transactions
    ADD CONSTRAINT fk_transactions_member FOREIGN KEY (member_id) REFERENCES member.members (id);

ALTER TABLE finance.transactions
    ADD CONSTRAINT fk_transactions_creator FOREIGN KEY (creator_id) REFERENCES member.members (id);
