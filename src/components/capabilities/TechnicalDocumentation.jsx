const TechnicalDocumentation = () => {
  const documents = [
    {
      title: "Technical Capability Sheet",
      desc: "Complete overview of manufacturing capabilities and specifications",
      size: "2.4 MB PDF",
      icon: "description"
    },
    {
      title: "Tolerance Standards Guide",
      desc: "Detailed tolerance charts and measurement standards",
      size: "1.8 MB PDF",
      icon: "analytics"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-20 mt-20">
      {/* Documentation Cards */}
      <div className="space-y-10">
        <h2 className="text-2xl font-black text-[#1b365d]">Technical Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {documents.map((doc, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#1b365d] transition-colors">
                    <span className="material-symbols-outlined text-[#1b365d] group-hover:text-white">
                      {doc.icon}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#1b365d]">{doc.title}</h3>
                    <p className="text-slate-400 text-sm font-medium">{doc.desc}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.size}</span>
                  <button className="flex items-center gap-2 bg-[#1b365d] text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#2a4a7a] transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#1b365d] via-[#1b365d] to-[#4c849a] p-12 md:p-20 text-center space-y-10">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Need Custom Manufacturing Solutions?
          </h2>
          <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed">
            Our engineering team is ready to discuss your specific requirements and provide technical consultation for your precision metal component needs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <button className="bg-[#e17000] text-white px-10 py-5 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-[#f57c00] transition-all shadow-xl shadow-orange-900/20 cursor-pointer">
            Request Technical Consultation
          </button>
          <button className="bg-white text-[#1b365d] px-10 py-5 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-black/5 cursor-pointer">
            View Product Catalog
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechnicalDocumentation;
