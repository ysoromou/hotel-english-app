-- 001_migration_hardening.sql
-- Apply on an existing database (Supabase SQL editor).
-- Safe to run multiple times.

BEGIN;

ALTER TABLE actions_metier
  ADD COLUMN IF NOT EXISTS categorie TEXT;

-- Ensure NOT NULL action_id (will fail only if nulls exist)
ALTER TABLE phrases   ALTER COLUMN action_id SET NOT NULL;
ALTER TABLE quiz      ALTER COLUMN action_id SET NOT NULL;
ALTER TABLE scenarios ALTER COLUMN action_id SET NOT NULL;

-- CHECK constraints (idempotent)
DO $$
BEGIN
  BEGIN
    ALTER TABLE quiz
      ADD CONSTRAINT quiz_reponse_correcte_chk CHECK (reponse_correcte IN ('A','B','C'));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER TABLE phrases
      ADD CONSTRAINT phrases_voice_type_chk CHECK (voice_type IN ('STAFF','CLIENT'));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

COMMIT;
