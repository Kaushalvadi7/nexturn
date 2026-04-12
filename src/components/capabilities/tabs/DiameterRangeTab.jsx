const DiameterRangeTab = () => {
  const ranges = [
    {
      title: "Micro Components",
      range: "3mm - 10mm",
      delta: "Range: 7mm",
      percent: "30%",
      apps: ["Precision Fittings", "Electronic Components", "Medical Devices"]
    },
    {
      title: "Small Components",
      range: "10mm - 25mm",
      delta: "Range: 15mm",
      percent: "50%",
      apps: ["Automotive Parts", "Hydraulic Fittings", "Pneumatic Components"]
    },
    {
      title: "Medium Components",
      range: "25mm - 50mm",
      delta: "Range: 25mm",
      percent: "75%",
      apps: ["Industrial Valves", "Pump Components", "Heavy Equipment"]
    },
    {
      title: "Large Components",
      range: "50mm - 100mm",
      delta: "Range: 50mm",
      percent: "100%",
      apps: ["Marine Hardware", "Construction Equipment", "Industrial Machinery"]
    }
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Diameter Range Capabilities</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          Our manufacturing capabilities span from micro components at 3mm diameter to large industrial parts up to 100mm, covering a comprehensive range of applications across multiple industries.
        </p>
      </div>

      <div className="space-y-8">
        {ranges.map((item, index) => (
          <div key={index} className="bg-[#fafbfc] rounded-2xl p-8 border border-slate-50 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-lg font-black text-[#1b365d]">{item.title}</h3>
              <span className="text-xs font-black text-[#1b365d] uppercase tracking-widest">{item.range}</span>
            </div>

            <div className="relative">
              {/* Range Bar Background */}
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                {/* Visual Progress Bar */}
                <div 
                  className="h-full bg-gradient-to-r from-[#1b365d] via-[#1b365d] to-[#e17000] rounded-full transition-all duration-1000"
                  style={{ width: item.percent }}
                ></div>
              </div>
              <span className="absolute right-0 -top-6 text-[10px] font-bold text-slate-400 uppercase">
                {item.delta}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {item.apps.map((app, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-lg border border-slate-100">
                  {app}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiameterRangeTab;
