import { useEffect, useRef, useState } from "react";
import { getRegions } from "../../lib/api";

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
import ExportMap from "./export-regions/ExportMap";

const ExportExperience = () => {
  const sectionRef = useRef(null);
  const [servedRegionsData, setServedRegionsData] = useState({});

  const stats = [
    {
      icon: "public",
      end: 15,
      suffix: "+",
      label: "Countries Served",
      delay: "100ms",
    },
    {
      icon: "local_shipping",
      end: 500,
      suffix: "+",
      label: "Shipments Delivered",
      delay: "200ms",
    },
    {
      icon: "schedule",
      end: 98,
      suffix: "%",
      label: "On-Time Delivery",
      delay: "300ms",
    },
    {
      icon: "description",
      end: 100,
      suffix: "%",
      label: "Documentation Accuracy",
      delay: "400ms",
    },
  ];

  const features = [
    {
      icon: "description",
      title: "Export Standard Documentation",
      desc: "Invoices, Packing Lists, COO, and Material Certificates included.",
    },
    {
      icon: "verified_user",
      title: "Customs Ready Compliance",
      desc: "Expert HS Code Classification for Seamless International Port entry.",
    },
    {
      icon: "local_shipping",
      title: "Versatile Delivery Support",
      desc: "Support for Air, Sea & Express Courier Shipping as per your terms.",
    },
    {
      icon: "payments",
      title: "Payment Flexibility",
      desc: "Standard international payment terms including LC and TT accepted.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            entry.target.style.opacity = "1";
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

  useEffect(() => {
    let isActive = true;

    const loadRegions = async () => {
      try {
        const data = await getRegions();
        if (!isActive) return;

        const normalized = (Array.isArray(data) ? data : []).reduce((acc, row) => {
          const countryCode = String(row?.country_code || row?.country || "").trim().toUpperCase();
          if (!/^[A-Z]{2}$/.test(countryCode)) return acc;
          acc[countryCode] = true;
          return acc;
        }, {});

        setServedRegionsData(normalized);
      } catch {
        if (isActive) {
          setServedRegionsData({});
        }
      }
    };

    loadRegions();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="pt-0 pb-24 bg-slate-50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 reveal-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Proven Export Experience
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Reliable international shipping with complete documentation and customs compliance for hassle-free
            delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-18">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="reveal-on-scroll opacity-0 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: stat.delay }}
            >
              <span className="material-symbols-outlined text-blue-900 text-3xl sm:text-4xl mb-4 sm:mb-6 block">
                {stat.icon}
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </h3>
              <p className="text-slate-500 font-bold text-[10px] sm:text-sm uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative reveal-on-scroll opacity-0 [animation-delay:200ms]">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2070"
                alt="Port Logistics"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Overlay Box */}
            <div className="absolute bottom-6 left-3 bg-transparent px-5 py-3.5 sm:p-5 rounded-2xl max-w-xs md:max-w-sm reveal-on-scroll opacity-0 [animation-delay:400ms]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                  <span className="material-symbols-outlined text-white text-2xl font-bold">package_2</span>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-white">Secure Packaging</h4>
                  <p className="text-white/80 text-sm font-medium">Export-grade packaging standards</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 reveal-on-scroll opacity-0 [animation-delay:300ms]">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Seamless Export Solutions For Global Partners
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We handle all export documentation, customs clearance, and international shipping logistics. Our
                experienced team ensures smooth delivery with full compliance to international trade regulations.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20">
                    <span className="material-symbols-outlined text-white text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-slate-500 font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="regions-we-serve"
          className="max-w-full mx-auto px-0 sm:px-2 text-center reveal-on-scroll opacity-0 [animation-delay:600ms]"
        >
          <h2 className="text-3xl font-bold mb-6 text-slate-900">Export Regions</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">We proudly serve clients across global markets.</p>
          <ExportMap servedRegions={servedRegionsData} />
        </div>
      </div>
    </section>
  );
};

export default ExportExperience;
