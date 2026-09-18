import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  FolderKanban,
  CalendarRange,
  ArrowRight,
  Sparkles,
  Plus,
  Target,
  BriefcaseBusiness,
  CheckCheck
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';

const mapSolutionToProject = (solution) => ({
  ...solution,
  id: solution.id,
  title: solution.title || 'Untitled solution',
  category: solution.category || 'Civic Innovation',
  location: solution.location || 'Location unavailable',
  status: String(solution.status || 'submitted').replace(/_/g, ' ').toUpperCase(),
  progress: Number(solution.progress) || 0,
  teamName: solution.team_name || 'Team not specified',
  dueDate: solution.due_date ? new Date(solution.due_date).toLocaleDateString('en-IN') : 'Not assigned',
  description: solution.description || 'No solution description provided.',
  members: solution.members || [],
});

export default function MyProjects() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile?.id) return;

    apiFetch(`/solutions?university_id=${encodeURIComponent(profile.id)}`)
      .then((response) => setProjects((response.data || []).map(mapSolutionToProject)))
      .catch((loadError) => setError(loadError.message || 'Could not load projects.'))
      .finally(() => setIsLoading(false));
  }, [profile?.id]);

  const activeProjects = projects.filter((project) => !['COMPLETED', 'RESOLVED'].includes(project.status));
  const solutionsReady = projects.filter((project) => ['COMPLETED', 'RESOLVED'].includes(project.status)).length;
  const teamNames = new Set(projects.map((project) => project.teamName).filter((team) => team !== 'Team not specified'));
  const milestones = projects.filter((project) => project.dueDate !== 'Not assigned').slice(0, 3);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD444]" />
            <span>Civic Samadhan Portal • Active University Projects</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your active problem-solving assignments, team collaboration, and milestone delivery.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/university/find-problems')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <Plus className="w-5 h-5 text-[#006199]" />
          <span>Explore New Problem</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="ACTIVE PROJECTS"
          value={String(activeProjects.length)}
          icon={FolderKanban}
          colorTheme="sky"
          highlightText="Live"
        />
        <StatCard
          label="ACTIVE TEAMS"
          value={String(teamNames.size)}
          icon={Users}
          colorTheme="gold"
          highlightText="Engaged"
        />
        <StatCard
          label="MILESTONES DUE"
          value={String(milestones.length)}
          icon={CalendarRange}
          colorTheme="sky"
          highlightText="This Month"
        />
        <StatCard
          label="SOLUTIONS READY"
          value={String(solutionsReady)}
          icon={CheckCheck}
          colorTheme="lemon"
          highlightText="Prepared"
        />
      </div>

      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Portfolio Health Overview</h3>
            <p className="text-xs text-slate-500">Distribution of project progress across your university teams</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">
            Portfolio Score: {projects.length ? `${Math.round((solutionsReady / projects.length) * 100)}%` : 'N/A'}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full" style={{ width: `${projects.length ? (activeProjects.length / projects.length) * 100 : 0}%` }} title="Ongoing" />
          <div className="h-full bg-[#8ACFF8]" style={{ width: `${projects.length ? (milestones.length / projects.length) * 100 : 0}%` }} title="In Review" />
          <div className="h-full bg-[#FFD444]" style={{ width: `${projects.length ? (activeProjects.length / projects.length) * 100 : 0}%` }} title="Milestones" />
          <div className="h-full bg-emerald-500 rounded-r-full" style={{ width: `${projects.length ? (solutionsReady / projects.length) * 100 : 0}%` }} title="Completed" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Ongoing ({activeProjects.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Review ({milestones.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Milestones ({milestones.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Closed ({solutionsReady})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_0.9fr] gap-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Project Board</h3>
              <p className="text-xs text-slate-500">Your current project assignments and delivery pipeline</p>
            </div>
            <button
              onClick={() => navigate('/university/find-problems')}
              className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
            >
              <span>View Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading && <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading projects...</p>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {!isLoading && !error && projects.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No projects found for this university.</p>}
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#006199] text-white shadow-xs">
                      {project.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#006199] bg-[#8ACFF8]/20 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {project.description}
                  </p>
                </div>

                <StatusBadge status={project.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Team</p>
                  <p className="mt-1 font-bold text-slate-800 text-sm">{project.teamName}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Location</p>
                  <p className="mt-1 font-bold text-slate-800 text-sm">{project.location}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Due Date</p>
                  <p className="mt-1 font-bold text-slate-800 text-sm">{project.dueDate}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span>Project Progress</span>
                  <span className="text-[#006199]">{project.progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#006199] via-[#8ACFF8] to-[#FFD444]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {project.members.map((member, index) => (
                      <div
                        key={member}
                        className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#003F66] ${
                          index % 3 === 0
                            ? 'bg-[#8ACFF8]'
                            : index % 3 === 1
                              ? 'bg-[#F4EB6C]'
                              : 'bg-[#FFD444]'
                        }`}
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{project.members.length} members</span>
                </div>

                <button
                  onClick={() => navigate(`/university/problems/${project.problem_id || project.id}`)}
                  className="inline-flex items-center justify-center space-x-2 rounded-xl border border-[#006199]/20 bg-[#006199]/5 px-3.5 py-2 text-xs font-bold text-[#006199] hover:bg-[#8ACFF8]/20 transition-colors"
                >
                  <span>Open Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Milestones</h3>
                <p className="text-xs text-slate-500">Priority actions this month</p>
              </div>
              <Target className="w-5 h-5 text-[#006199]" />
            </div>

            <div className="space-y-3">
              {milestones.map((item) => (
                <div key={item.id} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-slate-800">{item.title}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66] bg-[#F4EB6C]/60 px-2 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Due date: {item.dueDate}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Institutional Support</h3>
                <p className="text-xs text-slate-500">Resources assigned to your teams</p>
              </div>
              <BriefcaseBusiness className="w-5 h-5 text-[#006199]" />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-[#8ACFF8]/15 border border-[#8ACFF8]/30 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#006199]">Faculty Mentor</p>
                <p className="mt-1 font-bold text-slate-800">{profile?.profile_data?.mentor || 'Not assigned'}</p>
              </div>
              <div className="rounded-xl bg-[#FFD444]/15 border border-[#FFD444]/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66]">Industry Partner</p>
                <p className="mt-1 font-bold text-slate-800">{profile?.profile_data?.industry_partner || 'Not assigned'}</p>
              </div>
              <div className="rounded-xl bg-[#F4EB6C]/30 border border-[#F4EB6C] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66]">Research Grants</p>
                <p className="mt-1 font-bold text-slate-800">{profile?.profile_data?.research_grants || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
