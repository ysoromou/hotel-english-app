-- =====================================================
-- CORRECTION ENCODAGE UTF-8
-- Exécuter dans Supabase SQL Editor
-- Corrige les accents corrompus (ex: "RÃ©aliser" → "Réaliser")
-- =====================================================

-- 1) Corriger actions_metier (metier, action, description)
UPDATE actions_metier SET
  metier      = convert_from(convert_to(metier, 'LATIN1'), 'UTF8'),
  action      = convert_from(convert_to(action, 'LATIN1'), 'UTF8'),
  description = convert_from(convert_to(description, 'LATIN1'), 'UTF8');

-- 2) Corriger phrases (phrase_fr, phase)
UPDATE phrases SET
  phrase_fr = convert_from(convert_to(phrase_fr, 'LATIN1'), 'UTF8'),
  phase     = convert_from(convert_to(phase, 'LATIN1'), 'UTF8');

-- 3) Corriger quiz (question, option_a, option_b, option_c)
UPDATE quiz SET
  question = convert_from(convert_to(question, 'LATIN1'), 'UTF8'),
  option_a = convert_from(convert_to(option_a, 'LATIN1'), 'UTF8'),
  option_b = convert_from(convert_to(option_b, 'LATIN1'), 'UTF8'),
  option_c = convert_from(convert_to(option_c, 'LATIN1'), 'UTF8')
WHERE option_c IS NOT NULL;

-- Mettre à jour aussi les lignes où option_c est NULL
UPDATE quiz SET
  question = convert_from(convert_to(question, 'LATIN1'), 'UTF8'),
  option_a = convert_from(convert_to(option_a, 'LATIN1'), 'UTF8'),
  option_b = convert_from(convert_to(option_b, 'LATIN1'), 'UTF8')
WHERE option_c IS NULL;

-- 4) Corriger scenarios (contexte, objectif_salarie, dialogue_modele, criteres_reussite)
UPDATE scenarios SET
  contexte          = convert_from(convert_to(contexte, 'LATIN1'), 'UTF8'),
  objectif_salarie  = convert_from(convert_to(objectif_salarie, 'LATIN1'), 'UTF8'),
  dialogue_modele   = convert_from(convert_to(dialogue_modele, 'LATIN1'), 'UTF8'),
  criteres_reussite = convert_from(convert_to(criteres_reussite, 'LATIN1'), 'UTF8');

-- 5) Vérification — ces résultats doivent afficher les accents correctement
SELECT id, metier, action FROM actions_metier LIMIT 5;
