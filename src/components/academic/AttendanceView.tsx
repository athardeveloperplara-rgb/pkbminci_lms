import React, { useState } from 'react';
import {
  UserCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  Users,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';

export const AttendanceView: React.FC = () => {
  const { attendance, classes, subjects, students, recordAttendance, currentUser } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls_c12');
  const [meetingTopic, setMeetingTopic] = useState('Analisis Break Even Point Usaha Mandiri');
  const [meetingNumber, setMeetingNumber] = useState(12);
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Attendance state for current form
  const [attendanceSheet, setAttendanceSheet] = useState<
    Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Terlambat'>
  >({
    std_rian: 'Hadir',
    std_anita: 'Hadir',
    std_farhan: 'Hadir',
  });

  const canInput =
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'tutor';

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Terlambat'> = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'Hadir';
    });
    setAttendanceSheet(updated);
  };

  const handleStatusChange = (
    studentId: string,
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Terlambat'
  ) => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();

    const studentRecords = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceSheet[s.id] || 'Hadir',
    }));

    recordAttendance({
      date: meetingDate,
      meetingNumber,
      classId: selectedClass.id,
      className: selectedClass.name,
      subjectId: 'sub_kwu_c',
      subjectName: 'Kewirausahaan Digital',
      tutorId: currentUser?.id || 'tut_1',
      tutorName: currentUser?.name || 'Budi Santoso, S.Pd.',
      topic: meetingTopic,
      studentRecords,
    });

    alert('Presensi kehadiran pertemuan KBM berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Presensi & Jurnal Kegiatan Belajar Mengajar (KBM)
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan kehadiran tatap muka, tutorial mandiri, dan daring per pertemuan pembelajaran.
          </p>
        </div>

        {canInput && (
          <button
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 shadow-2xs transition-colors self-start sm:self-auto"
          >
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Tandai Semua Siswa Hadir (1-Klik)</span>
          </button>
        )}
      </div>

      {/* Input Session Card */}
      {canInput && (
        <form
          onSubmit={handleSaveAttendance}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span>Input Lembar Presensi Pertemuan Baru</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Pertemuan Ke-{meetingNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rombel / Kelas</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal KBM</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Topik Bahasan Materi</label>
              <input
                type="text"
                required
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder="Topik atau modul ajar yang dipelajari..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Student Presence Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Peserta Didik</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3 text-center">Status Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student) => {
                  const status = attendanceSheet[student.id] || 'Hadir';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{student.nis}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 gap-1">
                          {(['Hadir', 'Izin', 'Sakit', 'Alpa', 'Terlambat'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(student.id, st)}
                              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                                status === st
                                  ? st === 'Hadir'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : st === 'Alpa'
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Lembar Presensi KBM</span>
            </button>
          </div>
        </form>
      )}

      {/* Historical Attendance Records */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Riwayat Jurnal Pertemuan Pembelajaran Terakhir</h3>

        <div className="space-y-3">
          {attendance.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Pertemuan {rec.meetingNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{rec.subjectName}</span>
                    <span className="text-xs text-slate-500">• {rec.className}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-700">Topik: {rec.topic}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>{rec.date}</span>
                  <span className="block text-[11px] text-slate-400">Tutor: {rec.tutorName}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {rec.studentRecords.map((st, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                      st.status === 'Hadir'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : st.status === 'Alpa'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <span>{st.studentName}:</span>
                    <strong>{st.status}</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
