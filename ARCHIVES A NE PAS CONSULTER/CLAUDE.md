# CLAUDE.md — VERSION CANONIQUE V2 (PRODUCTION)

## OBJECTIF

Construire et maintenir une base de données **canonique, unique et exploitable** pour :

> **App e-learning métier (hôtellerie) + outil de preuve de progression (15 compétences)**

⚠️ Ce n’est pas un LMS  
⚠️ Ce n’est pas un simple dépôt de contenu  
👉 C’est un **système opérationnel** qui doit produire :

- apprentissage réel terrain  
- progression mesurable  
- rapport client défendable  

---

## PRINCIPES NON NÉGOCIABLES

1. **UNE SEULE VERSION CANONIQUE**
   - aucun mélange de versions SQL
   - aucun fallback legacy en production
   - aucun doublon structurel

2. **CONTENU PREMIUM = RÉFÉRENCE**
   - 20 actions / métier  
   - 320 phrases / métier  
   - 40 exercices / métier  
   - 12 scénarios / métier  

3. **APPRENTISSAGE + PREUVE (LES 2)**
   - apprentissage réel obligatoire  
   - preuve fiable obligatoire  
   - aucun compromis

4. **STRUCTURE > QUANTITÉ**
   - le contenu est suffisant  
   - le levier est l’orchestration  

---

## PÉRIMÈTRE MÉTIER

Les 4 métiers sont **actifs simultanément** :

- Réception  
- Restaurant / Bar  
- Housekeeping  
- Sécurité  

⚠️ Aucun métier n’est secondaire  
⚠️ Tous doivent être cohérents au lancement  

---

## STRUCTURE CANONIQUE

### TABLES CŒUR

- `actions_metier`
- `phrases`
- `quiz`
- `quiz_options`
- `scenarios`
- `profiles`
- `user_progress`
- `evaluations_competences`
- `action_competence_mapping`
- `hotels`

---

## CONTRAINTES STRUCTURELLES

### ACTIONS

- 20 actions EXACTEMENT par métier  
- 1 action = 1 situation métier claire  

---

### PHRASES

- 16 phrases par action (standard actuel)  
- ne pas supprimer sans logique pédagogique  
- chaque phrase doit être :
  - utile
  - naturelle
  - réutilisable terrain  

---

### SCÉNARIOS

- 12 scénarios par métier  
- format obligatoire :
  - contexte réel  
  - objectif salarié  
  - dialogue modèle  
  - critères réussite  

👉 **unité pédagogique principale**

---

## EXERCICES — TYPOLOGIE CANONIQUE

### TYPES AUTORISÉS

#### 1. Compréhension / choix
- `MULTIPLE_CHOICE`

#### 2. Organisation logique
- `ORDER_SEQUENCE`

#### 3. Production active
- `TRANSLATION_ACTIVE`

#### 4. Audio compréhension
- `LISTEN_AND_SELECT`

#### 5. Audio production
- `LISTEN_AND_SPEAK`

#### 6. Vocabulaire ciblé
- `MATCH_TRANSLATION` ✅ NOUVEAU

#### 7. Posture professionnelle
- `MCQ_TONE`

#### 8. Procédure métier
- `MCQ_POLICY`

---

## RÈGLES D’UTILISATION DES EXERCICES

### MATCH_TRANSLATION

Usage :
- vocabulaire métier à fort ROI
- max 2–4 par action

Objectif :
- renforcer vocabulaire utile
- jamais remplacer le contexte

---

### MCQ_TONE (GÉNÉRALISÉ)

Utilisé sur **les 4 métiers**

Teste :
- politesse
- empathie
- professionnalisme
- désescalade

---

### MCQ_POLICY (GÉNÉRALISÉ)

Utilisé sur **les 4 métiers**

Teste :
- bonne action
- respect des procédures
- priorités métier
- sécurité / service

---

⚠️ Interdit :
- limiter MCQ_TONE / POLICY à la sécurité
- créer des types non standardisés

---

