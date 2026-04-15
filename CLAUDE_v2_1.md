# CLAUDE.md — VERSION CANONIQUE V2.1 (PRODUCTION)

## OBJECTIF

Construire, maintenir et faire évoluer **une seule base canonique exploitable** pour :

> **Application e-learning métier hôtellerie + outil de preuve de progression + reporting client défendable**

Cette application doit servir simultanément :

1. **l’apprentissage réel terrain**
2. **la progression mesurable**
3. **la constitution de groupes cohérents**
4. **la preuve avant / après**
5. **la production d’un rapport client exploitable RH / Direction**

---

## CE QUE LE PRODUIT EST

Le produit est :

- une **app métier mobile-first**
- un **outil de positionnement**
- un **outil de renforcement entre sessions**
- un **outil de mesure de progression**
- un **outil de reporting client**

---

## CE QUE LE PRODUIT N’EST PAS

⚠️ Ce n’est pas un LMS  
⚠️ Ce n’est pas une app de langue grand public  
⚠️ Ce n’est pas un simple dépôt de contenu  
⚠️ Ce n’est pas un quiz engine autonome  
⚠️ Ce n’est pas un gadget de gamification  
⚠️ Ce n’est pas un produit “joli” sans valeur probante

---

## FINALITÉ BUSINESS

Le produit doit permettre de démontrer :

- progression par apprenant
- progression par groupe
- progression par hôtel
- progression par compétence
- lien entre usage, apprentissage et performance observable

Sorties business attendues :

- score initial / final
- progression en points et en %
- statut vert / orange / rouge
- vue par apprenant
- vue par hôtel
- observations terrain
- rapport client défendable

👉 Si une fonctionnalité n’améliore pas clairement l’apprentissage, la mesure ou le reporting, elle doit être refusée, repoussée ou supprimée.

---

## PRINCIPES NON NÉGOCIABLES

### 1. UNE SEULE VERSION CANONIQUE
- aucun mélange de versions SQL
- aucun fallback legacy en production
- aucun doublon structurel
- aucune logique concurrente pour la mesure

### 2. APPRENTISSAGE + PREUVE
- apprentissage réel obligatoire
- preuve fiable obligatoire
- aucun compromis sur l’un des deux

### 3. STRUCTURE > QUANTITÉ
- le contenu est déjà substantiel
- le vrai levier est l’orchestration
- la cohérence du schéma vaut plus que l’empilement de contenu

### 4. L’HUMAIN GARDE LE DERNIER MOT
- l’IA peut corriger, suggérer, scorer, proposer
- l’humain confirme, ajuste ou invalide
- cela vaut surtout pour l’oral, les cas limites et les niveaux élevés

### 5. SCORE APP SEUL INSUFFISANT
Le score numérique seul ne vaut rien sans :
- rattachement métier
- validation humaine
- observation en situation
- logique de progression avant / après

### 6. REPORTING AU CŒUR
Toute modification fonctionnelle ou data doit être vérifiée contre :
- score /45
- progression
- statuts
- segmentation hôtel
- rapport client final

---

## PÉRIMÈTRE MÉTIER

Les 4 métiers sont actifs simultanément :

- Réception
- Restaurant / Bar
- Housekeeping
- Sécurité

⚠️ Aucun métier n’est secondaire  
⚠️ Tous doivent être cohérents au lancement  
⚠️ Toute nouvelle logique doit fonctionner sur les 4 métiers, sauf justification explicite validée humainement

---

## UTILISATEURS / RÔLES

### Apprenant
- suit les exercices
- passe le test online
- enregistre des réponses orales
- consulte ses activités

### Consultant / Auditeur / Formateur
- voit les résultats
- confirme ou ajuste les niveaux
- saisit validation orale
- gère présence
- observe jeux de rôle / terrain
- consolide la preuve

### RH / Manager / Client
- voit l’usage
- voit la progression
- suit les groupes / hôtels
- exploite les rapports

---

## MODÈLE DE MESURE — RÉFÉRENCE UNIQUE

## 15 COMPÉTENCES OFFICIELLES

