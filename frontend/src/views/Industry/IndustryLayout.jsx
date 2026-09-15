import React from 'react';
import { Outlet } from 'react-router-dom';
import IndustrySidebar from '../../components/IndustrySidebar';
import IndustryMobileNav from '../../components/IndustryMobileNav';

export default function IndustryLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased">
      <IndustrySidebar />
      <IndustryMobileNav />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>
    </div>
  );
}
