import React, { useEffect, useState } from 'react';
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
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';

const mapSolution = (solution) => ({
  ...solution,
  category: solution.category || 'Civic Innovation',
  location: solution.team_name || 'University team',
  submittedDate: solution.created_at
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(solution.created_at))
    : 'Recently',
  status: String(solution.status || 'submitted').replace(/_/g, ' ').toUpperCase(),
});

export default function IndustryDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [solutions, setSolutions] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiFetch('/solutions'), apiFetch('/engagements')])
      .then(([solutionsResponse, engagementsResponse]) => {
        setSolutions((solutionsResponse.data || []).map(mapSolution));
        setEngagements(engagementsResponse.data || []);
      })
      .catch((loadError) => setError(loadError.message || 'Could not load industry dashboard data.'));
  }, []);

  const recentSolutions = solutions.slice(0, 3);
  const activeEngagements = engagements.filter((item) => ['pending', 'active'].includes(item.status));
  const fundedProjects = engagements.filter((item) => item.type === 'funding' && item.status !== 'rejected');
  const universityPartners = new Set(solutions.map((solution) => solution.university_id).filter(Boolean));
  const engagementTotal = engagements.length || 1;
  const stageCounts = {
    reviewing: engagements.filter((item) => item.status === 'pending').length,
    active: engagements.filter((item) => item.status === 'active' && item.type === 'mentorship').length,
    funding: engagements.filter((item) => item.status === 'active' && item.type === 'funding').length,
    delivered: engagements.filter((item) => item.status === 'completed').length,
  };

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
            Welcome back, {profile?.name || 'Industry Partner'}.
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
          value={String(solutions.length)}
          icon={Compass}
          colorTheme="sky"
          highlightText="Browsed"
        />
        <StatCard
          label="ACTIVE ENGAGEMENTS"
          value={String(activeEngagements.length)}
          icon={Handshake}
          colorTheme="gold"
          highlightText="Ongoing"
        />
        <StatCard
          label="FUNDED PROJECTS"
          value={String(fundedProjects.length)}
          icon={Award}
          colorTheme="sky"
          highlightText="Supported"
        />
        <StatCard
          label="UNIVERSITY PARTNERS"
          value={String(universityPartners.size)}
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
            Avg Response: N/A
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full" style={{ width: `${(stageCounts.reviewing / engagementTotal) * 100}%` }} title="Reviewing" />
          <div className="h-full bg-[#8ACFF8]" style={{ width: `${(stageCounts.active / engagementTotal) * 100}%` }} title="Mentorship Active" />
          <div className="h-full bg-[#FFD444]" style={{ width: `${(stageCounts.funding / engagementTotal) * 100}%` }} title="Funding Committed" />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: `${(stageCounts.delivered / engagementTotal) * 100}%` }} title="Delivered" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Reviewing ({stageCounts.reviewing})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Mentorship ({stageCounts.active})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Funding ({stageCounts.funding})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Delivered ({stageCounts.delivered})</span>
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
            <span>View All ({solutions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!error && recentSolutions.length === 0 && <p className="mb-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No live solutions are available yet.</p>}
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
