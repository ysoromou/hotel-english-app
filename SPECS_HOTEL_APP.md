# SPÉCIFICATIONS TECHNIQUES — Application Anglais Hôtelier Côte d'Ivoire

## MÉTA-INFORMATIONS AGENTS

```yaml
project_name: "HotelEnglish CI"
version: "1.0.0"
lead_agent: "Orchestrator — ne code pas, délègue, valide"
teammates:
  - frontend: "React/Next.js, composants exercices, UI mobile"
  - backend: "Supabase, auth, API, RLS"
  - content: "Génération phrases/quiz/scénarios"
  - qa: "Tests unitaires, intégration, edge cases"
decision_authority: "Humain (Yra) — décisions UX, validation métier CECRL"
```

---

## 1. VISION PRODUIT

### 1.1 Problème résolu
Personnel hôtelier ivoirien (réception, housekeeping, restaurant, sécurité) incapable de communiquer en anglais avec clients internationaux. Formation présentielle = fort absentéisme.

### 1.2 Solution
Application mobile micro-learning : leçons 5-7 min, exercices variés, progression CECRL A1→B1 métier, accessible sur smartphone bas de gamme, connexion intermittente.

### 1.3 Utilisateurs cibles
| Profil | Caractéristiques |
|--------|------------------|
| Apprenants | Personnel hôtelier, niveau scolaire hétérogène, peu exposé à l'anglais écrit |
| RH/Formateurs | Suivi progression, identification abandons, rapports |
| Admin CAFORMAC | Gestion multi-établissements |

### 1.4 Contraintes terrain Côte d'Ivoire
- Smartphones bas/milieu de gamme (Android majoritaire)
- Connexion 3G/4G instable
- Clients non natifs (accents français, nigérian, indien, ghanéen)
- Bruit ambiant (lobby, générateur, circulation)
- Pression hiérarchique forte
- Multitâche fréquent

---

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Stack technologique

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 (App Router) + React 18 + TypeScript            │
│  Tailwind CSS + PWA (offline-first)                         │
│  Capacitor (optionnel pour app native)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  Supabase (PostgreSQL + Auth + Storage + Edge Functions)    │
│  Row Level Security activé                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES EXTERNES                       │
│  ElevenLabs API (TTS) │ Cloudinary (CDN audio)              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Structure des dossiers

```
hotel-english-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Routes authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (app)/             # Routes protégées
│   │   │   ├── dashboard/
│   │   │   ├── lessons/
│   │   │   │   └── [action_id]/
│   │   │   ├── exercises/
│   │   │   │   └── [exercise_type]/
│   │   │   └── profile/
│   │   ├── (admin)/           # Routes admin/RH
│   │   │   ├── users/
│   │   │   ├── reports/
│   │   │   └── content/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # Composants génériques
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── AudioPlayer.tsx
│   │   ├── exercises/         # Composants exercices
│   │   │   ├── QCMExercise.tsx
│   │   │   ├── TranslationExercise.tsx
│   │   │   ├── FillBlankExercise.tsx
│   │   │   ├── ReorderExercise.tsx
│   │   │   ├── MatchingExercise.tsx
│   │   │   ├── DialogueExercise.tsx
│   │   │   └── ConflictExercise.tsx
│   │   ├── lesson/
│   │   │   ├── LessonCard.tsx
│   │   │   ├── PhraseDisplay.tsx
│   │   │   └── DialoguePlayer.tsx
│   │   └── dashboard/
│   │       ├── ProgressChart.tsx
│   │       └── ActionGrid.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── hooks/
│   │   │   ├── useProgress.ts
│   │   │   ├── useExercise.ts
│   │   │   └── useOffline.ts
│   │   └── utils/
│   │       ├── scoring.ts
│   │       └── audio.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── calculate-score/
│   │   └── generate-report/
│   └── seed.sql
├── public/
│   ├── audio/                 # Cache local audio
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
│   └── elevenlabs_batch.py
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## 3. MODÈLE DE DONNÉES

### 3.1 Schéma Supabase (PostgreSQL)

```sql
-- =============================================
-- TABLES RÉFÉRENTIELLES (contenu statique)
-- =============================================

-- Métiers hôteliers
CREATE TABLE metiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL, -- REC, HK, REST, SEC
    nom_fr VARCHAR(100) NOT NULL,
    nom_en VARCHAR(100) NOT NULL,
    ordre INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actions métier (20 actions)
