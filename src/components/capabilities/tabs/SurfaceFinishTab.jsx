const SurfaceFinishTab = () => {
  const finishes = [
    {
      label: "Ra 3.2",
      title: "Standard Machined",
      subtitle: "Ra Value: Ra 3.2",
      desc: "Standard CNC turning finish suitable for most applications",
      typical: "Typical Applications: General industrial components, non critical surfaces"
    },
    {
      label: "Ra 1.6",
      title: "Fine Machined",
      subtitle: "Ra Value: Ra 1.6",
      desc: "Improved surface quality for better sealing and appearance",
      typical: "Typical Applications: Hydraulic fittings, pneumatic components, visible surfaces"
    },
    {
      label: "Ra 0.8",
      title: "Precision Ground",
      subtitle: "Ra Value: Ra 0.8",
      desc: "High-quality finish for critical sealing surfaces",
      typical: "Typical Applications: Valve seats, bearing surfaces, precision assemblies"
    },
    {
      label: "Ra 0.4",
      title: "Super Finish",
      subtitle: "Ra Value: Ra 0.4",
      desc: "Ultra-smooth finish for demanding applications",
      typical: "Typical Applications: Medical devices, aerospace components, high pressure seals"
    }
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Surface Finish Specifications</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          Multiple surface finish options available to meet functional and aesthetic requirements. Each finish level is measured and verified using calibrated surface roughness testers.
        </p>
      </div>

      <div className="space-y-6">
        {finishes.map((fs, index) => (
          <div key={index} className="bg-[#fafbfc] rounded-2xl p-8 border border-black space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-100 flex items-center justify-center rounded-xl shadow-sm">
                <span className="text-xs font-black text-[#1b365d]">{fs.label}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#1b365d]">{fs.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fs.subtitle}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {fs.desc}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {fs.typical}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurfaceFinishTab;
