import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getMaterialSpecializations } from "../../lib/api";

gsap.registerPlugin(ScrollTrigger);


const MaterialSpecializations = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [materials, setMaterials] = useState([]);


  const toggleApplications = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await getMaterialSpecializations();
        setMaterials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load material specializations", error);
        setMaterials([]);
      }
    };

    loadMaterials();
  }, []);

  // Force a refresh after materials have likely rendered
  useEffect(() => {
    if (materials.length > 0) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [materials]);

  useLayoutEffect(() => {
    if (materials.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const totalCards = cards.length;

      if (totalCards === 0) return;

      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        cards.forEach((card, index) => {
          const isLast = index === totalCards - 1;

          gsap.set(card, { zIndex: index + 1 });

          if (!isLast) {
            gsap.to(card, {
              scale: 0.95,
              opacity: 0.6,
              filter: "blur(4px)",
              scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 95%",
                end: "top 80px",
                scrub: true,
              },
            });

            ScrollTrigger.create({
              trigger: card,
              start: "top 80px",
              endTrigger: cards[totalCards - 1],
              end: "top 80px",
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
              refreshPriority: 1
            });
          }
        });
      });

      // Mobile: Simple fade-in animation instead of pinning
      mm.add("(max-width: 767px)", () => {
        cards.forEach((card) => {
          gsap.fromTo(card, 
            { opacity: 0, y: 50 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [materials]);


  return (
    <section ref={sectionRef} className="bg-slate-50 pt-0 pb-22 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="scroll-mt-24 text-center mb-8 lg:mb-10 max-w-7xl mx-auto">

          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Material Specializations
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Material integrity is the foundation of every component. We process an extensive range of industrial-grade metals and high-performance alloys,
            providing full chemical composition analysis and material traceability certificates for every production batch. Our strict adherence to material 
            standards ensures 100% compliance with global environmental and industrial regulations, including RoHS.
          </p>

        </div>


      <div className="max-w-[1200px] mx-auto space-y-8 md:space-y-12 mb-24">
        {materials.map((material, index) => (
          <div
            key={material.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group relative w-full h-auto min-h-0 md:min-h-[600px] bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 flex flex-col md:flex-row shadow-2xl"
          >


            {/* Left: Content Wrapper */}
            <div className="flex-1 p-4 sm:p-10 md:p-14 flex flex-col justify-start min-w-0">
              <div className="mb-3 md:mb-4">
                {/* <span className="text-orange-600 font-mono text-xs uppercase tracking-widest mb-3 block">
                  Industrial Grade Materials
                </span> */}
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3 leading-none break-words">
                  {material.title}
                </h3>
                <p className="text-slate-600 text-[13px] md:text-base leading-relaxed max-w-2xl mb-4 md:mb-2 break-words whitespace-pre-wrap">
                  {material.description}
                </p>
              </div>

              <div className="flex flex-col gap-6 md:gap-8 pt-5 md:pt-4 border-t border-slate-100">
                <div className="space-y-4">
                  <h4 className="text-slate-900 font-black text-[10px] md:text-xs uppercase tracking-widest md:tracking-[0.2em] flex items-center gap-1.5 md:gap-2">
                   <span className="material-symbols-outlined text-[14px] text-black-600 font-bold">
                          layers
                        </span>
                    Available Grades
                  </h4>

                  <ul className="flex flex-wrap gap-x-4 gap-y-2 pl-2 md:pl-[8px]">
                    {(Array.isArray(material.grades) ? material.grades : []).map(
                      (grade, i) => (
                        <li
                          key={i}
                          className="text-[11px] md:text-[13px] text-slate-500 font-medium flex items-center gap-1.5 break-words whitespace-pre-wrap"
                        >

                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-slate-900)' }} />
                          {grade}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-slate-900 font-black text-[10px] md:text-xs uppercase tracking-widest md:tracking-[0.2em] flex items-center gap-1.5 md:gap-2">
                   <span className="material-symbols-outlined text-[14px] text-black-500 font-bold">
                          dashboard
                        </span>
                    Key Applications
                  </h4>

                  <ul className="flex flex-wrap gap-x-4 gap-y-2 pl-2 md:pl-[8px]">
                    {(Array.isArray(material.common_application)
                      ? material.common_application
                      : []
                    ).map((app, i) => (
                      <li
                        key={i}
                        className="text-[11px] md:text-[13px] text-slate-500 font-medium flex items-center gap-1.5 break-words whitespace-pre-wrap"
                      >

                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-slate-900)' }} />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Visual Section */}
            <div className="h-[300px] md:h-auto md:flex-[0.8] relative overflow-hidden bg-slate-100 border-t md:border-t-0 md:border-l border-slate-100">

              <img
                src={
                  material.image_url ||
                  material.public_url ||
                  "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=2070"
                }
                alt={material.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1"
              />
              
              {/* Bottom Badge */}

              <div className="absolute top-6 right-6 md:top-auto md:bottom-8 md:right-8 bg-white/95 backdrop-blur shadow-xl py-2 px-5 md:py-3 md:px-6 rounded-2xl border border-slate-200/50">
                 <span className="text-slate-900 font-black text-sm uppercase tracking-widest">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                 </span>
              </div>
            </div>
          </div>
        ))}

        {materials.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center text-slate-500 font-medium shadow-xl">
            Material specializations are currently unavailable. Please check
            back later.
          </div>
        )}
      </div>


      <div className="flex justify-center pb-12">
        <Link
          to="/products"
          className="group flex items-center gap-3 bg-[#1b365d] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1b365d] transition-all shadow-2xl active:scale-95 cursor-pointer"
        >
          <span>Explore All Products</span>
          <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
      </div>

      {/* Bottom Spacer to ensure smooth transition to next section */}
      {/* <div className="h-[20vh] md:h-[40vh]" /> */}
    </section>

  );
};

export default MaterialSpecializations;
