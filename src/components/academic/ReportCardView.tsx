import React, { useState } from 'react';
import {
  Award,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const ReportCardView: React.FC = () => {
  const { students, grades, schoolProfile, currentUser } = useApp();

  const isStudent = currentUser?.role === 'student';
  const defaultStudentId = isStudent ? (currentUser?.id || 'std_rian') : 'std_rian';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);

  const student =
    students.find((s) => s.id === selectedStudentId) ||
    students[0] || {
      id: 'std_rian',
      name: 'Rian Pratama',
      nis: '2024.12.001',
      nisn: '0065432190',
      program: 'Paket C',
      className: 'Paket C - Kelas 12 (IPS)',
      birthPlace: 'Jakarta',
      birthDate: '2006-05-14',
    };

  const studentGrades = grades.filter((g) => g.studentId === student.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Rapor Digital Hasil Belajar Pendidikan Kesetaraan
          </h2>
          <p className="text-xs text-slate-500">
            Dokumen resmi rekap capaian kompetensi akademik dan vokasi warga belajar PKBM Insan Cita.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isStudent && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Pilih Siswa:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs focus:ring-emerald-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.program} - {s.nis})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF Rapor</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL REPORT CARD SHEET (Clean print-optimized layout) */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-white p-8 sm:p-12 shadow-md print:p-0 print:border-none print:shadow-none print-card">
        {/* KOP SURAT RESMI */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <img
              src={schoolProfile.logoUrl}
              alt="Logo PKBM Insan Cita"
              className="h-20 w-20 object-contain shrink-0"
            />
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                PUSAT KEGIATAN BELAJAR MASYARAKAT (PKBM) INSAN CITA
              </h1>
              <h2 className="text-sm font-bold tracking-tight text-slate-800 uppercase">
                SATUAN PENDIDIKAN NONFORMAL PENDIDIKAN KESETARAAN
              </h2>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Izin Operasional: {schoolProfile.operationalLicense} • NPSN: {schoolProfile.npsn} • {schoolProfile.accreditation}
              </p>
              <p className="text-[10px] text-slate-500">
                Alamat: {schoolProfile.address}, Kec. {schoolProfile.subdistrict}, {schoolProfile.districtCity}, {schoolProfile.province}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6 text-center">
          <h3 className="text-base font-extrabold tracking-wide uppercase text-slate-900 underline underline-offset-4">
            LAPORAN HASIL BELAJAR (RAPOR KESETARAAN)
          </h3>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Program: {student.program} (Setara {student.program === 'Paket A' ? 'SD' : student.program === 'Paket B' ? 'SMP' : 'SMA'})
          </p>
        </div>

        {/* Student & Academic Metadata Table */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">Nama Warga Belajar</span>
              <span className="font-bold text-slate-900">: {student.name}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">Nomor Induk Siswa (NIS)</span>
              <span className="font-mono font-bold text-slate-900">: {student.nis}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">NISN</span>
              <span className="font-mono text-slate-900">: {student.nisn || '-'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">Rombel / Kelas</span>
              <span className="font-bold text-slate-900">: {student.className}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">Semester</span>
              <span className="font-bold text-slate-900">: {schoolProfile.activeSemester}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-semibold text-slate-600">Tahun Ajaran</span>
              <span className="font-bold text-slate-900">: {schoolProfile.activeAcademicYear}</span>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            A. Capaian Hasil Belajar Akademik & Keterampilan Vokasi
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-800 border-b border-slate-300 text-center">
                <tr>
                  <th className="border border-slate-300 py-2 px-2 w-8">No</th>
                  <th className="border border-slate-300 py-2 px-3 text-left">Mata Pelajaran</th>
                  <th className="border border-slate-300 py-2 px-2 w-16">Nilai Akhir</th>
                  <th className="border border-slate-300 py-2 px-2 w-16">Predikat</th>
                  <th className="border border-slate-300 py-2 px-3 text-left">Deskripsi Capaian Pembelajaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentGrades.length > 0 ? (
                  studentGrades.map((g, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="border border-slate-300 py-2 px-2 text-center font-semibold">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 font-bold text-slate-900">
                        {g.subjectName}
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-bold text-slate-900">
                        {g.finalScore}
                      </td>
                      <td className="border border-slate-300 py-2 px-2 text-center font-black text-slate-900">
                        {g.predicate}
                      </td>
                      <td className="border border-slate-300 py-2 px-3 text-[11px] text-slate-700 leading-relaxed">
                        {g.learningDescription}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="border border-slate-300 py-4 text-center text-slate-400">
                      Nilai sedang dalam proses pengolahan oleh tim pendidik PKBM.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance & Tutor Note */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Attendance Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              B. Rekap Kehadiran Belajar
            </h4>
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead className="bg-slate-100 font-bold text-slate-800 text-center">
                <tr>
                  <th className="border border-slate-300 py-1.5 px-3 text-left">Status</th>
                  <th className="border border-slate-300 py-1.5 px-3">Jumlah Pertemuan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 py-1.5 px-3 font-semibold">Hadir (Tatap Muka & Daring)</td>
                  <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900">18 Hari</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 py-1.5 px-3 font-semibold">Sakit (Keterangan Dokter)</td>
                  <td className="border border-slate-300 py-1.5 px-3 text-center">1 Hari</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 py-1.5 px-3 font-semibold">Izin (Keperluan Mendesak)</td>
                  <td className="border border-slate-300 py-1.5 px-3 text-center">1 Hari</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 py-1.5 px-3 font-semibold">Tanpa Keterangan (Alpa)</td>
                  <td className="border border-slate-300 py-1.5 px-3 text-center">0 Hari</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tutor Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              C. Catatan Tutor Pembimbing
            </h4>
            <div className="border border-slate-300 rounded-lg p-3 min-h-[90px] text-[11px] text-slate-700 leading-relaxed italic bg-slate-50/50">
              "Ananda {student.name} menunjukkan kedisiplinan belajar mandiri yang sangat baik dan aktif dalam praktikum kewirausahaan digital. Terus kembangkan keterampilan vokasi untuk persiapan uji kesetaraan nasional."
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-slate-600 font-medium">Orang Tua / Wali,</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[120px]">
              ( {student.parentName || 'Wali Murid'} )
            </p>
          </div>

          <div>
            <p className="text-slate-600 font-medium">Tutor / Wali Kelas,</p>
            <div className="h-16"></div>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[120px]">
              Dewi Lestari, M.Pd.
            </p>
            <p className="text-[10px] text-slate-400">NIP: 198509202010012015</p>
          </div>

          <div>
            <p className="text-slate-600 font-medium">
              Jakarta, 19 Desember 2026<br />Kepala PKBM Insan Cita,
            </p>
            <div className="h-14"></div>
            <p className="font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[140px]">
              {schoolProfile.headmasterName}
            </p>
            <p className="text-[10px] text-slate-400">NIP: {schoolProfile.headmasterNip}</p>
          </div>
        </div>

        {/* Official Footer */}
        <div className="mt-8 border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400">
          <span>Dicetak melalui Sistem LMS PKBM Insan Cita • Dokumen Sah Pendidikan Kesetaraan</span>
          <span>Halaman 1 dari 1</span>
        </div>
      </div>
    </div>
  );
};
