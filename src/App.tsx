import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Templates from '@/pages/Templates/Templates';
import MonthlyList from '@/pages/MonthlyList/MonthlyList';
import Login from '@/pages/Login/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="templates" element={<Templates />} />
          <Route path="monthly-list" element={<MonthlyList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
