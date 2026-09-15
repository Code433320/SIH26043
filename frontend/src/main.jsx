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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);