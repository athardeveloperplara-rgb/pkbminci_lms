import React from 'react';
import {
  Users,
  FileText,
  CheckSquare,
  HelpCircle,
  Calendar,
  Clock,
  ArrowRight,
  UserCheck,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TutorDashboard: React.FC = () => {
  const {
    currentUser,
    classes,
    materials,
    assignments,
    submissions,
    exams,
    schedules,
    setActiveView,
  } = useApp();

  const myTutorName = currentUser?.name || 'Budi Santoso, S.Pd.';

  // Tutor classes
  const myClasses = classes.filter(
    (c) => c.tutorName.includes(myTutorName.split(' ')[0]) || c.tutorId === currentUser?.id
  );

  // Materials by tutor
  const myMaterials = materials.filter(
    (m) => m.tutorName.includes(myTutorName.split(' ')[0]) || m.tutorId === currentUser?.id
  );

  // Assignments by tutor
  const myAssignments = assignments.filter(
    (a) => a.tutorName.includes(myTutorName.split(' ')[0]) || a.tutorId === currentUser?.id
  );

  // Submissions needing grading
  const pendingGradingSubmissions = submissions.filter((s) => s.status === 'submitted');

  // Schedules
  const mySchedules = schedules.filter((s) => s.tutorName.includes(myTutorName.split(' ')[0]));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Portal Tenaga Pendidik / Tutor Kesetaraan</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Selamat Mengajar, {currentUser?.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Spesialisasi: {currentUser?.specialization || 'Pendidik Kesetaraan'}. Kelola modul ajar, evaluasi tugas peserta didik, dan pantau presensi kelas Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('attendance')}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Input Presensi</span>
            </button>
            <button
              onClick={() => setActiveView('assignments')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700/80 px-3.5 py-2 text-xs font-bold text-white border border-emerald-500/40 hover:bg-emerald-700 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-amber-300" />
              <span>Buat Tugas Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tutor Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rombel Diampu</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myClasses.length || 2}</span>
            <span className="text-xs font-semibold text-emerald-600">Kelas Aktif</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Paket B & Paket C</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Materi Terbit</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{myMaterials.length || 3}</span>
            <span className="text-xs font-semibold text-blue-600">Modul</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">PDF, Dokumen & Video</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tugas Perlu Dinilai</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">{pendingGradingSubmissions.length}</span>
            <span className="text-xs font-semibold text-amber-700">Jawaban Masuk</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Menunggu pemeriksaan</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ujian CBT Aktif</span>
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <HelpCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{exams.length}</span>
            <span className="text-xs font-semibold text-purple-600">Sesi</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Bank Soal Terintegrasi</p>
        </div>
      </div>

      {/* Main Grid: Pending Submissions & Teaching Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Submissions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pengumpulan Tugas Peserta Didik</h3>
              <p className="text-xs text-slate-400">Periksa dan berikan penilaian serta umpan balik belajar</p>
            </div>
            <button
              onClick={() => setActiveView('assignments')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Buka Semua Tugas <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 font-mono">
                      NIS: {sub.studentNis}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                        sub.status === 'graded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status === 'graded' ? `Nilai: ${sub.score}` : 'Menunggu Dinilai'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-1 italic">
                    "{sub.textContent || sub.attachmentName || 'Jawaban tugas terlampir'}"
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Dikumpulkan: {sub.submittedAt.split('T')[0]}
                  </span>
                </div>

                <button
                  onClick={() => setActiveView('assignments')}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors self-start sm:self-center"
                >
                  {sub.status === 'graded' ? 'Koreksi Ulang' : 'Beri Nilai & Komentar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Jadwal Mengajar Anda</h3>
            <span className="text-xs font-semibold text-emerald-600">Minggu Ini</span>
          </div>

          <div className="mt-4 space-y-3">
            {mySchedules.length > 0 ? (
              mySchedules.map((sch) => (
                <div key={sch.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      {sch.day}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {sch.startTime} - {sch.endTime} WIB
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-bold text-slate-900">{sch.subjectName}</p>
                  <p className="text-[11px] text-slate-500">{sch.className}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] border-t border-slate-200/50 pt-1.5">
                    <span className="text-emerald-700 font-semibold">{sch.mode}</span>
                    <span className="text-slate-400 truncate max-w-[130px]">{sch.roomOrLink}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Belum ada jadwal tatap muka minggu ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
