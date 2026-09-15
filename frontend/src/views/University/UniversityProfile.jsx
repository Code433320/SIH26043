import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Building2,
  CalendarRange,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Users,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/StatCard';

const UNIVERSITY_PROFILE = {
  name: 'College of Engineering, Pune',
  shortName: 'SKNCOE',
  universityId: 'UNIV-SKNOCE-0417',
  email: 'civic.cell@skncoe.ac.in',
  city: 'Pune',
  state: 'Maharashtra',
  memberSince: 'August 2025',
  campus: 'Wellesley Road, Shivajinagar',
  type: 'Public Engineering Institute',
  focus: ['Urban Mobility', 'Water Systems', 'Smart Governance', 'Sustainable Infrastructure'],
  totalStudents: 8600,
  activeFaculty: 42,
  communityProjects: 18,
  successRate: '92%'
};

const PERFORMANCE_POINTS = [
  { label: 'Civic Collaborations', value: '14' },
  { label: 'Research Teams', value: '09' },
  { label: 'Problem Resolutions', value: '26' },
  { label: 'Industry Networks', value: '03' }
];

export default function UniversityProfile() {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.08 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      <div className="bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#006199] to-[#8ACFF8] text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-9 h-9 text-[#FFD444]" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
                <Sparkles className="w-4 h-4 text-[#FFD444]" />
                <span>University Profile</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {UNIVERSITY_PROFILE.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Member since {UNIVERSITY_PROFILE.memberSince} • {UNIVERSITY_PROFILE.type}
              </p>
            </div>
          </div>

          <button className="px-5 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444]">
            <BadgeCheck className="w-4 h-4 text-[#006199]" />
            <span>Verified Institution</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="STUDENTS" value={String(UNIVERSITY_PROFILE.totalStudents)} icon={Users} colorTheme="sky" highlightText="Active" />
        <StatCard label="FACULTY" value={String(UNIVERSITY_PROFILE.activeFaculty)} icon={GraduationCap} colorTheme="gold" highlightText="Led" />
        <StatCard label="PROJECTS" value={String(UNIVERSITY_PROFILE.communityProjects)} icon={Building2} colorTheme="sky" highlightText="Ongoing" />
        <StatCard label="SUCCESS RATE" value={UNIVERSITY_PROFILE.successRate} icon={ShieldCheck} colorTheme="lemon" highlightText="Impact" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Institution Overview</h3>
              <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">
                {UNIVERSITY_PROFILE.universityId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-bold">Campus</span>
                </div>
                <p>{UNIVERSITY_PROFILE.campus}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold">Location</span>
                </div>
                <p>{UNIVERSITY_PROFILE.city}, {UNIVERSITY_PROFILE.state}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-bold">Email</span>
                </div>
                <p>{UNIVERSITY_PROFILE.email}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <CalendarRange className="w-4 h-4" />
                  <span className="font-bold">Membership</span>
                </div>
                <p>{UNIVERSITY_PROFILE.memberSince}</p>
              </div>
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#006199] mb-4">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-base font-bold text-slate-900">Research & Civic Focus</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {UNIVERSITY_PROFILE.focus.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#8ACFF8]/20 text-[#006199] border border-[#8ACFF8]/30"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Institutional Strength</h3>
              <ShieldCheck className="w-5 h-5 text-[#006199]" />
            </div>

            <div className="space-y-3">
              {PERFORMANCE_POINTS.map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{item.label}</span>
                  <span className="text-base font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Verification</h3>
              <BadgeCheck className="w-5 h-5 text-[#006199]" />
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3 rounded-xl bg-[#006199]/5 border border-[#006199]/10 p-3">
                <BadgeCheck className="w-4 h-4 text-[#006199]" />
                <span>Academic institution verified</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#FFD444]/10 border border-[#FFD444]/20 p-3">
                <ShieldCheck className="w-4 h-4 text-[#003F66]" />
                <span>Public policy collaboration enabled</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#8ACFF8]/10 border border-[#8ACFF8]/20 p-3">
                <Sparkles className="w-4 h-4 text-[#006199]" />
                <span>Student-led civic innovation programs active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Summary</h3>
            <p className="text-xs text-slate-500">Driving student-led civic innovation with governance and public impact</p>
          </div>
          <button className="inline-flex items-center gap-2 text-xs font-bold text-[#006199] hover:underline">
            <span>Manage Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
