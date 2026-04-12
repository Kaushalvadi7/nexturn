import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const QualitySystem = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: "01",
      title: "Raw Material Validation",
      description: "Incoming material verification via chemical analysis ensuring all alloys meet global RoHS standards before production",
      icon: "inventory",
      delay: "200ms"
    },
    {
      id: "02",
      title: "In-Process Inspection",
      description: "Dimensional checks during production using statistical process control to eliminate deviations and ensure consistent high-volume quality",
      icon: "bar_chart",
      delay: "400ms"
    },
    {
      id: "03",
      title: "Final Inspection",
      description: "100% Final inspection utilizing shadow graph profile projector, specialized gauges and precision instruments for total accuracy",
      icon: "search",
      delay: "600ms"
    },
    {
      id: "04",
      title: "Documentation",
      description: "Complete traceability with MTR and dimensional inspection reports provided",
      icon: "description",
      delay: "800ms"
    }
  ];

  const metrics = [
    { label: "100%", sub: "Inspection Rate", icon: "verified", iconColor: "text-green-600" },
    { label: "ISO", sub: "9001:2015", icon: "workspace_premium", iconColor: "text-blue-900" },
    { label: "99.5%", sub: "Quality Rate", icon: "equalizer", iconColor: "text-blue-500" },
    { label: "24hr", sub: "Report Delivery", icon: "schedule", iconColor: "text-orange-600" }
  ];

  return (
    <section ref={sectionRef} className="bg-slate-50 pt-0 pb-10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Part 1: Quality Assurance Process */}
        <div className="text-center mb-16 max-w-7xl mx-auto reveal-on-scroll reveal-hidden">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Quality Assurance Process</h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            A Multi-Stage Validation protocol engineered to ensure micron-level precision and full material traceability for every batch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-18">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="reveal-on-scroll reveal-hidden relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group"
              style={{ animationDelay: step.delay }}
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-slate-50">
                {step.id}
              </div>
              <div className="mb-6 flex justify-center">
                <span className="material-symbols-outlined text-slate-900 text-4xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Part 2: Certified Quality Management System */}
        <div className="reveal-on-scroll reveal-hidden [animation-delay:400ms] bg-white rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                  Certified Quality Management System
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Our ISO 9001:2015 certified quality management system ensures consistent processes, continuous improvement, and customer satisfaction. Every component undergoes rigorous inspection before shipment.
                </p>
              </div>

              <ul className="space-y-5">
                {[
                  { title: "Advanced Measuring Equipment", sub: "Shadowgraph Profile Projector, Precision Instruments and Specialized Guages." },
                  { title: "Statistical Process Control (SPC)", sub: "Real-time dimensional monitoring and production optimization." },
                  { title: "Complete Documentation", sub: "Detailed inspection reports and material certificates included with every batch." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-green-500 font-bold block mt-1">check_circle</span>
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm tracking-tight">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="reveal-on-scroll reveal-hidden [animation-delay:800ms]">
              <Link 
                to="/quality-inspection"
                className="group flex items-center justify-center gap-3 bg-brand-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-blue/90 transition-all shadow-lg hover:shadow-brand-blue/20 active:scale-95 cursor-pointer w-fit"
              >
                <span>Learn About Our Quality Process</span>
                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
            </div>

            {/* Right Column: Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {metrics.map((metric, i) => (
                <div key={i} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 text-center space-y-3">
                  <div className="flex justify-center">
                    <span className={`material-symbols-outlined ${metric.iconColor} text-3xl`}>{metric.icon}</span>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{metric.label}</div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{metric.sub}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default QualitySystem;
