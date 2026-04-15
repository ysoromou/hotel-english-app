// ═══════════════════════════════════════════════════════════════
// SESSION GENERATOR - Génération des sessions d'exercices
// ═══════════════════════════════════════════════════════════════

import {
  Exercise,
  ExerciseSource,
  ExerciseType,
  MemoryItem,
  Phrase,
  Role,
  Level,
  CECRLevel,
  Scenario,
  SESSION_CONFIG,
  getAllowedLevels,
  TranslateExercise,
  FillBlankExercise,
  ReorderExercise,
  QCMExercise,
  MatchPairsExercise,
  ScenarioExercise,
} from './types';
import { getDueItems, getRecentErrors } from './srs';

// ─────────────────────────────────────────────────────────────────
// GÉNÉRATION DE SESSION
// ─────────────────────────────────────────────────────────────────

interface SessionGeneratorInput {
  memory: Map<string, MemoryItem>;
  phrases: Phrase[];
  scenarios: Scenario[];
  userLevel: Level;
  userRole: Role;
}

export function generateSession(input: SessionGeneratorInput): Exercise[] {
  const { memory, phrases, scenarios, userLevel, userRole } = input;
  const allowedLevels = getAllowedLevels(userLevel);

  // Filtrer phrases par rôle et niveau
  const rolePhrases = phrases.filter(
    (p) => p.role === userRole && allowedLevels.includes(p.level)
  );

  const exercises: Exercise[] = [];
  const usedPhraseIds = new Set<string>();

  // 1. ITEMS DUS (40%)
  const dueCount = Math.ceil(SESSION_CONFIG.SIZE_DEFAULT * SESSION_CONFIG.RATIO_DUE);
  const dueItems = getDueItems(memory, userRole, dueCount);

  for (const item of dueItems) {
    const phrase = rolePhrases.find((p) => p.id === item.phraseId);
    if (phrase && !usedPhraseIds.has(phrase.id)) {
      const exercise = generateExerciseFromPhrase(phrase, 'DUE');
      if (exercise) {
        exercises.push(exercise);
        usedPhraseIds.add(phrase.id);
      }
    }
  }

  // 2. ERREURS RÉCENTES (25%)
  const errorCount = Math.ceil(SESSION_CONFIG.SIZE_DEFAULT * SESSION_CONFIG.RATIO_ERRORS);
  const errorItems = getRecentErrors(memory, userRole, errorCount);

  for (const item of errorItems) {
    const phrase = rolePhrases.find((p) => p.id === item.phraseId);
    if (phrase && !usedPhraseIds.has(phrase.id)) {
      // Pour les erreurs, privilégier exercices de production
      const exercise = generateExerciseFromPhrase(phrase, 'ERROR', true);
      if (exercise) {
        exercises.push(exercise);
        usedPhraseIds.add(phrase.id);
      }
    }
  }

  // 3. NOUVEAUX ITEMS (compléter jusqu'à taille cible)
  const newCount = SESSION_CONFIG.SIZE_DEFAULT - exercises.length;
  const unseenPhrases = rolePhrases.filter(
    (p) => !memory.has(p.id) && !usedPhraseIds.has(p.id)
  );

  // Mélanger et prendre les N premiers
  const shuffledNew = shuffleArray([...unseenPhrases]);
  for (let i = 0; i < Math.min(newCount, shuffledNew.length); i++) {
    const phrase = shuffledNew[i];
    const exercise = generateExerciseFromPhrase(phrase, 'NEW');
    if (exercise) {
      exercises.push(exercise);
      usedPhraseIds.add(phrase.id);
    }
  }

  // Si pas assez de nouveaux, prendre des vus non maîtrisés
  if (exercises.length < SESSION_CONFIG.SIZE_DEFAULT) {
    const remaining = SESSION_CONFIG.SIZE_DEFAULT - exercises.length;
    const learningPhrases = rolePhrases.filter((p) => {
      const item = memory.get(p.id);
      return item && !item.mastered && !usedPhraseIds.has(p.id);
    });

    const shuffledLearning = shuffleArray([...learningPhrases]);
    for (let i = 0; i < Math.min(remaining, shuffledLearning.length); i++) {
      const phrase = shuffledLearning[i];
      const exercise = generateExerciseFromPhrase(phrase, 'DUE');
      if (exercise) {
        exercises.push(exercise);
        usedPhraseIds.add(phrase.id);
      }
    }
  }

  // 4. AJOUTER SCÉNARIO (si niveau >= N2)
  if (userLevel !== 'N1') {
    const roleScenarios = scenarios.filter(
      (s) => s.role === userRole && allowedLevels.includes(s.level)
    );
    if (roleScenarios.length > 0) {
      const randomScenario = roleScenarios[Math.floor(Math.random() * roleScenarios.length)];
      exercises.push({
        id: `scenario_${randomScenario.id}`,
        type: 'SCENARIO',
        source: 'NEW',
        instruction: 'Complétez ce scénario',
        targets: randomScenario.skillIds,
        scenario: randomScenario,
      } as ScenarioExercise);
    }
  }

  // 5. AJOUTER MATCH_PAIRS (si assez d'items)
  if (exercises.length >= 4 && Math.random() > 0.5) {
    const matchPairsExercise = generateMatchPairs(rolePhrases, usedPhraseIds);
    if (matchPairsExercise) {
      exercises.push(matchPairsExercise);
    }
  }

  // 6. DIVERSIFIER ET MÉLANGER
  const diversified = diversifyExerciseTypes(exercises);
  return shuffleArray(diversified);
}

