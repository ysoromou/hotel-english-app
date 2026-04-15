begin;

-- =====================================================

-- Réception 4★ — 40 exercices premium (formats variés)

-- Types: MULTIPLE_CHOICE, ORDER_SEQUENCE, TRANSLATION_ACTIVE, LISTEN_AND_SELECT, LISTEN_AND_SPEAK

-- Règle: reponse_correcte='FREE' pour les exercices non-QCM (réponse attendue dans expected_answer)

-- =====================================================


insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_01', 'REC_PROB_BILL', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (billing dispute).', null, null, null, 'I understand your concern. || Please accept our apologies for the inconvenience. || I will temporarily remove the charge pending verification. || I will document this in the system. || I will follow up today.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_02', 'REC_PROB_NOISE', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (noise complaint at night).', null, null, null, 'I am truly sorry for the disturbance. || I will address this immediately. || I will contact the room concerned and send security to the floor. || If it does not stop, we can move you to a quieter room. || I will update you shortly.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_03', 'REC_PROB_CLEAN', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (room cleanliness issue).', null, null, null, 'I am truly sorry to hear that. || This is not up to our standards. || I will send Housekeeping immediately. || We can offer a room change if available. || I will update you within {time} minutes.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_04', 'REC_CI_EARLY', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (early arrival (room not ready)).', null, null, null, 'I understand, and I''''m sorry for the inconvenience. || Check-in time is normally at {time}. || We can store your luggage securely. || You are welcome to use the lobby or the fitness area showers. || We will contact you as soon as the room is ready.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_05', 'REC_PROB_KEY', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (locked out (no ID)).', null, null, null, 'For your security, I need to verify your identity. || Could you confirm your full name and check-out date, please? || Thank you. I will escort you to the room. || I will issue a new key card immediately. || I will have the lock checked.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_06', 'REC_CO_LATE', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (late check-out refusal).', null, null, null, 'I understand your request. || Unfortunately, we are unable to extend a late check-out today due to full occupancy. || We can store your luggage securely. || You are welcome to use the lobby area. || I will check if we can arrange access to a changing area and update you shortly.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_07', 'REC_SERV_MAINTENANCE', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (urgent technical issue).', null, null, null, 'I am sorry to hear that. || Could you describe the issue, please? || I will send a technician immediately. || In the meantime, we can provide a temporary alternative solution. || I will update you within {time} minutes.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_ORDER_08', 'REC_PROB_MISSING', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (missing passport).', null, null, null, 'I understand your concern, and I''''m sorry for the stress. || Could you tell me where you last saw it? || I will alert security and Housekeeping immediately. || We will start the search right away. || If needed, we can help you contact the authorities and your embassy.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_01', 'REC_CI_STANDARD', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Votre chambre est au {floor}e étage, sur la droite.', null, null, null, 'Your room is on the {floor}th floor, on the right.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_02', 'REC_CI_ADMIN', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Nous allons effectuer une préautorisation de {amount} {currency}.', null, null, null, 'We will place a pre-authorization of {amount} {currency}.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_03', 'REC_INFO_DIRECTIONS', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: C''''est à environ {time} minutes à pied.', null, null, null, 'It is about a {time}-minute walk.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_04', 'REC_SERV_BOOKING', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Je vous confirme dès que la réservation est validée.', null, null, null, 'I will confirm as soon as the reservation is confirmed.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_05', 'REC_SERV_WAKEUP', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: C''''est noté pour {time}.', null, null, null, 'Noted for {time}.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_06', 'REC_CO_INVOICE', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Je peux séparer l''''hébergement et les extras.', null, null, null, 'I can separate accommodation and extras.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_07', 'REC_CO_STANDARD', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Souhaitez-vous que je vous envoie la facture par email ?', null, null, null, 'Would you like me to email you the invoice?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_TRANS_08', 'REC_PROB_NOISE', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Nous pouvons vous proposer une chambre plus calme.', null, null, null, 'We can offer you a quieter room.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_01', 'REC_CI_STANDARD', 'LISTEN_AND_SELECT', 'A1', 'Listen and choose the correct phrase.', 'May I have your name, please?', 'Breakfast is served from 7 to 10.', 'I will send a technician immediately.', null, 'audio/reception/ci_standard_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_02', 'REC_CI_ADMIN', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the best response.', 'May I have a credit card for the guarantee, please?', 'The spa is closed today.', 'Turn left when you exit the hotel.', null, 'audio/reception/ci_admin_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_03', 'REC_INFO_FACILITIES', 'LISTEN_AND_SELECT', 'A2', 'Listen and select the correct information.', 'The gym is accessible with your key card.', 'I will remove the charge.', 'We are fully booked.', null, 'audio/reception/info_facilities_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_04', 'REC_INFO_DIRECTIONS', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the correct answer.', 'I can show you on the map.', 'Please fill out this form.', 'I will escalate to the manager.', null, 'audio/reception/info_directions_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_05', 'REC_SERV_MAINTENANCE', 'LISTEN_AND_SELECT', 'A2', 'Listen and choose the correct reply.', 'I will send a technician immediately.', 'The restaurant is on the first floor.', 'Would you like twin beds?', null, 'audio/reception/maintenance_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_06', 'REC_PROB_BILL', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the safest policy-compliant response.', 'I will temporarily remove the charge pending verification.', 'I will remove the charge now.', 'It''''s not possible to check.', null, 'audio/reception/prob_bill_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_07', 'REC_PROB_KEY', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the correct security response.', 'For your security, may I verify your identity?', 'Here is the menu.', 'Your taxi is waiting.', null, 'audio/reception/prob_key_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSEL_08', 'REC_CO_LATE', 'LISTEN_AND_SELECT', 'B1', 'Listen and choose the best soft refusal.', 'Unfortunately, we are unable to extend a late check-out today due to full occupancy.', 'No, impossible.', 'That''''s not my problem.', null, 'audio/reception/co_late_01.mp3', null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_01', 'REC_CI_UPGRADE', 'LISTEN_AND_SPEAK', 'B1', 'Listen and repeat the sentence.', null, null, null, 'Would you be interested in an upgrade for your stay?', 'audio/reception/upgrade_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_02', 'REC_CI_WALKIN', 'LISTEN_AND_SPEAK', 'A2', 'Listen and repeat the sentence.', null, null, null, 'Tonight''''s rate is {amount} {currency}, excluding breakfast.', 'audio/reception/walkin_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_03', 'REC_PROB_CLEAN', 'LISTEN_AND_SPEAK', 'B1', 'Listen and repeat the sentence.', null, null, null, 'I will send Housekeeping immediately and have the room checked.', 'audio/reception/prob_clean_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_04', 'REC_PROB_NOISE', 'LISTEN_AND_SPEAK', 'B1', 'Listen and repeat the sentence.', null, null, null, 'I will address this immediately and send security to the floor.', 'audio/reception/prob_noise_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_05', 'REC_PROB_MISSING', 'LISTEN_AND_SPEAK', 'B1', 'Listen and repeat the sentence.', null, null, null, 'I will alert security and Housekeeping immediately and start the search.', 'audio/reception/prob_missing_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_06', 'REC_CO_INVOICE', 'LISTEN_AND_SPEAK', 'B1', 'Listen and repeat the sentence.', null, null, null, 'Would you like one invoice or separate invoices?', 'audio/reception/co_invoice_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_07', 'REC_CO_STANDARD', 'LISTEN_AND_SPEAK', 'A2', 'Listen and repeat the sentence.', null, null, null, 'Will that be by card or cash?', 'audio/reception/co_standard_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_LSPEAK_08', 'REC_SERV_BOOKING', 'LISTEN_AND_SPEAK', 'A2', 'Listen and repeat the sentence.', null, null, null, 'What time would you like to dine?', 'audio/reception/booking_01.mp3', null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_01', 'REC_CI_STANDARD', 'MULTIPLE_CHOICE', 'A2', 'A guest arrives and you cannot find the reservation. What is the best next step?', 'One moment, please. I will check the system again.', 'You didn''''t book with us.', 'Go away.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_02', 'REC_CI_ADMIN', 'MULTIPLE_CHOICE', 'B1', 'Guest says: ''The room is prepaid. Why do you need my card?'' Best response?', 'This is only a pre-authorization for incidental charges.', 'Because it''''s mandatory, no discussion.', 'I don''''t know.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_03', 'REC_CI_WALKIN', 'MULTIPLE_CHOICE', 'B1', 'Walk-in asks for a discount on the last room. Best response?', 'The best available rate tonight is {amount} {currency}. I can offer options depending on your needs.', 'Yes, any price you want.', 'No discounts, ever.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_04', 'REC_SERV_MAINTENANCE', 'MULTIPLE_CHOICE', 'B1', 'Guest: ''It''''s urgent, I need a solution right away.'' Best response?', 'I understand. I will send a technician immediately and offer a temporary alternative while we fix it.', 'Please wait.', 'Not possible.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_05', 'REC_PROB_BILL', 'MULTIPLE_CHOICE', 'B1', 'Guest disputes minibar and is in a hurry. Best response?', 'I will temporarily remove the charge pending verification so you can leave on time, and I will follow up today.', 'Pay first, we''''ll see later.', 'It''''s on the bill, so you pay.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_06', 'REC_PROB_KEY', 'MULTIPLE_CHOICE', 'B1', 'Guest locked out without ID at 1 a.m. Best response?', 'For your security, I need to verify your identity with your details and escort you to the room.', 'I will open any room.', 'Come back tomorrow.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_07', 'REC_CO_LATE', 'MULTIPLE_CHOICE', 'B1', 'Hotel is full; guest wants 6 PM late check-out. Best response?', 'While I understand, we cannot extend today due to full occupancy. We can store luggage and arrange a changing area.', 'No.', 'You should have asked earlier.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('REC_QCM_08', 'REC_CO_FEEDBACK', 'MULTIPLE_CHOICE', 'A2', 'At check-out, you want feedback. Best question?', 'Is there anything we could have improved?', 'Did you like the minibar?', 'Why were you unhappy?', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;


