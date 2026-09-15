import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function StatusTimeline({ timeline = [] }) {
  // Container stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative py-2 px-1">
      {/* Background Vertical Line */}
      <div className="absolute left-[19px] top-6 bottom-6 w-1 bg-[#8ACFF8]/30 rounded-full" />
      
      {/* Animated Fill Bar */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "70%" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute left-[19px] top-6 w-1 bg-[#006199] rounded-full z-0 origin-top"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-7 relative z-10"
      >
        {timeline.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';
          const isUpcoming = step.status === 'upcoming';

          return (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              className="flex items-start space-x-4 group"
            >
              {/* Timeline Icon Node */}
              <div className="relative flex-shrink-0 mt-0.5">
                {isCompleted && (
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    className="w-10 h-10 rounded-full bg-[#006199] text-white flex items-center justify-center shadow-md shadow-[#006199]/20"
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </motion.div>
                )}

                {isActive && (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-10 h-10 rounded-full bg-[#FFD444] text-[#003F66] flex items-center justify-center gold-active-glow border-2 border-white ring-4 ring-[#FFD444]/30"
                  >
                    <Clock className="w-5 h-5 stroke-[2.5] text-[#003F66]" />
                  </motion.div>
                )}

                {isUpcoming && (
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 border-2 border-slate-200 flex items-center justify-center">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Timeline Step Content Card */}
              <div 
                className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                  isActive 
                    ? "bg-[#FFD444]/10 border-[#FFD444] shadow-sm" 
                    : isCompleted 
                    ? "bg-white border-slate-200/90 shadow-xs hover:border-[#006199]/40" 
                    : "bg-slate-50/70 border-slate-200/50 text-slate-400 opacity-80"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${
                      isActive ? "text-[#003F66]" : isCompleted ? "text-[#006199]" : "text-slate-400"
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFD444] text-[#003F66] animate-pulse">
                        LIVE STAGE
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {step.timestamp}
                  </span>
                </div>

                <p className={`text-sm mt-1 leading-relaxed ${
                  isActive ? "text-slate-900 font-semibold" : isCompleted ? "text-slate-700" : "text-slate-500"
                }`}>
                  {step.desc}
                </p>

                {isActive && (
                  <div className="mt-3 pt-2 border-t border-[#FFD444]/30 flex items-center justify-between text-xs text-[#003F66] font-semibold">
                    <span>Field Action in Progress</span>
                    <span className="flex items-center text-[#006199]">
                      View Log <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
