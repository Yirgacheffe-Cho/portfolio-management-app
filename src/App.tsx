import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import MainLayout from '@/layouts/MainLayout';
import ReportPage from '@/pages/report/ReportPage';
import Templates from '@/pages/Templates/Templates';
import RecordsPage from '@/pages/records/RecordsPage';
import Login from '@/pages/Login/Login';
import { useAuthListener } from '@/hooks/auth/useAuthListener';

const App: React.FC = () => {
  useAuthListener(); // ✅ authAtom 상태 초기화용
  return (
    <Router>
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
    </Router>
  );
};

export default App;
