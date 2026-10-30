export type UserRole = 'super_admin' | 'admin' | 'kepala_pkbm' | 'tutor' | 'student' | 'parent';

export type EducationalProgram = 'Paket A' | 'Paket B' | 'Paket C';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  program?: EducationalProgram;
  classId?: string;
  className?: string;
  studentIdNumber?: string; // NIS
  nisn?: string;
  nip?: string;
  specialization?: string;
  childStudentId?: string; // For parents
  childName?: string;
  status: 'active' | 'inactive';
  password?: string;
}

export type User = UserProfile;

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: UserProfile;
  redirectView?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  email: string;
  parentName: string;
  parentPhone: string;
  program: EducationalProgram;
  gradeLevel: number; // e.g. 1-6 for Paket A, 7-9 for Paket B, 10-12 for Paket C
  classId: string;
  className: string;
  enrollmentYear: string;
  status: 'Aktif' | 'Cuti' | 'Lulus' | 'Nonaktif';
  avatar: string;
  attendanceRate: number;
  averageGrade: number;
}

export interface Tutor {
  id: string;
  nip: string;
  name: string;
  gender: 'L' | 'P';
  email: string;
  phoneNumber: string;
  education: string;
  specialization: string;
  assignedSubjectIds: string[];
  assignedSubjects: string[];
  assignedClassIds: string[];
  assignedClasses: string[];
  status: 'Aktif' | 'Cuti' | 'Nonaktif';
  avatar: string;
}

export interface ClassRoom {
  id: string;
  code: string;
  name: string;
  program: EducationalProgram;
  gradeLevel: number;
  academicYear: string;
  tutorId: string;
  tutorName: string;
  studentCount: number;
  status: 'Aktif' | 'Selesai' | 'Arsip';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  program: EducationalProgram;
  gradeLevel: number;
  tutorId: string;
  tutorName: string;
  creditHours: number;
  category: 'Umum' | 'Kejuruan / Vokasi' | 'Pemberdayaan' | 'Keterampilan';
  description: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  program: EducationalProgram;
  tutorId: string;
  tutorName: string;
  type: 'pdf' | 'document' | 'video' | 'link' | 'presentation';
  contentUrl: string;
  fileSize?: string;
  isMandatory: boolean;
  publishedAt: string;
  orderIndex: number;
  completedStudentIds: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  program: EducationalProgram;
  tutorId: string;
  tutorName: string;
  dueDate: string;
  maxScore: number;
  attachmentName?: string;
  attachmentUrl?: string;
  allowFileUpload: boolean;
  status: 'draft' | 'published' | 'closed';
  publishedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  submittedAt: string;
  textContent?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'needs_revision' | 'late';
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  examId?: string;
  subjectId: string;
  subjectName: string;
  type: QuestionType;
  prompt: string;
  options?: QuestionOption[];
  correctAnswer?: string; // For short_answer or true_false
  explanation?: string;
  weight: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
}

export interface CbtExam {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  program: EducationalProgram;
  tutorId: string;
  tutorName: string;
  durationMinutes: number;
  passingScore: number;
  startDate: string;
  endDate: string;
  randomizeQuestions: boolean;
  showResultImmediate: boolean;
  status: 'draft' | 'active' | 'closed';
  questions: Question[];
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  answers: Record<string, string>; // questionId -> selectedOptionId or text
  score?: number;
  isPassed?: boolean;
  status: 'in_progress' | 'submitted' | 'timed_out';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  meetingNumber: number;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  tutorId: string;
  tutorName: string;
  topic: string;
  studentRecords: {
    studentId: string;
    studentName: string;
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Terlambat';
    notes?: string;
  }[];
}

export interface GradeComponent {
  studentId: string;
  studentName: string;
  studentNis: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  assignmentAverage: number;
  quizAverage: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  learningDescription: string;
  status: 'Draft' | 'Disahkan';
}

export interface ReportCard {
  studentId: string;
  studentName: string;
  nis: string;
  nisn: string;
  program: EducationalProgram;
  className: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  grades: {
    subjectName: string;
    category: string;
    finalScore: number;
    predicate: string;
    achievement: string;
  }[];
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  tutorNote: string;
  issuePlace: string;
  issueDate: string;
  tutorName: string;
  headmasterName: string;
}

export interface DiscussionReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface DiscussionTopic {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  isPinned: boolean;
  replies: DiscussionReply[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'students' | 'tutors';
  targetProgram?: EducationalProgram;
  authorName: string;
  publishedAt: string;
  isUrgent?: boolean;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  tutorName: string;
  mode: 'Tatap Muka' | 'Daring' | 'Mandiri';
  roomOrLink: string;
}

export interface SchoolProfile {
  name: string;
  subtitle: string;
  npsn: string;
  operationalLicense?: string;
  taxId: string;
  accreditation: string;
  address: string;
  village: string;
  subdistrict: string;
  districtCity: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  headmasterName: string;
  headmasterNip: string;
  activeAcademicYear: string;
  activeSemester: 'Ganjil' | 'Genap';
  logoUrl: string;
}
