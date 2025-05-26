import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Templates from '@/pages/Templates/Templates';
import RecordsPage from '@/pages/records/RecordsPage';
import Login from '@/pages/Login/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/records/" element={<RecordsPage />} />
          <Route path="/records/:date" element={<RecordsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
