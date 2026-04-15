// ═══════════════════════════════════════════════════════════════
// EXEMPLE D'UTILISATION - Simulation parcours utilisateur
// ═══════════════════════════════════════════════════════════════

import {
  Role,
  Level,
  MemoryItem,
  Exercise,
  Phrase,
  Scenario,
  Skill,
  TestQuestion,
  SkillScore,
} from './types';

import {
  createMemoryItem,
  calculateSRS,
  applyUpdate,
  processMatchPairs,
  getDueItems,
  getStats,
} from './srs';

import {
  validateTextAnswer,
  validateQCM,
  validateMatchPairs,
} from './validation';

import {
  generateSession,
  calculateXP,
  calculateSessionBonus,
} from './session';

import {
  evaluateTest,
  calculateSkillProgressScore,
  generateComparisonReport,
  checkFinalTestEligibility,
  calculateGlobalStats,
  generateCSVReport,
} from './scoring';

import {
  PHRASES,
  SCENARIOS,
  SKILLS,
  TEST_QUESTIONS,
  getPhrasesByRole,
  getSkillsByRole,
  getScenariosByRole,
  getTestQuestions,
} from './data';

// ─────────────────────────────────────────────────────────────────
// SIMULATION UTILISATEUR
// ─────────────────────────────────────────────────────────────────

class UserSimulation {
  userId: string;
  role: Role;
  level: Level;
  memory: Map<string, MemoryItem>;
  xp: number;
  streak: number;
  initialScores: SkillScore[];
  finalScores: SkillScore[];

  constructor(userId: string, role: Role) {
    this.userId = userId;
    this.role = role;
    this.level = 'N1';
    this.memory = new Map();
    this.xp = 0;
    this.streak = 0;
    this.initialScores = [];
    this.finalScores = [];
  }

