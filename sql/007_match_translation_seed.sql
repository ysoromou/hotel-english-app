-- =====================================================
-- 007_match_translation_seed.sql
-- Exercices MATCH_TRANSLATION pour les 4 métiers
-- 6 exercices par métier = 24 exercices total
--
-- Structure :
--   - quiz : type_quiz='MATCH_TRANSLATION', reponse_correcte='FREE'
--   - expected_answer : 'term_EN:traduction_FR || term_EN:traduction_FR || ...'
--   - quiz_options : position 1..N, option_text = 'EN: term → FR: traduction'
--
-- Préfixes IDs : MT_REC_, MT_HK_, MT_RST_, MT_SEC_
-- Idempotent (ON CONFLICT ... DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- RÉCEPTION (6 exercices) — action_ids REC_*
-- =====================================================

-- MT_REC_01 : Vocabulaire check-in / arrivée
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_01',
  'REC_CI_STANDARD',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'key card:carte magnétique || check-in:enregistrement || reservation:réservation || front desk:réception / accueil',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_01', 1, 'EN: key card → FR: carte magnétique'),
  ('MT_REC_01', 2, 'EN: check-in → FR: enregistrement'),
  ('MT_REC_01', 3, 'EN: reservation → FR: réservation'),
  ('MT_REC_01', 4, 'EN: front desk → FR: réception / accueil')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_REC_02 : Vocabulaire check-out / paiement
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_02',
  'REC_CO_STANDARD',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'check-out:départ / règlement || receipt:reçu / facture || wake-up call:réveil téléphonique || key card:carte magnétique',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_02', 1, 'EN: check-out → FR: départ / règlement'),
  ('MT_REC_02', 2, 'EN: receipt → FR: reçu / facture'),
  ('MT_REC_02', 3, 'EN: wake-up call → FR: réveil téléphonique'),
  ('MT_REC_02', 4, 'EN: key card → FR: carte magnétique')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_REC_03 : Vocabulaire service réveil
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_03',
  'REC_SERV_WAKEUP',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'wake-up call:réveil téléphonique || front desk:réception / accueil || reservation:réservation || receipt:reçu / facture',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_03', 1, 'EN: wake-up call → FR: réveil téléphonique'),
  ('MT_REC_03', 2, 'EN: front desk → FR: réception / accueil'),
  ('MT_REC_03', 3, 'EN: reservation → FR: réservation'),
  ('MT_REC_03', 4, 'EN: receipt → FR: reçu / facture')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_REC_04 : Vocabulaire facturation
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_04',
  'REC_CO_INVOICE',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'receipt:reçu / facture || reservation:réservation || check-out:départ / règlement || front desk:réception / accueil || key card:carte magnétique',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_04', 1, 'EN: receipt → FR: reçu / facture'),
  ('MT_REC_04', 2, 'EN: reservation → FR: réservation'),
  ('MT_REC_04', 3, 'EN: check-out → FR: départ / règlement'),
  ('MT_REC_04', 4, 'EN: front desk → FR: réception / accueil'),
  ('MT_REC_04', 5, 'EN: key card → FR: carte magnétique')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_REC_05 : Vocabulaire surclassement / upgrade
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_05',
  'REC_CI_UPGRADE',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'reservation:réservation || check-in:enregistrement || key card:carte magnétique || receipt:reçu / facture || wake-up call:réveil téléphonique',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_05', 1, 'EN: reservation → FR: réservation'),
  ('MT_REC_05', 2, 'EN: check-in → FR: enregistrement'),
  ('MT_REC_05', 3, 'EN: key card → FR: carte magnétique'),
  ('MT_REC_05', 4, 'EN: receipt → FR: reçu / facture'),
  ('MT_REC_05', 5, 'EN: wake-up call → FR: réveil téléphonique')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_REC_06 : Vocabulaire complet réception (révision)
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_REC_06',
  'REC_INFO_FACILITIES',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'front desk:réception / accueil || check-in:enregistrement || check-out:départ / règlement || key card:carte magnétique || reservation:réservation || receipt:reçu / facture || wake-up call:réveil téléphonique',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_REC_06', 1, 'EN: front desk → FR: réception / accueil'),
  ('MT_REC_06', 2, 'EN: check-in → FR: enregistrement'),
  ('MT_REC_06', 3, 'EN: check-out → FR: départ / règlement'),
  ('MT_REC_06', 4, 'EN: key card → FR: carte magnétique'),
  ('MT_REC_06', 5, 'EN: reservation → FR: réservation'),
  ('MT_REC_06', 6, 'EN: receipt → FR: reçu / facture'),
  ('MT_REC_06', 7, 'EN: wake-up call → FR: réveil téléphonique')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- =====================================================
-- RESTAURANT (6 exercices) — action_ids FB_*
-- =====================================================

-- MT_RST_01 : Vocabulaire commande / paiement
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_01',
  'FB_TAKE_ORDER',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'bill:addition || order:commande || menu:carte / menu || tip:pourboire',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_01', 1, 'EN: bill → FR: addition'),
  ('MT_RST_01', 2, 'EN: order → FR: commande'),
  ('MT_RST_01', 3, 'EN: menu → FR: carte / menu'),
  ('MT_RST_01', 4, 'EN: tip → FR: pourboire')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_RST_02 : Vocabulaire boissons / desserts
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_02',
  'FB_UPSELL_DRINKS',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'drink:boisson || dessert:dessert || bill:addition || order:commande',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_02', 1, 'EN: drink → FR: boisson'),
  ('MT_RST_02', 2, 'EN: dessert → FR: dessert'),
  ('MT_RST_02', 3, 'EN: bill → FR: addition'),
  ('MT_RST_02', 4, 'EN: order → FR: commande')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_RST_03 : Vocabulaire allergies / réservation
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_03',
  'FB_ALLERGY_CHECK',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'allergy:allergie || reservation:réservation || menu:carte / menu || drink:boisson || tip:pourboire',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_03', 1, 'EN: allergy → FR: allergie'),
  ('MT_RST_03', 2, 'EN: reservation → FR: réservation'),
  ('MT_RST_03', 3, 'EN: menu → FR: carte / menu'),
  ('MT_RST_03', 4, 'EN: drink → FR: boisson'),
  ('MT_RST_03', 5, 'EN: tip → FR: pourboire')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_RST_04 : Vocabulaire paiement
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_04',
  'FB_BILL_REQUEST',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'bill:addition || tip:pourboire || order:commande || dessert:dessert || drink:boisson',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_04', 1, 'EN: bill → FR: addition'),
  ('MT_RST_04', 2, 'EN: tip → FR: pourboire'),
  ('MT_RST_04', 3, 'EN: order → FR: commande'),
  ('MT_RST_04', 4, 'EN: dessert → FR: dessert'),
  ('MT_RST_04', 5, 'EN: drink → FR: boisson')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_RST_05 : Vocabulaire réservation groupe
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_05',
  'FB_GROUP_RESERVATION',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'reservation:réservation || allergy:allergie || bill:addition || menu:carte / menu || tip:pourboire',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_05', 1, 'EN: reservation → FR: réservation'),
  ('MT_RST_05', 2, 'EN: allergy → FR: allergie'),
  ('MT_RST_05', 3, 'EN: bill → FR: addition'),
  ('MT_RST_05', 4, 'EN: menu → FR: carte / menu'),
  ('MT_RST_05', 5, 'EN: tip → FR: pourboire')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_RST_06 : Vocabulaire restaurant complet (révision)
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_RST_06',
  'FB_FEEDBACK_REQUEST',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'bill:addition || order:commande || menu:carte / menu || allergy:allergie || dessert:dessert || drink:boisson || tip:pourboire || reservation:réservation',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_RST_06', 1, 'EN: bill → FR: addition'),
  ('MT_RST_06', 2, 'EN: order → FR: commande'),
  ('MT_RST_06', 3, 'EN: menu → FR: carte / menu'),
  ('MT_RST_06', 4, 'EN: allergy → FR: allergie'),
  ('MT_RST_06', 5, 'EN: dessert → FR: dessert'),
  ('MT_RST_06', 6, 'EN: drink → FR: boisson'),
  ('MT_RST_06', 7, 'EN: tip → FR: pourboire'),
  ('MT_RST_06', 8, 'EN: reservation → FR: réservation')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- =====================================================
-- HOUSEKEEPING (6 exercices) — action_ids HK_*
-- =====================================================

-- MT_HK_01 : Vocabulaire linge / chambre
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_01',
  'HK_LINEN_CHANGE',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'towel:serviette || sheet:drap || blanket:couverture || pillow:oreiller',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_01', 1, 'EN: towel → FR: serviette'),
  ('MT_HK_01', 2, 'EN: sheet → FR: drap'),
  ('MT_HK_01', 3, 'EN: blanket → FR: couverture'),
  ('MT_HK_01', 4, 'EN: pillow → FR: oreiller')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_HK_02 : Vocabulaire salle de bain / nettoyage
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_02',
  'HK_AMENITIES',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'bathroom:salle de bain || cleaning:nettoyage || towel:serviette || minibar:minibar',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_02', 1, 'EN: bathroom → FR: salle de bain'),
  ('MT_HK_02', 2, 'EN: cleaning → FR: nettoyage'),
  ('MT_HK_02', 3, 'EN: towel → FR: serviette'),
  ('MT_HK_02', 4, 'EN: minibar → FR: minibar')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_HK_03 : Vocabulaire blanchisserie / minibar
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_03',
  'HK_LAUNDRY_GUEST',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'laundry:blanchisserie / lessive || minibar:minibar || bathroom:salle de bain || sheet:drap || pillow:oreiller',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_03', 1, 'EN: laundry → FR: blanchisserie / lessive'),
  ('MT_HK_03', 2, 'EN: minibar → FR: minibar'),
  ('MT_HK_03', 3, 'EN: bathroom → FR: salle de bain'),
  ('MT_HK_03', 4, 'EN: sheet → FR: drap'),
  ('MT_HK_03', 5, 'EN: pillow → FR: oreiller')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_HK_04 : Vocabulaire contrôle chambre
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_04',
  'HK_CHECKLIST',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'cleaning:nettoyage || towel:serviette || blanket:couverture || laundry:blanchisserie / lessive || minibar:minibar',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_04', 1, 'EN: cleaning → FR: nettoyage'),
  ('MT_HK_04', 2, 'EN: towel → FR: serviette'),
  ('MT_HK_04', 3, 'EN: blanket → FR: couverture'),
  ('MT_HK_04', 4, 'EN: laundry → FR: blanchisserie / lessive'),
  ('MT_HK_04', 5, 'EN: minibar → FR: minibar')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_HK_05 : Vocabulaire équipement lit
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_05',
  'HK_EXTRA_BED',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'pillow:oreiller || sheet:drap || blanket:couverture || towel:serviette || bathroom:salle de bain',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_05', 1, 'EN: pillow → FR: oreiller'),
  ('MT_HK_05', 2, 'EN: sheet → FR: drap'),
  ('MT_HK_05', 3, 'EN: blanket → FR: couverture'),
  ('MT_HK_05', 4, 'EN: towel → FR: serviette'),
  ('MT_HK_05', 5, 'EN: bathroom → FR: salle de bain')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_HK_06 : Vocabulaire housekeeping complet (révision)
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_HK_06',
  'HK_ROOM_CLEAN',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'towel:serviette || sheet:drap || blanket:couverture || cleaning:nettoyage || bathroom:salle de bain || minibar:minibar || laundry:blanchisserie / lessive || pillow:oreiller',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_HK_06', 1, 'EN: towel → FR: serviette'),
  ('MT_HK_06', 2, 'EN: sheet → FR: drap'),
  ('MT_HK_06', 3, 'EN: blanket → FR: couverture'),
  ('MT_HK_06', 4, 'EN: cleaning → FR: nettoyage'),
  ('MT_HK_06', 5, 'EN: bathroom → FR: salle de bain'),
  ('MT_HK_06', 6, 'EN: minibar → FR: minibar'),
  ('MT_HK_06', 7, 'EN: laundry → FR: blanchisserie / lessive'),
  ('MT_HK_06', 8, 'EN: pillow → FR: oreiller')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- =====================================================
-- SÉCURITÉ (6 exercices) — action_ids SEC_*
-- =====================================================

-- MT_SEC_01 : Vocabulaire accès / identité
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_01',
  'SEC_ID_VERIFICATION',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'ID:pièce d''identité || access:accès || exit:sortie || visitor:visiteur',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_01', 1, 'EN: ID → FR: pièce d''identité'),
  ('MT_SEC_01', 2, 'EN: access → FR: accès'),
  ('MT_SEC_01', 3, 'EN: exit → FR: sortie'),
  ('MT_SEC_01', 4, 'EN: visitor → FR: visiteur')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_SEC_02 : Vocabulaire urgence / alarme
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_02',
  'SEC_FIRE_ALARM',
  'MATCH_TRANSLATION',
  'A1',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'emergency:urgence || alarm:alarme || exit:sortie || access:accès',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_02', 1, 'EN: emergency → FR: urgence'),
  ('MT_SEC_02', 2, 'EN: alarm → FR: alarme'),
  ('MT_SEC_02', 3, 'EN: exit → FR: sortie'),
  ('MT_SEC_02', 4, 'EN: access → FR: accès')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_SEC_03 : Vocabulaire vidéosurveillance / incident
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_03',
  'SEC_CCTV_REQUEST',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'CCTV:vidéosurveillance || incident:incident || ID:pièce d''identité || visitor:visiteur || alarm:alarme',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_03', 1, 'EN: CCTV → FR: vidéosurveillance'),
  ('MT_SEC_03', 2, 'EN: incident → FR: incident'),
  ('MT_SEC_03', 3, 'EN: ID → FR: pièce d''identité'),
  ('MT_SEC_03', 4, 'EN: visitor → FR: visiteur'),
  ('MT_SEC_03', 5, 'EN: alarm → FR: alarme')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_SEC_04 : Vocabulaire contrôle accès
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_04',
  'SEC_ACCESS_CONTROL',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'access:accès || exit:sortie || visitor:visiteur || CCTV:vidéosurveillance || incident:incident',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_04', 1, 'EN: access → FR: accès'),
  ('MT_SEC_04', 2, 'EN: exit → FR: sortie'),
  ('MT_SEC_04', 3, 'EN: visitor → FR: visiteur'),
  ('MT_SEC_04', 4, 'EN: CCTV → FR: vidéosurveillance'),
  ('MT_SEC_04', 5, 'EN: incident → FR: incident')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_SEC_05 : Vocabulaire rapport incident
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_05',
  'SEC_INCIDENT_REPORT',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'incident:incident || emergency:urgence || alarm:alarme || ID:pièce d''identité || access:accès',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_05', 1, 'EN: incident → FR: incident'),
  ('MT_SEC_05', 2, 'EN: emergency → FR: urgence'),
  ('MT_SEC_05', 3, 'EN: alarm → FR: alarme'),
  ('MT_SEC_05', 4, 'EN: ID → FR: pièce d''identité'),
  ('MT_SEC_05', 5, 'EN: access → FR: accès')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

-- MT_SEC_06 : Vocabulaire sécurité complet (révision)
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'MT_SEC_06',
  'SEC_CONFLICT_DEESCALATION',
  'MATCH_TRANSLATION',
  'A2',
  'Match each English term with its French translation.',
  NULL, NULL, NULL,
  'FREE',
  'ID:pièce d''identité || access:accès || emergency:urgence || exit:sortie || alarm:alarme || CCTV:vidéosurveillance || incident:incident || visitor:visiteur',
  NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id      = EXCLUDED.action_id,
  type_quiz      = EXCLUDED.type_quiz,
  niveau         = EXCLUDED.niveau,
  question       = EXCLUDED.question,
  option_a       = EXCLUDED.option_a,
  option_b       = EXCLUDED.option_b,
  option_c       = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url      = EXCLUDED.audio_url,
  phrase_id      = EXCLUDED.phrase_id;

INSERT INTO quiz_options (quiz_id, position, option_text)
VALUES
  ('MT_SEC_06', 1, 'EN: ID → FR: pièce d''identité'),
  ('MT_SEC_06', 2, 'EN: access → FR: accès'),
  ('MT_SEC_06', 3, 'EN: emergency → FR: urgence'),
  ('MT_SEC_06', 4, 'EN: exit → FR: sortie'),
  ('MT_SEC_06', 5, 'EN: alarm → FR: alarme'),
  ('MT_SEC_06', 6, 'EN: CCTV → FR: vidéosurveillance'),
  ('MT_SEC_06', 7, 'EN: incident → FR: incident'),
  ('MT_SEC_06', 8, 'EN: visitor → FR: visiteur')
ON CONFLICT (quiz_id, position) DO UPDATE SET option_text = EXCLUDED.option_text;

COMMIT;

-- =====================================================
-- RÉSUMÉ : 24 exercices MATCH_TRANSLATION
--   REC : MT_REC_01 à MT_REC_06 (6 exercices)
--   RST : MT_RST_01 à MT_RST_06 (6 exercices)
--   HK  : MT_HK_01  à MT_HK_06  (6 exercices)
--   SEC : MT_SEC_01 à MT_SEC_06 (6 exercices)
-- =====================================================
