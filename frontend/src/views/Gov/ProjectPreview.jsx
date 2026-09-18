import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemToReport } from '../../lib/problemMapper';

export default function ProjectPreview() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/problems/${projectId}`)
      .then((response) => setProject(mapProblemToReport(response.data)))
      .catch((loadError) => setError(loadError.message || 'Could not load project.'));
  }, [projectId]);

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
        {error ? <p className="text-sm text-red-700">{error}</p> : <p className="text-sm text-slate-500">{project?.description || 'Loading project details...'}</p>}
      </div>
    </div>
  );
}
