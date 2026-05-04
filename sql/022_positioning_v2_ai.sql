-- =====================================================
-- 022_positioning_v2_ai.sql
-- Positioning v2: AI-evaluated writing/speaking + 36-item structure
-- Idempotent additive migration (safe to run multiple times)
-- Depends on: 019_positioning_assessment_v1.sql (test_attempts, participants, helpers)
-- =====================================================

-- 1) New columns on test_attempts (additive only, no destructive changes)
ALTER TABLE test_attempts
  ADD COLUMN IF NOT EXISTS auto_score SMALLINT,
  ADD COLUMN IF NOT EXISTS writing_score SMALLINT,
  ADD COLUMN IF NOT EXISTS speaking_score SMALLINT,
  ADD COLUMN IF NOT EXISTS provisional_score SMALLINT,
  ADD COLUMN IF NOT EXISTS ai_status TEXT,
  ADD COLUMN IF NOT EXISTS strong_competences JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS weak_competences JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 2) New table for free-form productions evaluated by AI
CREATE TABLE IF NOT EXISTS test_productions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  prompt_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('writing', 'speaking')),
  response_text TEXT,
  transcription TEXT,
  has_audio BOOLEAN NOT NULL DEFAULT false,
  ai_score SMALLINT,
  ai_level TEXT,
  ai_competences JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_errors JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_justification TEXT,
  ai_confidence TEXT,
  ai_status TEXT NOT NULL DEFAULT 'needs_trainer_review'
    CHECK (ai_status IN ('ia_validated', 'needs_trainer_review', 'trainer_corrected', 'audio_unusable', 'missing_answer')),
  trainer_score SMALLINT,
  trainer_note TEXT,
  raw_ai_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, prompt_id)
);

CREATE INDEX IF NOT EXISTS idx_test_productions_attempt_id ON test_productions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_test_productions_participant_id ON test_productions(participant_id);
CREATE INDEX IF NOT EXISTS idx_test_productions_ai_status ON test_productions(ai_status);

-- 3) Updated_at trigger (function set_updated_at is created by 019)
DROP TRIGGER IF EXISTS trg_test_productions_updated_at ON test_productions;
CREATE TRIGGER trg_test_productions_updated_at
  BEFORE UPDATE ON test_productions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) RLS enabled + policies (HR/admin via helper, service_role bypass for the public test runtime)
ALTER TABLE test_productions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "HR manage test productions" ON test_productions;
CREATE POLICY "HR manage test productions" ON test_productions
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access test productions" ON test_productions;
CREATE POLICY "Service role full access test productions" ON test_productions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
