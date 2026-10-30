import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Flag,
  Sparkles,
  BarChart,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { CbtExam, Question, ExamAttempt, EducationalProgram } from '../../types';
import { evaluateCbtSubmission } from '../../utils/academicRules';

export const CbtExamView: React.FC = () => {
  const {
    exams,
    examAttempts,
    classes,
    subjects,
    currentUser,
    finishExamAttempt,
    addExam,
    schoolProfile,
  } = useApp();

  const [activeExam, setActiveExam] = useState<CbtExam | null>(null);
  const [isInExamSession, setIsInExamSession] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(45 * 60);
  const [lastExamResult, setLastExamResult] = useState<ExamAttempt | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const studentId = currentUser?.id || 'std_rian';
  const studentName = currentUser?.name || 'Rian Pratama';
  const canManage =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'tutor' ||
    currentUser?.role === 'kepala_pkbm';

  // Timer countdown while in exam
  useEffect(() => {
    if (!isInExamSession) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInExamSession, userAnswers]);

  const handleStartExam = (exam: CbtExam) => {
    setActiveExam(exam);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setIsInExamSession(true);
  };

  const handleSelectOption = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleFinishExam = () => {
    if (!activeExam) return;

    const attempt = finishExamAttempt(
      activeExam.id,
      studentId,
      studentName,
      userAnswers
    );

    setIsInExamSession(false);
    setLastExamResult(attempt);
    setShowResultModal(true);

    if (attempt.isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Exam Creator form
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubjectId, setNewExamSubjectId] = useState(subjects[0]?.id || '');
  const [newExamClassId, setNewExamClassId] = useState(classes[0]?.id || '');
  const [newExamDuration, setNewExamDuration] = useState(45);
  const [newExamPassingScore, setNewExamPassingScore] = useState(75);

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    const sub = subjects.find((s) => s.id === newExamSubjectId);
    const cls = classes.find((c) => c.id === newExamClassId);

    const defaultQuestions: Question[] = [
      {
        id: `q_${Date.now()}_1`,
        subjectId: sub?.id || 'sub_1',
        subjectName: sub?.name || 'Mata Pelajaran',
        type: 'multiple_choice',
        prompt: 'Contoh soal pilihan ganda konsep pembelajaran:',
        options: [
          { id: 'opt_1', text: 'Pilihan Jawaban A (Tepat)', isCorrect: true },
          { id: 'opt_2', text: 'Pilihan Jawaban B', isCorrect: false },
          { id: 'opt_3', text: 'Pilihan Jawaban C', isCorrect: false },
          { id: 'opt_4', text: 'Pilihan Jawaban D', isCorrect: false },
        ],
        explanation: 'Kunci jawaban A sesuai modul ajar.',
        weight: 50,
        difficulty: 'Mudah',
      },
      {
        id: `q_${Date.now()}_2`,
        subjectId: sub?.id || 'sub_1',
        subjectName: sub?.name || 'Mata Pelajaran',
        type: 'true_false',
        prompt: 'Pernyataan materi berikut bernilai benar atau salah dalam praktik:',
        correctAnswer: 'Benar',
        explanation: 'Pernyataan tersebut sesuai teori kurikulum merdeka.',
        weight: 50,
        difficulty: 'Sedang',
      },
    ];

    addExam({
      title: newExamTitle,
      description: 'Asesmen CBT terjadwal terintegrasi PKBM Insan Cita.',
      subjectId: sub?.id || '',
      subjectName: sub?.name || '',
      classId: cls?.id || '',
      className: cls?.name || '',
      program: cls?.program || 'Paket C',
      tutorId: currentUser?.id || 'tut_1',
      tutorName: currentUser?.name || 'Tutor PKBM',
      durationMinutes: newExamDuration,
      passingScore: newExamPassingScore,
      startDate: new Date().toISOString(),
      endDate: '2026-12-31T23:59:00',
      randomizeQuestions: true,
      showResultImmediate: true,
      status: 'active',
      questions: defaultQuestions,
    });

    setIsCreateModalOpen(false);
    setNewExamTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Ruang Asesmen & Ujian Berbasis Komputer (CBT)
          </h2>
          <p className="text-xs text-slate-500">
            Sistem evaluasi sumatif, kuis formatif, dan penilaian akhir semester berstandar nasional.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Ujian / Kuis CBT Baru</span>
          </button>
        )}
      </div>

      {/* List of Active Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {exams.map((exam) => {
          const attempt = examAttempts.find(
            (a) => a.examId === exam.id && a.studentId === studentId
          );

          return (
            <div
              key={exam.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {exam.subjectName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {exam.className}
                  </span>
                </div>

                <h3 className="mt-2 text-sm font-bold text-slate-900">{exam.title}</h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Durasi</span>
                    <span className="font-bold text-slate-800">{exam.durationMinutes} mnt</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">KKM</span>
                    <span className="font-bold text-emerald-700">{exam.passingScore}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">Soal</span>
                    <span className="font-bold text-slate-800">{exam.questions.length} Butir</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {attempt ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-slate-700">Skor:</span>
                      <span
                        className={`font-black text-sm px-2 py-0.5 rounded ${
                          attempt.isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {attempt.score} ({attempt.isPassed ? 'TUNTAS' : 'REMEDIAL'})
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartExam(exam)}
                      className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Uji Lagi
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Mulai Ujian CBT</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL CBT EXAM INTERACTIVE ROOM MODAL */}
      {isInExamSession && activeExam && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-800">
          {/* CBT Room Header */}
          <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 shadow-md">
            <div className="flex items-center gap-3">
              <img
                src={schoolProfile.logoUrl}
                alt="Logo PKBM"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{activeExam.title}</h3>
                <p className="text-[11px] text-slate-500">
                  {activeExam.subjectName} • {activeExam.className} • Peserta: <strong>{studentName}</strong>
                </p>
              </div>
            </div>

            {/* Timer countdown display */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-1.5 font-mono text-sm font-bold shadow-inner ${
                  timeLeftSeconds < 300
                    ? 'bg-red-50 text-red-600 border border-red-300 animate-pulse'
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Sisa Waktu: {formatTime(timeLeftSeconds)}</span>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian ini sekarang?')) {
                    handleFinishExam();
                  }
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
              >
                Selesaikan Ujian
              </button>
            </div>
          </header>

          {/* CBT Main Body */}
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-slate-100">
            {/* Left: Current Question Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-8">
              {activeExam.questions[currentQuestionIndex] ? (
                <div className="max-w-3xl mx-auto rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      Soal Nomor {currentQuestionIndex + 1} dari {activeExam.questions.length}
                    </span>

                    <label className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          !!flaggedQuestions[activeExam.questions[currentQuestionIndex].id]
                        }
                        onChange={() =>
                          toggleFlag(activeExam.questions[currentQuestionIndex].id)
                        }
                        className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                      />
                      <Flag className="h-3.5 w-3.5" />
                      Ragu-ragu
                    </label>
                  </div>

                  {/* Question Prompt */}
                  <div className="text-sm font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                    {activeExam.questions[currentQuestionIndex].prompt}
                  </div>

                  {/* Answers Section */}
                  <div className="space-y-3 pt-2">
                    {activeExam.questions[currentQuestionIndex].type === 'multiple_choice' &&
                      activeExam.questions[currentQuestionIndex].options?.map((opt) => {
                        const isSelected =
                          userAnswers[activeExam.questions[currentQuestionIndex].id] === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() =>
                              handleSelectOption(
                                activeExam.questions[currentQuestionIndex].id,
                                opt.id
                              )
                            }
                            className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500 shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 text-slate-500'
                              }`}
                            >
                              {opt.id.slice(-1).toUpperCase()}
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                          </div>
                        );
                      })}

                    {activeExam.questions[currentQuestionIndex].type === 'true_false' && (
                      <div className="grid grid-cols-2 gap-4">
                        {['Benar', 'Salah'].map((val) => {
                          const isSelected =
                            userAnswers[activeExam.questions[currentQuestionIndex].id] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                handleSelectOption(
                                  activeExam.questions[currentQuestionIndex].id,
                                  val
                                )
                              }
                              className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-md'
                                  : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-300'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {activeExam.questions[currentQuestionIndex].type === 'short_answer' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Ketik Isian Singkat Anda:
                        </label>
                        <input
                          type="text"
                          value={
                            userAnswers[activeExam.questions[currentQuestionIndex].id] || ''
                          }
                          onChange={(e) =>
                            handleSelectOption(
                              activeExam.questions[currentQuestionIndex].id,
                              e.target.value
                            )
                          }
                          placeholder="Ketik jawaban singkat..."
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    )}

                    {activeExam.questions[currentQuestionIndex].type === 'essay' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Uraian Jawaban Esai:
                        </label>
                        <textarea
                          rows={4}
                          value={
                            userAnswers[activeExam.questions[currentQuestionIndex].id] || ''
                          }
                          onChange={(e) =>
                            handleSelectOption(
                              activeExam.questions[currentQuestionIndex].id,
                              e.target.value
                            )
                          }
                          placeholder="Tuliskan penjelasan lengkap Anda di sini..."
                          className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                        ></textarea>
                      </div>
                    )}
                  </div>

                  {/* Nav Buttons (Next / Prev) */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Sebelumnya
                    </button>

                    {currentQuestionIndex < activeExam.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        Berikutnya
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (window.confirm('Ini adalah nomor soal terakhir. Selesaikan dan kirim jawaban Anda?')) {
                            handleFinishExam();
                          }
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-xs"
                      >
                        Kumpulkan Jawaban
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </main>

            {/* Right: Question Navigation Grid */}
            <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-6 overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Nomor Soal Ujian ({activeExam.questions.length})
              </h4>

              <div className="grid grid-cols-5 gap-2.5">
                {activeExam.questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = !!flaggedQuestions[q.id];
                  const isCurrent = idx === currentQuestionIndex;

                  let btnStyle = 'border-slate-300 bg-slate-50 text-slate-700';
                  if (isAnswered) {
                    btnStyle = 'border-emerald-600 bg-emerald-600 text-white font-bold';
                  }
                  if (isFlagged) {
                    btnStyle = 'border-amber-400 bg-amber-400 text-amber-950 font-bold';
                  }
                  if (isCurrent) {
                    btnStyle += ' ring-2 ring-emerald-500 ring-offset-2';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 w-full rounded-xl border text-xs flex items-center justify-center transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-md bg-emerald-600"></div>
                  <span>Sudah Terjawab</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-md bg-amber-400"></div>
                  <span>Ragu-ragu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-md bg-slate-200"></div>
                  <span>Belum Terjawab</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* EXAM RESULT MODAL */}
      {showResultModal && lastExamResult && activeExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                lastExamResult.isPassed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Award className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {lastExamResult.isPassed ? 'Selamat, Anda Tuntas!' : 'Evaluasi Belajar Selesai'}
            </h3>

            <p className="text-xs text-slate-500">
              Asesmen <strong>{activeExam.title}</strong> telah berhasil dinilai secara otomatis oleh sistem CBT.
            </p>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <span className="text-xs text-slate-400 block font-semibold">Skor Akhir Anda</span>
              <span className="text-4xl font-extrabold text-emerald-700 mt-1 block">
                {lastExamResult.score} / 100
              </span>
              <span className="mt-1 inline-block text-[11px] font-bold text-slate-600">
                Batas Kelulusan (KKM): {activeExam.passingScore}
              </span>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setActiveExam(null);
                }}
                className="w-full rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                Kembali ke Dashboard CBT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Buat Sesi Ujian CBT Baru</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Ujian *</label>
                <input
                  type="text"
                  required
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  placeholder="Contoh: Penilaian Akhir Semester (PAS) Ganjil Paket C"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newExamSubjectId}
                    onChange={(e) => setNewExamSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.program})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Peserta</label>
                  <select
                    value={newExamClassId}
                    onChange={(e) => setNewExamClassId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Pengerjaan (Menit)</label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={newExamDuration}
                    onChange={(e) => setNewExamDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batas KKM Kelulusan</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newExamPassingScore}
                    onChange={(e) => setNewExamPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-[11px] text-emerald-800 border border-emerald-200">
                Bank soal otomatis menyusun 2 butir soal evaluasi dasar berbobot skor 100 poin.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Terbitkan Ujian CBT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
