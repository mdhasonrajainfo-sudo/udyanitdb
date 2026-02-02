
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './store';
import { LandingPage, LoginPage, RegisterPage, SupportPage } from './pages/LandingAuth';
import { 
    UserDashboard, WalletPage, FreeJobPage, PremiumPage, QuizPage, 
    TaskListPage, TeamPage, UserProfilePage, NotificationsPage, 
    IncomeHistoryPage, WorkVideoPage, JobWithdrawPage, PremiumFormPage,
    ToastProvider 
} from './pages/UserApp';
import { AdminDashboard } from './pages/AdminApp';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <ToastProvider>
        <HashRouter>
            <Routes>
            {/* Public Routes - Landing Page is Default */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* User Routes */}
            <Route path="/user/home" element={<UserDashboard />} />
            <Route path="/user/wallet" element={<WalletPage />} />
            <Route path="/user/free-job" element={<FreeJobPage />} />
            <Route path="/user/tasks" element={<TaskListPage />} />
            <Route path="/user/quiz" element={<QuizPage />} />
            <Route path="/user/team" element={<TeamPage />} />
            <Route path="/user/premium" element={<PremiumPage />} />
            <Route path="/user/premium-form" element={<PremiumFormPage />} />
            <Route path="/user/profile" element={<UserProfilePage />} />
            <Route path="/user/notifications" element={<NotificationsPage />} />
            <Route path="/user/income-history" element={<IncomeHistoryPage />} />
            <Route path="/user/work-video" element={<WorkVideoPage />} />
            <Route path="/user/job-withdraw" element={<JobWithdrawPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Force any unknown route to go to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
};

export default App;
