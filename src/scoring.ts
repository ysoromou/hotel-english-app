// ═══════════════════════════════════════════════════════════════
// MODULE SCORING - Système de notation et comparaison
// ═══════════════════════════════════════════════════════════════

import {
  SkillScore,
  ComparisonReport,
  TestQuestion,
  TestAnswer,
  Skill,
  Role,
  MemoryItem,
  Phrase,
  TestType,
  TEST_CONFIG,
  calculateLevel,
  Level,
} from './types';

// ─────────────────────────────────────────────────────────────────
// CALCUL SCORE COMPÉTENCE (pendant parcours)
// ─────────────────────────────────────────────────────────────────

interface SkillProgressScore {
  skillId: string;
  score: number; // 0-5
  maxScore: number;
  masteredCount: number;
  totalCount: number;
  percentage: number;
}

export function calculateSkillProgressScore(
  skillId: string,
  phrases: Phrase[],
  memory: Map<string, MemoryItem>
): SkillProgressScore {
  // Filtrer les phrases associées à cette compétence
  const skillPhrases = phrases.filter((p) => p.skillId === skillId);

  if (skillPhrases.length === 0) {
    return {
      skillId,
      score: 0,
      maxScore: 5,
      masteredCount: 0,
      totalCount: 0,
      percentage: 0,
    };
  }

  let totalPoints = 0;
  let masteredCount = 0;

  for (const phrase of skillPhrases) {
    const item = memory.get(phrase.id);

    if (!item) {
      // Jamais vu = 0 points
      totalPoints += 0;
    } else if (item.mastered) {
      // Maîtrisé = 5 points
      totalPoints += 5;
      masteredCount++;
    } else {
      // Score partiel basé sur progression (max 4)
      const points = Math.min(4, item.repsWritten + item.repsOral);
      totalPoints += points;
    }
  }

  const maxPossible = skillPhrases.length * 5;
  const score = Math.round((totalPoints / maxPossible) * 5 * 10) / 10;
  const percentage = Math.round((totalPoints / maxPossible) * 100);

  return {
    skillId,
    score,
    maxScore: 5,
    masteredCount,
    totalCount: skillPhrases.length,
    percentage,
  };
}

// ─────────────────────────────────────────────────────────────────
// ÉVALUATION TEST (INITIAL/FINAL)
// ─────────────────────────────────────────────────────────────────

export interface TestEvaluationResult {
  totalScore: number;
  maxScore: number;
  level: Level;
  skillScores: Map<string, number>;
  answers: TestAnswer[];
}

export function evaluateTest(
  questions: TestQuestion[],
  answers: Map<string, string>, // questionId → answer
  userRole: Role,
  testType: TestType
): TestEvaluationResult {
  const skillScores = new Map<string, number>();
  const skillMaxScores = new Map<string, number>();
  const evaluatedAnswers: TestAnswer[] = [];
  let totalScore = 0;
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  for (const question of questions) {
    const userAnswer = answers.get(question.id) || '';
    let isCorrect = false;

    // Évaluer selon type
    if (question.type === 'QCM') {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === 'TEXT') {
      isCorrect = evaluateTextAnswer(userAnswer, question);
    } else if (question.type === 'ORAL') {
      // Pour l'oral, on accepte une correspondance approximative
      isCorrect = evaluateTextAnswer(userAnswer, question);
    }

    // Calculer score
    const points = isCorrect ? question.points : 0;
    totalScore += points;

    // Accumuler score par skill
    const skillId = question.skillMapping[userRole];
    if (skillId) {
      skillScores.set(skillId, (skillScores.get(skillId) || 0) + points);
      skillMaxScores.set(
        skillId,
        (skillMaxScores.get(skillId) || 0) + question.points
      );
    }

    // Logger la réponse
    evaluatedAnswers.push({
      questionId: question.id,
      answer: userAnswer,
      correct: isCorrect,
      timestamp: Date.now(),
    });
  }

  // Normaliser scores par skill sur 5
  const normalizedSkillScores = new Map<string, number>();
  for (const [skillId, score] of skillScores) {
    const maxForSkill = skillMaxScores.get(skillId) || 1;
    const normalized = Math.round((score / maxForSkill) * 5 * 10) / 10;
    normalizedSkillScores.set(skillId, normalized);
  }

  // Calculer niveau
  const level = calculateLevel(totalScore, maxScore);

  return {
    totalScore,
    maxScore,
    level,
    skillScores: normalizedSkillScores,
    answers: evaluatedAnswers,
  };
}

