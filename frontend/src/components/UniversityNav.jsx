import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  User,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { to: '/university/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/university/find-problems', label: 'Find Problems', icon: Search, isCta: true },
  { to: '/university/my-projects', label: 'My Projects', icon: Briefcase },
  { to: '/university/profile', label: 'Profile', icon: User },
];

export default function UniversityNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#006199] flex items-center justify-center shadow-md shadow-[#006199]/20">
            <GraduationCap className="w-5 h-5 text-[#FFD444]" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-[#006199] leading-none">
              Civic<span className="text-[#FFD444] font-black"> Samadhan</span>
            </h1>
            <p className="text-[9px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
              University Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-lg bg-[#006199] text-white shadow-sm"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            <motion.nav
              initial={{ y: '-12%' }}
              animate={{ y: 0 }}
              exit={{ y: '-12%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed left-0 right-0 top-[60px] bg-white border-b border-slate-200 p-4 z-50 shadow-xl space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;

                if (item.isCta) {
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 rounded-xl bg-[#FFD444] text-[#003F66] font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444]"
                      >
                        <Search className="w-4 h-4 text-[#006199]" />
                        <span>{item.label}</span>
                      </motion.div>
                    </NavLink>
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    {({ isActive }) => (
                      <div
                        className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#006199] text-white'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}