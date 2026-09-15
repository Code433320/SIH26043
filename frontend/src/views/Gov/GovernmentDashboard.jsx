import React from 'react';
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
import {
  GOVERNMENT_PROFILE,
  GOVERNMENT_DASHBOARD_STATS,
  MONITORED_PROJECTS
} from '../../data/governmentMockData';

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const recentProjects = MONITORED_PROJECTS.slice(0, 3);

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
            Welcome back, {GOVERNMENT_PROFILE.name}.
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
          value={String(GOVERNMENT_DASHBOARD_STATS.problemsVerified)}
          icon={ClipboardCheck}
          colorTheme="sky"
          highlightText="Confirmed"
        />
        <StatCard
          label="PROJECTS MONITORED"
          value={String(GOVERNMENT_DASHBOARD_STATS.projectsMonitored)}
          icon={BarChart3}
          colorTheme="gold"
          highlightText="Tracking"
        />
        <StatCard
          label="POLICY REPORTS"
          value={String(GOVERNMENT_DASHBOARD_STATS.policyReportsGenerated)}
          icon={FileBarChart2}
          colorTheme="sky"
          highlightText="Generated"
        />
        <StatCard
          label="PARTNERED UNIVERSITIES"
          value={String(GOVERNMENT_DASHBOARD_STATS.partneredUniversities)}
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
            Avg Verification: {GOVERNMENT_DASHBOARD_STATS.avgVerificationDays} Days
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full w-[20%]" title="Pending Verification (20%)" />
          <div className="h-full bg-[#8ACFF8] w-[30%]" title="Verified (30%)" />
          <div className="h-full bg-[#FFD444] w-[30%]" title="Monitoring (30%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[20%]" title="Resolved (20%)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Pending (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Verified (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Monitoring (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolved (1)</span>
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
            <span>View All ({MONITORED_PROJECTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

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
