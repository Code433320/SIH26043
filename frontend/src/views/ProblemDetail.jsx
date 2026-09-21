import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import DiscussionThread from '../components/DiscussionThread';

export default function ProblemDetail({ report, onBack }) {
  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-[#006199] text-slate-700 font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#006199]" />
          <span>Back to My Reports</span>
        </button>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#006199] text-white shadow-xs">
          OFFICIAL CIVIC CASE FILE
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded bg-[#8ACFF8]/20 text-[#006199]">
                {report.id}
              </span>
              <StatusBadge status={report.status} />
              <span className="text-xs font-bold text-[#006199] uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded">
                {report.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center text-slate-700">
                <MapPin className="w-4 h-4 mr-1 text-[#006199]" />
                {report.location}
              </span>
              <span className="flex items-center text-slate-500">
                <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                Submitted: {report.submittedDate} ({report.submittedTime || '10:32 AM'})
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 md:text-right min-w-[220px]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Department</p>
            <p className="text-xs font-bold text-[#006199] mt-0.5">{report.department}</p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center md:justify-end">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-[#006199]" />
              {report.assignedOfficer}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Signature Timeline & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Signature Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Status Tracking Timeline
                </h3>
                <p className="text-xs text-slate-500">Real-time stage updates verified by ward engineering office</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#003F66] bg-[#FFD444]/30 px-2.5 py-1 rounded-full animate-pulse">
                STAGE 04 / IN PROGRESS
              </span>
            </div>

            {/* Render Animated Vertical Timeline */}
            <StatusTimeline timeline={report.timeline} />
          </div>

          {/* Activity Stream Section */}
          <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Official Activity Log Stream
            </h3>

            <div className="space-y-4">
              {report.activityLogs && report.activityLogs.map((log) => (
                <motion.div 
                  key={log.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start space-x-3"
                >
                  <div className="p-2 rounded-lg bg-[#006199]/10 text-[#006199] flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900">{log.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.date} • {log.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{log.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Case Information & Media Gallery */}
        <div className="lg:col-span-5 space-y-6">
          {/* Detailed Problem Information */}
          <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Problem Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Description:</span>
                <p className="text-slate-700 font-normal leading-relaxed mt-1 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  {report.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 font-medium">Priority Level</span>
                  <p className="font-bold text-red-600 mt-0.5">{report.priority || 'HIGH'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 font-medium">Est. Resolution</span>
                  <p className="font-bold text-[#006199] mt-0.5">{report.estimatedResolution}</p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 font-medium">Landmark / Reference:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{report.landmark || 'Swargate Main Road'}</p>
              </div>
            </div>
          </div>

          {/* Media Attachments */}
          <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Reported Media ({report.media ? report.media.length : 0})
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {report.media && report.media.map((item, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden h-32 bg-slate-100 group border border-slate-200">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium truncate">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion / Chat — open collaboration on this problem */}
          <DiscussionThread problemId={report.id} />
        </div>
      </div>
    </motion.div>
  );
}