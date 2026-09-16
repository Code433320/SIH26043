import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import DashboardApp from './views/DashboardApp';
import AuthPage from './views/AuthPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/app" element={<DashboardApp />} />
      <Route path="/citizen" element={<DashboardApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
