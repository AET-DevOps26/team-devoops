CREATE TABLE organization.sports (
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  DATE         NOT NULL,
    CONSTRAINT pk_sports PRIMARY KEY (name)
);

CREATE TABLE organization.teams (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  DATE         NOT NULL,
    address     VARCHAR(255),
    sport_name  VARCHAR(255) NOT NULL,
    CONSTRAINT pk_teams PRIMARY KEY (id),
    CONSTRAINT fk_teams_sport FOREIGN KEY (sport_name) REFERENCES organization.sports (name)
);

CREATE TABLE organization.directors (
    sport_name VARCHAR(255) NOT NULL,
    member_id  UUID         NOT NULL,
    CONSTRAINT pk_directors PRIMARY KEY (sport_name, member_id),
    CONSTRAINT fk_directors_sport FOREIGN KEY (sport_name) REFERENCES organization.sports (name)
);

CREATE TABLE organization.trainers (
    team_id   UUID NOT NULL,
    member_id UUID NOT NULL,
    CONSTRAINT pk_trainers PRIMARY KEY (team_id, member_id),
    CONSTRAINT fk_trainers_team FOREIGN KEY (team_id) REFERENCES organization.teams (id)
);

CREATE TABLE organization.trainees (
    team_id   UUID NOT NULL,
    member_id UUID NOT NULL,
    CONSTRAINT pk_trainees PRIMARY KEY (team_id, member_id),
    CONSTRAINT fk_trainees_team FOREIGN KEY (team_id) REFERENCES organization.teams (id)
);
