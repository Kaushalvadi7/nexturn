import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getManufacturingFacalities } from "../../lib/api";

const FALLBACK_IMAGE =
  "https://img.rocket.new/generatedImages/rocket_gen_img_14aaf5db1-1766919026609.png";

const ManufacturingFacility = () => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  const [facalities, setFacalities] = useState([]);
  const [isLoadingFacalities, setIsLoadingFacalities] = useState(true);
  const [facalitiesError, setFacalitiesError] = useState("");

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    const revealAll = () =>
      elements.forEach((el) => el.classList.add("reveal-visible"));

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      requestAnimationFrame(revealAll);
      return undefined;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    observerRef.current = observer;
    elements.forEach((el) => observer.observe(el));

    const fallbackTimer = window.setTimeout(() => {
      elements.forEach((el) => el.classList.add("reveal-visible"));
    }, 1200);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [facalities.length, isLoadingFacalities]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoadingFacalities(true);
      setFacalitiesError("");
      try {
        const data = await getManufacturingFacalities();
        if (!isActive) return;
        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.title || "",
          category: "Facility",
          description: row.description || "",
          image: row.image || null,
        }));
        setFacalities(normalized);
      } catch (e) {
        if (!isActive) return;
        console.error("Failed to load manufacturing facalities", e);
        setFacalities([]);
        setFacalitiesError(
          e?.message || "Failed to load manufacturing facalities.",
        );
      } finally {
        if (isActive) setIsLoadingFacalities(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, []);

  const stats = [
    { icon: "domain", value: "15,000 sq ft", label: "Total Area" },
    { icon: "grid_view", value: "4 Sections", label: "Advanced Mesuring" },
    { icon: "cloud", value: "22Â°C Â±2Â°C", label: "Advanced Mesuring Instruments-Qulity Support" },
    { icon: "bolt", value: "100% UPS", label: "PPAP 3.1 Certi. -Certification Supprt" },
  ];

  const items = useMemo(() => facalities, [facalities]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [clampedItems, setClampedItems] = useState({});
  const descriptionRefs = useRef({});

  // Effect to lock body scroll when modal is open
  useEffect(() => {
    if (selectedFacility) {
      document.body.classList.add('modal-open');
      // If ScrollSmoother is active, we need to pause it
      if (window.smoother) {
        window.smoother.paused(true);
      }
    } else {
      document.body.classList.remove('modal-open');
      if (window.smoother) {
        window.smoother.paused(false);
      }
    }
    return () => {
      document.body.classList.remove('modal-open');
      if (window.smoother) {
        window.smoother.paused(false);
      }
    };
  }, [selectedFacility]);

  // Effect to check if descriptions are clamped (more than 3 lines)
  useEffect(() => {
    if (!isLoadingFacalities && items.length > 0) {
      const checkClamping = () => {
        const newClampedItems = {};
        items.forEach((item) => {
          const el = descriptionRefs.current[item.id];
          if (el) {
            if (el.scrollHeight > el.clientHeight) {
              newClampedItems[item.id] = true;
            }
          }
        });
        setClampedItems(newClampedItems);
      };

      // Check immediately and also after a short delay
      checkClamping();
      const timer = setTimeout(checkClamping, 500);
      
      window.addEventListener('resize', checkClamping);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkClamping);
      };
    }
  }, [items, isLoadingFacalities]);

  return (
    <section
      ref={sectionRef}
      className="pt-8 pb-12 bg-white overflow-hidden font-['Source_Sans_3',sans-serif]"
    >
      {/* Enhanced Description Modal with Portal to escape parent clipping */}
      {selectedFacility && createPortal(
        <div 
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/90 backdrop-blur-md"
          onClick={() => setSelectedFacility(null)}
        >
          <div 
            className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative flex flex-col scale-100 opacity-100 transition-all border border-white/20"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              animation: 'modal-zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              overscrollBehavior: 'contain'
            }}
          >
            {/* Header / Title area (Sticky) */}
            <div className="px-8 pt-10 md:px-12 md:pt-12 pb-4 border-b border-slate-50 flex-shrink-0 relative">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedFacility(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-[10002]"
              >
                <span className="material-symbols-outlined text-2xl font-black">close</span>
              </button>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1b365d] mb-4 tracking-tight leading-tight pr-10">
                {selectedFacility.title}
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-[#e17000] to-orange-300 rounded-full"></div>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div 
              className="p-8 md:p-12 overflow-y-auto flex-grow"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin'
              }}
            >
              <div className="space-y-6">
                <p className="text-slate-600 text-base sm:text-lg leading-[1.8] font-medium whitespace-pre-wrap">
                  {selectedFacility.description}
                </p>
                {/* Extra space to ensure the last line is easily readable */}
                <div className="h-4"></div>
              </div>
            </div>
            
            {/* Modal Footer (Sticky) */}
            <div className="px-8 md:px-12 py-6 bg-slate-50/80 border-t border-slate-100 flex justify-end shrink-0 backdrop-blur-sm">
               <button 
                 onClick={() => setSelectedFacility(null)}
                 className="px-8 py-3 bg-[#1b365d] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#e17000] transition-all shadow-lg active:scale-95"
               >
                 Close Detail
               </button>
            </div>
          </div>
          <style>{`
            @keyframes modal-zoom-in {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            body.modal-open {
              overflow: hidden !important;
            }
            /* Styling for the modal scrollbar */
            .overflow-y-auto::-webkit-scrollbar {
              width: 5px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
          `}</style>
        </div>,
        document.body
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto ">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
            Manufacturing Facility
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            A modern, organized facility designed for precision manufacturing
            with climate-controlled environments and systematic workflow
            management.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label || index}
              className="reveal-on-scroll reveal-hidden bg-[#f4f6f8] p-4 sm:p-6 lg:p-8 rounded-2xl flex items-center gap-3 md:gap-6 border border-slate-100/50 hover:shadow-lg transition-all"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                <span className="material-symbols-outlined text-[#1b365d] text-xl md:text-2xl font-light">
                  {stat.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg md:text-xl font-black text-[#1b365d] whitespace-nowrap leading-tight">
                  {stat.value}
                </h4>
                <p className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mt-0.5 truncate">
                  {/* <p className="text-slate-400 text-[9px] md:text-xs font-bold uppercase tracking-widest mt-0.5 whitespace-pre-wrap leading-relaxed"></p> */}
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {facalitiesError && (
            <div className="md:col-span-2 lg:col-span-3 rounded-[2.5rem] bg-red-50 border border-red-100 p-12 text-center reveal-on-scroll reveal-hidden">
              <span className="material-symbols-outlined text-red-400 text-5xl mb-4">report</span>
              <p className="grow text-red-600 font-black text-sm uppercase tracking-widest">{facalitiesError}</p>
            </div>
          )}
          
          {isLoadingFacalities && (
            [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-[2.5rem] bg-slate-50 border border-slate-100 aspect-[4/5] animate-pulse flex flex-col p-8 space-y-6">
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl w-full"></div>
                <div className="h-8 bg-slate-100 rounded-lg w-2/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded-lg w-full"></div>
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6"></div>
                </div>
              </div>
            ))
          )}

          {!isLoadingFacalities && items.length === 0 && !facalitiesError && (
            <div className="md:col-span-2 lg:col-span-3 rounded-[2.5rem] bg-[#f4f6f8] border border-slate-100 py-20 px-10 text-center reveal-on-scroll reveal-hidden">
              <span className="material-symbols-outlined text-slate-300 text-6xl mb-6">factory</span>
              <h3 className="text-xl font-bold text-slate-400">Ready for Expansion</h3>
              <p className="text-sm font-semibold text-slate-400 mt-2">No manufacturing facilities added to the showroom yet.</p>
            </div>
          )}

          {items.map((item, index) => (
            <div
              key={item.id || item.title}
              className="reveal-on-scroll reveal-hidden group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-[#1b365d]/10 hover:border-[#1b365d] transition-all duration-700 flex flex-col shadow-sm"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b365d]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              
              <div className="p-8 md:p-10 flex-grow flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-black text-[#1b365d] tracking-tight group-hover:text-[#e17000] transition-colors duration-300 break-words">
                    {item.title}
                  </h3>
                </div>
                
                <p 
                  ref={(el) => (descriptionRefs.current[item.id] = el)}
                  className="text-slate-500 text-sm md:text-base font-medium leading-relaxed break-words whitespace-pre-wrap mb-6"
                >
                  {item.description}
                </p>
                
                {clampedItems[item.id] && (
                  <button 
                    onClick={() => setSelectedFacility(item)}
                    className="mt-auto flex items-center gap-2 group/btn cursor-pointer w-fit"
                  >
                    <span className="text-[10px] font-black text-[#1b365d] uppercase tracking-widest group-hover/btn:text-[#e17000] transition-colors">See Full Description</span>
                    <span className="material-symbols-outlined text-sm text-[#e17000] group-hover/btn:translate-x-1 transition-transform">arrow_right_alt</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Safety & Standards Section */}
        <div className="reveal-on-scroll reveal-hidden bg-[#f4f6f8]/50 rounded-[3rem] p-3 md:p-6 border border-slate-100/50">
          <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-7xl mx-auto ">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-10 h-10 text-blue"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                ></path>
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight
">
              Safety & Environmental Standards
            </h3>
            <p className="text-[18px] text-slate-600 leading-relaxed">
              Our facility adheres to international safety standards with
              comprehensive environmental management systems. Regular safety
              audits, waste management protocols, and energy-efficient
              operations ensure sustainable manufacturing practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-16">
            {[
              "OSHA Compliant",
              "ISO 14001 Environmental",
              "5S Workplace Organization",
            ].map((standard) => (
              <div
                key={standard}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-green-600 text-xl font-black">
                    check
                  </span>
                </div>
                <p className="text-[#1b365d] font-bold text-xs md:text-sm whitespace-nowrap">
                  {standard}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManufacturingFacility;
