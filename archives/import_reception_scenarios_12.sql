begin;
-- 12 scénarios multi-problèmes (Réception 4 étoiles)
insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CI_EARLY_01', 'REC_CI_EARLY', 'MULTI_PROBLEM', 'B1', $$Arrivée 11h. Chambre non prête + client VIP + demande de douche immédiate.$$, $$Gérer l'attente avec empathie, proposer alternatives, préserver la relation.$$, $$CLIENT: I requested an early check-in. I need a shower now.
STAFF: I completely understand your concern. Please accept our sincere apologies for the inconvenience.
STAFF: Your room is still being prepared, but we can store your luggage securely and offer you access to the fitness area and showers.
CLIENT: How long will it take?
STAFF: I will personally take care of this for you. I will update you within {time} minutes.
CLIENT: Fine. And can you arrange a coffee?
STAFF: Certainly. May I offer you a complimentary coffee while you wait?$$, $$Empathie avant solution; proposer 2 alternatives concrètes; donner un délai et un suivi; ton 4 étoiles.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_SERV_MAINTENANCE_02', 'REC_SERV_MAINTENANCE', 'MULTI_PROBLEM', 'B1', $$Panne Wi-Fi + client en visioconférence + demande de solution immédiate + proposition de compensation.$$, $$Diagnostiquer, proposer workaround, escalader maintenance, assurer suivi et compensation appropriée.$$, $$CLIENT: The Wi-Fi is down and I have a meeting in 10 minutes.
STAFF: I completely understand your concern. Please accept our sincere apologies for the inconvenience.
STAFF: I will send a technician immediately. In the meantime, we can provide a mobile hotspot at the front desk.
CLIENT: I need it in my room.
STAFF: Thank you for your patience. I will update you within {time} minutes and call you as soon as it is stable.
CLIENT: If not, I want to change rooms.
STAFF: Of course. If needed, we can arrange a room change right away.$$, $$Proposer une solution temporaire; escalade claire; suivi; option room change; pas de promesse impossible.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_PROB_CLEAN_03', 'REC_PROB_CLEAN', 'MULTI_PROBLEM', 'B1', $$Chambre sale + client très irrité + hôtel presque complet + service recovery.$$, $$S'excuser, proposer rectification immédiate, offrir geste commercial, sécuriser solution malgré contrainte.$$, $$CLIENT: There are hairs in the bathroom. This is unacceptable.
STAFF: Please accept our sincere apologies for the inconvenience.
STAFF: I will personally take care of this for you. I will send Housekeeping immediately and have the room checked.
CLIENT: I want to move rooms now.
STAFF: I completely understand your concern. If a room is available, we will move you. If not, we will deep-clean your room as a priority and offer you a complimentary refreshment while you wait.
CLIENT: How long?
STAFF: I will have this resolved within {time} minutes, and I will update you shortly.$$, $$Excuses + ownership; alternatives si pas de room; délai; compensation proportionnée.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_PROB_NOISE_04', 'REC_PROB_NOISE', 'MULTI_PROBLEM', 'B1', $$Plainte bruit 23h + voisin refuse de se calmer + client menace de laisser un mauvais avis.$$, $$Désamorcer, agir (sécurité), proposer chambre alternative, protéger réputation.$$, $$CLIENT: I can't sleep. If this continues, I will leave a terrible review.
STAFF: I completely understand your concern, and I''m truly sorry for the disturbance.
STAFF: I will contact the room immediately and send security to the floor.
CLIENT: I want this solved now.
STAFF: Thank you for your patience. If it does not stop, we can move you to a quieter room and adjust your folio as a gesture of goodwill.
CLIENT: Do it.
STAFF: Certainly. May I confirm your room number, please?$$, $$Action immédiate; option room move; geste commercial; collecte infos; suivi.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_PROB_BILL_05', 'REC_PROB_BILL', 'MULTI_PROBLEM', 'B1', $$Contestations minibar + client pressé pour départ + demande manager + solution rapide.$$, $$Vérifier, désamorcer, proposer suppression provisoire, documenter, finaliser paiement.$$, $$CLIENT: I did not take anything from the minibar. I''m leaving now.
STAFF: I understand, and I''m sorry for the inconvenience.
STAFF: Please allow me a moment to check with Housekeeping.
CLIENT: No time. Remove it.
STAFF: I will temporarily remove the charge so you can leave on time, and I will follow up today.
CLIENT: I want the manager.
STAFF: Of course. I will call the manager while I finalize your check-out.$$, $$Priorité au temps client; solution provisoire; traçabilité; escalade calme.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CO_INVOICE_06', 'REC_CO_INVOICE', 'MULTI_PROBLEM', 'B1', $$Split bill + facture société + client pressé + erreur de saisie à corriger.$$, $$Collecter infos, produire 2 factures, corriger erreur, garder ton professionnel.$$, $$CLIENT: I need two invoices. Company on one, personal on the other.
STAFF: Certainly. Could you confirm the company name and billing address, please?
CLIENT: Here. Also, I''m in a hurry.
STAFF: Thank you. Please accept my apologies, this will take a few minutes to adjust the system.
CLIENT: And remove the city tax from the company invoice.
STAFF: Understood. I will separate the taxes and provide a detailed folio for your records.$$, $$Collecte données; annonce délai; correction sans débat; livraison folio détaillé.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CI_ADMIN_07', 'REC_CI_ADMIN', 'MULTI_PROBLEM', 'B1', $$Carte refusée + client insiste 'chambre déjà payée' + besoin garantie + solution alternative.$$, $$Expliquer la préautorisation, demander autre carte, proposer dépôt alternatif selon politique.$$, $$CLIENT: The room is prepaid. Why do you need my card?
STAFF: I understand. This is only a pre-authorization for incidental charges.
CLIENT: My card was declined.
STAFF: I''m sorry for the inconvenience. May I try another card, please?
CLIENT: I only have this one.
STAFF: Thank you. In that case, we can proceed with a cash deposit according to policy, or we can limit incidentals on the room.
CLIENT: Fine. How much?
STAFF: We require {amount} {currency}, released at check-out.$$, $$Explication claire; pas de confrontation; options conformes; garder le contrôle.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_PROB_KEY_08', 'REC_PROB_KEY', 'MULTI_PROBLEM', 'B1', $$Client bloqué 1h du matin + pas d'ID sur lui + énervement + approche sécuritaire.$$, $$Assurer sécurité, vérifier identité par infos dossier, escorter, recoder carte.$$, $$CLIENT: I''m locked out and I don''t have my ID.
STAFF: I completely understand your concern. For your security, I need to verify your identity.
STAFF: Could you confirm your full name and check-out date, please?
CLIENT: {guest_name}, checking out tomorrow.
STAFF: Thank you. I will escort you to your room to open the door and then issue a new key card.
CLIENT: This is the third time.
STAFF: Please accept our sincere apologies for the inconvenience. I will have the lock checked.$$, $$Sécurité d'abord; vérification; escort; excuse; action corrective.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_PROB_MISSING_09', 'REC_PROB_MISSING', 'MULTI_PROBLEM', 'B1', $$Passeport manquant + client panique + départ le lendemain + procédure et assistance.$$, $$Rassurer, lancer recherche, formaliser incident, orienter vers démarches officielles.$$, $$CLIENT: My passport is missing. I fly tomorrow.
STAFF: I completely understand your concern. Please accept our sincere apologies for the stress.
STAFF: Could you tell me where you last saw it?
CLIENT: In my room, I think.
STAFF: Thank you. I will alert security and Housekeeping immediately and start the search.
CLIENT: What if it''s stolen?
STAFF: We can file an incident report and help you contact the authorities and your embassy if needed.
CLIENT: Please do.$$, $$Rassurer; collecte infos; action immédiate; assistance démarches; suivi.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CO_LATE_10', 'REC_CO_LATE', 'MULTI_PROBLEM', 'B1', $$Late check-out refusé (hotel complet) + proposition alternatives + client contrarié.$$, $$Refuser poliment, proposer bagagerie, espace d'attente, douche, suivi.$$, $$CLIENT: I need the room until 6 PM.
STAFF: I understand. Unfortunately, we are unable to extend that late today due to full occupancy.
CLIENT: That''s not acceptable.
STAFF: I completely understand your concern. We can store your luggage, and you are welcome to use the lobby area. If you wish, we can also arrange access to a changing area.
CLIENT: And what about a shower?
STAFF: I will check what we can arrange and update you shortly.$$, $$Refus indirect; alternatives; empathie; proposition concrète; pas d'argumentation.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CI_WALKIN_11', 'REC_CI_WALKIN', 'MULTI_PROBLEM', 'B1', $$Client walk-in + dernière chambre + demande de discount + upsell discret.$$, $$Annoncer tarif, proposer options, sécuriser décision rapide sans agressivité.$$, $$CLIENT: Do you have a room tonight?
STAFF: Certainly. We have one room available.
CLIENT: Can you give me a better price?
STAFF: I understand. The best available rate tonight is {amount} {currency}. If you prefer, I can also offer a higher category with breakfast included at a small supplement.
CLIENT: I just want something quiet.
STAFF: Of course. I can allocate a quiet room and complete the check-in in under two minutes.
CLIENT: Okay.$$, $$Clarté tarif; options; upsell non intrusif; focus besoin client.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_REC_CO_STANDARD_12', 'REC_CO_STANDARD', 'MULTI_PROBLEM', 'B1', $$Check-out + dispute minibar + taxi urgent + clôture rapide.$$, $$Prioriser timing, retirer ligne provisoirement, organiser taxi, assurer suivi.$$, $$CLIENT: I''m late for the airport. This minibar charge is wrong.
STAFF: I understand, and I''m sorry for the inconvenience.
STAFF: I will temporarily remove the charge so you can leave on time, and I will follow up today.
CLIENT: Fine, but I need a taxi now.
STAFF: Certainly. I am calling a taxi immediately. Would you like the receipt by email?
CLIENT: Yes.
STAFF: Thank you. Have a safe trip.$$, $$Solution rapide; service additionnel; clôture polie; suivi.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

commit;