CREATE TABLE actions_metier (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id VARCHAR(30) UNIQUE NOT NULL, -- REC_CHECKIN, HK_ENTRY, etc.
    metier_code VARCHAR(20) REFERENCES metiers(code),
    action_fr VARCHAR(200) NOT NULL,
    description TEXT,
    niveau_cible VARCHAR(10) NOT NULL, -- A1, A1+, A2, A2+, B1
    critique_conflit BOOLEAN DEFAULT FALSE,
    ordre INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phrases (162 phrases)
CREATE TABLE phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phrase_id VARCHAR(50) UNIQUE NOT NULL,
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    phrase_fr TEXT NOT NULL,
    phrase_en TEXT NOT NULL,
    phase VARCHAR(50), -- Accueil, Verification, Attribution, etc.
    niveau VARCHAR(10) NOT NULL,
    voice_type VARCHAR(10) DEFAULT 'STAFF', -- STAFF ou CLIENT
    audio_url TEXT,
    ordre INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz (45 quiz)
CREATE TABLE quiz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id VARCHAR(50) UNIQUE NOT NULL,
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    type_quiz VARCHAR(20) NOT NULL, -- SITUATION, TRADUCTION, CONFLIT
    niveau VARCHAR(10) NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    reponse_correcte CHAR(1) NOT NULL, -- A, B, ou C
    explication TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scénarios dialogues (53 scénarios)
CREATE TABLE scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id VARCHAR(50) UNIQUE NOT NULL,
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    type VARCHAR(20) NOT NULL, -- NORMAL, CONFLIT
    niveau VARCHAR(10) NOT NULL,
    contexte TEXT NOT NULL,
    objectif_salarie TEXT NOT NULL,
    dialogue_modele TEXT NOT NULL,
    criteres_reussite TEXT,
    audio_dialogue_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLES UTILISATEURS
-- =============================================

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(200),
    metier_code VARCHAR(20) REFERENCES metiers(code),
    etablissement VARCHAR(200),
    role VARCHAR(20) DEFAULT 'learner', -- learner, hr, admin
    niveau_actuel VARCHAR(10) DEFAULT 'A1',
    date_inscription TIMESTAMPTZ DEFAULT NOW(),
    derniere_connexion TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progression par action
CREATE TABLE user_action_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    phrases_completed INT DEFAULT 0,
    phrases_total INT DEFAULT 0,
    quiz_score_avg DECIMAL(5,2) DEFAULT 0,
    quiz_attempts INT DEFAULT 0,
    scenario_completed BOOLEAN DEFAULT FALSE,
    scenario_score DECIMAL(5,2),
    statut VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, mastered
    derniere_activite TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, action_id)
);

-- Réponses aux exercices (pour analytics)
CREATE TABLE exercise_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    exercise_type VARCHAR(30) NOT NULL, -- phrase_listen, quiz, scenario, etc.
    exercise_id VARCHAR(50) NOT NULL, -- phrase_id ou quiz_id ou scenario_id
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    reponse_user TEXT,
    reponse_correcte TEXT,
    is_correct BOOLEAN,
    score DECIMAL(5,2),
    temps_reponse_ms INT,
    tentative_num INT DEFAULT 1,
    metadata JSONB DEFAULT '{}', -- infos supplémentaires
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions d'apprentissage
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INT,
    exercises_completed INT DEFAULT 0,
    score_session DECIMAL(5,2),
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLES RH / EVALUATION
-- =============================================

