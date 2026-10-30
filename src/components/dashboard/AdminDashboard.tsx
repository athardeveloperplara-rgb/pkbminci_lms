import React from 'react';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  FileCheck,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    tutors,
    classes,
    subjects,
    materials,
    assignments,
    exams,
    announcements,
    setActiveView,
  } = useApp();

  // Program metrics
  const paketACount = students.filter((s) => s.program === 'Paket A').length;
  const paketBCount = students.filter((s) => s.program === 'Paket B').length;
  const paketCCount = students.filter((s) => s.program === 'Paket C').length;
  const totalStudents = students.length;

  const avgAttendance =
    students.length > 0
      ? Math.round((students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length) * 10) / 10
      : 92;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Panel Manajemen Akademik & Operasional PKBM</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Selamat Datang di Portal Utama Administrator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Pantau seluruh aktivitas kegiatan belajar mengajar, data peserta didik Paket A, B, C, serta rekap evaluasi secara terintegrasi dan real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('students')}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <PlusCircle className="h-4 w-4 text-emerald-600" />
              <span>Kelola Peserta Didik</span>
            </button>
            <button
              onClick={() => setActiveView('cbt_exam')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-900/60 px-3.5 py-2 text-xs font-bold text-white border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-amber-300" />
              <span>Ujian CBT Online</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Warga Belajar</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> 100% Aktif
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Terdaftar di Dapodik Kesetaraan</p>
        </div>

        {/* Total Tutor */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tenaga Pendidik / Tutor</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{tutors.length}</span>
            <span className="text-xs font-semibold text-blue-600">Tersertifikasi</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Pengampu Paket A, B, & C</p>
        </div>

        {/* Rombel / Kelas */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rombongan Belajar</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{classes.length}</span>
            <span className="text-xs font-semibold text-slate-500">Kelas</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tahun Ajaran 2026/2027</p>
        </div>

        {/* Rata-rata Kehadiran */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tingkat Kehadiran KBM</span>
            <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{avgAttendance}%</span>
            <span className="text-xs font-semibold text-teal-600">Tinggi</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Rekap Tatap Muka & Daring</p>
        </div>
      </div>

      {/* Program Distribution & Class Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program Paket Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Distribusi Program Pendidikan</h3>
            <span className="text-xs font-semibold text-emerald-600">3 Program</span>
          </div>

          <div className="mt-4 space-y-4">
            {/* Paket A */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Paket A (Setara SD)</span>
                <span className="text-slate-900 font-bold">{paketACount} Siswa</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(paketACount / (totalStudents || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Kelas 4, 5, dan 6</span>
            </div>

            {/* Paket B */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Paket B (Setara SMP)</span>
                <span className="text-slate-900 font-bold">{paketBCount} Siswa</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(paketBCount / (totalStudents || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Kelas 7, 8, dan 9</span>
            </div>

            {/* Paket C */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Paket C (Setara SMA)</span>
                <span className="text-slate-900 font-bold">{paketCCount} Siswa</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${(paketCCount / (totalStudents || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Kelas 10, 11, dan 12 (Peminatan IPS & Vokasi)</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-3 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Kurikulum Merdeka Kesetaraan
            </div>
            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
              Memadukan modul akademik nasional dengan keterampilan vokasi wirausaha digital lokal.
            </p>
          </div>
        </div>

        {/* Classes & Learning Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rombongan Belajar & Tutor Pengampu</h3>
              <p className="text-xs text-slate-400">Daftar kelas aktif semester berjalan</p>
            </div>
            <button
              onClick={() => setActiveView('classes')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Kode / Nama Kelas</th>
                  <th className="py-2.5 px-3">Program</th>
                  <th className="py-2.5 px-3">Wali Kelas / Tutor</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Siswa</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {c.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.code}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {c.program}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{c.tutorName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{c.studentCount}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Announcements & Academic Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Pengumuman Resmi PKBM</h3>
            <button
              onClick={() => setActiveView('announcements')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Kelola Pengumuman
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    {ann.targetRole === 'all' ? 'Semua Warga Belajar' : ann.targetRole}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {ann.publishedAt}
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900">{ann.title}</h4>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                <span className="mt-1.5 block text-[10px] text-slate-400 font-medium">
                  Dipublikasikan oleh: {ann.authorName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Calendar & Quick Assessment Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Ujian & Tugas Aktif Berjalan</h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {exams.length} Ujian Aktif
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                      CBT Online
                    </span>
                    <span className="text-xs font-bold text-slate-800">{exam.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{exam.className}</span>
                    <span>•</span>
                    <span>Durasi: {exam.durationMinutes} Menit</span>
                    <span>•</span>
                    <span>KKM: {exam.passingScore}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('cbt_exam')}
                  className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
                >
                  Buka CBT
                </button>
              </div>
            ))}

            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800">
                      Tugas / LKPD
                    </span>
                    <span className="text-xs font-bold text-slate-800">{asg.title}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{asg.className}</span>
                    <span>•</span>
                    <span>Batas: {asg.dueDate.split('T')[0]}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('assignments')}
                  className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
