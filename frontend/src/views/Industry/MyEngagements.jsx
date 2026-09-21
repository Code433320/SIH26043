import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Handshake, Sparkles, IndianRupee, MessageSquare } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'bg-[#8ACFF8]/20 text-[#00446D] border-[#8ACFF8]/40' },
  active: { label: 'Active', className: 'bg-[#FFD444]/15 text-[#003F66] border-[#FFD444]' },
  completed: { label: 'Completed', className: 'bg-[#006199]/10 text-[#006199] border-[#006199]/30 font-semibold' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
};

const TYPE_LABELS = {
  funding: 'Funding',
  mentorship: 'Mentorship',
  field_support: 'Field Support',
};

const FILTERS = ['ALL', 'pending', 'active', 'completed', 'rejected'];

export default function MyEngagements() {
  const navigate = useNavigate();
  const [engagements, setEngagements] = useState([]);
  const [solutionsById, setSolutionsById] = useState({});
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiFetch('/engagements'), apiFetch('/solutions')])
      .then(([engagementsRes, solutionsRes]) => {
        setEngagements(engagementsRes.data || []);
        const map = {};
        (solutionsRes.data || []).forEach((s) => { map[s.id] = s; });
        setSolutionsById(map);
      })
      .catch((loadError) => setError(loadError.message || 'Could not load engagements.'));
  }, []);

  const visible = engagements.filter((e) => filter === 'ALL' || e.status === filter);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
          <Sparkles className="w-4 h-4 text-[#FFD444]" /> Industry Collaboration
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">My Engagements</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Track funding, mentorship, and field support commitments.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
              filter === f ? 'bg-[#006199] text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {f === 'ALL' ? `All (${engagements.length})` : `${f} (${engagements.filter((e) => e.status === f).length})`}
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && visible.length === 0 && (
        <div className="premium-card rounded-2xl p-10 bg-white border border-slate-200/80 text-center">
          <Handshake className="w-8 h-8 mx-auto mb-3 text-[#006199]" />
          <p className="text-sm text-slate-500">No engagements in this view yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {visible.map((engagement) => {
          const solution = solutionsById[engagement.solution_id];
          const statusStyle = STATUS_STYLES[engagement.status] || STATUS_STYLES.pending;

          return (
            <button
              key={engagement.id}
              onClick={() => navigate(`/industry/solutions/${engagement.solution_id}`)}
              className="w-full text-left premium-card rounded-2xl p-5 bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#006199]/30 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <BriefcaseBusiness className="w-4 h-4 text-[#006199] flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {solution?.title || `Solution ${engagement.solution_id?.slice(0, 8)}`}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#006199] uppercase tracking-wide">
                  {TYPE_LABELS[engagement.type] || engagement.type}
                </p>
                {engagement.amount ? (
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {Number(engagement.amount).toLocaleString('en-IN')}
                  </p>
                ) : null}
                {engagement.message && (
                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{engagement.message}</span>
                  </p>
                )}
              </div>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center justify-center flex-shrink-0 ${statusStyle.className}`}>
                {statusStyle.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}