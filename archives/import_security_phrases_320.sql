begin;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_01', 'SEC_ACCESS_CONTROL', 'Bonsoir. Puis-je vérifier votre accès, s’il vous plaît ?', 'Good evening. May I check your access, please?', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_02', 'SEC_ACCESS_CONTROL', 'Je vais aux chambres. Laissez-moi passer.', 'I’m going to the rooms. Let me pass.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_03', 'SEC_ACCESS_CONTROL', 'Merci. Pour la sécurité, cette zone est réservée aux clients.', 'Thank you. For security, access to this area is for guests only.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_04', 'SEC_ACCESS_CONTROL', 'Pouvez-vous me montrer votre carte de chambre ou le nom de la réservation ?', 'Could you please show your room key card or reservation name?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_05', 'SEC_ACCESS_CONTROL', 'Je ne l’ai pas sur moi.', 'I don’t have it with me.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_06', 'SEC_ACCESS_CONTROL', 'Pas de souci. Je peux vous accompagner à la réception pour vérifier.', 'No problem. I can accompany you to the front desk to verify.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_07', 'SEC_ACCESS_CONTROL', 'Merci de votre compréhension. Nous appliquons la même règle à tous.', 'Thank you for understanding. We apply the same rule for everyone.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_08', 'SEC_ACCESS_CONTROL', 'Je suis pressé(e).', 'I’m in a hurry.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_09', 'SEC_ACCESS_CONTROL', 'Je comprends. Cela prendra moins d’une minute.', 'I understand. This will take less than a minute.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_10', 'SEC_ACCESS_CONTROL', 'Veuillez utiliser cette entrée ; elle est plus sûre et surveillée.', 'Please use this entrance; it is safer and monitored.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_11', 'SEC_ACCESS_CONTROL', 'Si vous avez des visiteurs, nous pouvons les enregistrer à la réception.', 'If you have visitors, we can register them at the front desk.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_12', 'SEC_ACCESS_CONTROL', 'Mon ami m’attend à l’intérieur.', 'My friend is waiting inside.', 'APOLOGY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_13', 'SEC_ACCESS_CONTROL', 'Je peux appeler le client pour confirmer, puis je vous laisse entrer.', 'I can call the guest to confirm, then I’ll let you in.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_14', 'SEC_ACCESS_CONTROL', 'Merci. Restez avec moi le temps de confirmer.', 'Thank you. Please stay with me while we confirm.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_15', 'SEC_ACCESS_CONTROL', 'Tout est confirmé. Bienvenue, et excellente soirée.', 'Everything is confirmed. Welcome in, and have a pleasant evening.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ACCESS_CONTROL_16', 'SEC_ACCESS_CONTROL', 'Merci.', 'Thank you.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_01', 'SEC_ID_VERIFICATION', 'Pour votre sécurité, puis-je vérifier votre identité, s’il vous plaît ?', 'For your security, may I verify your identity, please?', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_02', 'SEC_ID_VERIFICATION', 'Pourquoi vous avez besoin de ma pièce ?', 'Why do you need my ID?', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_03', 'SEC_ID_VERIFICATION', 'C’est une procédure standard pour protéger les clients et les chambres.', 'It is a standard procedure to protect guests and rooms.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_04', 'SEC_ID_VERIFICATION', 'Pouvez-vous confirmer votre nom complet et votre numéro de chambre ?', 'Could you confirm your full name and room number?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_05', 'SEC_ID_VERIFICATION', 'Je ne me rappelle pas du numéro de chambre.', 'I don’t remember the room number.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_06', 'SEC_ID_VERIFICATION', 'Pas de souci. Quelle est votre date de départ ?', 'No worries. What is your check-out date?', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_07', 'SEC_ID_VERIFICATION', 'Merci. Je vérifie dans le système et je vous confirme tout de suite.', 'Thank you. I will check the system and confirm in a moment.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_08', 'SEC_ID_VERIFICATION', 'J’ai laissé mon passeport dans la chambre.', 'I left my passport in the room.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_09', 'SEC_ID_VERIFICATION', 'Compris. Je peux vous escorter jusqu’à la chambre après vérification.', 'Understood. I can escort you to the room after verification.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_10', 'SEC_ID_VERIFICATION', 'Avez-vous une photo de votre pièce sur votre téléphone ?', 'Do you have a photo of your ID on your phone?', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_11', 'SEC_ID_VERIFICATION', 'Oui, la voici.', 'Yes, here.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_12', 'SEC_ID_VERIFICATION', 'Merci. Ça aide. Je confirme quand même dans le système.', 'Thank you. That helps. I will still confirm in the system.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_13', 'SEC_ID_VERIFICATION', 'Tout correspond. Merci pour votre patience.', 'Everything matches. Thank you for your patience.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_14', 'SEC_ID_VERIFICATION', 'Si quelque chose change, prévenez la réception immédiatement.', 'If anything changes, please let the front desk know immediately.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_15', 'SEC_ID_VERIFICATION', 'D’accord.', 'Okay.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ID_VERIFICATION_16', 'SEC_ID_VERIFICATION', 'Merci, et bon séjour.', 'Thank you, and enjoy your stay.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_01', 'SEC_ROOM_ESCORT', 'Bien sûr. Je vais vous accompagner à votre chambre.', 'Of course. I will accompany you to your room.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_02', 'SEC_ROOM_ESCORT', 'Merci. Je me sens plus en sécurité.', 'Thank you. I feel safer.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_03', 'SEC_ROOM_ESCORT', 'Restez près de moi, s’il vous plaît, et attention aux marches.', 'Please stay close to me, and watch your step.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_04', 'SEC_ROOM_ESCORT', 'Puis-je porter votre sac ?', 'May I carry your bag?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_05', 'SEC_ROOM_ESCORT', 'Oui, s’il vous plaît.', 'Yes, please.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_06', 'SEC_ROOM_ESCORT', 'Votre chambre est de ce côté. Nous allons prendre l’ascenseur.', 'Your room is on this side. We will take the elevator.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_07', 'SEC_ROOM_ESCORT', 'Si vous avez besoin de quoi que ce soit la nuit, vous pouvez appeler la réception.', 'If you need anything during the night, you can call the desk.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_08', 'SEC_ROOM_ESCORT', 'Il y avait quelqu’un dans le couloir.', 'There was someone in the hallway.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_09', 'SEC_ROOM_ESCORT', 'Merci de me l’avoir dit. Je vais contrôler l’étage immédiatement.', 'Thank you for telling me. I will check the floor right away.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_10', 'SEC_ROOM_ESCORT', 'Nous y voilà. Souhaitez-vous que j’ouvre la porte ?', 'Here we are. May I open the door for you?', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_11', 'SEC_ROOM_ESCORT', 'Oui.', 'Yes.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_12', 'SEC_ROOM_ESCORT', 'Vérifiez vos effets personnels. Tout a l’air en ordre.', 'Please verify your belongings. Everything looks fine.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_13', 'SEC_ROOM_ESCORT', 'Je reste à proximité un instant, au cas où.', 'I will remain nearby for a moment, just in case.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_14', 'SEC_ROOM_ESCORT', 'C’est bon, merci.', 'All good, thanks.', 'OPTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_15', 'SEC_ROOM_ESCORT', 'Avec plaisir. Passez une nuit paisible.', 'My pleasure. Have a peaceful night.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_ROOM_ESCORT_16', 'SEC_ROOM_ESCORT', 'Si vous remarquez quelque chose d’inhabituel, appelez-nous immédiatement.', 'If you notice anything unusual, please call us immediately.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_01', 'SEC_NOISE_COMPLAINT', 'Il y a de la musique forte à côté. Je n’arrive pas à dormir.', 'There is loud music next door. I can’t sleep.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_02', 'SEC_NOISE_COMPLAINT', 'Je suis vraiment désolé(e) pour la gêne. Je m’en occupe immédiatement.', 'I’m truly sorry for the disturbance. I will handle this right away.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_03', 'SEC_NOISE_COMPLAINT', 'Puis-je confirmer votre numéro de chambre, s’il vous plaît ?', 'May I confirm your room number, please?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_04', 'SEC_NOISE_COMPLAINT', 'Chambre {room}.', 'Room {room}.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_05', 'SEC_NOISE_COMPLAINT', 'Merci. Je monte tout de suite et je parle aux clients.', 'Thank you. I will go to the floor now and speak to the guests.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_06', 'SEC_NOISE_COMPLAINT', 'Pour le confort de tous, le calme s’applique à partir de {time_start}.', 'For everyone’s comfort, quiet hours apply from {time_start}.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_07', 'SEC_NOISE_COMPLAINT', 'Ils n’écouteront pas.', 'They won’t listen.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_08', 'SEC_NOISE_COMPLAINT', 'Si ça continue, nous prendrons des mesures plus fermes et informerons la direction.', 'If it continues, we will take stronger action and involve management.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_09', 'SEC_NOISE_COMPLAINT', 'Si vous préférez, nous pouvons aussi vous déplacer dans une chambre plus calme.', 'If you prefer, we can also move you to a quieter room.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_10', 'SEC_NOISE_COMPLAINT', 'Oui, s’il vous plaît.', 'Yes, please.', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_11', 'SEC_NOISE_COMPLAINT', 'Je comprends. Je vérifie la disponibilité et je vous rappelle dans {time} minutes.', 'I understand. Let me check availability and call you back in {time} minutes.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_12', 'SEC_NOISE_COMPLAINT', 'Merci pour votre patience. Nous vous remercions de votre compréhension.', 'Thank you for your patience. We appreciate your understanding.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_13', 'SEC_NOISE_COMPLAINT', 'Je suis très énervé(e).', 'I’m very upset.', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_14', 'SEC_NOISE_COMPLAINT', 'Je comprends. Votre repos compte pour nous, et nous allons régler cela.', 'I understand. Your rest matters to us, and we will resolve it.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_15', 'SEC_NOISE_COMPLAINT', 'Nous avons traité le bruit. Dites-nous si cela se reproduit.', 'We have addressed the noise. Please tell us if it happens again.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NOISE_COMPLAINT_16', 'SEC_NOISE_COMPLAINT', 'D’accord, merci.', 'Alright, thank you.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_01', 'SEC_SUSPICIOUS_PERSON', 'Bonsoir. Puis-je vous aider ?', 'Good evening. May I help you?', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_02', 'SEC_SUSPICIOUS_PERSON', 'J’attends simplement.', 'I’m just waiting.', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_03', 'SEC_SUSPICIOUS_PERSON', 'Merci. Êtes-vous client de l’hôtel ?', 'Thank you. Are you a guest of the hotel?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_04', 'SEC_SUSPICIOUS_PERSON', 'Non, je rencontre quelqu’un.', 'No, I’m meeting someone.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_05', 'SEC_SUSPICIOUS_PERSON', 'Compris. Pouvez-vous me donner le nom du client, s’il vous plaît ?', 'Understood. Could you tell me the guest’s name, please?', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_06', 'SEC_SUSPICIOUS_PERSON', 'Pour la sécurité, les visiteurs doivent être confirmés par le client.', 'For security, visitors must be confirmed by the guest.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_07', 'SEC_SUSPICIOUS_PERSON', 'Pourquoi toutes ces questions ?', 'Why all these questions?', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_08', 'SEC_SUSPICIOUS_PERSON', 'Je comprends. Nous faisons cela pour protéger tout le monde, vous compris.', 'I understand. We do this to protect everyone, including you.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_09', 'SEC_SUSPICIOUS_PERSON', 'Veuillez patienter ici pendant que j’appelle le client.', 'Please wait here while I call the guest.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_10', 'SEC_SUSPICIOUS_PERSON', 'Je dois monter.', 'I need to go upstairs.', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_11', 'SEC_SUSPICIOUS_PERSON', 'Je suis désolé(e), je ne peux pas autoriser l’accès sans confirmation.', 'I’m sorry, I can’t allow access without confirmation.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_12', 'SEC_SUSPICIOUS_PERSON', 'Si vous préférez, vous pouvez attendre dans le salon du lobby.', 'If you prefer, we can meet at the lobby seating area.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_13', 'SEC_SUSPICIOUS_PERSON', 'D’accord.', 'Fine.', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_14', 'SEC_SUSPICIOUS_PERSON', 'Merci pour votre coopération.', 'Thank you for your cooperation.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_15', 'SEC_SUSPICIOUS_PERSON', 'Nous n’arrivons pas à joindre le client. Vous pouvez laisser un message à la réception.', 'We could not reach the guest. You may leave a message at the desk.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_SUSPICIOUS_PERSON_16', 'SEC_SUSPICIOUS_PERSON', 'D’accord.', 'Okay.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_01', 'SEC_THEFT_REPORT', 'Mon ordinateur a disparu de ma chambre.', 'My laptop is missing from my room.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_02', 'SEC_THEFT_REPORT', 'Je suis vraiment désolé(e) d’entendre ça. Je vous aide immédiatement.', 'I’m very sorry to hear that. I will assist you immediately.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_03', 'SEC_THEFT_REPORT', 'Pour être précis, puis-je confirmer votre nom et votre numéro de chambre ?', 'For accuracy, may I confirm your name and room number?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_04', 'SEC_THEFT_REPORT', '{guest_name}, chambre {room}.', '{guest_name}, room {room}.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_05', 'SEC_THEFT_REPORT', 'Merci. Quand avez-vous vu l’objet pour la dernière fois ?', 'Thank you. When did you last see the item?', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_06', 'SEC_THEFT_REPORT', 'Ce matin.', 'This morning.', 'OPTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_07', 'SEC_THEFT_REPORT', 'Compris. J’alerte le responsable de service et j’ouvre un rapport d’incident.', 'Understood. I will alert the duty manager and start an incident report.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_08', 'SEC_THEFT_REPORT', 'Nous vérifierons aussi les accès et les zones caméra concernées si applicable.', 'We will also check access logs and relevant camera areas if applicable.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_09', 'SEC_THEFT_REPORT', 'C’est sûr ici ?', 'Is it safe here?', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_10', 'SEC_THEFT_REPORT', 'Votre sécurité est notre priorité. Nous prenons cela très au sérieux.', 'Your safety is our priority. We take this very seriously.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_11', 'SEC_THEFT_REPORT', 'Pouvons-nous entrer dans la chambre avec vous pour vérifier rapidement ?', 'May we enter the room with you to check quickly?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_12', 'SEC_THEFT_REPORT', 'Oui.', 'Yes.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_13', 'SEC_THEFT_REPORT', 'Merci. Nous documentons tout et nous vous tiendrons informé(e).', 'Thank you. We will document everything and keep you updated.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_14', 'SEC_THEFT_REPORT', 'Si vous le souhaitez, nous pouvons vous aider à contacter la police.', 'If you wish, we can assist you in contacting the police.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_15', 'SEC_THEFT_REPORT', 'Oui, s’il vous plaît.', 'Please do.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_THEFT_REPORT_16', 'SEC_THEFT_REPORT', 'Bien sûr. Faisons cela ensemble, calmement.', 'Of course. Let’s proceed together, calmly.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_01', 'SEC_LOST_FOUND', 'Je pense avoir perdu mon portefeuille.', 'I think I lost my wallet.', 'OPENING', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_02', 'SEC_LOST_FOUND', 'Je comprends. Je vais vous aider tout de suite.', 'I understand. Let me help you right away.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_03', 'SEC_LOST_FOUND', 'Pouvez-vous le décrire, s’il vous plaît ? Couleur et marque ?', 'Could you describe it, please? Color and brand?', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_04', 'SEC_LOST_FOUND', 'Noir, petit, avec une fermeture.', 'Black, small, with a zipper.', 'APOLOGY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_05', 'SEC_LOST_FOUND', 'Merci. Je vérifie notre registre des objets trouvés.', 'Thank you. I will check our lost and found log.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_06', 'SEC_LOST_FOUND', 'Puis-je avoir votre nom et votre numéro de téléphone ?', 'May I have your name and phone number?', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_07', 'SEC_LOST_FOUND', '{guest_name}, {phone}.', '{guest_name}, {phone}.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_08', 'SEC_LOST_FOUND', 'Si nous le trouvons, nous vous contactons immédiatement.', 'If we find it, we will contact you immediately.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_09', 'SEC_LOST_FOUND', 'Nous recommandons aussi de bloquer vos cartes par précaution.', 'We also recommend blocking your cards as a precaution.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_10', 'SEC_LOST_FOUND', 'Oui, je vais le faire.', 'Yes, I will.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_11', 'SEC_LOST_FOUND', 'Nous avons un objet correspondant. Pouvez-vous confirmer le contenu ?', 'We have an item matching your description. Please confirm the contents.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_12', 'SEC_LOST_FOUND', 'Il y a une carte d’identité et deux cartes bancaires.', 'There is an ID card and two bank cards.', 'APOLOGY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_13', 'SEC_LOST_FOUND', 'Merci. Cela correspond. Signez ici pour le retrait.', 'Thank you. That matches. Please sign here for collection.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_14', 'SEC_LOST_FOUND', 'Le voici. Gardez-le en sécurité, s’il vous plaît.', 'Here you are. Please keep it secure.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_15', 'SEC_LOST_FOUND', 'Merci beaucoup.', 'Thank you so much.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_LOST_FOUND_16', 'SEC_LOST_FOUND', 'Avec plaisir. Si autre chose manque, dites-le-nous.', 'My pleasure. If anything else is missing, let us know.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_01', 'SEC_EMERGENCY_MEDICAL', 'Au secours ! Quelqu’un a fait un malaise.', 'Help! Someone fainted.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_02', 'SEC_EMERGENCY_MEDICAL', 'Merci de nous prévenir. J’arrive tout de suite.', 'Thank you for alerting us. I’m coming now.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_03', 'SEC_EMERGENCY_MEDICAL', 'Laissez de l’espace, s’il vous plaît, et restez calme.', 'Please give us some space and stay calm.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_04', 'SEC_EMERGENCY_MEDICAL', 'La personne respire-t-elle ?', 'Is the person breathing?', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_05', 'SEC_EMERGENCY_MEDICAL', 'Oui, mais très faiblement.', 'Yes, but very weak.', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_06', 'SEC_EMERGENCY_MEDICAL', 'Compris. J’appelle les secours maintenant.', 'Understood. I am calling medical assistance now.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_07', 'SEC_EMERGENCY_MEDICAL', 'Savez-vous s’ils ont une condition médicale ?', 'Do you know if they have any medical condition?', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_08', 'SEC_EMERGENCY_MEDICAL', 'Je ne sais pas.', 'I don’t know.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_09', 'SEC_EMERGENCY_MEDICAL', 'D’accord. Ne les déplacez pas sauf nécessité.', 'Okay. Please do not move them unless necessary.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_10', 'SEC_EMERGENCY_MEDICAL', 'Nous apportons de l’eau et une chaise pour vous.', 'We will bring water and a chair for you.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_11', 'SEC_EMERGENCY_MEDICAL', 'Combien de temps ça va prendre ?', 'How long will it take?', 'CLARIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_12', 'SEC_EMERGENCY_MEDICAL', 'L’équipe est en route. Je vous tiens au courant dans {time} minutes.', 'The team is on the way. I will update you in {time} minutes.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_13', 'SEC_EMERGENCY_MEDICAL', 'Merci. Gardez la zone dégagée, s’il vous plaît.', 'Thank you. Please keep the area clear.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_14', 'SEC_EMERGENCY_MEDICAL', 'Les secours sont arrivés. Nous prenons le relais.', 'Medical assistance has arrived. We will take it from here.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_15', 'SEC_EMERGENCY_MEDICAL', 'Merci.', 'Thank you.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EMERGENCY_MEDICAL_16', 'SEC_EMERGENCY_MEDICAL', 'Vous avez bien fait de nous alerter rapidement.', 'You did the right thing by alerting us quickly.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_01', 'SEC_FIRE_ALARM', 'J’entends l’alarme incendie. Que se passe-t-il ?', 'I hear the fire alarm. What is happening?', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_02', 'SEC_FIRE_ALARM', 'Merci de demander. Restez calme ; nous vérifions immédiatement.', 'Thank you for asking. Please stay calm; we are checking immediately.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_03', 'SEC_FIRE_ALARM', 'Par sécurité, préparez-vous à quitter votre chambre.', 'For safety, please prepare to leave your room.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_04', 'SEC_FIRE_ALARM', 'Il y a un incendie ?', 'Is there a fire?', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_05', 'SEC_FIRE_ALARM', 'Pour l’instant, nous vérifions. Nous prenons chaque alarme au sérieux.', 'At this moment, we are verifying. We treat every alarm seriously.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_06', 'SEC_FIRE_ALARM', 'Utilisez les escaliers, pas l’ascenseur, s’il vous plaît.', 'Please use the stairs, not the elevator.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_07', 'SEC_FIRE_ALARM', 'Suivez les panneaux de sortie et allez au point de rassemblement dehors.', 'Follow the exit signs and go to the assembly point outside.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_08', 'SEC_FIRE_ALARM', 'J’ai besoin de mon passeport.', 'I need my passport.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_09', 'SEC_FIRE_ALARM', 'Prenez seulement l’essentiel si c’est à portée ; ne perdez pas de temps.', 'Take only essential items if they are within reach; do not delay.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_10', 'SEC_FIRE_ALARM', 'Si vous avez besoin d’aide, dites-le-moi maintenant.', 'If you need assistance, tell me now.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_11', 'SEC_FIRE_ALARM', 'Mon enfant est avec moi.', 'My child is with me.', 'CLARIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_12', 'SEC_FIRE_ALARM', 'Restez bien ensemble. Je vais vous guider.', 'Stay close together. I will guide you.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_13', 'SEC_FIRE_ALARM', 'Merci de coopérer. Votre sécurité est notre priorité.', 'Thank you for cooperating. Your safety is our priority.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_14', 'SEC_FIRE_ALARM', 'Nous sommes au point de rassemblement. Attendez les consignes, s’il vous plaît.', 'We are at the assembly point. Please wait for instructions.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_15', 'SEC_FIRE_ALARM', 'D’accord.', 'Okay.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_FIRE_ALARM_16', 'SEC_FIRE_ALARM', 'Nous vous informons dès que nous avons confirmation.', 'We will update you as soon as we have confirmation.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_01', 'SEC_EVACUATION', 'Madame/Monsieur, nous devons évacuer le bâtiment maintenant.', 'Madam/Sir, we need to evacuate the building now.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_02', 'SEC_EVACUATION', 'Je ne peux pas marcher vite.', 'I can’t walk fast.', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_03', 'SEC_EVACUATION', 'Pas de problème. Je vous aide et on avance doucement.', 'No problem. I will assist you and we will go step by step.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_04', 'SEC_EVACUATION', 'Tenez la rampe et restez à droite, s’il vous plaît.', 'Please hold the handrail and stay on the right side.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_05', 'SEC_EVACUATION', 'On va où ?', 'Where do we go?', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_06', 'SEC_EVACUATION', 'On va au point de rassemblement dehors, près du portail principal.', 'We go to the assembly point outside, near the main gate.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_07', 'SEC_EVACUATION', 'Avez-vous un besoin médical immédiat ?', 'Do you have any medical needs right now?', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_08', 'SEC_EVACUATION', 'Non, juste stressé(e).', 'No, just nervous.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_09', 'SEC_EVACUATION', 'Je comprends. Vous êtes en sécurité avec nous.', 'I understand. You are safe with us.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_10', 'SEC_EVACUATION', 'Ne retournez pas dans votre chambre pour vos affaires, s’il vous plaît.', 'Please do not go back to your room for belongings.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_11', 'SEC_EVACUATION', 'Mon téléphone est dedans.', 'My phone is inside.', 'CLARIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_12', 'SEC_EVACUATION', 'Je suis désolé(e). Priorité sécurité. On aidera après le feu vert.', 'I’m sorry. Safety first. We will assist after the all-clear.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_13', 'SEC_EVACUATION', 'Merci. Continuez ; nous sommes presque dehors.', 'Thank you. Keep moving; we are almost outside.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_14', 'SEC_EVACUATION', 'Vous avez très bien fait. Attendez ici avec le groupe, s’il vous plaît.', 'You did very well. Please wait here with the group.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_15', 'SEC_EVACUATION', 'Merci de m’avoir aidé(e).', 'Thank you for helping.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_EVACUATION_16', 'SEC_EVACUATION', 'Avec plaisir. Je reste à proximité si besoin.', 'My pleasure. I will stay nearby if you need anything.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_01', 'SEC_CROWD_CONTROL', 'Pourquoi le lobby est si bondé ?', 'Why is the lobby so crowded?', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_02', 'SEC_CROWD_CONTROL', 'Nous avons un événement ce soir. Désolé(e) pour la gêne.', 'We have an event tonight. I’m sorry for the inconvenience.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_03', 'SEC_CROWD_CONTROL', 'Suivez cette file, s’il vous plaît ; nous allons vous servir rapidement.', 'Please follow this line; we will assist you quickly.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_04', 'SEC_CROWD_CONTROL', 'Les gens poussent.', 'People are pushing.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_05', 'SEC_CROWD_CONTROL', 'Je comprends. Laissez de l’espace. Nous gérons le flux.', 'I understand. Please give each other space. We will manage the flow.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_06', 'SEC_CROWD_CONTROL', 'Puis-je vous guider vers un espace plus calme pendant l’attente ?', 'May I guide you to a quieter area while you wait?', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_07', 'SEC_CROWD_CONTROL', 'Oui.', 'Yes.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_08', 'SEC_CROWD_CONTROL', 'Merci. Restez près du mur pour la sécurité.', 'Thank you. Please stay close to the wall for safety.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_09', 'SEC_CROWD_CONTROL', 'Nous laisserons entrer par petits groupes pour éviter la pression.', 'We will allow entry in small groups to avoid pressure.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_10', 'SEC_CROWD_CONTROL', 'J’ai une réservation.', 'I have a reservation.', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_11', 'SEC_CROWD_CONTROL', 'Merci. Je peux prioriser les clients de l’hôtel. Puis-je voir votre carte ?', 'Thank you. I can prioritize hotel guests. May I see your key card?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_12', 'SEC_CROWD_CONTROL', 'Parlez calmement, s’il vous plaît. Nous sommes là pour aider.', 'Please speak calmly. We are here to help.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_13', 'SEC_CROWD_CONTROL', 'D’accord.', 'Okay.', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_14', 'SEC_CROWD_CONTROL', 'Merci pour votre coopération. Nous l’apprécions.', 'Thank you for your cooperation. We appreciate it.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_15', 'SEC_CROWD_CONTROL', 'La zone est dégagée. Vous pouvez avancer.', 'The area is clear now. You may proceed.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CROWD_CONTROL_16', 'SEC_CROWD_CONTROL', 'Merci.', 'Thanks.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_01', 'SEC_PARKING_ASSIST', 'Bonjour. Puis-je vous aider à vous garer en sécurité ?', 'Good afternoon. May I help you park safely?', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_02', 'SEC_PARKING_ASSIST', 'Je cherche le parking de l’hôtel.', 'I’m looking for the hotel parking.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_03', 'SEC_PARKING_ASSIST', 'Suivez-moi, s’il vous plaît. Par ici.', 'Please follow me. This way, sir/madam.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_04', 'SEC_PARKING_ASSIST', 'Merci de rouler doucement dans le parking.', 'Kindly keep your speed low in the parking area.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_05', 'SEC_PARKING_ASSIST', 'C’est sécurisé ?', 'Is it secure?', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_06', 'SEC_PARKING_ASSIST', 'Oui, la zone est surveillée et contrôlée régulièrement.', 'Yes, the area is monitored and patrolled regularly.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_07', 'SEC_PARKING_ASSIST', 'Fermez le véhicule et gardez les objets de valeur avec vous.', 'Please lock your car and keep valuables with you.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_08', 'SEC_PARKING_ASSIST', 'Pouvez-vous appeler un taxi pour plus tard ?', 'Can you call a taxi for later?', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_09', 'SEC_PARKING_ASSIST', 'Bien sûr. Je peux demander à la réception de le programmer.', 'Certainly. I can ask the front desk to schedule it.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_10', 'SEC_PARKING_ASSIST', 'Votre place est ici. Alignez-vous sur les lignes, s’il vous plaît.', 'Your parking spot is here. Please align with the lines.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_11', 'SEC_PARKING_ASSIST', 'D’accord.', 'Okay.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_12', 'SEC_PARKING_ASSIST', 'Si vous avez besoin de votre voiture, informez-nous ; on peut aider.', 'If you need your car, please inform us; we can assist.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_13', 'SEC_PARKING_ASSIST', 'En cas de pluie, le sol peut glisser—attention, s’il vous plaît.', 'During rain, the floor may be slippery—please be careful.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_14', 'SEC_PARKING_ASSIST', 'Merci pour l’aide.', 'Thanks for the help.', 'OPTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_15', 'SEC_PARKING_ASSIST', 'Avec plaisir. Bienvenue à l’hôtel.', 'My pleasure. Welcome to the hotel.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_PARKING_ASSIST_16', 'SEC_PARKING_ASSIST', 'Si vous remarquez quelque chose d’inhabituel, prévenez la sécurité immédiatement.', 'If you notice anything unusual, please tell security immediately.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_01', 'SEC_KEY_CONTROL', 'J’ai perdu ma carte. Je peux en avoir une autre ?', 'I lost my key card. Can I get a new one?', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_02', 'SEC_KEY_CONTROL', 'Bien sûr. Pour la sécurité, je dois vérifier votre identité d’abord.', 'Of course. For security, I need to verify your identity first.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_03', 'SEC_KEY_CONTROL', 'Pouvez-vous confirmer votre nom et votre numéro de chambre, s’il vous plaît ?', 'Could you confirm your name and room number, please?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_04', 'SEC_KEY_CONTROL', '{guest_name}, chambre {room}.', '{guest_name}, room {room}.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_05', 'SEC_KEY_CONTROL', 'Merci. Avez-vous une pièce sur vous ?', 'Thank you. Do you have an ID with you?', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_06', 'SEC_KEY_CONTROL', 'Non, elle est dans la chambre.', 'No, it’s in the room.', 'OPTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_07', 'SEC_KEY_CONTROL', 'Compris. Je peux vous escorter à la chambre pour confirmer, puis refaire une carte.', 'Understood. I can escort you to the room to confirm, then issue a new card.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_08', 'SEC_KEY_CONTROL', 'Nous désactivons immédiatement l’ancienne carte.', 'We will also deactivate the old card immediately.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_09', 'SEC_KEY_CONTROL', 'D’accord.', 'Good.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_10', 'SEC_KEY_CONTROL', 'Patientez un instant pendant que je programme la nouvelle carte.', 'Please wait one moment while I program the new card.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_11', 'SEC_KEY_CONTROL', 'Voici votre nouvelle carte. Gardez-la en sécurité, s’il vous plaît.', 'Here is your new key card. Please keep it secure.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_12', 'SEC_KEY_CONTROL', 'Merci.', 'Thank you.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_13', 'SEC_KEY_CONTROL', 'Si la serrure pose encore problème, dites-le-nous.', 'If the door lock has issues again, please let us know.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_14', 'SEC_KEY_CONTROL', 'Nous pouvons aussi fournir un porte-carte si vous souhaitez.', 'We can also provide a key holder or lanyard if you wish.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_15', 'SEC_KEY_CONTROL', 'Oui, s’il vous plaît.', 'Yes, please.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_KEY_CONTROL_16', 'SEC_KEY_CONTROL', 'Bien sûr. La voici.', 'Certainly. Here you are.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_01', 'SEC_INCIDENT_REPORT', 'Je vais enregistrer cet incident pour assurer le suivi.', 'I will record this incident to ensure proper follow-up.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_02', 'SEC_INCIDENT_REPORT', 'Vous devez vraiment l’écrire ?', 'Do you really need to write it down?', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_03', 'SEC_INCIDENT_REPORT', 'Oui, cela nous aide à agir vite et correctement.', 'Yes, it helps us act quickly and accurately.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_04', 'SEC_INCIDENT_REPORT', 'Pouvez-vous me dire ce qui s’est passé, étape par étape ?', 'Could you tell me what happened, step by step?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_05', 'SEC_INCIDENT_REPORT', 'C’était vers 21h.', 'It happened around 9 PM.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_06', 'SEC_INCIDENT_REPORT', 'Merci. Où exactement cela s’est-il produit ?', 'Thank you. Where exactly did it occur?', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_07', 'SEC_INCIDENT_REPORT', 'Près de l’ascenseur.', 'Near the elevator.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_08', 'SEC_INCIDENT_REPORT', 'Compris. Y avait-il des témoins ?', 'Understood. Were there any witnesses?', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_09', 'SEC_INCIDENT_REPORT', 'Oui, deux personnes.', 'Yes, two people.', 'OPENING', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_10', 'SEC_INCIDENT_REPORT', 'Merci. Je vais inclure leurs informations si possible.', 'Thank you. I will include their details if possible.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_11', 'SEC_INCIDENT_REPORT', 'Confirmez votre numéro de téléphone pour les mises à jour, s’il vous plaît.', 'Please confirm your phone number for updates.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_12', 'SEC_INCIDENT_REPORT', '{phone}.', '{phone}.', 'APOLOGY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_13', 'SEC_INCIDENT_REPORT', 'Je transmets immédiatement au responsable de service.', 'I will share this with the duty manager immediately.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_14', 'SEC_INCIDENT_REPORT', 'Vous aurez un retour dans {time} minutes.', 'You will receive an update within {time} minutes.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_15', 'SEC_INCIDENT_REPORT', 'D’accord.', 'Okay.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_INCIDENT_REPORT_16', 'SEC_INCIDENT_REPORT', 'Merci pour votre coopération.', 'Thank you for your cooperation.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_01', 'SEC_CONFLICT_DEESCALATION', 'Il m’a insulté(e) !', 'He insulted me!', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_02', 'SEC_CONFLICT_DEESCALATION', 'Je suis désolé(e) que cela arrive. Mettons-nous de côté et parlons calmement.', 'I’m sorry this happened. Let’s step aside and speak calmly.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_03', 'SEC_CONFLICT_DEESCALATION', 'Pour la sécurité de tous, baissez la voix, s’il vous plaît.', 'For everyone’s safety, please lower your voice.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_04', 'SEC_CONFLICT_DEESCALATION', 'Je veux qu’on le fasse sortir maintenant.', 'I want him removed now.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_05', 'SEC_CONFLICT_DEESCALATION', 'Je comprends. D’abord, je dois comprendre ce qui s’est passé.', 'I understand. First, I need to understand what happened.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_06', 'SEC_CONFLICT_DEESCALATION', 'Dites-moi les faits, et je vais agir.', 'Please tell me the facts, and I will take action.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_07', 'SEC_CONFLICT_DEESCALATION', 'Il m’a poussé(e).', 'He pushed me.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_08', 'SEC_CONFLICT_DEESCALATION', 'Merci. Êtes-vous blessé(e) ? Besoin d’aide médicale ?', 'Thank you. Are you hurt? Do you need medical help?', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_09', 'SEC_CONFLICT_DEESCALATION', 'Non.', 'No.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_10', 'SEC_CONFLICT_DEESCALATION', 'D’accord. Restez ici pendant que je parle à l’autre personne.', 'Okay. Please stay here while I speak to the other party.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_11', 'SEC_CONFLICT_DEESCALATION', 'Nous allons garder de la distance et éviter tout contact.', 'We will keep distance and avoid further contact.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_12', 'SEC_CONFLICT_DEESCALATION', 'Je tremble.', 'I’m shaking.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_13', 'SEC_CONFLICT_DEESCALATION', 'Je comprends. Respirez. Vous êtes en sécurité ici.', 'I understand. Take a deep breath. You are safe here.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_14', 'SEC_CONFLICT_DEESCALATION', 'Si nécessaire, on peut impliquer le manager ou les autorités.', 'If needed, we can involve the manager or authorities.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_15', 'SEC_CONFLICT_DEESCALATION', 'D’accord.', 'Okay.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CONFLICT_DEESCALATION_16', 'SEC_CONFLICT_DEESCALATION', 'Merci. Nous allons régler cela discrètement.', 'Thank you. We will resolve this discreetly.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_01', 'SEC_VIP_PROTECTION', 'Bonsoir. Je vais assurer un accès discret et fluide pour vous.', 'Good evening. I will ensure a discreet and smooth access for you.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_02', 'SEC_VIP_PROTECTION', 'S’il vous plaît, pas d’attention. Restez discret.', 'Please, no attention. Keep it quiet.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_03', 'SEC_VIP_PROTECTION', 'Bien sûr. Nous gardons vos déplacements confidentiels.', 'Of course. We will keep your movements private.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_04', 'SEC_VIP_PROTECTION', 'Puis-je confirmer l’entrée et l’itinéraire souhaités ?', 'May I confirm the preferred entrance and route?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_05', 'SEC_VIP_PROTECTION', 'Utilisez l’entrée latérale.', 'Use the side entrance.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_06', 'SEC_VIP_PROTECTION', 'Compris. Je libère le passage et je coordonne avec la réception.', 'Understood. I will clear the path and coordinate with reception.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_07', 'SEC_VIP_PROTECTION', 'Votre nom ne sera pas annoncé dans les zones publiques.', 'Your name will not be announced in public areas.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_08', 'SEC_VIP_PROTECTION', 'Merci.', 'Thank you.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_09', 'SEC_VIP_PROTECTION', 'Si vous souhaitez un accompagnement à tout moment, appelez la sécurité.', 'If you need an escort at any time, please call security.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_10', 'SEC_VIP_PROTECTION', 'Nous pouvons aussi gérer l’arrivée et le départ du véhicule discrètement.', 'We can also manage vehicle arrival and departure discreetly.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_11', 'SEC_VIP_PROTECTION', 'Oui, merci de l’organiser.', 'Yes, please arrange that.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_12', 'SEC_VIP_PROTECTION', 'Bien sûr. À quelle heure prévoyez-vous de partir ?', 'Certainly. What time do you plan to leave?', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_13', 'SEC_VIP_PROTECTION', 'À {time}.', 'At {time}.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_14', 'SEC_VIP_PROTECTION', 'Merci. Je confirme le plan et je vous reviens rapidement.', 'Thank you. I will confirm the plan and update you shortly.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_15', 'SEC_VIP_PROTECTION', 'Tout est prêt. Bienvenue, et bon séjour.', 'Everything is set. Welcome, and enjoy your stay.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VIP_PROTECTION_16', 'SEC_VIP_PROTECTION', 'Parfait.', 'Perfect.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_01', 'SEC_VENDOR_ACCESS', 'Livraison pour la cuisine.', 'Delivery for the kitchen.', 'OPENING', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_02', 'SEC_VENDOR_ACCESS', 'Merci. Puis-je voir le bon de livraison et une pièce, s’il vous plaît ?', 'Thank you. May I see your delivery note and ID, please?', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_03', 'SEC_VENDOR_ACCESS', 'Voici.', 'Here.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_04', 'SEC_VENDOR_ACCESS', 'Merci. Je vous enregistre et je vous remets un badge visiteur.', 'Thank you. I will register you and issue a visitor badge.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_05', 'SEC_VENDOR_ACCESS', 'Restez uniquement dans les zones autorisées, s’il vous plaît.', 'Please stay in authorized areas only.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_06', 'SEC_VENDOR_ACCESS', 'Je dois passer par l’ascenseur clients.', 'I need to go through the guest elevator.', 'OPTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_07', 'SEC_VENDOR_ACCESS', 'Je suis désolé(e), ce n’est pas autorisé. Utilisez l’ascenseur de service.', 'I’m sorry, that is not allowed. Please use the service elevator.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_08', 'SEC_VENDOR_ACCESS', 'Je vais vous escorter vers le bon accès.', 'I will escort you to the correct access point.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_09', 'SEC_VENDOR_ACCESS', 'D’accord.', 'Okay.', 'OPENING', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_10', 'SEC_VENDOR_ACCESS', 'Signez ici à l’entrée et à la sortie, s’il vous plaît.', 'Please sign in here and sign out when you leave.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_11', 'SEC_VENDOR_ACCESS', 'Avez-vous des outils ou objets tranchants avec vous ?', 'Do you have any tools or sharp objects with you?', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_12', 'SEC_VENDOR_ACCESS', 'Oui, un cutter.', 'Yes, a cutter.', 'APOLOGY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_13', 'SEC_VENDOR_ACCESS', 'Merci. Gardez-le sécurisé et utilisez-le seulement si nécessaire.', 'Thank you. Please keep it secured and use it only when needed.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_14', 'SEC_VENDOR_ACCESS', 'Votre contact viendra vous rejoindre à l’intérieur.', 'Your contact person will meet you inside.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_15', 'SEC_VENDOR_ACCESS', 'D’accord.', 'Fine.', 'FOLLOW_UP', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_VENDOR_ACCESS_16', 'SEC_VENDOR_ACCESS', 'Merci de respecter nos procédures de sécurité.', 'Thank you for cooperating with our safety procedures.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_01', 'SEC_CCTV_REQUEST', 'Je veux voir les vidéos de surveillance.', 'I want to see the CCTV footage.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_02', 'SEC_CCTV_REQUEST', 'Je comprends. Pour des raisons de confidentialité et légales, l’accès est restreint.', 'I understand. For privacy and legal reasons, footage access is restricted.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_03', 'SEC_CCTV_REQUEST', 'Nous pouvons la revoir en interne et la transmettre aux autorités si besoin.', 'We can review it internally and share it with authorities if required.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_04', 'SEC_CCTV_REQUEST', 'Mais ça me concerne.', 'But it involves me.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_05', 'SEC_CCTV_REQUEST', 'Je comprends. Donnez-moi les détails et j’ouvre un rapport.', 'I understand. Please let me take the details and open a report.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_06', 'SEC_CCTV_REQUEST', 'Quelle heure et quel endroit concernent votre demande ?', 'What time and location are you referring to?', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_07', 'SEC_CCTV_REQUEST', 'Hier, près du lobby, vers 20h.', 'Yesterday, near the lobby, around 8 PM.', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_08', 'SEC_CCTV_REQUEST', 'Merci. J’informe le responsable et le superviseur sécurité.', 'Thank you. I will inform the duty manager and our security supervisor.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_09', 'SEC_CCTV_REQUEST', 'Si la police en fait la demande, nous fournirons la vidéo officiellement.', 'If the police request it, we will provide the footage officially.', 'OPENING', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_10', 'SEC_CCTV_REQUEST', 'Donc vous refusez ?', 'So you refuse?', 'VERIFY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_11', 'SEC_CCTV_REQUEST', 'Je suis désolé(e). Je ne peux pas montrer directement, mais je peux agir immédiatement.', 'I’m sorry. I can’t show footage directly, but I can act immediately.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_12', 'SEC_CCTV_REQUEST', 'Nous vous informons sous {time} minutes des prochaines étapes.', 'We will update you within {time} minutes on the next steps.', 'APOLOGY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_13', 'SEC_CCTV_REQUEST', 'D’accord.', 'Okay.', 'ACTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_14', 'SEC_CCTV_REQUEST', 'Merci de votre compréhension. Nous devons protéger tous les clients.', 'Thank you for your understanding. We must protect all guests.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_15', 'SEC_CCTV_REQUEST', 'Pouvez-vous donner un numéro pour le suivi ?', 'Could you provide a contact number for follow-up?', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CCTV_REQUEST_16', 'SEC_CCTV_REQUEST', '{phone}.', '{phone}.', 'CLOSE', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_01', 'SEC_CHILD_SAFETY', 'Je ne trouve pas mon enfant !', 'I can’t find my child!', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_02', 'SEC_CHILD_SAFETY', 'Je suis avec vous. Nous allons vous aider immédiatement.', 'I’m here with you. We will help you immediately.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_03', 'SEC_CHILD_SAFETY', 'Dites-moi le prénom et l’âge de l’enfant, s’il vous plaît.', 'Please tell me your child’s name and age.', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_04', 'SEC_CHILD_SAFETY', '{child_name}, {age} ans.', '{child_name}, {age} years old.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_05', 'SEC_CHILD_SAFETY', 'Que portait votre enfant ?', 'What was your child wearing?', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_06', 'SEC_CHILD_SAFETY', 'Un t-shirt bleu et un short.', 'A blue shirt and shorts.', 'OPTION', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_07', 'SEC_CHILD_SAFETY', 'Merci. Nous sécurisons les sorties et cherchons les zones clés maintenant.', 'Thank you. We will secure exits and search key areas now.', 'FOLLOW_UP', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_08', 'SEC_CHILD_SAFETY', 'Restez ici, s’il vous plaît ; je mobilise l’équipe et je vous informe.', 'Please stay here; I will assign a team and update you.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_09', 'SEC_CHILD_SAFETY', 'Je panique.', 'I’m panicking.', 'OPENING', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_10', 'SEC_CHILD_SAFETY', 'Je comprends. Respirez. Nous agissons maintenant.', 'I understand. Breathe. We are acting right now.', 'VERIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_11', 'SEC_CHILD_SAFETY', 'Si l’enfant a un téléphone, pouvez-vous l’appeler ?', 'If your child has a phone, can you call it?', 'CLARIFY', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_12', 'SEC_CHILD_SAFETY', 'Non.', 'No.', 'APOLOGY', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_13', 'SEC_CHILD_SAFETY', 'D’accord. Nous vérifions d’abord la piscine, le restaurant et le lobby.', 'Okay. We will check the pool, restaurant, and lobby first.', 'ACTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_14', 'SEC_CHILD_SAFETY', 'Nous avons trouvé un enfant correspondant près de {location}.', 'We found a child matching the description near {location}.', 'OPTION', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_15', 'SEC_CHILD_SAFETY', 'C’est mon enfant ?', 'Is it my child?', 'FOLLOW_UP', 'B1', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_CHILD_SAFETY_16', 'SEC_CHILD_SAFETY', 'Venez avec moi pour confirmer. On vous réunit en sécurité.', 'Please come with me to confirm. We will reunite you safely.', 'CLOSE', 'B1', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_01', 'SEC_NIGHT_PATROL', 'Bonsoir. Ronde de sécurité. Tout va bien ?', 'Good evening. Security patrol. Everything alright?', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_02', 'SEC_NIGHT_PATROL', 'Oui, merci.', 'Yes, thank you.', 'VERIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_03', 'SEC_NIGHT_PATROL', 'Nous faisons un contrôle de routine pour que chacun se sente en sécurité.', 'We are doing a routine check to ensure everyone feels safe.', 'CLARIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_04', 'SEC_NIGHT_PATROL', 'Merci de garder le couloir dégagé de vos bagages.', 'Please keep the corridor clear of luggage.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_05', 'SEC_NIGHT_PATROL', 'D’accord.', 'Okay.', 'ACTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_06', 'SEC_NIGHT_PATROL', 'Si vous avez besoin d’aide la nuit, appelez la réception ou la sécurité.', 'If you need assistance at night, call reception or security.', 'OPTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_07', 'SEC_NIGHT_PATROL', 'Je vérifie les issues de secours et je signale tout problème.', 'I will check the emergency exits and report any issue.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_08', 'SEC_NIGHT_PATROL', 'Il y a une odeur étrange.', 'There is a strange smell.', 'CLOSE', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_09', 'SEC_NIGHT_PATROL', 'Merci de signaler. Je vérifie immédiatement.', 'Thank you for reporting. I will investigate immediately.', 'OPENING', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_10', 'SEC_NIGHT_PATROL', 'Restez dans votre chambre pendant que nous vérifions, s’il vous plaît.', 'Please stay in your room while we check.', 'VERIFY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_11', 'SEC_NIGHT_PATROL', 'D’accord.', 'Alright.', 'CLARIFY', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_12', 'SEC_NIGHT_PATROL', 'Tout est normal. Merci d’avoir été vigilant(e).', 'Everything is normal. Thank you for being vigilant.', 'APOLOGY', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_13', 'SEC_NIGHT_PATROL', 'Nous avons renforcé les rondes ce soir pour votre confort.', 'We have increased patrols tonight for your comfort.', 'ACTION', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_14', 'SEC_NIGHT_PATROL', 'Bien.', 'Good.', 'OPTION', 'A2', 'CLIENT', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_15', 'SEC_NIGHT_PATROL', 'Passez une nuit paisible.', 'Have a peaceful night.', 'FOLLOW_UP', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

insert into phrases (id, action_id, texte_fr, texte_en, phase, niveau, voice_type, audio_url)
values ('SEC_NIGHT_PATROL_16', 'SEC_NIGHT_PATROL', 'Si quelque chose change, contactez-nous immédiatement.', 'If anything changes, please contact us immediately.', 'CLOSE', 'A2', 'STAFF', null)
on conflict (id) do update set
  action_id = excluded.action_id,
  texte_fr = excluded.texte_fr,
  texte_en = excluded.texte_en,
  phase = excluded.phase,
  niveau = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url = excluded.audio_url;

commit;