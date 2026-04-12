import React from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import GlobalPresenceCard from '../../components/admin/GlobalPresenceCard';

const AdminRegions = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-base">map</span>
              <span className="text-xs font-black uppercase tracking-widest mt-0.5">Home Page</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Regions We Serve</h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage the countries and states displayed on the public site.
            </p>
          </div>
        </div>

        <GlobalPresenceCard />
      </main>
    </div>
  );
};

export default AdminRegions;
