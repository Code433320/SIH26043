import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import App from "./App.jsx";

// University portal
import UniversityLayout from "./views/University/Universitylayout.jsx";
import UniversityDashboard from "./views/University/UniversityDashboard.jsx";
import FindProblems from "./views/University/FindProblems.jsx";
import MyProjects from "./views/University/MyProjects.jsx";
import UniversityProfile from "./views/University/UniversityProfile.jsx";
import ProblemPreview from "./views/University/ProblemPreview.jsx";

// Industry portal
import IndustryLayout from "./views/Industry/IndustryLayout.jsx";
import IndustryDashboard from "./views/Industry/IndustryDashboard.jsx";
import ExploreSolutions from "./views/Industry/ExploreSolutions.jsx";
import MyEngagements from "./views/Industry/MyEngagements.jsx";
import IndustryProfile from "./views/Industry/IndustryProfile.jsx";
import SolutionPreview from "./views/Industry/SolutionPreview.jsx";

// Gov Portal
import GovernmentLayout from "./views/Gov/GovernmentLayout.jsx";
import GovernmentDashboard from "./views/Gov/GovernmentDashboard.jsx";
import VerifyProblems from "./views/Gov/VerifyProblems.jsx";
import MonitorProjects from "./views/Gov/MonitorProjects.jsx";
import GovernmentProfile from "./views/Gov/GovernmentProfile.jsx";
import ProjectPreview from "./views/Gov/ProjectPreview.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
