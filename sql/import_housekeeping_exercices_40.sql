begin;

-- 40 exercices (Housekeeping) — compatibles schema_v3 (quiz + quiz_options)

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0001', 'HK_ROOM_CLEAN', 'MULTIPLE_CHOICE', 'A2', 'What is the first step before entering a guest room?', 'Knock and announce yourself', 'Enter quietly to save time', 'Call reception first', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0002', 'HK_DND', 'MULTIPLE_CHOICE', 'B1', 'A room has DND on. What should you do?', 'Enter to clean quickly', 'Respect DND and propose a time', 'Remove the sign', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0003', 'HK_LOST_FOUND', 'MULTIPLE_CHOICE', 'B1', 'You find a wallet in a room. What is correct?', 'Keep it until end of shift', 'Follow Lost & Found procedure', 'Give it to another guest', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0004', 'HK_MAINT_REQUEST', 'MULTIPLE_CHOICE', 'B1', 'There is a water leak. What is priority?', 'Finish your floor first', 'Guest safety and alert maintenance', 'Ignore if small', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0005', 'HK_AMENITIES', 'MULTIPLE_CHOICE', 'A2', 'Where should extra amenities be recorded?', 'No need to record', 'According to hotel standard/log', 'In personal notes only', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0006', 'HK_PUBLIC_AREAS', 'MULTIPLE_CHOICE', 'A2', 'Wet floor in lobby: what do you do?', 'Clean later', 'Place warning sign and clean now', 'Ask guest to avoid only', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0007', 'HK_LAUNDRY_GUEST', 'MULTIPLE_CHOICE', 'B1', 'Guest requests express laundry. You should:', 'Promise 2 hours always', 'Confirm deadline after checking', 'Refuse because busy', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0008', 'HK_DAMAGE_REPORT', 'MULTIPLE_CHOICE', 'B1', 'If you notice damage in room:', 'Fix it yourself', 'Report and document', 'Say nothing', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0009', 'HK_TURNDOWN', 'MULTIPLE_CHOICE', 'B1', 'Turndown service should be:', 'Loud and fast', 'Discreet and respectful', 'Only for VIPs always', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_QCM_0010', 'HK_MINIBAR_CHECK', 'MULTIPLE_CHOICE', 'B1', 'Minibar discrepancy:', 'Accuse the guest', 'Document and inform reception', 'Charge the guest directly', null, null, null, 'B')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0001', 'HK_ROOM_CLEAN', 'ORDER_SEQUENCE', 'A2', 'Put the cleaning steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0002', 'HK_LINEN_CHANGE', 'ORDER_SEQUENCE', 'A2', 'Put the linen change steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0003', 'HK_LOST_FOUND', 'ORDER_SEQUENCE', 'B1', 'Put Lost & Found steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0004', 'HK_MAINT_REQUEST', 'ORDER_SEQUENCE', 'B1', 'Put leak response steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0005', 'HK_TURNDOWN', 'ORDER_SEQUENCE', 'B1', 'Put turndown steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0006', 'HK_PUBLIC_AREAS', 'ORDER_SEQUENCE', 'A2', 'Put lobby spill response in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0007', 'HK_LAUNDRY_GUEST', 'ORDER_SEQUENCE', 'B1', 'Put laundry handling steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0008', 'HK_EXTRA_BED', 'ORDER_SEQUENCE', 'B1', 'Put extra bed steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0009', 'HK_VIP_SETUP', 'ORDER_SEQUENCE', 'B1', 'Put VIP room setup in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_ORD_0010', 'HK_DND', 'ORDER_SEQUENCE', 'B1', 'Put DND handling steps in order.', null, null, null, 'FREE', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0001', 'HK_ROOM_CLEAN', 'TRANSLATION_ACTIVE', 'A2', 'Translate to English: « Je vais nettoyer votre chambre maintenant. »', null, null, null, 'I will clean your room now.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0002', 'HK_AMENITIES', 'TRANSLATION_ACTIVE', 'A2', 'Translate to English: « Je peux vous apporter des serviettes supplémentaires. »', null, null, null, 'I can bring you extra towels.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0003', 'HK_DND', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Je respecterai le Do Not Disturb et repasserai plus tard. »', null, null, null, 'I will respect the Do Not Disturb sign and come back later.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0004', 'HK_LOST_FOUND', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Nous allons suivre la procédure objets trouvés. »', null, null, null, 'We will follow the Lost and Found procedure.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0005', 'HK_MAINT_REQUEST', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Je contacte la maintenance immédiatement. »', null, null, null, 'I will contact maintenance immediately.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0006', 'HK_TURNDOWN', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Souhaitez-vous le service couverture ce soir ? »', null, null, null, 'Would you like turndown service this evening?', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0007', 'HK_LAUNDRY_GUEST', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Je confirme le délai et je vous tiens informé(e). »', null, null, null, 'I will confirm the timeline and keep you updated.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0008', 'HK_PUBLIC_AREAS', 'TRANSLATION_ACTIVE', 'A2', 'Translate to English: « Attention, le sol est glissant. »', null, null, null, 'Careful, the floor is slippery.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0009', 'HK_EXTRA_BED', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Je peux installer un lit supplémentaire en {time} minutes. »', null, null, null, 'I can set up an extra bed within {time} minutes.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_TR_0010', 'HK_ODOR_SMELL', 'TRANSLATION_ACTIVE', 'B1', 'Translate to English: « Nous pouvons désodoriser la chambre ou vous proposer une autre chambre. »', null, null, null, 'We can deodorize the room or offer you another room.', null, null, 'FREE')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0001', 'HK_ROOM_CLEAN', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the correct meaning: ''Housekeeping. May I come in?''', 'Le ménage. Puis-je entrer ?', 'Je suis la réception.', 'Je viens pour le restaurant.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0002', 'HK_DND', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''I can leave the towels at your door.''', 'Je peux laisser les serviettes à votre porte.', 'Je peux entrer tout de suite.', 'Je reviens demain.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0003', 'HK_MAINT_REQUEST', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''For your safety, please avoid that area.''', 'Pour votre sécurité, évitez cette zone.', 'C’est une zone fumeur.', 'Vous pouvez courir ici.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0004', 'HK_LOST_FOUND', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''I will report this immediately.''', 'Je vais le signaler immédiatement.', 'Je vais ignorer.', 'Je ne peux rien faire.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0005', 'HK_TURNDOWN', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''Would you like turndown service this evening?''', 'Souhaitez-vous le service couverture ce soir ?', 'Voulez-vous un taxi ?', 'Voulez-vous changer de chambre ?', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0006', 'HK_LAUNDRY_GUEST', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''We can offer an express service.''', 'Nous pouvons proposer un service express.', 'Nous n’avons pas de service.', 'C’est gratuit.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0007', 'HK_PUBLIC_AREAS', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the correct meaning: ''Please watch your step.''', 'Attention où vous marchez.', 'Veuillez vous asseoir.', 'Bonne nuit.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0008', 'HK_EXTRA_BED', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''I will set it up within fifteen minutes.''', 'Je l’installe d’ici quinze minutes.', 'Je ne sais pas.', 'Je l’installe demain.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0009', 'HK_ODOR_SMELL', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct meaning: ''We can bring a purifier.''', 'Nous pouvons apporter un purificateur.', 'Nous apportons une pizza.', 'Nous fermons la chambre.', null, null, null, 'A')
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

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte)
values ('HK_LS_0010', 'HK_SUPPLIES', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the correct meaning: ''I will bring more water.''', 'Je vais apporter plus d’eau.', 'Je vais partir.', 'Je vais appeler un taxi.', null, null, null, 'A')
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


