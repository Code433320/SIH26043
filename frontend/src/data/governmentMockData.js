export const GOVERNMENT_PROFILE = {
  name: "Pune Municipal Corporation",
  departmentId: "GOV-PMC-0113",
  email: "digitalgov@punecorp.gov.in",
  city: "Pune",
  state: "Maharashtra",
  avatarUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200&auto=format&fit=crop&q=80",
  memberSince: "July 2025"
};

export const GOVERNMENT_DASHBOARD_STATS = {
  problemsVerified: 21,
  projectsMonitored: 12,
  policyReportsGenerated: 4,
  partneredUniversities: 7,
  avgVerificationDays: "1.2"
};

// Shape matches citizen INITIAL_REPORTS / university MATCHED_PROBLEMS
// so the existing ReportCard/StatusBadge components can be reused as-is.
export const MONITORED_PROJECTS = [
  {
    id: "CIV-2026-1048",
    title: "Large pothole near Main Road",
    category: "Road Damage",
    location: "Swargate, Pune, Maharashtra",
    submittedDate: "12 Sept 2026",
    status: "IN PROGRESS",
    priority: "HIGH",
    matchScore: 92,
    description: "University team deploying computer-vision pothole detection; awaiting verification of pilot results before scale-up."
  },
  {
    id: "CIV-2026-1032",
    title: "Irregular water supply in Sector 5",
    category: "Water Supply",
    location: "Sector 5, Hadapsar, Pune",
    submittedDate: "9 Sept 2026",
    status: "ASSIGNED",
    priority: "MEDIUM",
    matchScore: 87,
    description: "Reported by 40+ households, matched to VIT Mumbai; pending departmental verification of complaint authenticity."
  },
  {
    id: "CIV-2026-1021",
    title: "Broken streetlights near school zone",
    category: "Street Light",
    location: "FC Road, Shivajinagar, Pune",
    submittedDate: "3 Sept 2026",
    status: "RESOLVED",
    priority: "HIGH",
    matchScore: 95,
    description: "Solution deployed and verified on-site; energy savings and safety improvement confirmed by field inspection."
  }
];
