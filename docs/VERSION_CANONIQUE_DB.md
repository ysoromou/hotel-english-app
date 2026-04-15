# VERSION CANONIQUE DB — Hotel English Pro

_Dernière mise à jour : 2026-04-09_

---

## Flux canonique — ordre d'exécution exact (Supabase SQL Editor)

| # | Fichier | Rôle | Idempotent |
|---|---------|------|-----------|
| 1 | `sql/000_schema_v3.sql` | Schéma de base : actions_metier, phrases, quiz, quiz_options, scenarios | Oui |
| 2 | `sql/003_fix_user_creation.sql` | profiles, user_progress, triggers auth, RLS utilisateurs | Oui |
| 3 | `sql/001_patch_realignement_canonique.sql` | Correctifs schéma : hotels, learning_sessions, quiz_options canonique, normalisation Sécurité, RLS contenu | Oui |
| 4 | `sql/002_user_progress.sql` | Index et policies supplémentaires user_progress | Oui |
| 5 | `sql/005_evaluations_competences.sql` | Table grille 15 compétences /45 + RLS | Non (DROP TABLE) |
| 6a | `sql/import_reception_actions_20_v2.sql` | 20 actions Réception (REC_*) | Oui |
| 6b | `sql/import_reception_phrases_320_v2.sql` | 320 phrases Réception | Oui |
| 6c | `sql/import_reception_exercices_40.sql` | 40 quiz + quiz_options Réception | Oui |
| 6d | `sql/import_reception_scenarios_12_v2.sql` | 12 scénarios Réception | Oui |
| 6e | `sql/import_housekeeping_actions_20.sql` | 20 actions Housekeeping (HK_*) | Oui |
| 6f | `sql/import_housekeeping_phrases_320.sql` | 320 phrases Housekeeping | Oui |
| 6g | `sql/import_housekeeping_exercices_40.sql` | 40 quiz + quiz_options Housekeeping | Oui |
| 6h | `sql/import_housekeeping_scenarios_12.sql` | 12 scénarios Housekeeping | Oui |
| 6i | `sql/import_restaurant_actions_20.sql` | 20 actions Restaurant (FB_*) | Oui |
| 6j | `sql/import_restaurant_phrases_320.sql` | 320 phrases Restaurant | Oui |
| 6k | `sql/import_restaurant_exercices_40.sql` | 40 quiz + quiz_options Restaurant | Oui |
| 6l | `sql/import_restaurant_scenarios_12.sql` | 12 scénarios Restaurant | Oui |
| 6m | `sql/import_security_actions_20.sql` | 20 actions Sécurité (SEC_*) | Oui |
| 6n | `sql/import_security_phrases_320_SCHEMA_OK.sql` | 320 phrases Sécurité | Oui |
| 6o | `sql/import_security_exercices_40_SCHEMA_OK_v4.sql` | 40 quiz Sécurité (pas de quiz_options) | Oui |
| 6p | `sql/import_security_scenarios_12.sql` | 12 scénarios Sécurité | Oui |
| 7 | `sql/004_upgrade_all_phrases_4star.sql` | Correction qualité 103 phrases (4★) — après tous les imports | Oui |
| 8 | `sql/006_action_competence_mapping.sql` | Table pont action ↔ 15 compétences + seed 80 actions | Oui |
| 9 | `sql/006b_mapping_patch_gerer_appel.sql` | Patch mapping : gerer_appel ajoutée sur 4 actions sous-couvertes | Oui |
| 10 | `sql/007_match_translation_seed.sql` | 24 exercices MATCH_TRANSLATION vocabulaire métier (6 par métier) | Oui |
| 11 | `sql/008_mcq_tone_seed.sql` | 12 exercices MCQ_TONE ton professionnel — 4 métiers (3 par métier) | Oui |
| 12 | `sql/009_mcq_policy_seed.sql` | 12 exercices MCQ_POLICY procédures terrain — 4 métiers (3 par métier) | Oui |
| 13 | `sql/010_enrich_phrases_gerer_appel.sql` | 25 phrases téléphoniques sur 5 actions cibles (gerer_appel) | Oui |
| 14 | `sql/011_gerer_appel_quiz_seed.sql` | 8 quiz téléphoniques MCQ_TONE + MCQ_POLICY (4 par type, 1 par métier) | Oui |
| 15 | `sql/012_gerer_appel_scenarios.sql` | 4 scénarios type TELEPHONE (1 par métier) | Oui |

**Ne jamais exécuter** : `import_1_actions.sql`, `import_2_phrases.sql`, `import_3_quiz.sql`, `import_4_scenarios.sql`, `001_migration_v3 (1).sql`

---

## Structure canonique de `quiz_options`

```sql
CREATE TABLE quiz_options (
    id          BIGSERIAL PRIMARY KEY,
    quiz_id     TEXT NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    position    INT  NOT NULL,
    option_text TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (quiz_id, position)
);
```

**Colonnes autorisées** : `quiz_id`, `position`, `option_text`, `created_at`

**Colonnes interdites dans la version canonique** : `label`, `sort_order`, `is_correct`

**Justification** : les 3 fichiers d'import premium qui alimentent `quiz_options` utilisent exclusivement `(quiz_id, position, option_text)` avec `ON CONFLICT (quiz_id, position)`. Aucun import n'utilise `label`, `sort_order` ou `is_correct`.

