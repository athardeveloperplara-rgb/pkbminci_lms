import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  FileText,
  CheckSquare,
  HelpCircle,
  MessagesSquare,
  CalendarDays,
  UserCheck,
  Award,
  Bell,
  BarChart3,
  Building2,
  Database,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { activeView, setActiveView, currentUser, schoolProfile } = useApp();

  const role = currentUser?.role || 'student';
  const isAdminOrSuper = role === 'admin' || role === 'super_admin';
  const isKepala = role === 'kepala_pkbm';
  const isTutor = role === 'tutor';

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    badge?: string;
  }

  const navSections: { sectionTitle: string; items: NavItem[] }[] = [
    {
      sectionTitle: 'UTAMA',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
      ],
    },
    {
      sectionTitle: 'DATA MASTER',
      items: [
        {
          id: 'students',
          label: 'Peserta Didik',
          icon: Users,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor'],
          badge: 'Aktif',
        },
        {
          id: 'tutors',
          label: 'Tenaga Pendidik / Tutor',
          icon: GraduationCap,
          roles: ['super_admin', 'admin', 'kepala_pkbm'],
        },
        {
          id: 'classes',
          label: 'Rombongan Belajar (Rombel)',
          icon: Layers,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor'],
        },
        {
          id: 'subjects',
          label: 'Mata Pelajaran',
          icon: BookOpen,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor'],
        },
      ],
    },
    {
      sectionTitle: 'PEMBELAJARAN (KBM)',
      items: [
        {
          id: 'materials',
          label: 'Materi Pembelajaran',
          icon: FileText,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
        {
          id: 'assignments',
          label: 'Tugas & LKPD',
          icon: CheckSquare,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
          badge: '2 Aktif',
        },
        {
          id: 'cbt_exam',
          label: 'Ujian & Kuis CBT',
          icon: HelpCircle,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
          badge: 'CBT Online',
        },
        {
          id: 'discussions',
          label: 'Forum Diskusi',
          icon: MessagesSquare,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student'],
        },
        {
          id: 'schedule',
          label: 'Jadwal & Kalender',
          icon: CalendarDays,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
      ],
    },
    {
      sectionTitle: 'AKADEMIK & EVALUASI',
      items: [
        {
          id: 'attendance',
          label: 'Presensi KBM',
          icon: UserCheck,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
        {
          id: 'rapor',
          label: 'Nilai & Rapor Digital',
          icon: Award,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
      ],
    },
    {
      sectionTitle: 'INFORMASI & ADMINISTRASI',
      items: [
        {
          id: 'announcements',
          label: 'Pengumuman PKBM',
          icon: Bell,
          roles: ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'],
        },
        {
          id: 'reports',
          label: 'Pusat Laporan & Rekap',
          icon: BarChart3,
          roles: ['super_admin', 'admin', 'kepala_pkbm'],
        },
        {
          id: 'settings',
          label: 'Profil & Pengaturan Lembaga',
          icon: Building2,
          roles: ['super_admin', 'admin', 'kepala_pkbm'],
        },
        {
          id: 'database_docs',
          label: 'Skema Database & Rules',
          icon: Database,
          roles: ['super_admin', 'admin'],
          badge: 'SQL & Rules',
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-20 flex h-[calc(100vh-4rem)] flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      } no-print`}
    >
      {/* Sidebar Top: Collapse button & Institute mini badge */}
      <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
        {isOpen ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              {schoolProfile.name}
            </span>
          </div>
        ) : (
          <div className="mx-auto">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title={isOpen ? 'Ciutkan sidebar' : 'Perluas sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {navSections.map((section, idx) => {
          // Filter items by role
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {isOpen && (
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.sectionTitle}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    title={!isOpen ? item.label : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700'
                      }`}
                    />
                    {isOpen && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {isOpen && item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${
                          isActive
                            ? 'bg-emerald-800/80 text-emerald-100'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Info: Educational Program info */}
      {isOpen && (
        <div className="border-t border-slate-100 p-3 bg-slate-50/70">
          <div className="rounded-xl border border-emerald-200 bg-white p-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-950">Program Kesetaraan</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                NPSN: {schoolProfile.npsn}
              </span>
            </div>
            <div className="mt-1.5 flex gap-1">
              <span className="flex-1 text-center rounded bg-emerald-50 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                Paket A (SD)
              </span>
              <span className="flex-1 text-center rounded bg-emerald-50 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                Paket B (SMP)
              </span>
              <span className="flex-1 text-center rounded bg-emerald-50 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                Paket C (SMA)
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