// ─────────────────────────────────────────────────────────────────
// GÉNÉRATION D'EXERCICE À PARTIR D'UNE PHRASE
// ─────────────────────────────────────────────────────────────────

const EXERCISE_TYPES: ExerciseType[] = [
  'TRANSLATE_TO_EN',
  'TRANSLATE_TO_FR',
  'FILL_BLANK',
  'REORDER',
  'SITUATION_QCM',
];

const PRODUCTION_TYPES: ExerciseType[] = [
  'TRANSLATE_TO_EN',
  'FILL_BLANK',
  'REORDER',
];

let lastUsedType: ExerciseType | null = null;

function generateExerciseFromPhrase(
  phrase: Phrase,
  source: ExerciseSource,
  preferProduction: boolean = false
): Exercise | null {
  // Sélectionner types disponibles
  let availableTypes = preferProduction ? PRODUCTION_TYPES : EXERCISE_TYPES;

  // Filtrer selon longueur de phrase
  if (phrase.wordCount < 3) {
    availableTypes = availableTypes.filter(
      (t) => t !== 'REORDER' && t !== 'FILL_BLANK'
    );
  }

  // Éviter répétition du même type
  if (lastUsedType && availableTypes.length > 1) {
    availableTypes = availableTypes.filter((t) => t !== lastUsedType);
  }

  if (availableTypes.length === 0) {
    availableTypes = ['TRANSLATE_TO_EN'];
  }

  // Sélectionner type aléatoire
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  lastUsedType = type;

  // Générer selon type
  switch (type) {
    case 'TRANSLATE_TO_EN':
      return generateTranslateToEn(phrase, source);
    case 'TRANSLATE_TO_FR':
      return generateTranslateToFr(phrase, source);
    case 'FILL_BLANK':
      return generateFillBlank(phrase, source);
    case 'REORDER':
      return generateReorder(phrase, source);
    case 'SITUATION_QCM':
      return generateSituationQCM(phrase, source);
    default:
      return generateTranslateToEn(phrase, source);
  }
}

// ─────────────────────────────────────────────────────────────────
// GÉNÉRATEURS PAR TYPE
// ─────────────────────────────────────────────────────────────────

function generateTranslateToEn(phrase: Phrase, source: ExerciseSource): TranslateExercise {
  return {
    id: `trans_en_${phrase.id}_${Date.now()}`,
    type: 'TRANSLATE_TO_EN',
    source,
    instruction: 'Traduisez en anglais',
    prompt: phrase.phraseFr,
    expectedAnswer: phrase.phraseEn,
    acceptableVariants: [],
    minWordCount: Math.ceil(phrase.wordCount * 0.6),
    targets: [phrase.id],
  };
}

function generateTranslateToFr(phrase: Phrase, source: ExerciseSource): TranslateExercise {
  return {
    id: `trans_fr_${phrase.id}_${Date.now()}`,
    type: 'TRANSLATE_TO_FR',
    source,
    instruction: 'Traduisez en français',
    prompt: phrase.phraseEn,
    expectedAnswer: phrase.phraseFr,
    acceptableVariants: [],
    minWordCount: Math.ceil(phrase.wordCount * 0.6),
    targets: [phrase.id],
  };
}

function generateFillBlank(phrase: Phrase, source: ExerciseSource): FillBlankExercise {
  const words = phrase.phraseEn.split(' ');

  // Choisir un mot à masquer (pas le premier, pas les articles)
  const skipWords = ['a', 'an', 'the', 'to', 'is', 'am', 'are', 'i'];
  let wordIndex = 1;

  for (let i = 1; i < words.length; i++) {
    if (!skipWords.includes(words[i].toLowerCase())) {
      wordIndex = i;
      break;
    }
  }

  const maskedWord = words[wordIndex].replace(/[.,?!]/g, '');
  const promptWords = [...words];
  promptWords[wordIndex] = '_____';

  return {
    id: `fill_${phrase.id}_${Date.now()}`,
    type: 'FILL_BLANK',
    source,
    instruction: 'Complétez avec le mot manquant',
    prompt: promptWords.join(' '),
    hint: phrase.phraseFr,
    expectedAnswer: maskedWord.toLowerCase(),
    wordPosition: wordIndex,
    targets: [phrase.id],
  };
}

