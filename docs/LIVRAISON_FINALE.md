# LIVRAISON COMPLÈTE - Application Anglais Hôtelier

## Archive principale: `hotel-app.zip`

### Modules TypeScript (src/)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `types.ts` | ~400 | Types, interfaces, constantes (enums, SRS config, session config) |
| `srs.ts` | ~400 | Algorithme SRS complet (create, calculate, processMatchPairs, queries) |
| `validation.ts` | ~315 | Validation réponses (text, QCM, reorder, matchPairs, timeout) |
| `session.ts` | ~280 | Génération sessions (40% dus, 25% erreurs, 35% nouveaux) |
| `scoring.ts` | ~320 | Notation et rapports (test evaluation, comparison, CSV export) |
| `data.ts` | ~1500 | Données complètes (60 skills, 320 phrases, 20 scénarios, 20 tests) |
| `index.ts` | ~50 | Point d'entrée exports |
| `srs.test.ts` | ~550 | 68 tests unitaires (100% pass) |
| `example.ts` | ~360 | Simulation parcours utilisateur complet |

### Tests validés (68/68)

- Création item mémoire (8 tests)
- Calcul SRS succès (13 tests)
- Calcul SRS échec (9 tests)
- Calcul SRS timeout (4 tests)
- Bornes ease/interval (3 tests)
- Multi-cibles match_pairs (11 tests)
- Validation pré-traitement (7 tests)
- Safe calculate (4 tests)
- Requêtes SRS (9 tests)

## Structure données

### Par métier (4 métiers)

| Métier | Skills | Phrases | Scénarios |
|--------|--------|---------|-----------|
| RECEPTION | 15 | 80 | 5 |
| HOUSEKEEPING | 15 | 80 | 5 |
| RESTAURANT | 15 | 80 | 5 |
| SECURITY | 15 | 80 | 5 |

### Par niveau

| Niveau | CECRL | Phrases/métier |
|--------|-------|----------------|
| N1 | A1 | ~30 |
| N2 | A2 | ~30 |
| N3 | B1 | ~20 |

### Par dimension

| Dimension | Skills/métier | Questions test |
|-----------|---------------|----------------|
| COMPREHENSION | 3-4 | 5 |
| PRODUCTION | 3-4 | 5 |
| INTERACTION | 4-5 | 5 |
| CONFLICT | 3-4 | 5 |

## Algorithme SRS

```
SUCCÈS → reps++, ease+0.10, interval=[1,3,7]→×ease
ÉCHEC  → reps--, ease-0.20, interval=1, errorCount++
TIMEOUT → ease-0.10, interval×0.7 (reps inchangé)

MAÎTRISE = repsWritten≥3 ET repsOral≥1
PERTE = errorCount≥3 (maîtrise=false, reps→2)
```

## Commandes

```bash
npm install      # Installer dépendances
npm run build    # Compiler TypeScript
npm test         # Exécuter 68 tests
node dist/example.js  # Simulation complète
```

## Intégration no-code

### Option 1: Supabase Functions
Déployer chaque module comme Edge Function

### Option 2: Import JavaScript
Copier dist/*.js dans Bubble/Bolt

### Option 3: API REST
Wrapper Express autour des modules

## Fichiers associés (outputs/)

- `SPEC_TECHNIQUE_COMPLETE.md` - Spécifications détaillées
- `MODULE_SRS_ISOLE.md` - Documentation SRS
- `hotel-english-pro.jsx` - Version React standalone
- `hotel_english_app.html` - Version HTML prototype
