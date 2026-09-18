import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, Handshake, Sparkles } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch } from '../../lib/apiClient';

export default function MyEngagements() {
  const [engagements, setEngagements] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/engagements')
      .then((response) => setEngagements(response.data || []))
      .catch((loadError) => setError(loadError.message || 'Could not load engagements.'));
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1"><Sparkles className="w-4 h-4 text-[#FFD444]" /> Industry Collaboration</div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">My Engagements</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Track funding, mentorship, and field support commitments.</p>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && engagements.length === 0 && <div className="premium-card rounded-2xl p-10 bg-white border border-slate-200/80 text-center"><Handshake className="w-8 h-8 mx-auto mb-3 text-[#006199]" /><p className="text-sm text-slate-500">No engagements created yet.</p></div>}
      <div className="space-y-4">
        {engagements.map((engagement) => (
          <div key={engagement.id} className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><div className="flex items-center gap-2 mb-2"><BriefcaseBusiness className="w-4 h-4 text-[#006199]" /><span className="text-xs font-mono text-[#006199]">{engagement.solution_id}</span></div><h3 className="font-bold text-slate-900 capitalize">{engagement.type?.replace('_', ' ')}</h3><p className="text-xs text-slate-500 mt-1">{engagement.message || 'No message provided'}</p></div>
            <StatusBadge status={String(engagement.status || 'pending').toUpperCase()} />
          </div>
        ))}
      </div>
    </div>
  );
}
