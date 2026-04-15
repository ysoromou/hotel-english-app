-- =====================================================
-- SCHEMA COMPLET — Hotel English Pro (V3)
-- Réception premium: ORDER_SEQUENCE + TRANSLATION_ACTIVE + LISTEN (audio)
-- À exécuter EN PREMIER dans le SQL Editor de Supabase (DB neuve)
-- =====================================================

-- =========================
-- 1) REFERENTIEL PEDAGOGIQUE
-- =========================

CREATE TABLE IF NOT EXISTS actions_metier (
    id TEXT PRIMARY KEY,
    metier TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    niveau_cible TEXT NOT NULL,
    categorie TEXT, -- ex: Accueil, Service, Conflit, Paiement, Information, Clôture, Vérification
    critique_conflit BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phrases (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL REFERENCES actions_metier(id),
    phrase_fr TEXT NOT NULL,
    phrase_en TEXT NOT NULL,
    phase TEXT,
    niveau TEXT NOT NULL,
    voice_type TEXT NOT NULL, -- STAFF | CLIENT
    audio_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_phrases_voice_type CHECK (voice_type IN ('STAFF','CLIENT'))
);

-- =========================
-- 2) QUIZ (multi-formats)
-- =========================
-- Formats supportés:
-- - MCQ                (utilise option_a/option_b/option_c, reponse_correcte = 'A'|'B'|'C')
-- - ORDER_SEQUENCE     (utilise quiz_options; reponse_correcte = 'A,B,C,D,E' selon labels attendus)
-- - TRANSLATION_ACTIVE (expected_answer requis; tolérance gérée côté app)
-- - LISTEN_AND_SELECT  (audio_url requis; utilise quiz_options; reponse_correcte = label correct)
-- - LISTEN_AND_SPEAK   (audio_url requis; phrase_id conseillé pour afficher la cible)

CREATE TABLE IF NOT EXISTS quiz (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL REFERENCES actions_metier(id),
    type_quiz TEXT NOT NULL,
    niveau TEXT NOT NULL,
    question TEXT NOT NULL,

    -- Backward-compat (MCQ simple)
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    reponse_correcte TEXT NOT NULL,

    -- Nouveaux champs V3
    expected_answer TEXT,  -- pour TRANSLATION_ACTIVE (et éventuellement LISTEN_AND_SPEAK)
    audio_url TEXT,        -- pour LISTEN_*
    phrase_id TEXT REFERENCES phrases(id), -- cible (optionnel)

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_quiz_correct_answer_mcq
      CHECK (type_quiz <> 'MCQ' OR reponse_correcte IN ('A','B','C'))
);

CREATE TABLE IF NOT EXISTS quiz_options (
    id BIGSERIAL PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    label TEXT NOT NULL,         -- A, B, C, D, E (ou 1..n si tu préfères)
    option_text TEXT NOT NULL,
    sort_order INT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (quiz_id, label),
    UNIQUE (quiz_id, sort_order)
);

-- =========================
-- 3) SCENARIOS
-- =========================
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY,
    action_id TEXT NOT NULL REFERENCES actions_metier(id),
    type_scenario TEXT NOT NULL,
    niveau TEXT NOT NULL,
    contexte TEXT NOT NULL,
    objectif_salarie TEXT NOT NULL,
    dialogue_modele TEXT NOT NULL,
    criteres_reussite TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- 4) INDEX (perf basique)
-- =========================
CREATE INDEX IF NOT EXISTS idx_phrases_action_id ON phrases(action_id);
CREATE INDEX IF NOT EXISTS idx_quiz_action_id ON quiz(action_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_action_id ON scenarios(action_id);
CREATE INDEX IF NOT EXISTS idx_actions_metier_categorie ON actions_metier(categorie);
