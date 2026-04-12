const SecondaryOpsTab = () => {
  const operations = [
    {
      title: "Thread Rolling",
      desc: "Cold forming process for superior thread strength and surface finish",
      capability: "Capability: M3 to M100",
      time: "2-3 days",
      icon: "settings"
    },
    {
      title: "Knurling",
      desc: "Diamond and straight knurling patterns for enhanced grip",
      capability: "Capability: All diameters",
      time: "1-2 days",
      icon: "rebase_edit"
    },
    {
      title: "Cross Drilling",
      desc: "Precision perpendicular hole drilling for fluid passages",
      capability: "Capability: 1mm to 20mm",
      time: "2-3 days",
      icon: "adjust"
    },
    {
      title: "Grooving",
      desc: "Internal and external groove cutting for O-rings and seals",
      capability: "Capability: 0.5mm to 10mm width",
      time: "1-2 days",
      icon: "horizontal_rule"
    },
    {
      title: "Chamfering",
      desc: "Edge breaking and chamfer cutting for assembly ease",
      capability: "Capability: 15° to 60° angles",
      time: "1 day",
      icon: "architecture"
    },
    {
      title: "Slotting",
      desc: "Precision slot milling for various applications",
      capability: "Capability: 1mm to 25mm width",
      time: "2-3 days",
      icon: "splitscreen"
    }
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Secondary Operations Matrix</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          Comprehensive secondary operations performed in-house to deliver complete, ready-to-assemble components. All operations maintain the same quality standards as primary machining.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {operations.map((op, index) => (
          <div key={index} className="bg-[#fafbfc] rounded-2xl p-8 border border-slate-50 space-y-6 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black text-[#1b365d] group-hover:text-[#e17000] transition-colors">{op.title}</h3>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                {op.time}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              {op.desc}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-black text-[#1b365d]/70 uppercase tracking-widest">
                {op.capability.split(':')[0]}: <span className="text-[#e17000]">{op.capability.split(':')[1]}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondaryOpsTab;
