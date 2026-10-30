import React from 'react';
import {
  Users,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ParentDashboard: React.FC = () => {
  const { currentUser, students, grades, announcements, setActiveView } = useApp();

  // Connected child
  const child = students.find((s) => s.id === (currentUser?.childStudentId || 'std_rian')) || students[0];
  const childGrades = grades.filter((g) => g.studentId === child?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Portal Pantau Perkembangan Belajar Putra/Putri</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Selamat Datang, Bapak/Ibu {currentUser?.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Memantau aktivitas belajar, kehadiran kelas, dan pencapaian akademik putra/putri Anda: <strong>{child?.name}</strong> ({child?.program} - {child?.className}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('rapor')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-400 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Lihat Rapor Digital Putra</span>
            </button>
          </div>
        </div>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tingkat Kehadiran KBM</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{child?.attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">Sangat Rajin</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tatap Muka & Daring</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rata-rata Nilai Akhir</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{child?.averageGrade}</span>
            <span className="text-xs font-semibold text-blue-600">Predikat A</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Diatas KKM PKBM (75)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Nomor Induk Siswa</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-sm font-black text-slate-900">{child?.nis}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">NISN: {child?.nisn}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Kontak Lembaga / Tutor</span>
            <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
              <Phone className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs font-bold text-slate-800">Layanan Konsultasi</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">0812-9876-5432 (TU PKBM)</p>
        </div>
      </div>

      {/* Child Grades */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Nilai Hasil Belajar Putra/Putri Anda</h3>
            <p className="text-xs text-slate-400">Hasil evaluasi pembelajaran semester aktif</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Mata Pelajaran</th>
                <th className="py-2.5 px-3 text-center">Nilai Akhir</th>
                <th className="py-2.5 px-3 text-center">Predikat</th>
                <th className="py-2.5 px-3">Capaian & Catatan Pembelajaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {childGrades.map((g, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{g.subjectName}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{g.finalScore}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                      {g.predicate}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 leading-relaxed text-[11px]">
                    {g.learningDescription}
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
