-- =====================================================
-- 005_evaluations_competences.sql
-- Grille unique 15 compétences transverses — v3
-- Score 0–3 · Total /45 · Seuil opérationnel ≥ 30
-- =====================================================

DROP TABLE IF EXISTS evaluations_competences;

CREATE TABLE evaluations_competences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    evaluateur_id   UUID NOT NULL REFERENCES profiles(id),
    type_evaluation TEXT NOT NULL CHECK (type_evaluation IN ('avant', 'apres')),
    promotion       TEXT,
    observation_terrain TEXT,

    -- 15 compétences transverses (0–3, NOT NULL DEFAULT 0)
    accueillir_client               SMALLINT NOT NULL DEFAULT 0 CHECK (accueillir_client               BETWEEN 0 AND 3),
    comprendre_demande              SMALLINT NOT NULL DEFAULT 0 CHECK (comprendre_demande              BETWEEN 0 AND 3),
    repondre_demande                SMALLINT NOT NULL DEFAULT 0 CHECK (repondre_demande                BETWEEN 0 AND 3),
    donner_information              SMALLINT NOT NULL DEFAULT 0 CHECK (donner_information              BETWEEN 0 AND 3),
    orienter_client                 SMALLINT NOT NULL DEFAULT 0 CHECK (orienter_client                 BETWEEN 0 AND 3),
    verifier_information            SMALLINT NOT NULL DEFAULT 0 CHECK (verifier_information            BETWEEN 0 AND 3),
    reformuler_confirmer            SMALLINT NOT NULL DEFAULT 0 CHECK (reformuler_confirmer            BETWEEN 0 AND 3),
    gerer_reclamation               SMALLINT NOT NULL DEFAULT 0 CHECK (gerer_reclamation               BETWEEN 0 AND 3),
    proposer_solution               SMALLINT NOT NULL DEFAULT 0 CHECK (proposer_solution               BETWEEN 0 AND 3),
    gerer_situation_difficile       SMALLINT NOT NULL DEFAULT 0 CHECK (gerer_situation_difficile       BETWEEN 0 AND 3),
    utiliser_vocabulaire_metier     SMALLINT NOT NULL DEFAULT 0 CHECK (utiliser_vocabulaire_metier     BETWEEN 0 AND 3),
    maintenir_echange_fluide        SMALLINT NOT NULL DEFAULT 0 CHECK (maintenir_echange_fluide        BETWEEN 0 AND 3),
    gerer_appel                     SMALLINT NOT NULL DEFAULT 0 CHECK (gerer_appel                     BETWEEN 0 AND 3),
    conclure_interaction            SMALLINT NOT NULL DEFAULT 0 CHECK (conclure_interaction            BETWEEN 0 AND 3),
    dire_non_professionnellement    SMALLINT NOT NULL DEFAULT 0 CHECK (dire_non_professionnellement    BETWEEN 0 AND 3),

    -- Score total calculé automatiquement (max 45)
    score_total SMALLINT GENERATED ALWAYS AS (
        accueillir_client + comprendre_demande + repondre_demande +
        donner_information + orienter_client + verifier_information +
        reformuler_confirmer + gerer_reclamation + proposer_solution +
        gerer_situation_difficile + utiliser_vocabulaire_metier + maintenir_echange_fluide +
        gerer_appel + conclure_interaction + dire_non_professionnellement
    ) STORED,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (learner_id, type_evaluation)
);

CREATE INDEX IF NOT EXISTS idx_eval_comp_learner    ON evaluations_competences(learner_id);
CREATE INDEX IF NOT EXISTS idx_eval_comp_evaluateur ON evaluations_competences(evaluateur_id);

CREATE OR REPLACE FUNCTION update_eval_comp_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_eval_comp_updated_at ON evaluations_competences;
CREATE TRIGGER trg_eval_comp_updated_at
    BEFORE UPDATE ON evaluations_competences
    FOR EACH ROW EXECUTE FUNCTION update_eval_comp_updated_at();

ALTER TABLE evaluations_competences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apprenant voit ses evaluations" ON evaluations_competences
    FOR SELECT USING (auth.uid() = learner_id);

CREATE POLICY "HR voit toutes les evaluations" ON evaluations_competences
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

CREATE POLICY "HR gere les evaluations" ON evaluations_competences
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );
