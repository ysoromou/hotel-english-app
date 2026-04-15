-- =====================================================
-- MIGRATION HARDENING — V3 (DB existante)
-- Ajoute categorie + non-null action_id + support quiz_options + audio/listen
-- Idempotent (ré-exécutable sans casse)
-- =====================================================

-- 1) actions_metier: categorie
ALTER TABLE actions_metier
ADD COLUMN IF NOT EXISTS categorie TEXT;

-- 2) phrases: voice_type check + action_id NOT NULL
DO $$
BEGIN
  -- voice_type constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_phrases_voice_type'
  ) THEN
    ALTER TABLE phrases
      ADD CONSTRAINT chk_phrases_voice_type CHECK (voice_type IN ('STAFF','CLIENT'));
  END IF;

  -- action_id non-null (uniquement si aucun NULL)
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='phrases' AND column_name='action_id') THEN
    IF (SELECT COUNT(*) FROM phrases WHERE action_id IS NULL) = 0 THEN
      ALTER TABLE phrases ALTER COLUMN action_id SET NOT NULL;
    ELSE
      RAISE NOTICE 'phrases.action_id contient des NULL — NOT NULL non appliqué.';
    END IF;
  END IF;
END $$;

-- 3) scenarios: action_id NOT NULL
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='scenarios' AND column_name='action_id') THEN
    IF (SELECT COUNT(*) FROM scenarios WHERE action_id IS NULL) = 0 THEN
      ALTER TABLE scenarios ALTER COLUMN action_id SET NOT NULL;
    ELSE
      RAISE NOTICE 'scenarios.action_id contient des NULL — NOT NULL non appliqué.';
    END IF;
  END IF;
END $$;

-- 4) quiz: nouveaux champs + relâcher NOT NULL sur options + check MCQ
ALTER TABLE quiz
  ADD COLUMN IF NOT EXISTS expected_answer TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS phrase_id TEXT;

-- FK phrase_id (si possible)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_quiz_phrase_id') THEN
    ALTER TABLE quiz
      ADD CONSTRAINT fk_quiz_phrase_id FOREIGN KEY (phrase_id) REFERENCES phrases(id);
  END IF;
END $$;

-- rendre action_id NOT NULL si possible
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM quiz WHERE action_id IS NULL) = 0 THEN
    ALTER TABLE quiz ALTER COLUMN action_id SET NOT NULL;
  ELSE
    RAISE NOTICE 'quiz.action_id contient des NULL — NOT NULL non appliqué.';
  END IF;
END $$;

-- options A/B/C nullable (si elles étaient NOT NULL)
DO $$
BEGIN
  BEGIN
    ALTER TABLE quiz ALTER COLUMN option_a DROP NOT NULL;
  EXCEPTION WHEN others THEN
    -- ignore
  END;
  BEGIN
    ALTER TABLE quiz ALTER COLUMN option_b DROP NOT NULL;
  EXCEPTION WHEN others THEN
  END;
END $$;

-- check MCQ
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_quiz_correct_answer_mcq') THEN
    ALTER TABLE quiz
      ADD CONSTRAINT chk_quiz_correct_answer_mcq
      CHECK (type_quiz <> 'MCQ' OR reponse_correcte IN ('A','B','C'));
  END IF;
END $$;

-- 5) quiz_options table
CREATE TABLE IF NOT EXISTS quiz_options (
    id BIGSERIAL PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    option_text TEXT NOT NULL,
    sort_order INT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (quiz_id, label),
    UNIQUE (quiz_id, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_quiz_id ON quiz_options(quiz_id);
