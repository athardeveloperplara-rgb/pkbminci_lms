import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinalScore,
  getGradePredicate,
  calculateAttendancePercentage,
  evaluateCbtSubmission,
} from './academicRules';
import { Question } from '../types';

test('calculateFinalScore accurately computes weighted scores', () => {
  // Assignments (80 * 0.3) = 24
  // Quiz (90 * 0.2) = 18
  // UTS (85 * 0.25) = 21.25
  // UAS (90 * 0.25) = 22.5
  // Total = 85.75 -> 85.8
  const score = calculateFinalScore(80, 90, 85, 90);
  assert.equal(score, 85.8);
});

test('calculateFinalScore respects custom weights', () => {
  const customWeights = {
    assignmentWeight: 0.40,
    quizWeight: 0.10,
    utsWeight: 0.20,
    uasWeight: 0.30,
  };
  // (100 * 0.40) + (100 * 0.10) + (100 * 0.20) + (100 * 0.30) = 100
  const score = calculateFinalScore(100, 100, 100, 100, customWeights);
  assert.equal(score, 100);
});

test('getGradePredicate assigns proper predicates A, B, C, D', () => {
  assert.equal(getGradePredicate(92), 'A');
  assert.equal(getGradePredicate(85), 'A');
  assert.equal(getGradePredicate(84.9), 'B');
  assert.equal(getGradePredicate(75), 'B');
  assert.equal(getGradePredicate(65), 'C');
  assert.equal(getGradePredicate(59), 'D');
});

test('calculateAttendancePercentage handles empty and valid sessions', () => {
  assert.equal(calculateAttendancePercentage(0, 0, 0, 0), 100);
  // 10 hadir, 0 sakit, 0 izin, 0 alpa = 100%
  assert.equal(calculateAttendancePercentage(10, 0, 0, 0), 100);
  // 8 hadir, 2 alpa = 8 / 10 = 80%
  assert.equal(calculateAttendancePercentage(8, 0, 0, 2), 80);
});

test('evaluateCbtSubmission auto-grades multiple choice and true/false', () => {
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      subjectId: 's1',
      subjectName: 'Matematika',
      type: 'multiple_choice',
      prompt: 'Hasil dari 5 x 6 adalah...',
      options: [
        { id: 'opt_a', text: '25', isCorrect: false },
        { id: 'opt_b', text: '30', isCorrect: true },
        { id: 'opt_c', text: '35', isCorrect: false },
      ],
      weight: 10,
      difficulty: 'Mudah',
    },
    {
      id: 'q2',
      subjectId: 's1',
      subjectName: 'Matematika',
      type: 'true_false',
      prompt: 'Bilangan prima selalu ganjil.',
      correctAnswer: 'Salah',
      weight: 10,
      difficulty: 'Sedang',
    },
    {
      id: 'q3',
      subjectId: 's1',
      subjectName: 'Matematika',
      type: 'short_answer',
      prompt: 'Berapa jumlah sudut dalam segitiga?',
      correctAnswer: '180',
      weight: 10,
      difficulty: 'Mudah',
    },
  ];

  const userAnswers = {
    q1: 'opt_b', // correct (+10)
    q2: 'Salah', // correct (+10)
    q3: '90',    // incorrect
  };

  const result = evaluateCbtSubmission(mockQuestions, userAnswers);
  assert.equal(result.totalScore, 20);
  assert.equal(result.maxScore, 30);
  assert.equal(result.correctCount, 2);
  assert.equal(result.percentage, 67);
});
