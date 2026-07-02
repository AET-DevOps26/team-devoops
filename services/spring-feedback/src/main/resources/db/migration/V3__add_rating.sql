-- Add a numeric rating (0-10) to feedback. Existing rows are backfilled with 0; new rows always
-- supply it (required on create). The CHECK mirrors the API's 0-10 constraint as DB-level defense.
ALTER TABLE feedback.feedback
    ADD COLUMN rating INTEGER NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 10);
