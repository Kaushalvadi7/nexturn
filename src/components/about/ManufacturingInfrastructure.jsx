import { useEffect, useRef, useState } from "react";
import { getManufacturingInfrastructures } from "../../lib/api";

const ManufacturingInfrastructure = () => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const [infrastructures, setInfrastructures] = useState([]);
  const [isLoadingInfra, setIsLoadingInfra] = useState(true);
  const [infraError, setInfraError] = useState("");

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

    observerRef.current = observer;

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadInfrastructure = async () => {
      setIsLoadingInfra(true);
      setInfraError("");
      try {
        const data = await getManufacturingInfrastructures();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.title || "",
          description: row.description || "",
          points: Array.isArray(row.points) ? row.points : [],
        }));
        setInfrastructures(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load manufacturing infrastructure", error);
        setInfrastructures([]);
        setInfraError(error?.message || "Failed to load infrastructure.");
      } finally {
        if (isActive) setIsLoadingInfra(false);
      }
    };

    loadInfrastructure();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer || !sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));
  }, [infrastructures.length, isLoadingInfra]);

  const stats = [
    {
      icon: "schedule",
      value: "24/7",
      label: "Manufacturing Operations",
      description: "Continuous production capability",
      delay: "0ms"
    },
    {
      icon: "category",
      value: "500K+",
      label: "Monthly Capacity",
      description: "Components per month",
      delay: "150ms"
    },
    {
      icon: "bolt",
      value: "±10 Micron",
      label: "Precision Tolerance",
      description: "Achievable accuracy",
      delay: "300ms"
    },
    {
      icon: "verified",
      value: "99.8%",
      label: "Quality Rate",
      description: "First-pass acceptance",
      delay: "450ms"
    }
  ];

  const machineryStatic = [
    {
      title: "Swiss-Type CNC Turning Centers",
      units: "12 Units",
      description: "Complex geometries with tight tolerances, ideal for precision components requiring multiple operations in single setup",
      features: [
        "Max turning diameter: Ø32mm",
        "Tolerance capability: ±0.01mm",
        "Surface finish: Ra 0.8µm",
        "Live tooling with 12 stations"
      ]
    },
    {
      title: "Multi-Axis CNC Lathes",
      units: "8 Units",
      description: "High-volume production of medium-diameter components with secondary operations including drilling, milling, and threading",
      features: [
        "Max turning diameter: Ø50mm",
        "Tolerance capability: ±0.02mm",
        "C-axis and Y-axis milling",
        "Sub-spindle for complete machining"
      ]
    },
    {
      title: "Precision Thread Rolling Machines",
      units: "4 Units",
      description: "High-strength thread production with superior surface finish and dimensional accuracy for fastener applications",
      features: [
        "Thread diameter range: M3 to M20",
        "Thread tolerance: 6g class",
        "Production rate: 120 pcs/min",
        "Cold forming process"
      ]
    },
    {
      title: "CNC Drilling & Tapping Centers",
      units: "6 Units",
      description: "Secondary operations for complex hole patterns and threaded features with precise positioning requirements",
      features: [
        "Drilling capacity: Ø0.5mm to Ø20mm",
        "Tapping range: M2 to M16",
        "Positional accuracy: ±0.005mm",
        "Automatic tool changer"
      ]
    }
  ];

  const machinery =
    infrastructures.length > 0
      ? infrastructures.map((row) => ({
          id: row.id,
          title: row.title,
          units: `${Array.isArray(row.points) ? row.points.length : 0} Points`,
          description: row.description,
          features: Array.isArray(row.points) ? row.points : [],
        }))
      : machineryStatic;

  return (
    <section ref={sectionRef} className="pt-8 pb-12 bg-[#fafbfc] overflow-hidden font-['Source_Sans_3',sans-serif]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
            Manufacturing Infrastructure
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed ">
            Our facility is engineered for high-volume precision. By combining state-of-the-art CNC
             and VMC machinery with strict quality control, we manage the entire production cycle from 
             raw material to export-ready parts. We deliver consistent, high-accuracy components that
              meet the rigorous technical standards of our global clients in the Electrical, Automotive,
               and Industrial sectors.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="reveal-on-scroll reveal-hidden bg-white border border-[#e0e0e0] p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] hover:shadow-xl hover:shadow-primary/5 hover:border-[#1b365d] transition-all duration-500 flex flex-col items-center text-center group h-full"
              style={{ transitionDelay: stat.delay }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f4f6f8] rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[#1b365d] text-2xl sm:text-3xl font-light">
                  {stat.icon}
                </span>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-4xl font-black text-[#1b365d] tracking-tight">
                  {stat.value}
                </h3>
                <div>
                  <p className="text-[#1b365d] font-bold text-xs sm:text-base mb-1 leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-slate-400 text-[10px] sm:text-sm font-medium leading-tight">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Machinery Fleet List */}
        <div className="space-y-6 mb-22">
          {infraError && (
            <div className="reveal-on-scroll reveal-hidden bg-white border border-red-200 rounded-2xl py-6 px-8 md:py-8 md:px-12 text-center">
              <p className="text-red-600 font-bold text-sm">{infraError}</p>
            </div>
          )}

          {isLoadingInfra && (
            <div className="reveal-on-scroll reveal-hidden bg-white border border-[#e0e0e0] rounded-2xl py-6 px-8 md:py-8 md:px-12 text-center">
              <p className="text-slate-500 font-bold text-sm">Loading infrastructure details...</p>
            </div>
          )}

          {!isLoadingInfra && !infraError && machinery.length === 0 && (
            <div className="reveal-on-scroll reveal-hidden bg-white border border-[#e0e0e0] rounded-2xl py-6 px-8 md:py-8 md:px-12 text-center">
              <p className="text-slate-500 font-bold text-sm">No infrastructure details available.</p>
            </div>
          )}

          {!isLoadingInfra &&
            !infraError &&
            machinery.map((item, index) => (
              <div 
                key={item.id || index}
                className="reveal-on-scroll reveal-hidden bg-white border border-[#e0e0e0] rounded-2xl py-6 px-8 md:py-8 md:px-12 hover:shadow-xl hover:border-[#1b365d] transition-all duration-500 flex flex-col md:flex-row items-center gap-8 group overflow-hidden w-full"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex-1 space-y-6 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-2xl md:text-3xl font-black text-[#1b365d] tracking-tight break-words">
                      {item.title}
                    </h3>
                    {/* <span className="px-4 py-1.5 bg-[#e17000]/5 text-[#e17000] text-sm font-black rounded-full border border-[#e17000]/10">
                      {item.units}
                    </span> */}
                  </div>
                  
                  <p className="text-slate-500 font-medium leading-relaxed max-w-5xl break-all whitespace-pre-wrap w-full">
                    {item.description || "—"}
                  </p>

                  {Array.isArray(item.features) && item.features.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-3.5">
                      {item.features.map((feature, fIndex) => (
                        <div 
                          key={fIndex} 
                          className="flex items-center gap-3 py-4 px-1.5 bg-slate-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group max-w-[340px] flex-1 min-w-0"
                        >
                          <div className="flex-shrink-0 h-5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500 text-xl font-bold">check_circle</span>
                          </div>
                          <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-tight break-words whitespace-pre-wrap flex-1 min-w-0">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm font-bold italic">No key points listed.</p>
                  )}
                </div>

                <div className="w-48 h-48 bg-[#f4f6f8] rounded-full flex items-center justify-center border border-[#e0e0e0] group-hover:scale-105 transition-transform duration-700">
                  <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg border border-[#e0e0e0]">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor" 
                      aria-hidden="true" 
                      className="w-16 h-16 md:w-20 md:h-20 text-[#1b365d] group-hover:rotate-45 transition-transform duration-700"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"></path>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Secondary Operations */}
        <div className="reveal-on-scroll reveal-hidden">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
              Secondary Operations & Support Equipment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                icon: "handyman",
                title: "Surface Treatment",
                description: "Electroplating, passivation, and coating facilities for corrosion resistance"
              },
              {
                icon: "engineering",
                title: "Machining Support",
                description: "Support operations to ensure precise dimensions, Smooth finishing, and readiness for furture processing or assembly "
              },
              {
                icon: "settings_suggest",
                title: "Assembly Services",
                description: "Sub-assembly and kitting capabilities for complete component solutions"
              }
            ].map((op, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center space-y-5 group bg-white py-7 px-10 rounded-[2rem] shadow-xl shadow-[#1b365d]/5 border border-slate-100 hover:border-[#1b365d] transition-all duration-500"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1b365d] border border-slate-100 group-hover:scale-110 group-hover:bg-[#1b365d] group-hover:text-white transition-all duration-500">
                  <span className="material-symbols-outlined text-3xl transition-colors">
                    {op.icon}
                  </span>
                </div>
                <div className="space-y-4 px-4">
                  <h4 className="text-xl font-black text-[#1b365d] tracking-tight">
                    {op.title}
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {op.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManufacturingInfrastructure;
