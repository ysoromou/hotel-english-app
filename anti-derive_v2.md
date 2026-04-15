# anti-derive.md — VERSION ALIGNÉE CLAUDE.md V2.1

## 1. RÔLE DU DOCUMENT

Ce document sert à empêcher la dérive du projet.

Il ne décrit pas “tout le produit”.
Il verrouille ce que le produit **ne doit pas devenir** et ce qui doit rester vrai quand on ajoute, corrige ou modifie une brique.

Ce document complète `CLAUDE.md`.
En cas de conflit :
1. `CLAUDE.md` prévaut
2. `anti-derive.md` protège la finalité produit
3. les documents opérationnels s’alignent dessus

---

## 2. CE QUE LE PRODUIT DOIT RESTER

Le produit doit rester :

- une app métier mobile-first
- un outil de renforcement terrain
- un outil de positionnement
- un outil de mesure de progression
- un outil de preuve avant / après
- un outil de reporting client

Il doit rester centré sur :

1. apprentissage réel
2. progression mesurable
3. validation humaine
4. rapport client défendable

---

## 3. CE QUE LE PRODUIT NE DOIT PAS DEVENIR

Le produit ne doit pas devenir :

- un LMS
- un mini-Duolingo
- une app de gamification
- un quiz engine sans valeur métier
- un back-office lourd
- une usine à fonctionnalités
- une app “jolie” mais sans preuve
- un produit centré uniquement sur le score app

Si une évolution pousse dans l’une de ces directions :
👉 elle doit être refusée, repoussée ou simplifiée.

---

## 4. PRINCIPE CENTRAL

### Le score app seul ne vaut rien.

La valeur du produit vient de la combinaison :

- contenus métier
- pratique réelle
- progression mesurable
- validation humaine
- observation / simulation terrain
- reporting lisible

Donc :
- un quiz seul ne suffit pas
- un test seul ne suffit pas
- une IA seule ne suffit pas
- une note auto-calculée seule ne suffit pas

---

## 5. RÈGLE SUR LE TEST ONLINE

Le test online est utile.
Il est même structurant.

Mais il ne doit pas être traité comme :
- une certification autonome
- une vérité absolue
- la note officielle finale /45

Le test online doit servir à :
- positionner
- pré-classer
- proposer un niveau CECRL
- produire un signal provisoire sur les 15 compétences
- préparer le travail du consultant

### Formule à retenir
**Le digital propose. L’humain confirme.**

---

## 6. RÈGLE SUR LES 15 COMPÉTENCES

Les 15 compétences doivent rester la seule grille officielle.

Le test online peut :
- couvrir les 15 compétences
- produire des signaux provisoires par compétence

Mais il ne doit pas faire croire qu’il “mesure parfaitement” à lui seul chacune des 15 compétences en 45 minutes.

### Règle correcte
- test online = couverture + signal
- validation orale / terrain = confirmation
- grille /45 = officialisation

---

## 7. RÈGLE SUR L’ORAL

L’oral n’est pas un bonus.

Le produit vise une communication réelle en contexte hôtelier.
Donc :
- l’oral doit être testé
- l’oral doit être observé
- l’oral doit pouvoir être validé humainement

Mais il ne faut pas dériver vers :
- une usine à évaluation orale trop lourde
- une fausse certification automatique de l’oral par IA

### Règle correcte
- l’IA peut scorer un vocal
- le consultant garde le dernier mot

---

## 8. RÈGLE SUR LA VALIDATION HUMAINE

La validation humaine ne doit jamais disparaître.

Pourquoi :
- exigence métier
- crédibilité client
- robustesse RH
- cohérence avec le modèle de preuve

Elle doit être :
- légère
- simple
- ciblée
- utile

Elle ne doit pas devenir :
- un processus administratif lourd
- une saisie interminable
- un dispositif qui bloque le déploiement

---

## 9. RÈGLE SUR L’INTERFACE CONSULTANT

L’interface consultant doit exister.

Mais elle ne doit pas devenir :
- un ERP
- un cockpit surchargé
- un système d’administration complexe

