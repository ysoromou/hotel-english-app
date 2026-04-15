begin;

-- 12 scénarios multi-problèmes (Housekeeping 4 étoiles)

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_DND_01', 'HK_DND', 'MULTI_PROBLEM', 'B1', $$Chambre en DND depuis 24h + client demande service immédiat + suspicion sécurité (bien-être).$$, $$Respecter DND, proposer créneau, coordonner avec réception/sécurité si nécessaire, rester discret.$$, $$CLIENT: Do not disturb means do not disturb. Why are you calling?
STAFF: I understand, and I apologize for the inconvenience. For your comfort and safety, we are checking if you need anything.
CLIENT: I need towels now, but I don’t want anyone entering.
STAFF: Of course. I can leave fresh towels at your door and collect used ones later, if you agree.
CLIENT: Fine. And don’t knock again.
STAFF: Understood. I will note your preference and send the towels within {time} minutes.$$, $$Empathie + discrétion; proposer solution “door drop”; délai clair; pas d’intrusion; coordination réception si alerte.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_BATHROOM_02', 'HK_BATHROOM_ISSUE', 'MULTI_PROBLEM', 'B1', $$Salle de bain sale (cheveux) + client très irrité + hôtel plein + demande de changement de chambre.$$, $$S’excuser, corriger immédiatement, proposer alternatives réalistes (deep clean prioritaire, contrôle superviseur, compensation via desk).$$, $$CLIENT: There are hairs in the bathroom. This is unacceptable.
STAFF: Please accept our sincere apologies. I will take care of this immediately.
CLIENT: I want to change rooms now.
STAFF: I understand. I will inform reception to check availability. Meanwhile, I can have the bathroom deep-cleaned now and rechecked by a supervisor.
CLIENT: How long?
STAFF: Within {time} minutes. I will update you and ensure it meets our standards.$$, $$Excuses + ownership; alternatives si pas de room; délai + suivi; contrôle qualité annoncé.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_ODOR_03', 'HK_ODOR_SMELL', 'MULTI_PROBLEM', 'B1', $$Odeur de fumée/moisi + client allergique + demande solution immédiate + possibilité room move.$$, $$Diagnostiquer, proposer désodorisation + purificateur, escalader réception pour room move, suivi.$$, $$CLIENT: The room smells like smoke and I’m allergic.
STAFF: I’m very sorry for the inconvenience. I understand your concern.
STAFF: I can start an immediate treatment and bring a purifier. I will also ask reception to check an alternative room.
CLIENT: I need this solved now.
STAFF: Of course. I will be there within {time} minutes and update you shortly.$$, $$Action immédiate; proposer 2 options; escalade desk; pas de promesse impossible.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_LOSTFOUND_04', 'HK_LOST_FOUND', 'MULTI_PROBLEM', 'B1', $$Client accuse vol (montre) + départ demain + stress + demande manager.$$, $$Rester neutre, lancer procédure lost & found, informer réception/sécurité, formaliser incident.$$, $$CLIENT: My watch is missing. I think it was stolen.
STAFF: I’m sorry to hear that. I understand this is stressful.
STAFF: I will report this immediately and start a search with our Lost & Found procedure.
CLIENT: I want to speak to a manager.
STAFF: Of course. I will inform reception and security now, and a manager will follow up with you.$$, $$Neutralité; procédure; traçabilité; escalade; pas d’aveu/accusation.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_STAIN_05', 'HK_STAIN_COMPLAINT', 'MULTI_PROBLEM', 'B1', $$Drap taché + client VIP + demande remplacement + excuse + geste.$$, $$Remplacer immédiatement, proposer inspection complète, signaler au desk pour compensation éventuelle.$$, $$CLIENT: These sheets are stained. This shouldn’t happen.
STAFF: I’m truly sorry. I will replace them immediately.
STAFF: I will also check the room thoroughly and have a supervisor re-inspect it.
CLIENT: I’m a VIP guest.
STAFF: Understood. I will inform reception so they can follow up appropriately. Thank you for your patience.$$, $$Ownership; solution immédiate; contrôle; transfert au desk pour compensation.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_MAINT_06', 'HK_MAINT_REQUEST', 'MULTI_PROBLEM', 'B1', $$Fuite d’eau + risque glissade + client dans la chambre + urgence.$$, $$Sécuriser zone, proposer serviettes/stopgap, appeler maintenance, informer réception, suivi.$$, $$CLIENT: There is water leaking and the floor is slippery.
STAFF: I’m sorry. For your safety, please avoid that area.
STAFF: I will place towels and a warning sign now and call maintenance immediately.
CLIENT: I need this fixed right away.
STAFF: I understand. I will update you within {time} minutes and reception will follow up.$$, $$Sécurité d’abord; escalade claire; délai; coordination desk.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_LATE_07', 'HK_LATE_SERVICE', 'MULTI_PROBLEM', 'B1', $$23h : demande oreillers + serviettes + client impatient + équipe réduite.$$, $$Accuser réception, donner délai, proposer alternative (porter au desk), tenir engagement.$$, $$CLIENT: I need extra pillows now. It’s late.
STAFF: Of course. I apologize for the wait. We have a reduced team at this hour.
STAFF: I can deliver the pillows and towels within {time} minutes. If you prefer, you may pick them up at reception immediately.
CLIENT: Deliver them.
STAFF: Certainly. Thank you for your patience.$$, $$Délai réaliste; alternative; ton 4★; exécution.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_LAUNDRY_08', 'HK_LAUNDRY_GUEST', 'MULTI_PROBLEM', 'B1', $$Blanchisserie express + client veut avant 18h + risque retard + communication.$$, $$Confirmer délai, proposer options (express payant, pressing externe), suivi.$$, $$CLIENT: I need this washed and back by 6 PM.
STAFF: Certainly. I will check the earliest possible delivery time.
STAFF: We can offer an express service, or an external pressing option if needed.
CLIENT: I don’t want delays.
STAFF: Understood. I will confirm within {time} minutes and keep you updated.$$, $$Gestion attente; options; pas de promesse; suivi.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_MINIBAR_09', 'HK_MINIBAR_CHECK', 'MULTI_PROBLEM', 'B1', $$Écart minibar détecté + client nie + départ imminent + coordination desk.$$, $$Ne pas accuser, documenter, informer réception, proposer vérification.$$, $$STAFF: Hello, may I confirm something about the minibar inventory?
CLIENT: I didn’t take anything.
STAFF: Understood. I’m not implying anything. I will document the check and ask reception to verify with you at check-out.
CLIENT: I’m leaving soon.
STAFF: Thank you. Reception will handle it and keep it as smooth as possible.$$, $$Neutralité; traçabilité; escalade desk; éviter conflit direct.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_EXTRA_10', 'HK_EXTRA_BED', 'MULTI_PROBLEM', 'B1', $$Demande lit supplémentaire + chambre petite + enfant dort + installation discrète.$$, $$Vérifier espace/sécurité, proposer alternative, coordonner timing.$$, $$CLIENT: Can you add an extra bed? The child is asleep.
STAFF: Of course. I will do this as quietly as possible.
STAFF: May I confirm where you would like it placed for safety?
CLIENT: Near the wall.
STAFF: Understood. I will set it up within {time} minutes, or we can schedule it for a better time if you prefer.$$, $$Discrétion; sécurité; délai; option scheduling.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_VIP_11', 'HK_VIP_SETUP', 'MULTI_PROBLEM', 'B1', $$Arrivée VIP dans 45 min + chambre pas prête + amenities manquants + coordination.$$, $$Prioriser, check-list, escalade, confirmer readiness au desk.$$, $$STAFF: We have a VIP arrival in 45 minutes and the room is not fully ready.
STAFF: I will prioritize the remaining tasks, complete the VIP amenities, and run a final checklist.
STAFF: I will update reception within {time} minutes with the room status.
MANAGER: Make sure everything is perfect.
STAFF: Understood. I will personally verify every detail.$$, $$Ownership; checklist; communication proactive; standard 4★.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_HK_PUBLIC_12', 'HK_PUBLIC_AREAS', 'MULTI_PROBLEM', 'B1', $$Lobby sale + client glisse presque + photo sur réseaux + urgence propreté + sécurité.$$, $$Sécuriser, nettoyer immédiatement, informer superviseur, prévention.$$, $$CLIENT: Someone almost slipped here. I’m taking a photo.
STAFF: I’m very sorry. For safety, please watch your step.
STAFF: I will place a warning sign and clean this area immediately.
CLIENT: This is not acceptable.
STAFF: I understand. Thank you for informing us. I will report it to my supervisor right away.$$, $$Sécurité; action immédiate; prévention; escalade.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

commit;