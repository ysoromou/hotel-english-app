-- =====================================================
-- 006_action_competence_mapping.sql
-- Pont contenu ↔ 15 compétences transversales
-- action_id → competence_code + poids (1–3)
-- Règle : 2 à 4 compétences max par action
-- Idempotent (upsert sur UNIQUE action_id + competence_code)
--
-- Poids :
--   3 = compétence centrale — l'action tourne autour d'elle
--   2 = compétence importante — mobilisée directement
--   1 = compétence secondaire — contexte ou support
--
-- Principe de pondération retenu :
-- - Une action a 1 compétence centrale max (poids 3)
-- - Exception : situations de double enjeu réel (ex : plainte = gérer + proposer)
-- - Pas de poids 1 sauf si la compétence est réellement présente
--   mais non centrale (contexte d'interaction)
-- - Les actions purement internes (checklist, nettoyage sans client)
--   ont seulement 1–2 compétences liées au vocabulaire professionnel
--
-- Grille de référence des 15 codes :
--   accueillir_client          Accueillir un client en anglais
--   comprendre_demande         Comprendre une demande simple à l'oral
--   repondre_demande           Répondre à une demande simple
--   donner_information         Donner une information claire
--   orienter_client            Orienter un client ou indiquer une direction
--   verifier_information       Vérifier une information ou une demande
--   reformuler_confirmer       Reformuler pour valider la compréhension
--   gerer_reclamation          Gérer une réclamation simple
--   proposer_solution          Proposer une solution adaptée
--   gerer_situation_difficile  Gérer une situation difficile ou incompréhension
--   utiliser_vocabulaire_metier Utiliser le vocabulaire métier en situation
--   maintenir_echange_fluide   Maintenir un échange fluide avec le client
--   gerer_appel                Gérer un échange téléphonique simple
--   conclure_interaction       Clôturer un échange de manière professionnelle
--   dire_non_professionnellement Refuser ou poser une limite professionnelle
-- =====================================================

CREATE TABLE IF NOT EXISTS action_competence_mapping (
    id               BIGSERIAL PRIMARY KEY,
    action_id        TEXT NOT NULL REFERENCES actions_metier(id) ON DELETE CASCADE,
    competence_code  TEXT NOT NULL CHECK (competence_code IN (
        'accueillir_client',
        'comprendre_demande',
        'repondre_demande',
        'donner_information',
        'orienter_client',
        'verifier_information',
        'reformuler_confirmer',
        'gerer_reclamation',
        'proposer_solution',
        'gerer_situation_difficile',
        'utiliser_vocabulaire_metier',
        'maintenir_echange_fluide',
        'gerer_appel',
        'conclure_interaction',
        'dire_non_professionnellement'
    )),
    poids            SMALLINT NOT NULL DEFAULT 1 CHECK (poids BETWEEN 1 AND 3),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (action_id, competence_code)
);

CREATE INDEX IF NOT EXISTS idx_acm_action     ON action_competence_mapping(action_id);
CREATE INDEX IF NOT EXISTS idx_acm_competence ON action_competence_mapping(competence_code);

ALTER TABLE action_competence_mapping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture mapping authentifié" ON action_competence_mapping;
CREATE POLICY "Lecture mapping authentifié" ON action_competence_mapping
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- SEED : RÉCEPTION (20 actions — REC_*)
-- =====================================================

INSERT INTO action_competence_mapping (action_id, competence_code, poids) VALUES

-- REC_CI_STANDARD : Check-in standard
-- Cœur : accueillir + vérifier identité/réservation + conclure remise de clé
('REC_CI_STANDARD', 'accueillir_client',           3),
('REC_CI_STANDARD', 'verifier_information',        2),
('REC_CI_STANDARD', 'conclure_interaction',        2),

-- REC_CI_ADMIN : Formalités administratives
-- Cœur : vérifier pièce/carte + expliquer la préautorisation
('REC_CI_ADMIN',    'verifier_information',        3),
('REC_CI_ADMIN',    'donner_information',          2),

-- REC_CI_EARLY : Arrivée anticipée (chambre non prête)
-- Cœur : gérer la déception + proposer alternative
-- Double enjeu réel → 2 poids=3 justifiés
('REC_CI_EARLY',    'gerer_situation_difficile',   3),
('REC_CI_EARLY',    'proposer_solution',           3),
('REC_CI_EARLY',    'dire_non_professionnellement',2),

-- REC_CI_WALKIN : Client sans réservation
-- Cœur : comprendre la demande + informer disponibilité
('REC_CI_WALKIN',   'comprendre_demande',          3),
('REC_CI_WALKIN',   'donner_information',          2),
('REC_CI_WALKIN',   'proposer_solution',           2),

-- REC_CI_UPGRADE : Proposition de surclassement
-- Cœur : proposer + vocabulaire commercial
('REC_CI_UPGRADE',  'proposer_solution',           3),
('REC_CI_UPGRADE',  'utiliser_vocabulaire_metier', 2),

-- REC_INFO_FACILITIES : Informations services de l'hôtel
-- Cœur : donner information claire + vocabulaire hôtelier
('REC_INFO_FACILITIES', 'donner_information',          3),
('REC_INFO_FACILITIES', 'utiliser_vocabulaire_metier', 2),

-- REC_INFO_DIRECTIONS : Directions et transports
-- Cœur : orienter + indiquer un chemin
('REC_INFO_DIRECTIONS', 'orienter_client',         3),
('REC_INFO_DIRECTIONS', 'donner_information',      2),

-- REC_SERV_BOOKING : Réservation externe (restaurant/activité)
-- Cœur : comprendre la demande + confirmer par téléphone
('REC_SERV_BOOKING', 'comprendre_demande',         3),
('REC_SERV_BOOKING', 'reformuler_confirmer',       2),
('REC_SERV_BOOKING', 'gerer_appel',               2),

-- REC_SERV_WAKEUP : Réveil et messages
-- Cœur : comprendre heure + confirmer
('REC_SERV_WAKEUP', 'comprendre_demande',          3),
('REC_SERV_WAKEUP', 'reformuler_confirmer',        2),

-- REC_SERV_MAINTENANCE : Signalement problème technique
-- Cœur : comprendre le problème signalé
('REC_SERV_MAINTENANCE', 'comprendre_demande',     3),
('REC_SERV_MAINTENANCE', 'proposer_solution',      2),

-- REC_PROB_NOISE : Plainte bruit
-- Double enjeu : gérer la plainte + proposer solution concrète
('REC_PROB_NOISE',  'gerer_reclamation',           3),
('REC_PROB_NOISE',  'proposer_solution',           3),
('REC_PROB_NOISE',  'maintenir_echange_fluide',    2),

-- REC_PROB_CLEAN : Plainte propreté
-- Double enjeu : gérer + proposer (même structure que bruit)
('REC_PROB_CLEAN',  'gerer_reclamation',           3),
('REC_PROB_CLEAN',  'proposer_solution',           3),

-- REC_PROB_BILL : Contestation facture
-- Cœur : gérer la contestation + vérifier avant décision
('REC_PROB_BILL',   'gerer_reclamation',           3),
('REC_PROB_BILL',   'verifier_information',        2),
('REC_PROB_BILL',   'dire_non_professionnellement',2),

-- REC_PROB_KEY : Clé démagnétisée / accès refusé
-- Cœur : vérifier identité avant de donner accès (sécurité)
('REC_PROB_KEY',    'verifier_information',        3),
('REC_PROB_KEY',    'dire_non_professionnellement',2),

-- REC_PROB_MISSING : Objet perdu ou volé
-- Cœur : gérer l'urgence émotionnelle + rassurer
('REC_PROB_MISSING','gerer_reclamation',           3),
('REC_PROB_MISSING','gerer_situation_difficile',   2),

-- REC_CO_STANDARD : Check-out standard
-- Cœur : conclure proprement + vérifier facture
('REC_CO_STANDARD', 'conclure_interaction',        3),
('REC_CO_STANDARD', 'verifier_information',        2),

-- REC_CO_INVOICE : Facturation complexe / split
-- Cœur : expliquer et reformuler la facture
('REC_CO_INVOICE',  'donner_information',          3),
('REC_CO_INVOICE',  'reformuler_confirmer',        2),
('REC_CO_INVOICE',  'verifier_information',        2),

-- REC_CO_LATE : Demande de départ tardif
-- Cœur : dire non + proposer alternative
('REC_CO_LATE',     'dire_non_professionnellement',3),
('REC_CO_LATE',     'proposer_solution',           2),

-- REC_CO_LUGGAGE : Bagagerie départ
-- Action courte et simple : répondre + conclure
('REC_CO_LUGGAGE',  'repondre_demande',            3),
('REC_CO_LUGGAGE',  'conclure_interaction',        2),

-- REC_CO_FEEDBACK : Recueillir avis client
-- Cœur : clôturer l'échange + écouter
('REC_CO_FEEDBACK', 'conclure_interaction',        3),
('REC_CO_FEEDBACK', 'comprendre_demande',          2)

ON CONFLICT (action_id, competence_code) DO UPDATE SET poids = EXCLUDED.poids;

-- =====================================================
-- SEED : HOUSEKEEPING (20 actions — HK_*)
-- Note : plusieurs actions sont internes (nettoyage, checklist)
-- sans interaction client directe — mapping réduit à 1–2 compétences.
-- =====================================================

INSERT INTO action_competence_mapping (action_id, competence_code, poids) VALUES

-- HK_ROOM_CLEAN : Nettoyage chambre standard
-- Action principalement opérationnelle — vocabulaire métier si client présent
('HK_ROOM_CLEAN',    'utiliser_vocabulaire_metier', 2),
('HK_ROOM_CLEAN',    'repondre_demande',            2),

-- HK_TURNDOWN : Service couverture (turndown)
-- Interaction brève : accueillir + conclure discrètement
('HK_TURNDOWN',      'accueillir_client',           2),
('HK_TURNDOWN',      'conclure_interaction',        2),

-- HK_LINEN_CHANGE : Changement linge et serviettes
-- Comprendre la demande spécifique du client
('HK_LINEN_CHANGE',  'comprendre_demande',          3),
('HK_LINEN_CHANGE',  'repondre_demande',            2),

-- HK_AMENITIES : Réassort amenities
-- Répondre à la demande + vocabulaire salle de bain
('HK_AMENITIES',     'repondre_demande',            3),
('HK_AMENITIES',     'utiliser_vocabulaire_metier', 2),

-- HK_MINIBAR_CHECK : Contrôle minibar
-- Action interne — vérification + signalement (pas de client)
('HK_MINIBAR_CHECK', 'verifier_information',        3),
('HK_MINIBAR_CHECK', 'utiliser_vocabulaire_metier', 2),

-- HK_DND : Gestion Do Not Disturb
-- Cœur : dire non au client ou replanifier poliment
('HK_DND',           'dire_non_professionnellement',3),
('HK_DND',           'maintenir_echange_fluide',    2),

-- HK_LATE_SERVICE : Demande tardive (après 20h)
-- Répondre à la demande urgente + gérer l'attente
('HK_LATE_SERVICE',  'repondre_demande',            3),
('HK_LATE_SERVICE',  'gerer_situation_difficile',   2),

-- HK_LOST_FOUND : Objet trouvé / perdu
-- Vérifier propriété + informer le desk
('HK_LOST_FOUND',    'verifier_information',        3),
('HK_LOST_FOUND',    'donner_information',          2),

-- HK_DAMAGE_REPORT : Signalement dégât / casse
-- Décrire et signaler — vocabulaire technique
('HK_DAMAGE_REPORT', 'donner_information',          3),
('HK_DAMAGE_REPORT', 'utiliser_vocabulaire_metier', 2),

-- HK_MAINT_REQUEST : Demande maintenance urgente
-- Comprendre le problème + escalader
('HK_MAINT_REQUEST', 'comprendre_demande',          3),
('HK_MAINT_REQUEST', 'proposer_solution',           2),

-- HK_STAIN_COMPLAINT : Plainte tache / linge sale
-- Gérer la plainte + proposer remplacement immédiat
('HK_STAIN_COMPLAINT','gerer_reclamation',          3),
('HK_STAIN_COMPLAINT','proposer_solution',          2),

-- HK_ODOR_SMELL : Plainte odeur
-- Double enjeu : gérer + proposer déplacement de chambre
('HK_ODOR_SMELL',    'gerer_reclamation',           3),
('HK_ODOR_SMELL',    'proposer_solution',           3),

-- HK_BATHROOM_ISSUE : Problème salle de bain
-- Gérer la plainte + vocabulaire technique
('HK_BATHROOM_ISSUE','gerer_reclamation',           3),
('HK_BATHROOM_ISSUE','utiliser_vocabulaire_metier', 2),

-- HK_PUBLIC_AREAS : Nettoyage parties communes
-- Action interne sans client direct
('HK_PUBLIC_AREAS',  'utiliser_vocabulaire_metier', 2),

-- HK_LAUNDRY_GUEST : Blanchisserie client express
-- Comprendre + confirmer délais
('HK_LAUNDRY_GUEST', 'comprendre_demande',          3),
('HK_LAUNDRY_GUEST', 'reformuler_confirmer',        2),

-- HK_EXTRA_BED : Lit supplémentaire
-- Répondre + vocabulaire hôtelier
('HK_EXTRA_BED',     'repondre_demande',            3),
('HK_EXTRA_BED',     'utiliser_vocabulaire_metier', 2),

-- HK_BABY_COT : Lit bébé
-- Même structure que HK_EXTRA_BED
('HK_BABY_COT',      'repondre_demande',            3),
('HK_BABY_COT',      'utiliser_vocabulaire_metier', 2),

-- HK_VIP_SETUP : Préparation VIP
-- Action principalement opérationnelle — vocabulaire premium
('HK_VIP_SETUP',     'utiliser_vocabulaire_metier', 3),
('HK_VIP_SETUP',     'conclure_interaction',        2),

-- HK_SUPPLIES : Demande consommables
-- Comprendre + répondre
('HK_SUPPLIES',      'comprendre_demande',          3),
('HK_SUPPLIES',      'repondre_demande',            2),

-- HK_CHECKLIST : Contrôle qualité / checklist
-- Action interne — vérification uniquement
('HK_CHECKLIST',     'verifier_information',        3),
('HK_CHECKLIST',     'utiliser_vocabulaire_metier', 2)

ON CONFLICT (action_id, competence_code) DO UPDATE SET poids = EXCLUDED.poids;

-- =====================================================
-- SEED : RESTAURANT (20 actions — FB_*)
-- =====================================================

INSERT INTO action_competence_mapping (action_id, competence_code, poids) VALUES

-- FB_GREET_GUEST : Accueil et salutation
-- Cœur : accueillir + maintenir le ton
('FB_GREET_GUEST',         'accueillir_client',           3),
('FB_GREET_GUEST',         'maintenir_echange_fluide',    2),

-- FB_SEATING_GUEST : Placement à table
-- Cœur : orienter vers la table
('FB_SEATING_GUEST',       'orienter_client',             3),
('FB_SEATING_GUEST',       'accueillir_client',           2),

-- FB_PRESENT_MENU : Présentation du menu
-- Cœur : donner information + vocabulaire culinaire
('FB_PRESENT_MENU',        'donner_information',          3),
('FB_PRESENT_MENU',        'utiliser_vocabulaire_metier', 2),

-- FB_TAKE_ORDER : Prise de commande
-- Double enjeu : comprendre + reformuler pour éviter erreur
('FB_TAKE_ORDER',          'comprendre_demande',          3),
('FB_TAKE_ORDER',          'reformuler_confirmer',        3),

-- FB_CONFIRM_ORDER : Confirmation de commande
-- Cœur : reformuler avant envoi en cuisine
('FB_CONFIRM_ORDER',       'reformuler_confirmer',        3),
('FB_CONFIRM_ORDER',       'verifier_information',        2),

-- FB_SPECIAL_REQUEST : Demande spéciale / substitution
-- Cœur : comprendre + reformuler pour valider
('FB_SPECIAL_REQUEST',     'comprendre_demande',          3),
('FB_SPECIAL_REQUEST',     'reformuler_confirmer',        2),

-- FB_ALLERGY_CHECK : Allergies et restrictions
-- Cœur : vérifier + informer (enjeu sécurité alimentaire)
('FB_ALLERGY_CHECK',       'verifier_information',        3),
('FB_ALLERGY_CHECK',       'donner_information',          2),

-- FB_UPSELL_DRINKS : Proposition boissons / apéritif
-- Cœur : proposer avec vocabulaire adapté
('FB_UPSELL_DRINKS',       'proposer_solution',           3),
('FB_UPSELL_DRINKS',       'utiliser_vocabulaire_metier', 2),

-- FB_UPSELL_DESSERT : Proposition desserts / café
-- Même structure que FB_UPSELL_DRINKS
('FB_UPSELL_DESSERT',      'proposer_solution',           3),
('FB_UPSELL_DESSERT',      'utiliser_vocabulaire_metier', 2),

-- FB_WINE_RECOMMENDATION : Recommandation vins
-- Cœur : donner information experte + vocabulaire spécialisé
('FB_WINE_RECOMMENDATION', 'donner_information',          3),
('FB_WINE_RECOMMENDATION', 'utiliser_vocabulaire_metier', 3),

-- FB_DELAY_APOLOGY : Retard de service / excuses
-- Cœur : gérer l'insatisfaction + informer délai
('FB_DELAY_APOLOGY',       'gerer_reclamation',           3),
('FB_DELAY_APOLOGY',       'donner_information',          2),

-- FB_WRONG_ORDER : Commande incorrecte
-- Double enjeu : gérer + proposer correction
('FB_WRONG_ORDER',         'gerer_reclamation',           3),
('FB_WRONG_ORDER',         'proposer_solution',           3),

-- FB_COLD_FOOD_COMPLAINT : Plat froid / qualité
-- Double enjeu : gérer + proposer remplacement
('FB_COLD_FOOD_COMPLAINT', 'gerer_reclamation',           3),
('FB_COLD_FOOD_COMPLAINT', 'proposer_solution',           2),

-- FB_BILL_REQUEST : Demande d'addition
-- Action courte : répondre + vocabulaire paiement
('FB_BILL_REQUEST',        'repondre_demande',            3),
('FB_BILL_REQUEST',        'utiliser_vocabulaire_metier', 2),

-- FB_SPLIT_BILL : Addition séparée / split bill
-- Cœur : comprendre la répartition + reformuler
('FB_SPLIT_BILL',          'comprendre_demande',          3),
('FB_SPLIT_BILL',          'reformuler_confirmer',        2),

-- FB_PAYMENT_CARD_ISSUE : Carte refusée
-- Gérer la situation difficile + proposer alternative
('FB_PAYMENT_CARD_ISSUE',  'gerer_situation_difficile',   3),
('FB_PAYMENT_CARD_ISSUE',  'proposer_solution',           2),

-- FB_GROUP_RESERVATION : Réservation groupe
-- Comprendre les contraintes multiples + reformuler
('FB_GROUP_RESERVATION',   'comprendre_demande',          3),
('FB_GROUP_RESERVATION',   'reformuler_confirmer',        2),

-- FB_VIP_TABLE : Table VIP
-- Accueillir avec niveau de service élevé
('FB_VIP_TABLE',           'accueillir_client',           3),
('FB_VIP_TABLE',           'utiliser_vocabulaire_metier', 2),

-- FB_CHILD_MENU : Enfants / menu enfant
-- Répondre à la demande + vocabulaire adapté
('FB_CHILD_MENU',          'repondre_demande',            3),
('FB_CHILD_MENU',          'utiliser_vocabulaire_metier', 2),

-- FB_FEEDBACK_REQUEST : Recueillir avis client
-- Clôturer l'expérience + écouter
('FB_FEEDBACK_REQUEST',    'conclure_interaction',        3),
('FB_FEEDBACK_REQUEST',    'comprendre_demande',          2)

ON CONFLICT (action_id, competence_code) DO UPDATE SET poids = EXCLUDED.poids;

-- =====================================================
-- SEED : SÉCURITÉ (20 actions — SEC_*)
-- =====================================================

INSERT INTO action_competence_mapping (action_id, competence_code, poids) VALUES

-- SEC_ACCESS_CONTROL : Contrôle d'accès / entrée
-- Cœur : dire non avec fermeté + vérifier
('SEC_ACCESS_CONTROL',       'dire_non_professionnellement',3),
('SEC_ACCESS_CONTROL',       'verifier_information',        2),

-- SEC_ID_VERIFICATION : Vérification d'identité
-- Cœur : vérifier + informer la procédure
('SEC_ID_VERIFICATION',      'verifier_information',        3),
('SEC_ID_VERIFICATION',      'donner_information',          2),

-- SEC_ROOM_ESCORT : Escorter un client
-- Orienter + maintenir le contact discret
('SEC_ROOM_ESCORT',          'orienter_client',             3),
('SEC_ROOM_ESCORT',          'maintenir_echange_fluide',    2),

-- SEC_NOISE_COMPLAINT : Plainte de bruit / fête
-- Double enjeu : gérer la tension + faire respecter la règle
('SEC_NOISE_COMPLAINT',      'gerer_situation_difficile',   3),
('SEC_NOISE_COMPLAINT',      'dire_non_professionnellement',3),

-- SEC_SUSPICIOUS_PERSON : Personne suspecte
-- Gérer la situation tendue en restant professionnel
('SEC_SUSPICIOUS_PERSON',    'gerer_situation_difficile',   3),
('SEC_SUSPICIOUS_PERSON',    'maintenir_echange_fluide',    2),

-- SEC_THEFT_REPORT : Déclaration de vol
-- Recueillir les faits + informer la procédure
('SEC_THEFT_REPORT',         'comprendre_demande',          3),
('SEC_THEFT_REPORT',         'donner_information',          2),

-- SEC_LOST_FOUND : Objets trouvés / perdus
-- Vérifier la propriété + informer
('SEC_LOST_FOUND',           'verifier_information',        3),
('SEC_LOST_FOUND',           'donner_information',          2),

-- SEC_EMERGENCY_MEDICAL : Urgence médicale
-- Double enjeu : gérer l'urgence + maintenir le calme
('SEC_EMERGENCY_MEDICAL',    'gerer_situation_difficile',   3),
('SEC_EMERGENCY_MEDICAL',    'maintenir_echange_fluide',    3),

-- SEC_FIRE_ALARM : Alarme incendie
-- Orienter en urgence + maintenir le calme
('SEC_FIRE_ALARM',           'orienter_client',             3),
('SEC_FIRE_ALARM',           'maintenir_echange_fluide',    2),

-- SEC_EVACUATION : Évacuation / point de rassemblement
-- Double enjeu : orienter + gérer l'urgence collective
('SEC_EVACUATION',           'orienter_client',             3),
('SEC_EVACUATION',           'gerer_situation_difficile',   2),

-- SEC_CROWD_CONTROL : Gestion de foule / événement
-- Gérer la tension + poser des limites
('SEC_CROWD_CONTROL',        'gerer_situation_difficile',   3),
('SEC_CROWD_CONTROL',        'dire_non_professionnellement',2),

-- SEC_PARKING_ASSIST : Assistance parking
-- Orienter + répondre à la demande
('SEC_PARKING_ASSIST',       'orienter_client',             3),
('SEC_PARKING_ASSIST',       'repondre_demande',            2),

-- SEC_KEY_CONTROL : Contrôle des clés / cartes
-- Vérifier avant d'agir + dire non si non conforme
('SEC_KEY_CONTROL',          'verifier_information',        3),
('SEC_KEY_CONTROL',          'dire_non_professionnellement',2),

-- SEC_INCIDENT_REPORT : Rapport d'incident
-- Formuler clairement les faits — vocabulaire technique
('SEC_INCIDENT_REPORT',      'donner_information',          3),
('SEC_INCIDENT_REPORT',      'utiliser_vocabulaire_metier', 2),

-- SEC_CONFLICT_DEESCALATION : Désescalade de conflit
-- Triple enjeu réel : gérer + maintenir + refuser l'escalade
('SEC_CONFLICT_DEESCALATION','gerer_situation_difficile',   3),
('SEC_CONFLICT_DEESCALATION','maintenir_echange_fluide',    2),
('SEC_CONFLICT_DEESCALATION','dire_non_professionnellement',2),

-- SEC_VIP_PROTECTION : Dispositif VIP / discrétion
-- Dire non aux demandes extérieures + vocabulaire protocolaire
('SEC_VIP_PROTECTION',       'dire_non_professionnellement',3),
('SEC_VIP_PROTECTION',       'utiliser_vocabulaire_metier', 2),

-- SEC_VENDOR_ACCESS : Accès fournisseurs / livraisons
-- Vérifier l'habilitation + donner l'accès ou refuser
('SEC_VENDOR_ACCESS',        'verifier_information',        3),
('SEC_VENDOR_ACCESS',        'dire_non_professionnellement',2),

-- SEC_CCTV_REQUEST : Demande CCTV / confidentialité
-- Refuser ou conditionner l'accès selon procédure
('SEC_CCTV_REQUEST',         'dire_non_professionnellement',3),
('SEC_CCTV_REQUEST',         'donner_information',          2),

-- SEC_CHILD_SAFETY : Enfant perdu / sécurité
-- Gérer l'urgence émotionnelle + maintenir le calme
('SEC_CHILD_SAFETY',         'gerer_situation_difficile',   3),
('SEC_CHILD_SAFETY',         'maintenir_echange_fluide',    2),

-- SEC_NIGHT_PATROL : Ronde de nuit
-- Action principalement interne — vocabulaire professionnel
('SEC_NIGHT_PATROL',         'utiliser_vocabulaire_metier', 2),
('SEC_NIGHT_PATROL',         'maintenir_echange_fluide',    2)

ON CONFLICT (action_id, competence_code) DO UPDATE SET poids = EXCLUDED.poids;

-- =====================================================
-- FIN
-- =====================================================
