CREATE TABLE feedback.feedback (
    id         UUID        NOT NULL DEFAULT gen_random_uuid(),
    event_id   UUID        NOT NULL,
    member_id  UUID        NOT NULL,
    creator_id UUID        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    feedback   TEXT        NOT NULL,
    CONSTRAINT pk_feedback PRIMARY KEY (id)
);
