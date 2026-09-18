const formatDate = (value) => {
  if (!value) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const formatStatus = (value) => {
  const normalized = String(value || 'submitted').replace(/_/g, ' ').toUpperCase();
  return normalized === 'VERIFIED' ? 'CATEGORIZED' : normalized;
};

export function mapProblemToReport(problem) {
  const status = formatStatus(problem.status);
  const submittedDate = formatDate(problem.created_at || problem.submitted_at);

  return {
    ...problem,
    id: problem.id,
    title: problem.title || 'Untitled civic problem',
    category: problem.category || 'Other',
    location: typeof problem.location === 'string'
      ? problem.location
      : problem.location?.address || 'Location unavailable',
    submittedDate,
    submittedTime: problem.created_at
      ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(new Date(problem.created_at))
      : '',
    status,
    priority: problem.priority || (problem.priority_score >= 7 ? 'HIGH' : 'MEDIUM'),
    matchScore: problem.match_score ?? problem.matchScore ?? null,
    description: problem.description || 'No description provided.',
    department: problem.department || 'Awaiting department assignment',
    assignedOfficer: problem.assigned_officer || 'Pending assignment',
    media: problem.media || [],
    timeline: problem.timeline || [],
    activityLogs: problem.activity_logs || [],
  };
}

export function mapProblemsToReports(problems = []) {
  return problems.map(mapProblemToReport);
}
