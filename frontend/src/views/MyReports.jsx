import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, PlusCircle } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import EmptyState from '../components/EmptyState';

export default function MyReports({ reports = [], onSelectReport, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Filtering Logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track every civic problem you've reported and monitor real-time municipal updates.
          </p>
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

      {/* Filter and Search Bar Controls */}
      <div className="premium-card rounded-2xl p-4 bg-white border border-slate-200/80 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#006199]" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Report ID, title, location..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-[#006199] focus:ring-2 focus:ring-[#006199]/20 outline-none text-xs font-medium transition-all"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#006199]"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="PENDING">Pending</option>
              <option value="SUBMITTED">Submitted</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#006199]"
            >
              <option value="ALL">All Categories</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Garbage / Waste">Garbage / Waste</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Light">Street Light</option>
              <option value="Drainage">Drainage</option>
              <option value="Public Infrastructure">Public Infrastructure</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl space-x-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? "bg-white text-[#006199] shadow-xs" : "text-slate-400 hover:text-slate-600"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? "bg-[#006199] text-white shadow-xs" : "text-slate-400 hover:text-slate-600"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Display Container */}
      {filteredReports.length === 0 ? (
        <EmptyState 
          title="No Reports Match Filters"
          message="Try clearing your search term or adjusting status and category filters."
          onAction={() => { setSearchTerm(''); setStatusFilter('ALL'); setCategoryFilter('ALL'); }}
        />
      ) : (
        <motion.div 
          layout
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-3"
          }
        >
          <AnimatePresence>
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                viewMode={viewMode}
                onClick={() => onSelectReport(report.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
