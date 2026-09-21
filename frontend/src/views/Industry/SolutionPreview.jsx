import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileSearch,
  IndianRupee,
  Users,
  HandHeart,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';

const ENGAGEMENT_TYPES = [
  { value: 'funding', label: 'Funding', icon: IndianRupee, desc: 'Provide financial support for this solution.' },
  { value: 'mentorship', label: 'Mentorship', icon: Users, desc: 'Guide the team with domain expertise.' },
  { value: 'field_support', label: 'Field Support', icon: HandHeart, desc: 'Help with on-ground deployment/testing.' },
];

export default function SolutionPreview() {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState('');

  const [engagementType, setEngagementType] = useState('funding');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiFetch(`/solutions/${solutionId}`)
      .then((response) => setSolution(response.data))
      .catch((loadError) => setError(loadError.message || 'Could not load solution.'));
  }, [solutionId]);

  const handleEngage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await apiFetch('/engagements', {
        method: 'POST',
        body: JSON.stringify({
          solution_id: solutionId,
          type: engagementType,
          amount: engagementType === 'funding' && amount ? Number(amount) : null,
          message: message.trim() || null,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit your engagement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto mt-8 space-y-4"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 text-xs font-bold text-[#006199] hover:underline"
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
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <p className="text-sm text-slate-500">{solution?.description || 'Loading solution details...'}</p>
        )}
      </div>

      {solution && (
        <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Engagement Submitted</h3>
              <p className="text-sm text-slate-500 mb-5">
                The university team has been notified. Track it from My Engagements.
              </p>
              <button
                onClick={() => navigate('/industry/my-engagements')}
                className="rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold py-3 px-6 text-sm"
              >
                Go to My Engagements
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-base font-bold text-slate-900 mb-4">Fund or Support This Solution</h3>
              <form onSubmit={handleEngage} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Engagement Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ENGAGEMENT_TYPES.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = engagementType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setEngagementType(opt.value)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'border-[#006199] bg-[#8ACFF8]/15 ring-2 ring-[#006199]/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-[#006199]' : 'text-slate-400'}`} />
                          <p className={`text-xs font-bold ${isActive ? 'text-[#006199]' : 'text-slate-800'}`}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {engagementType === 'funding' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Amount (₹) <span className="text-slate-400 font-normal normal-case">(optional)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#006199]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message to the Team <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let the team know how you'd like to support this..."
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
                  className="w-full rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit Engagement'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}