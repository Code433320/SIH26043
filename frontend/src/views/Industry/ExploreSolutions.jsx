import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReportCard from '../../components/ReportCard';
import { apiFetch } from '../../lib/apiClient';

const mapSolution = (solution) => ({
  ...solution,
  category: solution.category || 'Civic Innovation',
  location: solution.team_name || 'University team',
  submittedDate: solution.created_at
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(solution.created_at))
    : 'Recently',
  status: String(solution.status || 'submitted').replace(/_/g, ' ').toUpperCase(),
});

export default function ExploreSolutions() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/solutions')
      .then((response) => setSolutions((response.data || []).map(mapSolution)))
      .catch((loadError) => setError(loadError.message || 'Could not load solutions.'));
  }, []);

  const visibleSolutions = solutions.filter((solution) =>
    `${solution.title} ${solution.description} ${solution.category}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1"><Sparkles className="w-4 h-4 text-[#FFD444]" /> Solution Marketplace</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore University Solutions</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Review live solutions and choose projects to fund, mentor, or support.</p>
        </div>
        <button onClick={() => navigate('/industry/my-engagements')} className="px-5 py-3 rounded-xl bg-[#FFD444] text-[#003F66] font-bold text-sm flex items-center justify-center gap-2"><BriefcaseBusiness className="w-4 h-4 text-[#006199]" /> My Engagements</button>
      </div>

      <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search solutions by title, category, or team" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-[#006199]" /></div>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && visibleSolutions.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No live solutions are available yet.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleSolutions.map((solution) => <ReportCard key={solution.id} report={solution} onClick={() => navigate(`/industry/solutions/${solution.id}`)} />)}
      </div>
    </div>
  );
}