-- Evaluations RH
CREATE TABLE evaluations_rh (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    evaluateur_id UUID REFERENCES profiles(id),
    action_id VARCHAR(30) REFERENCES actions_metier(action_id),
    score_avant DECIMAL(5,2),
    score_apres DECIMAL(5,2),
    statut VARCHAR(20), -- en_cours, validé, à_revoir
    commentaire TEXT,
    date_evaluation TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEX POUR PERFORMANCE
-- =============================================

CREATE INDEX idx_phrases_action ON phrases(action_id);
CREATE INDEX idx_quiz_action ON quiz(action_id);
CREATE INDEX idx_scenarios_action ON scenarios(action_id);
CREATE INDEX idx_progress_user ON user_action_progress(user_id);
CREATE INDEX idx_responses_user ON exercise_responses(user_id);
CREATE INDEX idx_responses_created ON exercise_responses(created_at);
CREATE INDEX idx_sessions_user ON learning_sessions(user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_action_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations_rh ENABLE ROW LEVEL SECURITY;

-- Policies : utilisateur voit ses propres données
CREATE POLICY "Users view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users view own progress" ON user_action_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own responses" ON exercise_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own sessions" ON learning_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Policies RH : voir tous les apprenants de leur établissement
CREATE POLICY "HR view learners" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles hr 
            WHERE hr.id = auth.uid() 
            AND hr.role IN ('hr', 'admin')
            AND hr.etablissement = profiles.etablissement
        )
    );

-- Tables référentielles : lecture publique
CREATE POLICY "Public read metiers" ON metiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read actions" ON actions_metier FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read phrases" ON phrases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read quiz" ON quiz FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read scenarios" ON scenarios FOR SELECT TO authenticated USING (true);
```

### 3.2 Types TypeScript

```typescript
// types/index.ts

export type Niveau = 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1';
export type MetierCode = 'REC' | 'HK' | 'REST' | 'SEC';
export type UserRole = 'learner' | 'hr' | 'admin';
export type VoiceType = 'STAFF' | 'CLIENT';
export type QuizType = 'SITUATION' | 'TRADUCTION' | 'CONFLIT';
export type ScenarioType = 'NORMAL' | 'CONFLIT';
export type ExerciseType = 
  | 'phrase_listen' 
  | 'phrase_translate' 
  | 'phrase_fill_blank'
  | 'phrase_reorder'
  | 'phrase_match'
  | 'quiz_qcm'
  | 'scenario_dialogue'
  | 'scenario_conflict';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';

export interface Metier {
  id: string;
  code: MetierCode;
  nom_fr: string;
  nom_en: string;
  ordre: number;
}

export interface ActionMetier {
  id: string;
  action_id: string;
  metier_code: MetierCode;
  action_fr: string;
  description: string;
  niveau_cible: Niveau;
  critique_conflit: boolean;
  ordre: number;
}

export interface Phrase {
  id: string;
  phrase_id: string;
  action_id: string;
  phrase_fr: string;
  phrase_en: string;
  phase: string;
  niveau: Niveau;
  voice_type: VoiceType;
  audio_url: string | null;
}

export interface Quiz {
  id: string;
  quiz_id: string;
  action_id: string;
  type_quiz: QuizType;
  niveau: Niveau;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string | null;
  reponse_correcte: 'A' | 'B' | 'C';
  explication: string | null;
}

export interface Scenario {
  id: string;
  scenario_id: string;
  action_id: string;
  type: ScenarioType;
  niveau: Niveau;
  contexte: string;
  objectif_salarie: string;
  dialogue_modele: string;
  criteres_reussite: string;
  audio_dialogue_url: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  nom_complet: string | null;
  metier_code: MetierCode | null;
  etablissement: string | null;
  role: UserRole;
  niveau_actuel: Niveau;
  date_inscription: string;
  derniere_connexion: string | null;
  preferences: Record<string, unknown>;
}

export interface UserActionProgress {
  id: string;
  user_id: string;
  action_id: string;
  phrases_completed: number;
  phrases_total: number;
  quiz_score_avg: number;
  quiz_attempts: number;
  scenario_completed: boolean;
  scenario_score: number | null;
  statut: ProgressStatus;
  derniere_activite: string | null;
}

export interface ExerciseResponse {
  id: string;
  user_id: string;
  exercise_type: ExerciseType;
  exercise_id: string;
  action_id: string;
  reponse_user: string | null;
  reponse_correcte: string | null;
  is_correct: boolean;
  score: number;
  temps_reponse_ms: number;
  tentative_num: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  exercises_completed: number;
  score_session: number | null;
}
```

---

## 4. COMPOSANTS EXERCICES

### 4.1 Spécifications par type

#### 4.1.1 QCM Situationnel (`QCMExercise.tsx`)

```typescript
interface QCMExerciseProps {
  quiz: Quiz;
  onAnswer: (response: ExerciseResponse) => void;
  showFeedback: boolean;
}

