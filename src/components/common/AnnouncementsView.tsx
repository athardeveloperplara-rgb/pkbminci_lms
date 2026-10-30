import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Calendar,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EducationalProgram } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const { announcements, addAnnouncement, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRole: 'all' as 'all' | 'students' | 'tutors',
    targetProgram: undefined as EducationalProgram | undefined,
    isUrgent: false,
  });

  const canCreate =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'kepala_pkbm';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    addAnnouncement(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      content: '',
      targetRole: 'all',
      targetProgram: undefined,
      isUrgent: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pusat Informasi & Pengumuman Resmi PKBM
          </h2>
          <p className="text-xs text-slate-500">
            Pemberitahuan akademik, jadwal kegiatan, dan edaran resmi dari pimpinan lembaga.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl border p-5 shadow-xs transition-all ${
              ann.isUrgent
                ? 'border-red-300 bg-red-50/20'
                : 'border-slate-200 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {ann.isUrgent && (
                  <span className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 border border-red-200">
                    <AlertTriangle className="h-3 w-3" /> PENTING
                  </span>
                )}
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {ann.targetRole === 'all'
                    ? 'Seluruh Warga Belajar'
                    : ann.targetRole === 'students'
                    ? 'Khusus Peserta Didik'
                    : 'Khusus Tutor'}
                </span>
                {ann.targetProgram && (
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    {ann.targetProgram}
                  </span>
                )}
              </div>

              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {ann.publishedAt}
              </span>
            </div>

            <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {ann.title}
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Dipublikasikan oleh: <strong>{ann.authorName}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Terbitkan Pengumuman Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Jadwal Libur Semester Ganjil"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Sasaran</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="all">Semua Warga Belajar</option>
                    <option value="students">Hanya Peserta Didik</option>
                    <option value="tutors">Hanya Tutor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Program (Opsional)</label>
                  <select
                    value={formData.targetProgram || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetProgram: e.target.value ? (e.target.value as EducationalProgram) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Semua Program (Paket A, B, C)</option>
                    <option value="Paket A">Paket A (SD)</option>
                    <option value="Paket B">Paket B (SMP)</option>
                    <option value="Paket C">Paket C (SMA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pengumuman Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Ketik teks pengumuman resmi..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                  Tandai sebagai pengumuman mendesak / penting
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Kirim Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
