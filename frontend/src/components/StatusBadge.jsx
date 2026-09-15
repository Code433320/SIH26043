import React from 'react';
import { Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = <Clock className="w-3.5 h-3.5 mr-1" />;
  let label = status;

  switch (status) {
    case 'IN PROGRESS':
      badgeStyle = "bg-[#FFD444]/15 text-[#003F66] border-[#FFD444] shadow-sm";
      icon = <Activity className="w-3.5 h-3.5 mr-1 text-[#006199] animate-pulse" />;
      break;
    case 'RESOLVED':
      badgeStyle = "bg-[#006199]/10 text-[#006199] border-[#006199]/30 font-semibold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#006199]" />;
      break;
    case 'PENDING':
    case 'SUBMITTED':
      badgeStyle = "bg-[#8ACFF8]/20 text-[#00446D] border-[#8ACFF8]/40";
      icon = <Clock className="w-3.5 h-3.5 mr-1 text-[#006199]" />;
      break;
    case 'CATEGORIZED':
    case 'ASSIGNED':
      badgeStyle = "bg-[#F4EB6C]/30 text-[#003F66] border-[#F4EB6C]";
      icon = <AlertCircle className="w-3.5 h-3.5 mr-1 text-[#006199]" />;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${badgeStyle}`}>
      {icon}
      {label}
    </span>
  );
}
