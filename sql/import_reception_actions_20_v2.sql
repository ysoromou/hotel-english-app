begin;
-- 20 actions (Réception 4 étoiles) — v2
insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CI_STANDARD', 'Réception', 'Check-in standard', 'Module 4 étoiles — Check-in standard.', 'A2', 'Accueil', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CI_ADMIN', 'Réception', 'Formalités administratives', 'Module 4 étoiles — Formalités administratives.', 'A2', 'Vérification', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CI_EARLY', 'Réception', 'Arrivée anticipée - chambre non prête', 'Module 4 étoiles — Arrivée anticipée - chambre non prête.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CI_WALKIN', 'Réception', 'Client sans réservation', 'Module 4 étoiles — Client sans réservation.', 'B1', 'Accueil', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CI_UPGRADE', 'Réception', 'Proposition de surclassement', 'Module 4 étoiles — Proposition de surclassement.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_INFO_FACILITIES', 'Réception', 'Informations services de l''hôtel', 'Module 4 étoiles — Informations services de l''hôtel.', 'A2', 'Information', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_INFO_DIRECTIONS', 'Réception', 'Directions et transports', 'Module 4 étoiles — Directions et transports.', 'B1', 'Information', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_SERV_BOOKING', 'Réception', 'Réservation externe (restaurant/activité)', 'Module 4 étoiles — Réservation externe (restaurant/activité).', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_SERV_WAKEUP', 'Réception', 'Réveil et messages', 'Module 4 étoiles — Réveil et messages.', 'A1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_SERV_MAINTENANCE', 'Réception', 'Signalement problème technique', 'Module 4 étoiles — Signalement problème technique.', 'A2', 'Service', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_PROB_NOISE', 'Réception', 'Plainte bruit', 'Module 4 étoiles — Plainte bruit.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_PROB_CLEAN', 'Réception', 'Plainte propreté', 'Module 4 étoiles — Plainte propreté.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_PROB_BILL', 'Réception', 'Contestation facture', 'Module 4 étoiles — Contestation facture.', 'B1', 'Paiement', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_PROB_KEY', 'Réception', 'Clé démagnétisée / accès refusé', 'Module 4 étoiles — Clé démagnétisée / accès refusé.', 'A2', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_PROB_MISSING', 'Réception', 'Objet perdu ou volé', 'Module 4 étoiles — Objet perdu ou volé.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CO_STANDARD', 'Réception', 'Check-out standard', 'Module 4 étoiles — Check-out standard.', 'A2', 'Clôture', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CO_INVOICE', 'Réception', 'Facturation complexe / split', 'Module 4 étoiles — Facturation complexe / split.', 'B1', 'Paiement', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CO_LATE', 'Réception', 'Demande de départ tardif', 'Module 4 étoiles — Demande de départ tardif.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CO_LUGGAGE', 'Réception', 'Bagagerie départ', 'Module 4 étoiles — Bagagerie départ.', 'A1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('REC_CO_FEEDBACK', 'Réception', 'Recueillir avis client', 'Module 4 étoiles — Recueillir avis client.', 'B1', 'Clôture', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

commit;