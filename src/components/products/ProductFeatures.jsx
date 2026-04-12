const ProductFeatures = () => {
  const features = [
    {
      icon: "science",
      title: "Material Grades",
      desc: "6+ certified metal alloys meeting international standards"
    },
    {
      icon: "settings_suggest",
      title: "Custom Components",
      desc: "Precision CNC turning to your exact specifications"
    },
    {
      icon: "description",
      title: "Technical Data",
      desc: "Complete specifications and material certificates"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto pt-20 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-10 rounded-2xl flex items-center gap-8 shadow-sm border border-slate-100/50 hover:shadow-xl hover:border-[#1b365d]/20 transition-all duration-500 group"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1b365d]/5 transition-colors">
              <span className="material-symbols-outlined text-[#1b365d] text-2xl font-light">
                {feature.icon}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1b365d]">{feature.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeatures;