1. `accueillir_client` → Accueillir un client en anglais  
2. `comprendre_demande` → Comprendre une demande simple à l’oral  
3. `repondre_demande` → Répondre à une demande simple  
4. `donner_information` → Donner une information claire  
5. `orienter_client` → Orienter un client ou indiquer une direction  
6. `verifier_information` → Vérifier une information ou une demande  
7. `reformuler_confirmer` → Reformuler pour valider la compréhension  
8. `gerer_reclamation` → Gérer une réclamation simple  
9. `proposer_solution` → Proposer une solution adaptée  
10. `gerer_situation_difficile` → Gérer une situation difficile ou une incompréhension  
11. `utiliser_vocabulaire_metier` → Utiliser le vocabulaire métier adapté en situation  
12. `maintenir_echange_fluide` → Maintenir un échange fluide avec le client  
13. `gerer_appel` → Gérer un échange téléphonique simple  
14. `conclure_interaction` → Clôturer un échange de manière professionnelle  
15. `dire_non_professionnellement` → Refuser ou poser une limite de façon professionnelle  

⚠️ Cette grille est la **référence unique**  
⚠️ Aucun autre référentiel n’est autorisé  
⚠️ Toute brique de scoring ou reporting doit être compatible avec elle

---

## BARÈME OFFICIEL

- chaque compétence est notée de **0 à 3**
- score total = **/45**

### Interprétation
- **Vert** : 30 et plus
- **Orange** : 15 à 29
- **Rouge** : moins de 15

Ce barème structure :
- l’évaluation initiale
- l’évaluation finale
- les rapports
- les dashboards
- les recommandations

---

## POSITIONNEMENT / TEST INITIAL

## RÈGLE PRODUIT

Le test de positionnement peut être :

- passé **en ligne**
- corrigé par **IA**
- scoré automatiquement
- utilisé pour proposer un **niveau CECRL**
- utilisé pour proposer un **groupe provisoire**

Mais :

👉 **il ne valide jamais seul le niveau officiel**

La logique officielle est :

**Digital propose → humain confirme → système enregistre**

---

## TEST ONLINE — FORMAT CANONIQUE

### Objectif
- positionner vite
- couvrir les niveaux A1 à C2
- produire un niveau CECRL suggéré
- alimenter un signal provisoire sur les 15 compétences
- préparer la confirmation orale humaine

### Structure
Durée réelle : **45 minutes**

- Lecture : 10 min
- Écoute : 10 min
- Expression écrite : 10 min
- Expression orale : 15 min

### Règles UX
- timer global visible
- timer par section
- pas de sablier agressif sur chaque question
- temps strict surtout pour :
  - écoute
  - oral

### Logique adaptative
Le test doit être **adaptatif** :
- routeur initial
- branche basse A1/A2
- branche moyenne B1/B2
- branche haute C1/C2

### Résultats attendus
- score global /100
- score par compétence CECRL
- niveau CECRL suggéré
- niveau de confiance
- groupe provisoire
- signaux provisoires par compétence métier
- drapeaux d’alerte :
  - oral faible
  - écrit faible
  - compréhension > production
  - confirmation humaine requise

### Garde-fou
Le test online **ne suffit pas seul** à officialiser la note /45.

---

## VALIDATION HUMAINE JOUR 1

Le consultant doit pouvoir :

- consulter le résultat du test online
- écouter les productions orales
- lire les réponses écrites
- observer l’oral réel en situation
- confirmer ou ajuster le niveau
- confirmer ou ajuster le groupe
- saisir une validation orale courte

### Mini grille de validation orale jour 1
Barème 0–3 sur :
- comprend la demande
- répond de façon pertinente
- reste fluide
- utilise un vocabulaire métier utile
- garde un ton professionnel

Le niveau / groupe n’est considéré comme stabilisé qu’après cette validation humaine.

---

## PARCOURS PÉDAGOGIQUE — PRINCIPES

Le produit doit rester compatible avec un usage réel terrain :

- 5 minutes / jour possibles côté app
- sessions courtes
- environnement hôtelier contraint
- connexion parfois instable
- téléphones modestes

