import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Bell, 
  User 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function MobileNav({ activeTab, setActiveTab, unreadCount = 2 }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Citizen';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report a Problem', icon: PlusCircle, isCta: true },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#006199] flex items-center justify-center text-white">
          <ShieldCheck className="w-5 h-5 text-[#FFD444]" />
        </div>
        <h1 className="text-base font-black tracking-tight text-[#006199]">
          Civic<span className="text-[#FFD444]"> Samadhan</span>
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleSelect('profile')}
          className="w-8 h-8 rounded-full bg-[#006199] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0"
          title={displayName}
        >
          {displayName.slice(0, 2).toUpperCase()}
        </button>

        <button 
          onClick={() => handleSelect('notifications')} 
          className="p-2 rounded-lg bg-slate-100 text-slate-600 relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#FFD444] border-2 border-white" />
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#006199] text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Slide-down Drawer */}
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
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[57px] left-0 right-0 bg-white border-b border-slate-200 p-4 z-50 shadow-xl space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (item.isCta) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className="w-full my-2 px-4 py-3 rounded-xl bg-[#FFD444] text-[#003F66] font-bold flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <PlusCircle className="w-5 h-5 text-[#006199]" />
                      <span>Report a Problem</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-sm font-semibold ${
                      isActive ? "bg-[#006199] text-white" : "text-slate-700 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD444] text-[#003F66] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}