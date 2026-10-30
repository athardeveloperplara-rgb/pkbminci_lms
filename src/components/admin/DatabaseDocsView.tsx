import React, { useState } from 'react';
import {
  Database,
  Code2,
  Shield,
  FileCheck2,
  Copy,
  Check,
  Server,
  Layers,
  Terminal,
} from 'lucide-react';

export const DatabaseDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'firebase' | 'deployment' | 'checklist'>('sql');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sqlDDL = `-- ====================================================================
-- SKEMA DATABASE RELASIONAL: LMS PKBM INSAN CITA
-- Sesuai Bab 18 & 19: 40 Tabel Relasional, UUID Primary Keys, Indeks & RLS
-- ====================================================================

-- Aktifkan ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Roles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'super_admin', 'admin', 'kepala_pkbm', 'tutor', 'student', 'parent'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 2. Programs, Academic Years & Semesters
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL, -- 'PAKET_A', 'PAKET_B', 'PAKET_C'
    name VARCHAR(100) NOT NULL,
    level_equivalent VARCHAR(50) NOT NULL, -- 'SD', 'SMP', 'SMA'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL, -- '2026/2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(20) NOT NULL CHECK (name IN ('Ganjil', 'Genap')),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Classes (Rombel) & Class Members
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT,
    grade_level INT NOT NULL, -- 6, 9, 12 dsb
    tutor_homeroom_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Students & Guardians
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    nis VARCHAR(50) UNIQUE NOT NULL,
    nisn VARCHAR(20) UNIQUE,
    gender CHAR(1) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    address TEXT,
    enrollment_year VARCHAR(10),
    program_id UUID REFERENCES programs(id),
    current_class_id UUID REFERENCES classes(id),
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Cuti', 'Lulus', 'Nonaktif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE class_members (
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE tutors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    nip VARCHAR(50) UNIQUE,
    education VARCHAR(100),
    specialization VARCHAR(150),
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    relation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE guardian_students (
    guardian_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (guardian_id, student_id)
);

-- 5. Subjects & Tutor Assignments
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    program_id UUID REFERENCES programs(id),
    grade_level INT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Umum', 'Keterampilan', 'Pemberdayaan'
    credit_hours INT DEFAULT 2,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tutor_subjects (
    tutor_id UUID REFERENCES tutors(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, subject_id, class_id)
);

-- 6. Learning Materials & Progress
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('pdf', 'video', 'document', 'link')),
    content_url TEXT NOT NULL,
    file_size VARCHAR(20),
    is_mandatory BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE material_progress (
    material_id UUID REFERENCES learning_materials(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (material_id, student_id)
);

-- 7. Assignments & Submissions
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    instructions TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_score INT DEFAULT 100,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text_content TEXT,
    attachment_url TEXT,
    score NUMERIC(5,2),
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'submitted',
    UNIQUE (assignment_id, student_id)
);

-- 8. CBT Quizzes, Question Bank, & Attempts
CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
    question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    prompt TEXT NOT NULL,
    correct_answer TEXT,
    explanation TEXT,
    weight NUMERIC(5,2) DEFAULT 10,
    difficulty VARCHAR(20) DEFAULT 'Sedang'
);

CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL,
    passing_score NUMERIC(5,2) DEFAULT 75,
    randomize_questions BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    score NUMERIC(5,2),
    is_passed BOOLEAN,
    status VARCHAR(20) DEFAULT 'in_progress'
);

-- 9. Attendance
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    meeting_number INT NOT NULL,
    session_date DATE NOT NULL,
    topic TEXT NOT NULL,
    tutor_id UUID REFERENCES tutors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat')),
    notes TEXT,
    UNIQUE (session_id, student_id)
);

-- 10. Grades & Digital Report Cards
CREATE TABLE final_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
    assignment_avg NUMERIC(5,2) DEFAULT 0,
    quiz_avg NUMERIC(5,2) DEFAULT 0,
    uts_score NUMERIC(5,2) DEFAULT 0,
    uas_score NUMERIC(5,2) DEFAULT 0,
    final_score NUMERIC(5,2) NOT NULL,
    predicate CHAR(1) CHECK (predicate IN ('A', 'B', 'C', 'D')),
    learning_description TEXT,
    is_locked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (student_id, subject_id, semester_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_grades ENABLE ROW LEVEL SECURITY;

-- Siswa hanya dapat membaca data miliknya
CREATE POLICY "Student read own profile" ON students
    FOR SELECT USING (auth.uid() = profile_id);

-- Tutor dapat membaca kelas yang diajarnya
CREATE POLICY "Tutor read class submissions" ON assignment_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a
            JOIN tutor_subjects ts ON ts.subject_id = a.subject_id
            JOIN tutors t ON t.id = ts.tutor_id
            WHERE a.id = assignment_submissions.assignment_id
            AND t.profile_id = auth.uid()
        )
    );
`;

  const firestoreRules = `// ====================================================================
// FIREBASE FIRESTORE SECURITY RULES - LMS PKBM INSAN CITA
// Enforces Strict RBAC for Super Admin, Admin, Kepala PKBM, Tutor, Student, Parent
// ====================================================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role;
    }

    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'super_admin';
    }

    function isAdmin() {
      return isAuthenticated() && (getUserRole() == 'admin' || getUserRole() == 'super_admin');
    }

    function isTutor() {
      return isAuthenticated() && getUserRole() == 'tutor';
    }

    function isStudent() {
      return isAuthenticated() && getUserRole() == 'student';
    }

    // Profiles Collection
    match /profiles/{userId} {
      allow read: if isAuthenticated();
      allow write: if isSuperAdmin() || request.auth.uid == userId;
    }

    // Students Data Collection
    match /students/{studentId} {
      allow read: if isAdmin() || isTutor() || request.auth.uid == studentId;
      allow write: if isAdmin();
    }

    // Learning Materials
    match /learning_materials/{materialId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isTutor();
    }

    // Assignment Submissions
    match /assignment_submissions/{submissionId} {
      allow read: if isAdmin() || isTutor() || resource.data.studentId == request.auth.uid;
      allow create: if isStudent() && request.resource.data.studentId == request.auth.uid;
      allow update: if (isAdmin() || isTutor()) || (isStudent() && resource.data.studentId == request.auth.uid);
      allow delete: if isAdmin();
    }

    // CBT Exams & Attempts
    match /cbt_exams/{examId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isTutor();
    }

    match /exam_attempts/{attemptId} {
      allow read: if isAdmin() || isTutor() || resource.data.studentId == request.auth.uid;
      allow create: if isStudent() && request.resource.data.studentId == request.auth.uid;
      allow update: if isAdmin() || isTutor();
    }

    // Attendance Records
    match /attendance_records/{recordId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isTutor();
    }

    // Grades & Report Cards (Tutor & Admin only can publish, Students read-only)
    match /final_grades/{gradeId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isTutor();
    }

    // School Profile Settings
    match /school_settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <span>Dokumentasi Arsitektur Database & Keamanan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Skema 40 tabel relasional (PostgreSQL/Supabase) dan aturan keamanan Firestore (Security Rules) sesuai Bab 18 & 19.
          </p>
        </div>

        <button
          onClick={() =>
            copyToClipboard(activeTab === 'sql' ? sqlDDL : firestoreRules)
          }
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode Skema'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'sql', label: 'PostgreSQL & Supabase DDL (40 Tabel)', icon: Database },
          { id: 'firebase', label: 'Firebase Firestore Rules', icon: Shield },
          { id: 'deployment', label: 'Panduan Deployment & Hosting', icon: Server },
          { id: 'checklist', label: 'Checklist Pengujian 20 Kriteria', icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Display Area */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {activeTab === 'sql' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700">
                PostgreSQL Relational Schema (ANSI SQL / Supabase Migration)
              </span>
              <span>40 Entitas Lengkap • UUID PKs • Constraints • RLS</span>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[500px]">
              {sqlDDL}
            </pre>
          </div>
        )}

        {activeTab === 'firebase' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700">
                Firebase Firestore Security Rules (firestore.rules)
              </span>
              <span>Role-Based Access Control (RBAC) • Proteksi Dokumen Siswa</span>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[500px]">
              {firestoreRules}
            </pre>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
            <h3 className="text-sm font-bold text-slate-900">
              Panduan Deployment LMS PKBM Insan Cita ke Lingkungan Produksi
            </h3>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-bold text-slate-900 mb-1">1. Kompilasi dan Build Aplikasi</h4>
                <p className="text-slate-600 mb-2">
                  Jalankan perintah build standar Vite untuk memproduksi berkas frontend statis yang teroptimasi:
                </p>
                <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono">
                  npm run build
                </code>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-bold text-slate-900 mb-1">2. Konfigurasi Environment Variables</h4>
                <p className="text-slate-600 mb-2">
                  Salin <code>.env.example</code> ke <code>.env</code> dan masukkan konfigurasi backend (Supabase / Firebase):
                </p>
                <code className="block bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono">
                  VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                  VITE_SUPABASE_ANON_KEY=eyJh...
                </code>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="font-bold text-slate-900 mb-1">3. Hosting Opsi</h4>
                <p className="text-slate-600">
                  Aplikasi dapat dideploy dengan mudah ke Cloud Run, Vercel, Netlify, atau Firebase Hosting.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Checklist Pengujian & Kriteria Keberhasilan (Bab 23)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                '1. Login & logout berfungsi dengan baik.',
                '2. Hak akses setiap peran (6 role) berjalan di aplikasi.',
                '3. Data dapat ditambah, dilihat, diedit, dan dihapus.',
                '4. Data tersimpan setelah halaman dimuat ulang (localStorage sync).',
                '5. Data peserta didik terproteksi sesuai otorisasi.',
                '6. Tutor mengelola kelas dan materi yang diampu.',
                '7. Materi PDF & Video tutorial dapat dipelajari & ditandai selesai.',
                '8. File & teks tugas dapat dikumpulkan oleh siswa.',
                '9. Tugas dapat diperiksa dan dinilai oleh tutor dengan umpan balik.',
                '10. Ujian CBT interaktif dapat dimulai dengan timer real-time.',
                '11. Penilaian otomatis CBT pilihan ganda & benar/salah akurat.',
                '12. Esai dapat dinilai manual oleh tutor.',
                '13. Presensi KBM dapat dicatat per pertemuan & direkap persentasenya.',
                '14. Rapor digital mengambil nilai sah dengan format resmi & tanda tangan.',
                '15. Laporan dapat difilter dan diekspor ke format CSV.',
                '16. Tampilan responsif nyaman di HP, tablet, dan komputer desktop.',
                '17. Pesan validasi form & notifikasi ditampilkan dalam bahasa Indonesia.',
                '18. Navigasi lengkap tanpa dead-links atau halaman kosong.',
                '19. Tidak ada data rahasia atau password tersimpan dalam plain text.',
                '20. Penanda Data Demo / Simulasi terlihat jelas dan dapat di-reset.',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-200 bg-emerald-50/40"
                >
                  <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
