import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import App from "./App";

// University portal
import UniversityLayout from "./views/University/Universitylayout.jsx";
import UniversityDashboard from "./views/University/UniversityDashboard.jsx";
import FindProblems from "./views/University/FindProblems.jsx";
import MyProjects from "./views/University/MyProjects.jsx";
import UniversityProfile from "./views/University/UniversityProfile.jsx";
import ProblemPreview from "./views/University/ProblemPreview.jsx";

//Industry portal
import IndustryLayout from './views/Industry/IndustryLayout.jsx'
import IndustryDashboard from './views/Industry/IndustryDashboard.jsx'
import ExploreSolutions from './views/Industry/ExploreSolutions.jsx'
import MyEngagements from './views/Industry/MyEngagements.jsx'
import IndustryProfile from './views/Industry/IndustryProfile.jsx'
import SolutionPreview from './views/Industry/SolutionPreview.jsx'

//Gov Portal
import GovernmentLayout from './views/Gov/GovernmentLayout.jsx'
import GovernmentDashboard from './views/gov/GovernmentDashboard.jsx'
import VerifyProblems from './views/Gov/VerifyProblems.jsx'
import MonitorProjects from './views/Gov/MonitorProjects.jsx'
import GovernmentProfile from './views/Gov/GovernmentProfile.jsx'
import ProjectPreview from './views/Gov/ProjectPreview.jsx'

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* University Portal */}
        <Route
          path="/university"
          element={<UniversityLayout />}
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<UniversityDashboard />}
          />

          <Route
            path="find-problems"
            element={<FindProblems />}
          />

          <Route
            path="my-projects"
            element={<MyProjects />}
          />

          <Route
            path="problems/:problemId"
            element={<ProblemPreview />}
          />

          <Route
            path="profile"
            element={<UniversityProfile />}
          />
        </Route>

        {/* Citizen Portal */}
        <Route
          path="/*"
          element={<App />}
        />
        
      
        
      <Route path="/industry" element={<IndustryLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<IndustryDashboard />} />
            <Route path="explore-solutions" element={<ExploreSolutions />} />
            <Route path="my-engagements" element={<MyEngagements />} />
            <Route path="solutions/:solutionId" element={<SolutionPreview />} />
            <Route path="profile" element={<IndustryProfile />} />
          </Route>

        <Route path="/government" element={<GovernmentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GovernmentDashboard />} />
          <Route path="verify-problems" element={<VerifyProblems />} />
          <Route path="monitor-projects" element={<MonitorProjects />} />
          <Route path="projects/:projectId" element={<ProjectPreview />} />
          <Route path="profile" element={<GovernmentProfile />} />
        </Route>
          </Routes>
    </BrowserRouter>
  </StrictMode>
);