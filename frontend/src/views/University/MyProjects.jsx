import React from 'react';
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

const MY_PROJECTS_STATS = {
  activeProjects: 6,
  teamMembers: 24,
  milestonesDue: 3,
  solutionsReady: 2
};

const MY_PROJECTS = [
  {
    id: 'PRJ-2041',
    title: 'Smart Drainage Monitoring',
    category: 'Water Management',
    location: 'Baner, Pune',
    submittedDate: '12 Sept 2026',
    status: 'IN PROGRESS',
    progress: 72,
    teamName: 'Urban Flow Lab',
    dueDate: '18 Oct 2026',
    description: 'Deploying a low-cost monitoring model to identify overflow risks and prioritize city maintenance work during monsoon.',
    members: ['AK', 'RS', 'DP', 'AN'],
    milestone: 'Pilot deployment review'
  },
  {
    id: 'PRJ-1988',
    title: 'Waste Segregation Awareness Drive',
    category: 'Solid Waste',
    location: 'Kothrud, Pune',
    submittedDate: '5 Sept 2026',
    status: 'ASSIGNED',
    progress: 46,
    teamName: 'Green Campus Collective',
    dueDate: '7 Nov 2026',
    description: 'Planning resident engagement and field survey coverage across 4 wards with visible intervention strategies and volunteer reporting.',
    members: ['MP', 'SR', 'NE'],
    milestone: 'Ward audit completed'
  },
  {
    id: 'PRJ-1917',
    title: 'Street Safety Audit',
    category: 'Public Safety',
    location: 'Shivajinagar, Pune',
    submittedDate: '27 Aug 2026',
    status: 'RESOLVED',
    progress: 100,
    teamName: 'Safe Routes Unit',
    dueDate: 'Completed',
    description: 'Finalized lighting, crossing, and signage improvements after a successful academic-community collaboration and site review.',
    members: ['VM', 'IG', 'PK', 'TT'],
    milestone: 'Final report submitted'
  }
];

const MILESTONES = [
  { label: 'Innovation review', due: 'Today', status: 'Due Soon' },
  { label: 'Community field visit', due: '3 days', status: 'Planned' },
  { label: 'Prototype validation', due: '1 week', status: 'Pending' }
];

export default function MyProjects() {
  const navigate = useNavigate();

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
          value={String(MY_PROJECTS_STATS.activeProjects)}
          icon={FolderKanban}
          colorTheme="sky"
          highlightText="Live"
        />
        <StatCard
          label="TEAM MEMBERS"
          value={String(MY_PROJECTS_STATS.teamMembers)}
          icon={Users}
          colorTheme="gold"
          highlightText="Engaged"
        />
        <StatCard
          label="MILESTONES DUE"
          value={String(MY_PROJECTS_STATS.milestonesDue)}
          icon={CalendarRange}
          colorTheme="sky"
          highlightText="This Month"
        />
        <StatCard
          label="SOLUTIONS READY"
          value={String(MY_PROJECTS_STATS.solutionsReady)}
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
            Portfolio Score: 76%
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full w-[35%]" title="Ongoing (35%)" />
          <div className="h-full bg-[#8ACFF8] w-[25%]" title="In Review (25%)" />
          <div className="h-full bg-[#FFD444] w-[25%]" title="Milestones (25%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[15%]" title="Completed (15%)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Ongoing (2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Review (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">Milestones (2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Closed (1)</span>
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

          {MY_PROJECTS.map((project) => (
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
                  onClick={() => navigate(`/university/problems/${project.id}`)}
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
              {MILESTONES.map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm text-slate-800">{item.label}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66] bg-[#F4EB6C]/60 px-2 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Due in {item.due}</p>
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
                <p className="mt-1 font-bold text-slate-800">Dr. Meera Kulkarni</p>
              </div>
              <div className="rounded-xl bg-[#FFD444]/15 border border-[#FFD444]/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66]">Industry Partner</p>
                <p className="mt-1 font-bold text-slate-800">Urban Systems Pvt. Ltd.</p>
              </div>
              <div className="rounded-xl bg-[#F4EB6C]/30 border border-[#F4EB6C] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#003F66]">Research Grants</p>
                <p className="mt-1 font-bold text-slate-800">₹4.2L sanctioned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
