import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Activity, UserCheck, CheckCircle2, BellRing, ArrowRight } from 'lucide-react';

export default function NotificationCard({ notification, onRead, onClick }) {
  let IconComponent = Activity;
  let iconBg = "bg-[#006199]/10 text-[#006199]";

  switch (notification.icon) {
    case 'Truck':
      IconComponent = Truck;
      iconBg = "bg-[#FFD444]/20 text-[#003F66]";
      break;
    case 'Activity':
      IconComponent = Activity;
      iconBg = "bg-[#006199]/10 text-[#006199]";
      break;
    case 'UserCheck':
      IconComponent = UserCheck;
      iconBg = "bg-[#8ACFF8]/30 text-[#006199]";
      break;
    case 'CheckCircle2':
      IconComponent = CheckCircle2;
      iconBg = "bg-[#006199]/15 text-[#006199]";
      break;
    default:
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
      onClick={() => {
        onRead(notification.id);
        if (onClick) onClick(notification.reportId);
      }}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${
        notification.read
          ? "bg-white border-slate-200/80 hover:border-[#006199]/30"
          : "bg-[#8ACFF8]/10 border-[#8ACFF8]/60 shadow-xs"
      }`}
    >
      <div className="flex items-start space-x-3.5">
        <div className={`p-2.5 rounded-xl ${iconBg} flex-shrink-0 mt-0.5`}>
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#006199] font-mono">
              {notification.reportId}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {notification.timestamp}
            </span>
          </div>

          <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
            {notification.title}
          </h5>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {notification.message}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Official Update
            </span>
            <span className="text-xs font-semibold text-[#006199] flex items-center group-hover:underline">
              View Case <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>

        {!notification.read && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD444] border border-white flex-shrink-0 mt-1.5" />
        )}
      </div>
    </motion.div>
  );
}
