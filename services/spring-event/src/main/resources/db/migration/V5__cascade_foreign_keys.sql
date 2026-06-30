-- Switch every event foreign key from the default ON DELETE NO ACTION to a non-blocking action.
-- Subject/ownership references CASCADE (deleting an event removes its attendances/links; deleting a
-- member removes their attendances; deleting a team/sport removes the corresponding event links).
-- The creator reference uses SET NULL: deleting the member who created an event preserves the event
-- (it belongs to its attendees) and just clears the creator, so creator_id becomes nullable.

ALTER TABLE event.attendances DROP CONSTRAINT fk_attendances_event;
ALTER TABLE event.attendances
    ADD CONSTRAINT fk_attendances_event FOREIGN KEY (event_id) REFERENCES event.events (id) ON DELETE CASCADE;

ALTER TABLE event.sport_events DROP CONSTRAINT fk_sport_events_event;
ALTER TABLE event.sport_events
    ADD CONSTRAINT fk_sport_events_event FOREIGN KEY (event_id) REFERENCES event.events (id) ON DELETE CASCADE;

ALTER TABLE event.team_events DROP CONSTRAINT fk_team_events_event;
ALTER TABLE event.team_events
    ADD CONSTRAINT fk_team_events_event FOREIGN KEY (event_id) REFERENCES event.events (id) ON DELETE CASCADE;

ALTER TABLE event.attendances DROP CONSTRAINT fk_attendances_member;
ALTER TABLE event.attendances
    ADD CONSTRAINT fk_attendances_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;

ALTER TABLE event.team_events DROP CONSTRAINT fk_team_events_team;
ALTER TABLE event.team_events
    ADD CONSTRAINT fk_team_events_team FOREIGN KEY (team_id) REFERENCES organization.teams (id) ON DELETE CASCADE;

ALTER TABLE event.sport_events DROP CONSTRAINT fk_sport_events_sport;
ALTER TABLE event.sport_events
    ADD CONSTRAINT fk_sport_events_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id) ON DELETE CASCADE;

-- creator: preserve the event, null the creator on member deletion.
ALTER TABLE event.events ALTER COLUMN creator_id DROP NOT NULL;
ALTER TABLE event.events DROP CONSTRAINT fk_events_creator;
ALTER TABLE event.events
    ADD CONSTRAINT fk_events_creator FOREIGN KEY (creator_id) REFERENCES member.members (id) ON DELETE SET NULL;