L’app sert surtout à :
- renforcer entre les séances
- ancrer vocabulaire et automatismes
- suivre l’usage
- outiller la preuve

Elle ne remplace pas :
- la validation humaine
- les jeux de rôle
- l’observation en situation
- l’évaluation finale

---

## CONTENU PREMIUM = RÉFÉRENCE

Référence cible :

- **20 actions par métier**
- **320 phrases par métier**
- **40 quiz / exercices par métier**
- **12 scénarios par métier**

⚠️ Cette volumétrie constitue la référence premium  
⚠️ Le contenu doit rester exploitable, naturel, métier, réutilisable terrain  
⚠️ Le volume seul ne vaut rien sans structure

---

## STRUCTURE CANONIQUE — TABLES CŒUR

### Tables référentielles
- `actions_metier`
- `phrases`
- `quiz`
- `quiz_options`
- `scenarios`
- `action_competence_mapping`
- `hotels`

### Tables utilisateurs / suivi
- `profiles`
- `user_progress`
- `learning_sessions`
- `evaluations_competences`

### Tables fonctionnelles admises si elles servent le produit
- tables de test online
- tables de réponses test
- tables de scores test
- tables de présence
- tables de validation humaine
- tables de groupes si nécessaires

⚠️ Toute nouvelle table doit prouver son utilité métier et son utilité reporting.

---

## CONTRAINTES STRUCTURELLES

### Actions
- 20 actions EXACTEMENT par métier
- 1 action = 1 situation métier claire

### Phrases
- 16 phrases par action comme standard actuel
- ne pas supprimer sans logique pédagogique
- chaque phrase doit être utile, naturelle, réutilisable terrain

### Scénarios
- 12 scénarios par métier
- format obligatoire :
  - contexte réel
  - objectif salarié
  - dialogue modèle
  - critères de réussite

👉 Le scénario est une **unité pédagogique forte**.

---

## TYPOLOGIE CANONIQUE DES EXERCICES

Types autorisés :

1. `MULTIPLE_CHOICE`
2. `ORDER_SEQUENCE`
3. `TRANSLATION_ACTIVE`
4. `LISTEN_AND_SELECT`
5. `LISTEN_AND_SPEAK`
6. `MATCH_TRANSLATION`
7. `MCQ_TONE`
8. `MCQ_POLICY`

### Règles
- `MCQ_TONE` et `MCQ_POLICY` sont transversaux aux 4 métiers
- pas de nouveaux types improvisés
- pas de type non documenté
- pas de dérive vers des exercices gadget

---

## QUIZ_OPTIONS — STRUCTURE CANONIQUE

Structure autorisée :

- `quiz_id`
- `position`
- `option_text`

❌ Interdit :
- `label`
- `sort_order`
- `is_correct`

La bonne réponse doit être portée par la structure quiz, pas par une dérive non canonique de `quiz_options`.

---

## PONT CONTENU → COMPÉTENCES

### TABLE : `action_competence_mapping`

Champs :
- `id`
- `action_id`
- `competence_code`
- `poids`
- `created_at`

### Règles
- 1 action peut couvrir plusieurs compétences
- pondération simple
- pas d’usine à gaz
- mapping obligatoire pour le reporting

👉 Si le mapping est faux ou incomplet, le produit devient inutilisable côté preuve.

---

## PRÉSENCE

La présence fait partie de la preuve d’exécution, pas de la preuve de niveau.

Elle doit permettre au consultant de marquer simplement :
- `present`
- `late`
- `absent`
- `excused`

Objectifs :
- suivi de discipline de groupe
- corrélation avec progression
- reporting consultant / RH

Ne pas transformer cela en système complexe ou punitif.

---

## INTERFACE CONSULTANT / AUDITEUR

L’interface consultant est une brique produit clé.

Elle doit permettre de :
- voir la liste des apprenants
- voir le statut des tests
- voir les scores et niveaux suggérés
- voir les signaux sur les 15 compétences
- écouter les réponses orales
- lire les réponses écrites
- confirmer / ajuster le niveau
- confirmer / ajuster le groupe
- saisir validation orale
- saisir présence
- préparer la lecture reporting

