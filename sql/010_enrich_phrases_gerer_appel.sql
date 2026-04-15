-- =====================================================
-- 010_enrich_phrases_gerer_appel.sql
-- Renforcement compétence gerer_appel
-- Ajout de phrases téléphoniques sur 5 actions cibles :
--   REC_SERV_WAKEUP      (phrases 0017–0021)
--   REC_SERV_BOOKING     (phrases 0017–0021)
--   HK_MAINT_REQUEST     (phrases 0017–0021)
--   SEC_EMERGENCY_MEDICAL (phrases 17–21)
--   SEC_INCIDENT_REPORT  (phrases 17–21)
-- Idempotent (ON CONFLICT DO UPDATE)
-- =====================================================

BEGIN;

-- =====================================================
-- RÉCEPTION — REC_SERV_WAKEUP (réveil téléphonique)
-- Phrases 0017–0021 : gestion de l'appel téléphonique
-- =====================================================

INSERT INTO phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) VALUES
('REC_REC_SERV_WAKEUP_0017', 'REC_SERV_WAKEUP',
  'Réception, bonjour. En quoi puis-je vous aider ?',
  'Front desk speaking, how may I assist you?',
  'Ouverture', 'A1', 'STAFF', null),
('REC_REC_SERV_WAKEUP_0018', 'REC_SERV_WAKEUP',
  'Pouvez-vous patienter un instant, s''il vous plaît ?',
  'Could you please hold for a moment?',
  'Attente', 'A1', 'STAFF', null),
('REC_REC_SERV_WAKEUP_0019', 'REC_SERV_WAKEUP',
  'Je vous rappelle dans quelques minutes.',
  'I will call you back shortly.',
  'Clôture', 'A1', 'STAFF', null),
('REC_REC_SERV_WAKEUP_0020', 'REC_SERV_WAKEUP',
  'Pouvez-vous confirmer votre numéro de chambre, s''il vous plaît ?',
  'Can you confirm your room number, please?',
  'Vérification', 'A1', 'STAFF', null),
('REC_REC_SERV_WAKEUP_0021', 'REC_SERV_WAKEUP',
  'C''est bien noté. Votre réveil est programmé pour {time}.',
  'Noted. Your wake-up call is set for {time}.',
  'Confirmation', 'A1', 'STAFF', null)
ON CONFLICT (id) DO UPDATE SET
  action_id  = excluded.action_id,
  phrase_fr  = excluded.phrase_fr,
  phrase_en  = excluded.phrase_en,
  phase      = excluded.phase,
  niveau     = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url  = excluded.audio_url;

-- =====================================================
-- RÉCEPTION — REC_SERV_BOOKING (réservation externe)
-- L'action implique souvent un appel téléphonique vers un restaurant/activité
-- =====================================================

INSERT INTO phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) VALUES
('REC_REC_SERV_BOOKING_0017', 'REC_SERV_BOOKING',
  'Je vais appeler pour vérifier les disponibilités.',
  'I will call to check availability.',
  'Action', 'A2', 'STAFF', null),
('REC_REC_SERV_BOOKING_0018', 'REC_SERV_BOOKING',
  'Pouvez-vous rester en ligne un instant ?',
  'Could you hold the line for a moment?',
  'Attente', 'A1', 'STAFF', null),
('REC_REC_SERV_BOOKING_0019', 'REC_SERV_BOOKING',
  'Je vous transfère à notre service concerné.',
  'I will transfer your call to the relevant department.',
  'Transfert', 'A2', 'STAFF', null),
('REC_REC_SERV_BOOKING_0020', 'REC_SERV_BOOKING',
  'La réservation est confirmée. Ils vous attendent à {time}.',
  'The reservation is confirmed. They are expecting you at {time}.',
  'Confirmation', 'A2', 'STAFF', null),
('REC_REC_SERV_BOOKING_0021', 'REC_SERV_BOOKING',
  'Puis-je prendre un message pour vous ?',
  'May I take a message for you?',
  'Message', 'A2', 'STAFF', null)
ON CONFLICT (id) DO UPDATE SET
  action_id  = excluded.action_id,
  phrase_fr  = excluded.phrase_fr,
  phrase_en  = excluded.phrase_en,
  phase      = excluded.phase,
  niveau     = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url  = excluded.audio_url;

-- =====================================================
-- HOUSEKEEPING — HK_MAINT_REQUEST (signalement maintenance)
-- Le HK appelle la maintenance par téléphone / radio
-- =====================================================

INSERT INTO phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) VALUES
('HK_HK_MAINT_REQUEST_0017', 'HK_MAINT_REQUEST',
  'Ici le Housekeeping. Il y a un problème urgent en chambre {room}.',
  'This is Housekeeping. There is an urgent issue in room {room}.',
  'Signalement', 'A2', 'STAFF', null),
('HK_HK_MAINT_REQUEST_0018', 'HK_MAINT_REQUEST',
  'Pouvez-vous envoyer quelqu''un immédiatement ?',
  'Can you send someone immediately?',
  'Demande', 'A1', 'STAFF', null),
