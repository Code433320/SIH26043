export const CITIZEN_PROFILE = {
  name: "Pruthviraj Deshmukh",
  citizenId: "CIT-IND-994201",
  email: "p.deshmukh@pune.gov.in",
  phone: "+91 98230 44109",
  address: "Flat 402, Shivajinagar Heights, FC Road",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411005",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  memberSince: "August 2025",
  reportsSubmitted: 12,
  resolutionRate: "87.5%",
  notificationPrefs: {
    email: true,
    sms: true,
    inApp: true,
    statusUpdates: true,
    resolutionUpdates: true,
    departmentUpdates: false
  }
};

export const DASHBOARD_STATS = {
  totalReports: 12,
  inProgress: 4,
  resolved: 7,
  pending: 1,
  categorized: 11,
  avgResolutionDays: 2.4
};

export const CATEGORIES = [
  { id: 'road', name: 'Road Damage', icon: 'Construction', color: '#006199' },
  { id: 'garbage', name: 'Garbage / Waste', icon: 'Trash2', color: '#006199' },
  { id: 'water', name: 'Water Supply', icon: 'Droplets', color: '#006199' },
  { id: 'light', name: 'Street Light', icon: 'Lightbulb', color: '#006199' },
  { id: 'drainage', name: 'Drainage', icon: 'Waves', color: '#006199' },
  { id: 'sanitation', name: 'Sanitation', icon: 'Sparkles', color: '#006199' },
  { id: 'infra', name: 'Public Infrastructure', icon: 'Building2', color: '#006199' },
  { id: 'other', name: 'Other', icon: 'HelpCircle', color: '#006199' }
];