  // ─────────────────────────────────────────────────────────────
  // 1. TEST INITIAL
  // ─────────────────────────────────────────────────────────────
  runInitialTest(): void {
    console.log('\n═══════════════════════════════════════');
    console.log('TEST INITIAL');
    console.log('═══════════════════════════════════════\n');

    const questions = getTestQuestions('INITIAL');
    console.log(`Questions: ${questions.length}`);

    // Simuler réponses (50% correctes pour débutant)
    const answers = new Map<string, string>();
    questions.forEach((q, i) => {
      const correct = i % 2 === 0; // 50% correct
      if (q.type === 'QCM' && q.options) {
        answers.set(q.id, correct ? q.correctAnswer : q.options[0].id);
      } else {
        answers.set(q.id, correct ? q.correctAnswer : 'wrong answer');
      }
    });

    const result = evaluateTest(questions, answers, this.role, 'INITIAL');

    console.log(`Score: ${result.totalScore}/${result.maxScore}`);
    console.log(`Niveau détecté: ${result.level}`);
    console.log(`Skills évalués: ${result.skillScores.size}`);

    this.level = result.level;
    this.initialScores = Array.from(result.skillScores.entries()).map(
      ([skillId, score]) => ({
        skillId,
        testType: 'INITIAL' as const,
        score,
        maxScore: 5,
        testedAt: Date.now(),
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. SESSIONS D'ENTRAÎNEMENT
  // ─────────────────────────────────────────────────────────────
  runTrainingSessions(count: number): void {
    console.log('\n═══════════════════════════════════════');
    console.log(`SESSIONS D'ENTRAÎNEMENT (${count})`);
    console.log('═══════════════════════════════════════\n');

    const phrases = getPhrasesByRole(this.role);
    const scenarios = getScenariosByRole(this.role);

    for (let i = 0; i < count; i++) {
      console.log(`\n--- Session ${i + 1} ---`);

      const session = generateSession({
        memory: this.memory,
        phrases,
        scenarios,
        userLevel: this.level,
        userRole: this.role,
      });

      console.log(`Exercices générés: ${session.length}`);

      let correct = 0;
      for (const exercise of session) {
        // Simuler réponse (80% correct après quelques sessions)
        const isCorrect = Math.random() < 0.8;

        if (isCorrect) correct++;

        // Mettre à jour SRS pour chaque target
        for (const target of exercise.targets) {
          let item = this.memory.get(target);
          if (!item) {
            item = createMemoryItem(target, this.role);
          }

          const interactionResult = {
            isCorrect,
            isOral: exercise.type === 'SCENARIO',
            isTimeout: false,
          };

          const update = calculateSRS(item, interactionResult);

          this.memory.set(target, applyUpdate(item, update, interactionResult));
        }

        // XP
        this.xp += calculateXP(isCorrect, exercise.source);
      }

      // Bonus session
      this.xp += calculateSessionBonus(session.length, correct);
      this.streak++;

      console.log(`Correct: ${correct}/${session.length}`);
      console.log(`XP total: ${this.xp}`);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. STATISTIQUES MI-PARCOURS
  // ─────────────────────────────────────────────────────────────
  showProgress(): void {
    console.log('\n═══════════════════════════════════════');
    console.log('PROGRESSION');
    console.log('═══════════════════════════════════════\n');

    const stats = getStats(this.memory, this.role);
    console.log(`Total items: ${stats.total}`);
    console.log(`Maîtrisés: ${stats.mastered}`);
    console.log(`En apprentissage: ${stats.learning}`);
    console.log(`À réviser: ${stats.due}`);
    console.log(`Erreurs récentes: ${stats.recentErrors}`);

    const globalStats = calculateGlobalStats(
      this.role,
      PHRASES,
      this.memory,
      SKILLS
    );

    console.log(`\nScore moyen compétences: ${globalStats.averageSkillScore}/5`);
    if (globalStats.strongestSkill) {
      console.log(`Plus forte: ${globalStats.strongestSkill.name} (${globalStats.strongestSkill.score})`);
    }
    if (globalStats.weakestSkill) {
      console.log(`Plus faible: ${globalStats.weakestSkill.name} (${globalStats.weakestSkill.score})`);
    }
    console.log(`Complétion: ${globalStats.completionPercentage}%`);
  }

  // ─────────────────────────────────────────────────────────────
  // 4. VÉRIFICATION ÉLIGIBILITÉ TEST FINAL
  // ─────────────────────────────────────────────────────────────
  checkFinalEligibility(): boolean {
    console.log('\n═══════════════════════════════════════');
    console.log('ÉLIGIBILITÉ TEST FINAL');
    console.log('═══════════════════════════════════════\n');

    const eligibility = checkFinalTestEligibility(
      this.userId,
      this.role,
      PHRASES,
      this.memory,
      SKILLS
    );

    console.log(`Éligible: ${eligibility.eligible}`);
    console.log(`Complétion: ${Math.round(eligibility.completion * 100)}%`);
    if (eligibility.reason) {
      console.log(`Raison: ${eligibility.reason}`);
    }
    if (eligibility.missingSkills) {
      console.log(`Compétences manquantes: ${eligibility.missingSkills.join(', ')}`);
    }

    return eligibility.eligible;
  }

  // ─────────────────────────────────────────────────────────────
  // 5. TEST FINAL
  // ─────────────────────────────────────────────────────────────
  runFinalTest(): void {
    console.log('\n═══════════════════════════════════════');
    console.log('TEST FINAL');
    console.log('═══════════════════════════════════════\n');

    const questions = getTestQuestions('FINAL');
    console.log(`Questions: ${questions.length}`);

    // Simuler réponses (85% correctes après entraînement)
    const answers = new Map<string, string>();
    questions.forEach((q) => {
      const correct = Math.random() < 0.85;
      if (q.type === 'QCM' && q.options) {
        answers.set(q.id, correct ? q.correctAnswer : q.options[0].id);
      } else {
        answers.set(q.id, correct ? q.correctAnswer : 'wrong answer');
      }
    });

    const result = evaluateTest(questions, answers, this.role, 'FINAL');

    console.log(`Score: ${result.totalScore}/${result.maxScore}`);
    console.log(`Niveau final: ${result.level}`);

    this.finalScores = Array.from(result.skillScores.entries()).map(
      ([skillId, score]) => ({
        skillId,
        testType: 'FINAL' as const,
        score,
        maxScore: 5,
        testedAt: Date.now(),
      })
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 6. RAPPORT COMPARATIF
  // ─────────────────────────────────────────────────────────────
  generateReport(): void {
    console.log('\n═══════════════════════════════════════');
    console.log('RAPPORT COMPARATIF');
    console.log('═══════════════════════════════════════\n');

    const report = generateComparisonReport(
      this.userId,
      this.role,
      SKILLS,
      this.initialScores,
      this.finalScores
    );

    console.log('Par compétence:');
    for (const skill of report.skills) {
      const arrow = skill.progression > 0 ? '↑' : skill.progression < 0 ? '↓' : '→';
      console.log(
        `  ${skill.name}: ${skill.initial} → ${skill.final} (${arrow}${Math.abs(skill.progression)})`
      );
    }

    console.log('\nRésumé:');
    console.log(`  Moyenne initiale: ${report.summary.averageInitial}`);
    console.log(`  Moyenne finale: ${report.summary.averageFinal}`);
    console.log(`  Progression: +${report.summary.averageProgression}`);
    console.log(`  Améliorées: ${report.summary.skillsImproved}`);
    console.log(`  Stables: ${report.summary.skillsStable}`);
    console.log(`  En baisse: ${report.summary.skillsRegressed}`);

    // Export CSV
    const csv = generateCSVReport(report);
    console.log('\n--- Export CSV ---');
    console.log(csv.substring(0, 500) + '...');
  }
}

// ─────────────────────────────────────────────────────────────────
// EXÉCUTION SIMULATION
// ─────────────────────────────────────────────────────────────────

function runSimulation() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  SIMULATION PARCOURS UTILISATEUR - ANGLAIS HÔTELIER      ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  const user = new UserSimulation('user_001', 'RECEPTION');

  // 1. Test initial
  user.runInitialTest();

  // 2. Sessions d'entraînement
  user.runTrainingSessions(5);

  // 3. Voir progression
  user.showProgress();

  // 4. Vérifier éligibilité
  const eligible = user.checkFinalEligibility();

  // 5. Test final (même si pas éligible pour la démo)
  user.runFinalTest();

  // 6. Rapport
  user.generateReport();

  console.log('\n═══════════════════════════════════════');
  console.log('FIN SIMULATION');
  console.log('═══════════════════════════════════════\n');
  console.log(`XP final: ${user.xp}`);
  console.log(`Streak: ${user.streak} jours`);
}

// Exécuter si appelé directement
runSimulation();
