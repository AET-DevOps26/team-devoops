-- creator_id and attendances.member_id reference member.members(id).
-- sport_events.sport_name references organization.sports(name).
-- team_events.team_id references organization.teams(id).
-- All added after member and organization services have bootstrapped.
ALTER TABLE event.events
    ADD CONSTRAINT fk_events_creator FOREIGN KEY (creator_id) REFERENCES member.members (id);

ALTER TABLE event.attendances
    ADD CONSTRAINT fk_attendances_member FOREIGN KEY (member_id) REFERENCES member.members (id);

ALTER TABLE event.sport_events
    ADD CONSTRAINT fk_sport_events_sport FOREIGN KEY (sport_name) REFERENCES organization.sports (name);

ALTER TABLE event.team_events
    ADD CONSTRAINT fk_team_events_team FOREIGN KEY (team_id) REFERENCES organization.teams (id);
