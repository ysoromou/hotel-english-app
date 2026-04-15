-- =====================================================
-- SCHEMA COMPLET — Hotel English Pro
-- À exécuter EN PREMIER dans le SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- 1. TABLES REFERENTIELLES (contenu pédagogique)
-- =====================================================

-- 20 actions métier (check-in, accueil, nettoyage, etc.)
CREATE TABLE IF NOT EXISTS actions_metier (
    id TEXT PRIMARY KEY,
    metier TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    niveau_cible TEXT NOT NULL,
    critique_conflit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 162 phrases FR/EN avec audio
CREATE TABLE IF NOT EXISTS phrases (
    id TEXT PRIMARY KEY,
    action_id TEXT REFERENCES actions_metier(id),
    phrase_fr TEXT NOT NULL,
    phrase_en TEXT NOT NULL,
    phase TEXT,
    niveau TEXT NOT NULL,
    voice_type TEXT DEFAULT 'STAFF',
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 45 quiz QCM
CREATE TABLE IF NOT EXISTS quiz (
    id TEXT PRIMARY KEY,
    action_id TEXT REFERENCES actions_metier(id),
    type_quiz TEXT NOT NULL,
    niveau TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    reponse_correcte TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 53 scénarios dialogues
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY,
    action_id TEXT REFERENCES actions_metier(id),
    type_scenario TEXT NOT NULL,
    niveau TEXT NOT NULL,
    contexte TEXT NOT NULL,
    objectif_salarie TEXT NOT NULL,
    dialogue_modele TEXT NOT NULL,
    criteres_reussite TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TABLES UTILISATEURS
-- =====================================================

-- Profils (extension de auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    nom_complet TEXT,
    metier_code TEXT,
    etablissement TEXT,
    role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'hr', 'admin')),
    niveau_actuel TEXT DEFAULT 'A1',
    date_inscription TIMESTAMPTZ DEFAULT NOW(),
    derniere_connexion TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progression par action (combien de phrases faites, scores, etc.)
CREATE TABLE IF NOT EXISTS user_action_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action_id TEXT REFERENCES actions_metier(id),
    phrases_completed INT DEFAULT 0,
    phrases_total INT DEFAULT 0,
    quiz_score_avg DECIMAL(5,2) DEFAULT 0,
    quiz_attempts INT DEFAULT 0,
    scenario_completed BOOLEAN DEFAULT FALSE,
    scenario_score DECIMAL(5,2),
    statut TEXT DEFAULT 'not_started' CHECK (statut IN ('not_started', 'in_progress', 'completed', 'mastered')),
    derniere_activite TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, action_id)
);

-- Réponses aux exercices (historique complet pour analytics)
CREATE TABLE IF NOT EXISTS exercise_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    action_id TEXT REFERENCES actions_metier(id),
    reponse_user TEXT,
    reponse_correcte TEXT,
    is_correct BOOLEAN,
    score DECIMAL(5,2),
    temps_reponse_ms INT,
    tentative_num INT DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions d'apprentissage (quand l'utilisateur ouvre l'app)
CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INT,
    exercises_completed INT DEFAULT 0,
    score_session DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Évaluations RH (suivi par les managers)
CREATE TABLE IF NOT EXISTS evaluations_rh (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    evaluateur_id UUID REFERENCES profiles(id),
    action_id TEXT REFERENCES actions_metier(id),
    score_avant DECIMAL(5,2),
    score_apres DECIMAL(5,2),
    statut TEXT CHECK (statut IN ('en_cours', 'valide', 'a_revoir')),
    commentaire TEXT,
    date_evaluation TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. INDEX (accélèrent les requêtes fréquentes)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_phrases_action ON phrases(action_id);
CREATE INDEX IF NOT EXISTS idx_quiz_action ON quiz(action_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_action ON scenarios(action_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_action_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_user ON exercise_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_created ON exercise_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON learning_sessions(user_id);

-- =====================================================
-- 4. SECURITE (Row Level Security)
-- Chaque utilisateur ne voit que ses propres données
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_action_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations_rh ENABLE ROW LEVEL SECURITY;

-- Tables référentielles : tout utilisateur connecté peut lire
ALTER TABLE actions_metier ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde lit les actions" ON actions_metier FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tout le monde lit les phrases" ON phrases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tout le monde lit les quiz" ON quiz FOR SELECT TO authenticated USING (true);
CREATE POLICY "Tout le monde lit les scenarios" ON scenarios FOR SELECT TO authenticated USING (true);

-- Profils : chacun voit et modifie son propre profil
CREATE POLICY "Voir son profil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Modifier son profil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Creer son profil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Progression : chacun gère sa propre progression
CREATE POLICY "Gerer sa progression" ON user_action_progress FOR ALL USING (auth.uid() = user_id);

-- Réponses : chacun gère ses propres réponses
CREATE POLICY "Gerer ses reponses" ON exercise_responses FOR ALL USING (auth.uid() = user_id);

-- Sessions : chacun gère ses propres sessions
CREATE POLICY "Gerer ses sessions" ON learning_sessions FOR ALL USING (auth.uid() = user_id);

-- Évaluations RH : l'apprenant voit les siennes, le RH voit celles de son établissement
CREATE POLICY "Voir ses evaluations" ON evaluations_rh FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "RH gere evaluations" ON evaluations_rh FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('hr', 'admin')
    )
);

-- =====================================================
-- 5. TRIGGER : créer automatiquement un profil à l'inscription
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Déclencher à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
