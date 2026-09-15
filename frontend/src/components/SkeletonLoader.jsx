import React from 'react';
import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'cards', count = 3 }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card rounded-xl p-5 bg-white space-y-3 animate-pulse">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-8 w-16 bg-[#8ACFF8]/30 rounded-lg" />
            <div className="h-2 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="space-y-6 py-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#8ACFF8]/20 flex-shrink-0" />
            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="premium-card rounded-2xl bg-white overflow-hidden animate-pulse">
          <div className="h-44 w-full bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-24 bg-[#8ACFF8]/30 rounded" />
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
