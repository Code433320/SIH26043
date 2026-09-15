import React from 'react';
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
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const PROBLEM_LIBRARY = [
  {
    id: 'CIV-2026-1048',
    title: 'Large pothole near Main Road',
    category: 'Road Damage',
    location: 'Swargate, Pune, Maharashtra',
    submittedDate: '12 Sept 2026',
    status: 'IN PROGRESS',
    priority: 'HIGH',
    matchScore: 92,
    description: 'Deep asphalt pothole causing severe traffic slowdowns and a public safety risk near Swargate Bus Terminal.',
    urgency: 'Critical',
    affectedPopulation: '1,400+ commuters/day',
    teamLead: 'Civil Engineering Team A',
    mentor: 'Dr. A. Kulkarni',
    timeline: 'Implementation review in 6 days',
    problemSummary: 'The issue is concentrated at a high-traffic junction where repeated vehicle impacts are worsening the road surface and endangering pedestrians.',
    requirements: [
      'Field assessment of surface depth and RTC mobility impact',
      'Short-term safety barricading and alternate route marking',
      'Repair recommendation with material and budget estimation'
    ],
    evidence: [
      '3 recent vehicle-to-road impact complaints lodged this month',
      'Traffic congestion observed during peak commute hours',
      'Pedestrian crossing area remains narrowed due to damaged pavement'
    ]
  },
  {
    id: 'CIV-2026-1180',
    title: 'Broken drain cover near market lane',
    category: 'Drainage',
    location: 'Aundh, Pune, Maharashtra',
    submittedDate: '14 Sept 2026',
    status: 'PENDING',
    priority: 'HIGH',
    matchScore: 94,
    description: 'Loose drain cover creates safety hazards for pedestrians and a blockage risk during heavy rainfall.',
    urgency: 'High',
    affectedPopulation: '800+ residents/day',
    teamLead: 'Urban Systems Lab',
    mentor: 'Prof. S. Iyer',
    timeline: 'Site review due in 3 days',
    problemSummary: 'The damaged drain cover is near a busy market route and requires immediate intervention to prevent traffic and pedestrian incidents.',
    requirements: [
      'Drainage inspection and flow analysis',
      'Temporary safety installation',
      'Resilience planning for monsoon season'
    ],
    evidence: [
      'Loose metal cover reported by locals',
      'Rainwater backup observed after moderate rainfall',
      'Concern raised by nearby shop owners and school staff'
    ]
  }
];

export default function ProblemPreview() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEM_LIBRARY.find((item) => item.id === problemId) || PROBLEM_LIBRARY[0];

  const stats = [
    { label: 'Impact', value: problem.affectedPopulation },
    { label: 'Priority', value: problem.priority },
    { label: 'Match Score', value: `${problem.matchScore}%` },
    { label: 'Timeline', value: problem.timeline }
  ];

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

        <StatusBadge status={problem.status} />
      </div>

      <div className="premium-card rounded-3xl overflow-hidden bg-white border border-slate-200/80">
        <div className="h-56 bg-gradient-to-r from-[#006199] via-[#8ACFF8] to-[#F4EB6C]/70 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-white/30 text-[#003F66] backdrop-blur-sm">
              {problem.id}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#003F66] bg-[#FFD444] px-2.5 py-1 rounded-full">
              {problem.category}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#003F66]/90 mb-2">
              <Sparkles className="w-4 h-4 text-[#003F66]" />
              Civic Issue Match
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#003F66] tracking-tight">{problem.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
                <p className="mt-2 text-lg font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-[#006199] mb-3">
                  <FileText className="w-4 h-4" />
                  <h3 className="text-base font-bold text-slate-900">Problem Overview</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{problem.problemSummary}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-[#006199] mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <h3 className="text-base font-bold text-slate-900">Issue Description</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{problem.description}</p>

                <div className="mt-5 space-y-3">
                  {problem.requirements.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-[#006199] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-[#006199] mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-base font-bold text-slate-900">Evidence and Impact</h3>
                </div>

                <div className="space-y-3">
                  {problem.evidence.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-xl bg-[#8ACFF8]/10 border border-[#8ACFF8]/20 p-3">
                      <div className="w-2 h-2 rounded-full bg-[#006199] mt-2" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-900 mb-4">Problem Details</h3>

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#006199]" />
                    <span>{problem.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#006199]" />
                    <span>Submitted: {problem.submittedDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 className="w-4 h-4 text-[#006199]" />
                    <span>Urgency: {problem.urgency}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#006199]" />
                    <span>Lead Team: {problem.teamLead}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BriefcaseBusiness className="w-4 h-4 text-[#006199]" />
                    <span>Faculty Mentor: {problem.mentor}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3">Recommended Action</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This city challenge is well-suited for a student-led intervention plan involving field analysis, public consultation, and a practical implementation proposal.
                </p>

                <button
                  onClick={() => navigate('/university/my-projects')}
                  className="mt-5 w-full rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold py-3 text-sm"
                >
                  Assign to My Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

