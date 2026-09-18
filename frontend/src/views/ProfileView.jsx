import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Bell, Shield, Check, Save, LogOut } from 'lucide-react';
import { CITIZEN_PROFILE } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProfileView() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(CITIZEN_PROFILE);
  const [prefs, setPrefs] = useState(CITIZEN_PROFILE.notificationPrefs);
  const [saved, setSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const togglePref = (key) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-[#8ACFF8]/30 shadow-md" 
          />
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#006199] text-white">
              {profile.citizenId}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{profile.name}</h3>
            <p className="text-xs text-slate-500">Citizen Resident • Member since {profile.memberSince}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Reports Logged</p>
            <p className="text-lg font-bold text-[#006199]">{profile.reportsSubmitted}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#FFD444]/20 border border-[#FFD444]/40">
            <p className="text-xs text-[#003F66] font-semibold">Resolution Rate</p>
            <p className="text-lg font-black text-[#003F66]">{profile.resolutionRate}</p>
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
              value={profile.name} 
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]" 
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]" 
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              value={profile.phone} 
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-medium outline-none focus:border-[#006199]" 
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Registered Address</label>
            <input 
              type="text" 
              value={profile.address} 
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
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

              {/* Framer Motion Animated Spring Toggle */}
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

        {/* Save Button */}
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
