begin;

-- Restaurant (Hôtel urbain) — 40 exercices premium (formats variés)
-- Types: MULTIPLE_CHOICE, ORDER_SEQUENCE, TRANSLATION_ACTIVE, LISTEN_AND_SELECT, LISTEN_AND_SPEAK
-- Règle: reponse_correcte='FREE' pour les exercices non-QCM (réponse attendue dans expected_answer)

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_01', 'FB_DELAY_APOLOGY', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (service delay).', null, null, null, 'I’m truly sorry for the wait. || I will check with the kitchen. || I will give you a reliable time estimate. || If needed, I can offer a faster alternative. || I will update you in {time} minutes.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_02', 'FB_ALLERGY_CHECK', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (allergy safety).', null, null, null, 'Do you have any food allergies? || Could you specify the allergy, please? || I will confirm ingredients with the kitchen. || We will avoid cross-contamination. || I will confirm with the chef before validating the order.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_03', 'FB_WRONG_ORDER', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (wrong order).', null, null, null, 'I understand, and please accept our apologies. || Could you remind me of your order, please? || I will fix this immediately. || I will prioritize your dish with the kitchen. || I will update you in {time} minutes.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_04', 'FB_COLD_FOOD_COMPLAINT', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (cold food).', null, null, null, 'I’m sorry to hear that. || Would you prefer a full replacement or a quick reheat? || I will inform the kitchen. || I will prioritize it and give you a clear time. || I can ask my manager for an appropriate adjustment after verification.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_05', 'FB_SPLIT_BILL', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct professional order (split bill).', null, null, null, 'Would you like to split the bill? || Into how many parts? || Could you tell me which items go on each bill? || I will show you the breakdown before payment. || Thank you for your patience.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_06', 'FB_TAKE_ORDER', 'ORDER_SEQUENCE', 'A2', 'Put the following sentences in the correct order (taking the order).', null, null, null, 'Are you ready to order? || What can I get for you? || And for you? || Would you like a starter? || Very well, I am taking note.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_07', 'FB_WINE_RECOMMENDATION', 'ORDER_SEQUENCE', 'B1', 'Put the following sentences in the correct order (wine recommendation).', null, null, null, 'Red, white, or rosé? || Do you have a budget for the bottle? || For {dish}, I recommend {wine}. || Within that budget, {wine} is excellent. || Would you like a bottle or a glass?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_ORDER_08', 'FB_BILL_REQUEST', 'ORDER_SEQUENCE', 'A2', 'Put the following sentences in the correct order (bill request).', null, null, null, 'Would you like the bill? || I will bring the bill right away. || Will you pay by card or cash? || Would you like a receipt? || Thank you.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_01', 'FB_PRESENT_MENU', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Voici notre menu du jour.', null, null, null, 'Here is our daily menu.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_02', 'FB_TAKE_ORDER', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Êtes-vous prêt(e) à commander ?', null, null, null, 'Are you ready to order?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_03', 'FB_CONFIRM_ORDER', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Je récapitule votre commande.', null, null, null, 'Let me confirm your order.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_04', 'FB_SPECIAL_REQUEST', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Je vérifie avec la cuisine.', null, null, null, 'I will check with the kitchen.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_05', 'FB_ALLERGY_CHECK', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Nous éviterons toute contamination croisée.', null, null, null, 'We will avoid any cross-contamination.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_06', 'FB_UPSELL_DRINKS', 'TRANSLATION_ACTIVE', 'A2', 'Translate into English: Souhaitez-vous un apéritif ?', null, null, null, 'Would you like an aperitif?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_07', 'FB_WINE_RECOMMENDATION', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Avez-vous un budget pour la bouteille ?', null, null, null, 'Do you have a budget for the bottle?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_08', 'FB_DELAY_APOLOGY', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Je vous donne une estimation fiable dans une minute.', null, null, null, 'I will give you a reliable time estimate in one minute.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_09', 'FB_WRONG_ORDER', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Je vais corriger cela immédiatement.', null, null, null, 'I will fix this immediately.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_10', 'FB_COLD_FOOD_COMPLAINT', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Préférez-vous un remplacement complet ?', null, null, null, 'Would you prefer a full replacement?', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_11', 'FB_SPLIT_BILL', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Je peux séparer par plats ou par personnes.', null, null, null, 'I can split by items or by guests.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_TRANS_12', 'FB_FEEDBACK_REQUEST', 'TRANSLATION_ACTIVE', 'B1', 'Translate into English: Merci de nous aider à améliorer notre service.', null, null, null, 'Thank you for helping us improve our service.', null, null, 'FREE')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_01', 'FB_GREET_GUEST', 'LISTEN_AND_SELECT', 'A1', 'You hear: “Good evening, welcome to the restaurant.” Choose the best French meaning.', 'Bonsoir, bienvenue au restaurant.', 'Bonjour, où est la réception ?', 'Merci, au revoir.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_02', 'FB_SEATING_GUEST', 'LISTEN_AND_SELECT', 'A2', 'You hear: “Would you like still or sparkling water?” Choose the best reply.', 'Sparkling water, please.', 'No onions, please.', 'Two separate bills, please.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_03', 'FB_TAKE_ORDER', 'LISTEN_AND_SELECT', 'A2', 'You hear: “Are you ready to order?” Choose the best reply.', 'Yes, I will have {dish}, please.', 'It’s taking a long time.', 'My card was declined.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_04', 'FB_ALLERGY_CHECK', 'LISTEN_AND_SELECT', 'B1', 'You hear: “Do you have any food allergies?” Choose the best reply.', 'I am allergic to peanuts.', 'I want a dessert.', 'I need the bill.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_05', 'FB_UPSELL_DRINKS', 'LISTEN_AND_SELECT', 'A2', 'You hear: “Would you like an aperitif?” Choose the best reply.', 'Nothing for now, thank you.', 'My food is cold.', 'Turn left.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_06', 'FB_WINE_RECOMMENDATION', 'LISTEN_AND_SELECT', 'B1', 'You hear: “Do you have a budget for the bottle?” Choose the best reply.', 'Around {amount} {currency}.', 'I’m locked out.', 'The elevator, please.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_07', 'FB_DELAY_APOLOGY', 'LISTEN_AND_SELECT', 'B1', 'You hear: “I will give you a reliable time estimate in one minute.” Choose the best French.', 'Je vous donne une estimation fiable dans une minute.', 'Je veux changer de chambre.', 'C’est inclus.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_08', 'FB_WRONG_ORDER', 'LISTEN_AND_SELECT', 'B1', 'You hear: “I will fix this immediately.” Choose the best French.', 'Je vais corriger cela immédiatement.', 'Je suis pressé(e).', 'Votre chambre est prête.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_09', 'FB_COLD_FOOD_COMPLAINT', 'LISTEN_AND_SELECT', 'B1', 'You hear: “Would you prefer a full replacement?” Choose the best French.', 'Préférez-vous un remplacement complet ?', 'Pouvez-vous appeler un taxi ?', 'Vous êtes en chambre 12.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_10', 'FB_BILL_REQUEST', 'LISTEN_AND_SELECT', 'A2', 'You hear: “Will that be by card or cash?” Choose the best reply.', 'By card, please.', 'I want to speak to a manager.', 'No salt, please.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_11', 'FB_SPLIT_BILL', 'LISTEN_AND_SELECT', 'B1', 'You hear: “I can split by items or by guests.” Choose the best French.', 'Je peux séparer par plats ou par personnes.', 'Je peux garder vos bagages.', 'Je peux vous surclasser.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_LISTEN_12', 'FB_FEEDBACK_REQUEST', 'LISTEN_AND_SELECT', 'B1', 'You hear: “Is there anything we can improve?” Choose the best reply.', 'The service was a bit slow.', 'I need towels.', 'Room 205.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_01', 'FB_ALLERGY_CHECK', 'MULTIPLE_CHOICE', 'B1', 'Guest mentions peanuts allergy. Best next step?', 'Confirm the allergy details and check ingredients with the kitchen.', 'Say “It will be fine” and take the order.', 'Recommend the spiciest dish.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_02', 'FB_DELAY_APOLOGY', 'MULTIPLE_CHOICE', 'B1', 'Guests are in a hurry. Best response?', 'Apologize, provide a reliable estimate, and offer a faster alternative if needed.', 'Ignore them until the dish is ready.', 'Tell them it’s not your problem.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_03', 'FB_WRONG_ORDER', 'MULTIPLE_CHOICE', 'B1', 'Wrong order delivered. Best action?', 'Apologize, correct immediately, prioritize remake, and update timing.', 'Argue that the kitchen is busy.', 'Tell the guest to eat it anyway.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_04', 'FB_SPLIT_BILL', 'MULTIPLE_CHOICE', 'B1', 'Split bill request. Best question?', 'Do you want to split by items or by guests?', 'Why are you splitting?', 'Can’t you pay together?', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_05', 'FB_UPSELL_DRINKS', 'MULTIPLE_CHOICE', 'A2', 'Soft upsell for drinks. Best line?', 'Would you like an aperitif? We have a signature cocktail.', 'You must buy a drink.', 'No drinks available.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_06', 'FB_WINE_RECOMMENDATION', 'MULTIPLE_CHOICE', 'B1', 'Wine suggestion. Best qualifying question?', 'Do you have a budget for the bottle?', 'What is your passport number?', 'Do you want towels?', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_07', 'FB_BILL_REQUEST', 'MULTIPLE_CHOICE', 'A2', 'Bill request. Best sequence?', 'Bring bill, confirm payment method, offer receipt.', 'Ask for ID first.', 'Ask them to go to reception.', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;

