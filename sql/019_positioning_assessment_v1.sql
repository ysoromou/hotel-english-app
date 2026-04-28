-- =====================================================
-- 019_positioning_assessment_v1.sql
-- Positioning workflow for NOOM / SEEN mobile assessments
-- Idempotent - safe to run multiple times
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.is_hr_or_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = user_id
      AND p.role IN ('hr', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel TEXT NOT NULL,
  organization TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (trim(concat(coalesce(first_name, ''), ' ', coalesce(last_name, '')))) STORED,
  phone TEXT NOT NULL,
  normalized_phone TEXT,
  email TEXT,
  department TEXT,
  external_ref TEXT,
  status TEXT NOT NULL DEFAULT 'imported'
    CHECK (status IN ('imported', 'invited', 'opened', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (hotel, normalized_phone),
  UNIQUE (hotel, email),
  UNIQUE (external_ref)
);

CREATE INDEX IF NOT EXISTS idx_participants_hotel ON participants(hotel);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_participants_department ON participants(department);
CREATE INDEX IF NOT EXISTS idx_participants_organization ON participants(organization);

CREATE TABLE IF NOT EXISTS test_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE UNIQUE,
  token_hash TEXT,
  expires_at TIMESTAMPTZ,
  deadline_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'not_sent'
    CHECK (status IN ('not_sent', 'sent', 'opened', 'started', 'completed', 'expired')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_reminder_at TIMESTAMPTZ,
  access_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_invites_status ON test_invites(status);
CREATE INDEX IF NOT EXISTS idx_test_invites_expires_at ON test_invites(expires_at);
CREATE INDEX IF NOT EXISTS idx_test_invites_deadline_at ON test_invites(deadline_at);
CREATE INDEX IF NOT EXISTS idx_test_invites_token_hash ON test_invites(token_hash);

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  invite_id UUID NOT NULL REFERENCES test_invites(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed', 'expired')),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_score SMALLINT,
  estimated_level TEXT,
  recommended_group TEXT,
  duration_seconds INT,
  device_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  anomalies_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (participant_id, invite_id)
);

CREATE INDEX IF NOT EXISTS idx_test_attempts_participant_id ON test_attempts(participant_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_status ON test_attempts(status);
CREATE INDEX IF NOT EXISTS idx_test_attempts_estimated_level ON test_attempts(estimated_level);
CREATE INDEX IF NOT EXISTS idx_test_attempts_recommended_group ON test_attempts(recommended_group);

CREATE TABLE IF NOT EXISTS test_section_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  score SMALLINT NOT NULL DEFAULT 0,
  max_score SMALLINT NOT NULL DEFAULT 0,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, section_key)
);

CREATE TABLE IF NOT EXISTS outbound_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  invite_id UUID REFERENCES test_invites(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  destination TEXT NOT NULL,
  message_body TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'manual_whatsapp',
  message_kind TEXT NOT NULL DEFAULT 'invite',
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'prepared', 'sent', 'failed')),
  provider_message_id TEXT,
  provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbound_messages_participant_id ON outbound_messages(participant_id);
CREATE INDEX IF NOT EXISTS idx_outbound_messages_status ON outbound_messages(status);
CREATE INDEX IF NOT EXISTS idx_outbound_messages_kind ON outbound_messages(message_kind);

CREATE TABLE IF NOT EXISTS group_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE UNIQUE,
  attempt_id UUID REFERENCES test_attempts(id) ON DELETE SET NULL,
  recommended_group TEXT NOT NULL,
  rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_recommendations_group ON group_recommendations(recommended_group);

DROP TRIGGER IF EXISTS trg_participants_updated_at ON participants;
CREATE TRIGGER trg_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_test_invites_updated_at ON test_invites;
CREATE TRIGGER trg_test_invites_updated_at
  BEFORE UPDATE ON test_invites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_test_attempts_updated_at ON test_attempts;
CREATE TRIGGER trg_test_attempts_updated_at
  BEFORE UPDATE ON test_attempts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_group_recommendations_updated_at ON group_recommendations;
CREATE TRIGGER trg_group_recommendations_updated_at
  BEFORE UPDATE ON group_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_section_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "HR manage participants" ON participants;
CREATE POLICY "HR manage participants" ON participants
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access participants" ON participants;
CREATE POLICY "Service role full access participants" ON participants
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "HR manage test invites" ON test_invites;
CREATE POLICY "HR manage test invites" ON test_invites
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access test invites" ON test_invites;
CREATE POLICY "Service role full access test invites" ON test_invites
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "HR manage test attempts" ON test_attempts;
CREATE POLICY "HR manage test attempts" ON test_attempts
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access test attempts" ON test_attempts;
CREATE POLICY "Service role full access test attempts" ON test_attempts
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "HR manage test section results" ON test_section_results;
CREATE POLICY "HR manage test section results" ON test_section_results
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access test section results" ON test_section_results;
CREATE POLICY "Service role full access test section results" ON test_section_results
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "HR manage outbound messages" ON outbound_messages;
CREATE POLICY "HR manage outbound messages" ON outbound_messages
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access outbound messages" ON outbound_messages;
CREATE POLICY "Service role full access outbound messages" ON outbound_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "HR manage group recommendations" ON group_recommendations;
CREATE POLICY "HR manage group recommendations" ON group_recommendations
  FOR ALL
  USING (public.is_hr_or_admin(auth.uid()))
  WITH CHECK (public.is_hr_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role full access group recommendations" ON group_recommendations;
CREATE POLICY "Service role full access group recommendations" ON group_recommendations
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
