import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import CitizenDashboard from './CitizenDashboard';
import ReportProblem from './ReportProblem';
import MyReports from './MyReports';
import NotificationsView from './NotificationsView';
import ProfileView from './ProfileView';
import ProblemDetail from './ProblemDetail';
import { apiFetch } from '../lib/apiClient';
import { mapProblemsToReports } from '../lib/problemMapper';
import { useAuth } from '../hooks/useAuth';

export default function DashboardApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState('');

  const loadReports = async () => {
    if (!user?.id) return;

    setIsLoadingReports(true);
    setReportsError('');

    try {
      const response = await apiFetch(`/problems?citizen_id=${encodeURIComponent(user.id)}`);
      setReports(mapProblemsToReports(response.data || []));
    } catch (error) {
      setReportsError(error.message || 'Could not load your reports.');
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user?.id]);

  const handleNavigate = (tab) => {
    setSelectedReportId(null);
    setActiveTab(tab);
  };

  const handleSelectReport = (id) => {
    setSelectedReportId(id);
    setActiveTab('report-detail');
  };

  const renderContent = () => {
    if (activeTab === 'report-detail' && selectedReportId) {
      return (
        <ProblemDetail
          report={reports.find((report) => report.id === selectedReportId)}
          onBack={() => handleNavigate('my-reports')}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard':
        return (
          <CitizenDashboard
            reports={reports}
            isLoading={isLoadingReports}
            error={reportsError}
            onNavigate={handleNavigate}
            onSelectReport={handleSelectReport}
          />
        );
      case 'report':
        return (
          <ReportProblem
            onSubmitSuccess={(newReport) => {
              setReports((currentReports) => [newReport, ...currentReports]);
              handleNavigate('my-reports');
            }}
          />
        );
      case 'my-reports':
        return (
          <MyReports
            reports={reports}
            onSelectReport={handleSelectReport}
            onNavigate={handleNavigate}
          />
        );
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <CitizenDashboard
            reports={reports}
            isLoading={isLoadingReports}
            error={reportsError}
            onNavigate={handleNavigate}
            onSelectReport={handleSelectReport}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar — desktop only */}
      <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} unreadCount={2} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-[#006199] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="#FFD444" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black text-[#006199] leading-none">
              Civic<span className="text-[#FFD444]"> Samadhan</span>
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mt-0.5">
              Citizen Portal
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>

        {/* Mobile Bottom Nav */}
        <MobileNav activeTab={activeTab} setActiveTab={handleNavigate} unreadCount={2} />
      </main>
    </div>
  );
}
