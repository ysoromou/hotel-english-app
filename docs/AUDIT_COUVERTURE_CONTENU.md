# AUDIT DE COUVERTURE CONTENU — Hotel English Pro

_Date : 2026-04-09_

---

## Résumé global

| Métier | Actions | Phrases | Quiz | Scénarios |
|--------|---------|---------|------|-----------|
| Réception | 20 | 330 | 40 | 13 |
| Housekeeping | 20 | 325 | 40 | 13 |
| Restaurant | 20 | 320 | 41 | 13 |
| Sécurité | 20 | 330 | 40 | 13 |
| **TOTAL** | **80** | **1305** | **161\*** | **52** |

\* Hors exercices enrichissement transversal (010/011/012) : +25 phrases téléphoniques + 8 quiz gerer_appel + 4 scénarios téléphoniques + 24 MATCH_TRANSLATION + 12 MCQ_TONE + 12 MCQ_POLICY = +56 exercices non comptabilisés dans les 40/métier.

**Distribution de base** : 16 phrases × 20 actions = 320 phrases par métier. ✓  
**Enrichissement gerer_appel** (010) : +5 phrases/action sur 2 actions REC + 1 HK + 2 SEC = +25 phrases.  
**Nouveaux exercices transversaux** : 24 MATCH_TRANSLATION + 12 MCQ_TONE + 12 MCQ_POLICY + 8 quiz gerer_appel = 56 exercices supplémentaires répartis sur les 4 métiers.

---

## RÉCEPTION (REC_*)

### Actions et couverture

| ID | Action | Quiz ? | Scénario ? | Notes |
|----|--------|--------|-----------|-------|
| REC_CI_STANDARD | Check-in standard | ✓ | — | Pas de scénario dédié (couvert par REC_CI_ADMIN_07) |
| REC_CI_ADMIN | Formalités administratives | ✓ | ✓ (SCN_REC_CI_ADMIN_07) | |
| REC_CI_EARLY | Arrivée anticipée | ✓ | ✓ | |
| REC_CI_WALKIN | Client sans réservation | ✓ | ✓ | |
| REC_CI_UPGRADE | Surclassement | — | — | **Trou double** : pas de quiz, pas de scénario |
| REC_INFO_FACILITIES | Infos services | ✓ | — | |
| REC_INFO_DIRECTIONS | Directions transports | ✓ | — | |
| REC_SERV_BOOKING | Réservation externe | ✓ | — | +5 phrases téléphoniques (010) |
| REC_SERV_WAKEUP | Réveil et messages | ✓ | ✓ (SCN_REC_WAKEUP_TEL) | +5 phrases téléphoniques (010) |
| REC_SERV_MAINTENANCE | Signalement technique | ✓ | ✓ | |
| REC_PROB_NOISE | Plainte bruit | ✓ | ✓ | |
| REC_PROB_CLEAN | Plainte propreté | ✓ | ✓ | |
| REC_PROB_BILL | Contestation facture | ✓ | ✓ | |
| REC_PROB_KEY | Clé démagnétisée | ✓ | ✓ | |
| REC_PROB_MISSING | Objet perdu | ✓ | ✓ | |
| REC_CO_STANDARD | Check-out standard | ✓ | — | |
| REC_CO_INVOICE | Facturation complexe | ✓ | ✓ | |
| REC_CO_LATE | Départ tardif | ✓ | ✓ | |
| REC_CO_LUGGAGE | Bagagerie départ | — | — | **Trou double** : pas de quiz, pas de scénario |
| REC_CO_FEEDBACK | Recueillir avis | — | — | **Trou double** : pas de quiz, pas de scénario |

**Actions sans quiz** : REC_CI_UPGRADE, REC_CO_LUGGAGE, REC_CO_FEEDBACK (3 sur 20)
**Actions sans scénario** : REC_CI_STANDARD, REC_INFO_FACILITIES, REC_INFO_DIRECTIONS, REC_SERV_BOOKING, REC_CO_STANDARD, REC_CO_LUGGAGE, REC_CO_FEEDBACK (7 sur 20 — REC_SERV_WAKEUP couvert par SCN_REC_WAKEUP_TEL)

**Risque** : Les actions de clôture (bagagerie, feedback) et de surclassement ne sont pas exercées.

---

## HOUSEKEEPING (HK_*)

### Actions et couverture