Elle doit permettre le minimum utile :
- voir les apprenants
- voir les résultats
- confirmer ou ajuster
- gérer la présence
- saisir l’oral jour 1
- préparer la lecture reporting

### Principe
**simple, rapide, exploitable**

---

## 10. RÈGLE SUR LA PRÉSENCE

La présence est utile.
Mais elle ne doit pas être survalorisée.

La présence prouve :
- l’exécution
- l’assiduité
- la discipline de groupe

Elle ne prouve pas :
- le niveau réel
- la compétence
- la progression à elle seule

Donc :
- oui à la présence
- non à une sur-complexification
- non à un système de contrôle excessif

Statuts minimaux :
- present
- late
- absent
- excused

Pas plus sans besoin réel.

---

## 11. RÈGLE SUR LES JEUX DE RÔLE / TERRAIN

Les jeux de rôle et observations terrain sont pertinents.
Ils servent à :
- observer le réel
- confirmer l’oral
- nourrir la preuve
- enrichir le rapport

Mais ils ne doivent pas devenir :
- une couche lourde de formulaires
- un protocole impossible à exécuter
- une séance annexe décorative

Ils doivent rester :
- courts
- ciblés
- notables rapidement
- exploitables dans la grille officielle

---

## 12. RÈGLE SUR LE REPORTING

Le reporting n’est pas un module annexe.

C’est un cœur business du produit.

Toute dérive qui dégrade :
- le score /45
- la progression
- les statuts
- la lecture par apprenant
- la lecture par hôtel
- la lecture par compétence

est une dérive grave.

### Si une évolution est “belle” mais rend le reporting plus flou :
👉 elle est mauvaise.

---

## 13. RÈGLE SUR LE CONTENU

Le contenu n’a de valeur que s’il est :
- naturel
- utile
- réutilisable terrain
- relié au métier
- relié à la mesure

Interdit :
- produire du contenu pour gonfler les volumes
- créer des items gadgets
- sortir du cadre hôtelier sans raison forte
- multiplier les types d’exercices non canoniques

---

## 14. RÈGLE SUR LE SCHÉMA ET LES DONNÉES

La base doit rester canonique.

Interdit :
- réintroduire du legacy
- mélanger anciennes et nouvelles structures
- créer des colonnes/tableaux parallèles sans justification
- casser la compatibilité reporting

Le bon réflexe :
- patch ciblé
- structure simple
- compatibilité avec la base canonique
- contrôle de l’impact sur la preuve

---

## 15. RÈGLE SUR LA TECHNIQUE

Le projet doit rester :
- robuste
- mobile-first
- compatible Android modestes
- tolérant au réseau imparfait
- raisonnable en complexité

Interdit :
- dépendances exotiques inutiles
- refactor massif pour “faire propre”
- architecture parallèle
- UX lourde
- animations ou sophistication sans valeur produit

---

## 16. RÈGLE SUR LES AGENTS / IA

Les agents doivent :
- commencer par un audit ciblé
- lire peu, mais juste
- corriger les bugs bloquants d’abord
- limiter les tokens
- ne pas inventer de scope
- protéger la base canonique

Interdit :
- repartir d’anciens prompts obsolètes
- scanner tout le repo
- improviser de nouvelles logiques métier
- faire des refactors pour le style

---

## 17. QUESTIONS ANTI-DÉRIVE À POSER AVANT TOUT AJOUT

Avant d’ajouter une feature, vérifier :

1. Est-ce que cela améliore vraiment l’apprentissage terrain ?
2. Est-ce que cela améliore vraiment la mesure de progression ?
3. Est-ce que cela aide réellement le consultant ou le RH ?
4. Est-ce que cela renforce la preuve, ou seulement l’apparence ?
5. Est-ce que cela reste simple à utiliser sur le terrain ?
6. Est-ce que cela respecte la logique score /45 + validation humaine ?
7. Est-ce que cela évite la dérive LMS / gadget ?

Si la réponse n’est pas clairement “oui” :
👉 ne pas faire

---

## 18. FORMULE FINALE À PROTÉGER

Le produit doit rester ceci :

**Le digital scale.  
L’humain valide.  
Le reporting prouve.**

Si une évolution casse cette chaîne :
👉 elle est hors cadre.
