import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EducationalProgram,
  SchoolProfile,
  Student,
  Tutor,
  ClassRoom,
  Subject,
  LearningMaterial,
  Assignment,
  AssignmentSubmission,
  CbtExam,
  ExamAttempt,
  AttendanceRecord,
  GradeComponent,
  Announcement,
  ScheduleItem,
  DiscussionTopic,
  AuthResult,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  DEMO_USERS,
  INITIAL_STUDENTS,
  INITIAL_TUTORS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_EXAMS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCHEDULES,
  INITIAL_DISCUSSIONS,
} from '../data/mockData';
import { evaluateCbtSubmission } from '../utils/academicRules';
import { authenticateUser, getInitialRouteForRole } from '../utils/authUtils';

/**
 * User roles supported by PKBM Insan Cita LMS
 */
export type UserRole = 'super_admin' | 'admin' | 'kepala_pkbm' | 'tutor' | 'student' | 'parent';

/**
 * User interface defining authenticated user profile details
 */
export interface User {
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

// UserProfile alias for backward compatibility
export type UserProfile = User;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

/**
 * AppState management interface representing global LMS state and operations
 */
export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authError: string | null;
  clearAuthError: () => void;
  schoolProfile: SchoolProfile;
  students: Student[];
  tutors: Tutor[];
  classes: ClassRoom[];
  subjects: Subject[];
  materials: LearningMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  exams: CbtExam[];
  examAttempts: ExamAttempt[];
  attendance: AttendanceRecord[];
  grades: GradeComponent[];
  announcements: Announcement[];
  schedules: ScheduleItem[];
  discussions: DiscussionTopic[];
  notifications: AppNotification[];
  activeView: string;
  isDemoMode: boolean;
  
  // Navigation & Auth
  setActiveView: (view: string) => void;
  switchUser: (userId: string) => void;
  login: (emailOrUsername: string, password?: string, rememberMe?: boolean) => Promise<AuthResult>;
  logout: () => void;
  updateCurrentUserProfile: (profile: Partial<User>) => void;
  
