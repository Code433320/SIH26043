import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/university/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/university/find-problems', label: 'Find Problems', icon: Search, isCta: true },
  { to: '/university/my-projects', label: 'My Projects', icon: Briefcase },
  { to: '/university/profile', label: 'Profile', icon: User },
];

export default function UniversitySidebar() {
  const { user, profile } = useAuth();

  const displayName =
    profile?.name || profile?.profile_data?.institution || user?.email?.split('@')[0] || 'University';
  const displayId = user?.id ? `UNIV-${user.id.slice(0, 8).toUpperCase()}` : '';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none hidden lg:flex">
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#006199] flex items-center justify-center text-white shadow-md shadow-[#006199]/20">
            <GraduationCap className="w-6 h-6 text-[#FFD444]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-[#006199] leading-none">
              Civic<span className="text-[#FFD444] font-black"> Samadhan</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase mt-1">
              University Portal
            </p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isCta) {
              return (
                <NavLink key={item.to} to={item.to} className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full my-3 px-4 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold flex items-center justify-between shadow-md shadow-[#FFD444]/30 transition-all border border-[#FFD444]"
                  >
                    <span className="flex items-center space-x-2 text-sm">
                      <Search className="w-5 h-5 text-[#006199]" />
                      <span>{item.label}</span>
                    </span>
                  </motion.div>
                </NavLink>
              );
            }

            return (
              <NavLink key={item.to} to={item.to} className="block">
                {({ isActive }) => (
                  <div
                    className={`w-full relative px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold transition-colors duration-150 ${
                      isActive ? 'text-white font-bold' : 'text-slate-600 hover:text-[#006199] hover:bg-slate-50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="universityActiveNav"
                        className="absolute inset-0 bg-[#006199] rounded-xl shadow-md shadow-[#006199]/20"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#FFD444]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
        <Link
          to="/university/profile"
          className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between group hover:border-[#006199]/30 transition-colors"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#006199] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 border border-[#006199]/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                {displayId}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#006199] transition-colors flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}