import React, { useState } from 'react';

const AdminStatsSection = () => {
  const [stats, setStats] = useState({
    years: "12",
    countries: "45",
    volume: "1.2M"
  });

  const handleUpdate = () => {
    // Simulated save action
    console.log("Saving stats:", stats);
    alert("Stats updated focus success!");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-black tracking-tight">Key Stats</h3>
        <span className="material-symbols-outlined text-slate-400 rotate-45 select-none">show_chart</span>
      </div>

      <div className="space-y-6">
        {/* Years of Experience */}
        <div className="space-y-2">
          <label className="text-xs font-black text-black/50 uppercase tracking-widest pl-1">
            Years of Experience
          </label>
          <div className="relative group">
            <input 
              type="number" 
              value={stats.years}
              onChange={(e) => setStats({...stats, years: e.target.value})}
              onWheel={(e) => e.target.blur()}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-32 py-4 text-2xl font-black text-black outline-none group-hover:border-[#1b365d]/20 transition-all focus:border-[#1b365d] focus:bg-white"
            />
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-black/50 font-bold select-none">Years</span>
          </div>
        </div>

        {/* Countries Count */}
        <div className="space-y-2">
          <label className="text-xs font-black text-black/50 uppercase tracking-widest pl-1">
            Countries Count
          </label>
          <div className="relative group">
            <input 
              type="number" 
              value={stats.countries}
              onChange={(e) => setStats({...stats, countries: e.target.value})}
              onWheel={(e) => e.target.blur()}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-32 py-4 text-2xl font-black text-black outline-none group-hover:border-[#1b365d]/20 transition-all focus:border-[#1b365d] focus:bg-white"
            />
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-black/50 font-bold select-none">Nations</span>
          </div>
        </div>


        {/* Annual Export Volume */}
        <div className="space-y-2">
          <label className="text-xs font-black text-black/50 uppercase tracking-widest pl-1">
            Annual Export Volume
          </label>
          <div className="relative group">
            <input 
              type="text" 
              value={stats.volume}
              onChange={(e) => setStats({...stats, volume: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-32 py-4 text-2xl font-black text-black outline-none group-hover:border-[#1b365d]/20 transition-all focus:border-[#1b365d] focus:bg-white"
            />
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-black/50 font-bold select-none">Units</span>
          </div>
        </div>

          {/* <button 
            onClick={handleUpdate}
            className="w-full bg-[#1b365d] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#2c4c7c] transition-all shadow-xl shadow-[#1b365d]/20 active:scale-[0.98] cursor-pointer mt-4"
          >
            Update Stats
          </button> */}
      </div>
    </div>
  );
};

export default AdminStatsSection;

