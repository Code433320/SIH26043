import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  FileCheck2,
  Handshake,
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemsToReports } from '../../lib/problemMapper';
import { useAuth } from '../../hooks/useAuth';

export default function UniversityDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [recentMatches, setRecentMatches] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    matchedProblems: 0,
    activeTeams: 0,
    solutionsSubmitted: 0,
    industryPartners: 0,
    avgTeamFormationDays: 'N/A',
  });
  const [pipeline, setPipeline] = useState({
    matched: 0,
    teamFormed: 0,
    inProgress: 0,
    submitted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;

    const loadDashboard = async () => {
      setIsLoading(true);
      setDashboardError('');

      try {
        const [problemsResponse, solutionsResponse] = await Promise.all([
          apiFetch(`/problems?university_id=${encodeURIComponent(profile.id)}`),
          apiFetch(`/solutions?university_id=${encodeURIComponent(profile.id)}`),
        ]);

        const problems = mapProblemsToReports(problemsResponse.data || []);
        const solutions = solutionsResponse.data || [];
        const activeSolutions = solutions.filter((solution) =>
          ['submitted', 'under_review', 'in_progress'].includes(solution.status)
        );
        const teamNames = new Set(
          activeSolutions.map((solution) => solution.team_name).filter(Boolean)
        );
        const pipelineCounts = {
          matched: problems.filter((problem) => ['PENDING', 'CATEGORIZED'].includes(problem.status)).length,
          teamFormed: problems.filter((problem) => problem.status === 'ASSIGNED').length,
          inProgress: problems.filter((problem) => problem.status === 'IN PROGRESS').length,
          submitted: solutions.filter((solution) => solution.status === 'submitted' || solution.status === 'completed').length,
        };

        setRecentMatches(problems.slice(0, 3));
        setDashboardStats({
          matchedProblems: problems.length,
          activeTeams: teamNames.size,
          solutionsSubmitted: solutions.length,
          industryPartners: 0,
          avgTeamFormationDays: 'N/A',
        });
        setPipeline(pipelineCounts);
      } catch (error) {
        setDashboardError(error.message || 'Could not load university dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [profile?.id]);

  const pipelineTotal = Object.values(pipeline).reduce((total, count) => total + count, 0) || 1;
  const pipelineWidth = (count) => `${(count / pipelineTotal) * 100}%`;

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD444]" />
            <span>Civic Samadhan Portal • University Collaboration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {profile?.name || 'University'}.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your matched problems and active teams.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/university/find-problems')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <Search className="w-5 h-5 text-[#006199]" />
          <span>Find New Problems</span>
        </motion.button>
      </div>

      {/* 4 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="MATCHED PROBLEMS"
          value={String(dashboardStats.matchedProblems)}
          icon={Search}
          colorTheme="sky"
          highlightText="AI Matched"
        />
        <StatCard
          label="ACTIVE TEAMS"
          value={String(dashboardStats.activeTeams)}
          icon={Users}
          colorTheme="gold"
          highlightText="In Progress"
        />
        <StatCard
          label="SOLUTIONS SUBMITTED"
          value={String(dashboardStats.solutionsSubmitted)}
          icon={FileCheck2}
          colorTheme="sky"
          highlightText="Delivered"
        />
        <StatCard
          label="INDUSTRY PARTNERS"
          value={String(dashboardStats.industryPartners)}
          icon={Handshake}
          colorTheme="lemon"
          highlightText="Collaborating"
        />
      </div>

      {/* Team Pipeline Overview */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Team Pipeline Overview</h3>
            <p className="text-xs text-slate-500">Distribution of matched problems across your teams</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">
            Avg Team Formation: {dashboardStats.avgTeamFormationDays}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full" style={{ width: pipelineWidth(pipeline.matched) }} title="Matched" />
          <div className="h-full bg-[#8ACFF8]" style={{ width: pipelineWidth(pipeline.teamFormed) }} title="Team Formed" />
          <div className="h-full bg-[#FFD444]" style={{ width: pipelineWidth(pipeline.inProgress) }} title="In Progress" />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: pipelineWidth(pipeline.submitted) }} title="Solution Submitted" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Matched ({pipeline.matched})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Team Formed ({pipeline.teamFormed})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">In Progress ({pipeline.inProgress})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Submitted ({pipeline.submitted})</span>
          </div>
        </div>
      </div>

      {/* Recently Matched Problems */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recently Matched Problems</h3>
            <p className="text-xs text-slate-500">Problems the AI engine has matched to your university</p>
          </div>
          <button
            onClick={() => navigate('/university/find-problems')}
            className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
          >
            <span>View All ({recentMatches.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading && <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading university dashboard data...</p>}
        {dashboardError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{dashboardError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentMatches.map((problem) => (
            <ReportCard
              key={problem.id}
              report={problem}
              onClick={() => navigate(`/university/problems/${problem.id}`)}
            />
          ))}
        </div>
        {!isLoading && !dashboardError && recentMatches.length === 0 && (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No problems have been matched to this university yet.</p>
        )}
      </div>

      {/* Quick Action CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8ACFF8]/30 via-white to-[#8ACFF8]/20 border border-[#8ACFF8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#006199] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <GraduationCap className="w-6 h-6 text-[#FFD444]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Ready to take on a new challenge?</h4>
            <p className="text-xs text-slate-600">
              Browse unmatched problems and form a student team to start solving.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/university/find-problems')}
          className="px-5 py-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-xs flex items-center space-x-2 shadow-md flex-shrink-0"
        >
          <Search className="w-4 h-4 text-[#006199]" />
          <span>Find Problems</span>
        </motion.button>
      </div>
    </motion.div>
  );
}