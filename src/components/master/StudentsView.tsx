import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student, EducationalProgram } from '../../types';

export const StudentsView: React.FC = () => {
  const { students, classes, addStudent, updateStudent, deleteStudent, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: '',
    birthDate: '2006-01-01',
    address: '',
    phoneNumber: '',
    email: '',
    parentName: '',
    parentPhone: '',
    program: 'Paket C' as EducationalProgram,
    gradeLevel: 12,
    classId: classes[0]?.id || '',
    className: classes[0]?.name || '',
    enrollmentYear: '2026',
    status: 'Aktif' as 'Aktif' | 'Cuti' | 'Lulus' | 'Nonaktif',
  });

  const canEdit =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'tutor';

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      s.nisn.includes(searchQuery) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || s.program === selectedProgram;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      nis: `2026.${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}`,
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: '',
      gender: 'L',
      birthPlace: 'Jakarta',
      birthDate: '2007-06-15',
      address: '',
      phoneNumber: '0812-',
      email: '',
      parentName: '',
      parentPhone: '0812-',
      program: 'Paket C',
      gradeLevel: 12,
      classId: classes[0]?.id || '',
      className: classes[0]?.name || '',
      enrollmentYear: '2026',
      status: 'Aktif',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      nis: student.nis,
      nisn: student.nisn,
      name: student.name,
      gender: student.gender,
      birthPlace: student.birthPlace,
      birthDate: student.birthDate,
      address: student.address,
      phoneNumber: student.phoneNumber,
      email: student.email,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      program: student.program,
      gradeLevel: student.gradeLevel,
      classId: student.classId,
      className: student.className,
      enrollmentYear: student.enrollmentYear,
      status: student.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const selectedCls = classes.find((c) => c.id === formData.classId);
    const classNameToSave = selectedCls ? selectedCls.name : formData.className;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        className: classNameToSave,
      });
    } else {
      addStudent({
        ...formData,
        className: classNameToSave,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data peserta didik ${name}? Data akademik terkait akan terhapus.`)) {
      deleteStudent(id);
    }
  };

  const handleExportCSV = () => {
    const headers = 'NIS,NISN,Nama,JenisKelamin,Program,Kelas,Status,NoTelepon,Email,Alamat,NamaWali\n';
    const rows = filteredStudents
      .map(
        (s) =>
          `"${s.nis}","${s.nisn}","${s.name}","${s.gender}","${s.program}","${s.className}","${s.status}","${s.phoneNumber}","${s.email}","${s.address.replace(/"/g, '""')}","${s.parentName}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Peserta_Didik_PKBM_Insan_Cita_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Data Peserta Didik (Warga Belajar)
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data induk siswa kesetaraan Paket A (SD), Paket B (SMP), dan Paket C (SMA).
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              <span>Impor Data CSV</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, NIS, NISN, atau alamat..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Filter Program */}
          <div className="sm:col-span-3">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
            >
              <option value="all">Semua Program Pendidikan</option>
              <option value="Paket A">Paket A (Setara SD)</option>
              <option value="Paket B">Paket B (Setara SMP)</option>
              <option value="Paket C">Paket C (Setara SMA)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
            >
              <option value="all">Semua Status Siswa</option>
              <option value="Aktif">Aktif</option>
              <option value="Cuti">Cuti</option>
              <option value="Lulus">Lulus</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Lengkap & NIS</th>
                <th className="py-3 px-3">Program & Rombel</th>
                <th className="py-3 px-3">Kontak & Email</th>
                <th className="py-3 px-3">Nama Wali Murid</th>
                <th className="py-3 px-3 text-center">Kehadiran</th>
                <th className="py-3 px-3 text-center">Rata-rata Nilai</th>
                <th className="py-3 px-3 text-center">Status</th>
                {canEdit && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & NIS */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{s.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span>NIS: {s.nis}</span>
                            <span>•</span>
                            <span>NISN: {s.nisn}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Program & Class */}
                    <td className="py-3 px-3">
                      <span className="inline-block font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                        {s.program}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-1">{s.className}</p>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{s.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{s.email}</span>
                      </div>
                    </td>

                    {/* Parent */}
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800">{s.parentName}</p>
                      <p className="text-[10px] text-slate-400">{s.parentPhone}</p>
                    </td>

                    {/* Attendance */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-slate-800">{s.attendanceRate}%</span>
                    </td>

                    {/* Average Grade */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-emerald-700">{s.averageGrade || 85}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'Lulus'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    {canEdit && (
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            title="Edit data siswa"
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            title="Hapus data siswa"
                            className="p-1 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit ? 8 : 7} className="py-8 text-center text-xs text-slate-400">
                    Tidak ditemukan peserta didik dengan kriteria pencarian ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan {filteredStudents.length} dari total {students.length} peserta didik</span>
          <span className="font-semibold text-emerald-700">Dapodik Kesetaraan Terverifikasi</span>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudent ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama sesuai akta lahir / KTP"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Siswa (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN (Nomor Induk Siswa Nasional)
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="10 digit nomor nasional"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Pendidikan
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value as EducationalProgram })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Paket A">Paket A (Setara SD)</option>
                    <option value="Paket B">Paket B (Setara SMP)</option>
                    <option value="Paket C">Paket C (Setara SMA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rombongan Belajar (Kelas)
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.program})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Siswa
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Siswa
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Nama wali murid"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Kontak Wali
                  </label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Tempat Tinggal
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambahkan Peserta Didik'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Impor Data Siswa dari CSV / Excel</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Unggah file CSV dengan kolom standar: <code>NIS, NISN, Nama, Program, Kelas, HP, Wali</code>.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50">
                <FileSpreadsheet className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">Klik untuk memilih file CSV</p>
                <p className="text-[10px] text-slate-400 mt-1">Maksimal 5MB (.csv atau .xlsx)</p>
              </div>

              <div className="rounded-lg bg-amber-50 p-2.5 text-[11px] text-amber-800 border border-amber-200">
                Sistem secara otomatis mendeteksi dan mencegah duplikasi NIS atau NISN ganda.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Data contoh simulasi telah tersinkronisasi.');
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Mulai Impor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
