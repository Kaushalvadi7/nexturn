import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getManufacturingCapabilities } from "../../lib/api";

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Capabilities = () => {
  const sectionRef = useRef(null);
  const [capabilities, setCapabilities] = useState([]);

  useEffect(() => {
    const loadCapabilities = async () => {
      try {
        const data = await getManufacturingCapabilities();
        setCapabilities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load manufacturing capabilities", error);
        setCapabilities([]);
      }
    };

    loadCapabilities();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) {
      return undefined;
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

    const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [capabilities.length]);

  return (
    <section
      ref={sectionRef}
      className="bg-slate-50 text-slate-900 py-24 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-16 lg:mb-24 items-center">
          <div className="reveal-on-scroll reveal-hidden flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group cursor-default">
            <span className="material-symbols-outlined text-slate-900 group-hover:text-primary transition-colors text-3xl">
              verified_user
            </span>
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm md:text-base">
                ISO 9001:2015
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Certified Quality Management
              </p>
            </div>
          </div>
          <div className="reveal-on-scroll reveal-hidden [animation-delay:200ms] flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group cursor-default">
            <span className="material-symbols-outlined text-slate-900 group-hover:text-primary transition-colors text-3xl">
              local_shipping
            </span>
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm md:text-base">
                Global Export
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Europe, USA, Middle East
              </p>
            </div>
          </div>
          <div className="reveal-on-scroll reveal-hidden [animation-delay:400ms] flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group cursor-default">
            <span className="material-symbols-outlined text-slate-900 group-hover:text-primary transition-colors text-3xl">
              schedule
            </span>
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm md:text-base">
                15+ Years
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Manufacturing Experience
              </p>
            </div>
          </div>
          <div className="reveal-on-scroll reveal-hidden [animation-delay:600ms] flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1 group cursor-default">
            <span className="material-symbols-outlined text-slate-900 group-hover:text-primary transition-colors text-3xl">
              settings
            </span>
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm md:text-base">
                CNC VMC SPM
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Advanced Machinery
              </p>
            </div>
          </div>
        </div>

        <div id="capabilities" className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center mb-8 lg:mb-10 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Manufacturing Capabilities
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Advanced crafting and manufacturing capabilities with high-precision
            tolerances and comprehensive secondary operations and end-to-end
            component production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={capability.id}
              className="reveal-on-scroll reveal-hidden bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              style={{ animationDelay: `${200 * (index + 1)}ms` }}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex-shrink-0 h-7 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-900 group-hover:text-primary text-3xl transition-colors">
                    {capability.icon_name || "manufacturing"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 mb-1 break-words">
                    {capability.title}
                  </h2>
                  <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">
                    {capability.description}
                  </p>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(capability.feature) ? capability.feature : [])
                  .filter(Boolean)
                  .map((item, itemIndex) => (
                    <li
                      key={`${capability.id}-${itemIndex}`}
                      className="flex items-start gap-3 min-w-0"
                    >
                      <div className="flex-shrink-0 h-5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-500 text-xl font-bold">
                          check_circle
                        </span>
                      </div>
                      <span className="text-sm text-slate-700 font-medium break-words whitespace-pre-wrap leading-tight flex-1 min-w-0">
                        {item}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {capabilities.length === 0 && (
            <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-500 font-medium">
              Manufacturing capabilities will appear here once configured.
            </div>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal-on-scroll reveal-hidden relative group">
            <div className="absolute -inset-4 bg-slate-900/5 rounded-[2rem] blur-2xl group-hover:bg-slate-900/10 transition-colors duration-500"></div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
                alt="Precision CNC Manufacturing"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </div>

          <div className="flex flex-col space-y-8">
            <div className="reveal-on-scroll reveal-hidden [animation-delay:200ms] space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Precision Engineering for International Standards
              </h2>
              <p className="text-slate-600 leading-relaxed">
               Our facility is equipped with high-performance automated machinery 
               and advanced tooling systems to ensure consistent quality across every 
               production run. We maintain strict process controls and full documentation 
               to provide the total traceability required by global supply chains.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 !mb-0">
              <div className="reveal-on-scroll reveal-hidden p-3.5 sm:p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-3xl font-bold text-brand-blue mb-0.5 sm:mb-2 leading-none">
                    <CountUp end={50000} suffix="+" />
                  </h3>
                  <p className="text-[9px] sm:text-sm font-medium text-slate-500 uppercase tracking-tighter sm:tracking-wider leading-tight">
                    Components/Month
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src="/images/iso_9001.png"
                    alt="ISO 9001:2015 Certified"
                    className="h-10 sm:h-20 w-auto object-contain"
                  />
                </div>
              </div>
              <div className="reveal-on-scroll reveal-hidden [animation-delay:600ms] bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-blue mb-1 sm:mb-2">
                  24/7
                </h3>
                <p className="text-[10px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Production Capacity
                </p>
              </div>
            </div>

            <div className="reveal-on-scroll reveal-hidden [animation-delay:700ms] flex flex-wrap sm:flex-nowrap justify-between items-center py-5 border-y border-slate-100/80 gap-y-4 !mb-0">
              {[
                { icon: "memory", label: "Electrical" },
                { icon: "car_repair", label: "Automotive" },
                { icon: "settings", label: "Industrial" },
                { icon: "stethoscope", label: "Medical" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 lg:gap-3 group">
                  <span className="material-symbols-outlined text-3xl text-slate-700 group-hover:text-brand-blue transition-colors duration-300">
                    {item.icon}
                  </span>
                  <span className="text-base font-bold text-slate-800 tracking-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="reveal-on-scroll reveal-hidden [animation-delay:800ms] !mt-2">
              <Link
                to="/contact-us#quote-form"
                className="group flex items-center justify-center gap-3 bg-brand-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-blue/90 transition-all shadow-lg hover:shadow-brand-blue/20 active:scale-95 cursor-pointer w-fit"
              >
                <span>Request Quote</span>
                <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
