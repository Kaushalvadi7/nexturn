import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getCertificates, getClientSuccessStories } from "../../lib/api";

const QualityCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoadingCerts, setIsLoadingCerts] = useState(true);
  const [certError, setCertError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    const fetchCerts = async () => {
      setIsLoadingCerts(true);
      setCertError("");
      try {
        const data = await getCertificates();
        if (isActive) {
          setCertifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isActive) {
          setCertError(error?.message || "Failed to load certifications.");
        }
      } finally {
        if (isActive) setIsLoadingCerts(false);
      }
    };

    fetchCerts();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      try {
        const data = await getClientSuccessStories();
        if (!isActive || !Array.isArray(data)) return;

        setReviews(
          data.map((story) => ({
            name: story.client_name || "Client",
            role: story.client_position || "Client",
            company: story.client_purchase || "Project",
            location: story.client_city || "Global",
            quote: story.description || "Client experience details will appear here.",
            projectType: story.client_purchase || "Client Project",
            rating: Number.isFinite(Number(story.stars)) ? Number(story.stars) : 5,
          }))
        );
      } catch {
        if (isActive) setReviews([]);
      } finally {
        if (isActive) setIsLoadingReviews(false);
      }
    };

    loadReviews();
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

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    const fallbackTimer = setTimeout(() => {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        el.classList.add("reveal-visible");
      });
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!isLoadingReviews && reviews.length >= 4 && sliderRef.current) {
      const slider = sliderRef.current;
      const halfWidth = slider.scrollWidth / 2;

      if (animationRef.current) animationRef.current.kill();

      animationRef.current = gsap.to(slider, {
        x: -halfWidth,
        duration: 40, // Slightly slower for readability
        ease: "none",
        repeat: -1,
        paused: false,
      });

      const handleMouseEnter = () => {
         if (animationRef.current) animationRef.current.pause();
      };
      const handleMouseLeave = () => {
         if (animationRef.current && !animationRef.current.vars.manual) animationRef.current.play();
      };

      slider.addEventListener("mouseenter", handleMouseEnter);
      slider.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (animationRef.current) animationRef.current.kill();
        slider.removeEventListener("mouseenter", handleMouseEnter);
        slider.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isLoadingReviews, reviews]);

  const handleManualScroll = (direction) => {
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = { vars: { manual: true }, kill: () => {} };
    }

    const slider = sliderRef.current;
    if (!slider) return;

    const scrollWidth = slider.scrollWidth;
    const halfWidth = scrollWidth / 2;
    const currentX = gsap.getProperty(slider, "x");
    
    // Calculate precise item width (card + gap)
    const card = slider.querySelector(':first-child');
    const gap = 24; // Defined in className "flex gap-6"
    const itemFullWidth = card ? card.offsetWidth + gap : 404;
    
    // Determine the target index based on current position
    // We want to snap to the nearest whole card in the specified direction
    const currentTargetX = direction === "left" ? currentX + itemFullWidth : currentX - itemFullWidth;
    const targetX = Math.round(currentTargetX / itemFullWidth) * itemFullWidth;

    // Animate to targetX and use a modifier to wrap the value seamlessly
    gsap.to(slider, {
      x: targetX,
      duration: 0.8,
      ease: "power2.out",
      modifiers: {
        x: (x) => {
          // Wrap between -halfWidth and 0
          const wrappedX = gsap.utils.wrap(-halfWidth, 0, parseFloat(x));
          return `${wrappedX}px`;
        }
      }
    });
  };

  const renderReviewCard = (review, key) => (
    <div
      key={key}
      className={`${reviews.length >= 4 ? "w-[calc(100vw-64px)] sm:w-[320px] md:w-[380px] shrink-0" : ""} bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 min-h-[330px] min-w-0`}
    >
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-lg ${i < review.rating ? "text-orange-500" : "text-slate-300"}`}
            style={{
              fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            star
          </span>
        ))}
      </div>

      <blockquote className="text-slate-600 italic leading-relaxed mb-8 text-sm md:text-base flex-grow break-words whitespace-pre-wrap">
        "{review.quote}"
      </blockquote>

      <div className="border-t border-slate-200 pt-6 space-y-2 min-w-0 flex-1">
        <h4 className="text-base font-bold text-slate-900 break-words">{review.name}</h4>
        <p className="text-xs uppercase tracking-wider text-slate-500 font-bold break-words">{review.role}</p>
        <p className="text-xs text-accent font-semibold break-words">{review.company}</p>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-3 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-900 mb-1">Project Type</p>
        <p className="text-xs text-slate-700 break-words">{review.projectType}</p>
      </div>

      <div className="flex items-center gap-2 text-slate-400 mt-4">
        <span className="material-symbols-outlined text-sm">location_on</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">{review.location}</span>
      </div>
    </div>
  );

  const documentationDocs = [
    {
      title: "First Article Inspection Report (FAIR)",
      desc: "Complete dimensional verification with measurement data for initial production approval",
    },
    {
      title: "Material Test Certificate (MTC)",
      desc: "Chemical composition analysis and mechanical properties from material supplier",
    },
    {
      title: "Inspection Data Sheet",
      desc: "Batch-specific measurement records with actual readings and tolerance compliance",
    },
    {
      title: "Certificate of Conformance (CoC)",
      desc: "Formal declaration of specification compliance and quality standard adherence",
    },
    {
      title: "Packing List with Traceability",
      desc: "Detailed shipment contents with batch numbers and inspection references",
    },
  ];

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              Quality Certifications & Compliance
            </h2>
            <p className="text-[18px] text-slate-600 leading-relaxed">
              Internationally recognized quality systems and comprehensive
              documentation ensuring transparency and traceability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-24">
            {certError && (
              <div className="md:col-span-2 lg:col-span-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-600">
                {certError}
              </div>
            )}
            {isLoadingCerts && (
              <div className="md:col-span-2 lg:col-span-3 rounded-xl bg-white border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500">
                Loading certifications...
              </div>
            )}
            {!isLoadingCerts && certifications.length === 0 && !certError && (
              <div className="md:col-span-2 lg:col-span-3 text-center text-sm font-semibold text-slate-500">
                No certifications available.
              </div>
            )}
            {certifications.map((cert, index) => (
              <div
                key={cert.id || index}
                className="bg-white p-6 px-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-start gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-600 text-3xl">
                    workspace_premium
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1B365D]">
                    {cert.name || cert.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-12 tracking-tight">
              Standard Documentation Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {documentationDocs.map((doc, index) => (
                <div
                  key={index}
                  className="bg-slate-50 p-6 rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-4 hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#1B365D] mb-1">
                      {doc.title}
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-body">
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-50 py-5 px-6 sm:px-8 rounded-2xl border border-slate-100 max-w-7xl mx-auto">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs text-white font-bold leading-none shrink-0">
                i
              </div>
              <p className="text-sm text-slate-500 font-body text-center sm:text-left">
                All documentation is provided in PDF format with digital
                signatures. Additional certifications or specific compliance
                documents can be arranged based on customer requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!isLoadingReviews && reviews.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="scroll-mt-24 text-center mb-16 lg:mb-20 max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Customer Quality Feedback
              </h2>
              <p className="text-[18px] text-slate-600 leading-relaxed">
                International clients trust our quality systems for consistent
                precision and reliable documentation.
              </p>
            </div>

            <div className="relative py-2">
              {reviews.length >= 4 ? (
                <div className="relative group/slider overflow-visible">
                  <div className="relative overflow-hidden -mx-4 px-5 sm:px-0">
                    <div ref={sliderRef} className="flex gap-6 w-max select-none will-change-transform">
                      {reviews.map((review, index) => renderReviewCard(review, `r1-${index}`))}
                      {reviews.map((review, index) => renderReviewCard(review, `r2-${index}`))}
                    </div>
                    <div className="hidden sm:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
                    <div className="hidden sm:block absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Manual Navigation Buttons - Positioned outside the cards */}
                  <button
                    onClick={() => handleManualScroll("left")}
                    className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-12 h-12 rounded-full bg-primary shadow-xl border border-primary flex items-center justify-center text-white hover:bg-[#254a7c] transition-all pointer-events-auto cursor-pointer z-20"
                  >
                    <span className="material-symbols-outlined font-bold">chevron_left</span>
                  </button>
                  <button
                    onClick={() => handleManualScroll("right")}
                    className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-12 h-12 rounded-full bg-primary shadow-xl border border-primary flex items-center justify-center text-white hover:bg-[#254a7c] transition-all pointer-events-auto cursor-pointer z-20"
                  >
                    <span className="material-symbols-outlined font-bold">chevron_right</span>
                  </button>
                </div>
              ) : (
                <div className={`grid gap-4 md:gap-6 ${reviews.length === 1 ? "grid-cols-1 max-w-[420px] mx-auto" : reviews.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                  {reviews.map((review, index) => renderReviewCard(review, `g-${index}`))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default QualityCertifications;
