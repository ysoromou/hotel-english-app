-- =====================================================
-- MIGRATION V3 — Hardening + Quiz scalable options + Audio
-- Idempotent: safe to re-run
-- =====================================================

-- 1) actions_metier: add categorie if missing
ALTER TABLE actions_metier
  ADD COLUMN IF NOT EXISTS categorie TEXT;

-- 2) phrases: enforce action_id NOT NULL (only if no NULL rows)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM phrases WHERE action_id IS NULL LIMIT 1) THEN
    RAISE NOTICE 'SKIP: phrases.action_id has NULL rows. Fix data then SET NOT NULL.';
  ELSE
    ALTER TABLE phrases ALTER COLUMN action_id SET NOT NULL;
  END IF;

  -- voice_type NOT NULL + default
  ALTER TABLE phrases ALTER COLUMN voice_type SET DEFAULT 'STAFF';
  ALTER TABLE phrases ALTER COLUMN voice_type SET NOT NULL;

  -- voice_type check
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='phrases_voice_type_check') THEN
    ALTER TABLE phrases
      ADD CONSTRAINT phrases_voice_type_check
      CHECK (voice_type IN ('STAFF','CLIENT'));
  END IF;
END $$;

-- 3) quiz: add scalable columns + enforce action_id NOT NULL
ALTER TABLE quiz
  ADD COLUMN IF NOT EXISTS expected_answer TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS phrase_id TEXT REFERENCES phrases(id);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM quiz WHERE action_id IS NULL LIMIT 1) THEN
    RAISE NOTICE 'SKIP: quiz.action_id has NULL rows. Fix data then SET NOT NULL.';
  ELSE
    ALTER TABLE quiz ALTER COLUMN action_id SET NOT NULL;
  END IF;

  -- make legacy option columns nullable (to allow quiz_options)
  ALTER TABLE quiz ALTER COLUMN option_a DROP NOT NULL;
  ALTER TABLE quiz ALTER COLUMN option_b DROP NOT NULL;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='quiz_reponse_correcte_check') THEN
    ALTER TABLE quiz
      ADD CONSTRAINT quiz_reponse_correcte_check
      CHECK (reponse_correcte ~ '^[ABC](,[ABC])*$');
  END IF;
END $$;

-- 4) scenarios: enforce action_id NOT NULL (only if safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM scenarios WHERE action_id IS NULL LIMIT 1) THEN
    RAISE NOTICE 'SKIP: scenarios.action_id has NULL rows. Fix data then SET NOT NULL.';
  ELSE
    ALTER TABLE scenarios ALTER COLUMN action_id SET NOT NULL;
  END IF;
END $$;

-- 5) create quiz_options
CREATE TABLE IF NOT EXISTS quiz_options (
  id BIGSERIAL PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
  position INT NOT NULL,
  option_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (quiz_id, position)
);