function generateReorder(phrase: Phrase, source: ExerciseSource): ReorderExercise {
  const words = phrase.phraseEn.split(' ').map((w) => w.replace(/[.,?!]/g, ''));
  const shuffled = shuffleArray([...words]);

  // S'assurer que l'ordre a changé
  while (shuffled.join(' ') === words.join(' ') && words.length > 2) {
    shuffleArray(shuffled);
  }

  return {
    id: `reorder_${phrase.id}_${Date.now()}`,
    type: 'REORDER',
    source,
    instruction: 'Remettez les mots dans le bon ordre',
    hint: phrase.phraseFr,
    words: shuffled,
    expectedOrder: words,
    targets: [phrase.id],
  };
}

function generateSituationQCM(phrase: Phrase, source: ExerciseSource): QCMExercise {
  // Options simples pour le MVP
  const options = [
    { id: 'a', text: phrase.phraseEn },
    { id: 'b', text: 'I don\'t understand.' },
    { id: 'c', text: 'Wait here please.' },
  ];

  // Mélanger les options
  const shuffled = shuffleArray([...options]);
  const correctId = shuffled.find((o) => o.text === phrase.phraseEn)?.id || 'a';

  return {
    id: `qcm_${phrase.id}_${Date.now()}`,
    type: 'SITUATION_QCM',
    source,
    instruction: 'Choisissez la réponse appropriée',
    context: `Situation: ${phrase.phase}`,
    hint: phrase.phraseFr,
    options: shuffled,
    correctId,
    targets: [phrase.id],
  };
}

function generateMatchPairs(
  phrases: Phrase[],
  usedIds: Set<string>
): MatchPairsExercise | null {
  // Sélectionner 4 phrases non utilisées
  const available = phrases.filter((p) => !usedIds.has(p.id));
  if (available.length < 4) return null;

  const shuffled = shuffleArray([...available]);
  const selected = shuffled.slice(0, 4);

  return {
    id: `match_${Date.now()}`,
    type: 'MATCH_PAIRS',
    source: 'NEW',
    instruction: 'Associez les phrases français-anglais',
    pairs: selected.map((p) => ({
      id: p.id,
      fr: p.phraseFr,
      en: p.phraseEn,
    })),
    targets: selected.map((p) => p.id),
  };
}

// ─────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function diversifyExerciseTypes(exercises: Exercise[]): Exercise[] {
  const result: Exercise[] = [];
  const queue = [...exercises];

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Vérifier si on a déjà 2 du même type consécutifs
    if (result.length >= SESSION_CONFIG.MAX_CONSECUTIVE_SAME_TYPE) {
      const lastTypes = result
        .slice(-SESSION_CONFIG.MAX_CONSECUTIVE_SAME_TYPE)
        .map((e) => e.type);

      if (lastTypes.every((t) => t === current.type)) {
        // Chercher un exercice différent dans la queue
        const swapIndex = queue.findIndex((e) => e.type !== current.type);
        if (swapIndex !== -1) {
          // Échanger
          const [swapped] = queue.splice(swapIndex, 1);
          result.push(swapped);
          queue.unshift(current);
          continue;
        }
      }
    }

    result.push(current);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────
// CALCUL XP
// ─────────────────────────────────────────────────────────────────

import { XP_CONFIG } from './types';

export function calculateXP(
  isCorrect: boolean,
  source: ExerciseSource,
  isScenario: boolean = false
): number {
  if (!isCorrect) return 0;

  if (isScenario) {
    return XP_CONFIG.SCENARIO_STEP;
  }

  switch (source) {
    case 'NEW':
      return XP_CONFIG.CORRECT_NEW;
    case 'DUE':
      return XP_CONFIG.CORRECT_DUE;
    case 'ERROR':
      return XP_CONFIG.CORRECT_ERROR;
    default:
      return XP_CONFIG.CORRECT_NEW;
  }
}

export function calculateSessionBonus(
  totalExercises: number,
  correctExercises: number
): number {
  const ratio = correctExercises / totalExercises;
  if (ratio >= 0.9) {
    return XP_CONFIG.SESSION_COMPLETE_BONUS;
  }
  if (ratio >= 0.7) {
    return Math.round(XP_CONFIG.SESSION_COMPLETE_BONUS * 0.5);
  }
  return 0;
}
