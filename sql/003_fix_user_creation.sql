-- =====================================================
-- 003_fix_user_creation.sql
-- FIX: user creation + auto-profile + password reset
-- Idempotent — safe to re-run
-- Run in: Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- 1) PROFILES TABLE (ensure exists)
-- =====================================================
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2) PROFILES RLS POLICIES (drop + recreate = idempotent)
-- =====================================================

-- Learner: read own profile
DROP POLICY IF EXISTS "Voir son profil" ON profiles;
CREATE POLICY "Voir son profil" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Learner: update own profile
DROP POLICY IF EXISTS "Modifier son profil" ON profiles;
CREATE POLICY "Modifier son profil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Learner: insert own profile (signup flow via client SDK)
DROP POLICY IF EXISTS "Creer son profil" ON profiles;
CREATE POLICY "Creer son profil" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- HR/admin: read all profiles in their establishment
DROP POLICY IF EXISTS "HR voir profils" ON profiles;
CREATE POLICY "HR voir profils" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('hr', 'admin')
        )
    );

-- SERVICE ROLE: full access (needed by triggers + admin API)
-- This is the KEY fix — without it, trigger inserts can fail
-- when function ownership or RLS bypass doesn't work as expected
DROP POLICY IF EXISTS "Service role full access" ON profiles;
CREATE POLICY "Service role full access" ON profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- 3) TRIGGER FUNCTION: auto-create profile on signup
--    SECURITY DEFINER + SET search_path = hardened
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, COALESCE(NEW.email, ''))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Recreate trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4) USER_PROGRESS TABLE + CHAIN TRIGGER
-- =====================================================
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    current_level TEXT NOT NULL DEFAULT 'N1'
        CHECK (current_level IN ('N1', 'N2', 'N3')),
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

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- user_progress policies
DROP POLICY IF EXISTS "Voir sa progression" ON user_progress;
CREATE POLICY "Voir sa progression" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Modifier sa progression" ON user_progress;
CREATE POLICY "Modifier sa progression" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creer sa progression" ON user_progress;
CREATE POLICY "Creer sa progression" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "HR voit toutes les progressions" ON user_progress;
CREATE POLICY "HR voit toutes les progressions" ON user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('hr', 'admin')
        )
    );

DROP POLICY IF EXISTS "HR modifie les progressions" ON user_progress;
CREATE POLICY "HR modifie les progressions" ON user_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('hr', 'admin')
        )
    );

DROP POLICY IF EXISTS "Service role full access progress" ON user_progress;
CREATE POLICY "Service role full access progress" ON user_progress
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Chain trigger: profiles INSERT → user_progress INSERT
CREATE OR REPLACE FUNCTION public.create_user_progress_on_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_progress (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_user_progress ON profiles;
CREATE TRIGGER trg_create_user_progress
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_progress_on_profile();

-- updated_at auto-update
CREATE OR REPLACE FUNCTION public.update_user_progress_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON user_progress;
CREATE TRIGGER trg_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_user_progress_updated_at();

-- =====================================================
-- 5) BACKFILL: fix orphan auth.users without profile
-- =====================================================
INSERT INTO public.profiles (id, email)
SELECT u.id, COALESCE(u.email, '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Backfill user_progress for existing profiles
INSERT INTO public.user_progress (user_id)
SELECT p.id
FROM public.profiles p
LEFT JOIN public.user_progress up ON up.user_id = p.id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- DONE. Now configure Dashboard settings (see comments below).
-- =====================================================
--
-- DASHBOARD SETTINGS (do manually):
--
-- 1. Authentication > Providers > Email:
--    - "Enable Email provider"     → ON
--    - "Confirm email"             → OFF  (dev only!)
--    - "Secure email change"       → OFF  (dev only!)
--
-- 2. Authentication > URL Configuration:
--    - Site URL                    → http://localhost:3000
--    - Redirect URLs               → http://localhost:3000/**
--
-- 3. To reset a password WITHOUT SMTP (dev):
--    Dashboard > Authentication > Users > click user > reset password
--    OR run:
--      UPDATE auth.users
--      SET encrypted_password = crypt('new-password-here', gen_salt('bf'))
--      WHERE email = 'user@example.com';
--
