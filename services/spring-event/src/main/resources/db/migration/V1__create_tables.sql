CREATE TABLE event.events (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    start_time  TIMESTAMPTZ  NOT NULL,
    end_time    TIMESTAMPTZ  NOT NULL,
    creator_id  UUID         NOT NULL,
    CONSTRAINT pk_events PRIMARY KEY (id)
);

CREATE TABLE event.attendances (
    event_id  UUID NOT NULL,
    member_id UUID NOT NULL,
    CONSTRAINT pk_attendances PRIMARY KEY (event_id, member_id),
    CONSTRAINT fk_attendances_event FOREIGN KEY (event_id) REFERENCES event.events (id)
);

CREATE TABLE event.sport_events (
    event_id   UUID         NOT NULL,
    sport_name VARCHAR(255) NOT NULL,
    CONSTRAINT pk_sport_events PRIMARY KEY (event_id, sport_name),
    CONSTRAINT fk_sport_events_event FOREIGN KEY (event_id) REFERENCES event.events (id)
);

CREATE TABLE event.team_events (
    event_id UUID NOT NULL,
    team_id  UUID NOT NULL,
    CONSTRAINT pk_team_events PRIMARY KEY (event_id, team_id),
    CONSTRAINT fk_team_events_event FOREIGN KEY (event_id) REFERENCES event.events (id)
);
