-- Give Sport a UUID primary key and demote `name` to an ordinary (unique) field, so a
-- sport can be renamed without rewriting foreign keys. Teams and directors reference the
-- sport by its new UUID id.
--
-- NOTE: the cross-schema FK event.sport_events -> organization.sports(name) (added by the
-- event service's migration) depends on the sports name primary key, so it must be dropped
-- here before we can swap the primary key. The event service re-adds it against sports(id)
-- in its own follow-up migration; this migration therefore assumes the organization schema
-- migrates before the event schema (the existing ordering assumption in this codebase).

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

-- 4. Drop the dependent cross-schema FK from the event service so the sports PK can change.
--    Guarded so a fresh deploy (event schema not yet created) doesn't fail here; on an existing
--    deploy the constraint exists and is dropped. The event service re-adds it against sports(id).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'event' AND table_name = 'sport_events') THEN
        ALTER TABLE event.sport_events DROP CONSTRAINT IF EXISTS fk_sport_events_sport;
    END IF;
END $$;

-- 5. Swap the sports primary key from name to id; keep name as a unique field.
ALTER TABLE organization.sports DROP CONSTRAINT pk_sports;
ALTER TABLE organization.sports ADD CONSTRAINT pk_sports PRIMARY KEY (id);
ALTER TABLE organization.sports ADD CONSTRAINT uq_sports_name UNIQUE (name);

-- 6. Finalise the dependent columns and re-add the organization-owned FKs against sports(id).
ALTER TABLE organization.teams ALTER COLUMN sport_id SET NOT NULL;
ALTER TABLE organization.teams DROP COLUMN sport_name;
ALTER TABLE organization.teams
    ADD CONSTRAINT fk_teams_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id);

ALTER TABLE organization.directors ALTER COLUMN sport_id SET NOT NULL;
ALTER TABLE organization.directors DROP COLUMN sport_name;
ALTER TABLE organization.directors ADD CONSTRAINT pk_directors PRIMARY KEY (sport_id, member_id);
ALTER TABLE organization.directors
    ADD CONSTRAINT fk_directors_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id);
