import { useEffect, useRef } from "react";

const EngineeringPrecision = () => {
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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    const fallbackTimer = setTimeout(() => {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
        elements.forEach((el) => el.classList.add("reveal-visible"));
      }
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="pt-[36px] pb-16 relative overflow-hidden bg-white font-['Source_Sans_3',sans-serif]">
      {/* Subtle background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] lg:top-[-20%] left-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] lg:bottom-[-20%] right-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <div className="flex flex-col items-center text-center">
            
            {/* Heritage Badge */}
            {/* <div className="reveal-on-scroll reveal-hidden mb-8 px-5 py-2 bg-slate-50/80 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
              <span className="text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.3em]">Our Heritage & Vision</span>
            </div> */}

            {/* Main Heading */}
            <h2 className="reveal-on-scroll reveal-hidden text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-[1.15]">
              Engineering Precision <span className="text-[#e17000]">Since 2010</span>
            </h2>

            {/* Decorative Divider */}
            <div className="reveal-on-scroll reveal-hidden flex items-center gap-4 mb-6">
              <div className="w-8 h-[2px] bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full border-2 border-[#e17000]"></div>
              <div className="w-48 h-[2px] bg-gradient-to-r from-slate-200 to-transparent"></div>
            </div>

            {/* Narrative Content */}
            <div className="space-y-5 text-slate-600 font-medium leading-relaxed text-lg md:text-[21px]">
              <p className="reveal-on-scroll reveal-hidden">
                <span className="text-slate-900 font-bold">nexturn precision Pvt. Ltd.</span> was founded with a singular mission:
                to bridge the gap between Indian manufacturing excellence and
                international quality expectations. What started as a small
                precision turning operation has evolved into a trusted partner for
                procurement professionals across <span className="text-slate-900 font-extrabold border-b-4 border-[#e17000]/20 pb-0.5">Europe and North America.</span>
              </p>
              
              <div className="reveal-on-scroll reveal-hidden w-full h-px bg-slate-100 max-w-sm mx-auto" style={{ transitionDelay: '100ms' }}></div>

              <p className="reveal-on-scroll reveal-hidden" style={{ transitionDelay: '200ms' }}>
                Our journey is defined by <span className="text-slate-900 font-bold">continuous investment</span> in technology,
                unwavering commitment to quality, and deep understanding of our
                clients' technical requirements. We don't just manufacture
                components—we solve <span className="text-[#e17000] font-bold">engineering challenges</span> with precision,
                reliability, and technical expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringPrecision;
