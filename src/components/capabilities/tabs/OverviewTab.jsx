const OverviewTab = () => {
  const highlights = [
    {
      value: "±0.005mm",
      label: "Minimum Tolerance",
      color: "text-[#1b365d]"
    },
    {
      value: "3-100mm",
      label: "Diameter Range",
      color: "text-[#e17000]"
    },
    {
      value: "Ra 0.4",
      label: "Best Surface Finish",
      color: "text-green-600"
    }
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Manufacturing Capabilities Overview</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          Our state-of-the-art CNC turning facilities are equipped with advanced machinery capable of producing precision metal components to exact specifications. We maintain strict quality control throughout the manufacturing process to ensure consistent dimensional accuracy and surface finish quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item, index) => (
          <div key={index} className="bg-[#fafbfc] rounded-2xl p-10 text-center border border-slate-50 space-y-4">
            <h3 className={`text-4xl font-black tracking-tight ${item.color}`}>
              {item.value}
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;
