import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthListener } from '@/hooks/auth/useAuthListener';
import { lazy, Suspense } from 'react';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import ConfirmDialogRenderer from '@/components/common/ConfirmDialogRenderer';
import { Toaster } from 'sonner';
import { AppLayout } from '@/components/layout/AppLayout'; // ✅ 변경된 레이아웃

// ✨ lazy-load pages
const ReportPage = lazy(() => import('@/pages/report/ReportPage'));
const RecordsPage = lazy(() => import('@/pages/records/RecordsPage'));
const Templates = lazy(() => import('@/pages/Templates/Templates'));
const Login = lazy(() => import('@pages/login/LoginPage'));

const App: React.FC = () => {
  useAuthListener();

  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records"
              element={
                <ProtectedRoute>
                  <RecordsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/:date"
              element={
                <ProtectedRoute>
                  <RecordsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
      <ConfirmDialogRenderer />
    </Router>
  );
};

export default App;
