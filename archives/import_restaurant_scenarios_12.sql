begin;
-- Restaurant (Hôtel urbain) — 12 scénarios multi-problèmes

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_ALLERGY_01', 'FB_ALLERGY_CHECK', 'MULTI_PROBLEM', 'B1', $$Client business lunch. Allergy + wants a quick dish + needs confirmation from kitchen.$$, $$Sécuriser l’allergie, proposer 2 options rapides, confirmer avec cuisine, rassurer.$$, $$CLIENT: I’m allergic to peanuts. I also have a meeting soon.
STAFF: I completely understand. I take that very seriously.
STAFF: Could you specify your allergy, please? I will confirm ingredients with the kitchen.
CLIENT: I need something quick.
STAFF: Of course. I can recommend two safe options that are ready in under {time} minutes.
CLIENT: Is it 100% safe?
STAFF: I will confirm with the chef before validating your order, and we will avoid cross-contamination.$$, $$Sécurité d’abord; confirmation cuisine; 2 options; délai réaliste; rassurer sans promettre l’impossible.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_DELAY_02', 'FB_DELAY_APOLOGY', 'MULTI_PROBLEM', 'B1', $$Service delay + guest in a hurry + asks for compensation.$$, $$S’excuser, donner estimation fiable, proposer alternative rapide, escalader si nécessaire.$$, $$CLIENT: We have been waiting a long time. We are in a hurry.
STAFF: I’m truly sorry for the wait. I will personally take care of this.
STAFF: I will check with the kitchen and give you a reliable estimate in one minute.
CLIENT: If it’s not ready, we want something faster.
STAFF: Of course. If needed, I can offer a faster alternative ready in under {time} minutes.
CLIENT: And a gesture?
STAFF: I understand. I can ask my manager for an appropriate gesture once I confirm the situation.$$, $$Empathie + ownership; timing; alternative; compensation via manager; pas de promesse gratuite.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_WRONG_ORDER_03', 'FB_WRONG_ORDER', 'MULTI_PROBLEM', 'B1', $$Wrong order + guest annoyed + wants it fixed fast + offers drink.$$, $$Reconnaître l’erreur, corriger, proposer boisson, donner délai.$$, $$CLIENT: This is not my dish. I asked for no sauce.
STAFF: I understand, and please accept our apologies.
STAFF: I will fix this immediately and prioritize your dish with the kitchen.
CLIENT: How long will it take?
STAFF: I will update you in {time} minutes. May I offer you a complimentary drink while you wait?
CLIENT: Okay, thank you.$$, $$Excuses; correction; délai; update; geste adapté.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_COLD_04', 'FB_COLD_FOOD_COMPLAINT', 'MULTI_PROBLEM', 'B1', $$Cold food + guest requests remake + asks for bill adjustment.$$, $$Proposer remake, prioriser, expliquer bill adjustment via manager.$$, $$CLIENT: My food is cold. I want it remade.
STAFF: I’m sorry to hear that. We will fix this immediately.
STAFF: Would you prefer a full replacement, or a quick reheat?
CLIENT: A full replacement.
STAFF: Certainly. I will prioritize it in the kitchen and give you a clear time.
CLIENT: I want the bill adjusted.
STAFF: I understand. I can ask my manager for an appropriate adjustment after verification.$$, $$Solution immédiate; choix client; priorisation; bill via manager; traçabilité.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_SPLIT_05', 'FB_SPLIT_BILL', 'MULTI_PROBLEM', 'B1', $$Split bill + company card + guest in hurry + needs receipt details.$$, $$Clarifier items, produire split sans erreur, montrer breakdown avant paiement.$$, $$CLIENT: Two separate bills, please. One part on the company card, and I’m in a hurry.
STAFF: I understand. I will do it as quickly as possible without mistakes.
STAFF: Could you tell me exactly which items should go on each bill?
CLIENT: Drinks on bill 2.
STAFF: Certainly. I will show you the breakdown before payment and include the company name on the receipt.$$, $$Clarification; vitesse sans erreur; breakdown; reçu conforme.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_CARD_06', 'FB_PAYMENT_CARD_ISSUE', 'MULTI_PROBLEM', 'B1', $$Card declined + guest embarrassed + wants fast solution + mobile payment option.$$, $$Rester discret, proposer alternatives, escalader si besoin.$$, $$CLIENT: It doesn’t work? I don’t have another card.
STAFF: I’m sorry. We can settle in cash, or use {payment_method} if available.
CLIENT: I need a quick solution.
STAFF: Of course. Would you like me to guide you through the fastest option?
CLIENT: Yes.
STAFF: Certainly. I will take care of it immediately, and I can call my manager if you prefer.$$, $$Discrétion; options; guidance; escalade possible.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_GROUP_07', 'FB_GROUP_RESERVATION', 'MULTI_PROBLEM', 'B1', $$Group reservation + tight schedule + set menu + drink upsell.$$, $$Optimiser flow: menu fixe, prise groupée, timing clair, boisson immédiate.$$, $$CLIENT: We are {time} people and we have a tight schedule.
STAFF: I understand. To save time, I suggest a set menu and a grouped order.
STAFF: Would you like drinks served right away?
CLIENT: Yes, please.
STAFF: Certainly. I will coordinate with the kitchen and give you a clear timing.$$, $$Proposition process; upsell doux; coordination; timing.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_WINE_08', 'FB_WINE_RECOMMENDATION', 'MULTI_PROBLEM', 'B1', $$Guest wants wine pairing + budget constraint + fast decision.$$, $$Qualifier, proposer 2 options, respecter budget.$$, $$CLIENT: Which wine goes with the fish? Around {amount} {currency} for the bottle.
STAFF: Thank you. For {dish}, I recommend a dry white, {wine}.
STAFF: If you prefer something fuller-bodied, I can suggest {wine} as well.
CLIENT: Which one fits the budget best?
STAFF: Within that budget, {wine} is excellent and very popular.
CLIENT: Let’s go with that one.$$, $$Questions budget; 2 options; recommandation claire; décision facilitée.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_VIP_09', 'FB_VIP_TABLE', 'MULTI_PROBLEM', 'B1', $$VIP table + discreet area + request faster service.$$, $$Installer discret, coordonner cuisine, conserver ton premium.$$, $$CLIENT: We prefer a discreet table, and could you speed up the service?
STAFF: Of course. I will seat you in a more private area.
STAFF: Certainly. I will coordinate directly with the kitchen and take your order immediately if you wish.
CLIENT: Yes, please.
STAFF: Very well. What may I offer you?$$, $$Discrétion; coordination; proactivité; ton 4★.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_MENU_10', 'FB_PRESENT_MENU', 'MULTI_PROBLEM', 'B1', $$Business guest asks for a quick recommendation + vegetarian option.$$, $$Recommander 2 plats rapides dont 1 veggie; délai réaliste.$$, $$CLIENT: We would like something quick. Is there a vegetarian option?
STAFF: Of course. I can guide you to dishes ready in under {time} minutes.
STAFF: I recommend {dish} and {dish}. We also have a vegetarian option: {dish}.
CLIENT: Great. We’ll take that.$$, $$Options + timing; répondre à la contrainte; clarté.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_UPSELL_11', 'FB_UPSELL_DRINKS', 'MULTI_PROBLEM', 'B1', $$Upsell drinks + guest budget + non-alcoholic preference.$$, $$Qualifier budget, proposer boisson sans alcool, pairings simples.$$, $$CLIENT: Nothing alcoholic. Around {amount} {currency} per drink.
STAFF: Understood. I can recommend {drink}, a popular non-alcoholic option.
STAFF: If you wish, I can pair it with your dish.
CLIENT: Perfect.$$, $$Respect contraintes; proposer; upsell non intrusif.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

insert into scenarios (id, action_id, type_scenario, niveau, contexte, objectif_salarie, dialogue_modele, criteres_reussite)
values ('SCN_FB_FEEDBACK_12', 'FB_FEEDBACK_REQUEST', 'MULTI_PROBLEM', 'B1', $$Feedback includes complaint about slow service; handle gracefully.$$, $$S’excuser, remercier, remonter, proposer follow-up.$$, $$CLIENT: The dish was excellent, but the service was a bit slow.
STAFF: I’m sorry to hear that. Thank you for helping us improve our service.
STAFF: I will report this immediately. If you wish, I can arrange a follow-up by email.
CLIENT: Yes, please.$$, $$Excuses; gratitude; action; follow-up.$$)
on conflict (id) do update set
  action_id = excluded.action_id,
  type_scenario = excluded.type_scenario,
  niveau = excluded.niveau,
  contexte = excluded.contexte,
  objectif_salarie = excluded.objectif_salarie,
  dialogue_modele = excluded.dialogue_modele,
  criteres_reussite = excluded.criteres_reussite;

commit;