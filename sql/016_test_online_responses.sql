-- =====================================================
-- 016_test_online_responses.sql
-- Table de réponses pour le Test Online (45min)
-- Stocke les choix, saisies écrites et audios base64
-- =====================================================

CREATE TABLE IF NOT EXISTS test_online_responses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Structure
    section         TEXT NOT NULL CHECK (section IN ('reading', 'listening', 'writing', 'speaking')),
    question_id     TEXT NOT NULL,
    
    -- Réponse
    answer_text     TEXT,       -- QCM (A,B,C) ou saisie texte clavier
    answer_audio    TEXT,       -- Base64 Data URI de l'audio "data:audio/webm;base64,..."
    
    -- Scoring auto local 
    is_correct      BOOLEAN,    -- NULL pour les questions ouvertes/orales
    score_points    SMALLINT DEFAULT 0,
    
    -- Drapeaux
    pending_human_review BOOLEAN DEFAULT FALSE,
    consultant_score     SMALLINT, -- Note mise par le consultant a posteriori
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (learner_id, question_id) -- Une seule réponse par question par apprenant (upsert)
);

CREATE INDEX IF NOT EXISTS idx_test_resp_learner ON test_online_responses(learner_id);

ALTER TABLE test_online_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR gere test online responses" ON test_online_responses
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

CREATE POLICY "Learner voit ses responses" ON test_online_responses
    FOR SELECT USING (auth.uid() = learner_id);

CREATE POLICY "Learner insert/update ses responses" ON test_online_responses
    FOR ALL USING (auth.uid() = learner_id) WITH CHECK (auth.uid() = learner_id);

-- Alter table test_online_status pour ajouter un flag explicit
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_online_status' AND column_name='oral_pending') THEN
        ALTER TABLE test_online_status ADD COLUMN oral_pending BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_online_status' AND column_name='human_confirmation_required') THEN
        ALTER TABLE test_online_status ADD COLUMN human_confirmation_required BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
