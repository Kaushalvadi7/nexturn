import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHeroSliderImages, getPerformanceMetrices } from "../../lib/api";
import { useContactInfo } from "../common/contactInfo";

const HomeSection = () => {
  const fallbackImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIi-tnEwuP0dQbMTnuRUo2fxhMYFPsNyA_EuaAaCYHkJmuEcrslHk7dDRJuvig7NupJCPfm04rWy9iUHs3j_vXCBxeOjiVq1HZ_9mSmF8mASAZ1MDJuAsdf-jXfe42cqMFVxhNffaPFGApCofSfy4YnkZ88_v6qlFCPqWGpVzA60soRreXPvEfVnJa8UvLdp1YrDU_uIJ-a6fNr6_zBWTPASP27QpUUtv7EKaoxrsw7UYacYelxYo---ZIjIB-NFuHKxKzWzpfVjZq",
    "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1645754884804-a65f5550ec1b?auto=format&fit=crop&q=80&w=2070",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroSliderImages, setHeroSliderImages] = useState([]);
  const [heroMetrics, setHeroMetrics] = useState([]);
  const { hrefs } = useContactInfo();

  useEffect(() => {
    let isActive = true;

    const loadHeroSlider = async () => {
      try {
        const items = await getHeroSliderImages();
        if (!isActive) return;
        const urls = (Array.isArray(items) ? items : [])
          .map((item) => String(item?.image_url || ""))
          .filter(Boolean);
        setHeroSliderImages(urls);
        setCurrentImageIndex(0);
      } catch {
        if (!isActive) return;
        setHeroSliderImages([]);
        setCurrentImageIndex(0);
      }
    };

    loadHeroSlider();
    return () => {
      isActive = false;
    };
  }, []);

  const images = heroSliderImages.length > 0 ? heroSliderImages : fallbackImages;

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Rotate every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    let isActive = true;
    const loadMetrics = async () => {
      try {
        const data = await getPerformanceMetrices();
        if (!isActive || !Array.isArray(data)) return;
        const filtered = data.filter((item) => item?.view_in_hero_page);
        setHeroMetrics(
          filtered.map((item) => ({
            id: item.id,
            icon: item.icon_name || "query_stats",
            value: item.value || "",
            label: item.field || "",
          }))
        );
      } catch {
        if (isActive) setHeroMetrics([]);
      }
    };

    loadMetrics();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="relative home-hero-bg-premium min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-[100px] pb-7 lg:pt-24 lg:pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6 animate-fade-in-up reveal-visible">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-sm">
              <span className="material-symbols-outlined text-accent text-lg">
                verified
              </span>
              ISO 9001:2015 Certified Manufacturer
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Engineering Excellence in Precision Metal Components
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-accent leading-tight tracking-tight drop-shadow-lg">
                Manufactured to Your 
                Exact and Expect Specifications
              </h2>
            </div>
            <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
              Custom turned metal parts with tolerances down to ±0.01mm.
              Proven export experience to Europe and USA with consistent quality
              delivery.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {heroMetrics.map((metric, index) => (
                <div
                  key={metric.id || `${metric.label}-${index}`}
                  className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-colors group animate-fade-in-up reveal-hidden"
                  style={{ animationDelay: `${200 + index * 200}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform">
                      {metric.icon}
                    </span>
                    <span className="text-xl font-bold text-white">{metric.value}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 pt-1">
              <Link
                to="/contact-us#quote-form"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-accent hover:bg-orange-700 text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg shadow-xl shadow-orange-900/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl">description</span>
                <span className="whitespace-nowrap">Request Quote</span>
              </Link>
              <a
                href={hrefs.whatsapp || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-transparent hover:bg-white/10 border-2 border-slate-400 hover:border-white text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-300 cursor-pointer"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.89 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end animate-fade-in-up [animation-delay:800ms] reveal-hidden lg:pt-16">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-white/10">
              {images.map((src, index) => (
                <img
                  key={index}
                  alt="Precision metal components close up"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  src={src}
                />
              ))}
            </div>
            <div className="absolute -bottom-4 -left-4 lg:bottom-10 lg:-left-10 bg-white dark:bg-slate-800 p-3.5 sm:p-5 lg:p-6 rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 border border-slate-100 dark:border-slate-700">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 lg:p-3 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl lg:text-2xl">
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white">
                  Quality Assured
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                  100% inspection at every stage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeSection;


