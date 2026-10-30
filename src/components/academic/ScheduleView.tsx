import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Video,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScheduleView: React.FC = () => {
  const { schedules, classes } = useApp();

  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const filtered = schedules.filter((s) => {
    const matchesDay = selectedDay === 'all' || s.day === selectedDay;
    const matchesMode = selectedMode === 'all' || s.mode === selectedMode;
    return matchesDay && matchesMode;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Jadwal Pembelajaran & Tutorial Kesetaraan
          </h2>
          <p className="text-xs text-slate-500">
            Kombinasi pembelajaran tatap muka (tutorial langsung), daring sinkron, dan belajar mandiri.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Semua Hari' },
          { id: 'Senin', label: 'Senin' },
          { id: 'Rabu', label: 'Rabu' },
          { id: 'Sabtu', label: 'Sabtu' },
          { id: 'Minggu', label: 'Minggu' },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(d.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              selectedDay === d.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {item.day}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.mode === 'Tatap Muka'
                      ? 'bg-blue-100 text-blue-800'
                      : item.mode === 'Daring'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.mode}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900">{item.subjectName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.className}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {item.startTime} - {item.endTime} WIB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Tutor: {item.tutorName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.mode === 'Daring' ? (
                    <Video className="h-4 w-4 text-purple-600 shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="truncate">{item.roomOrLink}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Semester Ganjil 2026/2027</span>
              <button className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800">
                Masuk Ruang KBM →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
