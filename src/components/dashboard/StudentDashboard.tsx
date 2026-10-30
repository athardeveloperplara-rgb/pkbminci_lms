import React from 'react';
import {
  BookOpen,
  CheckSquare,
  HelpCircle,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    materials,
    assignments,
    submissions,
    exams,
    examAttempts,
    grades,
    announcements,
    setActiveView,
  } = useApp();

  const studentId = currentUser?.id || 'std_rian';
  const myClassId = currentUser?.classId || 'cls_c12';
  const myProgram = currentUser?.program || 'Paket C';

  // Materials for student's class
  const classMaterials = materials.filter(
    (m) => m.classId === myClassId || m.program === myProgram
  );
  const completedMaterials = classMaterials.filter((m) =>
    m.completedStudentIds.includes(studentId)
  );
  const progressPercent =
    classMaterials.length > 0
      ? Math.round((completedMaterials.length / classMaterials.length) * 100)
      : 0;

  // Assignments
  const myAssignments = assignments.filter((a) => a.classId === myClassId || a.program === myProgram);
  const mySubmissions = submissions.filter((s) => s.studentId === studentId);

  // Active exams
  const myExams = exams.filter((e) => e.classId === myClassId || e.program === myProgram);

  // Student grades
  const myGrades = grades.filter((g) => g.studentId === studentId);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-amber-300 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ruang Belajar Digital Warga Belajar PKBM</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Semangat Belajar, {currentUser?.name || 'Warga Belajar'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Program: <strong>{myProgram}</strong> • Kelas: <strong>{currentUser?.className || 'Kelas 12 IPS'}</strong>. Terus tingkatkan progres modul ajar dan tuntaskan evaluasi semester.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('materials')}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Buka Modul Ajar</span>
            </button>
            <button
              onClick={() => setActiveView('cbt_exam')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Mulai Ujian CBT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric & Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progres Belajar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Progres Modul Ajar</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{progressPercent}%</span>
            <span className="text-xs font-semibold text-emerald-600">
              {completedMaterials.length} / {classMaterials.length} Modul
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Tugas Dikumpulkan */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tugas & LKPD</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{mySubmissions.length}</span>
            <span className="text-xs font-semibold text-blue-600">Diserahkan</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Dari total {myAssignments.length} tugas aktif</p>
        </div>

        {/* Ujian CBT */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ujian Online Siap</span>
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myExams.length}</span>
            <span className="text-xs font-semibold text-purple-600">Tersedia</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">PTS & Kuis Diagnostik</p>
        </div>

        {/* Kehadiran */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Presensi Kehadiran</span>
            <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">94.5%</span>
            <span className="text-xs font-semibold text-teal-600">Sangat Baik</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tatap Muka & Daring</p>
        </div>
      </div>

      {/* Main Row: Available CBT Exams & Pending Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available CBT Exams */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
              <h3 className="text-sm font-bold text-slate-900">Ujian & Kuis CBT Tersedia</h3>
            </div>
            <button
              onClick={() => setActiveView('cbt_exam')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Ruang CBT <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {myExams.map((exam) => {
              const attempt = examAttempts.find((a) => a.examId === exam.id && a.studentId === studentId);
              return (
                <div
                  key={exam.id}
                  className="rounded-xl border border-slate-200 p-3.5 hover:border-emerald-300 transition-colors bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {exam.subjectName}
                      </span>
                      <h4 className="mt-1 text-xs font-bold text-slate-900">{exam.title}</h4>
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed line-clamp-1">
                        {exam.description}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock className="h-3 w-3" /> {exam.durationMinutes} Menit
                        </span>
                        <span>•</span>
                        <span>KKM: {exam.passingScore}</span>
                        <span>•</span>
                        <span>{exam.questions.length} Soal</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {attempt ? (
                        <div className="rounded-lg bg-emerald-100 p-2 text-center">
                          <span className="block text-[10px] font-medium text-emerald-800">Skor Anda</span>
                          <span className="text-sm font-black text-emerald-900">{attempt.score}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveView('cbt_exam')}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs transition-colors"
                        >
                          Kerjakan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignments to Submit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Tugas & LKPD Menunggu Pengumpulan</h3>
            <button
              onClick={() => setActiveView('assignments')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Semua Tugas <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {myAssignments.map((asg) => {
              const submission = mySubmissions.find((s) => s.assignmentId === asg.id);
              return (
                <div
                  key={asg.id}
                  className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                        {asg.subjectName}
                      </span>
                      <h4 className="mt-1 text-xs font-bold text-slate-900">{asg.title}</h4>
                      <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{asg.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <Calendar className="h-3 w-3 text-red-500" />
                        <span>Batas: {asg.dueDate.split('T')[0]}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {submission ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" /> Diserahkan
                          </span>
                          {submission.score !== undefined && (
                            <span className="block text-xs font-extrabold text-emerald-900 mt-1">
                              Nilai: {submission.score}
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveView('assignments')}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                        >
                          Kirim Tugas
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Published Grades Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rekap Nilai Akademik Terbit</h3>
            <p className="text-xs text-slate-400">Nilai disahkan tutor & wali kelas semester berjalan</p>
          </div>
          <button
            onClick={() => setActiveView('rapor')}
            className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            Buka Rapor Digital Resmi
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Mata Pelajaran</th>
                <th className="py-2.5 px-3 text-center">Rata-rata Tugas</th>
                <th className="py-2.5 px-3 text-center">Kuis / CBT</th>
                <th className="py-2.5 px-3 text-center">UTS</th>
                <th className="py-2.5 px-3 text-center">UAS</th>
                <th className="py-2.5 px-3 text-center">Nilai Akhir</th>
                <th className="py-2.5 px-3 text-center">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myGrades.map((g, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{g.subjectName}</td>
                  <td className="py-2.5 px-3 text-center">{g.assignmentAverage}</td>
                  <td className="py-2.5 px-3 text-center">{g.quizAverage}</td>
                  <td className="py-2.5 px-3 text-center">{g.utsScore}</td>
                  <td className="py-2.5 px-3 text-center">{g.uasScore}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{g.finalScore}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                      {g.predicate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
