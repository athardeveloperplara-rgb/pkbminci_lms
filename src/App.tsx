import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TutorDashboard } from './components/dashboard/TutorDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { KepalaDashboard } from './components/dashboard/KepalaDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { StudentsView } from './components/master/StudentsView';
import { TutorsView } from './components/master/TutorsView';
import { ClassesView } from './components/master/ClassesView';
import { SubjectsView } from './components/master/SubjectsView';
import { MaterialsView } from './components/learning/MaterialsView';
import { AssignmentsView } from './components/learning/AssignmentsView';
import { CbtExamView } from './components/learning/CbtExamView';
import { DiscussionsView } from './components/learning/DiscussionsView';
import { ScheduleView } from './components/academic/ScheduleView';
import { AttendanceView } from './components/academic/AttendanceView';
import { ReportCardView } from './components/academic/ReportCardView';
import { AnnouncementsView } from './components/common/AnnouncementsView';
import { ReportsView } from './components/reports/ReportsView';
import { SchoolSettingsView } from './components/admin/SchoolSettingsView';
import { DatabaseDocsView } from './components/admin/DatabaseDocsView';

const MainLayout: React.FC = () => {
  const { currentUser, activeView, setActiveView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!currentUser) {
    return <LoginView />;
  }

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'super_admin':
      case 'admin':
        return <AdminDashboard />;
      case 'tutor':
        return <TutorDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'kepala_pkbm':
        return <KepalaDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  const hasRole = (allowedRoles: string[]) => {
    return allowedRoles.includes(currentUser.role);
  };

  const renderAccessDenied = (requiredRolesText: string) => (
    <div className="rounded-2xl border border-red-200 bg-white p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm my-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <span className="text-2xl font-black">403</span>
      </div>
      <h3 className="text-lg font-bold text-slate-900">Akses Tidak Diizinkan</h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        Peran Anda saat ini (<strong>{currentUser.role.replace('_', ' ')}</strong>) tidak memiliki hak akses untuk membuka modul ini. Modul ini diperuntukkan bagi: {requiredRolesText}.
      </p>
      <div className="pt-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
        >
          Kembali ke Dashboard Saya
        </button>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardByRole();
      case 'students':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm', 'tutor'])
          ? <StudentsView />
          : renderAccessDenied('Administrator, Kepala PKBM, atau Tutor');
      case 'tutors':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm'])
          ? <TutorsView />
          : renderAccessDenied('Super Admin, Administrator, atau Kepala PKBM');
      case 'classes':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm', 'tutor'])
          ? <ClassesView />
          : renderAccessDenied('Administrator, Kepala PKBM, atau Tutor');
      case 'subjects':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm', 'tutor'])
          ? <SubjectsView />
          : renderAccessDenied('Administrator, Kepala PKBM, atau Tutor');
      case 'materials':
        return <MaterialsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'cbt_exam':
        return <CbtExamView />;
      case 'discussions':
        return <DiscussionsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'attendance':
        return <AttendanceView />;
      case 'rapor':
        return <ReportCardView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'reports':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm'])
          ? <ReportsView />
          : renderAccessDenied('Super Admin, Administrator, atau Kepala PKBM');
      case 'settings':
        return hasRole(['super_admin', 'admin', 'kepala_pkbm'])
          ? <SchoolSettingsView />
          : renderAccessDenied('Super Admin, Administrator, atau Kepala PKBM');
      case 'database_docs':
        return hasRole(['super_admin', 'admin'])
          ? <DatabaseDocsView />
          : renderAccessDenied('Super Admin atau Administrator');
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header />

      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="max-w-7xl mx-auto pb-12">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
