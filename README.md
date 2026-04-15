# Hotel English Pro — Application Anglais Hôtelier

## Structure du projet

```
hotel-english-app/
│
├── src/                  # Code TypeScript (logique app)
│   ├── types.ts          # Types, interfaces, constantes
│   ├── srs.ts            # Algorithme de répétition espacée
│   ├── validation.ts     # Validation des réponses
│   ├── session.ts        # Génération de sessions d'exercices
│   ├── scoring.ts        # Notation et rapports
│   ├── data.ts           # Données complètes (60 skills, 320 phrases)
│   ├── index.ts          # Point d'entrée exports
│   ├── srs.test.ts       # 68 tests unitaires
│   └── example.ts        # Simulation parcours utilisateur
│
├── data/                 # Données CSV (contenu pédagogique)
│   ├── Actions_Metier.csv        # 20 actions métier (référentiel)
│   ├── v4_Phrases.csv            # 162 phrases FR/EN
│   ├── v3_Quiz.csv               # 45 quiz QCM
│   ├── v4_Scenarios.csv          # 53 scénarios dialogues
│   └── Grille_Evaluation_RH.csv  # Template évaluation RH
│
├── sql/                  # Scripts Supabase (exécuter dans l'ordre)
│   ├── import_1_actions.sql      # 1er — 20 actions métier
│   ├── import_2_phrases.sql      # 2e — phrases FR/EN
│   ├── import_3_quiz.sql         # 3e — 45 quiz
│   └── import_4_scenarios.sql    # 4e — scénarios
│
├── docs/                 # Documentation
│   ├── LIVRAISON_FINALE.md       # Guide technique
│   ├── SYLLABUS_-_...docx        # Programme pédagogique (4 métiers)
│   ├── app_hotel_v4_terrain.xlsx  # Données terrain consolidées
│   └── app_competences_metier.xlsx # Référentiel compétences
│
├── package.json
├── tsconfig.json
└── README.md             # Ce fichier
```

## Démarrage rapide

```bash
npm install
npm run build
npm test          # 68 tests
node dist/example.js
```

## Import Supabase

Exécuter dans le SQL Editor de Supabase, **dans l'ordre** :
1. `sql/import_1_actions.sql`
2. `sql/import_2_phrases.sql`
3. `sql/import_3_quiz.sql`
4. `sql/import_4_scenarios.sql`

## 4 métiers couverts

| Métier | Actions | Phrases | Quiz | Scénarios |
|--------|---------|---------|------|-----------|
| Réception | 5 | ~40 | ~10 | ~13 |
| Housekeeping | 5 | ~40 | ~10 | ~13 |
| Restaurant | 5 | ~40 | ~10 | ~13 |
| Sécurité | 5 | ~40 | ~15 | ~14 |

## Niveaux CECRL

- **N1 Foundations** — A1 métier
- **N2 Core Operations** — A1+ → A2-
- **N3 Service Excellence** — A2 métier
- **N4 Professional Fluency** — A2+ → B1 métier
