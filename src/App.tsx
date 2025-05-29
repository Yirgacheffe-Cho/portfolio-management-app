import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import { useAuthListener } from '@/hooks/auth/useAuthListener';
import { lazy, Suspense } from 'react';
import { PageSkeleton } from '@/components/common/PageSkeleton';
// ✨ lazy-load pages
const ReportPage = lazy(() => import('@/pages/report/ReportPage'));
const RecordsPage = lazy(() => import('@/pages/records/RecordsPage'));
const Templates = lazy(() => import('@/pages/Templates/Templates'));
const Login = lazy(() => import('@/pages/Login/Login'));

const App: React.FC = () => {
  useAuthListener();

  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
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
    </Router>
  );
};

export default App;
