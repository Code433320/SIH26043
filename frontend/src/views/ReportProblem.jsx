import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Send,
  MapPin,
} from 'lucide-react';
import LocationPicker from '../components/LocationPicker';
import FileUploader from '../components/FileUploader';
import { CATEGORIES } from '../data/categories';
import { apiFetch } from '../lib/apiClient';
import { mapProblemToReport } from '../lib/problemMapper';

export default function ReportProblem({ onSubmitSuccess, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Road Damage',
    description: '',
    location: { address: '', landmark: '', lat: null, lng: null },
    files: []
  });

  const [submittedReport, setSubmittedReport] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { num: '01', title: 'Problem Details' },
    { num: '02', title: 'Location' },
    { num: '03', title: 'Media' },
    { num: '04', title: 'Review' }
  ];

  const handleNext = () => {
    if (currentStep === 2 && !formData.location.address.trim()) {
      setSubmitError('Please select or enter a location before continuing.');
      return;
    }
    setSubmitError('');
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setSubmitError('Title and description are required before submitting.');
      return;
    }
    if (!formData.location.address.trim()) {
      setSubmitError('Location is required before submitting.');
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await apiFetch('/problems', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: `${formData.location.address}${formData.location.landmark ? `, ${formData.location.landmark}` : ''}`,
        }),
      });

      const newReport = mapProblemToReport(response.data);
      setSubmittedReport(newReport);
      onSubmitSuccess(newReport);
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit the problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-[#006199]/20 shadow-xl text-center space-y-6 my-6"
      >
        <div className="w-20 h-20 rounded-full bg-[#FFD444]/20 text-[#003F66] flex items-center justify-center mx-auto border-4 border-white shadow-lg gold-active-glow">
          <CheckCircle2 className="w-10 h-10 text-[#006199]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#006199] bg-[#8ACFF8]/20 px-3 py-1 rounded-full">
            Submission Confirmed
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Problem Reported Successfully
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your civic complaint has been assigned a unique tracking ID and queued for ward action.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500">Report ID:</span>
            <span className="font-mono font-extrabold text-[#006199] text-sm">{submittedReport.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500">Category:</span>
            <span className="font-bold text-slate-800">{submittedReport.category}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-2">
            <span className="text-slate-500">Location:</span>
            <span className="font-bold text-slate-800 truncate max-w-[200px]">{submittedReport.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Status:</span>
            <span className="font-bold text-[#006199] bg-[#8ACFF8]/30 px-2 py-0.5 rounded">SUBMITTED</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('my-reports', submittedReport.id)}
            className="w-full py-3 rounded-xl bg-[#006199] hover:bg-[#00446D] text-white font-bold text-xs shadow-md transition-colors"
          >
            Track Report Detail
          </button>
          <button
            onClick={() => onNavigate('my-reports')}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            View My Reports
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900">Report a Civic Problem</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit details below to alert municipal authorities and initiate ward repair action.
        </p>
      </div>

      {/* Horizontal Progress Steps Indicator */}
      <div className="premium-card rounded-2xl p-4 bg-white border border-slate-200 flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCurrent = currentStep === idx + 1;
          const isDone = currentStep > idx + 1;

          return (
            <React.Fragment key={step.num}>
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone 
                      ? "bg-[#006199] text-white" 
                      : isCurrent 
                      ? "bg-[#FFD444] text-[#003F66] gold-active-glow font-black ring-4 ring-[#FFD444]/20" 
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${
                  isCurrent ? "text-[#006199]" : isDone ? "text-slate-800" : "text-slate-400"
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                  currentStep > idx + 1 ? "bg-[#006199]" : "bg-slate-200"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200">
        {submitError && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        <AnimatePresence mode="wait">
          {/* STEP 1: PROBLEM DETAILS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.name })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      formData.category === cat.name
                        ? "border-[#006199] bg-[#8ACFF8]/15 ring-2 ring-[#006199]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${formData.category === cat.name ? "text-[#006199]" : "text-slate-400"}`} />
                    <span className={`text-xs font-bold ${formData.category === cat.name ? "text-[#006199]" : "text-slate-800"}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Problem Title *
                </label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Large pothole near Main Road Swargate"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 outline-none text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Description *
                </label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the severity, dimensions, hazards, or specific context..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 outline-none text-sm font-medium transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LocationPicker 
                selectedLocation={formData.location}
                onSelectLocation={(loc) => setFormData({ ...formData, location: loc })}
              />
            </motion.div>
          )}

          {/* STEP 3: MEDIA */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FileUploader 
                files={formData.files}
                onFilesChange={(files) => setFormData({ ...formData, files })}
              />
            </motion.div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Review Report Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div>
                    <span className="text-slate-400 font-medium">Category:</span>
                    <p className="font-bold text-[#006199]">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Title:</span>
                    <p className="font-bold text-slate-900">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Description:</span>
                    <p className="text-slate-600 line-clamp-3">{formData.description}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div>
                    <span className="text-slate-400 font-medium">Address:</span>
                    <p className="font-bold text-slate-900 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#006199]" />
                      {formData.location.address}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Landmark:</span>
                    <p className="font-medium text-slate-700">{formData.location.landmark || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Media Attached:</span>
                    <p className="font-bold text-slate-900">{formData.files.length} Photo(s)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-colors ${
              currentStep === 1 
                ? "text-slate-300 cursor-not-allowed" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {currentStep < 4 ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#006199] hover:bg-[#00446D] text-white font-bold text-xs flex items-center space-x-2 shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-[#FFD444]/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 text-[#006199]" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report Now'}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}