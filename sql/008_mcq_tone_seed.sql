-- =====================================================
-- 008_mcq_tone_seed.sql
-- Exercices MCQ_TONE : choisir la meilleure réponse professionnelle
-- 3 exercices par métier = 12 exercices total
--
-- Règle :
--   reponse_correcte = 'A' (toujours A = bonne réponse)
--   option_a = réponse professionnelle correcte
--   option_b = réponse trop brusque / incorrecte
--   option_c = réponse passive / incorrecte
--   type_quiz = 'MCQ_TONE'
--   niveau    = 'A2' ou 'B1'
--
-- Préfixes IDs : TONE_REC_, TONE_HK_, TONE_RST_, TONE_SEC_
-- Idempotent (ON CONFLICT ... DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- RÉCEPTION (3 exercices)
-- =====================================================

-- TONE_REC_01 : Client mécontent de sa chambre
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_REC_01',
  'REC_PROB_CLEAN',
  'MCQ_TONE',
  'A2',
  'A guest says: "My room is dirty. I am very disappointed." — Which response is the most professional?',
  'I am truly sorry to hear that. I will send Housekeeping immediately and check with you within 15 minutes.',
  'That is not possible. Our rooms are always clean.',
  'Yes, I understand. I will try to do something when I have time.',
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

-- TONE_REC_02 : Client qui demande une information sur les services
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_REC_02',
  'REC_INFO_FACILITIES',
  'MCQ_TONE',
  'A2',
  'A guest asks: "Excuse me, what time does the pool open?" — Which response is the most professional?',
  'Of course! The pool is open from 7 a.m. to 10 p.m. Is there anything else I can help you with?',
  'I don''t know. Ask someone else.',
  'It''s open. Check the notice board.',
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

-- TONE_REC_03 : Client qui veut parler au manager
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_REC_03',
  'REC_PROB_BILL',
  'MCQ_TONE',
  'B1',
  'A guest says: "I want to speak to your manager right now!" — Which response is the most professional?',
  'I understand. I will contact the duty manager immediately. May I have your name and room number, please?',
  'Why? What did I do wrong?',
  'OK, wait here. I don''t know if the manager is available.',
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

-- TONE_HK_01 : Client dans la chambre lors du nettoyage
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_HK_01',
  'HK_ROOM_CLEAN',
  'MCQ_TONE',
  'A2',
  'You knock and enter a room. The guest is still inside. — Which response is the most professional?',
  'I apologise for disturbing you. I can come back later — what time would be convenient for you?',
  'Oh sorry, I will just be quick. It will only take 5 minutes.',
  'No problem. I will clean around you.',
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

-- TONE_HK_02 : Client mécontent d'une tache sur le linge
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_HK_02',
  'HK_STAIN_COMPLAINT',
  'MCQ_TONE',
  'A2',
  'A guest shows you a stained towel and says: "This is unacceptable!" — Which response is the most professional?',
  'I sincerely apologise. I will replace this immediately with fresh towels and report it to my supervisor.',
  'That was already there when you arrived.',
  'I will see what I can do later.',
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

-- TONE_HK_03 : Client qui demande plus de serviettes
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_HK_03',
  'HK_LINEN_CHANGE',
  'MCQ_TONE',
  'A2',
  'A guest stops you in the corridor and says: "Could I have two extra towels, please?" — Which response is the most professional?',
  'Of course! I will bring them to your room within 10 minutes. What is your room number, please?',
  'We only give one towel per person. That''s the rule.',
  'OK, I will try but I am very busy right now.',
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

-- TONE_RST_01 : Client qui attend depuis 20 minutes
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_RST_01',
  'FB_DELAY_APOLOGY',
  'MCQ_TONE',
  'A2',
  'A guest says: "I have been waiting for 20 minutes. Where is my food?" — Which response is the most professional?',
  'I am truly sorry for the wait. I will check with the kitchen right now and give you an accurate time. Thank you for your patience.',
  'It is not my fault. The kitchen is busy today.',
  'Just a moment please.',
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

-- TONE_RST_02 : Commande incorrecte apportée au client
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_RST_02',
  'FB_WRONG_ORDER',
  'MCQ_TONE',
  'B1',
  'You bring a dish and the guest says: "This is not what I ordered." — Which response is the most professional?',
  'I am very sorry about that. Could you remind me what you ordered? I will correct it immediately and prioritise your dish.',
  'Are you sure? You said chicken.',
  'I will bring the right one when I can. It''s busy right now.',
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

-- TONE_RST_03 : Client qui demande une alternative (plat non disponible)
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_RST_03',
  'FB_SPECIAL_REQUEST',
  'MCQ_TONE',
  'B1',
  'A guest asks for a dish that is sold out. — Which response is the most professional?',
  'I am sorry, that dish is no longer available this evening. May I suggest our grilled fish or the vegetable risotto as an alternative?',
  'Sorry, we don''t have it. Choose something else.',
  'Let me check. Maybe we can find some. Wait.',
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

-- TONE_SEC_01 : Visiteur non inscrit qui insiste pour entrer
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_SEC_01',
  'SEC_ACCESS_CONTROL',
  'MCQ_TONE',
  'A2',
  'A visitor not on the list insists: "I am a friend of the guest. Let me in." — Which response is the most professional?',
  'I understand, sir. For the safety of our guests, I need to verify your identity and contact the guest to confirm. Could I have your name, please?',
  'No way. Your name is not here. Go away.',
  'OK, you can wait in the lobby but I can''t let you go upstairs.',
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

-- TONE_SEC_02 : Personne qui filme sans autorisation
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_SEC_02',
  'SEC_VIP_PROTECTION',
  'MCQ_TONE',
  'B1',
  'You see someone filming in a restricted area of the hotel. — Which response is the most professional?',
  'Excuse me, sir. I am sorry but filming is not permitted in this area. Could you please stop? If you have a specific request, I can direct you to our management.',
  'Hey! Stop that! Give me your camera now!',
  'I saw you but it''s not really my job. Someone else will handle it.',
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

-- TONE_SEC_03 : Client agressif dans le lobby
INSERT INTO quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, expected_answer, audio_url, phrase_id)
VALUES (
  'TONE_SEC_03',
  'SEC_CONFLICT_DEESCALATION',
  'MCQ_TONE',
  'B1',
  'A guest is shouting loudly in the lobby and disturbing other guests. — Which response is the most professional?',
  'Sir, I understand you are upset. Let us move to a quiet area where I can assist you fully and resolve this situation for you.',
  'Stop shouting or I will call the police immediately!',
  'I see the problem but I cannot do anything right now.',
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
-- RÉSUMÉ : 12 exercices MCQ_TONE
--   REC : TONE_REC_01 à TONE_REC_03 (3 exercices)
--   HK  : TONE_HK_01  à TONE_HK_03  (3 exercices)
--   RST : TONE_RST_01 à TONE_RST_03 (3 exercices)
--   SEC : TONE_SEC_01 à TONE_SEC_03 (3 exercices)
-- =====================================================