## QUIZ_OPTIONS (CRITIQUE)

Structure canonique unique :

- `quiz_id`
- `position`
- `option_text`

❌ Interdit :
- `label`
- `sort_order`
- `is_correct`

---

## GRILLE COMPÉTENCES — RÉFÉRENCE UNIQUE

### IDs TECHNIQUES + LIBELLÉS

1. accueillir_client → Accueillir un client en anglais  
2. comprendre_demande → Comprendre une demande simple à l’oral  
3. repondre_demande → Répondre à une demande simple  
4. donner_information → Donner une information claire  
5. orienter_client → Orienter un client ou indiquer une direction  
6. verifier_information → Vérifier une information ou une demande  
7. reformuler_confirmer → Reformuler pour valider la compréhension  
8. gerer_reclamation → Gérer une réclamation simple  
9. proposer_solution → Proposer une solution adaptée  
10. gerer_situation_difficile → Gérer une situation difficile ou une incompréhension  
11. utiliser_vocabulaire_metier → Utiliser le vocabulaire métier adapté en situation  
12. maintenir_echange_fluide → Maintenir un échange fluide avec le client  
13. gerer_appel → Gérer un échange téléphonique simple  
14. conclure_interaction → Clôturer un échange de manière professionnelle  
15. dire_non_professionnellement → Refuser ou poser une limite de façon professionnelle  

⚠️ Cette grille remplace toute autre logique  
⚠️ Aucun autre référentiel n’est autorisé  

---

## PONT CONTENU → COMPÉTENCES

### TABLE : `action_competence_mapping`

Champs :

- `id`
- `action_id`
- `competence_code`
- `poids`
- `created_at`

Règles :

- 1 action → plusieurs compétences  
- poids simple (pas d’usine à gaz)  
- obligatoire pour reporting  

---

## REPORTING (CŒUR BUSINESS)

Basé sur :

- `evaluations_competences`
- `learning_sessions`
- `action_competence_mapping`

Sorties :

- score /45  
- progression  
- statut (vert / orange / rouge)  

👉 Si le mapping est mauvais → produit inutilisable  

---

## PROFILS / HÔTELS

### profiles

doit contenir :
- user_id
- métier
- `hotel_id`

### hotels

obligatoire pour :
- segmentation client  
- reporting entreprise  

---

## GESTION DES LEGACY

FICHIERS INTERDITS EN PRODUCTION :

- import_1_actions.sql  
- import_2_phrases.sql  
- import_3_quiz.sql  
- import_4_scenarios.sql  
- supabase_schema.sql  

👉 ne jamais exécuter dans la base canonique  

---

## ORDRE D’EXÉCUTION CANONIQUE

1. patch réalignement schéma  
2. fix users / profiles  
3. user_progress  
4. hotels  
5. evaluations_competences  
6. actions (4 métiers)  
7. phrases (4 métiers)  
8. quiz (4 métiers)  
9. scenarios (4 métiers)  
10. action_competence_mapping  
11. upgrade phrases 4★  

---

## RÈGLES DE DÉVELOPPEMENT

### INTERDIT

- ajouter une table sans impact métier  
- modifier schéma sans vérifier imports  
- complexifier inutilement  
- dupliquer structure  

---

### OBLIGATOIRE

- lire les fichiers avant modification  
- vérifier compatibilité SQL  
- vérifier impact reporting  
- documenter toute décision  

---

## CRITÈRES DE VALIDATION

La base est valide si :

- 20 actions / métier  
- 320 phrases / métier  
- 40 quiz / métier  
- 12 scénarios / métier  
- 0 conflit de schéma  
- mapping compétences complet  
- aucun legacy actif  
- types d’exercices cohérents sur les 4 métiers  

---

## OBJECTIF FINAL

Créer une base qui permet :

1. apprentissage réel terrain  
2. usage simple (5 min / jour)  
3. progression mesurable  
4. rapport client défendable  

👉 Si un élément ne contribue pas à ces 4 points → il doit être supprimé ou corrigé