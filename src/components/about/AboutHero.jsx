import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPerformanceMetrices } from "../../lib/api";

const AboutHero = () => {
  const sectionRef = useRef(null);
  const [aboutMetrics, setAboutMetrics] = useState([]);

  useEffect(() => {
    let isActive = true;

    const loadMetrics = async () => {
      try {
        const data = await getPerformanceMetrices();
        if (!isActive || !Array.isArray(data)) return;

        const filtered = data.filter((item) => item?.view_in_about_us);
        setAboutMetrics(
          filtered.map((item) => ({
            id: item.id,
            icon: item.icon_name || "query_stats",
            value: item.value || "",
            label: item.field || "",
          }))
        );
      } catch {
        if (isActive) setAboutMetrics([]);
      }
    };

    loadMetrics();
    return () => {
      isActive = false;
    };
  }, []);

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

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative pt-24 pb-10 lg:pt-24 lg:pb-27 overflow-hidden home-hero-bg-premium"
    >


      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
           
          {/* Left Content */}
          <div className="space-y-8 reveal-on-scroll reveal-hidden text-left">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-3 text-white/60 text-sm font-medium mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-white font-bold underline decoration-accent decoration-2 underline-offset-4 tracking-tight">About Us</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Established 2010 • Export Excellence</span>
            </div>
            
            <div className="space-y-2">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Precision Engineering <br />
              <span className="block text-2xl sm:text-3xl lg:text-2xl font-bold text-accent leading-tight tracking-tight drop-shadow-lg">Meets Export Excellence</span>
            </h1>
            </div>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              A trusted precision manufacturing partner bridging Indian manufacturing excellence with international quality standards. We speak the language of procurement professionals who need custom metal components manufactured to exact specifications.
            </p>

            {/* Stats Cards */}
            {aboutMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {aboutMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">
                          {metric.icon}
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {metric.value}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content: Image & Floating Card */}
          <div className="relative flex items-center justify-center lg:justify-end reveal-on-scroll reveal-hidden [animation-delay:200ms] lg:pt-16 group">
            <div className="relative z-10 w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070" 
                alt="Precision Manufacturing Facility" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
            </div>

            {/* Floating Quality Card */}
            <div className="absolute -bottom-4 -left-4 lg:bottom-10 lg:-left-10 z-20 bg-slate-900/90 backdrop-blur-xl p-3.5 sm:p-5 lg:p-6 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4 border border-white/10 animate-fade-in-up">
              <div className="bg-green-500/20 p-2 lg:p-3 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-green-400 text-xl lg:text-2xl">
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">
                  ISO 9001:2015
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1 whitespace-nowrap">
                  Certified Quality Management
                </p>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutHero;