// Comportement :
// 1. Afficher question + contexte
// 2. 3 options (boutons radio ou cards)
// 3. Validation au clic
// 4. Feedback immédiat (vert/rouge + explication)
// 5. Timer optionnel (visible, non bloquant)
// 6. Pas de double-soumission

// UI mobile :
// - Boutons pleine largeur
// - Touch target minimum 48px
// - Feedback haptique si supporté
```

#### 4.1.2 Traduction (`TranslationExercise.tsx`)

```typescript
interface TranslationExerciseProps {
  phrase: Phrase;
  direction: 'fr_to_en' | 'en_to_fr';
  onAnswer: (response: ExerciseResponse) => void;
  hints?: string[]; // Mots-clés acceptables
}

// Comportement :
// 1. Afficher phrase source
// 2. Input texte libre
// 3. Tolérance : casse ignorée, ponctuation flexible
// 4. Scoring partiel (Levenshtein ou mots-clés)
// 5. Afficher réponse modèle après soumission

// Scoring :
// - 100% : correspondance exacte
// - 80% : tous mots-clés présents
// - 50% : majorité mots-clés
// - 0% : hors sujet
```

#### 4.1.3 Texte à trous (`FillBlankExercise.tsx`)

```typescript
interface FillBlankExerciseProps {
  phrase: Phrase;
  blanks: { index: number; answer: string }[];
  onAnswer: (response: ExerciseResponse) => void;
}

// Comportement :
// 1. Phrase avec ___ pour les trous
// 2. Input inline pour chaque trou
// 3. Validation globale
// 4. Focus automatique sur premier trou
// 5. Navigation clavier (Tab)
```

#### 4.1.4 Réordonnancement (`ReorderExercise.tsx`)

```typescript
interface ReorderExerciseProps {
  phrase: Phrase;
  shuffledWords: string[];
  onAnswer: (response: ExerciseResponse) => void;
}

// Comportement :
// 1. Mots mélangés en chips/tags
// 2. Drag & drop OU tap-to-select
// 3. Zone de construction de phrase
// 4. Possibilité de retirer un mot placé
// 5. Validation quand tous les mots placés

// Mobile :
// - Touch drag fluide
// - Fallback tap-to-add pour petits écrans
// - Animation de réarrangement
```

#### 4.1.5 Matching (`MatchingExercise.tsx`)

```typescript
interface MatchingExerciseProps {
  pairs: { fr: string; en: string }[];
  onAnswer: (response: ExerciseResponse) => void;
}

// Comportement :
// 1. Colonne gauche : français
// 2. Colonne droite : anglais (mélangé)
// 3. Sélection par tap (highlight)
// 4. Lien visuel quand paire créée
// 5. Validation quand toutes les paires faites

// Mobile :
// - Scroll synchronisé si longue liste
// - Lignes de connexion SVG
// - Feedback couleur par paire
```

#### 4.1.6 Dialogue interactif (`DialogueExercise.tsx`)

```typescript
interface DialogueExerciseProps {
  scenario: Scenario;
  onComplete: (response: ExerciseResponse) => void;
  audioEnabled: boolean;
}

// Comportement :
// 1. Afficher contexte + objectif
// 2. Dialogue ligne par ligne
// 3. Lignes STAFF : choix multiples ou input
// 4. Lignes CLIENT : affichage + audio auto
// 5. Progression séquentielle
// 6. Score basé sur critères de réussite

// Modes :
// - Guidé : choix parmi 3 réponses
// - Libre : input texte + validation IA
// - Écoute seule : playback du modèle
```

#### 4.1.7 Gestion de conflit (`ConflictExercise.tsx`)

```typescript
interface ConflictExerciseProps {
  scenario: Scenario; // type: CONFLIT
  onComplete: (response: ExerciseResponse) => void;
  stressMode: boolean; // Timer visible, débit rapide
}

// Comportement :
// 1. Mise en situation : client frustré
// 2. Audio client avec accent/émotion
// 3. Timer visible (optionnel)
// 4. Choix de réponse sous pression
// 5. Conséquences narratives selon choix
// 6. Debriefing : meilleure approche

// Variations stress (niveau B1) :
// - Timer 10 secondes
// - Audio débit rapide
// - Bruit de fond simulé
```

### 4.2 Système de feedback

```typescript
interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  explanation?: string;
  nextAction: 'retry' | 'next' | 'complete';
}