  // Entity actions
  addStudent: (student: Omit<Student, 'id' | 'avatar' | 'attendanceRate' | 'averageGrade'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  addTutor: (tutor: Omit<Tutor, 'id' | 'avatar'>) => void;
  updateTutor: (id: string, tutor: Partial<Tutor>) => void;
  deleteTutor: (id: string) => void;

  addClassRoom: (cls: Omit<ClassRoom, 'id' | 'studentCount'>) => void;
  addSubject: (sub: Omit<Subject, 'id'>) => void;

  addMaterial: (material: Omit<LearningMaterial, 'id' | 'completedStudentIds' | 'publishedAt'>) => void;
  toggleMaterialCompleted: (materialId: string, studentId: string) => void;

  addAssignment: (assignment: Omit<Assignment, 'id' | 'publishedAt'>) => void;
  submitAssignment: (submission: { assignmentId: string; studentId: string; studentName: string; studentNis: string; textContent?: string; attachmentName?: string }) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  addExam: (exam: Omit<CbtExam, 'id'>) => void;
  finishExamAttempt: (examId: string, studentId: string, studentName: string, answers: Record<string, string>) => ExamAttempt;

  recordAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateGradeComponent: (grade: GradeComponent) => void;

  addDiscussionTopic: (topic: { classId: string; className: string; subjectId: string; subjectName: string; title: string; content: string }) => void;
  addDiscussionReply: (topicId: string, content: string) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt' | 'authorName'>) => void;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => void;
}

// AppContextType alias for backward compatibility
export type AppContextType = AppState;

export const AppContext = createContext<AppState | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pkbm_insan_cita_lms_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load persisted state or fallback to defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEMO_USERS[0]; // Default to Super Admin for immediate exploration
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isDemoMode] = useState<boolean>(true);

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_school`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SCHOOL_PROFILE;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_students`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_STUDENTS;
  });

  const [tutors, setTutors] = useState<Tutor[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tutors`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_TUTORS;
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_classes`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CLASSES;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_subjects`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SUBJECTS;
  });

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_materials`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_MATERIALS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assignments`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_submissions`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SUBMISSIONS;
  });

  const [exams, setExams] = useState<CbtExam[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_exams`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_EXAMS;
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_exam_attempts`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_attendance`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ATTENDANCE;
  });

  const [grades, setGrades] = useState<GradeComponent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_grades`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_GRADES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_announcements`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [schedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);

  const [discussions, setDiscussions] = useState<DiscussionTopic[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_discussions`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_DISCUSSIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Tugas Baru Tersedia',
      message: 'Pak Hendra menerbitkan Tugas Mandiri 01: Analisis Rencana Bisnis.',
      timestamp: 'Baru saja',
      read: false,
      type: 'info',
    },
    {
      id: 'notif_2',
      title: 'Jadwal Ujian CBT Aktif',
      message: 'PTS Kewirausahaan Digital sudah dibuka untuk Kelas 12 Paket C.',
      timestamp: '2 jam yang lalu',
      read: false,
      type: 'warning',
    },
    {
      id: 'notif_3',
      title: 'Nilai Tugas Dipublikasikan',
      message: 'Tugas Analisis Bisnis Rian Pratama telah dinilai (Skor: 88).',
      timestamp: 'Kemarin',
      read: true,
      type: 'success',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_school`, JSON.stringify(schoolProfile));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_students`, JSON.stringify(students));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tutors`, JSON.stringify(tutors));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_classes`, JSON.stringify(classes));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_subjects`, JSON.stringify(subjects));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_materials`, JSON.stringify(materials));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assignments`, JSON.stringify(assignments));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_submissions`, JSON.stringify(submissions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_exams`, JSON.stringify(exams));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_exam_attempts`, JSON.stringify(examAttempts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_attendance`, JSON.stringify(attendance));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_grades`, JSON.stringify(grades));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_announcements`, JSON.stringify(announcements));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_discussions`, JSON.stringify(discussions));
  }, [
    schoolProfile,
    students,
    tutors,
    classes,
    subjects,
    materials,
    assignments,
    submissions,
    exams,
    examAttempts,
    attendance,
    grades,
    announcements,
    discussions,
  ]);

  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => {
    setAuthError(null);
  };

  /**
   * Helper to determine initial landing view based on user role.
   */
  const getInitialRouteForRole = (role: string): string => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return 'dashboard';
      case 'kepala_pkbm':
        return 'dashboard';
      case 'tutor':
        return 'dashboard';
      case 'student':
        return 'dashboard';
      case 'parent':
        return 'dashboard';
      default:
        return 'dashboard';
    }
  };

  // Auth actions
  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setAuthError(null);
      setCurrentUser(found);
      const targetView = getInitialRouteForRole(found.role);
      setActiveView(targetView);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(found));
    }
  };

  const login = async (
    emailOrUsername: string,
    password = '',
    rememberMe = true
  ): Promise<AuthResult> => {
    // Artificial slight delay for realistic auth feedback in UI
    await new Promise((r) => setTimeout(r, 200));

    const result = authenticateUser(DEMO_USERS, emailOrUsername, password);

    if (!result.success || !result.user) {
      setAuthError(result.message || 'Gagal masuk');
      return result;
    }

    // Successful login: update state and role-based view
    setAuthError(null);
    setCurrentUser(result.user);
    const targetView = result.redirectView || getInitialRouteForRole(result.user.role);
    setActiveView(targetView);

    if (rememberMe) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(result.user));
    } else {
      sessionStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(result.user));
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    }

    return result;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError(null);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    sessionStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    setActiveView('dashboard');
  };

  const updateCurrentUserProfile = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      const newProfile = { ...currentUser, ...updated };
      setCurrentUser(newProfile);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(newProfile));
    }
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'avatar' | 'attendanceRate' | 'averageGrade'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std_${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      attendanceRate: 100,
      averageGrade: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Tutor CRUD
  const addTutor = (tutorData: Omit<Tutor, 'id' | 'avatar'>) => {
    const newTutor: Tutor = {
      ...tutorData,
      id: `tut_${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    };
    setTutors((prev) => [newTutor, ...prev]);
  };

  const updateTutor = (id: string, updated: Partial<Tutor>) => {
    setTutors((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTutor = (id: string) => {
    setTutors((prev) => prev.filter((t) => t.id !== id));
  };

  // Class & Subject CRUD
  const addClassRoom = (clsData: Omit<ClassRoom, 'id' | 'studentCount'>) => {
    const newClass: ClassRoom = {
      ...clsData,
      id: `cls_${Date.now()}`,
      studentCount: 0,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const addSubject = (subData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subData,
      id: `sub_${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  // Material Actions
  const addMaterial = (materialData: Omit<LearningMaterial, 'id' | 'completedStudentIds' | 'publishedAt'>) => {
    const newMat: LearningMaterial = {
      ...materialData,
      id: `mat_${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      completedStudentIds: [],
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  const toggleMaterialCompleted = (materialId: string, studentId: string) => {
    setMaterials((prev) =>
      prev.map((mat) => {
        if (mat.id !== materialId) return mat;
        const exists = mat.completedStudentIds.includes(studentId);
        const nextList = exists
          ? mat.completedStudentIds.filter((id) => id !== studentId)
          : [...mat.completedStudentIds, studentId];
        return { ...mat, completedStudentIds: nextList };
      })
    );
  };

  // Assignment & Grading Actions
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'publishedAt'>) => {
    const newAsg: Assignment = {
      ...assignmentData,
      id: `asg_${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const submitAssignment = (data: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    studentNis: string;
    textContent?: string;
    attachmentName?: string;
  }) => {
    const newSubm: AssignmentSubmission = {
      id: `subm_${Date.now()}`,
      assignmentId: data.assignmentId,
      studentId: data.studentId,
      studentName: data.studentName,
      studentNis: data.studentNis,
      submittedAt: new Date().toISOString(),
      textContent: data.textContent,
      attachmentName: data.attachmentName,
      status: 'submitted',
    };
    setSubmissions((prev) => [newSubm, ...prev]);
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              score,
              feedback,
              status: 'graded',
              gradedBy: currentUser?.name || 'Tutor PKBM',
              gradedAt: new Date().toISOString(),
            }
          : sub
      )
    );
  };

  // CBT Exam Actions
  const addExam = (examData: Omit<CbtExam, 'id'>) => {
    const newExam: CbtExam = {
      ...examData,
      id: `exam_${Date.now()}`,
    };
    setExams((prev) => [newExam, ...prev]);
  };

  const finishExamAttempt = (
    examId: string,
    studentId: string,
    studentName: string,
    answers: Record<string, string>
  ): ExamAttempt => {
    const exam = exams.find((e) => e.id === examId);
    let score = 0;
    let isPassed = false;

    if (exam) {
      const evaluation = evaluateCbtSubmission(exam.questions, answers);
      score = evaluation.percentage;
      isPassed = score >= exam.passingScore;
    }

    const attempt: ExamAttempt = {
      id: `attp_${Date.now()}`,
      examId,
      studentId,
      studentName,
      startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      answers,
      score,
      isPassed,
      status: 'submitted',
    };

    setExamAttempts((prev) => [attempt, ...prev]);
    return attempt;
  };

  // Attendance
  const recordAttendance = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newAtt: AttendanceRecord = {
      ...recordData,
      id: `att_${Date.now()}`,
    };
    setAttendance((prev) => [newAtt, ...prev]);
  };

  // Grades
  const updateGradeComponent = (gradeItem: GradeComponent) => {
    setGrades((prev) => {
      const idx = prev.findIndex(
        (g) => g.studentId === gradeItem.studentId && g.subjectId === gradeItem.subjectId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = gradeItem;
        return copy;
      }
      return [...prev, gradeItem];
    });
  };

  // Discussions
  const addDiscussionTopic = (data: {
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    title: string;
    content: string;
  }) => {
    const newTopic: DiscussionTopic = {
      id: `disc_${Date.now()}`,
      classId: data.classId,
      className: data.className,
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      title: data.title,
      content: data.content,
      authorId: currentUser?.id || 'anon',
      authorName: currentUser?.name || 'Warga Belajar',
      authorRole: currentUser?.role || 'student',
      createdAt: new Date().toISOString(),
      isPinned: false,
      replies: [],
    };
    setDiscussions((prev) => [newTopic, ...prev]);
  };

  const addDiscussionReply = (topicId: string, content: string) => {
    setDiscussions((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const newReply = {
          id: `rep_${Date.now()}`,
          topicId,
          authorId: currentUser?.id || 'anon',
          authorName: currentUser?.name || 'Pengguna',
          authorRole: currentUser?.role || 'student',
          content,
          createdAt: new Date().toISOString(),
        };
        return { ...t, replies: [...t.replies, newReply] };
      })
    );
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'publishedAt' | 'authorName'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann_${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      authorName: currentUser?.name || 'Administrator PKBM',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const updateSchoolProfile = (updated: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...updated }));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setTutors(INITIAL_TUTORS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setMaterials(INITIAL_MATERIALS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setExams(INITIAL_EXAMS);
    setExamAttempts([]);
    setAttendance(INITIAL_ATTENDANCE);
    setGrades(INITIAL_GRADES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setDiscussions(INITIAL_DISCUSSIONS);
    setCurrentUser(DEMO_USERS[0]);
    setActiveView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        schoolProfile,
        students,
        tutors,
        classes,
        subjects,
        materials,
        assignments,
        submissions,
        exams,
        examAttempts,
        attendance,
        grades,
        announcements,
        schedules,
        discussions,
        notifications,
        activeView,
        isDemoMode,
        isAuthenticated: !!currentUser,
        authError,
        clearAuthError,
        setActiveView,
        switchUser,
        login,
        logout,
        updateCurrentUserProfile,
        addStudent,
        updateStudent,
        deleteStudent,
        addTutor,
        updateTutor,
        deleteTutor,
        addClassRoom,
        addSubject,
        addMaterial,
        toggleMaterialCompleted,
        addAssignment,
        submitAssignment,
        gradeSubmission,
        addExam,
        finishExamAttempt,
        recordAttendance,
        updateGradeComponent,
        addDiscussionTopic,
        addDiscussionReply,
        addAnnouncement,
        updateSchoolProfile,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
