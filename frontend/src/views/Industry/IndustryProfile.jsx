import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Building2,
  CalendarRange,
  ShieldCheck,
  Sparkles,
  Handshake,
  BadgeCheck,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';

export default function IndustryProfile() {
  const { profile } = useAuth();
  const [engagementCount, setEngagementCount] = useState(0);
  const [profileError, setProfileError] = useState('');
  const profileData = profile?.profile_data || {};

  useEffect(() => {
    apiFetch('/engagements')
      .then((response) => setEngagementCount((response.data || []).length))
      .catch((error) => setProfileError(error.message || 'Could not load profile activity.'));
  }, []);

  const focus = profileData.domainInterest || profileData.focus || 'Not set';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#006199] to-[#8ACFF8] text-white flex items-center justify-center shadow-md"><Building2 className="w-9 h-9 text-[#FFD444]" /></div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1"><Sparkles className="w-4 h-4 text-[#FFD444]" /> Industry Profile</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{profile?.name || 'Industry Partner'}</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'} • {profileData.type || 'Industry / NGO account'}</p>
            </div>
          </div>
          <button className="px-5 py-3 rounded-xl bg-[#FFD444] text-[#003F66] font-bold text-sm flex items-center justify-center gap-2"><BadgeCheck className="w-4 h-4 text-[#006199]" /> Verified Partner</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="ENGAGEMENTS" value={String(engagementCount)} icon={Handshake} colorTheme="sky" highlightText="Live" />
        <StatCard label="CITY" value={profileData.city || 'N/A'} icon={MapPin} colorTheme="gold" highlightText="Location" />
        <StatCard label="FOCUS AREA" value={String(focus)} icon={Sparkles} colorTheme="sky" highlightText="Profile" />
        <StatCard label="VERIFICATION" value="Active" icon={ShieldCheck} colorTheme="lemon" highlightText="Verified" />
      </div>

      {profileError && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{profileError}</p>}

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80">
            <div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold text-slate-900">Organization Overview</h3><span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">{profile?.id || 'ID unavailable'}</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><Building2 className="w-4 h-4" /><span className="font-bold">Organization</span></div><p>{profile?.name || 'Not set'}</p></div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><MapPin className="w-4 h-4" /><span className="font-bold">Location</span></div><p>{profileData.city || 'Not set'}, {profileData.state || 'Not set'}</p></div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><Mail className="w-4 h-4" /><span className="font-bold">Email</span></div><p>{profile?.email || 'Not set'}</p></div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><CalendarRange className="w-4 h-4" /><span className="font-bold">Membership</span></div><p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : 'Not set'}</p></div>
            </div>
          </div>

          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"><div className="flex items-center gap-2 text-[#006199] mb-4"><Sparkles className="w-4 h-4" /><h3 className="text-base font-bold text-slate-900">Partnership Focus</h3></div><p className="text-sm text-slate-600">{focus}</p></div>
        </div>

        <div className="space-y-6">
          <div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"><div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold text-slate-900">Verification</h3><ShieldCheck className="w-5 h-5 text-[#006199]" /></div><div className="space-y-3 text-sm text-slate-700"><div className="flex items-center gap-3 rounded-xl bg-[#006199]/5 border border-[#006199]/10 p-3"><BadgeCheck className="w-4 h-4 text-[#006199]" /><span>Partner account verified</span></div><div className="flex items-center gap-3 rounded-xl bg-[#FFD444]/10 border border-[#FFD444]/20 p-3"><Handshake className="w-4 h-4 text-[#003F66]" /><span>Civic collaboration enabled</span></div><div className="flex items-center gap-3 rounded-xl bg-[#8ACFF8]/10 border border-[#8ACFF8]/20 p-3"><Sparkles className="w-4 h-4 text-[#006199]" /><span>Funding and mentorship access active</span></div></div></div>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80"><div className="flex items-center justify-between gap-3"><div><h3 className="text-base font-bold text-slate-900">Partnership Summary</h3><p className="text-xs text-slate-500">Support university-built solutions with transparent civic impact.</p></div><button className="inline-flex items-center gap-2 text-xs font-bold text-[#006199] hover:underline"><span>Manage Access</span><ArrowRight className="w-3.5 h-3.5" /></button></div></div>
    </motion.div>
  )
};
