import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tutor } from '../../types';

export const TutorsView: React.FC = () => {
  const { tutors, classes, subjects, addTutor, updateTutor, deleteTutor, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);

  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    gender: 'L' as 'L' | 'P',
    email: '',
    phoneNumber: '',
    education: '',
    specialization: '',
    assignedSubjectIds: [] as string[],
    assignedSubjects: [] as string[],
    assignedClassIds: [] as string[],
    assignedClasses: [] as string[],
    status: 'Aktif' as 'Aktif' | 'Cuti' | 'Nonaktif',
  });

  const canEdit = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  const filteredTutors = tutors.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery)
  );

  const handleOpenAdd = () => {
    setEditingTutor(null);
    setFormData({
      nip: `1985${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
      name: '',
      gender: 'L',
      email: '',
      phoneNumber: '0812-',
      education: 'S1 Pendidikan',
      specialization: 'Matematika & Literasi',
      assignedSubjectIds: [subjects[0]?.id || ''],
      assignedSubjects: [subjects[0]?.name || ''],
      assignedClassIds: [classes[0]?.id || ''],
      assignedClasses: [classes[0]?.name || ''],
      status: 'Aktif',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (tutor: Tutor) => {
    setEditingTutor(tutor);
    setFormData({
      nip: tutor.nip,
      name: tutor.name,
      gender: tutor.gender,
      email: tutor.email,
      phoneNumber: tutor.phoneNumber,
      education: tutor.education,
      specialization: tutor.specialization,
      assignedSubjectIds: tutor.assignedSubjectIds,
      assignedSubjects: tutor.assignedSubjects,
      assignedClassIds: tutor.assignedClassIds,
      assignedClasses: tutor.assignedClasses,
      status: tutor.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingTutor) {
      updateTutor(editingTutor.id, formData);
    } else {
      addTutor(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus data tutor ${name}?`)) {
      deleteTutor(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Data Tenaga Pendidik (Tutor Kesetaraan)
          </h2>
          <p className="text-xs text-slate-500">
            Daftar tutor pengampu mata pelajaran kurikulum kesetaraan Paket A, B, dan C.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Tutor Baru</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tutor, NIP, atau bidang keahlian..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
          />
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutors.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500/20 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                    <p className="text-[11px] font-mono text-slate-400">NIP: {t.nip}</p>
                    <span className="inline-block mt-0.5 rounded-md bg-emerald-50 px-2 py-0.2 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      {t.education}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 shrink-0">
                  {t.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Keahlian: <strong>{t.specialization}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{t.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>

              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Kelas yang Diampu:
                </span>
                <div className="flex flex-wrap gap-1">
                  {t.assignedClasses.map((cls, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Tutor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTutor ? 'Edit Data Tutor' : 'Tambah Tutor Baru'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Dra. Nurhayati, M.Pd."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / ID Internal</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="S1 / S2 Pendidikan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bidang Keahlian</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="Matematika Terapan & IPA"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
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
                  Simpan Tutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
