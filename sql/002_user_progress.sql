-- =====================================================
-- 002_user_progress.sql
-- Table de progression globale par utilisateur
-- À exécuter dans le SQL Editor de Supabase
-- =====================================================

-- Table : 1 ligne par utilisateur, agrège toute la progression
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    current_level TEXT NOT NULL DEFAULT 'N1' CHECK (current_level IN ('N1', 'N2', 'N3')),
    actions_completed INT NOT NULL DEFAULT 0,
    actions_mastered INT NOT NULL DEFAULT 0,
    overall_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    badges JSONB NOT NULL DEFAULT '[]',
    certification_status TEXT NOT NULL DEFAULT 'not_eligible'
        CHECK (certification_status IN ('not_eligible', 'eligible', 'certified')),
    certified_at TIMESTAMPTZ,
    certified_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes manager (tri par score, filtre certification)
CREATE INDEX IF NOT EXISTS idx_user_progress_score ON user_progress(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_certification ON user_progress(certification_status);

-- RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur voit sa propre progression
CREATE POLICY "Voir sa progression" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Chaque utilisateur peut modifier sa propre progression
CREATE POLICY "Modifier sa progression" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Chaque utilisateur peut créer sa propre progression
CREATE POLICY "Creer sa progression" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- HR/admin peuvent voir toutes les progressions
CREATE POLICY "HR voit toutes les progressions" ON user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('hr', 'admin')
        )
    );

-- HR/admin peuvent modifier les progressions (certification)
CREATE POLICY "HR modifie les progressions" ON user_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('hr', 'admin')
        )
    );

-- Trigger : mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON user_progress;
CREATE TRIGGER trg_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_user_progress_updated_at();

-- Trigger : auto-créer user_progress quand un profil est créé
CREATE OR REPLACE FUNCTION create_user_progress_on_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_progress (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_user_progress ON profiles;
CREATE TRIGGER trg_create_user_progress
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_progress_on_profile();

-- Créer les lignes user_progress pour les profils existants
INSERT INTO user_progress (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;
