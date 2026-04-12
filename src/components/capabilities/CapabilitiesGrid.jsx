const CapabilitiesGrid = () => {
  const capabilities = [
    {
      title: "CNC Turning Precision",
      icon: "settings",
      desc: "Advanced multi-axis CNC turning capabilities with tight tolerance control",
      specs: [
        { label: "Diameter Range", value: "3mm to 100mm" },
        { label: "Length Capacity", value: "Up to 500mm" },
        { label: "Tolerance", value: "±0.005mm to ±0.02mm" },
        { label: "Surface Finish", value: "Ra 0.4 to Ra 3.2" }
      ]
    },
    {
      title: "Dimensional Accuracy",
      icon: "architecture",
      desc: "Consistent dimensional control across production batches",
      specs: [
        { label: "IT6 to IT8", value: "Tolerance Grades" },
        { label: "Concentricity", value: "±0.01mm" },
        { label: "Perpendicularity", value: "±0.02mm" },
        { label: "Parallelism", value: "±0.015mm" }
      ]
    },
    {
      title: "Thread Manufacturing",
      icon: "build",
      desc: "Precision thread cutting and rolling capabilities",
      specs: [
        { label: "Metric Threads", value: "M3 to M100" },
        { label: "BSP/NPT Threads", value: "Available" },
        { label: "Thread Tolerance", value: "6g to 4h" },
        { label: "Custom Thread", value: "Profiles" }
      ]
    },
    {
      title: "Surface Treatment",
      icon: "flare",
      desc: "Multiple finishing options for enhanced performance",
      specs: [
        { label: "Electroplating", value: "Nickel, Chrome, Zinc" },
        { label: "Passivation", value: "Corrosion Resistance" },
        { label: "Polishing", value: "Mirror to Satin Finish" },
        { label: "Heat Treatment", value: "Available" }
      ]
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {capabilities.map((cap, index) => (
          <div 
            key={index}
            className="bg-white p-8 md:p-10 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1b365d] group-hover:bg-[#1b365d] group-hover:text-white transition-colors duration-500">
                <span className="material-symbols-outlined text-2xl">{cap.icon}</span>
              </div>
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#1b365d]">{cap.title}</h3>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 pt-2">
                  {cap.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between group/spec">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-1 bg-[#e17000] rounded-full"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{spec.label}</span>
                      </div>
                      <span className="text-xs font-black text-[#1b365d]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CapabilitiesGrid;