insert into quiz (id, action_id, type_quiz, niveau, question, option_a, option_b, option_c, expected_answer, audio_url, phrase_id, reponse_correcte) values ('RST_QCM_08', 'FB_FEEDBACK_REQUEST', 'MULTIPLE_CHOICE', 'A2', 'End of meal feedback. Best question?', 'Was everything alright?', 'Why were you unhappy?', 'Did you take from the minibar?', null, null, null, 'A')
on conflict (id) do update set action_id=excluded.action_id, type_quiz=excluded.type_quiz, niveau=excluded.niveau, question=excluded.question, option_a=excluded.option_a, option_b=excluded.option_b, option_c=excluded.option_c, expected_answer=excluded.expected_answer, audio_url=excluded.audio_url, phrase_id=excluded.phrase_id, reponse_correcte=excluded.reponse_correcte;


-- Quiz options (used for ORDER_SEQUENCE)

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_01', 1, 'I’m truly sorry for the wait.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_01', 2, 'I will check with the kitchen.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_01', 3, 'I will give you a reliable time estimate.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_01', 4, 'If needed, I can offer a faster alternative.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_01', 5, 'I will update you in {time} minutes.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_02', 1, 'Do you have any food allergies?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_02', 2, 'Could you specify the allergy, please?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_02', 3, 'I will confirm ingredients with the kitchen.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_02', 4, 'We will avoid cross-contamination.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_02', 5, 'I will confirm with the chef before validating the order.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_03', 1, 'I understand, and please accept our apologies.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_03', 2, 'Could you remind me of your order, please?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_03', 3, 'I will fix this immediately.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_03', 4, 'I will prioritize your dish with the kitchen.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_03', 5, 'I will update you in {time} minutes.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_04', 1, 'I’m sorry to hear that.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_04', 2, 'Would you prefer a full replacement or a quick reheat?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_04', 3, 'I will inform the kitchen.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_04', 4, 'I will prioritize it and give you a clear time.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_04', 5, 'I can ask my manager for an appropriate adjustment after verification.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_05', 1, 'Would you like to split the bill?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_05', 2, 'Into how many parts?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_05', 3, 'Could you tell me which items go on each bill?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_05', 4, 'I will show you the breakdown before payment.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_05', 5, 'Thank you for your patience.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_06', 1, 'Are you ready to order?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_06', 2, 'What can I get for you?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_06', 3, 'And for you?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_06', 4, 'Would you like a starter?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_06', 5, 'Very well, I am taking note.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_07', 1, 'Red, white, or rosé?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_07', 2, 'Do you have a budget for the bottle?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_07', 3, 'For {dish}, I recommend {wine}.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_07', 4, 'Within that budget, {wine} is excellent.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_07', 5, 'Would you like a bottle or a glass?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_08', 1, 'Would you like the bill?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_08', 2, 'I will bring the bill right away.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_08', 3, 'Will you pay by card or cash?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_08', 4, 'Would you like a receipt?') on conflict (quiz_id, position) do update set option_text=excluded.option_text;

insert into quiz_options (quiz_id, position, option_text) values ('RST_ORDER_08', 5, 'Thank you.') on conflict (quiz_id, position) do update set option_text=excluded.option_text;


commit;