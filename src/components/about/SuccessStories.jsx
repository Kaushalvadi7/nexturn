import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getClientProblemSolving } from "../../lib/api";
import { useContactInfo } from "../common/contactInfo";
import CTACatalogueSection from "../common/CTACatalogueSection";


const SuccessStories = () => {
  const { hrefs } = useContactInfo();
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoadingStudies, setIsLoadingStudies] = useState(true);
  const [studyError, setStudyError] = useState("");

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

  const caseStudiesStatic = [
    {
      title: "European Automotive Tier-1 Supplier",
      category: "Automotive Components",
      location: "Germany",
      year: "2022-Present",
      challenge: "Required custom metal fittings with Â±0.015mm tolerance for hydraulic systems, with monthly volumes of 50,000+ pieces and zero-defect delivery expectations.",
      solution: "Implemented dedicated production line with Swiss-type CNC machines, developed custom inspection fixtures, and established weekly shipment schedule with complete traceability documentation.",
      results: [
        "99.7% first-pass quality rate achieved",
        "Reduced lead time from 8 weeks to 3 weeks",
        "Zero delivery delays over 18-month partnership",
        "Cost reduction of 12% through process optimization"
      ]
    },
    {
      title: "American Industrial Equipment Manufacturer",
      category: "Pneumatic Systems",
      location: "United States",
      year: "2021-Present",
      challenge: "Complex metal valve bodies requiring multiple secondary operations (drilling, tapping, electroplating) with strict dimensional requirements and surface finish specifications.",
      solution: "Developed integrated manufacturing process combining CNC turning, secondary operations, and in-house electroplating. Implemented SPC monitoring and automated inspection protocols.",
      results: [
        "Consolidated 3 suppliers into single-source solution",
        "Improved component consistency by 35%",
        "Reduced total procurement cost by 18%",
        "Achieved 100% on-time delivery record"
      ]
    },
    {
      title: "UK Plumbing Fixtures Distributor",
      category: "Plumbing & Sanitary",
      location: "United Kingdom",
      year: "2020-Present",
      challenge: "High-volume production of CW617N metal connectors with aesthetic requirements, requiring consistent surface finish and dimensional accuracy across large batches.",
      solution: "Established dedicated production cell with automated material handling, implemented real-time quality monitoring, and developed custom packaging for export shipments.",
      results: [
        "Scaled production from 100K to 300K pieces/month",
        "Maintained 99.5% quality acceptance rate",
        "Reduced unit cost by 15% through volume efficiency",
        "Established 5-year supply agreement"
      ]
    }
  ];

  useEffect(() => {
    let isActive = true;
    const loadCaseStudies = async () => {
      setIsLoadingStudies(true);
      setStudyError("");
      try {
        const data = await getClientProblemSolving();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.client_name || "",
          category: row.product_name || "",
          location: row.client_location || "",
          year: row.year !== null && row.year !== undefined ? String(row.year) : "",
          challenge: row.challange || "",
          solution: row.solution || "",
          results: Array.isArray(row.results) ? row.results : [],
        }));
        setCaseStudies(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load client success stories", error);
        setCaseStudies([]);
        setStudyError(error?.message || "Failed to load success stories.");
      } finally {
        if (isActive) setIsLoadingStudies(false);
      }
    };

    loadCaseStudies();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer || !sectionRef.current) return;
    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));
  }, [caseStudies.length, isLoadingStudies]);

  const studiesToRender = caseStudies.length > 0 ? caseStudies : caseStudiesStatic;

  return (
    <section ref={sectionRef} className="pt-6 pb-12 bg-[#fafbfc] overflow-hidden font-['Source_Sans_3',sans-serif]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto ">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
            International Client Success Stories
          </h2>
          <p className="text-[17.5px] text-slate-600 leading-relaxed">
            Real partnerships, measurable results. Our success is defined by solving complex manufacturing 
            challenges and delivering consistent quality to international clients.
          </p>
        </div>

        {/* Regional Stats */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {regionalStats.map((stat, index) => (
            <div 
              key={index}
              className="reveal-on-scroll reveal-hidden bg-white p-10 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100/50"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#1b365d] text-2xl font-light">
                  {stat.icon}
                </span>
              </div>
              <h4 className="text-xl font-black text-[#1b365d] mb-1">{stat.name}</h4>
              <p className="text-[#e17000] text-xs font-black uppercase tracking-widest">{stat.count}</p>
            </div>
          ))}
        </div> */}

        {/* Case Studies */}
        <div className="space-y-8 mb-12">
          {studyError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {studyError}
            </div>
          )}
          {isLoadingStudies && (
            <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading success stories...
            </div>
          )}
          {!isLoadingStudies && studiesToRender.length === 0 && !studyError && (
            <div className="text-center text-sm font-semibold text-slate-500">
              No success stories available.
            </div>
          )}

          {!isLoadingStudies && !studyError && studiesToRender.map((study, index) => (
            <div 
              key={study.id || index}
              className="reveal-on-scroll reveal-hidden bg-white rounded-[2.5rem] p-1 md:p-1 shadow-sm border border-slate-100/50 overflow-hidden hover:shadow-2xl transition-all duration-700 w-full"
            >
              <div className="bg-[#f8fafc] p-6 md:p-10 rounded-[2.4rem] min-w-0 w-full">
                {/* Case Study Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 pb-8">
                  <div className="space-y-4 min-w-0 flex-1">
                    <h3 className="text-3xl md:text-4xl lg:text-3xl font-bold text-slate-900 mb-6 tracking-tight break-words">
                      {study.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 items-center">
                      <p className="text-[#1b365d] font-bold text-sm">{study.category}</p>
                      <div className="flex items-center gap-2 text-cyan-700 font-black text-sm uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">public</span>
                        {study.location}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#e17000]/10 text-[#e17000] px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase self-start md:self-center">
                    {study.year}
                  </div>
                </div>

                {/* Balanced Content Layout */}
                <div className="space-y-8 transition-all duration-500">
                  {/* Top: Challenge & Solution Side-by-Side */}
                  <div className="grid md:grid-cols-2 gap-10 lg:gap-16 min-w-0">
                    {/* Challenge Block */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-amber-600 font-bold text-xl">report_problem</span>
                        </div>
                        <h4 className="text-xl font-bold tracking-tight">Challenge</h4>
                      </div>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed font-regular pl-14 break-all whitespace-pre-wrap w-full">
                        {study.challenge}
                      </p>
                    </div>

                    {/* Solution Block */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-cyan-600 font-bold text-xl">lightbulb</span>
                        </div>
                        <h4 className="text-xl font-bold tracking-tight">Solution</h4>
                      </div>
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed font-regular pl-14 break-all whitespace-pre-wrap w-full">
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Metrics Horizontal Grid */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 mb-6 text-slate-900">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-emerald-600 font-bold text-xl">analytics</span>
                      </div>
                      <h4 className="text-xl font-bold tracking-tight">Success Metrics</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {study.results.map((result, rIndex) => (
                        <div 
                          key={rIndex} 
                          className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                          </div>
                          <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-tight break-all whitespace-pre-wrap flex-1 min-w-0">
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Merged CTA & Catalogue Section */}
        {/* <div className="reveal-on-scroll reveal-hidden">
          <CTACatalogueSection />
        </div> */}


      </div>
    </section>
  );
};

export default SuccessStories;
