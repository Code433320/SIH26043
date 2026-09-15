import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReportCard({ report, onClick, viewMode = 'grid' }) {
  const thumbnail = report.media && report.media.length > 0 ? report.media[0].url : null;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ x: 4, transition: { duration: 0.15 } }}
        onClick={onClick}
        className="premium-card rounded-xl p-4 cursor-pointer bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 group border border-slate-200/80 hover:border-[#006199]/40"
      >
        <div className="flex items-center space-x-4 min-w-0">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={report.title} 
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-100" 
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-[#8ACFF8]/20 flex items-center justify-center flex-shrink-0 text-[#006199]">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#006199]">
                {report.id}
              </span>
              <span className="text-xs font-medium text-slate-500">{report.category}</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-[#006199] transition-colors truncate text-base">
              {report.title}
            </h4>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1 truncate">
              <span className="flex items-center truncate">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#006199] flex-shrink-0" />
                <span className="truncate">{report.location}</span>
              </span>
              <span className="hidden md:flex items-center text-slate-400">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {report.submittedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <StatusBadge status={report.status} />
          <motion.div 
            className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#FFD444] text-slate-400 group-hover:text-[#003F66] flex items-center justify-center transition-all shadow-xs"
          >
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="premium-card rounded-2xl overflow-hidden cursor-pointer bg-white group border border-slate-200/80 hover:border-[#006199]/40 flex flex-col justify-between"
    >
      <div>
        {/* Media Header */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={report.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#006199]/10 to-[#8ACFF8]/30 flex items-center justify-center text-[#006199]">
              <ImageIcon className="w-10 h-10 opacity-60" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#006199] text-white shadow-xs">
              {report.id}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <span className="text-xs font-bold tracking-wider text-[#006199] uppercase mb-1 block">
            {report.category}
          </span>
          <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#006199] transition-colors line-clamp-1 mb-2">
            {report.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {report.description}
          </p>

          <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center text-slate-600 truncate">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#006199] flex-shrink-0" />
              <span className="truncate">{report.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Submitted: {report.submittedDate}
              </span>
              <span className="flex items-center text-[#006199]">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {report.lastUpdated ? 'Updated' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-5 py-3 bg-slate-50 group-hover:bg-[#8ACFF8]/15 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#006199] transition-colors">
        <span>Track Case Details</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#006199]" />
      </div>
    </motion.div>
  );
}
