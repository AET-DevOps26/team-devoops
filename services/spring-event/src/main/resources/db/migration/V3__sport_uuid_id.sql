-- Drop the old FK from event.sport_events -> organization.sports(name) so that the
-- organization service's V3 migration can swap the sports primary key from name to id.
-- This must commit before org V3 runs (separate migration so it's its own transaction).
-- The backfill and new FK are applied in V4 once org V3 has completed.

ALTER TABLE event.sport_events DROP CONSTRAINT IF EXISTS fk_sport_events_sport;
