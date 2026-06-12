CREATE TABLE member.members (
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    first_name   VARCHAR(255) NOT NULL,
    last_name    VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    birthday     DATE,
    phone_number VARCHAR(255),
    address      VARCHAR(255),
    joining_date DATE         NOT NULL,
    information  TEXT,
    CONSTRAINT pk_members PRIMARY KEY (id),
    CONSTRAINT uq_members_email UNIQUE (email)
);