⚠️ Interface simple  
⚠️ Pas un back-office lourd  
⚠️ Pas de cosmétique inutile

---

## REPORTING — CŒUR BUSINESS

Le reporting doit pouvoir produire :

- score initial / final
- progression points / %
- statut vert / orange / rouge
- vue par apprenant
- vue par groupe
- vue par hôtel
- observations consultant
- lecture par compétence
- recommandations

Le reporting repose sur :
- `evaluations_competences`
- `learning_sessions`
- `action_competence_mapping`
- données de présence
- validations humaines
- résultats du test online

👉 Si une évolution casse le reporting, elle doit être refusée.

---

## PROFILS / HÔTELS

### `profiles`
Doit contenir au minimum :
- `user_id`
- métier
- `hotel_id`

### `hotels`
Table obligatoire pour :
- segmentation client
- reporting entreprise
- lecture NOOM / SEEN / autres hôtels

---

## GESTION DES LEGACY

### Fichiers legacy interdits en production
- `import_1_actions.sql`
- `import_2_phrases.sql`
- `import_3_quiz.sql`
- `import_4_scenarios.sql`
- `supabase_schema.sql`

👉 Ne jamais exécuter ces fichiers dans la base canonique de production.

### Règle
Toute logique legacy :
- doit être supprimée
- ou archivée
- ou isolée hors flux actif

Mais jamais laissée comme fallback silencieux.

---

## ORDRE D’EXÉCUTION CANONIQUE

Ordre général de réalignement / construction :

1. patch réalignement schéma
2. fix users / profiles
3. user_progress
4. hotels
5. evaluations_competences
6. learning_sessions
7. actions
8. phrases
9. quiz
10. scenarios
11. action_competence_mapping
12. modules test / présence / validation humaine
13. reporting
14. upgrade contenu premium / audio / UX

---

## CONTRAINTES TECHNIQUES

- mobile-first
- Android bas de gamme
- réseau intermittent
- robustesse d’abord
- code TypeScript strict
- pas de dépendances exotiques sans justification forte
- pas de refactor massif si patch ciblé suffit
- toujours ajouter des garde-fous contre les données nulles ou invalides

---

## RÈGLES DE DÉVELOPPEMENT

### OBLIGATOIRE
- lire les fichiers avant modification
- vérifier compatibilité SQL
- vérifier impact reporting
- documenter toute décision structurante
- tester le parcours principal après correction
- protéger le rendu contre crash runtime

### INTERDIT
- ajouter une table sans impact métier
- modifier schéma sans vérifier reporting
- complexifier pour faire “propre”
- dupliquer structure
- réintroduire du legacy
- inventer une autre logique de mesure

---

## RÈGLES DE DÉVELOPPEMENT AVEC IA / AGENTS

Les agents ou assistants doivent :
- commencer par un audit ciblé
- limiter la lecture du repo
- corriger d’abord les bugs bloquants
- résumer après chaque lot
- protéger la référence canonique
- ne jamais traiter d’anciens prompts obsolètes comme référence

Ordre de priorité par défaut :
1. crashs runtime
2. audio
3. données invalides
4. parcours principal apprenant
5. interface consultant
6. présence
7. test online
8. reporting

---

## CRITÈRES DE VALIDATION

La base / le produit sont valides si :

- 20 actions / métier
- 320 phrases / métier
- 40 exercices / métier
- 12 scénarios / métier
- 0 conflit de schéma
- mapping compétences complet
- aucun legacy actif
- types d’exercices cohérents sur les 4 métiers
- test online exploitable
- validation humaine possible
- présence exploitable
- reporting score /45 intact

---

## OBJECTIF FINAL

Créer une application qui permet simultanément :

1. apprentissage réel terrain
2. usage simple
3. progression mesurable
4. regroupement cohérent des apprenants
5. validation humaine fiable
6. rapport client défendable

### Formule à retenir
**Le digital scale. L’humain valide. Le reporting prouve.**

👉 Si un élément ne contribue pas clairement à cette chaîne, il doit être corrigé, simplifié ou supprimé.
