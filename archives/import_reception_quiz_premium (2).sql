begin;

-- =====================================================
-- Réception — Exercices premium (exemples)
-- Types:
--  - ORDER_SEQUENCE
--  - TRANSLATION_ACTIVE
--  - LISTEN_AND_SELECT
--  - LISTEN_AND_SPEAK
-- =====================================================

-- 1) ORDER_SEQUENCE (minibar dispute) — use quiz_options positions as the correct order
insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values (
  'QZ_REC_ORDER_MINIBAR_01',
  'REC_PROB_BILL',
  'ORDER_SEQUENCE',
  'B1',
  'Put the following sentences in the correct professional order.',
  null, null, null,
  'Order = 1-5',
  null,
  null,
  'A'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  expected_answer = excluded.expected_answer,
  audio_url = excluded.audio_url,
  phrase_id = excluded.phrase_id,
  reponse_correcte = excluded.reponse_correcte;

delete from quiz_options where quiz_id = 'QZ_REC_ORDER_MINIBAR_01';
insert into quiz_options (quiz_id, position, option_text) values
('QZ_REC_ORDER_MINIBAR_01', 1, 'I understand your concern.'),
('QZ_REC_ORDER_MINIBAR_01', 2, 'Please accept our sincere apologies for the inconvenience.'),
('QZ_REC_ORDER_MINIBAR_01', 3, 'I will temporarily remove the charge pending verification so you can leave on time.'),
('QZ_REC_ORDER_MINIBAR_01', 4, 'I will document this in the system and verify with Housekeeping.'),
('QZ_REC_ORDER_MINIBAR_01', 5, 'I will follow up with you today.');

-- 2) TRANSLATION_ACTIVE (service recovery)
insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values (
  'QZ_REC_TRANSLATION_01',
  'REC_PROB_NOISE',
  'TRANSLATION_ACTIVE',
  'B1',
  'Translate into English: "Je comprends votre gêne et je vais m’en occuper immédiatement."',
  null, null, null,
  'I understand the disturbance and I will take care of it immediately.',
  null,
  null,
  'A'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  expected_answer = excluded.expected_answer,
  audio_url = excluded.audio_url,
  phrase_id = excluded.phrase_id,
  reponse_correcte = excluded.reponse_correcte;

-- 3) LISTEN_AND_SELECT (choose what you hear) — audio_url placeholder
insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values (
  'QZ_REC_LISTEN_SELECT_01',
  'REC_CI_ADMIN',
  'LISTEN_AND_SELECT',
  'A2',
  'Listen to the audio and select the sentence you heard.',
  'May I have a credit card for the guarantee, please?',
  'Could you please complete this registration form?',
  'We will place a pre-authorization of {amount} {currency}.',
  null,
  'audio/rec_ci_admin_listen_01.mp3',
  null,
  'A'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  expected_answer = excluded.expected_answer,
  audio_url = excluded.audio_url,
  phrase_id = excluded.phrase_id,
  reponse_correcte = excluded.reponse_correcte;

-- 4) LISTEN_AND_SPEAK (repeat) — link to a phrase_id if you want strict tracking later
insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values (
  'QZ_REC_LISTEN_SPEAK_01',
  'REC_CI_STANDARD',
  'LISTEN_AND_SPEAK',
  'A1',
  'Listen and repeat the sentence.',
  null, null, null,
  'Good afternoon, it''s a pleasure to welcome you.',
  'audio/rec_ci_standard_repeat_01.mp3',
  null,
  'A'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  expected_answer = excluded.expected_answer,
  audio_url = excluded.audio_url,
  phrase_id = excluded.phrase_id,
  reponse_correcte = excluded.reponse_correcte;

commit;
