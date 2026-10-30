import React from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Award,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  Building,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KepalaDashboard: React.FC = () => {
  const {
    students,
    tutors,
    classes,
    schoolProfile,
    grades,
    setActiveView,
  } = useApp();

  const passingGradesCount = grades.filter((g) => g.finalScore >= 75).length;
  const passRate = grades.length > 0 ? Math.round((passingGradesCount / grades.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-950 via-slate-900 to-amber-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dashboard Eksekutif Kepala PKBM</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              {schoolProfile.headmasterName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoring Kualitas Pendidikan Kesetaraan {schoolProfile.name} • {schoolProfile.accreditation} • NPSN: {schoolProfile.npsn}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView('rapor')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-400 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Pengesahan Rapor Digital</span>
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Ekspor Rekap Akreditasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tingkat Ketuntasan Belajar</span>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{passRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">KKM Tercapai</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Berdasarkan nilai PAS & tugas</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Rasio Pendidik & Siswa</span>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              1 : {Math.round(students.length / (tutors.length || 1))}
            </span>
            <span className="text-xs font-semibold text-blue-600">Ideal Standar</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{tutors.length} Tutor untuk {students.length} Siswa</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Keterpenuhan Modul Ajar</span>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">96.8%</span>
            <span className="text-xs font-semibold text-amber-700">Lengkap</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Kurikulum Merdeka Kesetaraan</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Status Akreditasi</span>
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">Terakreditasi</span>
            <span className="text-xs font-semibold text-purple-700">BAN PDM</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">SK No: 421.9/128/Disdik/2021</p>
        </div>
      </div>

      {/* Program Summary & Tutor Supervision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tutor Activity & Performance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Pengawasan Kinerja Tutor</h3>
            <button
              onClick={() => setActiveView('tutors')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Detail
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {tutors.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.specialization}</p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Mengampu: {t.assignedClasses.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Aktif Mengajar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Academic Quality Checklist */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Kesiapan Dokumen & Akreditasi Lembaga</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Siap Audit
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Sinkronisasi Data Dapodik Kesetaraan</span>
                <p className="text-[11px] text-slate-500">Seluruh NIK dan NISN warga belajar tervalidasi Kemendikdasmen.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Bank Soal CBT & Rubrik Penilaian Portofolio</span>
                <p className="text-[11px] text-slate-500">Standarisasi penilaian sumatif dan formatif berbasis komputer.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Kurikulum Operasional Satuan Pendidikan (KOSP)</span>
                <p className="text-[11px] text-slate-500">Mata pelajaran vokasi keterampilan mandiri dan kewirausahaan aktif.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
