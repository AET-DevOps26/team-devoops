-- Switch feedback foreign keys from the default ON DELETE NO ACTION to a non-blocking action.
-- The event and subject-member references CASCADE (deleting the event or the member the feedback is
-- about removes the feedback). The creator reference uses SET NULL: deleting the member who wrote the
-- feedback preserves it (it is about another member) and just clears the creator, so creator_id
-- becomes nullable.

ALTER TABLE feedback.feedback DROP CONSTRAINT fk_feedback_event;
ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_event FOREIGN KEY (event_id) REFERENCES event.events (id) ON DELETE CASCADE;

ALTER TABLE feedback.feedback DROP CONSTRAINT fk_feedback_member;
ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_member FOREIGN KEY (member_id) REFERENCES member.members (id) ON DELETE CASCADE;

ALTER TABLE feedback.feedback ALTER COLUMN creator_id DROP NOT NULL;
ALTER TABLE feedback.feedback DROP CONSTRAINT fk_feedback_creator;
ALTER TABLE feedback.feedback
    ADD CONSTRAINT fk_feedback_creator FOREIGN KEY (creator_id) REFERENCES member.members (id) ON DELETE SET NULL;
