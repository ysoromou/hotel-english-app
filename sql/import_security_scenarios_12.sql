begin;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_ACCESS_01', 'SEC_ACCESS_CONTROL', 'MULTI_PROBLEM', 'B1', 'Entrée tardive + visiteur non enregistré + client VIP attendu + tension au lobby.', 'Protéger l’accès sans froisser, confirmer le visiteur, fluidifier l’arrivée VIP.', 'VISITOR: I''m here to see my friend in room {room}. Let me go upstairs.
SECURITY: Good evening. I understand. For everyone’s safety, visitors must be confirmed.
VISITOR: I don''t have time for this.
SECURITY: Thank you for your patience. I will call the guest now and confirm within {time} minutes.
GUEST (by phone): Yes, I’m expecting him.
SECURITY: Thank you. Please come to the front desk to register your visitor, then I will grant access.
VISITOR: Fine.
SECURITY: I appreciate your cooperation. We will keep it quick and discreet.', 'Règle appliquée sans confrontation; confirmation par le client; enregistrement; délai annoncé; ton 4★ chaleureux.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_NOISE_02', 'SEC_NOISE_COMPLAINT', 'MULTI_PROBLEM', 'B1', 'Plainte bruit 23h30 + groupe refuse de baisser + menace d’avis négatif + hôtel complet.', 'Désamorcer, appliquer quiet hours, proposer solution au plaignant, escalader si besoin.', 'GUEST: The music is still loud. I can’t sleep. I will leave a bad review.
SECURITY: I’m truly sorry for the disturbance. I will handle this right away.
SECURITY: May I confirm your room number, please?
GUEST: {room}.
SECURITY: Thank you. I’m going to the floor now. If it continues, we will take stronger action.
GUEST: I want to change rooms.
SECURITY: I understand. If a room is available, we will move you. If not, we will enforce silence and update you within {time} minutes.', 'Empathie + action immédiate; application règle; escalade; alternative (room move) sans promesse impossible; suivi.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_SUSPICIOUS_03', 'SEC_SUSPICIOUS_PERSON', 'MULTI_PROBLEM', 'B1', 'Personne suspecte près des ascenseurs + insiste pour monter + dit ''je connais le manager''.', 'Contrôler accès, garder calme, protéger clients, appeler renfort/manager si nécessaire.', 'SECURITY: Good evening. May I help you?
VISITOR: I''m going upstairs. I know the manager.
SECURITY: Understood. For security, I need to confirm the guest you are visiting.
VISITOR: Stop wasting my time.
SECURITY: I understand. Please wait here while I call. I can’t allow access without confirmation.
VISITOR: This is ridiculous.
SECURITY: Thank you for your cooperation. We apply the same rule for everyone.', 'Contrôle ferme + courtois; refus d’accès sans confirmation; pas d’escalade verbale; protection zones sensibles.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_THEFT_04', 'SEC_THEFT_REPORT', 'MULTI_PROBLEM', 'B1', 'Ordinateur disparu + client stressé (réunion) + demande voir CCTV + police possible.', 'Rassurer, collecter faits, ouvrir incident, expliquer CCTV, coordonner manager.', 'GUEST: My laptop is missing. I need it for a meeting. Show me the cameras.
SECURITY: I’m very sorry to hear that. I will assist you immediately.
SECURITY: Please tell me when you last saw it and where.
GUEST: This morning, in my room.
SECURITY: Thank you. I will open an incident report now and inform the duty manager.
GUEST: I want the CCTV footage.
SECURITY: I understand. For privacy reasons I can’t show footage directly, but we will review it internally and share it with authorities if required.
GUEST: Okay, do it fast.
SECURITY: Absolutely. I will update you within {time} minutes.', 'Empathie; collecte infos; incident report; règle CCTV expliquée; escalade manager; délai + suivi.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_MEDICAL_05', 'SEC_EMERGENCY_MEDICAL', 'MULTI_PROBLEM', 'B1', 'Client fait un malaise au restaurant + foule + barrière langue + besoin d’ambulance.', 'Sécuriser zone, calmer foule, appeler secours, coordonner avec staff.', 'STAFF: Help! Someone fainted!
SECURITY: Thank you for alerting us. Please give us space and stay calm.
SECURITY: Is the person breathing?
STAFF: Yes, but very weak.
SECURITY: Understood. I am calling medical assistance now.
GUEST: Please, hurry!
SECURITY: We are acting now. I will update you in {time} minutes. Please keep the area clear.', 'Sécurité périmètre; communication calme; appel secours; instructions claires; suivi.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_FIRE_06', 'SEC_FIRE_ALARM', 'MULTI_PROBLEM', 'B1', 'Alarme incendie + client veut récupérer passeport + autre client panique + ascenseur demandé.', 'Communiquer, interdire ascenseur, guider vers escaliers, prioriser sécurité.', 'GUEST: I need my passport. I can’t leave without it.
SECURITY: I understand. Take only essential items if they are within reach, but please do not delay.
GUEST2: Can we use the elevator?
SECURITY: Please use the stairs, not the elevator.
SECURITY: Follow the exit signs to the assembly point. I will guide you.
GUEST2: I’m scared.
SECURITY: I understand. Stay close together. You are safe with us.', 'Consignes sécurité correctes; ton rassurant; pas de promesse; priorité évacuation.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_EVAC_07', 'SEC_EVACUATION', 'MULTI_PROBLEM', 'B1', 'Évacuation + client âgé mobilité réduite + pluie + foule.', 'Assister mobilité, maintenir rythme, sécuriser itinéraire, rassurer.', 'SECURITY: We need to evacuate now. Please come with me.
GUEST: I can’t walk fast.
SECURITY: No problem. Hold the handrail, and we will go step by step.
GUEST: It’s raining outside.
SECURITY: I understand. We will use the covered exit and reach the assembly point safely.
SECURITY: Thank you for cooperating.', 'Aide personne vulnérable; itinéraire adapté; communication claire; maintien calme.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_CROWD_08', 'SEC_CROWD_CONTROL', 'MULTI_PROBLEM', 'B1', 'Lobby saturé (événement) + file check-in + tension + VIP arrive.', 'Organiser flux, prioriser clients hôtel, garder discrétion VIP.', 'GUEST: People are pushing. This is chaotic.
SECURITY: I’m sorry for the inconvenience. Please follow this line; we will manage the flow.
SECURITY: Hotel guests first—may I see your key card or reservation name?
GUEST: Here.
SECURITY: Thank you. I will guide you to a quieter area while you wait.
(whisper to staff) VIP arrival in 2 minutes. Keep the path clear, discreetly.', 'Gestion foule; tri prioritaire; ton 4★; coordination interne; discrétion VIP.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_PARK_09', 'SEC_PARKING_ASSIST', 'MULTI_PROBLEM', 'B1', 'Parking glissant (pluie) + client énervé (rayure voiture) + demande caméra + départ urgent.', 'Sécuriser zone, calmer, incident report, expliquer CCTV, orienter solution.', 'GUEST: My car is scratched. Show me the cameras, I’m leaving now.
SECURITY: I’m sorry for the inconvenience. First, let’s ensure everyone is safe—please step aside.
SECURITY: I will open an incident report and inform the duty manager.
GUEST: I don’t have time.
SECURITY: I understand. Please give me two minutes for the key details, and we will follow up today.
SECURITY: For privacy reasons, we can’t show footage directly, but we can review and provide it to authorities if required.', 'Sécurité + désescalade; capture infos rapide; procédure CCTV; suivi promis réaliste.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_VENDOR_10', 'SEC_VENDOR_ACCESS', 'MULTI_PROBLEM', 'B1', 'Livreur sans badge + veut passer par zones clients + dit ''on m’attend''.', 'Appliquer procédure, orienter service elevator, enregistrer, escorter.', 'VENDOR: Delivery. I must go through the guest elevator.
SECURITY: I’m sorry, that is not allowed. Please use the service elevator.
VENDOR: But they are waiting for me.
SECURITY: I understand. May I see your delivery note and ID? I will register you and escort you to the correct access.
VENDOR: Okay.
SECURITY: Thank you for cooperating with our safety procedures.', 'Procédure appliquée; alternatives; enregistrement; escort; ton pro.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_CHILD_11', 'SEC_CHILD_SAFETY', 'MULTI_PROBLEM', 'B1', 'Enfant perdu + parent panique + hôtel bondé + sorties à sécuriser.', 'Collecter description, sécuriser issues, mobiliser équipe, réunir en sécurité.', 'PARENT: I can’t find my child!
SECURITY: I’m here with you. We will help you immediately.
SECURITY: Please tell me your child’s name, age, and what they are wearing.
PARENT: {child_name}, {age}, blue shirt.
SECURITY: Thank you. We are securing exits and searching key areas now. Please stay here.
SECURITY: We found a child matching the description near {location}. Please come with me to confirm.', 'Réassurance; collecte données; action immédiate; sécurisation sorties; réunification.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_SEC_KEY_12', 'SEC_KEY_CONTROL', 'MULTI_PROBLEM', 'B1', 'Client bloqué 1h du matin + pas d’ID + agacé + sécurité & procédure.', 'Vérifier identité, escorter, désactiver ancienne carte, recoder.', 'GUEST: I’m locked out and I don’t have my ID. Just give me a key.
SECURITY: I understand. For your security, I need to verify your identity first.
GUEST: I’m tired.
SECURITY: Thank you for your patience. I can escort you to the room to confirm, then issue a new card and deactivate the old one.
GUEST: Fine.
SECURITY: I appreciate your understanding. We will keep it quick.', 'Sécurité d’abord; procédure respectée; empathie; escort; action corrective.')
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

commit;