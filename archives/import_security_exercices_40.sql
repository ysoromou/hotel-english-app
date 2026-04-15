begin;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ACCESS_CONTROL_01', 'SEC_ACCESS_CONTROL', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Contrôle d''accès / entrée.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ACCESS_CONTROL_02', 'SEC_ACCESS_CONTROL', 'MCQ_POLICY', 'A2', 'Policy check: Contrôle d''accès / entrée. What should you do first?', 'Verify identity/access before granting entry or issuing a new key.', 'Grant access immediately to avoid complaints.', 'Ask the guest to break the door.', 'A', 'Security procedure protects guests and hotel.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ID_VERIFICATION_01', 'SEC_ID_VERIFICATION', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Vérification d''identité.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ID_VERIFICATION_02', 'SEC_ID_VERIFICATION', 'MCQ_POLICY', 'A2', 'Policy check: Vérification d''identité. What should you do first?', 'Verify identity/access before granting entry or issuing a new key.', 'Grant access immediately to avoid complaints.', 'Ask the guest to break the door.', 'A', 'Security procedure protects guests and hotel.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ROOM_ESCORT_01', 'SEC_ROOM_ESCORT', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Escorter un client.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_ROOM_ESCORT_02', 'SEC_ROOM_ESCORT', 'MCQ_POLICY', 'A2', 'Policy check: Escorter un client. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_NOISE_COMPLAINT_01', 'SEC_NOISE_COMPLAINT', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Plainte de bruit / fête.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_NOISE_COMPLAINT_02', 'SEC_NOISE_COMPLAINT', 'MCQ_POLICY', 'B1', 'Policy check: Plainte de bruit / fête. What should you do first?', 'Apologize, intervene immediately, and follow up with the guest.', 'Argue with the noisy guests.', 'Do nothing.', 'A', 'Service recovery + action + follow-up.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_SUSPICIOUS_PERSON_01', 'SEC_SUSPICIOUS_PERSON', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Personne suspecte.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_SUSPICIOUS_PERSON_02', 'SEC_SUSPICIOUS_PERSON', 'MCQ_POLICY', 'B1', 'Policy check: Personne suspecte. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_THEFT_REPORT_01', 'SEC_THEFT_REPORT', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Déclaration de vol.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_THEFT_REPORT_02', 'SEC_THEFT_REPORT', 'MCQ_POLICY', 'B1', 'Policy check: Déclaration de vol. What should you do first?', 'Collect key facts (time/place), open a report, and inform the duty manager.', 'Show CCTV footage to the guest immediately.', 'Ignore it until morning.', 'A', 'Start with facts + report + escalation; CCTV access is restricted.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_LOST_FOUND_01', 'SEC_LOST_FOUND', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Objets trouvés / perdus.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_LOST_FOUND_02', 'SEC_LOST_FOUND', 'MCQ_POLICY', 'A2', 'Policy check: Objets trouvés / perdus. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_EMERGENCY_MEDICAL_01', 'SEC_EMERGENCY_MEDICAL', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Urgence médicale.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_EMERGENCY_MEDICAL_02', 'SEC_EMERGENCY_MEDICAL', 'MCQ_POLICY', 'B1', 'Policy check: Urgence médicale. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_FIRE_ALARM_01', 'SEC_FIRE_ALARM', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Alarme incendie.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_FIRE_ALARM_02', 'SEC_FIRE_ALARM', 'MCQ_POLICY', 'B1', 'Policy check: Alarme incendie. What should you do first?', 'Guide guests to stairs and the assembly point; keep communication calm.', 'Use the elevator to evacuate faster.', 'Let guests decide on their own.', 'A', 'Stairs + guidance + calm instructions.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_EVACUATION_01', 'SEC_EVACUATION', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Évacuation / point de rassemblement.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_EVACUATION_02', 'SEC_EVACUATION', 'MCQ_POLICY', 'B1', 'Policy check: Évacuation / point de rassemblement. What should you do first?', 'Guide guests to stairs and the assembly point; keep communication calm.', 'Use the elevator to evacuate faster.', 'Let guests decide on their own.', 'A', 'Stairs + guidance + calm instructions.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CROWD_CONTROL_01', 'SEC_CROWD_CONTROL', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Gestion de foule / événement.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CROWD_CONTROL_02', 'SEC_CROWD_CONTROL', 'MCQ_POLICY', 'B1', 'Policy check: Gestion de foule / événement. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_PARKING_ASSIST_01', 'SEC_PARKING_ASSIST', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Assistance parking / circulation.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_PARKING_ASSIST_02', 'SEC_PARKING_ASSIST', 'MCQ_POLICY', 'A2', 'Policy check: Assistance parking / circulation. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_KEY_CONTROL_01', 'SEC_KEY_CONTROL', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Contrôle des clés / cartes.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_KEY_CONTROL_02', 'SEC_KEY_CONTROL', 'MCQ_POLICY', 'B1', 'Policy check: Contrôle des clés / cartes. What should you do first?', 'Verify identity/access before granting entry or issuing a new key.', 'Grant access immediately to avoid complaints.', 'Ask the guest to break the door.', 'A', 'Security procedure protects guests and hotel.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_INCIDENT_REPORT_01', 'SEC_INCIDENT_REPORT', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Rapport d''incident.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_INCIDENT_REPORT_02', 'SEC_INCIDENT_REPORT', 'MCQ_POLICY', 'A2', 'Policy check: Rapport d''incident. What should you do first?', 'Collect key facts (time/place), open a report, and inform the duty manager.', 'Show CCTV footage to the guest immediately.', 'Ignore it until morning.', 'A', 'Start with facts + report + escalation; CCTV access is restricted.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CONFLICT_DEESCALATION_01', 'SEC_CONFLICT_DEESCALATION', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Désescalade de conflit.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CONFLICT_DEESCALATION_02', 'SEC_CONFLICT_DEESCALATION', 'MCQ_POLICY', 'B1', 'Policy check: Désescalade de conflit. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_VIP_PROTECTION_01', 'SEC_VIP_PROTECTION', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Dispositif VIP / discrétion.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_VIP_PROTECTION_02', 'SEC_VIP_PROTECTION', 'MCQ_POLICY', 'A2', 'Policy check: Dispositif VIP / discrétion. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_VENDOR_ACCESS_01', 'SEC_VENDOR_ACCESS', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Accès fournisseurs / livraisons.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_VENDOR_ACCESS_02', 'SEC_VENDOR_ACCESS', 'MCQ_POLICY', 'A2', 'Policy check: Accès fournisseurs / livraisons. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CCTV_REQUEST_01', 'SEC_CCTV_REQUEST', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Demande CCTV / confidentialité.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CCTV_REQUEST_02', 'SEC_CCTV_REQUEST', 'MCQ_POLICY', 'B1', 'Policy check: Demande CCTV / confidentialité. What should you do first?', 'Collect key facts (time/place), open a report, and inform the duty manager.', 'Show CCTV footage to the guest immediately.', 'Ignore it until morning.', 'A', 'Start with facts + report + escalation; CCTV access is restricted.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CHILD_SAFETY_01', 'SEC_CHILD_SAFETY', 'MCQ_TONE', 'B1', 'Choose the best professional response for: Enfant perdu / sécurité.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_CHILD_SAFETY_02', 'SEC_CHILD_SAFETY', 'MCQ_POLICY', 'B1', 'Policy check: Enfant perdu / sécurité. What should you do first?', 'Collect description, secure exits, alert team, and search key areas.', 'Ask the parent to search alone.', 'Post on social media.', 'A', 'Immediate structured response + exit control.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_NIGHT_PATROL_01', 'SEC_NIGHT_PATROL', 'MCQ_TONE', 'A2', 'Choose the best professional response for: Ronde de nuit.', 'I understand. Let me assist you right away, for your safety.', 'That’s not my problem. Go away.', 'Wait there. Don’t talk.', 'A', 'In 4★ service, stay calm, helpful, and safety-focused.', 'PREMIUM', 'security,tone', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, reponse_correcte, explication, premium_tier, tags, source_phrase_ids)
values ('QZ_SEC_NIGHT_PATROL_02', 'SEC_NIGHT_PATROL', 'MCQ_POLICY', 'A2', 'Policy check: Ronde de nuit. What should you do first?', 'Ensure safety first, then follow the standard procedure and inform the desk if needed.', 'Take action without telling anyone.', 'Blame the guest.', 'A', 'Safety + procedure + coordination.', 'PREMIUM', 'security,policy', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_quiz = excluded.type_quiz,
  niveau = excluded.niveau,
  question = excluded.question,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  reponse_correcte = excluded.reponse_correcte,
  explication = excluded.explication,
  premium_tier = excluded.premium_tier,
  tags = excluded.tags,
  source_phrase_ids = excluded.source_phrase_ids;

commit;