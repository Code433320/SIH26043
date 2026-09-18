import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  BarChart3,
  FileBarChart2,
  Building,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemsToReports } from '../../lib/problemMapper';
import { useAuth } from '../../hooks/useAuth';

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiFetch('/problems'), apiFetch('/solutions')])
      .then(([problemsResponse, solutionsResponse]) => {
        setProjects(mapProblemsToReports(problemsResponse.data || []));
        setSolutions(solutionsResponse.data || []);
      })
      .catch((loadError) => setError(loadError.message || 'Could not load government dashboard data.'));
  }, []);

  const verifiedCount = projects.filter((project) => ['CATEGORIZED', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'].includes(project.status)).length;
  const monitoredCount = solutions.filter((solution) => ['under_review', 'in_progress'].includes(solution.status)).length;
  const resolvedCount = projects.filter((project) => project.status === 'RESOLVED').length;
  const partneredUniversities = new Set(solutions.map((solution) => solution.university_id).filter(Boolean)).size;
  const statusCounts = {
    pending: projects.filter((project) => ['SUBMITTED', 'PENDING'].includes(project.status)).length,
    verified: projects.filter((project) => project.status === 'CATEGORIZED').length,
    monitoring: projects.filter((project) => ['ASSIGNED', 'IN PROGRESS'].includes(project.status)).length,
    resolved: resolvedCount,
  };
  const statusTotal = projects.length || 1;
  const recentProjects = projects.slice(0, 3);

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
            <span>Civic Samadhan Portal • Government Oversight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {profile?.name || 'Government Partner'}.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's an overview of problem verification and project monitoring.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/government/verify-problems')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <ClipboardCheck className="w-5 h-5 text-[#006199]" />
          <span>Verify Problems</span>
        </motion.button>
      </div>

      {/* 4 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="PROBLEMS VERIFIED"
          value={String(verifiedCount)}
          icon={ClipboardCheck}
          colorTheme="sky"
          highlightText="Confirmed"
        />
        <StatCard
          label="PROJECTS MONITORED"
          value={String(monitoredCount)}
          icon={BarChart3}
          colorTheme="gold"
          highlightText="Tracking"
        />
        <StatCard
          label="POLICY REPORTS"
          value={String(solutions.length)}
          icon={FileBarChart2}
          colorTheme="sky"
          highlightText="Generated"
        />
        <StatCard
          label="PARTNERED UNIVERSITIES"
          value={String(partneredUniversities)}
          icon={Building}
          colorTheme="lemon"
          highlightText="Collaborating"
        />
      </div>

      {/* Verification & Monitoring Overview */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verification & Monitoring Overview</h3>
            <p className="text-xs text-slate-500">Distribution of monitored projects by stage</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Avg Verification: N/A
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full" style={{ width: `${(statusCounts.pending / statusTotal) * 100}%` }} title="Pending Verification" />
          <div className="h-full bg-[#8ACFF8]" style={{ width: `${(statusCounts.verified / statusTotal) * 100}%` }} title="Verified" />
          <div className="h-full bg-[#FFD444]" style={{ width: `${(statusCounts.monitoring / statusTotal) * 100}%` }} title="Monitoring" />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: `${(statusCounts.resolved / statusTotal) * 100}%` }} title="Resolved" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Pending ({statusCounts.pending})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Verified ({statusCounts.verified})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Monitoring ({statusCounts.monitoring})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolved ({statusCounts.resolved})</span>
          </div>
        </div>
      </div>

      {/* Monitored Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recently Monitored Projects</h3>
            <p className="text-xs text-slate-500">Problems and solutions currently under departmental oversight</p>
          </div>
          <button
            onClick={() => navigate('/government/monitor-projects')}
            className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!error && recentProjects.length === 0 && <p className="mb-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No live projects are available yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
            <ReportCard
              key={project.id}
              report={project}
              onClick={() => navigate(`/government/projects/${project.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Quick Action CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8ACFF8]/30 via-white to-[#8ACFF8]/20 border border-[#8ACFF8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#006199] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <ClipboardCheck className="w-6 h-6 text-[#FFD444]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Problems waiting on verification</h4>
            <p className="text-xs text-slate-600">
              Review newly submitted problems to confirm authenticity before they're matched.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/government/verify-problems')}
          className="px-5 py-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-xs flex items-center space-x-2 shadow-md flex-shrink-0"
        >
          <ClipboardCheck className="w-4 h-4 text-[#006199]" />
          <span>Verify Problems</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