| ID | Action | Quiz ? | Scénario ? | Notes |
|----|--------|--------|-----------|-------|
| HK_ROOM_CLEAN | Nettoyage chambre | ✓ | ✓ | |
| HK_TURNDOWN | Turndown | ✓ | — | |
| HK_LINEN_CHANGE | Changement linge | ✓ | ✓ | |
| HK_AMENITIES | Réassort amenities | ✓ | — | |
| HK_MINIBAR_CHECK | Contrôle minibar | ✓ | — | |
| HK_DND | Gestion DND | ✓ | ✓ | |
| HK_LATE_SERVICE | Demande tardive | ✓ | ✓ | |
| HK_LOST_FOUND | Objet trouvé/perdu | ✓ | ✓ | |
| HK_DAMAGE_REPORT | Signalement dégât | ✓ | ✓ | |
| HK_MAINT_REQUEST | Maintenance urgence | ✓ | ✓ (+ SCN_HK_MAINT_TEL) | +5 phrases téléphoniques (010) |
| HK_STAIN_COMPLAINT | Plainte tache | ✓ | — | |
| HK_ODOR_SMELL | Plainte odeur | ✓ | ✓ | |
| HK_BATHROOM_ISSUE | Problème salle de bain | ✓ | — | |
| HK_PUBLIC_AREAS | Nettoyage parties communes | ✓ | — | |
| HK_LAUNDRY_GUEST | Blanchisserie client | ✓ | — | |
| HK_EXTRA_BED | Lit supplémentaire | ✓ | — | |
| HK_BABY_COT | Lit bébé | ✓ | — | |
| HK_VIP_SETUP | Préparation VIP | ✓ | — | |
| HK_SUPPLIES | Demande consommables | ✓ | — | |
| HK_CHECKLIST | Contrôle qualité | ✓ | — | |

**Actions sans quiz** : aucune ✓
**Actions sans scénario** : 12 sur 20 — housekeeping a une couverture scénario concentrée sur les cas conflictuels. C'est cohérent (les scénarios couvrent les situations critiques).

**Anomalie** : 91 inserts pour 40 quiz uniques dans `import_housekeeping_exercices_40.sql`. Format multi-ligne (INSERT + UPDATE séparés). Pas de doublon de contenu.

---

## RESTAURANT (FB_*)

### Actions et couverture

| ID | Action | Quiz ? | Scénario ? | Notes |
|----|--------|--------|-----------|-------|
| FB_GREET_GUEST | Accueil | ✓ | ✓ | |
| FB_SEATING_GUEST | Placement | ✓ | — | |
| FB_PRESENT_MENU | Présentation menu | ✓ | — | |
| FB_TAKE_ORDER | Prise de commande | ✓ | ✓ (+ SCN_RST_ROOMSERVICE_01) | Scénario room service téléphonique (012) |
| FB_CONFIRM_ORDER | Confirmation commande | ✓ | — | |
| FB_SPECIAL_REQUEST | Demande spéciale | ✓ | ✓ | |
| FB_ALLERGY_CHECK | Allergies | ✓ | ✓ | |
| FB_UPSELL_DRINKS | Proposition boissons | ✓ | — | |
| FB_UPSELL_DESSERT | Proposition desserts | ✓ | — | |
| FB_WINE_RECOMMENDATION | Vins / accords | ✓ | — | |
| FB_DELAY_APOLOGY | Retard de service | ✓ | ✓ | |
| FB_WRONG_ORDER | Commande incorrecte | ✓ | ✓ | |
| FB_COLD_FOOD_COMPLAINT | Plat froid | ✓ | ✓ | |
| FB_BILL_REQUEST | Addition | ✓ | — | |
| FB_SPLIT_BILL | Addition séparée | ✓ | ✓ | |
| FB_PAYMENT_CARD_ISSUE | Carte refusée | ✓ | — | |
| FB_GROUP_RESERVATION | Réservation groupe | ✓ | — | |
| FB_VIP_TABLE | Table VIP | ✓ | — | |
| FB_CHILD_MENU | Menu enfant | ✓ | — | |
| FB_FEEDBACK_REQUEST | Avis client | ✓ | — | |

**Actions sans quiz** : aucune ✓
**Actions sans scénario** : 12 sur 20 — même logique que HK, scénarios concentrés sur les cas de gestion.

**Legacy** : Actions préfixées `REST_*` existent peut-être en base depuis une génération antérieure. Elles doivent être marquées `Restaurant_OLD` par le patch. Ne pas les supprimer sans vérifier qu'elles n'ont pas de phrases ou quiz associés dans une installation existante.

---

## SÉCURITÉ (SEC_*)

### Actions et couverture

| ID | Action | Quiz ? | Scénario ? | Notes |
|----|--------|--------|-----------|-------|
| SEC_ACCESS_CONTROL | Contrôle d'accès | ✓ | ✓ | |
| SEC_ID_VERIFICATION | Vérification identité | ✓ | ✓ | |
| SEC_ROOM_ESCORT | Escorter client | ✓ | — | |
| SEC_NOISE_COMPLAINT | Plainte bruit | ✓ | ✓ | |
| SEC_SUSPICIOUS_PERSON | Personne suspecte | ✓ | ✓ | |
| SEC_THEFT_REPORT | Déclaration vol | ✓ | ✓ | |
| SEC_LOST_FOUND | Objets trouvés | ✓ | — | |
| SEC_EMERGENCY_MEDICAL | Urgence médicale | ✓ | ✓ (+ SCN_SEC_URGENCE_TEL) | +5 phrases téléphoniques (010) |
| SEC_FIRE_ALARM | Alarme incendie | ✓ | ✓ | |
| SEC_EVACUATION | Évacuation | ✓ | ✓ | |
| SEC_CROWD_CONTROL | Gestion foule | ✓ | — | |
| SEC_PARKING_ASSIST | Parking | ✓ | — | |
| SEC_KEY_CONTROL | Contrôle clés | ✓ | — | |
| SEC_INCIDENT_REPORT | Rapport incident | ✓ | — | +5 phrases téléphoniques (010) |
| SEC_CONFLICT_DEESCALATION | Désescalade | ✓ | ✓ | |
| SEC_VIP_PROTECTION | Dispositif VIP | ✓ | — | |
| SEC_VENDOR_ACCESS | Accès fournisseurs | ✓ | — | |
| SEC_CCTV_REQUEST | Demande CCTV | ✓ | — | |
| SEC_CHILD_SAFETY | Enfant perdu | ✓ | ✓ | |
| SEC_NIGHT_PATROL | Ronde de nuit | ✓ | — | |

