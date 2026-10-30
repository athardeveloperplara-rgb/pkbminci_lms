import { Question } from '../types';

export interface GradeWeights {
  assignmentWeight: number; // e.g. 0.30
  quizWeight: number;       // e.g. 0.20
  utsWeight: number;        // e.g. 0.25
  uasWeight: number;        // e.g. 0.25
}

export const DEFAULT_GRADE_WEIGHTS: GradeWeights = {
  assignmentWeight: 0.30,
  quizWeight: 0.20,
  utsWeight: 0.25,
  uasWeight: 0.25,
};

/**
 * Calculates weighted final score between 0 and 100.
 */
export function calculateFinalScore(
  assignmentAvg: number,
  quizAvg: number,
  utsScore: number,
  uasScore: number,
  weights: GradeWeights = DEFAULT_GRADE_WEIGHTS
): number {
  const total =
    assignmentAvg * weights.assignmentWeight +
    quizAvg * weights.quizWeight +
    utsScore * weights.utsWeight +
    uasScore * weights.uasWeight;

  return Math.round(Math.min(100, Math.max(0, total)) * 10) / 10;
}

/**
 * Determines grade predicate based on standard Indonesian equivalence grading system.
 */
export function getGradePredicate(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

/**
 * Provides learning competency description based on score and predicate.
 */
export function getPredicateDescription(predicate: 'A' | 'B' | 'C' | 'D', subjectName: string): string {
  switch (predicate) {
    case 'A':
      return `Sangat baik dalam memahami dan menguasai seluruh capaian pembelajaran materi ${subjectName}.`;
    case 'B':
      return `Baik dalam memahami konsep dan mampu menyelesaikan tugas materi ${subjectName} secara mandiri.`;
    case 'C':
      return `Cukup mampu dalam pembelajaran ${subjectName}, namun memerlukan bimbingan tambahan pada beberapa modul.`;
    case 'D':
      return `Perlu bimbingan intensif dan remedial untuk mencapai standar ketuntasan minimal ${subjectName}.`;
  }
}

/**
 * Calculates attendance percentage given presence counts.
 */
export function calculateAttendancePercentage(hadir: number, sakit: number, izin: number, alpa: number): number {
  const totalSessions = hadir + sakit + izin + alpa;
  if (totalSessions === 0) return 100;
  // In Indonesian education, 'Hadir' is 100%, and 'Sakit'/'Izin' with proof are often counted as authorized
  const rate = ((hadir + 0.5 * (sakit + izin)) / totalSessions) * 100;
  return Math.round(rate * 10) / 10;
}

/**
 * Automated grading for CBT Exam / Quiz questions.
 * Supports multiple choice and true/false.
 */
export function evaluateCbtSubmission(
  questions: Question[],
  userAnswers: Record<string, string>
): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalObjectiveQuestions: number;
} {
  let earnedScore = 0;
  let possibleScore = 0;
  let correctCount = 0;
  let objectiveCount = 0;

  for (const q of questions) {
    const userAnswer = userAnswers[q.id];

    if (q.type === 'multiple_choice') {
      objectiveCount++;
      possibleScore += q.weight;
      const correctOption = q.options?.find((o) => o.isCorrect);
      if (correctOption && userAnswer === correctOption.id) {
        earnedScore += q.weight;
        correctCount++;
      }
    } else if (q.type === 'true_false') {
      objectiveCount++;
      possibleScore += q.weight;
      if (userAnswer && userAnswer.toLowerCase() === (q.correctAnswer || '').toLowerCase()) {
        earnedScore += q.weight;
        correctCount++;
      }
    } else if (q.type === 'short_answer') {
      objectiveCount++;
      possibleScore += q.weight;
      if (
        userAnswer &&
        userAnswer.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase()
      ) {
        earnedScore += q.weight;
        correctCount++;
      }
    } else {
      // Essay questions need manual grading by tutor
      possibleScore += q.weight;
    }
  }

  const percentage = possibleScore > 0 ? Math.round((earnedScore / possibleScore) * 100) : 0;

  return {
    totalScore: earnedScore,
    maxScore: possibleScore,
    percentage,
    correctCount,
    totalObjectiveQuestions: objectiveCount,
  };
}

/**
 * Formats date into standard Indonesian locale format
 */
export function formatIndonesianDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Formats timestamp into standard Indonesian date & time
 */
export function formatIndonesianDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch {
    return dateString;
  }
}
