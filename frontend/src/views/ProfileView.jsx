import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Bell, Shield, Check, Save, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_PREFS = {
  email: true,
  sms: false,
  inApp: true,
  statusUpdates: true,
  resolutionUpdates: true,
};

export default function ProfileView() {
  const navigate = useNavigate();
  const { user, profile, session, signOut } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [stats, setStats] = useState({ reportsSubmitted: 0, resolutionRate: '—' });
  const [saved, setSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Populate form from the real profile once it loads
  useEffect(() => {
    if (!profile && !user) return;
    setForm({
      name: profile?.name || '',
      email: user?.email || '',
      phone: profile?.profile_data?.phone || '',
      address: profile?.profile_data?.location || '',
    });
    if (profile?.profile_data?.notificationPrefs) {
      setPrefs({ ...DEFAULT_PREFS, ...profile.profile_data.notificationPrefs });
    }
  }, [profile, user]);

  // Real stats from the backend (GET /api/dashboard/stats — citizen branch
  // returns { totalReported, byStatus })
  useEffect(() => {
    if (!session?.access_token) return;
    fetch(`${API_BASE}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res.data;
        if (!data) return;
        const resolved = data.byStatus?.resolved || 0;
        const rate = data.totalReported > 0
          ? `${Math.round((resolved / data.totalReported) * 100)}%`
          : '—';
        setStats({ reportsSubmitted: data.totalReported ?? 0, resolutionRate: rate });
      })
      .catch(() => {});
  }, [session]);

  const displayName = form.name || user?.email?.split('@')[0] || 'Citizen';
  const citizenId = user?.id ? `CIV-${user.id.slice(0, 8).toUpperCase()}` : '';
  const initials = displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const togglePref = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  
  const handleSave = async () => {
  if (!session?.access_token) return;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        name: form.name,
        profile_data: {
          phone: form.phone,
          location: form.address,
          notificationPrefs: prefs,
        },
      }),
    });
    if (!res.ok) throw new Error('Failed to save profile');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  } catch (err) {
    console.error(err);
    // optional: show an error toast/state here
  }
};
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (!error) navigate('/', { replace: true });
    setIsLoggingOut(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Citizen Profile & Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified citizen credentials, contact details, and notification preferences.
          </p>
        </div>
        <button onClick={handleLogout} disabled={isLoggingOut} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60">
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Main Profile Card Header */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-[#006199] text-white flex items-center justify-center text-2xl font-bold border-4 border-[#8ACFF8]/30 shadow-md flex-shrink-0">
            {initials}
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#006199] text-white">
              {citizenId}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{displayName}</h3>
            <p className="text-xs text-slate-500">Citizen Resident</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Reports Logged</p>
            <p className="text-lg font-bold text-[#006199]">{stats.reportsSubmitted}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FFD444]/20 border border-[#FFD444]/40">
            <p className="text-xs text-[#003F66] font-semibold">Resolution Rate</p>
            <p className="text-lg font-black text-[#003F66]">{stats.resolutionRate}</p>
          </div>
        </div>
      </div>

      {/* Personal Information Form */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
          <User className="w-5 h-5 text-[#006199]" />
          <span>Personal Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              disabled
              title="Email is tied to your login and can't be changed here yet"
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences with Animated Toggles */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-[#006199]" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive official case dispatch & resolution receipts via email.' },
            { key: 'sms', label: 'SMS Alerts', desc: 'Get instant SMS notifications when work teams start field repair.' },
            { key: 'inApp', label: 'In-App Alerts', desc: 'Real-time popups and dashboard indicators for status shifts.' },
            { key: 'statusUpdates', label: 'Stage Transition Updates', desc: 'Alert me every time my report moves to a new stage in the timeline.' },
            { key: 'resolutionUpdates', label: 'Resolution & Audit Reports', desc: 'Notify me with before/after photos upon problem resolution.' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => togglePref(item.key)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 flex items-center ${
                  prefs[item.key] ? "bg-[#006199]" : "bg-slate-300"
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-4 h-4 rounded-full shadow-md ${
                    prefs[item.key] ? "bg-[#FFD444] translate-x-6" : "bg-white translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md transition-all ${
              saved ? "bg-emerald-600 text-white" : "bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66]"
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 text-[#006199]" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}