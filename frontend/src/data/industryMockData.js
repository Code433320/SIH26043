export const INDUSTRY_PROFILE = {
  name: "Tata Consultancy Services",
  industryId: "IND-TCS-0217",
  email: "csr.partnerships@tcs.com",
  city: "Pune",
  state: "Maharashtra",
  avatarUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80",
  memberSince: "September 2025"
};

export const INDUSTRY_DASHBOARD_STATS = {
  exploredSolutions: 14,
  activeEngagements: 4,
  fundedProjects: 6,
  universityPartners: 5,
  avgResponseDays: "2.3"
};

// Shape matches citizen INITIAL_REPORTS / university MATCHED_PROBLEMS
// so the existing ReportCard/StatusBadge components can be reused as-is.
export const EXPLORABLE_SOLUTIONS = [
  {
    id: "SOL-2026-0091",
    title: "Smart Pothole Detection & Reporting System",
    category: "Road Damage",
    location: "College of Engineering, Pune",
    submittedDate: "14 Sept 2026",
    status: "IN PROGRESS",
    priority: "HIGH",
    matchScore: 89,
    description: "Computer-vision based system to auto-detect potholes from dashcam feeds and route reports to civic teams."
  },
  {
    id: "SOL-2026-0084",
    title: "IoT Water Supply Monitoring Grid",
    category: "Water Supply",
    location: "VIT, Mumbai",
    submittedDate: "10 Sept 2026",
    status: "ASSIGNED",
    priority: "MEDIUM",
    matchScore: 81,
    description: "Sensor network to detect supply irregularities in real time and alert municipal teams before shortages escalate."
  },
  {
    id: "SOL-2026-0076",
    title: "Adaptive Streetlight Energy Optimizer",
    category: "Street Light",
    location: "COEP, Pune",
    submittedDate: "1 Sept 2026",
    status: "RESOLVED",
    priority: "HIGH",
    matchScore: 94,
    description: "Motion-adaptive streetlight controller that cut energy usage while restoring coverage to school-zone blackspots."
  }
];
