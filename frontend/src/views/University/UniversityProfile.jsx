import React, { useEffect, useState } from 'react';
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
  ArrowRight,
  LogOut
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function UniversityProfile() {
  const { profile } = useAuth();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [profileError, setProfileError] = useState('');

  const profileData = profile?.profile_data || {};
  const focus = profileData.focus
    ? String(profileData.focus).split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    if (!profile?.id) return;

    Promise.all([
      apiFetch(`/solutions?university_id=${encodeURIComponent(profile.id)}`),
      apiFetch(`/problems?university_id=${encodeURIComponent(profile.id)}`),
    ])
      .then(([solutionsResponse, problemsResponse]) => {
        setProjectCount((solutionsResponse.data || []).length);
        setProblemCount((problemsResponse.data || []).length);
      })
      .catch((error) => setProfileError(error.message || 'Could not load profile activity.'));
  }, [profile?.id]);

  const performancePoints = [
    { label: 'Civic Collaborations', value: String(problemCount) },
    { label: 'Research Teams', value: 'N/A' },
    { label: 'Problem Resolutions', value: String(projectCount) },
    { label: 'Industry Networks', value: 'N/A' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (!error) navigate('/', { replace: true });
    setIsLoggingOut(false);
  };
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
                {profile?.name || 'University'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'} • {profileData.type || 'Institutional account'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-5 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444]"><BadgeCheck className="w-4 h-4 text-[#006199]" /><span>Verified Institution</span></button>
            <button onClick={handleLogout} disabled={isLoggingOut} className="px-5 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"><LogOut className="w-4 h-4" />{isLoggingOut ? 'Logging out...' : 'Logout'}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="STUDENTS" value="N/A" icon={Users} colorTheme="sky" highlightText="Not set" />
        <StatCard label="FACULTY" value="N/A" icon={GraduationCap} colorTheme="gold" highlightText="Not set" />
        <StatCard label="PROJECTS" value={String(projectCount)} icon={Building2} colorTheme="sky" highlightText="Live" />
        <StatCard label="SUCCESS RATE" value="N/A" icon={ShieldCheck} colorTheme="lemon" highlightText="Pending" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Institution Overview</h3>
              <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">
                {profile?.id || 'ID unavailable'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-bold">Campus</span>
                </div>
                <p>{profileData.campus || 'Not set'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold">Location</span>
                </div>
                <p>{profileData.city || 'Not set'}, {profileData.state || 'Not set'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="font-bold">Email</span>
                </div>
                <p>{profile?.email || 'Not set'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-[#006199] mb-2">
                  <CalendarRange className="w-4 h-4" />
                  <span className="font-bold">Membership</span>
                </div>
                <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center gap-2 text-[#006199] mb-4">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-base font-bold text-slate-900">Research & Civic Focus</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {focus.length === 0 && <span className="text-sm text-slate-500">No research focus added yet.</span>}
              {focus.map((topic) => (
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
              {performancePoints.map((item) => (
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
