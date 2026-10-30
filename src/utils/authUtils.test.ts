import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateUser, getInitialRouteForRole, canAccessView } from './authUtils';
import { UserProfile } from '../types';

const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    name: 'Administrator Utama',
    email: 'superadmin@pkbminsancita.sch.id',
    username: 'superadmin',
    role: 'super_admin',
    status: 'active',
    password: 'admin123',
  },
  {
    id: 'user_student',
    name: 'Rian Pratama',
    email: 'rian.siswa@pkbminsancita.sch.id',
    username: 'rian_siswa',
    role: 'student',
    status: 'active',
    password: 'admin123',
  },
  {
    id: 'user_inactive',
    name: 'Pengguna Nonaktif',
    email: 'nonaktif@pkbminsancita.sch.id',
    username: 'nonaktif',
    role: 'student',
    status: 'inactive',
    password: 'admin123',
  },
];

test('authenticateUser succeeds with correct email and password', () => {
  const result = authenticateUser(MOCK_USERS, 'superadmin@pkbminsancita.sch.id', 'admin123');
  assert.equal(result.success, true);
  assert.equal(result.user?.id, 'user_admin');
  assert.equal(result.redirectView, 'dashboard');
});

test('authenticateUser succeeds with username regardless of letter casing', () => {
  const result = authenticateUser(MOCK_USERS, 'RIAN_SISWA', 'admin123');
  assert.equal(result.success, true);
  assert.equal(result.user?.id, 'user_student');
});

test('authenticateUser rejects empty email/username', () => {
  const result = authenticateUser(MOCK_USERS, '', 'admin123');
  assert.equal(result.success, false);
  assert.match(result.message || '', /masukkan email atau nama pengguna/i);
});

test('authenticateUser rejects empty password', () => {
  const result = authenticateUser(MOCK_USERS, 'superadmin@pkbminsancita.sch.id', '');
  assert.equal(result.success, false);
  assert.match(result.message || '', /masukkan kata sandi/i);
});

test('authenticateUser rejects incorrect password', () => {
  const result = authenticateUser(MOCK_USERS, 'superadmin@pkbminsancita.sch.id', 'wrongpass');
  assert.equal(result.success, false);
  assert.match(result.message || '', /Kata sandi yang Anda masukkan salah/i);
});

test('authenticateUser rejects non-existent account', () => {
  const result = authenticateUser(MOCK_USERS, 'unknown@domain.com', 'admin123');
  assert.equal(result.success, false);
  assert.match(result.message || '', /Kredensial tidak ditemukan/i);
});

test('authenticateUser rejects inactive account with clear notice', () => {
  const result = authenticateUser(MOCK_USERS, 'nonaktif@pkbminsancita.sch.id', 'admin123');
  assert.equal(result.success, false);
  assert.match(result.message || '', /dinonaktifkan oleh Administrator/i);
});

test('canAccessView protects restricted administrative views', () => {
  assert.equal(canAccessView('student', 'settings'), false);
  assert.equal(canAccessView('student', 'database_docs'), false);
  assert.equal(canAccessView('student', 'tutors'), false);
  assert.equal(canAccessView('student', 'materials'), true);
  assert.equal(canAccessView('student', 'cbt_exam'), true);

  assert.equal(canAccessView('super_admin', 'settings'), true);
  assert.equal(canAccessView('super_admin', 'database_docs'), true);
  assert.equal(canAccessView('admin', 'database_docs'), true);
  assert.equal(canAccessView('kepala_pkbm', 'database_docs'), false);
});
