import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getJourneyTimeline } from "../../lib/api";

gsap.registerPlugin(ScrollTrigger);

const HistoryTimeline = () => {
  const sectionRef = useRef(null);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animationClass = entry.target.dataset.animation;
            entry.target.classList.add(animationClass, "reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [milestones.length]);

  useEffect(() => {
    let isActive = true;
    const fetchTimeline = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await getJourneyTimeline();
        if (!isActive) return;
        const mapped = Array.isArray(data)
          ? data.map((item) => ({
              year: item?.year ? String(item.year) : "",
              title: item?.title || "",
              desc: item?.description || "",
            }))
          : [];
        setMilestones(mapped);
      } catch (error) {
        if (isActive) {
          setLoadError(error?.message || "Unable to load journey timeline.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchTimeline();
    return () => {
      isActive = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (isLoading || milestones.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current.querySelectorAll(".timeline-card");
      
      cards.forEach((card) => {
        const masks = card.querySelectorAll(".reveal-mask");
        
        gsap.to(masks, {
          clipPath: "inset(0% 0% 0% 0%)",
          webkitClipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 35%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, milestones]);

  return (
    <section ref={sectionRef} className="pt-8 pb-24 bg-slate-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20 reveal-on-scroll reveal-hidden" data-animation="animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Our Export Journey
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">

          {loadError && (
            <div className="mb-8 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
              {loadError}
            </div>
          )}
          {isLoading && (
            <div className="mb-8 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
              Loading timeline...
            </div>
          )}
          
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-200 hidden md:block"></div>

          {/* Mobile Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-200 md:hidden"></div>

          <div className="space-y-16">
            {!isLoading && milestones.length === 0 && !loadError && (
              <div className="text-center text-sm font-semibold text-slate-500">
                No journey milestones yet.
              </div>
            )}
            {milestones.map((item, index) => (
              <div 
                key={index} 
                className={`relative flex items-center gap-8 md:gap-0 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Milestone Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-[0_0_15px_rgba(32,54,87,0.4)] z-10"></div>

                {/* Content Side */}
                <div className="flex-1 pl-12 md:pl-0 min-w-0">
                  <div 
                    className={`reveal-on-scroll reveal-hidden w-full md:w-[88%] timeline-card min-w-0 ${
                      index % 2 === 0 ? "md:ml-auto md:pr-6" : "md:mr-auto md:pl-6"
                    }`}
                    data-animation={index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-[#f4f6f8] p-8 md:p-10 rounded-[2rem] border border-slate-100 hover:border-black hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group min-w-0">
                      
                      {/* Year Reveal */}
                      <div className="relative mb-4 min-w-0">
                        <span className="text-accent/10 font-black text-sm uppercase tracking-widest block break-words">
                          {item.year}
                        </span>
                        <span 
                          className="reveal-mask absolute inset-0 text-accent font-black text-sm uppercase tracking-widest block break-words"
                          style={{ clipPath: "inset(0% 100% 0% 0%)", WebkitClipPath: "inset(0% 100% 0% 0%)" }}
                        >
                          {item.year}
                        </span>
                      </div>

                      {/* Title Reveal */}
                      <div className="relative mb-4 min-w-0">
                        <h3 className="text-xl font-black text-primary/10 tracking-tight break-words">
                          {item.title}
                        </h3>
                        <h3 
                          className="reveal-mask absolute inset-0 text-xl font-black text-primary tracking-tight break-words"
                          style={{ clipPath: "inset(0% 100% 0% 0%)", WebkitClipPath: "inset(0% 100% 0% 0%)" }}
                        >
                          {item.title}
                        </h3>
                      </div>

                      {/* Description Reveal */}
                      <div className="relative min-w-0">
                        <p className="text-slate-500/10 text-sm leading-relaxed font-medium break-words whitespace-pre-wrap">
                          {item.desc}
                        </p>
                        <p 
                          className="reveal-mask absolute inset-0 text-slate-500 text-sm leading-relaxed font-medium break-words whitespace-pre-wrap"
                          style={{ clipPath: "inset(0% 100% 0% 0%)", WebkitClipPath: "inset(0% 100% 0% 0%)" }}
                        >
                          {item.desc}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Empty Side for Spacing on Desktop */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HistoryTimeline;
