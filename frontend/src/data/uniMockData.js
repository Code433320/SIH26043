export const UNIVERSITY_PROFILE = {
  name: "College of Engineering, Pune",
  universityId: "UNIV-COEP-0417",
  email: "civic.cell@coep.ac.in",
  city: "Pune",
  state: "Maharashtra",
  avatarUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=200&auto=format&fit=crop&q=80",
  memberSince: "August 2025"
};
 
export const UNIVERSITY_DASHBOARD_STATS = {
  matchedProblems: 8,
  activeTeams: 5,
  solutionsSubmitted: 9,
  industryPartners: 3,
  avgTeamFormationDays: "1.8"
};
 
// Shape matches citizen INITIAL_REPORTS so the existing ReportCard/StatusBadge
// components can be reused as-is — no new components needed for this list.
export const MATCHED_PROBLEMS = [
  {
    id: "CIV-2026-1048",
    title: "Large pothole near Main Road",
    category: "Road Damage",
    location: "Swargate, Pune, Maharashtra",
    submittedDate: "12 Sept 2026",
    status: "IN PROGRESS",
    priority: "HIGH",
    matchScore: 92,
    description: "Deep asphalt pothole causing severe traffic slowdowns and safety risk near Swargate Bus Terminal."
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
    description: "Residents report water supply disruptions lasting 3+ days across roughly 40 households."
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
    description: "Multiple non-functional streetlights creating safety concerns near a school zone after dark."
  }
];
 