import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClassRoom, EducationalProgram } from '../../types';

export const ClassesView: React.FC = () => {
  const { classes, tutors, addClassRoom, currentUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: 'PKC-10',
    name: '',
    program: 'Paket C' as EducationalProgram,
    gradeLevel: 10,
    academicYear: '2026/2027',
    tutorId: tutors[0]?.id || '',
    tutorName: tutors[0]?.name || '',
    status: 'Aktif' as 'Aktif' | 'Selesai' | 'Arsip',
  });

  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const tut = tutors.find((t) => t.id === formData.tutorId);
    addClassRoom({
      ...formData,
      tutorName: tut ? tut.name : formData.tutorName,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Rombongan Belajar (Rombel & Kelas)
          </h2>
          <p className="text-xs text-slate-500">
            Pengorganisasian kelas belajar kesetaraan Paket A, B, dan C tahun ajaran 2026/2027.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Rombel Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {cls.program}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{cls.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">Kode: {cls.code}</span>
              </div>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                {cls.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  Wali Kelas / Tutor:
                </span>
                <span className="font-semibold text-slate-800">{cls.tutorName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Jumlah Siswa Terdaftar:
                </span>
                <span className="font-bold text-slate-900">{cls.studentCount} Orang</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Tahun Ajaran:
                </span>
                <span className="text-slate-700">{cls.academicYear}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-700 font-semibold">Tingkat Kelas {cls.gradeLevel}</span>
              <button className="text-[11px] font-bold text-slate-600 hover:text-emerald-700">
                Lihat Anggota Kelas →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Rombongan Belajar (Kelas)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Rombel / Kelas *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Paket C - Kelas 10 (MIPA)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Kelas</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value as EducationalProgram })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Paket A">Paket A (SD)</option>
                    <option value="Paket B">Paket B (SMP)</option>
                    <option value="Paket C">Paket C (SMA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Wali Kelas / Tutor Pembimbing</label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {tutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
