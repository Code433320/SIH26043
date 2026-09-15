import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// Main Views
import CitizenDashboard from './views/CitizenDashboard';
import ReportProblem from './views/ReportProblem';
import MyReports from './views/MyReports';
import ProblemDetail from './views/ProblemDetail';
import NotificationsView from './views/NotificationsView';
import ProfileView from './views/ProfileView';

// Mock Data
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedReportId, setSelectedReportId] = useState('CIV-2026-1048');

  // Handle navigate to specific report detail
  const handleSelectReport = (reportId) => {
    setSelectedReportId(reportId);
    setActiveTab('problem-detail');
  };

  // Handle new report submission success
  const handleReportSubmitted = (newReport) => {
    setReports([newReport, ...reports]);
    // Add new notification
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      reportId: newReport.id,
      title: "Problem Report Created Successfully",
      message: `Your report ${newReport.id} '${newReport.title}' has been logged and queued for AI classification.`,
      timestamp: "Just Now",
      read: false,
      category: "SUBMITTED",
      icon: "Activity"
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Handle mark single notification read
  const handleMarkRead = (notifId) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // Handle mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const selectedReportObj = reports.find(r => r.id === selectedReportId) || reports[0];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Page Transition Variants
  const pageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased">
      {/* Desktop Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={unreadCount} 
      />

      {/* Mobile Top Navbar */}
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadCount={unreadCount} 
      />

      {/* Main Spacious Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransition}>
              <CitizenDashboard 
                reports={reports}
                onNavigate={setActiveTab}
                onSelectReport={handleSelectReport}
              />
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div key="report" {...pageTransition}>
              <ReportProblem 
                onSubmitSuccess={handleReportSubmitted}
                onNavigate={(tab, reportId) => {
                  if (reportId) setSelectedReportId(reportId);
                  setActiveTab(tab);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'my-reports' && (
            <motion.div key="my-reports" {...pageTransition}>
              <MyReports 
                reports={reports}
                onSelectReport={handleSelectReport}
                onNavigate={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'problem-detail' && (
            <motion.div key="problem-detail" {...pageTransition}>
              <ProblemDetail 
                report={selectedReportObj}
                onBack={() => setActiveTab('my-reports')}
              />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div key="notifications" {...pageTransition}>
              <NotificationsView 
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onSelectReport={handleSelectReport}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" {...pageTransition}>
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
