-- =====================================================
-- 012_gerer_appel_scenarios.sql
-- Scénarios téléphoniques — compétence gerer_appel
-- 1 scénario par métier = 4 scénarios
-- IDs : SCN_REC_WAKEUP_TEL, SCN_RST_ROOMSERVICE_01, SCN_HK_MAINT_TEL, SCN_SEC_URGENCE_TEL
-- Idempotent (ON CONFLICT DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- RÉCEPTION — appel entrant, problème de chambre
-- Action : REC_SERV_WAKEUP (+ REC_SERV_BOOKING en contexte)
-- =====================================================

INSERT INTO scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
VALUES (
  'SCN_REC_WAKEUP_TEL',
  'REC_SERV_WAKEUP',
  'TELEPHONE',
  'A2',
  $$Un client appelle la réception à 23h30 pour signaler que le chauffage de sa chambre ne fonctionne pas. Il demande également à programmer un réveil pour 6h00.$$,
  $$Répondre professionnellement à l''appel, gérer les deux demandes (problème technique + réveil), confirmer les actions prises et rassurer le client.$$,
  $$CLIENT: [Phone rings] Hello, this is room 412. My heating is not working and it's very cold.
STAFF: Front desk speaking. I'm sorry to hear that, Mr. / Ms. {name}. I will send someone to your room immediately.
CLIENT: Thank you. Also, can I have a wake-up call at 6 am?
STAFF: Of course. Your wake-up call is set for 6 am. Is there anything else I can help you with?
CLIENT: No, that's all. Thank you.
STAFF: You're welcome. I will follow up on the heating issue. Have a good night.$$,
  $$Réponse ouverte correcte (Front desk speaking) ; excuse immédiate ; deux demandes traitées dans le même appel ; confirmation du réveil avec l''heure exacte ; ton calme et professionnel tout au long.$$
)
ON CONFLICT (id) DO UPDATE SET
  action_id         = EXCLUDED.action_id,
  type_scenario     = EXCLUDED.type_scenario,
  niveau            = EXCLUDED.niveau,
  contexte          = EXCLUDED.contexte,
  objectif_salarie  = EXCLUDED.objectif_salarie,
  dialogue_modele   = EXCLUDED.dialogue_modele,
  criteres_reussite = EXCLUDED.criteres_reussite;

-- =====================================================
-- RESTAURANT — commande room service par téléphone
-- Action : FB_TAKE_ORDER
-- =====================================================

INSERT INTO scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
VALUES (
  'SCN_RST_ROOMSERVICE_01',
  'FB_TAKE_ORDER',
  'TELEPHONE',
  'A2',
  $$Un client appelle le room service depuis sa chambre à 20h. Il hésite entre deux plats et demande s''il est possible de supprimer un ingrédient. La connexion est légèrement mauvaise.$$,
  $$Prendre la commande clairement malgré la mauvaise connexion, aider le client dans son choix, vérifier l''ingrédient à supprimer auprès de la cuisine, reformuler la commande complète avant de raccrocher.$$,
  $$CLIENT: [Phone rings] Hello, I'd like to order something.
STAFF: Room service, good evening. How may I help you?
CLIENT: I'm not sure between the grilled chicken and the pasta. What do you recommend?
STAFF: Both are very popular. The grilled chicken comes with vegetables and rice. The pasta is our chef's special with a cream sauce.
CLIENT: I'll take the grilled chicken. But can you remove the rice, please?
STAFF: Of course. One grilled chicken without rice. May I have your room number, please?
CLIENT: Room 208.
STAFF: Thank you. To confirm: one grilled chicken, no rice, room 208. Is that correct?
CLIENT: Yes, perfect.
STAFF: Your order will be with you in approximately 25 minutes. Enjoy your evening.$$,
  $$Ouverture correcte (Room service, good evening) ; aide au choix sans imposer ; demande spéciale répercutée ; reformulation complète avant clôture ; délai communiqué clairement.$$
)
ON CONFLICT (id) DO UPDATE SET
  action_id         = EXCLUDED.action_id,
  type_scenario     = EXCLUDED.type_scenario,
  niveau            = EXCLUDED.niveau,
  contexte          = EXCLUDED.contexte,
  objectif_salarie  = EXCLUDED.objectif_salarie,
  dialogue_modele   = EXCLUDED.dialogue_modele,
  criteres_reussite = EXCLUDED.criteres_reussite;

-- =====================================================
-- HOUSEKEEPING — appel interne à la maintenance
-- Action : HK_MAINT_REQUEST
-- =====================================================

INSERT INTO scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
VALUES (
  'SCN_HK_MAINT_TEL',
  'HK_MAINT_REQUEST',
  'TELEPHONE',
  'A2',
  $$En faisant le nettoyage de la chambre 315, l''agent de Housekeeping découvre une fuite d''eau sous le lavabo de la salle de bain. Il doit appeler la maintenance interne pour signaler le problème.$$,
  $$Passer un appel professionnel à la maintenance, décrire le problème clairement (lieu, nature, urgence), rester en ligne si demandé, et informer le client de l''intervention.$$,
  $$[HOUSEKEEPING calls MAINTENANCE]
MAINTENANCE: Maintenance, hello.
STAFF: Good morning, this is Housekeeping. I'm in room 315. There is a water leak under the bathroom sink. It seems to be getting worse.
MAINTENANCE: Understood. How serious is it?
STAFF: There is water on the floor. It looks like a pipe issue. Can you come as soon as possible?
MAINTENANCE: I'll send someone in 10 minutes.
STAFF: Thank you. I will secure the area and inform the guest.
[STAFF informs the guest]
STAFF: I'm sorry for the inconvenience. Our maintenance team will be here in about 10 minutes to fix the issue.$$,
  $$Identification claire (Housekeeping, room 315) ; description précise du problème (fuite, localisation) ; évaluation de l''urgence ; confirmation du délai d''intervention ; information transmise au client.$$
)
ON CONFLICT (id) DO UPDATE SET
  action_id         = EXCLUDED.action_id,
  type_scenario     = EXCLUDED.type_scenario,
  niveau            = EXCLUDED.niveau,
  contexte          = EXCLUDED.contexte,
  objectif_salarie  = EXCLUDED.objectif_salarie,
  dialogue_modele   = EXCLUDED.dialogue_modele,
  criteres_reussite = EXCLUDED.criteres_reussite;

-- =====================================================
-- SÉCURITÉ — appel d'urgence médicale
-- Action : SEC_EMERGENCY_MEDICAL
-- =====================================================

INSERT INTO scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
VALUES (
  'SCN_SEC_URGENCE_TEL',
  'SEC_EMERGENCY_MEDICAL',
  'TELEPHONE',
  'B1',
  $$Un agent de sécurité reçoit un appel d''un client signalant qu''un autre client s''est évanoui dans le couloir du 3e étage. L''agent doit coordonner l''urgence : appel des secours, maintien du calme, envoi d''un collègue sur place.$$,
  $$Recueillir les informations précises, appeler les secours avec les éléments clés (adresse, étage, état de la personne), rassurer le témoin, coordonner l''équipe interne.$$,
  $$CLIENT: [Phone rings] Hello! Someone just fainted in the corridor on the third floor!
STAFF: Security speaking. Can you confirm the location — which floor and which end of the corridor?
CLIENT: Third floor, near the elevator. He's not moving!
STAFF: I understand. Please stay with him and do not move him. I am calling emergency services right now and sending a colleague immediately.
[STAFF calls emergency services]
STAFF: This is Hotel {name}, security team. We have a medical emergency — a guest has lost consciousness on the third floor, near the elevator. The address is {address}. Please send an ambulance urgently.
EMERGENCY: Understood. We are dispatching now. Keep the area clear.
STAFF: Thank you. [Returns to first caller] Help is on the way. Please keep him comfortable and do not leave him alone.$$,
  $$Recueil rapide des informations précises (étage, position) ; appel secours avec hôtel + adresse + état de la victime ; instructions claires au témoin ; coordination interne mentionnée ; calme maintenu tout au long.$$
)
ON CONFLICT (id) DO UPDATE SET
  action_id         = EXCLUDED.action_id,
  type_scenario     = EXCLUDED.type_scenario,
  niveau            = EXCLUDED.niveau,
  contexte          = EXCLUDED.contexte,
  objectif_salarie  = EXCLUDED.objectif_salarie,
  dialogue_modele   = EXCLUDED.dialogue_modele,
  criteres_reussite = EXCLUDED.criteres_reussite;

COMMIT;
