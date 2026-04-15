begin;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_ROOM_CLEAN', 'Housekeeping', 'Nettoyage chambre (standard)', 'Procédure 4 étoiles — nettoyage complet d’une chambre occupée ou en départ.', 'A2', 'Nettoyage', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_TURNDOWN', 'Housekeeping', 'Service couverture (turndown)', 'Procédure 4 étoiles — turndown + confort client.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_LINEN_CHANGE', 'Housekeeping', 'Changement linge & serviettes', 'Changement de draps/serviettes selon standard et demande client.', 'A2', 'Linge', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_AMENITIES', 'Housekeeping', 'Réassort amenities', 'Réassort salle de bain (savon, shampooing, mouchoirs, eau).', 'A2', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_MINIBAR_CHECK', 'Housekeeping', 'Contrôle minibar (inventaire)', 'Contrôle minibar et signalement d’écarts au desk (sans facturation directe).', 'B1', 'Vérification', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_DND', 'Housekeeping', 'Gestion DND / Do Not Disturb', 'Respect DND, replanifier, sécuriser service et sécurité.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_LATE_SERVICE', 'Housekeeping', 'Demande tardive (après 20h)', 'Serviettes/oreillers tardifs, gestion attente et priorisation.', 'B1', 'Service', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_LOST_FOUND', 'Housekeeping', 'Objet trouvé / perdu', 'Procédure lost & found, traçabilité, communication au desk.', 'B1', 'Sécurité', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_DAMAGE_REPORT', 'Housekeeping', 'Signalement dégât / casse', 'Déclarer casse/dégât, photos, escalade, ton neutre.', 'B1', 'Maintenance', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_MAINT_REQUEST', 'Housekeeping', 'Demande maintenance (urgence)', 'Fuite, clim, électricité : sécuriser zone et escalader.', 'B1', 'Maintenance', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_STAIN_COMPLAINT', 'Housekeeping', 'Plainte tache / linge sale', 'Client se plaint d’une tache; remplacement + excuses + suivi.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_ODOR_SMELL', 'Housekeeping', 'Plainte odeur (fumée/moisi)', 'Diagnostiquer, désodoriser, proposer room move via desk.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_BATHROOM_ISSUE', 'Housekeeping', 'Problème salle de bain', 'Cheveux, traces, drainage : correction immédiate + contrôle.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_PUBLIC_AREAS', 'Housekeeping', 'Nettoyage parties communes', 'Lobby/couloirs/ascenseurs : standards, sécurité, discrétion.', 'A2', 'Nettoyage', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_LAUNDRY_GUEST', 'Housekeeping', 'Blanchisserie client (express)', 'Prise en charge laundry, délais, traçabilité.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_EXTRA_BED', 'Housekeeping', 'Lit supplémentaire', 'Installer extra bed, vérifier confort, timing.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_BABY_COT', 'Housekeeping', 'Lit bébé', 'Installer lit bébé, sécurité, accessoires.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_VIP_SETUP', 'Housekeeping', 'Préparation VIP', 'Setup VIP (fruits, letter, amenities premium) + contrôle.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_SUPPLIES', 'Housekeeping', 'Demande consommables', 'Réponse aux demandes (eau, capsules, papier) + délai.', 'A2', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('HK_CHECKLIST', 'Housekeeping', 'Contrôle qualité / checklist', 'Auto-contrôle chambre et signalement anomalies.', 'B1', 'Standards', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

commit;