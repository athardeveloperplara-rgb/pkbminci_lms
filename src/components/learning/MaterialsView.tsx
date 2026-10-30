import React, { useState } from 'react';
import {
  FileText,
  Video,
  FileCode,
  Download,
  CheckCircle2,
  Plus,
  Play,
  ExternalLink,
  BookOpen,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningMaterial, EducationalProgram } from '../../types';

export const MaterialsView: React.FC = () => {
  const { materials, classes, subjects, addMaterial, toggleMaterialCompleted, currentUser } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activePreviewMat, setActivePreviewMat] = useState<LearningMaterial | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const studentId = currentUser?.id || 'std_rian';
  const isStudent = currentUser?.role === 'student';
  const canUpload =
    currentUser?.role === 'tutor' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    program: 'Paket C' as EducationalProgram,
    tutorId: currentUser?.id || 'tut_budi',
    tutorName: currentUser?.name || 'Budi Santoso, S.Pd.',
    type: 'pdf' as 'pdf' | 'document' | 'video' | 'link' | 'presentation',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.5 MB',
    isMandatory: true,
    orderIndex: 1,
  });

  const filteredMaterials = materials.filter((m) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'mandatory') return m.isMandatory;
    if (selectedFilter === 'video') return m.type === 'video';
    if (selectedFilter === 'pdf') return m.type === 'pdf';
    return m.program === selectedFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const sub = subjects.find((s) => s.id === formData.subjectId);
    const cls = classes.find((c) => c.id === formData.classId);

    addMaterial({
      ...formData,
      subjectName: sub ? sub.name : formData.subjectName,
      className: cls ? cls.name : formData.className,
      program: cls ? cls.program : formData.program,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Materi Pembelajaran & Modul Digital
          </h2>
          <p className="text-xs text-slate-500">
            Akses modul ajar resmi, video tutorial praktis, dan materi kesetaraan Paket A, B, dan C.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Unggah Modul / Video Baru</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Semua Materi' },
          { id: 'mandatory', label: 'Wajib Dipelajari' },
          { id: 'video', label: 'Video Pembelajaran' },
          { id: 'pdf', label: 'Modul PDF & Dokumen' },
          { id: 'Paket C', label: 'Paket C (SMA)' },
          { id: 'Paket B', label: 'Paket B (SMP)' },
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

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => {
          const isCompleted = mat.completedStudentIds.includes(studentId);

          return (
            <div
              key={mat.id}
              className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-lg p-2 ${
                        mat.type === 'video'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {mat.type === 'video' ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        {mat.subjectName}
                      </span>
                      <p className="text-[11px] text-slate-400">{mat.className}</p>
                    </div>
                  </div>

                  {mat.isMandatory && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-800 shrink-0">
                      WAJIB
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                  {mat.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Tutor: {mat.tutorName}</span>
                  {mat.fileSize && (
                    <>
                      <span>•</span>
                      <span>{mat.fileSize}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActivePreviewMat(mat)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>Buka / Pratinjau</span>
                </button>

                {isStudent && (
                  <button
                    onClick={() => toggleMaterialCompleted(mat.id, studentId)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isCompleted ? 'Selesai Dibaca' : 'Tandai Selesai'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {activePreviewMat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {activePreviewMat.subjectName} • {activePreviewMat.className}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{activePreviewMat.title}</h3>
              </div>
              <button
                onClick={() => setActivePreviewMat(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto">
              {activePreviewMat.type === 'video' ? (
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md">
                    <iframe
                      src={activePreviewMat.contentUrl}
                      title={activePreviewMat.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activePreviewMat.description}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-8 text-center bg-slate-50">
                    <BookOpen className="h-16 w-16 text-emerald-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 text-sm">Dokumen Modul Ajar Tersedia</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      {activePreviewMat.description}
                    </p>
                    <div className="mt-4 flex justify-center gap-3">
                      <a
                        href={activePreviewMat.contentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <Download className="h-4 w-4" />
                        <span>Unduh Dokumen ({activePreviewMat.fileSize || 'PDF'})</span>
                      </a>
                    </div>
                  </div>

                  <div className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-200">
                    <h5 className="font-bold text-xs text-emerald-900 mb-1">Panduan Belajar Mandiri:</h5>
                    <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                      <li>Pelajari setiap bab dan selesaikan lembar evaluasi mandiri pada akhir modul.</li>
                      <li>Jika menemui kendala konsep, gunakan menu Forum Diskusi untuk bertanya langsung kepada tutor pengampu.</li>
                      <li>Tandai modul sebagai selesai agar tercatat dalam rekap progres rapor digital Anda.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">Tutor: {activePreviewMat.tutorName}</span>
              <button
                onClick={() => {
                  toggleMaterialCompleted(activePreviewMat.id, studentId);
                  setActivePreviewMat(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Tandai Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Unggah Modul / Video Pembelajaran</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Materi / Modul *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Modul 02: Pemasaran Melalui TikTok Shop"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Tujuan</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Konten</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="pdf">Modul PDF / Lembar Kerja</option>
                    <option value="video">Video YouTube Tutorial</option>
                    <option value="document">Dokumen Word / Modul Teks</option>
                    <option value="presentation">Slide Presentasi (PPT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Wajib</label>
                  <select
                    value={formData.isMandatory ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.value === 'true' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="true">Wajib Dipelajari</option>
                    <option value="false">Materi Pengayaan (Opsional)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan File atau Video Embed
                </label>
                <input
                  type="url"
                  required
                  value={formData.contentUrl}
                  onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Petunjuk</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan poin penting materi..."
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
                  Publikasikan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
