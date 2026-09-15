import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Handshake,
  TrendingUp,
  Building2,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import {
  INDUSTRY_PROFILE,
  INDUSTRY_DASHBOARD_STATS,
  EXPLORABLE_SOLUTIONS
} from '../../data/industryMockData';

export default function IndustryDashboard() {
  const navigate = useNavigate();
  const recentSolutions = EXPLORABLE_SOLUTIONS.slice(0, 3);

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
            <span>Civic Samadhan Portal • Industry Collaboration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {INDUSTRY_PROFILE.name}.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your funded projects and mentorships.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/industry/explore-solutions')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <Compass className="w-5 h-5 text-[#006199]" />
          <span>Explore Solutions</span>
        </motion.button>
      </div>

      {/* 4 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="SOLUTIONS EXPLORED"
          value={String(INDUSTRY_DASHBOARD_STATS.exploredSolutions)}
          icon={Compass}
          colorTheme="sky"
          highlightText="Browsed"
        />
        <StatCard
          label="ACTIVE ENGAGEMENTS"
          value={String(INDUSTRY_DASHBOARD_STATS.activeEngagements)}
          icon={Handshake}
          colorTheme="gold"
          highlightText="Ongoing"
        />
        <StatCard
          label="FUNDED PROJECTS"
          value={String(INDUSTRY_DASHBOARD_STATS.fundedProjects)}
          icon={Award}
          colorTheme="sky"
          highlightText="Supported"
        />
        <StatCard
          label="UNIVERSITY PARTNERS"
          value={String(INDUSTRY_DASHBOARD_STATS.universityPartners)}
          icon={Building2}
          colorTheme="lemon"
          highlightText="Collaborating"
        />
      </div>

      {/* Engagement Overview */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Engagement Overview</h3>
            <p className="text-xs text-slate-500">Distribution of your engagements by stage</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Avg Response: {INDUSTRY_DASHBOARD_STATS.avgResponseDays} Days
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full w-[20%]" title="Reviewing (20%)" />
          <div className="h-full bg-[#8ACFF8] w-[30%]" title="Mentorship Active (30%)" />
          <div className="h-full bg-[#FFD444] w-[25%]" title="Funding Committed (25%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[25%]" title="Delivered (25%)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Reviewing (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Mentorship (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Funding (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Delivered (1)</span>
          </div>
        </div>
      </div>

      {/* Solutions to Explore */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Solutions to Explore</h3>
            <p className="text-xs text-slate-500">University-built solutions open for funding or mentorship</p>
          </div>
          <button
            onClick={() => navigate('/industry/explore-solutions')}
            className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
          >
            <span>View All ({EXPLORABLE_SOLUTIONS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentSolutions.map((solution) => (
            <ReportCard
              key={solution.id}
              report={solution}
              onClick={() => navigate(`/industry/solutions/${solution.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Quick Action CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8ACFF8]/30 via-white to-[#8ACFF8]/20 border border-[#8ACFF8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#006199] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Handshake className="w-6 h-6 text-[#FFD444]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Ready to back a new solution?</h4>
            <p className="text-xs text-slate-600">
              Browse university-built solutions and offer funding or mentorship.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/industry/explore-solutions')}
          className="px-5 py-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-xs flex items-center space-x-2 shadow-md flex-shrink-0"
        >
          <Compass className="w-4 h-4 text-[#006199]" />
          <span>Explore Solutions</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