**Couverture** :
- Réception : 40 rows quiz_options (ORDER_SEQUENCE uniquement)
- Housekeeping : 51 rows quiz_options (ORDER_SEQUENCE uniquement)
- Restaurant : 40 rows quiz_options (ORDER_SEQUENCE uniquement)
- Sécurité : 0 row (MCQ_TONE / MCQ_POLICY n'utilisent pas quiz_options)

---

## Typologie canonique des exercices (`quiz.type_quiz`)

### Types existants dans les imports premium

| Type | Métiers | Structure | quiz_options ? |
|------|---------|-----------|---------------|
| `MULTIPLE_CHOICE` | HK | option_a/b/c + reponse_correcte='A'\|'B'\|'C' | Non |
| `MCQ_TONE` | SEC | option_a/b/c + reponse_correcte='A'\|'B'\|'C' | Non |
| `MCQ_POLICY` | SEC | option_a/b/c + reponse_correcte='A'\|'B'\|'C' | Non |
| `ORDER_SEQUENCE` | REC, HK, RST | expected_answer (phrases séparées par \|\|) + quiz_options | Oui |
| `TRANSLATION_ACTIVE` | REC, RST | expected_answer | Non |
| `LISTEN_AND_SELECT` | REC, RST | option_a/b/c + audio_url | Non |
| `LISTEN_AND_SPEAK` | REC, RST | audio_url + phrase_id | Non |
| `MATCH_TRANSLATION` | Tous (futur) | Voir ci-dessous | Optionnel |

### `MCQ_TONE` et `MCQ_POLICY` — généralisation canonique

Ces deux types sont **valides pour les 4 métiers**, pas uniquement pour la Sécurité.

- **`MCQ_TONE`** = QCM évaluant le bon registre professionnel dans une situation donnée. Applicable partout où le ton de la réponse est clé (Réception, Restaurant, Sécurité, Housekeeping).
- **`MCQ_POLICY`** = QCM évaluant la connaissance de la procédure correcte. Applicable partout où une règle métier est en jeu.

**Ce qui existe** :
- `import_security_exercices_40_SCHEMA_OK_v4.sql` : 40 exercices SEC
- `sql/008_mcq_tone_seed.sql` : 12 exercices sur les 4 métiers
- `sql/009_mcq_policy_seed.sql` : 12 exercices sur les 4 métiers
- `sql/011_gerer_appel_quiz_seed.sql` : 8 exercices téléphoniques sur les 4 métiers

**Ce qui est désormais autorisé** : `MCQ_TONE` et `MCQ_POLICY` peuvent être ajoutés dans les futurs imports pour les 4 métiers sans modification de schéma.

### `MATCH_TRANSLATION` — nouveau type canonique

**Rôle** : relier un mot ou expression métier à sa traduction (FR↔EN).

**Usage** : exercice de renforcement vocabulaire, pas exercice central du parcours.

**Structure dans `quiz`** :
```sql
type_quiz = 'MATCH_TRANSLATION'
reponse_correcte = 'FREE'  -- traitement côté app
expected_answer = NULL      -- la correspondance est dans quiz_options
```

**Structure dans `quiz_options`** (optionnel, si paires multiples) :
```
position 1 → terme FR ou EN à apparier
position 2 → sa traduction
...
```

**Aucune modification de schéma requise** : `MATCH_TRANSLATION` s'insère dans le schéma existant sans ajout de colonne.

**Ce qui existe** : `sql/007_match_translation_seed.sql` — 24 exercices sur les 4 métiers.

**Ce qui est désormais autorisé** : le type peut être utilisé dans les futurs imports pour les 4 métiers.

---

## Nomenclature canonique des métiers

| Valeur dans `actions_metier.metier` | Préfixe `action_id` | Valeur dans `profiles.metier_code` |
|-------------------------------------|---------------------|------------------------------------|
| `Réception` | `REC_` | `RECEPTION` |
| `Housekeeping` | `HK_` | `HOUSEKEEPING` |
| `Restaurant` | `FB_` | `RESTAURANT` |
| `Sécurité` | `SEC_` | `SECURITY` |

`actions_metier.metier` et `profiles.metier_code` sont deux champs indépendants. `metier_code` est le code technique utilisé par l'app pour les filtres et les routes (`/lessons/REC_/`).

---

## Fichiers hors flux principal (legacy — ne pas exécuter)

| Fichier | Raison |
|---------|--------|
| `sql/import_1_actions.sql` | Génération antérieure, remplacée par les imports premium métier |
| `sql/import_2_phrases.sql` | Génération antérieure |
| `sql/import_3_quiz.sql` | Génération antérieure |
| `sql/import_4_scenarios.sql` | Génération antérieure |
| `sql/001_migration_v3 (1).sql` | Contient la contrainte `quiz_reponse_correcte_check` incompatible avec `'FREE'`, et la mauvaise version de `quiz_options` (position sans created_at, avec UNIQUE différent). Remplacé par `001_patch_realignement_canonique.sql`. |
| `sql/fix_encoding.sql` | Correctif ponctuel — archive uniquement |
| `sql/patch_restaurant_hide_legacy_actions.sql` | Intégré dans `001_patch_realignement_canonique.sql` section G |

---

## Points à valider humainement avant utilisation en production

1. **Mapping action ↔ compétences** (`006_action_competence_mapping.sql` + `006b`) : les poids doivent être validés avec CAFORMAC avant d'être utilisés dans un rapport client opposable.

2. **`learning_sessions`** : la table est créée mais aucune route API ne l'alimente encore. Le dashboard manager affichera 0 sessions tant que l'API `/api/stats/refresh` n'est pas implémentée.

3. **Phrases enrichies (010)** : les 25 phrases téléphoniques commencent à partir de l'indice 0017 / 17 sur les actions concernées. Si les actions Réception et Housekeeping ont déjà exactement 16 phrases en base (standard), ces ajouts portent le total à 21 pour ces actions. Acceptable — pas de contrainte de 16 max dans le schéma.
