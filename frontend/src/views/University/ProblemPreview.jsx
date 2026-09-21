import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock3,
  Sparkles,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch } from '../../lib/apiClient';
import { mapProblemToReport } from '../../lib/problemMapper';

export default function ProblemPreview() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setProblem(null);
    setError('');

    apiFetch(`/problems/${encodeURIComponent(problemId)}`)
      .then((response) => setProblem(mapProblemToReport(response.data)))
      .catch((loadError) => setError(loadError.message || 'Could not load problem details.'));
  }, [problemId]);

  const requirements = problem?.requirements || [];
  const evidence = problem?.evidence || [];

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!solutionTitle.trim() || !solutionDescription.trim()) {
      setSubmitError('Solution title and description are required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await apiFetch('/solutions', {
        method: 'POST',
        body: JSON.stringify({
          problem_id: problem.id,
          title: solutionTitle.trim(),
          description: solutionDescription.trim(),
          team_name: teamName.trim() || null,
        }),
      });
      navigate('/university/my-projects');
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your solution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/university/find-problems')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-[#006199]/30 hover:text-[#006199]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discovery
        </button>
        {problem && <StatusBadge status={problem.status} />}
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}
      {!problem && !error && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading problem details...</div>}

      {problem && (
        <div className="premium-card rounded-3xl overflow-hidden bg-white border border-slate-200/80">
          <div className="h-56 bg-gradient-to-r from-[#006199] via-[#8ACFF8] to-[#F4EB6C]/70 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-white/30 text-[#003F66] backdrop-blur-sm">{problem.id}</span>
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#003F66] bg-[#FFD444] px-2.5 py-1 rounded-full">{problem.category}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#003F66]/90 mb-2"><Sparkles className="w-4 h-4 text-[#003F66]" />Civic Issue Match</div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#003F66] tracking-tight">{problem.title}</h2>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['Impact', problem.affected_population || 'Not specified'],
                ['Priority', problem.priority || 'Not specified'],
                ['Match Score', problem.matchScore === null ? 'Pending' : `${problem.matchScore}%`],
                ['Timeline', problem.timeline || 'Not assigned'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-lg font-black text-slate-900">{value}</p></div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-center gap-2 text-[#006199] mb-3"><FileText className="w-4 h-4" /><h3 className="text-base font-bold text-slate-900">Problem Overview</h3></div><p className="text-sm leading-relaxed text-slate-600">{problem.problem_summary || problem.description}</p></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-[#006199] mb-4"><ShieldCheck className="w-4 h-4" /><h3 className="text-base font-bold text-slate-900">Issue Description</h3></div><p className="text-sm leading-relaxed text-slate-600">{problem.description}</p>{requirements.length > 0 && <div className="mt-5 space-y-3">{requirements.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100"><CheckCircle2 className="w-4 h-4 text-[#006199] mt-0.5 flex-shrink-0" /><span className="text-sm text-slate-700">{item}</span></div>)}</div>}</div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-[#006199] mb-4"><AlertTriangle className="w-4 h-4" /><h3 className="text-base font-bold text-slate-900">Evidence and Impact</h3></div>{evidence.length > 0 ? <div className="space-y-3">{evidence.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl bg-[#8ACFF8]/10 border border-[#8ACFF8]/20 p-3"><div className="w-2 h-2 rounded-full bg-[#006199] mt-2" /><span className="text-sm text-slate-700">{item}</span></div>)}</div> : <p className="text-sm text-slate-500">No additional evidence has been recorded.</p>}</div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-base font-bold text-slate-900 mb-4">Problem Details</h3><div className="space-y-3 text-sm text-slate-600"><div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#006199]" /><span>{problem.location}</span></div><div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-[#006199]" /><span>Submitted: {problem.submittedDate}</span></div><div className="flex items-center gap-3"><Clock3 className="w-4 h-4 text-[#006199]" /><span>Status: {problem.status}</span></div><div className="flex items-center gap-3"><Users className="w-4 h-4 text-[#006199]" /><span>Lead Team: {problem.teamLead || 'Not assigned'}</span></div><div className="flex items-center gap-3"><BriefcaseBusiness className="w-4 h-4 text-[#006199]" /><span>Department: {problem.department}</span></div></div></div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Form Team &amp; Submit Solution</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Claim this problem and start a project — this creates a solution entry your team can track.
                  </p>
                  <form onSubmit={handleAccept} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Solution Title *
                      </label>
                      <input
                        type="text"
                        value={solutionTitle}
                        onChange={(e) => setSolutionTitle(e.target.value)}
                        placeholder="e.g. AI-based pothole detection system"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#006199]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Approach Description *
                      </label>
                      <textarea
                        rows={3}
                        value={solutionDescription}
                        onChange={(e) => setSolutionDescription(e.target.value)}
                        placeholder="Briefly describe your proposed approach..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#006199]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Team Name <span className="text-slate-400 font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Team Innovate"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#006199]"
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? 'Submitting...' : 'Accept & Form Team'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}