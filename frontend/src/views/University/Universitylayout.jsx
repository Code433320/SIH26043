import React from 'react';
import { Outlet } from 'react-router-dom';
import UniversitySidebar from '../../components/UniversitySidebar';
import UniversityNav from '../../components/UniversityNav';

export default function UniversityLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased">
      <UniversitySidebar />
      <UniversityNav />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>
    </div>
  );
}