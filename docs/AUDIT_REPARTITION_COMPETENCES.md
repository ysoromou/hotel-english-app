# Audit de répartition des 15 compétences
## Hotel English Pro — Mapping action → compétences

Basé sur `sql/006_action_competence_mapping.sql` (80 actions × 2–4 compétences chacune)  
Correctif `gerer_appel` inclus (fichier `sql/006b_mapping_patch_gerer_appel.sql`)

---

## Méthode de calcul

- **Nb actions liées** = nombre d'actions qui mentionnent la compétence (tous poids confondus)  
- **Nb poids=3** = nombre d'actions où la compétence est centrale  
- **Métiers couverts** = présence dans au moins une action du métier concerné  
- **Seuil SOUS** = < 4 actions liées  
- **Seuil FORT** = > 12 actions liées  

---

## Tableau complet

| # | Compétence | Nb actions liées | Dont poids=3 | Métiers couverts | Statut | Recommandation |
|---|-----------|:---:|:---:|---|:---:|---|
| 1 | `accueillir_client` | 6 | 4 | REC, RST, HK | OK | Bonne couverture sur les métiers d'accueil. Absence justifiée en SEC (pas de rôle d'accueil). |
| 2 | `comprendre_demande` | 12 | 9 | REC, HK, RST, SEC | OK | Compétence fondamentale bien couverte. Présence équilibrée sur les 4 métiers. |
| 3 | `repondre_demande` | 8 | 6 | REC, HK, RST, SEC | OK | Bien représentée. Couvre les situations de service direct sans interaction complexe. |
| 4 | `donner_information` | 10 | 6 | REC, HK, RST, SEC | OK | Couvre REC (directions, services), RST (menu, vins), SEC (procédures), HK (lost & found). |
| 5 | `orienter_client` | 5 | 4 | REC, RST, SEC | OK | SEC très présente (évacuation, escorte, parking). Absence en HK justifiée (pas de rôle d'orientation géographique). |
| 6 | `verifier_information` | 12 | 7 | REC, HK, RST, SEC | OK | Compétence transversale forte. Check-in, minibar, allergie, contrôle accès. |
| 7 | `reformuler_confirmer` | 8 | 5 | REC, HK, RST | OK | Bien représentée en RST (commande, confirmation, split bill). Absence en SEC justifiée (contexte sécurité ≠ reformulation). |
| 8 | `gerer_reclamation` | 10 | 8 | REC, HK, RST | OK | Fortement présente sur les 3 métiers avec interactions clients. Absence en SEC justifiée (la gestion de tension = `gerer_situation_difficile`). |
| 9 | `proposer_solution` | 11 | 8 | REC, HK, RST, FB | OK | Très bien couverte. Situations de résolution et d'alternative. Présente sur tous les métiers. |
| 10 | `gerer_situation_difficile` | 10 | 8 | REC, HK, RST, SEC | OK | Prépondérante en SEC (5 actions). Présente en REC et RST pour les situations de tension client. |
| 11 | `utiliser_vocabulaire_metier` | 16 | 5 | REC, HK, RST, SEC | FORT | Compétence transversale : présente dans quasi toutes les actions comme compétence de support (poids 2). Pas problématique car c'est son rôle exact. |
| 12 | `maintenir_echange_fluide` | 9 | 3 | REC, HK, RST, SEC | OK | Couvre les situations d'échange prolongé ou délicat (plainte bruit, désescalade, urgence médicale). |
| 13 | `gerer_appel` | 5 | 1 | REC, HK, SEC | OK* | Était SOUS (1 action) → corrigé à 5 actions via patch 006b. Voir détail ci-dessous. |
| 14 | `conclure_interaction` | 7 | 5 | REC, HK, RST | OK | Check-out, feedback, bagagerie, VIP. Absence en SEC justifiée (les interventions SEC n'ont pas de clôture "commerciale"). |
| 15 | `dire_non_professionnellement` | 10 | 7 | REC, HK, SEC | OK | Forte en SEC (5 actions). Présente en REC (clé, départ tardif). Absence en RST justifiée (le restaurant ne refuse pas, il propose des alternatives). |

---

## Détail de la correction : `gerer_appel`

**Situation avant patch** : 1 seule action liée (`REC_SERV_BOOKING`, poids 2).

**Problème** : la compétence était sous-représentée (seuil minimum = 4). Elle apparaissait dans le référentiel CECRL mais ne pouvait pas être évaluée avec suffisamment d'exercices.

**Actions ajoutées via `006b_mapping_patch_gerer_appel.sql`** :

| Action | Poids ajouté | Justification |
|--------|:---:|---|
| `REC_SERV_WAKEUP` | 3 | Un wake-up call EST par définition un appel téléphonique — compétence centrale |
| `REC_CI_WALKIN` | 1 | La réception peut vérifier la disponibilité par téléphone interne |
| `HK_MAINT_REQUEST` | 1 | L'escalade d'une urgence technique implique un appel radio ou téléphonique structuré |
| `SEC_EMERGENCY_MEDICAL` | 2 | Appel des secours (SAMU/pompiers) = gestion d'appel d'urgence |

**Situation après patch** : 5 actions liées, dont 1 poids=3, couvrant REC, HK, SEC.  
Statut : OK* (acceptable, mais compétence structurellement minoritaire — justifié par le contexte terrain Côte d'Ivoire où le téléphone n'est pas central dans tous les métiers).

---

## Résumé global

| Statut | Nb compétences | Compétences concernées |
|:---:|:---:|---|
| OK | 14 | Toutes sauf `gerer_appel` (avant patch) et `utiliser_vocabulaire_metier` |
| FORT | 1 | `utiliser_vocabulaire_metier` (16 actions) — non problématique, rôle de support |
| SOUS | 0 | Aucune après application du patch 006b |

**Conclusion** : le mapping est équilibré après correction. La compétence `utiliser_vocabulaire_metier` est légitimement surreprésentée car elle joue un rôle de support transversal dans toutes les interactions professionnelles — c'est sa nature même.