**Actions sans quiz** : aucune ✓
**Actions sans scénario** : 10 sur 20

**Anomalies structurelles Sécurité** :
1. `import_security_actions_20.sql` insère `metier='Securite'` (sans accent) → corrigé par le patch 001
2. `import_security_actions_20.sql` n'insère pas la colonne `categorie` → corrigé par le patch 001
3. ~~Les types quiz sont `MCQ_TONE` et `MCQ_POLICY` (spécifiques Sécurité)~~ → **RÉSOLU** : `MCQ_TONE` et `MCQ_POLICY` sont désormais canoniques pour les 4 métiers (008, 009, 011).

---

## Incohérences et risques identifiés

### ~~Risque 1 — Types quiz hétérogènes~~ → RÉSOLU

`MCQ_TONE` et `MCQ_POLICY` sont désormais **types canoniques** pour les 4 métiers. Ils ne sont plus cantonnés à la Sécurité.

Types quiz canoniques documentés dans `VERSION_CANONIQUE_DB.md` :
- `ORDER_SEQUENCE` (REC, HK, RST) — avec quiz_options
- `TRANSLATION_ACTIVE` (REC, RST)
- `LISTEN_AND_SELECT`, `LISTEN_AND_SPEAK` (REC, RST)
- `MULTIPLE_CHOICE` (HK)
- `MCQ_TONE` (tous 4 métiers — 008, 011)
- `MCQ_POLICY` (tous 4 métiers — 009, 011)
- `MATCH_TRANSLATION` (tous 4 métiers — 007)

**Aucun CHECK CONSTRAINT** sur `type_quiz` — pas de modification de schéma requise. Les 7 types ci-dessus sont les valeurs autorisées à documenter dans le code app.

### Risque 2 — 3 actions Réception sans quiz
REC_CI_UPGRADE, REC_CO_LUGGAGE, REC_CO_FEEDBACK n'ont ni quiz ni scénario.
Ce sont des actions de service simple (surclassement, bagagerie, feedback). Acceptable pour une v1, à combler en priorité si ces situations surviennent fréquemment sur le terrain.

### Risque 3 — learning_sessions non alimentée
La table `learning_sessions` est créée par le patch mais aucun code API ne l'insère encore. Le dashboard manager affiche un compteur de sessions qui sera à 0 pour tous les apprenants jusqu'à ce que l'API `/api/stats/refresh` (ou équivalent) l'alimente. Ce n'est pas un bug bloquant mais une information à communiquer.

### Risque 4 — audio_url à null pour 100% du contenu
Toutes les phrases ont `audio_url = null`. L'intégration ElevenLabs n'est pas encore réalisée. Les quiz `LISTEN_AND_SELECT` et `LISTEN_AND_SPEAK` ont des `audio_url` de type `'audio/reception/ci_standard_01.mp3'` (chemin local relatif), non accessibles en production. Ces exercices ne fonctionneront pas tant que les MP3 ne sont pas générés et hébergés.

### Risque 5 — action_competence_mapping non vérifiable sans données terrain
Le mapping dans `006_action_competence_mapping.sql` (167 lignes, 2-4 compétences par action max) a été audité et corrigé : discipline appliquée, rationale documentée inline, poids 3 = compétence centrale unique sauf cas justifiés. Patch `006b` a comblé le trou `gerer_appel` (1 → 5 actions liées). **Validé logiquement, mais les poids restent à confirmer avec CAFORMAC avant utilisation dans le rapport client opposable.**

---

## Priorités de correction

| Priorité | Item | Impact | Statut |
|----------|------|--------|--------|
| P1 | Alimenter `learning_sessions` depuis l'app | Dashboard manager inutilisable sans données | En attente API |
| P2 | Valider le mapping action ↔ compétences avec CAFORMAC | Rapport client non opposable sinon | À planifier |
| ~~P3~~ | ~~Normaliser `MCQ_TONE` / `MCQ_POLICY`~~ | ~~Cohérence app~~ | **RÉSOLU** (008/009/011) |
| P4 | Générer les MP3 ElevenLabs pour LISTEN_* | Exercices audio non fonctionnels | En attente |
| P5 | Ajouter quiz/scénarios pour REC_CI_UPGRADE, REC_CO_LUGGAGE, REC_CO_FEEDBACK | Couverture Réception à 85% | À planifier |
