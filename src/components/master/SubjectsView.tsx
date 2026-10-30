import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Clock,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject, EducationalProgram } from '../../types';

export const SubjectsView: React.FC = () => {
  const { subjects, tutors, addSubject, currentUser } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: 'KWU-C10',
    name: '',
    program: 'Paket C' as EducationalProgram,
    gradeLevel: 10,
    tutorId: tutors[0]?.id || '',
    tutorName: tutors[0]?.name || '',
    creditHours: 3,
    category: 'Keterampilan' as 'Umum' | 'Kejuruan / Vokasi' | 'Pemberdayaan' | 'Keterampilan',
    description: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  });

  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  const filteredSubjects = subjects.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.program === selectedFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const tut = tutors.find((t) => t.id === formData.tutorId);
    addSubject({
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
            Mata Pelajaran Kurikulum Kesetaraan
          </h2>
          <p className="text-xs text-slate-500">
            Struktur kurikulum nasional kesetaraan Paket A, B, C memadukan mata pelajaran umum dan keterampilan vokasi khas PKBM.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Mata Pelajaran</span>
          </button>
        )}
      </div>

      {/* Program Tab Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Semua Mata Pelajaran' },
          { id: 'Paket A', label: 'Paket A (Setara SD)' },
          { id: 'Paket B', label: 'Paket B (Setara SMP)' },
          { id: 'Paket C', label: 'Paket C (Setara SMA)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              selectedFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      sub.category === 'Keterampilan'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sub.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{sub.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">Kode: {sub.code}</span>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {sub.program}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                    Tutor Pengampu:
                  </span>
                  <span className="font-semibold text-slate-800">{sub.tutorName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Bobot / Jam Belajar:
                  </span>
                  <span className="font-bold text-slate-800">{sub.creditHours} Jam Tatap Muka/Minggu</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-emerald-700">Tingkat Kelas {sub.gradeLevel}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {sub.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Mata Pelajaran Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Keterampilan Menjahit Busana"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Umum">Umum (Akademik)</option>
                    <option value="Keterampilan">Keterampilan / Vokasi</option>
                    <option value="Pemberdayaan">Pemberdayaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Belajar/Minggu</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.creditHours}
                    onChange={(e) => setFormData({ ...formData, creditHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tutor Pengampu</label>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat Capaian</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan kompetensi dasar yang dipelajari..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
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
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
