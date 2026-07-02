-- Switch sport_events from referencing the sport name to the sport UUID id.
-- Assumes organization V3 has already committed: sports.id now exists and is the PK.
-- The old FK (fk_sport_events_sport) was already dropped in V3.

ALTER TABLE event.sport_events ADD COLUMN sport_id UUID;
UPDATE event.sport_events se
    SET sport_id = s.id
    FROM organization.sports s
    WHERE se.sport_name = s.name;

ALTER TABLE event.sport_events DROP CONSTRAINT pk_sport_events;
ALTER TABLE event.sport_events ALTER COLUMN sport_id SET NOT NULL;
ALTER TABLE event.sport_events DROP COLUMN sport_name;
ALTER TABLE event.sport_events ADD CONSTRAINT pk_sport_events PRIMARY KEY (event_id, sport_id);
ALTER TABLE event.sport_events
    ADD CONSTRAINT fk_sport_events_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id);
