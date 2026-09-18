import React, { useEffect, useState } from 'react';
import { BadgeCheck, Building2, CalendarRange, Mail, MapPin, ShieldCheck, Sparkles, LogOut } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { apiFetch } from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function GovernmentProfile() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [problemCount, setProblemCount] = useState(0);
  const [solutionCount, setSolutionCount] = useState(0);
  const [error, setError] = useState('');
  const profileData = profile?.profile_data || {};

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (!error) navigate('/', { replace: true });
    setIsLoggingOut(false);
  };

  useEffect(() => {
    Promise.all([apiFetch('/problems'), apiFetch('/solutions')])
      .then(([problemsResponse, solutionsResponse]) => {
        setProblemCount((problemsResponse.data || []).length);
        setSolutionCount((solutionsResponse.data || []).length);
      })
      .catch((loadError) => setError(loadError.message || 'Could not load government profile activity.'));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div className="flex items-start gap-4"><div className="w-16 h-16 rounded-2xl bg-[#006199] flex items-center justify-center"><Building2 className="w-8 h-8 text-[#FFD444]" /></div><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1"><Sparkles className="w-4 h-4 text-[#FFD444]" /> Government Profile</div><h2 className="text-2xl sm:text-3xl font-black text-slate-900">{profile?.name || 'Government Partner'}</h2><p className="text-xs sm:text-sm text-slate-500 mt-1">{profileData.department || profileData.type || 'Government account'}</p></div></div><div className="flex flex-col sm:flex-row gap-2"><span className="inline-flex items-center gap-2 rounded-xl bg-[#FFD444] px-4 py-3 text-sm font-bold text-[#003F66]"><BadgeCheck className="w-4 h-4 text-[#006199]" /> Verified Official</span><button onClick={handleLogout} disabled={isLoggingOut} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-60"><LogOut className="w-4 h-4" />{isLoggingOut ? 'Logging out...' : 'Logout'}</button></div></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><StatCard label="PROBLEMS REVIEWED" value={String(problemCount)} icon={Building2} colorTheme="sky" highlightText="Live" /><StatCard label="SOLUTIONS TRACKED" value={String(solutionCount)} icon={ShieldCheck} colorTheme="gold" highlightText="Live" /><StatCard label="JURISDICTION" value={profileData.city || 'N/A'} icon={MapPin} colorTheme="sky" highlightText="Location" /><StatCard label="ACCESS" value="Active" icon={BadgeCheck} colorTheme="lemon" highlightText="Verified" /></div>
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6"><div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"><div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold text-slate-900">Department Overview</h3><span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">{profile?.id || 'ID unavailable'}</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700"><div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><Building2 className="w-4 h-4" /><b>Department</b></div><p>{profileData.department || 'Not set'}</p></div><div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><MapPin className="w-4 h-4" /><b>Jurisdiction</b></div><p>{profileData.city || 'Not set'}, {profileData.state || 'Not set'}</p></div><div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><Mail className="w-4 h-4" /><b>Email</b></div><p>{profile?.email || 'Not set'}</p></div><div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><div className="flex items-center gap-2 text-[#006199] mb-2"><CalendarRange className="w-4 h-4" /><b>Membership</b></div><p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : 'Not set'}</p></div></div></div><div className="premium-card rounded-2xl p-5 bg-white border border-slate-200/80"><div className="flex items-center gap-2 text-[#006199] mb-4"><ShieldCheck className="w-5 h-5" /><h3 className="text-base font-bold text-slate-900">Access Verification</h3></div><div className="space-y-3 text-sm text-slate-700"><div className="flex items-center gap-3 rounded-xl bg-[#006199]/5 p-3"><BadgeCheck className="w-4 h-4 text-[#006199]" />Government identity verified</div><div className="flex items-center gap-3 rounded-xl bg-[#8ACFF8]/10 p-3"><Sparkles className="w-4 h-4 text-[#006199]" />Oversight access enabled</div></div></div></div>
      </div>
  );
}
