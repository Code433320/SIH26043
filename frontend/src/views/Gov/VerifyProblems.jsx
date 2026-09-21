import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, MapPin, Search, XCircle } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemsToReports } from '../../lib/problemMapper';
import StatusBadge from '../../components/StatusBadge';

export default function VerifyProblems() {
  const [problems, setProblems] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState('');

  const loadProblems = () => {
    apiFetch('/problems')
      .then((response) => setProblems(mapProblemsToReports(response.data || [])))
      .catch((loadError) => setError(loadError.message || 'Could not load problems.'));
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const pendingProblems = problems.filter((problem) => ['SUBMITTED', 'PENDING'].includes(problem.status));
  const visibleProblems = pendingProblems.filter((problem) =>
    `${problem.title} ${problem.location} ${problem.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const approveProblem = async (id) => {
    setActionId(id);
    setError('');
    try {
      await apiFetch(`/problems/${id}/approve`, { method: 'POST' });
      loadProblems();
    } catch (actionError) {
      setError(actionError.message || 'Could not approve problem.');
    } finally {
      setActionId('');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80">
        <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1"><ClipboardCheck className="w-4 h-4 text-[#FFD444]" /> Government Verification</div><h2 className="text-2xl sm:text-3xl font-black text-slate-900">Verify Problems</h2><p className="text-xs sm:text-sm text-slate-500 mt-1">Review newly submitted civic problems before they enter the matching pipeline.</p></div>
      </div>

      <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, location, or category" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm outline-none focus:border-[#006199]" /></div></div>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && visibleProblems.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No problems are waiting for verification.</p>}
      <div className="space-y-4">
        {visibleProblems.map((problem) => (
          <div key={problem.id} className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="min-w-0"><div className="flex items-center gap-2 mb-2 flex-wrap"><span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#006199] text-white">{problem.id}</span><StatusBadge status={problem.status} /></div><h3 className="text-lg font-black text-slate-900">{problem.title}</h3><p className="text-sm text-slate-600 mt-1">{problem.description}</p><div className="flex items-center gap-4 text-xs text-slate-500 mt-3"><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#006199]" />{problem.location}</span><span>{problem.category}</span></div></div>
            <div className="flex items-center gap-2 shrink-0"><button disabled={actionId === problem.id} onClick={() => approveProblem(problem.id)} className="inline-flex items-center gap-2 rounded-xl bg-[#006199] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"><CheckCircle2 className="w-4 h-4" />{actionId === problem.id ? 'Approving...' : 'Approve'}</button><button disabled={actionId === problem.id} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-bold text-red-700 disabled:opacity-60"><XCircle className="w-4 h-4" />Flag</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
