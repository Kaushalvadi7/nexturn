import { useState } from "react";

const ComparisonTab = () => {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Tolerance", "Diameter", "Surface Finish", "Lead Time"];

  const data = [
    {
      id: "Tolerance",
      title: "Minimum Tolerance",
      industry: "±0.02mm",
      ours: "±0.005mm",
      advantage: "4x Better",
      color: "text-[#e17000]"
    },
    {
      id: "Diameter",
      title: "Diameter Range",
      industry: "5mm - 80mm",
      ours: "3mm - 100mm",
      advantage: "Wider Range",
      color: "text-[#e17000]"
    },
    {
      id: "Surface Finish",
      title: "Surface Finish",
      industry: "Ra 1.6",
      ours: "Ra 0.4",
      advantage: "4x Smoother",
      color: "text-[#e17000]"
    },
    {
      id: "Lead Time",
      title: "Lead Time",
      industry: "4-6 weeks",
      ours: "2-3 weeks",
      advantage: "50% Faster",
      color: "text-[#e17000]"
    }
  ];

  const filteredData = filter === "All" ? data : data.filter(item => item.id === filter);

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Capability Comparison vs Industry Standards</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          Our manufacturing capabilities consistently exceed industry standards across key parameters. This comparison demonstrates our competitive advantages in precision, range, and delivery performance.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 space-y-10">
        {/* Sub-filters */}
        <div className="flex flex-wrap gap-6 border-b border-slate-50 pb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                filter === f
                  ? "bg-[#1b365d] text-white px-6 py-3 rounded-lg shadow-md"
                  : "text-slate-400 hover:text-[#1b365d]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Comparison List */}
        <div className="space-y-6">
          {filteredData.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 border border-slate-100 space-y-8 animate-fade-in shadow-sm">
              <h3 className="text-sm font-black text-[#1b365d] uppercase tracking-widest">{item.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry Standard</p>
                  <p className="text-sm font-bold text-slate-600">{item.industry}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our Capability</p>
                  <p className={`text-sm font-black ${item.color}`}>{item.ours}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Competitive Advantage</p>
                  <p className="text-sm font-black text-green-600 uppercase tracking-tighter">{item.advantage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTab;
