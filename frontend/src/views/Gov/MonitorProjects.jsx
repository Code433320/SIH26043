import React, { useEffect, useState } from 'react';
import { BarChart3, MapPin, Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReportCard from '../../components/ReportCard';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemsToReports } from '../../lib/problemMapper';

const STATUS_FILTERS = ['ALL', 'SUBMITTED', 'CATEGORIZED', 'MATCHED', 'IN PROGRESS', 'RESOLVED'];

export default function MonitorProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiFetch('/problems'), apiFetch('/solutions')])
      .then(([problemsResponse, solutionsResponse]) => {
        const solutions = solutionsResponse.data || [];
        const solutionByProblem = new Map(solutions.map((solution) => [solution.problem_id, solution]));
        setProjects(mapProblemsToReports(problemsResponse.data || []).map((problem) => ({
          ...problem,
          solution: solutionByProblem.get(problem.id),
        })));
      })
      .catch((loadError) => setError(loadError.message || 'Could not load monitored projects.'));
  }, []);

  const visibleProjects = projects
    .filter((project) => statusFilter === 'ALL' || project.status === statusFilter)
    .filter((project) =>
      `${project.title} ${project.location} ${project.category}`.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
            <BarChart3 className="w-4 h-4 text-[#FFD444]" /> Government Monitoring
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Monitor Projects</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Track civic problems and university solutions across departments.</p>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search monitored projects"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-[#006199]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === s ? 'bg-[#006199] text-white' : 'text-slate-500 hover:text-slate-800 bg-slate-50'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && visibleProjects.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No monitored projects match this view.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleProjects.map((project) => (
          <div key={project.id} className="space-y-2">
            <ReportCard report={project} onClick={() => navigate(`/government/projects/${project.id}`)} />
            {project.solution && (
              <div className="px-2 space-y-1">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#006199]" /> Solution: {project.solution.title}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#006199] flex-shrink-0" />
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#006199] rounded-full"
                      style={{ width: `${project.solution.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">
                    {project.solution.progress ?? 0}%
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}