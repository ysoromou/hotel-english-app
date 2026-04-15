-- =====================================================
-- 006b_mapping_patch_gerer_appel.sql
-- Correctif mapping : compétence gerer_appel sous-représentée
--
-- Audit révèle : gerer_appel = 1 seule action (REC_SERV_BOOKING, poids 2)
-- Seuil minimum acceptable : 4 actions liées
--
-- Ajouts minimaux identifiés (actions dont le téléphone est réellement présent) :
--   REC_SERV_WAKEUP    — réveil = appel téléphonique entrant/sortant → poids 3
--   REC_CI_WALKIN      — vérifier disponibilité via téléphone interne  → poids 1
--   HK_MAINT_REQUEST   — escalader par radio/téléphone = gestion d'appel interne → poids 1
--   SEC_EMERGENCY_MEDICAL — coordination téléphonique des secours → poids 2
--
-- Résultat attendu : 5 actions liées à gerer_appel (1 existante + 4 ajouts)
-- Idempotent (ON CONFLICT ... DO UPDATE)
-- =====================================================

INSERT INTO action_competence_mapping (action_id, competence_code, poids) VALUES

-- REC_SERV_WAKEUP : le wake-up call EST un appel téléphonique — compétence centrale
('REC_SERV_WAKEUP',      'gerer_appel', 3),

-- REC_CI_WALKIN : vérification de disponibilité peut impliquer un appel interne
('REC_CI_WALKIN',        'gerer_appel', 1),

-- HK_MAINT_REQUEST : escalade urgence par téléphone / radio = échange oral structuré
('HK_MAINT_REQUEST',     'gerer_appel', 1),

-- SEC_EMERGENCY_MEDICAL : coordination avec secours par téléphone = gestion d'appel
('SEC_EMERGENCY_MEDICAL','gerer_appel', 2)

ON CONFLICT (action_id, competence_code) DO UPDATE SET poids = EXCLUDED.poids;

-- =====================================================
-- FIN PATCH
-- =====================================================
