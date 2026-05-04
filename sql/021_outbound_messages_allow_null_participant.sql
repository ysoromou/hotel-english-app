-- Allow logging SMS test events that are not tied to a participant.
-- Additive only: relaxes NOT NULL on participant_id and invite_id.
ALTER TABLE outbound_messages ALTER COLUMN participant_id DROP NOT NULL;