export const INITIAL_REPORTS = [
  {
    id: "CIV-2026-1048",
    title: "Large pothole near Main Road",
    category: "Road Damage",
    categoryId: "road",
    location: "Main Road, Swargate, Pune, Maharashtra",
    landmark: "Near Swargate Bus Terminal, Gate #2",
    submittedDate: "12 Sept 2026",
    submittedTime: "10:32 AM",
    lastUpdated: "14 Sept 2026, 04:15 PM",
    status: "IN PROGRESS",
    priority: "HIGH",
    department: "PMC Road & Bridge Maintenance Dept",
    assignedOfficer: "Eng. Rajesh K. Patil (Zone 4)",
    estimatedResolution: "16 Sept 2026",
    description: "Deep asphalt pothole approximately 3.5 ft wide and 5 inches deep causing severe traffic slowdowns and posing life-threatening risks to two-wheelers during evening peak hours.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop', title: 'Road damage evidence photo' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop', title: 'Pothole depth close-up' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '12 Sept 2026, 10:32 AM', status: 'completed', desc: 'Report submitted by citizen with GPS location tag.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '12 Sept 2026, 11:05 AM', status: 'completed', desc: 'AI triage categorized priority as HIGH under Road Damage.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: '12 Sept 2026, 02:20 PM', status: 'completed', desc: 'Dispatched to Zone 4 Road Maintenance Cell under Eng. R. K. Patil.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: '14 Sept 2026, 09:30 AM', status: 'active', desc: 'On-site excavation completed. Cold-mix asphalt filling underway.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: 'Target: 16 Sept 2026', status: 'upcoming', desc: 'Final quality inspection & site clearance approval.' }
    ],
    activityLogs: [
      { id: 1, date: '14 Sept 2026', time: '04:15 PM', text: 'Asphalt mixing truck & compaction roller deployed at Swargate site.', author: 'Site Supervisor' },
      { id: 2, date: '14 Sept 2026', time: '09:30 AM', text: 'Inspection team reviewed location and closed outer traffic lane.', author: 'Eng. R. K. Patil' },
      { id: 3, date: '13 Sept 2026', time: '02:00 PM', text: 'Work Order #PMC-WO-8821 issued for bituminous pavement repair.', author: 'Ward Executive Office' },
      { id: 4, date: '12 Sept 2026', time: '02:20 PM', text: 'Municipal department assigned the case to Zone 4 Cell.', author: 'PMC Central Dispatch' },
      { id: 5, date: '12 Sept 2026', time: '11:05 AM', text: 'Report validated and classified as High Priority.', author: 'Civic AI Engine' },
      { id: 6, date: '12 Sept 2026', time: '10:32 AM', text: 'Problem report created successfully.', author: 'System' }
    ]
  },
  {
    id: "CIV-2026-1042",
    title: "Street light not working",
    category: "Public Infrastructure",
    categoryId: "infra",
    location: "Kothrud, Pune, Maharashtra",
    landmark: "Opposite Ideal Colony Signal, DP Road",
    submittedDate: "11 Sept 2026",
    submittedTime: "08:45 PM",
    lastUpdated: "13 Sept 2026, 11:30 AM",
    status: "IN PROGRESS",
    priority: "MEDIUM",
    department: "PMC Electrical & Street Lighting Cell",
    assignedOfficer: "Eng. Suresh Deshpande",
    estimatedResolution: "15 Sept 2026",
    description: "Three consecutive 120W LED streetlights are dark along DP Road. Dark stretch creates safety concerns for commuters.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop', title: 'Unlit street light pole' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '11 Sept 2026, 08:45 PM', status: 'completed', desc: 'Issue logged.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '12 Sept 2026, 09:15 AM', status: 'completed', desc: 'Categorized under Electrical Infrastructure.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: '12 Sept 2026, 11:00 AM', status: 'completed', desc: 'Assigned to Kothrud Electrical Division.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: '13 Sept 2026, 11:30 AM', status: 'active', desc: 'Faulty feeder pillar fuse replacement scheduled.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: 'Pending', status: 'upcoming', desc: 'Verification & light test.' }
    ],
    activityLogs: [
      { id: 1, date: '13 Sept 2026', time: '11:30 AM', text: 'Technician dispatched for cable line diagnosis.', author: 'Electrical Cell' },
      { id: 2, date: '12 Sept 2026', time: '11:00 AM', text: 'Case routed to Kothrud Divisional Office.', author: 'PMC Electrical' }
    ]
  },
  {
    id: "CIV-2026-1035",
    title: "Garbage accumulation near residential area",
    category: "Garbage / Waste",
    categoryId: "garbage",
    location: "Baner Road, Pune, Maharashtra",
    landmark: "Pancard Club Road Junction, Sector 3",
    submittedDate: "08 Sept 2026",
    submittedTime: "07:15 AM",
    lastUpdated: "10 Sept 2026, 05:00 PM",
    status: "RESOLVED",
    priority: "HIGH",
    department: "PMC Solid Waste Management Department",
    assignedOfficer: "Sanitation Inspector V. B. Jadhav",
    estimatedResolution: "10 Sept 2026",
    description: "Uncollected solid waste accumulating near community collection container, blocking pedestrian walkway.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop', title: 'Cleaned up community bin zone' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '08 Sept 2026, 07:15 AM', status: 'completed', desc: 'Report logged.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '08 Sept 2026, 08:30 AM', status: 'completed', desc: 'Routed to Waste Mgmt.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: '08 Sept 2026, 10:00 AM', status: 'completed', desc: 'Inspector V. B. Jadhav assigned.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: '09 Sept 2026, 06:00 AM', status: 'completed', desc: 'Compactor vehicle deployed.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: '10 Sept 2026, 05:00 PM', status: 'completed', desc: 'Waste cleared & area sanitized with lime powder.' }
    ],
    activityLogs: [
      { id: 1, date: '10 Sept 2026', time: '05:00 PM', text: 'Waste fully cleared. Sanitation certificate verified.', author: 'Inspector V. B. Jadhav' },
      { id: 2, date: '09 Sept 2026', time: '06:00 AM', text: 'Hydraulic loader cleared 1.8 tons of accumulated debris.', author: 'Solid Waste Team' }
    ]
  },
  {
    id: "CIV-2026-1029",
    title: "Blocked drainage near primary school",
    category: "Drainage",
    categoryId: "drainage",
    location: "Hadapsar, Pune, Maharashtra",
    landmark: "Near Zilla Parishad Primary School",
    submittedDate: "05 Sept 2026",
    submittedTime: "02:20 PM",
    lastUpdated: "07 Sept 2026, 03:40 PM",
    status: "RESOLVED",
    priority: "HIGH",
    department: "PMC Drainage & Storm Water Cell",
    assignedOfficer: "Eng. Milind Shinde",
    estimatedResolution: "07 Sept 2026",
    description: "Stormwater drain inlet clogged with silt and plastic waste causing waterlogging in front of school entrance.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop', title: 'Drain cleaning work' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '05 Sept 2026, 02:20 PM', status: 'completed', desc: 'Issue reported.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '05 Sept 2026, 03:00 PM', status: 'completed', desc: 'High priority drainage tag.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: '06 Sept 2026, 09:00 AM', status: 'completed', desc: 'Hadapsar ward team assigned.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: '06 Sept 2026, 02:00 PM', status: 'completed', desc: 'Suction jet machine deployed.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: '07 Sept 2026, 03:40 PM', status: 'completed', desc: 'Drainage line flushed & clear flow verified.' }
    ],
    activityLogs: [
      { id: 1, date: '07 Sept 2026', time: '03:40 PM', text: 'High pressure jetting machine cleared blockage. Water level restored to zero.', author: 'Drainage Cell' }
    ]
  },
  {
    id: "CIV-2026-1018",
    title: "Water leakage near public road",
    category: "Water Supply",
    categoryId: "water",
    location: "Aundh, Pune, Maharashtra",
    landmark: "IT Park Road, near ICICI Bank ATM",
    submittedDate: "01 Sept 2026",
    submittedTime: "09:10 AM",
    lastUpdated: "03 Sept 2026, 01:15 PM",
    status: "RESOLVED",
    priority: "MEDIUM",
    department: "PMC Water Works Department",
    assignedOfficer: "Eng. Pramod Kulkarni",
    estimatedResolution: "03 Sept 2026",
    description: "Clean water leaking continuously from underground 6-inch pipeline joint, accumulating on motorable road.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop', title: 'Repaired water line' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '01 Sept 2026, 09:10 AM', status: 'completed', desc: 'Report submitted.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '01 Sept 2026, 10:00 AM', status: 'completed', desc: 'Water supply tag.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: '01 Sept 2026, 01:30 PM', status: 'completed', desc: 'Aundh Maintenance Squad.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: '02 Sept 2026, 10:00 AM', status: 'completed', desc: 'Pipe clamp welding.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: '03 Sept 2026, 01:15 PM', status: 'completed', desc: 'Joint clamp installed and pressure tested.' }
    ],
    activityLogs: [
      { id: 1, date: '03 Sept 2026', time: '01:15 PM', text: 'Leakage sealed with stainless steel repair sleeve. Road reinstated.', author: 'Water Department' }
    ]
  },
  {
    id: "CIV-2026-1051",
    title: "Damaged footpath near bus stop",
    category: "Public Infrastructure",
    categoryId: "infra",
    location: "FC Road, Pune, Maharashtra",
    landmark: "Goodluck Chowk Bus Stop",
    submittedDate: "14 Sept 2026",
    submittedTime: "06:10 PM",
    lastUpdated: "14 Sept 2026, 06:10 PM",
    status: "PENDING",
    priority: "MEDIUM",
    department: "PMC Urban Footpath & Pedestrian Cell",
    assignedOfficer: "Pending Assignment",
    estimatedResolution: "18 Sept 2026",
    description: "Broken paver blocks on pedestrian walkway creating tripping hazard for senior citizens boarding city buses.",
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop', title: 'Damaged paver blocks' }
    ],
    timeline: [
      { stage: 'SUBMITTED', label: '01 SUBMITTED', timestamp: '14 Sept 2026, 06:10 PM', status: 'completed', desc: 'Report logged by citizen.' },
      { stage: 'CATEGORIZED', label: '02 CATEGORIZED', timestamp: '14 Sept 2026, 06:15 PM', status: 'completed', desc: 'Categorized under Footpath Infrastructure.' },
      { stage: 'ASSIGNED', label: '03 ASSIGNED', timestamp: 'Awaiting ward dispatch', status: 'active', desc: 'Queued for officer assignment.' },
      { stage: 'IN_PROGRESS', label: '04 IN PROGRESS', timestamp: 'Pending', status: 'upcoming', desc: 'Paver block replacement.' },
      { stage: 'RESOLVED', label: '05 RESOLVED', timestamp: 'Pending', status: 'upcoming', desc: 'Site verification.' }
    ],
    activityLogs: [
      { id: 1, date: '14 Sept 2026', time: '06:15 PM', text: 'Report received and queued for Ward 8 engineer assignment.', author: 'PMC System' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    reportId: "CIV-2026-1048",
    title: "Heavy machinery deployed on your report",
    message: "PMC Road Maintenance team deployed an asphalt mixing truck at Main Road, Swargate.",
    timestamp: "14 Sept 2026, 04:15 PM",
    read: false,
    category: "IN_PROGRESS",
    icon: "Truck"
  },
  {
    id: "NOTIF-102",
    reportId: "CIV-2026-1048",
    title: "Report Status Updated to IN PROGRESS",
    message: "Your report CIV-2026-1048 'Large pothole near Main Road' is now actively being repaired.",
    timestamp: "14 Sept 2026, 09:30 AM",
    read: false,
    category: "IN_PROGRESS",
    icon: "Activity"
  },
  {
    id: "NOTIF-103",
    reportId: "CIV-2026-1042",
    title: "Technician assigned to DP Road street light issue",
    message: "Engineer Suresh Deshpande has been assigned to investigate report CIV-2026-1042.",
    timestamp: "12 Sept 2026, 11:00 AM",
    read: true,
    category: "ASSIGNED",
    icon: "UserCheck"
  },
  {
    id: "NOTIF-104",
    reportId: "CIV-2026-1035",
    title: "Report CIV-2026-1035 Marked as RESOLVED",
    message: "Garbage accumulation at Baner Road has been cleared and sanitized. Tap to review verification photo.",
    timestamp: "10 Sept 2026, 05:00 PM",
    read: true,
    category: "RESOLVED",
    icon: "CheckCircle2"
  }
];
