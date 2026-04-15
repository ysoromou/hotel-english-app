-- =====================================================
-- 014_oral_validation_j1.sql
-- Validation orale jour 1 — mini grille consultant
-- Barème 0–3 sur 5 critères · Score /15
-- Ne touche PAS à evaluations_competences (/45)
-- =====================================================

CREATE TABLE IF NOT EXISTS oral_validation_j1 (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    evaluateur_id   UUID NOT NULL REFERENCES profiles(id),

    -- 5 critères oraux (0–3 chacun)
    comprend_demande        SMALLINT NOT NULL DEFAULT 0 CHECK (comprend_demande        BETWEEN 0 AND 3),
    repond_pertinent        SMALLINT NOT NULL DEFAULT 0 CHECK (repond_pertinent        BETWEEN 0 AND 3),
    reste_fluide            SMALLINT NOT NULL DEFAULT 0 CHECK (reste_fluide            BETWEEN 0 AND 3),
    vocabulaire_metier      SMALLINT NOT NULL DEFAULT 0 CHECK (vocabulaire_metier      BETWEEN 0 AND 3),
    ton_professionnel       SMALLINT NOT NULL DEFAULT 0 CHECK (ton_professionnel       BETWEEN 0 AND 3),

    -- Score total calculé (max 15)
    score_oral SMALLINT GENERATED ALWAYS AS (
        comprend_demande + repond_pertinent + reste_fluide +
        vocabulaire_metier + ton_professionnel
    ) STORED,

    -- Niveau confirmé par le consultant
    niveau_suggere_app  TEXT,           -- niveau proposé par l'app/test
    niveau_confirme     TEXT,           -- niveau validé par le consultant
    a_revoir_seance_2   BOOLEAN NOT NULL DEFAULT FALSE,
    commentaire         TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (learner_id)
);

CREATE INDEX IF NOT EXISTS idx_oral_j1_learner ON oral_validation_j1(learner_id);

ALTER TABLE oral_validation_j1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR gere validation orale" ON oral_validation_j1
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

CREATE POLICY "Apprenant voit sa validation" ON oral_validation_j1
    FOR SELECT USING (auth.uid() = learner_id);
