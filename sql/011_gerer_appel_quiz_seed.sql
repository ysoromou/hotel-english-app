-- =====================================================
-- 011_gerer_appel_quiz_seed.sql
-- Quiz téléphoniques — compétence gerer_appel
-- MCQ_TONE (ton téléphonique) : 4 exercices (1 par métier)
-- MCQ_POLICY (procédures téléphoniques) : 4 exercices (1 par métier)
-- Total : 8 exercices
-- Idempotent (ON CONFLICT DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- MCQ_TONE — TON TÉLÉPHONIQUE PROFESSIONNEL
-- =====================================================

-- TONE_APP_REC_01 : Réception — client en attente trop longtemps
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_APP_REC_01',
  'REC_SERV_WAKEUP',
  'MCQ_TONE',
  'A2',
  'A guest has been on hold for 3 minutes. What is the best response when you return to the line?',
  'Thank you for your patience. I apologize for the wait. How may I assist you?',
  'You''ve been waiting. What do you want?',
  'I was busy. What''s your question?',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- TONE_APP_HK_01 : Housekeeping — appel interne à la maintenance
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_APP_HK_01',
  'HK_MAINT_REQUEST',
  'MCQ_TONE',
  'A2',
  'You call maintenance to report a water leak in room 312. How do you open the call?',
  'This is Housekeeping. I need to report an urgent water leak in room 312. Can you send someone immediately?',
  'Room 312 is leaking. Come fast.',
  'Hi, it''s me from Housekeeping. There''s a problem.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- TONE_APP_RST_01 : Restaurant — appel room service entrant
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_APP_RST_01',
  'FB_TAKE_ORDER',
  'MCQ_TONE',
  'A2',
  'A guest calls for room service. How do you answer the phone?',
  'Room service, good evening. How may I help you?',
  'Yes, what do you want to order?',
  'Hello, who is calling?',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- TONE_APP_SEC_01 : Sécurité — appel d'urgence sortant
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_APP_SEC_01',
  'SEC_EMERGENCY_MEDICAL',
  'MCQ_TONE',
  'B1',
  'You call emergency services for a guest who fainted. How do you start the call?',
  'This is Hotel {name}, security team. I need an ambulance immediately. A guest has lost consciousness in room {room}.',
  'Send an ambulance to our hotel. Someone is sick.',
  'Hello, is this the SAMU? We have a problem here.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- =====================================================
-- MCQ_POLICY — PROCÉDURES TÉLÉPHONIQUES
-- =====================================================

-- POL_APP_REC_01 : Réception — transfert d'appel
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_APP_REC_01',
  'REC_SERV_BOOKING',
  'MCQ_POLICY',
  'A2',
  'A caller asks for the manager, who is unavailable. What is the correct procedure?',
  'Inform the caller, offer to take a message with their name and number, and confirm a callback time.',
  'Tell the caller the manager is busy and hang up.',
  'Transfer immediately without informing the caller.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- POL_APP_HK_01 : Housekeeping — signalement par téléphone
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_APP_HK_01',
  'HK_MAINT_REQUEST',
  'MCQ_POLICY',
  'A2',
  'You discover a broken heater in room 205. What should you do first?',
  'Call maintenance immediately, give the room number and describe the problem clearly.',
  'Fix it yourself to save time.',
  'Wait until your supervisor passes by to report it.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- POL_APP_RST_01 : Restaurant — commande incomplète par téléphone
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_APP_RST_01',
  'FB_TAKE_ORDER',
  'MCQ_POLICY',
  'A2',
  'A guest calls to order room service but the line is unclear. What is the correct action?',
  'Ask the guest to repeat clearly, confirm each item before closing the call, and repeat the full order.',
  'Process the order with what you understood and hope for the best.',
  'Hang up and wait for the guest to call back.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

-- POL_APP_SEC_01 : Sécurité — réception d'un appel signalant un incident
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'POL_APP_SEC_01',
  'SEC_INCIDENT_REPORT',
  'MCQ_POLICY',
  'B1',
  'You receive a call reporting a suspicious person in the parking area. What is the first correct step?',
  'Ask for a precise description and location, confirm your response, and dispatch a colleague immediately.',
  'Tell the caller to handle it themselves.',
  'Take note and report it at the end of the shift.',
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
  reponse_correcte = EXCLUDED.reponse_correcte;

COMMIT;
