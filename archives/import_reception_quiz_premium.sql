begin;

-- =====================================================
-- RECEPTION PREMIUM — nouveaux exercices (ORDER / TRANSLATION / LISTEN)
-- Fichier additionnel (ne remplace pas import_3_quiz.sql)
-- =====================================================

-- 1) ORDER_SEQUENCE — Service recovery (minibar dispute)
insert into quiz (id, action_id, type_quiz, niveau, question, reponse_correcte)
values (
  'QZ_REC_PROB_BILL_ORDER_0001',
  'REC_PROB_BILL',
  'ORDER_SEQUENCE',
  'B1',
  'Put the following sentences in the correct professional order.',
  'A,B,C,D,E'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  reponse_correcte = excluded.reponse_correcte;

-- options (désordre volontaire côté app via sort_order; la "bonne séquence" est dans reponse_correcte)
delete from quiz_options where quiz_id = 'QZ_REC_PROB_BILL_ORDER_0001';
insert into quiz_options (quiz_id, label, option_text, sort_order, is_correct) values
('QZ_REC_PROB_BILL_ORDER_0001','A','I understand your concern.',1,false),
('QZ_REC_PROB_BILL_ORDER_0001','B','Please accept our apologies for the inconvenience.',2,false),
('QZ_REC_PROB_BILL_ORDER_0001','C','I will temporarily remove the charge pending verification.',3,false),
('QZ_REC_PROB_BILL_ORDER_0001','D','I will document this in the system and follow up today.',4,false),
('QZ_REC_PROB_BILL_ORDER_0001','E','Thank you for your patience.',5,false);

-- 2) TRANSLATION_ACTIVE — late check-out refusal (soft refusal)
insert into quiz (id, action_id, type_quiz, niveau, question, reponse_correcte, expected_answer)
values (
  'QZ_REC_CO_LATE_TRAD_0001',
  'REC_CO_LATE',
  'TRANSLATION_ACTIVE',
  'B1',
  'Translate into English: "Je comprends votre demande, mais nous ne pouvons pas prolonger aujourd’hui car l’hôtel est complet. Je peux toutefois garder vos bagages et vous proposer un espace pour vous changer."',
  'FREE_TEXT',
  'I understand your request, but we are unable to extend today due to full occupancy. However, I can store your luggage and arrange a place for you to change.'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  reponse_correcte = excluded.reponse_correcte,
  expected_answer = excluded.expected_answer;

-- 3) LISTEN_AND_SELECT — choose what you hear (uses audio_url)
insert into quiz (id, action_id, type_quiz, niveau, question, reponse_correcte, audio_url)
values (
  'QZ_REC_CI_STANDARD_LISTEN_SELECT_0001',
  'REC_CI_STANDARD',
  'LISTEN_AND_SELECT',
  'A2',
  'Listen and select the sentence you hear.',
  'B',
  'audio/rec/ci_standard_welcome_01.mp3'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  reponse_correcte = excluded.reponse_correcte,
  audio_url = excluded.audio_url;

delete from quiz_options where quiz_id = 'QZ_REC_CI_STANDARD_LISTEN_SELECT_0001';
insert into quiz_options (quiz_id, label, option_text, sort_order, is_correct) values
('QZ_REC_CI_STANDARD_LISTEN_SELECT_0001','A','May I have your passport or ID, please?',1,false),
('QZ_REC_CI_STANDARD_LISTEN_SELECT_0001','B','Good afternoon, it''s a pleasure to welcome you.',2,true),
('QZ_REC_CI_STANDARD_LISTEN_SELECT_0001','C','Would you like to arrange a wake-up call for tomorrow?',3,false);

-- 4) LISTEN_AND_SPEAK — repeat after audio (target phrase_id optional)
-- Note: audio_url ici est un placeholder; l’app gère l’enregistrement + scoring.
insert into quiz (id, action_id, type_quiz, niveau, question, reponse_correcte, audio_url, phrase_id)
values (
  'QZ_REC_PROB_NOISE_LISTEN_SPEAK_0001',
  'REC_PROB_NOISE',
  'LISTEN_AND_SPEAK',
  'B1',
  'Listen and repeat clearly.',
  'SPEAK',
  'audio/rec/prob_noise_apology_01.mp3',
  'REC_REC_PROB_NOISE_0006'
)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  reponse_correcte = excluded.reponse_correcte,
  audio_url = excluded.audio_url,
  phrase_id = excluded.phrase_id;

commit;
