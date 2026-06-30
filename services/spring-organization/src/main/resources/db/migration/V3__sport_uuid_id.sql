-- Give Sport a UUID primary key and demote `name` to an ordinary (unique) field, so a
-- sport can be renamed without rewriting foreign keys. Teams and directors reference the
-- sport by its new UUID id.
--
-- The cross-schema FK event.sport_events -> organization.sports(name) is dropped by the
-- event service's own V3 migration (event_user owns that table). This migration assumes
-- that has happened before the sports PK is swapped in step 4.

-- 1. Add the new id column and backfill a stable UUID per sport.
ALTER TABLE organization.sports
    ADD COLUMN id UUID NOT NULL DEFAULT gen_random_uuid();

-- 2. teams.sport_name -> teams.sport_id
ALTER TABLE organization.teams ADD COLUMN sport_id UUID;
UPDATE organization.teams t
    SET sport_id = s.id
    FROM organization.sports s
    WHERE t.sport_name = s.name;
ALTER TABLE organization.teams DROP CONSTRAINT fk_teams_sport;

-- 3. directors composite PK (sport_name, member_id) -> (sport_id, member_id)
ALTER TABLE organization.directors ADD COLUMN sport_id UUID;
UPDATE organization.directors d
    SET sport_id = s.id
    FROM organization.sports s
    WHERE d.sport_name = s.name;
ALTER TABLE organization.directors DROP CONSTRAINT fk_directors_sport;
ALTER TABLE organization.directors DROP CONSTRAINT pk_directors;

-- 4. Swap the sports primary key from name to id; keep name as a unique field.
-- NOTE: the cross-schema FK event.sport_events -> organization.sports(name) must be dropped
-- before this step. The event service's V3 migration drops it (event_user owns that table).
ALTER TABLE organization.sports DROP CONSTRAINT pk_sports;
ALTER TABLE organization.sports ADD CONSTRAINT pk_sports PRIMARY KEY (id);
ALTER TABLE organization.sports ADD CONSTRAINT uq_sports_name UNIQUE (name);

-- 5. Finalise the dependent columns and re-add the organization-owned FKs against sports(id).
ALTER TABLE organization.teams ALTER COLUMN sport_id SET NOT NULL;
ALTER TABLE organization.teams DROP COLUMN sport_name;
ALTER TABLE organization.teams
    ADD CONSTRAINT fk_teams_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id);

ALTER TABLE organization.directors ALTER COLUMN sport_id SET NOT NULL;
ALTER TABLE organization.directors DROP COLUMN sport_name;
ALTER TABLE organization.directors ADD CONSTRAINT pk_directors PRIMARY KEY (sport_id, member_id);
ALTER TABLE organization.directors
    ADD CONSTRAINT fk_directors_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id);
