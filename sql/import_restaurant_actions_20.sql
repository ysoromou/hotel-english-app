begin;
-- Restaurant (Hôtel urbain) — 20 actions

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_GREET_GUEST', 'Restaurant', 'Accueil et salutation', 'Module 4 étoiles — Restaurant — Accueil et salutation.', 'A2', 'Accueil', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_SEATING_GUEST', 'Restaurant', 'Placement à table', 'Module 4 étoiles — Restaurant — Placement à table.', 'A2', 'Accueil', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_PRESENT_MENU', 'Restaurant', 'Présentation du menu et des offres', 'Module 4 étoiles — Restaurant — Présentation du menu et des offres.', 'A2', 'Information', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_TAKE_ORDER', 'Restaurant', 'Prise de commande', 'Module 4 étoiles — Restaurant — Prise de commande.', 'A2', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_CONFIRM_ORDER', 'Restaurant', 'Confirmation de commande', 'Module 4 étoiles — Restaurant — Confirmation de commande.', 'A2', 'Vérification', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_SPECIAL_REQUEST', 'Restaurant', 'Demande spéciale / substitution', 'Module 4 étoiles — Restaurant — Demande spéciale / substitution.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_ALLERGY_CHECK', 'Restaurant', 'Allergies et restrictions alimentaires', 'Module 4 étoiles — Restaurant — Allergies et restrictions alimentaires.', 'B1', 'Sécurité', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_UPSELL_DRINKS', 'Restaurant', 'Proposition boissons / apéritif', 'Module 4 étoiles — Restaurant — Proposition boissons / apéritif.', 'A2', 'Vente', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_UPSELL_DESSERT', 'Restaurant', 'Proposition desserts / café', 'Module 4 étoiles — Restaurant — Proposition desserts / café.', 'A2', 'Vente', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_WINE_RECOMMENDATION', 'Restaurant', 'Recommandation vins / accords', 'Module 4 étoiles — Restaurant — Recommandation vins / accords.', 'B1', 'Vente', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_DELAY_APOLOGY', 'Restaurant', 'Retard de service / excuses', 'Module 4 étoiles — Restaurant — Retard de service / excuses.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_WRONG_ORDER', 'Restaurant', 'Commande incorrecte', 'Module 4 étoiles — Restaurant — Commande incorrecte.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_COLD_FOOD_COMPLAINT', 'Restaurant', 'Plat froid / qualité', 'Module 4 étoiles — Restaurant — Plat froid / qualité.', 'B1', 'Conflit', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_BILL_REQUEST', 'Restaurant', 'Demande d’addition', 'Module 4 étoiles — Restaurant — Demande d’addition.', 'A2', 'Paiement', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_SPLIT_BILL', 'Restaurant', 'Addition séparée / split bill', 'Module 4 étoiles — Restaurant — Addition séparée / split bill.', 'B1', 'Paiement', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_PAYMENT_CARD_ISSUE', 'Restaurant', 'Carte refusée / paiement alternatif', 'Module 4 étoiles — Restaurant — Carte refusée / paiement alternatif.', 'B1', 'Paiement', true)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_GROUP_RESERVATION', 'Restaurant', 'Réservation groupe / contraintes', 'Module 4 étoiles — Restaurant — Réservation groupe / contraintes.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_VIP_TABLE', 'Restaurant', 'Table VIP / attention spéciale', 'Module 4 étoiles — Restaurant — Table VIP / attention spéciale.', 'B1', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_CHILD_MENU', 'Restaurant', 'Enfants / menu enfant', 'Module 4 étoiles — Restaurant — Enfants / menu enfant.', 'A2', 'Service', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

insert into actions_metier (id, metier, action, description, niveau_cible, categorie, critique_conflit)
values ('FB_FEEDBACK_REQUEST', 'Restaurant', 'Recueillir avis client', 'Module 4 étoiles — Restaurant — Recueillir avis client.', 'A2', 'Clôture', false)
on conflict (id) do update set
  metier = excluded.metier,
  action = excluded.action,
  description = excluded.description,
  niveau_cible = excluded.niveau_cible,
  categorie = excluded.categorie,
  critique_conflit = excluded.critique_conflit;

commit;