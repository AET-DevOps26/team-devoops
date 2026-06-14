-- event_id references event.events(id).
-- member_id and creator_id reference member.members(id).
-- Added after event and member services have bootstrapped.
ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_event FOREIGN KEY (event_id) REFERENCES event.events (id);

ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_member FOREIGN KEY (member_id) REFERENCES member.members (id);

ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_creator FOREIGN KEY (creator_id) REFERENCES member.members (id);