// Feedback visuel :
// - Correct : fond vert clair, icône check, son succès
// - Incorrect : fond rouge clair, icône X, son erreur
// - Partiel : fond orange, pourcentage

// Feedback textuel :
// - Toujours montrer la bonne réponse
// - Explication courte (1-2 phrases)
// - Encouragement non condescendant
```

---

## 5. LOGIQUE MÉTIER

### 5.1 Algorithme de scoring

```typescript
// lib/utils/scoring.ts

export function calculateQuizScore(
  userAnswer: string,
  correctAnswer: string,
  quizType: QuizType
): number {
  // QCM simple : 0 ou 100
  if (quizType === 'SITUATION' || quizType === 'CONFLIT') {
    return userAnswer === correctAnswer ? 100 : 0;
  }
  return 0;
}

export function calculateTranslationScore(
  userAnswer: string,
  correctAnswer: string,
  keywords: string[]
): number {
  const normalized = (s: string) => s.toLowerCase().trim().replace(/[.,!?]/g, '');
  
  // Correspondance exacte
  if (normalized(userAnswer) === normalized(correctAnswer)) return 100;
  
  // Score par mots-clés
  const userWords = normalized(userAnswer).split(/\s+/);
  const matchedKeywords = keywords.filter(kw => 
    userWords.some(w => w.includes(kw.toLowerCase()))
  );
  
  const keywordScore = (matchedKeywords.length / keywords.length) * 80;
  return Math.round(keywordScore);
}

export function calculateReorderScore(
  userOrder: string[],
  correctOrder: string[]
): number {
  if (userOrder.join(' ') === correctOrder.join(' ')) return 100;
  
  // Score partiel basé sur position correcte
  let correctPositions = 0;
  userOrder.forEach((word, i) => {
    if (word === correctOrder[i]) correctPositions++;
  });
  
  return Math.round((correctPositions / correctOrder.length) * 100);
}
```

### 5.2 Progression et répétition espacée

```typescript
// lib/hooks/useProgress.ts

export function calculateNextReview(
  currentLevel: number, // 1-5
  wasCorrect: boolean
): { nextLevel: number; nextReviewDate: Date } {
  const intervals = [1, 3, 7, 14, 30]; // jours
  
  let nextLevel = wasCorrect 
    ? Math.min(currentLevel + 1, 5)
    : Math.max(currentLevel - 1, 1);
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervals[nextLevel - 1]);
  
  return { nextLevel, nextReviewDate };
}

export function determineActionStatus(progress: UserActionProgress): ProgressStatus {
  const { phrases_completed, phrases_total, quiz_score_avg, scenario_completed } = progress;
  
  if (phrases_completed === 0) return 'not_started';
  if (phrases_completed < phrases_total) return 'in_progress';
  if (!scenario_completed || quiz_score_avg < 70) return 'completed';
  if (quiz_score_avg >= 85 && scenario_completed) return 'mastered';
  
  return 'completed';
}
```

### 5.3 Génération de parcours adaptatif

```typescript
// lib/utils/lesson-generator.ts

export function generateLessonPlan(
  action: ActionMetier,
  phrases: Phrase[],
  quiz: Quiz[],
  scenarios: Scenario[],
  userProgress: UserActionProgress | null
): LessonStep[] {
  const steps: LessonStep[] = [];
  
  // 1. Introduction : 2-3 phrases clés (écoute + répétition)
  const keyPhrases = phrases.slice(0, 3);
  keyPhrases.forEach(p => {
    steps.push({ type: 'phrase_listen', content: p });
    steps.push({ type: 'phrase_translate', content: p, direction: 'en_to_fr' });
  });
  
  // 2. Quiz de compréhension (2 questions)
  const situationQuiz = quiz.filter(q => q.type_quiz === 'SITUATION').slice(0, 2);
  situationQuiz.forEach(q => {
    steps.push({ type: 'quiz_qcm', content: q });
  });
  
  // 3. Exercices actifs (3-4)
  steps.push({ type: 'phrase_fill_blank', content: phrases[3] });
  steps.push({ type: 'phrase_reorder', content: phrases[4] });
  
  // 4. Scénario de synthèse
  const normalScenario = scenarios.find(s => s.type === 'NORMAL');
  if (normalScenario) {
    steps.push({ type: 'scenario_dialogue', content: normalScenario });
  }
  
  // 5. (Niveau B1) Scénario conflit
  if (action.critique_conflit) {
    const conflictScenario = scenarios.find(s => s.type === 'CONFLIT');
    if (conflictScenario) {
      steps.push({ type: 'scenario_conflict', content: conflictScenario });
    }
  }
  
  return steps;
}
```

---

## 6. UI/UX SPECIFICATIONS

### 6.1 Design tokens

```css
/* styles/globals.css */

