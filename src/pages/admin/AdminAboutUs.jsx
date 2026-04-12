import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminTimelineSection from "../../components/admin/AdminTimelineSection";

const AdminAboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
      <AdminNavbar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-base">info</span>
              <span className="text-xs font-black uppercase tracking-widest mt-0.5">
                Nexturn CMS
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              About Us Content Hub
            </h1>
            <p className="text-black font-medium max-w-2xl leading-relaxed text-sm">
              Manage your company's narrative, global presence metrics, and
              export milestones in one place.
            </p>
          </div>

          <button
            onClick={() => console.log("Publishing all changes...")}
            className="flex items-center gap-3 bg-[#1b365d] hover:bg-[#2c4c7c] text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#1b365d]/20 active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">save</span>
            Publish Changes
          </button>
        </div>

        <div className="flex items-center gap-8 border-b border-slate-200 mb-12">
          {["Export Stats"].map((tab, idx) => (
            <button
              key={tab}
              className={`flex items-center gap-2 py-4 border-b-2 font-black text-xs uppercase tracking-widest transition-all cursor-pointer ${idx === 0 ? "border-blue-600 text-black" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <span className="material-symbols-outlined text-base">
                {idx === 0 ? "insert_chart" : idx === 1 ? "public" : "timeline"}
              </span>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <AdminTimelineSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutUs;
