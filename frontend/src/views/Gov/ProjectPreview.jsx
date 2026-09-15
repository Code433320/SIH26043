import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { MONITORED_PROJECTS } from '../../data/governmentMockData';

export default function ProjectPreview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = MONITORED_PROJECTS.find((p) => p.id === projectId);

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
          {project ? project.title : `Project ${projectId}`}
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-4">{projectId}</p>
        <p className="text-sm text-slate-500">
          Full project detail + verify/monitor actions + chat — build this next, reusing the shared Problem Detail pattern.
        </p>
      </div>
    </div>
  );
}
