import React, { useState } from 'react';
import {
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  User,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const {
    currentUser,
    schoolProfile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    switchUser,
    logout,
    resetToDemoData,
    setActiveView,
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleSwitcherModal, setShowRoleSwitcherModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'admin':
        return { label: 'Admin / Operator', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'kepala_pkbm':
        return { label: 'Kepala PKBM', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'tutor':
        return { label: 'Tutor Pendidik', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'student':
        return { label: 'Peserta Didik', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'parent':
        return { label: 'Wali Murid', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { label: role, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const roleInfo = currentUser ? getRoleBadge(currentUser.role) : { label: 'Tamu', color: '' };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-xs backdrop-blur-md sm:px-6">
        {/* Left: Branding & Academic Year Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={schoolProfile.logoUrl}
              alt="Logo PKBM Insan Cita"
              className="h-10 w-10 object-contain drop-shadow-xs"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 text-base">
                  LMS PKBM Insan Cita
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  {schoolProfile.activeAcademicYear} {schoolProfile.activeSemester}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pendidikan Kesetaraan Paket A, B, & C</p>
            </div>
          </div>
        </div>

        {/* Center: Search & Quick Demo Switcher Indicator */}
        <div className="hidden md:flex items-center gap-3 max-w-md w-full mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi, tugas, ujian, nama siswa..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <button
            onClick={() => setShowRoleSwitcherModal(true)}
            title="Klik untuk mengganti peran pengujian"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Uji Peran: <strong>{roleInfo.label}</strong></span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right: Actions, Notifications, & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Role Switch Button */}
          <button
            onClick={() => setShowRoleSwitcherModal(true)}
            className="md:hidden flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800"
          >
            <span>Peran</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Pemberitahuan"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-slate-900 text-sm">Pemberitahuan</h4>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[11px] font-medium text-emerald-800">
                      {unreadCount} Baru
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`pt-2 cursor-pointer p-2 rounded-lg transition-colors ${
                        n.read ? 'bg-white opacity-70 hover:opacity-100' : 'bg-emerald-50/60 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
                        {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />}
                        {n.type === 'info' && <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />}
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 p-1.5 sm:px-3 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                    {currentUser.name}
                  </div>
                  <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded-sm border font-medium ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    {currentUser.program && (
                      <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                        {currentUser.program} - {currentUser.className}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowRoleSwitcherModal(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-md transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Ganti Peran Pengguna
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setActiveView('settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      Pengaturan Profil
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Reset semua data kembali ke contoh awal demonstrasi?')) {
                          resetToDemoData();
                          setShowUserDropdown(false);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                    >
                      <RotateCcw className="h-4 w-4 text-amber-600" />
                      Reset Data Contoh
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Role Switcher Modal */}
      {showRoleSwitcherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Ganti Peran Pengguna (Mode Uji)</h3>
                  <p className="text-xs text-slate-500">Pilih salah satu akun demo untuk menguji hak akses modul</p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleSwitcherModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto p-1">
              {DEMO_USERS.map((user) => {
                const b = getRoleBadge(user.role);
                const isSelected = currentUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowRoleSwitcherModal(false);
                    }}
                    className={`cursor-pointer rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 text-xs truncate">{user.name}</p>
                        <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded-sm border font-medium ${b.color}`}>
                          {b.label}
                        </span>
                        {user.program && (
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.program}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Data tersimpan otomatis di browser lokal
              </span>
              <button
                onClick={() => setShowRoleSwitcherModal(false)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
