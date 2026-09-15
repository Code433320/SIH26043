import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, colorTheme, highlightText, accentBorder }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / (end || 1)));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 30));

    return () => clearInterval(timer);
  }, [value]);

  // Color theme logic mapping to strictly controlled palette
  let accentClass = "border-l-4 border-[#006199]";
  let iconContainer = "bg-[#006199]/10 text-[#006199]";

  if (colorTheme === 'gold') {
    accentClass = "border-l-4 border-[#FFD444]";
    iconContainer = "bg-[#FFD444]/20 text-[#003F66]";
  } else if (colorTheme === 'sky') {
    accentClass = "border-l-4 border-[#8ACFF8]";
    iconContainer = "bg-[#8ACFF8]/30 text-[#006199]";
  } else if (colorTheme === 'lemon') {
    accentClass = "border-l-4 border-[#F4EB6C]";
    iconContainer = "bg-[#F4EB6C]/40 text-[#003F66]";
  }

  return (
    <motion.div 
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`premium-card rounded-xl p-5 relative overflow-hidden bg-white ${accentClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-[#006199] tracking-tight">
              {isNaN(value) ? value : count}
            </h3>
            {highlightText && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F4EB6C]/50 text-[#003F66]">
                {highlightText}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconContainer} transition-transform hover:scale-105`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Verified Civic Record</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006199]/60"></span>
      </div>
    </motion.div>
  );
}
