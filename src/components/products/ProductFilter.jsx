import { useState } from "react";

const ProductFilter = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [application, setApplication] = useState("All Applications");

  const handleClear = () => {
    setSearch("");
    setCategory("All Categories");
    setApplication("All Applications");
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-12">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm space-y-10">
        {/* Filter Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[#1b365d]">
            <span className="material-symbols-outlined font-black">filter_list</span>
            <h2 className="text-xl font-black tracking-tight">Filter Materials</h2>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 text-[#1b365d] text-[10px] font-black uppercase tracking-widest hover:text-[#e17000] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">cancel</span>
            Clear Selection
          </button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-[#1b365d]/70 uppercase tracking-widest pl-1">
            Search Materials
          </label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-[#1b365d] transition-colors text-xl">
              search
            </span>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by material name or grade..."
              className="w-full bg-[#fafbfc] border border-slate-100 rounded-xl py-3.5 pl-14 pr-8 text-slate-600 font-medium text-sm focus:outline-none focus:border-[#1b365d] focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#1b365d]/70 uppercase tracking-widest pl-1">
              Material Category
            </label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-[#fafbfc] border border-slate-100 rounded-xl py-3.5 px-6 text-slate-600 font-bold text-sm focus:outline-none focus:border-[#1b365d] focus:bg-white transition-all cursor-pointer shadow-sm"
              >
                <option>All Categories</option>
                <option>Free-Cutting Metal (2)</option>
                <option>Lead-Free Materials (1)</option>
                <option>High-Strength Alloys (1)</option>
                <option>Standard Metal (1)</option>
                <option>High Copper Content (1)</option>
              </select>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-xl">
                expand_more
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#1b365d]/70 uppercase tracking-widest pl-1">
              Application Type
            </label>
            <div className="relative">
              <select 
                value={application}
                onChange={(e) => setApplication(e.target.value)}
                className="w-full appearance-none bg-[#fafbfc] border border-slate-100 rounded-xl py-3.5 px-6 text-slate-600 font-bold text-sm focus:outline-none focus:border-[#1b365d] focus:bg-white transition-all cursor-pointer shadow-sm"
              >
                <option>All Applications</option>
                <option>Plumbing & Fittings (3)</option>
                <option>Electrical Components (2)</option>
                <option>Automotive Parts (2)</option>
                <option>Marine Applications (2)</option>
                <option>Precision Instruments (1)</option>
                <option>Industrial Equipment (2)</option>
              </select>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-xl">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFilter;
