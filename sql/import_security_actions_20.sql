begin;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_ACCESS_CONTROL', 'Securite', 'Contrôle d''accès / entrée', 'Gérer l’accès à l’hôtel (portes, barrières, zones réservées) avec courtoisie et fermeté.', 'A2', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_ID_VERIFICATION', 'Securite', 'Vérification d''identité', 'Vérifier l’identité d’un client ou visiteur (sécurité, clés, accès).', 'A2', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_ROOM_ESCORT', 'Securite', 'Escorter un client', 'Accompagner un client à la chambre ou à un lieu sûr (discret, rassurant).', 'A2', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_NOISE_COMPLAINT', 'Securite', 'Plainte de bruit / fête', 'Intervenir sur un bruit nocturne, désamorcer, appliquer la règle.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_SUSPICIOUS_PERSON', 'Securite', 'Personne suspecte', 'Identifier, questionner et gérer une personne au comportement suspect.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_THEFT_REPORT', 'Securite', 'Déclaration de vol', 'Recevoir une plainte de vol, sécuriser, documenter, escalader.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_LOST_FOUND', 'Securite', 'Objets trouvés / perdus', 'Enregistrer un objet, vérifier propriété, restituer ou sécuriser.', 'A2', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_EMERGENCY_MEDICAL', 'Securite', 'Urgence médicale', 'Réagir à un malaise, appeler secours, sécuriser périmètre, rassurer.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_FIRE_ALARM', 'Securite', 'Alarme incendie', 'Répondre à une alarme, guider, communiquer calmement.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_EVACUATION', 'Securite', 'Évacuation / point de rassemblement', 'Orchestrer une évacuation, aider personnes vulnérables.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_CROWD_CONTROL', 'Securite', 'Gestion de foule / événement', 'Gérer une foule (lobby, événement), files, tensions.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_PARKING_ASSIST', 'Securite', 'Assistance parking / circulation', 'Aider au stationnement, orienter, prévenir incidents.', 'A2', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_KEY_CONTROL', 'Securite', 'Contrôle des clés / cartes', 'Gérer une demande de clé/duplicata selon procédure.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_INCIDENT_REPORT', 'Securite', 'Rapport d''incident', 'Rédiger et transmettre un rapport clair (faits, heure, témoins).', 'A2', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_CONFLICT_DEESCALATION', 'Securite', 'Désescalade de conflit', 'Calmer un conflit, protéger, éviter l’escalade.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_VIP_PROTECTION', 'Securite', 'Dispositif VIP / discrétion', 'Assurer discrétion et sécurité VIP (itinéraire, confidentialité).', 'A2', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_VENDOR_ACCESS', 'Securite', 'Accès fournisseurs / livraisons', 'Contrôler accès des prestataires, badges, zones autorisées.', 'A2', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_CCTV_REQUEST', 'Securite', 'Demande CCTV / confidentialité', 'Gérer demandes de vidéosurveillance (procédure, privacy).', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_CHILD_SAFETY', 'Securite', 'Enfant perdu / sécurité', 'Gérer un enfant perdu, sécuriser, identifier, alerter.', 'B1', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, critique_conflit)
values ('SEC_NIGHT_PATROL', 'Securite', 'Ronde de nuit', 'Effectuer ronde, signaler anomalies, rassurer clients.', 'A2', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  critique_conflit = excluded.critique_conflit;

commit;