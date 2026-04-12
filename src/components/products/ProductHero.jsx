import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const ProductHero = () => {
  const bgTextRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgTextRef.current) {
        const scrollY = window.scrollY;
        // Smoother parallax effect moving down on scroll
        gsap.to(bgTextRef.current, {
          y: scrollY * 0.5,
          duration: 1.2,
          ease: "expo.out",
          overwrite: "auto"
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-0 md:min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-24 pb-12 md:pt-24 md:pb-24 bg-[#0d1117]">
      {/* Background radial gradient to match home-hero-bg-premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a237e,#0d1117)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-4 pb-10 md:py-3">
        {/* Breadcrumbs - Moved to the starting edge of the screen container */}
        <nav className="flex items-center gap-3 text-white/40 text-sm font-medium animate-fade-in-up mb-10 md:mb-24">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-white/80 font-bold underline decoration-accent decoration-2 underline-offset-4">Products</span>
        </nav>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-6 md:space-y-10">
          
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(255,165,0,0.8)]"></span>
            <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Material Solutions</span>
          </div> */}

          {/* Main Title Group */}
          <div className="space-y-2 md:space-y-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative flex justify-center items-center">
              {/* Parallax Background Watermark - Centered specifically on H1 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <div 
                  ref={bgTextRef}
                  className="flex justify-center items-center w-full will-change-transform opacity-[0.08]"
                >
                  <span 
                    className="text-[25vw] md:text-[18vw] font-black text-white tracking-tighter leading-none uppercase font-sans whitespace-nowrap"
                    style={{ userSelect: 'none' }}
                  >
                    METALS
                  </span>
                </div>
              </div>

              <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase">
                Precision Crafted
              </h1>
            </div>
            
            <h2 className="text-xl sm:text-3xl font-bold text-accent tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
               Engineering Metal Solutions
            </h2>
          </div>

          {/* Description */}
          <p className="text-blue-100/70 text-[15px] md:text-xl leading-relaxed max-w-4xl font-medium animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            Comprehensive range of metal alloys manufactured to exact and expect specifications. From free-cutting metal to lead-free alternatives, each material is engineered for surgical precision with documented technical properties and proven export quality.
          </p>
          </div>

          {/* Bottom Badge Grid */}
          <div className="w-full max-w-7xl mx-auto px-0 sm:px-4">
            <div className="grid grid-cols-2 lg:flex lg:flex-nowrap items-center justify-center gap-3 sm:gap-4 pt-8 md:pt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2.5 md:gap-4 px-3.5 md:px-6 py-4 md:py-5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl w-full">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-300 shadow-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">verified</span>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-white font-bold text-[11px] md:text-base tracking-tight leading-tight truncate">Certified Quality</p>
                  <p className="text-blue-100/70 text-[8px] md:text-[11px] uppercase font-bold tracking-[0.1em] md:tracking-[0.2em] mt-0.5 truncate">ISO 9001:2015</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 md:gap-4 px-3.5 md:px-6 py-4 md:py-5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl w-full text-left">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-300 shadow-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">public</span>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-white font-bold text-[11px] md:text-base tracking-tight leading-tight truncate">Export Standards</p>
                  <p className="text-blue-100/70 text-[8px] md:text-[11px] uppercase font-bold tracking-[0.1em] md:tracking-[0.2em] mt-0.5 truncate">Global Ready</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 md:gap-4 px-3.5 md:px-6 py-4 md:py-5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl w-full">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-300 shadow-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">science</span>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-white font-bold text-[11px] md:text-base tracking-tight leading-tight truncate">Available Materials</p>
                  <p className="text-blue-100/70 text-[8px] md:text-[11px] uppercase font-bold tracking-[0.1em] md:tracking-[0.2em] mt-0.5 truncate">6+ certified metals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 md:gap-4 px-3.5 md:px-6 py-4 md:py-5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl w-full">
                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-300 shadow-xl flex-shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-2xl">settings_suggest</span>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-white font-bold text-[11px] md:text-base tracking-tight leading-tight truncate">Custom Components</p>
                  <p className="text-blue-100/70 text-[8px] md:text-[11px] uppercase font-bold tracking-[0.1em] md:tracking-[0.2em] mt-0.5 truncate">Precision Turning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Bottom Scroll Pattern */}
      {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 animate-bounce duration-[3000ms]">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-3">Explore Specs</span>
          <div className="w-[1.5px] h-16 bg-gradient-to-b from-accent to-transparent" />
      </div> */}
    </section>
  );
};

export default ProductHero;
