-- =====================================================
-- 001_patch_realignement_canonique.sql
-- Patch unique de réalignement schéma — Hotel English Pro
-- À exécuter APRÈS 000_schema_v3.sql et 003_fix_user_creation.sql
-- Idempotent — safe to re-run
-- =====================================================

-- =====================================================
-- A. TABLE `hotels` — rattachement établissement pour reporting
-- =====================================================

CREATE TABLE IF NOT EXISTS hotels (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom        TEXT NOT NULL,
    pays       TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
    ville      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- hotel_id nullable : ne casse pas les profils existants qui utilisent etablissement TEXT
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS hotel_id UUID REFERENCES hotels(id);

CREATE INDEX IF NOT EXISTS idx_profiles_hotel_id ON profiles(hotel_id);

-- =====================================================
-- B. TABLE `learning_sessions` — requise par le code Next.js
-- (manager/page.tsx, rapport/page.tsx, api/stats/refresh)
-- Absente de tous les fichiers SQL existants.
-- =====================================================

CREATE TABLE IF NOT EXISTS learning_sessions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action_id      TEXT REFERENCES actions_metier(id),
    started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at       TIMESTAMPTZ,
    score          INT,
    exercises_done INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_sessions_user   ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_action ON learning_sessions(action_id);

ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Voir ses sessions" ON learning_sessions;
CREATE POLICY "Voir ses sessions" ON learning_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Créer ses sessions" ON learning_sessions;
CREATE POLICY "Créer ses sessions" ON learning_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Modifier ses sessions" ON learning_sessions;
CREATE POLICY "Modifier ses sessions" ON learning_sessions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "HR voit toutes les sessions" ON learning_sessions;
CREATE POLICY "HR voit toutes les sessions" ON learning_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('hr','admin'))
    );

DROP POLICY IF EXISTS "Service role full access sessions" ON learning_sessions;
CREATE POLICY "Service role full access sessions" ON learning_sessions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =====================================================
-- C. CONTRAINTE `quiz_reponse_correcte_check` — suppression
-- Créée par 001_migration_v3, bloque la valeur 'FREE'
-- utilisée par ORDER_SEQUENCE et TRANSLATION_ACTIVE dans tous
-- les imports premium. La contrainte MCQ de 000_schema_v3 est correcte.
-- =====================================================

ALTER TABLE quiz DROP CONSTRAINT IF EXISTS quiz_reponse_correcte_check;

-- S'assurer que la contrainte MCQ est présente (000_schema_v3)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_quiz_correct_answer_mcq'
          AND conrelid = 'quiz'::regclass
    ) THEN
        ALTER TABLE quiz
            ADD CONSTRAINT chk_quiz_correct_answer_mcq
            CHECK (type_quiz <> 'MCQ' OR reponse_correcte IN ('A','B','C'));
    END IF;
END $$;

