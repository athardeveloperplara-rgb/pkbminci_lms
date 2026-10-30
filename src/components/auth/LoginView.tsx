import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Info,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserProfile, AuthResult } from '../../types';

export interface LoginViewProps {
  onLoginSuccess?: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const {
    login: contextLogin,
    switchUser,
    schoolProfile,
    authError,
    clearAuthError,
  } = useApp();

  const [emailOrUsername, setEmailOrUsername] = useState('superadmin@pkbminsancita.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  /**
   * Handles form submission, user credential validation, authentication,
   * and updating the application context with the logged-in user details.
   */
  const login = async (
    e?: React.FormEvent | string,
    passArg?: string,
    rememberArg?: boolean
  ): Promise<AuthResult> => {
    // If called via form onSubmit event
    if (e && typeof e !== 'string' && 'preventDefault' in e) {
      e.preventDefault();
    }

    const inputEmail = (typeof e === 'string' ? e : emailOrUsername).trim();
    const inputPassword = (passArg !== undefined ? passArg : password).trim();
    const inputRemember = rememberArg !== undefined ? rememberArg : rememberMe;

    setLocalError(null);
    clearAuthError();

    if (!inputEmail) {
      const msg = 'Silakan masukkan email atau nama pengguna Anda.';
      setLocalError(msg);
      return { success: false, message: msg };
    }
    if (!inputPassword) {
      const msg = 'Silakan masukkan kata sandi akun Anda.';
      setLocalError(msg);
      return { success: false, message: msg };
    }

    setIsLoading(true);
    try {
      // Calls context login which verifies credentials and updates AppContext currentUser
      const result = await contextLogin(inputEmail, inputPassword, inputRemember);
      if (!result.success) {
        setLocalError(result.message || 'Kredensial tidak valid. Silakan coba lagi.');
      } else {
        setSuccessNotice(result.message || 'Login berhasil! Mengalihkan ke sistem...');
        if (result.user && onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      }
      return result;
    } catch {
      const netErr = 'Terjadi kendala jaringan saat menghubungi sistem autentikasi.';
      setLocalError(netErr);
      return { success: false, message: netErr };
    } finally {
      setIsLoading(false);
    }
  };

  // Provide handleSubmit alias for backwards compatibility
  const handleSubmit = login;

  const handleQuickDemoSelect = async (userEmail: string) => {
    setEmailOrUsername(userEmail);
    setPassword('admin123');
    await login(userEmail, 'admin123', true);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail.trim()) {
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setShowForgotModal(false);
        setForgotEmail('');
      }, 2500);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-950 via-slate-900 to-emerald-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo and Title */}
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-emerald-950/50 mb-4 border border-emerald-100">
          <img
            src={schoolProfile.logoUrl}
            alt="Logo PKBM Insan Cita"
            className="h-16 w-16 object-contain"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          LMS PKBM Insan Cita
        </h2>
        <p className="mt-1 text-sm text-emerald-200/90 font-medium">
          Sistem Informasi Pembelajaran Digital Pendidikan Kesetaraan
        </p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-xs text-emerald-100 font-semibold">
          <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
          <span>Paket A (SD) • Paket B (SMP) • Paket C (SMA)</span>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {/* Quick Demo Switcher Cards */}
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                AKSES CEPAT DEMO / PENGUJIAN (1-KLIK)
              </span>
              <span className="text-[10px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                Sandi: admin123
              </span>
            </div>
            <p className="text-xs text-amber-800 mb-3 leading-relaxed">
              Klik salah satu akun untuk langsung menguji dashboard & hak akses sesuai perannya:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(user.email)}
                  disabled={isLoading}
                  className="flex flex-col items-start p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/70 transition-all text-left shadow-2xs group disabled:opacity-50"
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover shrink-0"
                    />
                    <span className="text-[11px] font-bold text-slate-900 truncate group-hover:text-emerald-800">
                      {user.name.split(',')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold">Atau Masuk dengan Kredensial</span>
            </div>
          </div>

          {/* Regular Login Form */}
          <form className="space-y-4" onSubmit={login}>
            {displayError && (
              <div className="rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{displayError}</div>
              </div>
            )}

            {successNotice && (
              <div className="rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email atau Nama Pengguna
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => {
                    setEmailOrUsername(e.target.value);
                    setLocalError(null);
                    clearAuthError();
                  }}
                  placeholder="superadmin@pkbminsancita.sch.id / superadmin"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError(null);
                    clearAuthError();
                  }}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                Ingat sesi saya
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="font-medium text-emerald-700 hover:text-emerald-800"
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke LMS PKBM</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Note */}
          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Sistem Pembelajaran Terenkripsi & Aman
            </span>
            <span>Versi 2.4.0</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pemulihan Kata Sandi</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Instruksi Reset Terkirim!</h4>
                <p className="text-xs text-slate-500">
                  Tautan atur ulang kata sandi telah dikirim ke <strong>{forgotEmail}</strong>. Silakan periksa kotak masuk atau spam email Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masukkan alamat email terdaftar Anda untuk menerima tautan pemulihan kata sandi akun PKBM Insan Cita.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Terdaftar</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@pkbminsancita.sch.id"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Kirim Tautan Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