('HK_HK_MAINT_REQUEST_0019', 'HK_MAINT_REQUEST',
  'Je reste sur place jusqu''à votre arrivée.',
  'I will stay on-site until you arrive.',
  'Attente', 'A2', 'STAFF', null),
('HK_HK_MAINT_REQUEST_0020', 'HK_MAINT_REQUEST',
  'Le problème a été signalé à la maintenance. Ils arrivent dans {time} minutes.',
  'The issue has been reported to maintenance. They will be there in {time} minutes.',
  'Information', 'A2', 'STAFF', null),
('HK_HK_MAINT_REQUEST_0021', 'HK_MAINT_REQUEST',
  'Avez-vous besoin d''un autre numéro à appeler ?',
  'Do you need another number to call?',
  'Clôture', 'A2', 'CLIENT', null)
ON CONFLICT (id) DO UPDATE SET
  action_id  = excluded.action_id,
  phrase_fr  = excluded.phrase_fr,
  phrase_en  = excluded.phrase_en,
  phase      = excluded.phase,
  niveau     = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url  = excluded.audio_url;

-- =====================================================
-- SÉCURITÉ — SEC_EMERGENCY_MEDICAL (appel secours)
-- Agent de sécurité appelle le SAMU / pompiers
-- =====================================================

INSERT INTO phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) VALUES
('SEC_EMERGENCY_MEDICAL_17', 'SEC_EMERGENCY_MEDICAL',
  'J''appelle le SAMU immédiatement.',
  'I am calling emergency services right away.',
  'ACTION', 'B1', 'STAFF', null),
('SEC_EMERGENCY_MEDICAL_18', 'SEC_EMERGENCY_MEDICAL',
  'Restez en ligne, les secours arrivent.',
  'Stay on the line, help is on the way.',
  'ATTENTE', 'A2', 'STAFF', null),
('SEC_EMERGENCY_MEDICAL_19', 'SEC_EMERGENCY_MEDICAL',
  'Pouvez-vous me décrire les symptômes exactement ?',
  'Can you describe the symptoms exactly?',
  'VERIFY', 'B1', 'STAFF', null),
('SEC_EMERGENCY_MEDICAL_20', 'SEC_EMERGENCY_MEDICAL',
  'Quelle est la chambre concernée ?',
  'Which room is it?',
  'VERIFY', 'A1', 'STAFF', null),
('SEC_EMERGENCY_MEDICAL_21', 'SEC_EMERGENCY_MEDICAL',
  'Je reste en contact avec vous jusqu''à l''arrivée des secours.',
  'I will stay in contact with you until the emergency services arrive.',
  'ATTENTE', 'B1', 'STAFF', null)
ON CONFLICT (id) DO UPDATE SET
  action_id  = excluded.action_id,
  phrase_fr  = excluded.phrase_fr,
  phrase_en  = excluded.phrase_en,
  phase      = excluded.phase,
  niveau     = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url  = excluded.audio_url;

-- =====================================================
-- SÉCURITÉ — SEC_INCIDENT_REPORT (rapport d'incident)
-- Agent signale par téléphone / radio à son supérieur
-- =====================================================

INSERT INTO phrases (id, action_id, phrase_fr, phrase_en, phase, niveau, voice_type, audio_url) VALUES
('SEC_INCIDENT_REPORT_17', 'SEC_INCIDENT_REPORT',
  'Je vous appelle pour signaler un incident au niveau {location}.',
  'I am calling to report an incident at {location}.',
  'OPENING', 'A2', 'STAFF', null),
('SEC_INCIDENT_REPORT_18', 'SEC_INCIDENT_REPORT',
  'Cela s''est passé à {time}. Les faits sont les suivants.',
  'It happened at {time}. The facts are as follows.',
  'RAPPORT', 'B1', 'STAFF', null),
('SEC_INCIDENT_REPORT_19', 'SEC_INCIDENT_REPORT',
  'Je vous rappelle dès que j''ai plus d''informations.',
  'I will call you back as soon as I have more information.',
  'CLÔTURE', 'A2', 'STAFF', null),
('SEC_INCIDENT_REPORT_20', 'SEC_INCIDENT_REPORT',
  'Confirmez-vous que vous avez reçu mon rapport ?',
  'Can you confirm that you have received my report?',
  'CONFIRM', 'A2', 'STAFF', null),
('SEC_INCIDENT_REPORT_21', 'SEC_INCIDENT_REPORT',
  'Je reste joignable sur ce numéro.',
  'I remain reachable at this number.',
  'CLÔTURE', 'A2', 'STAFF', null)
ON CONFLICT (id) DO UPDATE SET
  action_id  = excluded.action_id,
  phrase_fr  = excluded.phrase_fr,
  phrase_en  = excluded.phrase_en,
  phase      = excluded.phase,
  niveau     = excluded.niveau,
  voice_type = excluded.voice_type,
  audio_url  = excluded.audio_url;

COMMIT;
