-- =====================================================
-- 017_test_online_add_groups.sql
-- Ajout des champs pour la gestion des groupes et commentaires
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_online_status' AND column_name='a_revoir_seance_2') THEN
        ALTER TABLE test_online_status ADD COLUMN a_revoir_seance_2 BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='test_online_status' AND column_name='commentaire') THEN
        ALTER TABLE test_online_status ADD COLUMN commentaire TEXT;
    END IF;
END $$;
