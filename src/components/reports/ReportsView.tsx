import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { students, tutors, classes, grades, attendance, schoolProfile } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'students' | 'grades' | 'attendance'>('students');

  const handleExportStudents = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'NIS,NISN,Nama,Program,Kelas,Kehadiran,NilaiRataRata,Status\n' +
      students
        .map(
          (s) =>
            `"${s.nis}","${s.nisn}","${s.name}","${s.program}","${s.className}","${s.attendanceRate}%","${s.averageGrade}","${s.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Siswa_PKBM_${schoolProfile.activeAcademicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportGrades = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'NamaSiswa,NIS,MataPelajaran,Tugas,Kuis,UTS,UAS,NilaiAkhir,Predikat\n' +
      grades
        .map(
          (g) =>
            `"${g.studentName}","${g.studentNis}","${g.subjectName}","${g.assignmentAverage}","${g.quizAverage}","${g.utsScore}","${g.uasScore}","${g.finalScore}","${g.predicate}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_PKBM_${schoolProfile.activeAcademicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pusat Laporan & Rekapitulasi Akademik
          </h2>
          <p className="text-xs text-slate-500">
            Ekspor rekap data warga belajar, rekapitulasi nilai, dan presensi untuk kebutuhan akreditasi BAN PDM dan Dapodik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'students', label: 'Rekap Warga Belajar', count: students.length },
          { id: 'grades', label: 'Rekapitulasi Nilai & KKM', count: grades.length },
          { id: 'attendance', label: 'Rekapitulasi Presensi KBM', count: attendance.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeReportTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab 1: Students Report */}
      {activeReportTab === 'students' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Laporan Induk Data Warga Belajar</h3>
              <p className="text-xs text-slate-500">Tahun Ajaran {schoolProfile.activeAcademicYear}</p>
            </div>
            <button
              onClick={handleExportStudents}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh Excel / CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">Program Kesetaraan</th>
                  <th className="py-2.5 px-3">Rombel</th>
                  <th className="py-2.5 px-3 text-center">Kehadiran</th>
                  <th className="py-2.5 px-3 text-center">Rata-rata Nilai</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">{s.nis}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-3">{s.program}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.className}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">{s.attendanceRate}%</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{s.averageGrade}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Grades Report */}
      {activeReportTab === 'grades' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Nilai & Ketuntasan Belajar</h3>
              <p className="text-xs text-slate-500">Nilai tugas, kuis, UTS, dan UAS resmi disahkan</p>
            </div>
            <button
              onClick={handleExportGrades}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Unduh Rekap Nilai CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Mata Pelajaran</th>
                  <th className="py-2.5 px-3 text-center">Tugas (30%)</th>
                  <th className="py-2.5 px-3 text-center">Kuis (20%)</th>
                  <th className="py-2.5 px-3 text-center">UTS (25%)</th>
                  <th className="py-2.5 px-3 text-center">UAS (25%)</th>
                  <th className="py-2.5 px-3 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-3 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{g.studentName}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{g.subjectName}</td>
                    <td className="py-2.5 px-3 text-center">{g.assignmentAverage}</td>
                    <td className="py-2.5 px-3 text-center">{g.quizAverage}</td>
                    <td className="py-2.5 px-3 text-center">{g.utsScore}</td>
                    <td className="py-2.5 px-3 text-center">{g.uasScore}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{g.finalScore}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="rounded bg-emerald-100 px-2 py-0.5 font-black text-emerald-900 text-xs">
                        {g.predicate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Attendance Report */}
      {activeReportTab === 'attendance' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Kehadiran Kegiatan Belajar</h3>
              <p className="text-xs text-slate-500">Log kehadiran per pertemuan KBM</p>
            </div>
          </div>

          <div className="space-y-3">
            {attendance.map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {rec.subjectName} • Pertemuan #{rec.meetingNumber} ({rec.date})
                  </span>
                  <span className="text-slate-500">Tutor: {rec.tutorName}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Topik Pembelajaran: {rec.topic}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {rec.studentRecords.map((st, i) => (
                    <span
                      key={i}
                      className="rounded bg-white px-2 py-0.5 text-[10px] border border-slate-200 text-slate-700 font-medium"
                    >
                      {st.studentName}: <strong>{st.status}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
