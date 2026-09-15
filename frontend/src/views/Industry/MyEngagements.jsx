import React from 'react';
import { Construction } from 'lucide-react';

export default function MyEngagements() {
  return (
    <div className="max-w-3xl mx-auto mt-12 text-center premium-card rounded-2xl p-10 bg-white border border-slate-200/80">
      <div className="w-14 h-14 rounded-xl bg-[#8ACFF8]/20 text-[#006199] flex items-center justify-center mx-auto mb-4">
        <Construction className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">My Engagements — Coming Next</h2>
      <p className="text-sm text-slate-500">
        This page will list every solution this company is funding or mentoring, with progress and impact reports.
      </p>
    </div>
  );
}