:root {
  /* Couleurs principales */
  --color-primary: #2563eb;      /* Bleu Anthropic-like */
  --color-primary-dark: #1d4ed8;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #f59e0b;
  
  /* Couleurs métier */
  --color-reception: #3b82f6;
  --color-housekeeping: #8b5cf6;
  --color-restaurant: #f97316;
  --color-security: #64748b;
  
  /* Niveaux CECRL */
  --color-a1: #22c55e;
  --color-a2: #eab308;
  --color-b1: #f97316;
  
  /* Espacement */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Touch targets (mobile) */
  --touch-target-min: 44px;
}
```

### 6.2 Contraintes mobile

```typescript
// Règles UI mobile strictes

const MOBILE_CONSTRAINTS = {
  // Touch targets
  minTouchTarget: 44, // pixels
  minButtonHeight: 48,
  minInputHeight: 44,
  
  // Espacement
  minTapSpacing: 8, // entre éléments cliquables
  
  // Texte
  minFontSize: 14, // pixels
  maxLineLength: 45, // caractères (pour lisibilité)
  
  // Performance
  maxInitialLoadKB: 500, // First Contentful Paint
  maxImageSizeKB: 100,
  audioPreloadStrategy: 'metadata', // pas 'auto'
  
  // Offline
  cacheStrategy: 'stale-while-revalidate',
  offlineIndicator: true,
};
```

### 6.3 Composants prioritaires (ordre de développement)

1. **AudioPlayer** — Lecture phrases avec contrôles accessibles
2. **ProgressBar** — Barre de progression leçon
3. **QCMExercise** — Exercice le plus fréquent
4. **FeedbackModal** — Feedback uniforme
5. **LessonCard** — Navigation actions
6. **DialogueExercise** — Scénarios
7. **ReorderExercise** — Drag & drop
8. **OfflineIndicator** — État connexion

---

## 7. DONNÉES INITIALES

### 7.1 Actions métier (20)

| action_id | Métier | Action | Niveau |
|-----------|--------|--------|--------|
| REC_CHECKIN | Réception | Réaliser un check-in complet | A2 |
| REC_CHECKOUT | Réception | Gérer un check-out | A2 |
| REC_INFO | Réception | Donner une information standard | A1+ |
| REC_COMPLAINT | Réception | Gérer une réclamation | B1 |
| REC_CHANGE | Réception | Changer de chambre | A2+ |
| HK_ENTRY | Housekeeping | Demander l'autorisation d'entrer | A1 |
| HK_CLEAN | Housekeeping | Expliquer le nettoyage | A1+ |
| HK_REQUEST | Housekeeping | Répondre à une demande client | A2 |
| HK_COMPLAINT | Housekeeping | Gérer une plainte chambre | A2+ |
| HK_PROBLEM | Housekeeping | Signaler un problème technique | A2 |
| REST_WELCOME | Restaurant | Accueillir et installer | A1+ |
| REST_ORDER | Restaurant | Prendre une commande complète | A2 |
| REST_SERVE | Restaurant | Servir et vérifier satisfaction | A2 |
| REST_COMPLAINT | Restaurant | Gérer un problème de service | B1 |
| REST_BILL | Restaurant | Présenter l'addition et encaisser | A2 |
| SEC_CONTROL | Sécurité | Contrôler un accès | A1+ |
| SEC_DIRECT | Sécurité | Orienter un client | A1+ |
| SEC_RULE | Sécurité | Expliquer une règle | A2 |
| SEC_CONFLICT | Sécurité | Désamorcer une tension | B1 |
| SEC_INCIDENT | Sécurité | Gérer un incident nocturne | A2+ |

### 7.2 Fichiers CSV source

Importer depuis le projet :
- `Actions_Metier.csv` → table `actions_metier`
- `v4_Phrases.csv` → table `phrases`
- `v3_Quiz.csv` → table `quiz`
- `v4_Scenarios.csv` → table `scenarios`

---

## 8. TESTS ET VALIDATION

### 8.1 Tests unitaires requis

```typescript
// tests/unit/scoring.test.ts
describe('Scoring functions', () => {
  test('calculateQuizScore returns 100 for correct answer');
  test('calculateQuizScore returns 0 for wrong answer');
  test('calculateTranslationScore handles exact match');
  test('calculateTranslationScore handles partial keywords');
  test('calculateReorderScore handles correct order');
  test('calculateReorderScore handles partial order');
});

