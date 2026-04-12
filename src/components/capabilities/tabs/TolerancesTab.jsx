const TolerancesTab = () => {
  const rows = [
    { 
      param: "Outer Diameter", 
      standard: "±0.02mm", 
      precision: "±0.01mm", 
      ultra: "±0.005mm",
      pColor: "text-orange-500",
      uColor: "text-green-600" 
    },
    { 
      param: "Inner Diameter", 
      standard: "±0.025mm", 
      precision: "±0.015mm", 
      ultra: "±0.008mm",
      pColor: "text-orange-500",
      uColor: "text-green-600" 
    },
    { 
      param: "Length", 
      standard: "±0.05mm", 
      precision: "±0.03mm", 
      ultra: "±0.015mm",
      pColor: "text-orange-500",
      uColor: "text-green-600" 
    },
    { 
      param: "Concentricity", 
      standard: "±0.03mm", 
      precision: "±0.015mm", 
      ultra: "±0.01mm",
      pColor: "text-orange-500",
      uColor: "text-green-600" 
    },
    { 
      param: "Thread Pitch", 
      standard: "±0.04mm", 
      precision: "±0.02mm", 
      ultra: "±0.01mm",
      pColor: "text-orange-500",
      uColor: "text-green-600" 
    }
  ];

  return (
    <div className="bg-[#f7f7f7] rounded-[2rem] border border-slate-100 p-10 md:p-16 space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-4xl">
        <h2 className="text-2xl font-black text-[#1b365d]">Tolerance Specifications</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
          We offer three levels of tolerance control to match your specific requirements. Our precision-grade tolerances meet IT6-IT7 standards, while ultra-precision capabilities achieve IT5-IT6 for critical applications.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafbfc] border-b border-slate-100">
              <th className="py-6 px-8 text-xs font-black text-[#1b365d] uppercase tracking-widest">Parameter</th>
              <th className="py-6 px-8 text-xs font-black text-[#1b365d] uppercase tracking-widest">Standard Tolerance</th>
              <th className="py-6 px-8 text-xs font-black text-[#1b365d] uppercase tracking-widest text-[#e17000]">Precision Tolerance</th>
              <th className="py-6 px-8 text-xs font-black text-[#1b365d] uppercase tracking-widest text-green-600">Ultra-Precision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-6 px-8 text-sm font-bold text-[#1b365d]">{row.param}</td>
                <td className="py-6 px-8 text-sm font-medium text-slate-400">{row.standard}</td>
                <td className={`py-6 px-8 text-sm font-black ${row.pColor}`}>{row.precision}</td>
                <td className={`py-6 px-8 text-sm font-black ${row.uColor}`}>{row.ultra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TolerancesTab;