-- Quiz options (used for ORDER_SEQUENCE with 4–6 items)

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_01', 1, 'I will follow up today.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_01', 2, 'I understand your concern.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_01', 3, 'I will document this in the system.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_01', 4, 'I will temporarily remove the charge pending verification.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_01', 5, 'Please accept our apologies for the inconvenience.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_02', 1, 'If it does not stop, we can move you to a quieter room.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_02', 2, 'I will contact the room concerned and send security to the floor.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_02', 3, 'I will update you shortly.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_02', 4, 'I am truly sorry for the disturbance.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_02', 5, 'I will address this immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_03', 1, 'I will send Housekeeping immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_03', 2, 'I am truly sorry to hear that.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_03', 3, 'This is not up to our standards.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_03', 4, 'We can offer a room change if available.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_03', 5, 'I will update you within {time} minutes.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_04', 1, 'You are welcome to use the lobby or the fitness area showers.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_04', 2, 'I understand, and I''''m sorry for the inconvenience.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_04', 3, 'Check-in time is normally at {time}.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_04', 4, 'We will contact you as soon as the room is ready.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_04', 5, 'We can store your luggage securely.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_05', 1, 'For your security, I need to verify your identity.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_05', 2, 'Could you confirm your full name and check-out date, please?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_05', 3, 'I will issue a new key card immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_05', 4, 'I will have the lock checked.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_05', 5, 'Thank you. I will escort you to the room.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_06', 1, 'We can store your luggage securely.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_06', 2, 'I will check if we can arrange access to a changing area and update you shortly.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_06', 3, 'I understand your request.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_06', 4, 'You are welcome to use the lobby area.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_06', 5, 'Unfortunately, we are unable to extend a late check-out today due to full occupancy.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_07', 1, 'I will send a technician immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_07', 2, 'Could you describe the issue, please?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_07', 3, 'I am sorry to hear that.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_07', 4, 'In the meantime, we can provide a temporary alternative solution.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_07', 5, 'I will update you within {time} minutes.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_08', 1, 'I understand your concern, and I''''m sorry for the stress.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_08', 2, 'We will start the search right away.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_08', 3, 'If needed, we can help you contact the authorities and your embassy.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_08', 4, 'I will alert security and Housekeeping immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('REC_ORDER_08', 5, 'Could you tell me where you last saw it?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;


commit;