// tests/unit/progress.test.ts
describe('Progress functions', () => {
  test('calculateNextReview increases level on correct');
  test('calculateNextReview decreases level on wrong');
  test('determineActionStatus returns not_started for 0 phrases');
  test('determineActionStatus returns mastered for high scores');
});
```

### 8.2 Tests intégration

```typescript
// tests/integration/exercise-flow.test.ts
describe('Exercise flow', () => {
  test('Complete QCM exercise saves response to DB');
  test('Complete lesson updates progress');
  test('Offline exercise syncs when online');
});
```

### 8.3 Tests E2E (Cypress/Playwright)

```typescript
// tests/e2e/learner-journey.spec.ts
describe('Learner journey', () => {
  test('New user can register and select metier');
  test('User can complete first lesson');
  test('Progress persists across sessions');
  test('User can view dashboard with stats');
});
```

### 8.4 Edge cases critiques

| Cas | Test requis |
|-----|-------------|
| Connexion perdue pendant exercice | Sauvegarde locale + sync |
| Double soumission rapide | Debounce + idempotence |
| Très long temps de réponse | Timeout + retry |
| Caractères spéciaux dans input | Sanitization |
| Audio ne charge pas | Fallback texte |
| Session expirée | Redirect + conservation état |

---

## 9. DÉPLOIEMENT

### 9.1 Variables d'environnement

```env
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# ElevenLabs (backend only)
ELEVENLABS_API_KEY=xxx

# Cloudinary (audio CDN)
CLOUDINARY_URL=cloudinary://xxx

# Analytics (optionnel)
NEXT_PUBLIC_POSTHOG_KEY=xxx
```

### 9.2 Commandes de déploiement

```bash
# Développement local
npm run dev

# Build production
npm run build

# Migrations Supabase
npx supabase db push

# Seed données
npx supabase db seed

# Déploiement Vercel
vercel --prod
```

### 9.3 Checklist pré-production

- [ ] Variables d'environnement configurées
- [ ] Migrations appliquées
- [ ] Données seed importées
- [ ] RLS policies testées
- [ ] Tests E2E passent
- [ ] Lighthouse score mobile ≥ 80
- [ ] PWA installable testée
- [ ] Offline mode fonctionnel
- [ ] Audio préchargé correctement

---

## 10. DÉCISIONS RÉSERVÉES À L'HUMAIN

Les agents **DOIVENT** demander validation pour :

1. **Design UX** — Choix de navigation, flow d'onboarding
2. **Contenu pédagogique** — Nouvelles phrases, calibration CECRL
3. **Tarification/Monétisation** — Si applicable
4. **Choix de providers** — ElevenLabs vs alternatives, hébergement
5. **Intégrations tierces** — Analytics, crash reporting
6. **Changements de scope** — Fonctionnalités non spécifiées
7. **Données sensibles** — Structure PII, conformité RGPD

---

## 11. GLOSSAIRE

| Terme | Définition |
|-------|------------|
| CECRL | Cadre Européen Commun de Référence pour les Langues |
| Action métier | Compétence professionnelle ciblée (ex: check-in) |
| Phrase | Unité linguistique FR/EN avec audio |
| Quiz | Question à choix multiples |
| Scénario | Dialogue simulé complet |
| Conflit | Situation avec client difficile |
| RLS | Row Level Security (Supabase) |
| PWA | Progressive Web App |

---

## FIN DU DOCUMENT

**Version** : 1.0.0  
**Date** : 2026-02-09  
**Auteur** : Généré par Claude pour projet CAFORMAC  

---

*Ce document sert de référence unique pour les agents Claude Code. Toute déviation nécessite validation humaine.*
