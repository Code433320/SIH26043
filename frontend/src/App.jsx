import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './hooks/ProtectedRoute';
import LandingPage from './views/LandingPage';
import DashboardApp from './views/DashboardApp';
import AuthPage from './views/AuthPage';

import UniversityLayout from './views/University/Universitylayout.jsx';
import UniversityDashboard from './views/University/UniversityDashboard.jsx';
import FindProblems from './views/University/FindProblems.jsx';
import MyProjects from './views/University/MyProjects.jsx';
import UniversityProfile from './views/University/UniversityProfile.jsx';
import ProblemPreview from './views/University/ProblemPreview.jsx';

import IndustryLayout from './views/Industry/IndustryLayout.jsx';
import IndustryDashboard from './views/Industry/IndustryDashboard.jsx';
import ExploreSolutions from './views/Industry/ExploreSolutions.jsx';
import MyEngagements from './views/Industry/MyEngagements.jsx';
import IndustryProfile from './views/Industry/IndustryProfile.jsx';
import SolutionPreview from './views/Industry/SolutionPreview.jsx';

import GovernmentLayout from './views/Gov/GovernmentLayout.jsx';
import GovernmentDashboard from './views/Gov/GovernmentDashboard.jsx';
import VerifyProblems from './views/Gov/VerifyProblems.jsx';
import MonitorProjects from './views/Gov/MonitorProjects.jsx';
import GovernmentProfile from './views/Gov/GovernmentProfile.jsx';
import ProjectPreview from './views/Gov/ProjectPreview.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />

      <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
        <Route path="/app" element={<DashboardApp />} />
        <Route path="/citizen" element={<DashboardApp />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['university']} />}>
        <Route path="/university" element={<UniversityLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UniversityDashboard />} />
          <Route path="find-problems" element={<FindProblems />} />
          <Route path="my-projects" element={<MyProjects />} />
          <Route path="profile" element={<UniversityProfile />} />
          <Route path="problems/:problemId" element={<ProblemPreview />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['industry', 'ngo']} />}>
        <Route path="/industry" element={<IndustryLayout />}>
          <Route index element={<IndustryDashboard />} />
          <Route path="dashboard" element={<IndustryDashboard />} />
          <Route path="explore-solutions" element={<ExploreSolutions />} />
          <Route path="my-engagements" element={<MyEngagements />} />
          <Route path="profile" element={<IndustryProfile />} />
          <Route path="solutions/:solutionId" element={<SolutionPreview />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['government']} />}>
        <Route path="/government" element={<GovernmentLayout />}>
          <Route index element={<GovernmentDashboard />} />
          <Route path="dashboard" element={<GovernmentDashboard />} />
          <Route path="verify-problems" element={<VerifyProblems />} />
          <Route path="monitor-projects" element={<MonitorProjects />} />
          <Route path="profile" element={<GovernmentProfile />} />
          <Route path="projects/:projectId" element={<ProjectPreview />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
