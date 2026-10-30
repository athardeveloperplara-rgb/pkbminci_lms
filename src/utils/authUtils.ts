import { UserProfile, AuthResult } from '../types';

/**
 * Maps each role to their designated landing page / dashboard route.
 */
export function getInitialRouteForRole(role: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
    case 'kepala_pkbm':
    case 'tutor':
    case 'student':
    case 'parent':
    default:
      return 'dashboard';
  }
}

/**
 * Checks whether a given role has permission to access a specific navigation module.
 */
export function canAccessView(role: string, view: string): boolean {
  switch (view) {
    case 'dashboard':
    case 'schedule':
    case 'attendance':
    case 'rapor':
    case 'announcements':
      return true;

    case 'students':
    case 'classes':
    case 'subjects':
      return ['super_admin', 'admin', 'kepala_pkbm', 'tutor'].includes(role);

    case 'tutors':
    case 'reports':
    case 'settings':
      return ['super_admin', 'admin', 'kepala_pkbm'].includes(role);

    case 'database_docs':
      return ['super_admin', 'admin'].includes(role);

    case 'materials':
    case 'assignments':
    case 'cbt_exam':
    case 'discussions':
      return ['super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student'].includes(role);

    default:
      return true;
  }
}

/**
 * Pure authentication validator and credential resolver.
 */
export function authenticateUser(
  users: UserProfile[],
  emailOrUsername: string,
  password?: string
): AuthResult {
  const query = emailOrUsername ? emailOrUsername.toLowerCase().trim() : '';

  if (!query) {
    return {
      success: false,
      message: 'Silakan masukkan email atau nama pengguna Anda.',
    };
  }

  if (!password || !password.trim()) {
    return {
      success: false,
      message: 'Silakan masukkan kata sandi akun Anda.',
    };
  }

  // Find user by email or username
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === query ||
      (u.username && u.username.toLowerCase() === query)
  );

  if (!found) {
    return {
      success: false,
      message:
        'Kredensial tidak ditemukan. Pastikan email atau nama pengguna Anda sudah terdaftar di PKBM Insan Cita.',
    };
  }

  // Check account active status
  if (found.status === 'inactive') {
    return {
      success: false,
      message:
        'Akun Anda sedang dinonaktifkan oleh Administrator PKBM. Silakan hubungi bagian tata usaha.',
    };
  }

  // Check password (defaults to 'admin123' for demo users)
  const validPassword = found.password || 'admin123';
  if (password !== validPassword) {
    return {
      success: false,
      message:
        'Kata sandi yang Anda masukkan salah. Silakan periksa kembali atau gunakan fitur lupa kata sandi.',
    };
  }

  const redirectView = getInitialRouteForRole(found.role);

  return {
    success: true,
    user: found,
    redirectView,
    message: `Selamat datang kembali, ${found.name}!`,
  };
}