function evaluateTextAnswer(answer: string, question: TestQuestion): boolean {
  if (!answer || answer.trim().length === 0) return false;

  const normalized = normalizeText(answer);
  const expectedNormalized = normalizeText(question.correctAnswer);

  // Match exact
  if (normalized === expectedNormalized) return true;

  // Variantes acceptables
  if (question.acceptableAnswers) {
    for (const variant of question.acceptableAnswers) {
      if (normalized === normalizeText(variant)) return true;
    }
  }

  // Match partiel (70% des mots)
  const expectedWords = new Set(expectedNormalized.split(' ').filter((w) => w.length > 0));
  const answerWords = new Set(normalized.split(' ').filter((w) => w.length > 0));
  const matchingWords = [...expectedWords].filter((w) => answerWords.has(w));
  const ratio = matchingWords.length / expectedWords.size;

  return ratio >= 0.7;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,?!;:'"''""\-–—]/g, '')
    .replace(/\b(a|an|the|le|la|les|un|une|des|l'|d')\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────────────────────────
// SAUVEGARDE DES SCORES
// ─────────────────────────────────────────────────────────────────

export function saveSkillScores(
  userId: string,
  testType: TestType,
  skillScores: Map<string, number>,
  storage: Map<string, SkillScore[]>
): void {
  const scores: SkillScore[] = [];
  const timestamp = Date.now();

  for (const [skillId, score] of skillScores) {
    scores.push({
      skillId,
      testType,
      score,
      maxScore: 5,
      testedAt: timestamp,
    });
  }

  const key = `${userId}_${testType}`;
  storage.set(key, scores);
}

export function getSkillScores(
  userId: string,
  testType: TestType,
  storage: Map<string, SkillScore[]>
): SkillScore[] {
  const key = `${userId}_${testType}`;
  return storage.get(key) || [];
}

// ─────────────────────────────────────────────────────────────────
// GÉNÉRATION RAPPORT COMPARATIF
// ─────────────────────────────────────────────────────────────────

export function generateComparisonReport(
  userId: string,
  role: Role,
  skills: Skill[],
  initialScores: SkillScore[],
  finalScores: SkillScore[]
): ComparisonReport {
  const roleSkills = skills
    .filter((s) => s.role === role)
    .sort((a, b) => a.order - b.order);

  const skillComparisons: ComparisonReport['skills'] = [];
  let totalInitial = 0;
  let totalFinal = 0;
  let improved = 0;
  let regressed = 0;
  let stable = 0;

  for (const skill of roleSkills) {
    const initialScore = initialScores.find((s) => s.skillId === skill.id);
    const finalScore = finalScores.find((s) => s.skillId === skill.id);

    const initial = initialScore?.score || 0;
    const final = finalScore?.score || 0;
    const progression = Math.round((final - initial) * 10) / 10;

    let status: 'IMPROVED' | 'REGRESSED' | 'STABLE';
    if (progression > 0.2) {
      status = 'IMPROVED';
      improved++;
    } else if (progression < -0.2) {
      status = 'REGRESSED';
      regressed++;
    } else {
      status = 'STABLE';
      stable++;
    }

    skillComparisons.push({
      id: skill.id,
      name: skill.name,
      dimension: skill.dimension,
      initial,
      final,
      progression,
      status,
    });

    totalInitial += initial;
    totalFinal += final;
  }

  const count = roleSkills.length || 1;

  return {
    userId,
    role,
    generatedAt: Date.now(),
    skills: skillComparisons,
    summary: {
      averageInitial: Math.round((totalInitial / count) * 100) / 100,
      averageFinal: Math.round((totalFinal / count) * 100) / 100,
      averageProgression:
        Math.round(((totalFinal - totalInitial) / count) * 100) / 100,
      skillsImproved: improved,
      skillsRegressed: regressed,
      skillsStable: stable,
    },
  };
}

// ─────────────────────────────────────────────────────────────────
// VÉRIFICATION ÉLIGIBILITÉ TEST FINAL
// ─────────────────────────────────────────────────────────────────

export interface FinalTestEligibility {
  eligible: boolean;
  reason?: string;
  completion: number;
  missingSkills?: string[];
}

export function checkFinalTestEligibility(
  userId: string,
  userRole: Role,
  phrases: Phrase[],
  memory: Map<string, MemoryItem>,
  skills: Skill[]
): FinalTestEligibility {
  // Critère 1: Complétion parcours >= 80%
  const rolePhrases = phrases.filter((p) => p.role === userRole);
  const seenPhrases = rolePhrases.filter((p) => {
    const item = memory.get(p.id);
    return item && item.repsWritten > 0;
  });

  const completion = rolePhrases.length > 0 
    ? seenPhrases.length / rolePhrases.length 
    : 0;

  if (completion < TEST_CONFIG.COMPLETION_FOR_FINAL) {
    return {
      eligible: false,
      reason: `Parcours non complété (${Math.round(completion * 100)}% < 80%)`,
      completion,
    };
  }

  // Critère 2: Toutes les compétences vues au moins 1 fois
  const roleSkills = skills.filter((s) => s.role === userRole);
  const seenSkillIds = new Set<string>();

  for (const phrase of seenPhrases) {
    seenSkillIds.add(phrase.skillId);
  }

  const missingSkills = roleSkills.filter((s) => !seenSkillIds.has(s.id));

  if (missingSkills.length > 0) {
    return {
      eligible: false,
      reason: 'Compétences non travaillées',
      completion,
      missingSkills: missingSkills.map((s) => s.name),
    };
  }

  return {
    eligible: true,
    completion,
  };
}

// ─────────────────────────────────────────────────────────────────
// STATISTIQUES GLOBALES
// ─────────────────────────────────────────────────────────────────

export interface GlobalStats {
  totalPhrases: number;
  masteredPhrases: number;
  learningPhrases: number;
  newPhrases: number;
  averageSkillScore: number;
  strongestSkill: { name: string; score: number } | null;
  weakestSkill: { name: string; score: number } | null;
  completionPercentage: number;
}

export function calculateGlobalStats(
  userRole: Role,
  phrases: Phrase[],
  memory: Map<string, MemoryItem>,
  skills: Skill[]
): GlobalStats {
  const rolePhrases = phrases.filter((p) => p.role === userRole);
  const roleSkills = skills.filter((s) => s.role === userRole);

  let mastered = 0;
  let learning = 0;
  let newCount = 0;

  for (const phrase of rolePhrases) {
    const item = memory.get(phrase.id);
    if (!item || (item.repsWritten === 0 && item.repsOral === 0)) {
      newCount++;
    } else if (item.mastered) {
      mastered++;
    } else {
      learning++;
    }
  }

  // Calculer scores par skill
  const skillScores: { name: string; score: number }[] = [];
  let totalSkillScore = 0;

  for (const skill of roleSkills) {
    const progressScore = calculateSkillProgressScore(skill.id, rolePhrases, memory);
    skillScores.push({ name: skill.name, score: progressScore.score });
    totalSkillScore += progressScore.score;
  }

  const averageSkillScore = roleSkills.length > 0 
    ? Math.round((totalSkillScore / roleSkills.length) * 10) / 10 
    : 0;

  // Trouver plus fort et plus faible
  skillScores.sort((a, b) => b.score - a.score);
  const strongest = skillScores.length > 0 ? skillScores[0] : null;
  const weakest = skillScores.length > 0 ? skillScores[skillScores.length - 1] : null;

  const completionPercentage = rolePhrases.length > 0 
    ? Math.round(((mastered + learning) / rolePhrases.length) * 100) 
    : 0;

  return {
    totalPhrases: rolePhrases.length,
    masteredPhrases: mastered,
    learningPhrases: learning,
    newPhrases: newCount,
    averageSkillScore,
    strongestSkill: strongest,
    weakestSkill: weakest,
    completionPercentage,
  };
}

// ─────────────────────────────────────────────────────────────────
// EXPORT CSV (pour rapport RH)
// ─────────────────────────────────────────────────────────────────

export function generateCSVReport(report: ComparisonReport): string {
  const lines: string[] = [];

  // Header
  lines.push('Compétence,Dimension,Score Initial,Score Final,Progression,Statut');

  // Data
  for (const skill of report.skills) {
    lines.push(
      `"${skill.name}",${skill.dimension},${skill.initial},${skill.final},${skill.progression},${skill.status}`
    );
  }

  // Summary
  lines.push('');
  lines.push('RÉSUMÉ');
  lines.push(`Moyenne Initiale,${report.summary.averageInitial}`);
  lines.push(`Moyenne Finale,${report.summary.averageFinal}`);
  lines.push(`Progression Moyenne,${report.summary.averageProgression}`);
  lines.push(`Compétences Améliorées,${report.summary.skillsImproved}`);
  lines.push(`Compétences Stables,${report.summary.skillsStable}`);
  lines.push(`Compétences en Régression,${report.summary.skillsRegressed}`);

  return lines.join('\n');
}
