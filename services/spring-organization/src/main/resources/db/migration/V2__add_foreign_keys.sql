-- member_id columns reference member.members(id), added after member service bootstraps.
ALTER TABLE organization.directors
    ADD CONSTRAINT fk_directors_member FOREIGN KEY (member_id) REFERENCES member.members (id);

ALTER TABLE organization.trainers
    ADD CONSTRAINT fk_trainers_member FOREIGN KEY (member_id) REFERENCES member.members (id);

ALTER TABLE organization.trainees
    ADD CONSTRAINT fk_trainees_member FOREIGN KEY (member_id) REFERENCES member.members (id);
