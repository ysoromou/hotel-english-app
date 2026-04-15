-- =====================================================
-- 009_mcq_policy_seed.sql
-- Exercices MCQ_POLICY : choisir la bonne action selon la procédure
-- 3 exercices par métier = 12 exercices total
--
-- Règle :
--   reponse_correcte = 'A' (toujours A = bonne réponse)
--   option_a = action correcte selon procédure
--   option_b = action incorrecte / risquée
--   option_c = action incomplète
--   type_quiz = 'MCQ_POLICY'
--   niveau    = 'A2' ou 'B1'
--
-- Préfixes IDs : POL_REC_, POL_HK_, POL_RST_, POL_SEC_
-- Idempotent (ON CONFLICT ... DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- RÉCEPTION (3 exercices)
-- =====================================================

-- POL_REC_01 : Client sans réservation qui insiste pour une chambre
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_REC_01',
  'REC_CI_WALKIN',
  'MCQ_POLICY',
  'A2',
  'A walk-in guest insists there must be a room available. You have none. What should you do?',
  'Politely confirm that no rooms are available, offer to check nearby partner hotels, and record the guest''s contact details in case of cancellation.',
  'Give the guest a key to an out-of-order room so they feel satisfied.',
  'Tell the guest to check back in two hours without checking availability first.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_REC_02 : Demande de clé magnétique sans pièce d'identité
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_REC_02',
  'REC_PROB_KEY',
  'MCQ_POLICY',
  'B1',
  'A person requests a replacement key card for room 302 but cannot produce any ID. What should you do?',
  'Decline to issue the key, explain that ID verification is mandatory for security, and offer to call the registered guest in room 302 to confirm.',
  'Issue the key immediately to avoid a conflict — the guest seems genuine.',
  'Ask the guest to wait and give the key to a colleague to deal with later.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_REC_03 : Client conteste un item sur sa facture
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_REC_03',
  'REC_PROB_BILL',
  'MCQ_POLICY',
  'B1',
  'A guest contests a minibar charge on their bill, saying they did not consume anything. What should you do?',
  'Apologise, temporarily place the charge on hold, verify with Housekeeping, and inform the guest of the outcome before checkout.',
  'Immediately remove the charge to avoid any argument, without checking.',
  'Tell the guest the charge is correct and that the system is never wrong.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- =====================================================
-- HOUSEKEEPING (3 exercices)
-- =====================================================

-- POL_HK_01 : Chambre avec DND activé depuis plus de 18h
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_HK_01',
  'HK_DND',
  'MCQ_POLICY',
  'B1',
  'A room has had the Do Not Disturb sign on for over 18 hours. What is the correct procedure?',
  'Inform the supervisor, who will call the room; if no answer, a security officer and a supervisor will conduct a welfare check together.',
  'Knock loudly and enter immediately — the guest might be in danger.',
  'Leave a note under the door and wait until the next shift.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_HK_02 : Objet trouvé dans une chambre après départ
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_HK_02',
  'HK_LOST_FOUND',
  'MCQ_POLICY',
  'A2',
  'You find a wallet in a recently checked-out room. What should you do?',
  'Do not touch the wallet without logging it. Report it immediately to the supervisor, fill in a Lost & Found form with date, room, and description, then hand it to the front desk.',
  'Keep it safe in your cart and return it to the guest yourself if they come back.',
  'Hand it to a colleague to deal with — it is not your room.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_HK_03 : Fuite d'eau constatée dans la salle de bain
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_HK_03',
  'HK_MAINT_REQUEST',
  'MCQ_POLICY',
  'B1',
  'You notice a water leak under the bathroom sink in an occupied room. What should you do?',
  'Inform the guest, place towels to limit damage, immediately report to maintenance with the room number and nature of the problem, and notify the supervisor.',
  'Try to fix it yourself with the tools in your cart to save time.',
  'Finish cleaning and report it at the end of your shift.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- =====================================================
-- RESTAURANT (3 exercices)
-- =====================================================

-- POL_RST_01 : Client allergique qui commande sans mentionner son allergie
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_RST_01',
  'FB_ALLERGY_CHECK',
  'MCQ_POLICY',
  'B1',
  'A guest places an order and you later notice from their file that they have a nut allergy. They have not mentioned it today. What should you do?',
  'Politely interrupt before sending the order to the kitchen, ask the guest to confirm their allergy, verify the dish ingredients, and alert the kitchen to avoid cross-contamination.',
  'Send the order as placed — it is the guest''s responsibility to mention their allergy.',
  'Replace the dish with a safer option without telling the guest, to avoid worrying them.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_RST_02 : Addition qui semble incorrecte
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_RST_02',
  'FB_BILL_REQUEST',
  'MCQ_POLICY',
  'A2',
  'A guest says their bill looks higher than expected. What is the correct procedure?',
  'Apologise, take the bill back, verify each item with the order record, and present a corrected bill with a clear explanation.',
  'Tell the guest the system is never wrong and ask them to pay immediately.',
  'Reduce the total by 10% without checking, just to satisfy the guest quickly.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_RST_03 : Client qui refuse de payer
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_RST_03',
  'FB_PAYMENT_CARD_ISSUE',
  'MCQ_POLICY',
  'B1',
  'A guest''s card is declined and they say they cannot pay. What should you do?',
  'Remain calm, suggest alternative payment methods (cash, another card), offer to contact the front desk for a room charge, and discreetly notify the restaurant manager.',
  'Block the guest from leaving and threaten to call the police in front of everyone.',
  'Let the guest leave and hope they pay later — avoid a scene.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- =====================================================
-- SÉCURITÉ (3 exercices)
-- =====================================================

-- POL_SEC_01 : Bagages abandonnés dans le lobby
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_SEC_01',
  'SEC_INCIDENT_REPORT',
  'MCQ_POLICY',
  'B1',
  'You notice an unattended bag left in the lobby for more than 20 minutes. What is the correct procedure?',
  'Do not touch the bag. Establish a safe perimeter, alert your supervisor and the front desk, and follow the hotel''s unattended items protocol (announce, wait, escalate).',
  'Pick up the bag and put it at the lost & found counter right away.',
  'Watch the bag from a distance and wait to see if someone comes back for it.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_SEC_02 : Visiteur qui photographie la réception
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_SEC_02',
  'SEC_CCTV_REQUEST',
  'MCQ_POLICY',
  'A2',
  'A visitor is photographing the reception desk and staff without permission. What should you do?',
  'Politely approach the visitor, explain that photographing staff and hotel operations requires prior authorisation, and ask them to stop. Report the incident to the supervisor.',
  'Grab their phone and delete the photos immediately.',
  'Ignore it — photos in a hotel lobby are probably harmless.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

-- POL_SEC_03 : Demande d'accès aux images CCTV par un tiers
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_SEC_03',
  'SEC_CCTV_REQUEST',
  'MCQ_POLICY',
  'B1',
  'A person claims to be a police officer and asks to view CCTV footage immediately. What is the correct procedure?',
  'Politely acknowledge the request, ask for official identification, and inform them that CCTV access requires authorisation from hotel management. Contact the duty manager immediately.',
  'Show the footage straight away — police requests must always be obeyed immediately.',
  'Refuse entirely and say the footage is confidential, without escalating to management.',
  'A',
  NULL, NULL, NULL
)
ON CONFLICT (id) DO UPDATE SET
  action_id        = EXCLUDED.action_id,
  type_quiz        = EXCLUDED.type_quiz,
  niveau           = EXCLUDED.niveau,
  question         = EXCLUDED.question,
  option_a         = EXCLUDED.option_a,
  option_b         = EXCLUDED.option_b,
  option_c         = EXCLUDED.option_c,
  reponse_correcte = EXCLUDED.reponse_correcte,
  expected_answer  = EXCLUDED.expected_answer,
  audio_url        = EXCLUDED.audio_url,
  phrase_id        = EXCLUDED.phrase_id;

COMMIT;

-- =====================================================
-- RÉSUMÉ : 12 exercices MCQ_POLICY
--   REC : POL_REC_01 à POL_REC_03 (3 exercices)
--   HK  : POL_HK_01  à POL_HK_03  (3 exercices)
--   RST : POL_RST_01 à POL_RST_03 (3 exercices)
--   SEC : POL_SEC_01 à POL_SEC_03 (3 exercices)
-- =====================================================
