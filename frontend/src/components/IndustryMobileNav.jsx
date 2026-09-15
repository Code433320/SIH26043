import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Building2, Menu, X, LayoutDashboard, Compass, Handshake, User } from 'lucide-react';

const navItems = [
  { to: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/industry/explore-solutions', label: 'Explore Solutions', icon: Compass, isCta: true },
  { to: '/industry/my-engagements', label: 'My Engagements', icon: Handshake },
  { to: '/industry/profile', label: 'Profile', icon: User },
];

export default function IndustryMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#006199] flex items-center justify-center text-white">
          <Building2 className="w-5 h-5 text-[#FFD444]" />
        </div>
        <h1 className="text-base font-black tracking-tight text-[#006199]">
          Civic<span className="text-[#FFD444]"> Samadhan</span>
        </h1>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-[#006199] text-white"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-[57px] left-0 right-0 bg-white border-b border-slate-200 p-4 z-50 shadow-xl space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    {({ isActive }) => (
                      <div
                        className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 text-sm font-semibold ${
                          item.isCta
                            ? 'bg-[#FFD444] text-[#003F66]'
                            : isActive
                            ? 'bg-[#006199] text-white'
                            : 'text-slate-700 bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
