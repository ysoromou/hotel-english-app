-- =====================================================
-- 015_test_online_status.sql
-- Préparation test online — structure de suivi
-- Ne construit PAS le test adaptatif complet
-- Prépare le terrain pour intégration future
-- =====================================================

CREATE TABLE IF NOT EXISTS test_online_status (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

    -- Statut du test
    statut          TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (statut IN ('not_started', 'in_progress', 'completed')),

    -- Résultats (remplis quand completed)
    score_global    SMALLINT,           -- /100
    niveau_suggere  TEXT,               -- CECRL suggéré (A1, A2, B1, B2, C1, C2)
    confiance       TEXT,               -- 'high', 'medium', 'low'

    -- Drapeaux consultant
    confirmation_consultant BOOLEAN DEFAULT FALSE,
    niveau_confirme         TEXT,       -- le consultant peut overrider

    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_test_online_learner ON test_online_status(learner_id);

ALTER TABLE test_online_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR gere test online" ON test_online_status
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

CREATE POLICY "Learner voit son test" ON test_online_status
    FOR SELECT USING (auth.uid() = learner_id);

CREATE POLICY "Learner cree son test" ON test_online_status
    FOR INSERT WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Learner update son test" ON test_online_status
    FOR UPDATE USING (auth.uid() = learner_id);
