CREATE TABLE finance.transactions (
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    member_id    UUID         NOT NULL,
    creator_id   UUID         NOT NULL,
    amount_cents INTEGER      NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT         NOT NULL,
    CONSTRAINT pk_transactions PRIMARY KEY (id)
);
