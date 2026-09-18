import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowRight,
  Filter,
  Users,
  Star,
  BriefcaseBusiness,
  ShieldCheck
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import ReportCard from '../../components/ReportCard';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemsToReports } from '../../lib/problemMapper';

const FILTERS = ['All', 'Road Damage', 'Water Supply', 'Drainage', 'Waste Management', 'Street Light', 'Sanitation'];

export default function FindProblems() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const highPriorityCount = problems.filter((problem) => problem.priority === 'HIGH').length;

  useEffect(() => {
    apiFetch('/problems')
      .then((response) => setProblems(mapProblemsToReports(response.data || [])))
      .catch((loadError) => setError(loadError.message || 'Could not load civic problems.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesSearch =
        problem.title.toLowerCase().includes(query.toLowerCase()) ||
        problem.location.toLowerCase().includes(query.toLowerCase()) ||
        problem.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [problems, selectedCategory, query]);

  const featuredProblem = filteredProblems[0];

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.08 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD444]" />
            <span>Civic Samadhan Portal • Problem Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discover New Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse civic issues matched to your institution and identify the best-fit projects for student teams.
          </p>
        </div>

        <button
          onClick={() => navigate('/university/my-projects')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <BriefcaseBusiness className="w-5 h-5 text-[#006199]" />
          <span>View My Projects</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MATCHED ISSUES" value={String(problems.length)} icon={Search} colorTheme="sky" highlightText="AI Matched" />
        <StatCard label="ACTIVE FILTERS" value={String(selectedCategory === 'All' ? 0 : 1)} icon={Filter} colorTheme="gold" highlightText="Live" />
        <StatCard label="HIGH PRIORITY" value={String(highPriorityCount)} icon={ShieldCheck} colorTheme="sky" highlightText="Urgent" />
        <StatCard label="TEAM READINESS" value="N/A" icon={Users} colorTheme="lemon" highlightText="Pending" />
      </div>

      <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by problem, keyword or location"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8ACFF8]/50 focus:border-[#006199]"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <SlidersHorizontal className="w-4 h-4 text-[#006199]" />
            <span>Smart filters</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedCategory(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === filter
                  ? 'bg-[#006199] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recommended Problems</h3>
              <p className="text-xs text-slate-500">Best-fit civic issues for your university team</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/15 px-2.5 py-1 rounded-md">
              {isLoading ? 'Loading...' : `${filteredProblems.length} results`}
            </span>
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {!isLoading && !error && filteredProblems.length === 0 && (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No matching problems are available.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProblems.map((problem) => (
              <ReportCard
                key={problem.id}
                report={problem}
                onClick={() => navigate(`/university/problems/${problem.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {featuredProblem && <div className="premium-card rounded-2xl overflow-hidden bg-white border border-slate-200/80">
            <div className="relative h-44 bg-gradient-to-br from-[#006199] via-[#8ACFF8] to-[#F4EB6C]/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),transparent_35%)]" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white/30 backdrop-blur-sm text-[#003F66]">
                  {featuredProblem.id}
                </span>
                <span className="text-xs font-bold text-[#003F66] bg-[#FFD444] px-2.5 py-1 rounded-full">
                  {featuredProblem.priority} Priority
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#006199]">{featuredProblem.category}</span>
                <div className="flex items-center text-[#006199] text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 mr-1 fill-[#FFD444] text-[#FFD444]" />
                  {featuredProblem.matchScore === null ? 'Match score pending' : `${featuredProblem.matchScore}% match`}
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">{featuredProblem.title}</h3>
              <div className="flex items-center text-sm text-slate-500 mb-4">
                <MapPin className="w-4 h-4 mr-1.5 text-[#006199]" />
                {featuredProblem.location}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {featuredProblem.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Impact</p>
                  <p className="mt-1 font-bold text-slate-800 text-sm">High local need</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Readiness</p>
                  <p className="mt-1 font-bold text-slate-800 text-sm">Team fit: 86%</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/university/problems/${featuredProblem.id}`)}
                className="w-full px-4 py-3 rounded-xl bg-[#006199] hover:bg-[#00517a] text-white font-bold text-sm flex items-center justify-center space-x-2"
              >
                <span>Review Full Problem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>}
        </div>
      </div>
    </motion.div>
  );
}