-- Rendre option_a/b/c nullables (ORDER_SEQUENCE, TRANSLATION_ACTIVE n'en ont pas)
ALTER TABLE quiz ALTER COLUMN option_a DROP NOT NULL;
ALTER TABLE quiz ALTER COLUMN option_b DROP NOT NULL;
ALTER TABLE quiz ALTER COLUMN option_c DROP NOT NULL;

-- =====================================================
-- D. TABLE `quiz_options` — version canonique unique
--
-- Structure réelle utilisée par TOUS les imports premium :
--   import_reception_exercices_40.sql
--   import_housekeeping_exercices_40.sql
--   import_restaurant_exercices_40.sql
--   (import_security n'utilise pas quiz_options)
--
-- Colonnes : quiz_id, position, option_text
-- Contrainte : UNIQUE(quiz_id, position)
-- Conflits gérés : ON CONFLICT (quiz_id, position) DO UPDATE SET option_text
--
-- INTERDIT dans la version canonique : label, sort_order, is_correct
-- (ces colonnes n'apparaissent dans aucun import premium)
-- =====================================================

DO $$
BEGIN
    -- Si quiz_options existe dans la mauvaise version (avec label/sort_order/is_correct)
    -- la supprimer et laisser la recréation ci-dessous
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'quiz_options'
    ) AND (
        EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'quiz_options'
              AND column_name IN ('label','sort_order','is_correct')
        )
    ) THEN
        DROP TABLE quiz_options CASCADE;
        RAISE NOTICE 'quiz_options (mauvaise version) supprimée — recréation en version canonique';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS quiz_options (
    id          BIGSERIAL PRIMARY KEY,
    quiz_id     TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    position    INT  NOT NULL,
    option_text TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (quiz_id, position)
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_quiz_id ON quiz_options(quiz_id);

-- =====================================================
-- E. NORMALISATION MÉTIER Sécurité : 'Securite' → 'Sécurité'
-- import_security_actions_20.sql insère 'Securite' sans accent.
-- =====================================================

UPDATE actions_metier
SET metier = 'Sécurité'
WHERE metier = 'Securite';

-- =====================================================
-- F. COLONNE `categorie` manquante pour Sécurité
-- import_security_actions_20.sql n'insère pas categorie.
-- Assignation par action_id — idempotente (AND categorie IS NULL).
-- =====================================================

UPDATE actions_metier SET categorie = 'Accès'        WHERE id = 'SEC_ACCESS_CONTROL'        AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Vérification'  WHERE id = 'SEC_ID_VERIFICATION'       AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Service'       WHERE id = 'SEC_ROOM_ESCORT'           AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Conflit'       WHERE id = 'SEC_NOISE_COMPLAINT'       AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Sécurité'      WHERE id = 'SEC_SUSPICIOUS_PERSON'     AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Sécurité'      WHERE id = 'SEC_THEFT_REPORT'          AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Service'       WHERE id = 'SEC_LOST_FOUND'            AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Urgence'       WHERE id = 'SEC_EMERGENCY_MEDICAL'     AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Urgence'       WHERE id = 'SEC_FIRE_ALARM'            AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Urgence'       WHERE id = 'SEC_EVACUATION'            AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Conflit'       WHERE id = 'SEC_CROWD_CONTROL'         AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Service'       WHERE id = 'SEC_PARKING_ASSIST'        AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Sécurité'      WHERE id = 'SEC_KEY_CONTROL'           AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Documentation' WHERE id = 'SEC_INCIDENT_REPORT'       AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Conflit'       WHERE id = 'SEC_CONFLICT_DEESCALATION' AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Sécurité'      WHERE id = 'SEC_VIP_PROTECTION'        AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Accès'         WHERE id = 'SEC_VENDOR_ACCESS'         AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Documentation' WHERE id = 'SEC_CCTV_REQUEST'          AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Urgence'       WHERE id = 'SEC_CHILD_SAFETY'          AND categorie IS NULL;
UPDATE actions_metier SET categorie = 'Sécurité'      WHERE id = 'SEC_NIGHT_PATROL'          AND categorie IS NULL;

-- =====================================================
-- G. ISOLATION LEGACY Restaurant (REST_* → Restaurant_OLD)
-- Garde uniquement les 20 actions canoniques FB_* pour le module Restaurant.
-- =====================================================

UPDATE actions_metier
SET metier = 'Restaurant_OLD'
WHERE metier = 'Restaurant'
  AND id LIKE 'REST\_%' ESCAPE '\';

-- =====================================================
-- H. RLS sur tables pédagogiques (lecture pour tout utilisateur authentifié)
-- =====================================================

ALTER TABLE actions_metier ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture contenu authentifié" ON actions_metier;
CREATE POLICY "Lecture contenu authentifié" ON actions_metier
    FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture phrases authentifié" ON phrases;
CREATE POLICY "Lecture phrases authentifié" ON phrases
    FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture quiz authentifié" ON quiz;
CREATE POLICY "Lecture quiz authentifié" ON quiz
    FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture scenarios authentifié" ON scenarios;
CREATE POLICY "Lecture scenarios authentifié" ON scenarios
    FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture quiz_options authentifié" ON quiz_options;
CREATE POLICY "Lecture quiz_options authentifié" ON quiz_options
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- FIN DU PATCH
-- =====================================================