-- ORDER_SEQUENCE options


insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 1, 'Knock and announce')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 2, 'Enter and greet')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 3, 'Open curtains / lights')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 4, 'Make the bed')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 5, 'Clean bathroom')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0001', 6, 'Final check')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0002', 1, 'Remove used linen')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0002', 2, 'Check mattress protector')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0002', 3, 'Place clean sheets')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0002', 4, 'Make corners tight')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0002', 5, 'Replace pillowcases')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0003', 1, 'Do not touch unnecessarily')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0003', 2, 'Secure the item')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0003', 3, 'Record details')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0003', 4, 'Inform supervisor/reception')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0003', 5, 'Store in Lost & Found')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0004', 1, 'Warn guest for safety')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0004', 2, 'Place towels / sign')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0004', 3, 'Call maintenance')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0004', 4, 'Inform reception')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0004', 5, 'Follow up')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0005', 1, 'Knock and announce')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0005', 2, 'Dim lights')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0005', 3, 'Turn down bed')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0005', 4, 'Place water/amenities')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0005', 5, 'Leave note / close softly')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0006', 1, 'Secure area')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0006', 2, 'Place warning sign')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0006', 3, 'Clean spill')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0006', 4, 'Dry floor')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0006', 5, 'Remove sign when safe')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0007', 1, 'Receive items')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0007', 2, 'Label bag')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0007', 3, 'Confirm deadline')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0007', 4, 'Send to laundry')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0007', 5, 'Update guest')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0008', 1, 'Confirm request')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0008', 2, 'Check space/safety')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0008', 3, 'Deliver bed')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0008', 4, 'Set up linen')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0008', 5, 'Confirm comfort')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0009', 1, 'Check VIP list')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0009', 2, 'Prepare amenities')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0009', 3, 'Inspect room')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0009', 4, 'Final checklist')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0009', 5, 'Confirm to reception')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0010', 1, 'Respect DND')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0010', 2, 'Call/leave message')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0010', 3, 'Offer door-drop option')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0010', 4, 'Schedule time')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;
insert into quiz_options (quiz_id, position, option_text)
values ('HK_ORD_0010', 5, 'Note preference')
on conflict (quiz_id, position) do update set
  option_text = excluded.option_text;

commit;