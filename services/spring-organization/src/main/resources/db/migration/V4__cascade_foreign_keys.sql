-- Switch every organization foreign key from the default ON DELETE NO ACTION (which blocks a delete
-- while referenced) to ON DELETE CASCADE, so deleting a parent removes its children: deleting a sport
-- removes its teams, deleting a team removes its trainers/trainees, deleting a member removes their
-- director/trainer/trainee memberships.

ALTER TABLE organization.teams DROP CONSTRAINT fk_teams_sport;
ALTER TABLE organization.teams
    ADD CONSTRAINT fk_teams_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id) ON DELETE CASCADE;

ALTER TABLE organization.directors DROP CONSTRAINT fk_directors_sport;
ALTER TABLE organization.directors
    ADD CONSTRAINT fk_directors_sport FOREIGN KEY (sport_id) REFERENCES organization.sports (id) ON DELETE CASCADE;

ALTER TABLE organization.directors DROP CONSTRAINT fk_directors_member;
ALTER TABLE organization.directors
    ADD CONSTRAINT fk_directors_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;

ALTER TABLE organization.trainers DROP CONSTRAINT fk_trainers_team;
ALTER TABLE organization.trainers
    ADD CONSTRAINT fk_trainers_team FOREIGN KEY (team_id) REFERENCES organization.teams (id) ON DELETE CASCADE;

ALTER TABLE organization.trainers DROP CONSTRAINT fk_trainers_member;
ALTER TABLE organization.trainers
    ADD CONSTRAINT fk_trainers_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;

ALTER TABLE organization.trainees DROP CONSTRAINT fk_trainees_team;
ALTER TABLE organization.trainees
    ADD CONSTRAINT fk_trainees_team FOREIGN KEY (team_id) REFERENCES organization.teams (id) ON DELETE CASCADE;

ALTER TABLE organization.trainees DROP CONSTRAINT fk_trainees_member;
ALTER TABLE organization.trainees
    ADD CONSTRAINT fk_trainees_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;
