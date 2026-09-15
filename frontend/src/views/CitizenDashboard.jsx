import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  MapPin
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ReportCard from '../components/ReportCard';
import StatusBadge from '../components/StatusBadge';

export default function CitizenDashboard({ reports = [], onNavigate, onSelectReport }) {
  const recentReports = reports.slice(0, 3);

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, staggerChildren: 0.1 } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#8ACFF8]/10 to-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#006199] mb-1">
            <Sparkles className="w-4 h-4 text-[#FFD444]" />
            <span>Civic Samadhan Portal • Citizen Problem Resolution</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Good morning, Citizen.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your reported problems and civic updates.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('report')}
          className="px-6 py-3 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-[#FFD444]/30 border border-[#FFD444] flex-shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-[#006199]" />
          <span>Report a Problem</span>
        </motion.button>
      </div>

      {/* 4 Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL REPORTS"
          value="12"
          icon={FileText}
          colorTheme="sky"
          highlightText="100% Verified"
        />
        <StatCard
          label="IN PROGRESS"
          value="4"
          icon={Clock}
          colorTheme="gold"
          highlightText="Active Repair"
        />
        <StatCard
          label="RESOLVED"
          value="7"
          icon={CheckCircle2}
          colorTheme="sky"
          highlightText="87.5% Closed"
        />
        <StatCard
          label="PENDING"
          value="1"
          icon={AlertCircle}
          colorTheme="lemon"
          highlightText="Queued"
        />
      </div>

      {/* Report Overview Pipeline Visualization */}
      <div className="premium-card rounded-2xl p-6 bg-white border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Resolution Pipeline Overview</h3>
            <p className="text-xs text-slate-500">Live processing distribution across municipal wards</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006199] bg-[#8ACFF8]/20 px-2.5 py-1 rounded-md">
            Average SLA: 2.4 Days
          </span>
        </div>

        {/* Custom Progress Bar Segment */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 space-x-1">
          <div className="h-full bg-[#006199] rounded-l-full w-[25%]" title="Submitted (25%)" />
          <div className="h-full bg-[#8ACFF8] w-[20%]" title="Categorized (20%)" />
          <div className="h-full bg-[#FFD444] w-[35%]" title="In Progress (35%)" />
          <div className="h-full bg-emerald-500 rounded-r-full w-[20%]" title="Resolved (20%)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#006199]" />
            <span className="text-slate-600 font-medium">Submitted (1)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#8ACFF8]" />
            <span className="text-slate-600 font-medium">Categorized (2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FFD444]" />
            <span className="text-slate-600 font-medium">In Progress (4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolved (7)</span>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
            <p className="text-xs text-slate-500">Your latest submitted civic requests</p>
          </div>
          <button
            onClick={() => onNavigate('my-reports')}
            className="text-xs font-bold text-[#006199] hover:underline flex items-center space-x-1"
          >
            <span>View All Reports ({reports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onSelectReport(report.id)}
            />
          ))}
        </div>
      </div>

      {/* Quick Action CTA Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8ACFF8]/30 via-white to-[#8ACFF8]/20 border border-[#8ACFF8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#006199] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <MapPin className="w-6 h-6 text-[#FFD444]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Something needs attention?</h4>
            <p className="text-xs text-slate-600">
              Report a civic problem in your ward and transparently track municipal action.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('report')}
          className="px-5 py-2.5 rounded-xl bg-[#FFD444] hover:bg-[#ffe066] text-[#003F66] font-bold text-xs flex items-center space-x-2 shadow-md flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#006199]" />
          <span>Report a Problem</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
