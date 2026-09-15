import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { EXPLORABLE_SOLUTIONS } from '../../data/industryMockData';

export default function SolutionPreview() {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const solution = EXPLORABLE_SOLUTIONS.find((s) => s.id === solutionId);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-xs font-bold text-[#006199] hover:underline mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div className="premium-card rounded-2xl p-8 bg-white border border-slate-200/80 text-center">
        <div className="w-14 h-14 rounded-xl bg-[#8ACFF8]/20 text-[#006199] flex items-center justify-center mx-auto mb-4">
          <FileSearch className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {solution ? solution.title : `Solution ${solutionId}`}
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-4">{solutionId}</p>
        <p className="text-sm text-slate-500">
          Full solution detail + fund/mentor actions + chat — build this next, reusing the shared Problem Detail pattern.
        </p>
      </div>
    </div>
  );
}
