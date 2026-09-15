import React from 'react';
import { Outlet } from 'react-router-dom';
import GovernmentSidebar from '../../components/GovernmentSidebar';
import GovernmentMobileNav from '../../components/GovernmentMobileNav';

export default function GovernmentLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased">
      <GovernmentSidebar />
      <GovernmentMobileNav />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>
    </div>
  );
}
