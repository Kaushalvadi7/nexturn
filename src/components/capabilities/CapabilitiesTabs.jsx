const CapabilitiesTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: "Overview", icon: "grid_view" },
    { name: "Tolerances", icon: "tune" },
    { name: "Diameter Range", icon: "bar_chart" },
    { name: "Secondary Operations", icon: "build" },
    { name: "Surface Finish", icon: "flare" },
    { name: "Comparison", icon: "balance" }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-10">
      <div className="flex flex-wrap items-center gap-3 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeTab === tab.name
                ? "bg-[#1b365d] text-white shadow-lg shadow-[#1b365d]/20"
                : "bg-white text-black border border-slate-100 hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${activeTab === tab.name ? "text-white" : "text-black"}`}>
              {tab.icon}
            </span>
            {tab.name}
          </button>
        ))}
      </div>
      <div className="w-full h-px bg-slate-100 mt-2"></div>
    </section>
  );
};

export default CapabilitiesTabs;
