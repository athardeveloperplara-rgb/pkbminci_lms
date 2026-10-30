import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  User,
  Send,
  MessageSquare,
  Award,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentSubmission, EducationalProgram } from '../../types';

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    submissions,
    classes,
    subjects,
    students,
    currentUser,
    addAssignment,
    submitAssignment,
    gradeSubmission,
  } = useApp();

  const isStudent = currentUser?.role === 'student';
  const canCreate =
    currentUser?.role === 'tutor' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin';

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>(assignments[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);

  // Student submission form
  const [submissionText, setSubmissionText] = useState('');
  const [submissionAttachment, setSubmissionAttachment] = useState('');

  // Tutor grading form
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // New assignment form
  const [newAsgData, setNewAsgData] = useState({
    title: '',
    description: '',
    instructions: '',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || '',
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    program: 'Paket C' as EducationalProgram,
    tutorId: currentUser?.id || 'tut_hendra',
    tutorName: currentUser?.name || 'Hendra Wijaya, S.E.',
    dueDate: '2026-11-15T23:59:00',
    maxScore: 100,
    allowFileUpload: true,
    status: 'published' as 'draft' | 'published' | 'closed',
  });

  const currentStudentSubmission = submissions.find(
    (s) => s.assignmentId === selectedAssignment?.id && s.studentId === currentUser?.id
  );

  const assignmentSubmissions = submissions.filter(
    (s) => s.assignmentId === selectedAssignment?.id
  );

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim() && !submissionAttachment.trim()) return;

    submitAssignment({
      assignmentId: selectedAssignment.id,
      studentId: currentUser?.id || 'std_rian',
      studentName: currentUser?.name || 'Rian Pratama',
      studentNis: currentUser?.studentIdNumber || '2024.12.001',
      textContent: submissionText,
      attachmentName: submissionAttachment || 'Dokumen_Tugas_Mandiri.pdf',
    });

    setIsSubmitModalOpen(false);
    setSubmissionText('');
    setSubmissionAttachment('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeSubmission(gradingSubmission.id, gradeScore, gradeFeedback);
    setGradingSubmission(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgData.title.trim()) return;

    const sub = subjects.find((s) => s.id === newAsgData.subjectId);
    const cls = classes.find((c) => c.id === newAsgData.classId);

    addAssignment({
      ...newAsgData,
      subjectName: sub ? sub.name : newAsgData.subjectName,
      className: cls ? cls.name : newAsgData.className,
      program: cls ? cls.program : newAsgData.program,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Tugas & Lembar Kerja Peserta Didik (LKPD)
          </h2>
          <p className="text-xs text-slate-500">
            Pengumpulan tugas mandiri, lembar praktik vokasi, dan penilaian akademik berbasis rubrik.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Assignments */}
        <div className="lg:col-span-4 space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1">
            Daftar Tugas Aktif ({assignments.length})
          </div>

          {assignments.map((asg) => {
            const isSelected = selectedAssignment?.id === asg.id;
            const mySub = submissions.find(
              (s) => s.assignmentId === asg.id && s.studentId === currentUser?.id
            );

            return (
              <div
                key={asg.id}
                onClick={() => setSelectedAssignment(asg)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {asg.subjectName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Batas: {asg.dueDate.split('T')[0]}
                  </span>
                </div>

                <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-2">
                  {asg.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {asg.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] border-t border-slate-100 pt-2">
                  <span className="text-slate-500">{asg.className}</span>
                  {isStudent && (
                    <span
                      className={`font-bold ${
                        mySub ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {mySub ? '✓ Sudah Mengumpulkan' : 'Belum Dikumpulkan'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Assignment Details & Submission Portal */}
        <div className="lg:col-span-8 space-y-6">
          {selectedAssignment ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      {selectedAssignment.subjectName}
                    </span>
                    <span className="text-xs text-slate-500">• {selectedAssignment.className}</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    Bobot Nilai: Maks {selectedAssignment.maxScore} Poin
                  </span>
                </div>

                <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900">
                  {selectedAssignment.title}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-red-600">
                    <Calendar className="h-3.5 w-3.5" />
                    Tenggat Waktu: {selectedAssignment.dueDate.replace('T', ' ')} WIB
                  </span>
                  <span>Tutor Penguji: {selectedAssignment.tutorName}</span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Petunjuk & Instruksi Pengerjaan:
                </h4>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {selectedAssignment.instructions || selectedAssignment.description}
                </div>
              </div>

              {/* Student Submission Card */}
              {isStudent && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Status Pengumpulan Anda
                    </h4>
                    {currentStudentSubmission ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {currentStudentSubmission.status === 'graded'
                          ? `Sudah Dinilai (${currentStudentSubmission.score}/100)`
                          : 'Terkirim - Menunggu Nilai'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        Belum Mengumpulkan
                      </span>
                    )}
                  </div>

                  {currentStudentSubmission ? (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Teks Respon / Jawaban Anda:
                        </span>
                        <p className="mt-1 text-slate-800 whitespace-pre-line leading-relaxed">
                          {currentStudentSubmission.textContent || '-'}
                        </p>
                      </div>

                      {currentStudentSubmission.attachmentName && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <FileText className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-slate-700 truncate">
                            {currentStudentSubmission.attachmentName}
                          </span>
                        </div>
                      )}

                      {currentStudentSubmission.feedback && (
                        <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
                          <span className="font-bold text-amber-900 block mb-0.5">
                            Catatan Umpan Balik Tutor ({currentStudentSubmission.gradedBy}):
                          </span>
                          <p className="text-amber-800 leading-relaxed italic">
                            "{currentStudentSubmission.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Kirim Jawaban Tugas Sekarang</span>
                    </button>
                  )}
                </div>
              )}

              {/* Tutor & Admin View: Submissions List */}
              {canCreate && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Lembar Jawaban Siswa Masuk ({assignmentSubmissions.length})
                      </h4>
                      <p className="text-[11px] text-slate-400">Daftar siswa yang telah menyerahkan tugas ini</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Nama Siswa & NIS</th>
                          <th className="py-2.5 px-3">Waktu Penyerahan</th>
                          <th className="py-2.5 px-3">File / Respon</th>
                          <th className="py-2.5 px-3 text-center">Nilai</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assignmentSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3">
                              <p className="font-bold text-slate-900">{sub.studentName}</p>
                              <span className="text-[10px] text-slate-400 font-mono">NIS: {sub.studentNis}</span>
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {sub.submittedAt.split('T')[0]}
                            </td>
                            <td className="py-3 px-3">
                              <p className="truncate max-w-[180px] text-slate-700 font-medium">
                                {sub.attachmentName || sub.textContent || 'Jawaban Teks'}
                              </p>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {sub.score !== undefined ? (
                                <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                  {sub.score}
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                                  Belum Dinilai
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setGradeScore(sub.score || 85);
                                  setGradeFeedback(sub.feedback || '');
                                }}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                              >
                                {sub.score !== undefined ? 'Koreksi' : 'Beri Nilai'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              Pilih salah satu tugas di sebelah kiri untuk melihat rincian instruksi.
            </div>
          )}
        </div>
      </div>

      {/* Student Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Kirim Jawaban Tugas: {selectedAssignment?.title}
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ketik Jawaban / Tanggapan Teks Langsung
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Tuliskan uraian hasil analisis atau jawaban tugas Anda di sini..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-sans"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama File Lampiran (Opsional / PDF / Word)
                </label>
                <input
                  type="text"
                  value={submissionAttachment}
                  onChange={(e) => setSubmissionAttachment(e.target.value)}
                  placeholder="Contoh: Rian_Pratama_Tugas_Bisnis.pdf"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Serahkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tutor Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Koreksi & Penilaian Jawaban Siswa
                </h3>
                <p className="text-xs text-slate-500">
                  {gradingSubmission.studentName} (NIS: {gradingSubmission.studentNis})
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Teks Jawaban Siswa:</span>
              {gradingSubmission.textContent || 'Siswa mengunggah berkas lampiran terpisah.'}
            </div>

            <form onSubmit={handleGradeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nilai Angka (Skala 0 - 100) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-center font-bold text-slate-900 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Umpan Balik & Catatan Penguatan Belajar
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Berikan apresiasi dan saran perbaikan kompetensi siswa..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Simpan & Sahkan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Buat Tugas & Lembar Kerja Baru</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  value={newAsgData.title}
                  onChange={(e) => setNewAsgData({ ...newAsgData, title: e.target.value })}
                  placeholder="Contoh: Tugas Praktik: Pencatatan Pembukuan Keuangan Usaha"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={newAsgData.subjectId}
                    onChange={(e) => setNewAsgData({ ...newAsgData, subjectId: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Sasaran</label>
                  <select
                    value={newAsgData.classId}
                    onChange={(e) => setNewAsgData({ ...newAsgData, classId: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenggat Waktu</label>
                  <input
                    type="date"
                    value={newAsgData.dueDate.split('T')[0]}
                    onChange={(e) => setNewAsgData({ ...newAsgData, dueDate: `${e.target.value}T23:59:00` })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bobot Nilai Maksimal</label>
                  <input
                    type="number"
                    value={newAsgData.maxScore}
                    onChange={(e) => setNewAsgData({ ...newAsgData, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instruksi Lengkap Pengerjaan</label>
                <textarea
                  rows={3}
                  value={newAsgData.instructions}
                  onChange={(e) => setNewAsgData({ ...newAsgData, instructions: e.target.value })}
                  placeholder="Langkah 1, Langkah 2, format jawaban yang diharapkan..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Publikasikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
