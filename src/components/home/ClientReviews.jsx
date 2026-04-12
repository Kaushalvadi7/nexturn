import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getClientSuccessStories } from "../../lib/api";

const ClientReviews = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

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

    return () => {
      observer.disconnect();
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
    if (!isLoadingReviews && reviews.length >= 4 && sliderRef.current) {
      const slider = sliderRef.current;
      const halfWidth = slider.scrollWidth / 2;

      if (animationRef.current) animationRef.current.kill();

      animationRef.current = gsap.to(slider, {
        x: -halfWidth,
        duration: 36,
        ease: "none",
        repeat: -1,
        paused: false,
      });

      const handleMouseEnter = () => animationRef.current?.pause();
      const handleMouseLeave = () => animationRef.current?.play();

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

    const card = slider.querySelector(":first-child");
    const gap = 24; // Matches className "flex gap-6"
    const itemFullWidth = card ? card.offsetWidth + gap : 414;

    const currentTargetX =
      direction === "left" ? currentX + itemFullWidth : currentX - itemFullWidth;
    const targetX = Math.round(currentTargetX / itemFullWidth) * itemFullWidth;

    gsap.to(slider, {
      x: targetX,
      duration: 0.8,
      ease: "power2.out",
      modifiers: {
        x: (x) => {
          const wrappedX = gsap.utils.wrap(-halfWidth, 0, parseFloat(x));
          return `${wrappedX}px`;
        },
      },
    });
  };

  const renderReviewCard = (review, key) => (
    <div
      key={key}
      className={`${reviews.length >= 4 ? "w-[320px] md:w-[390px] shrink-0" : ""} bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-4 transition-all duration-500 flex flex-col h-[480px] md:h-[500px]`}
    >
      <div className="p-6 md:p-8 flex flex-col h-full space-y-4 md:space-y-5 min-w-0">
        <div className="flex gap-1 justify-center sm:justify-start">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-lg md:text-xl ${i < review.rating ? "text-orange-500" : "text-slate-300"}`}
              style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          ))}
        </div>

        <blockquote className="text-base md:text-lg font-medium text-slate-600 italic flex-grow leading-relaxed break-words whitespace-pre-wrap">
          "{review.quote}"
        </blockquote>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-base md:text-lg font-extrabold text-slate-900 line-clamp-1">{review.name}</h4>
          <p className="text-slate-500 text-[12px] md:text-[13px] font-medium line-clamp-1">
            {review.role} at {review.company}
          </p>
          <div className="flex items-center gap-2 text-slate-400 mt-2">
            <span className="material-symbols-outlined text-xs">location_on</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{review.location}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl py-3 md:py-4 px-4 border border-slate-100 text-center">
          <p className="text-[9px] md:text-[10px] font-bold text-blue-900 uppercase tracking-widest mb-1">
            Project Type
          </p>
          <p className="text-slate-700 text-[11px] md:text-xs font-medium line-clamp-1">{review.projectType}</p>
        </div>
      </div>
    </div>
  );

  if (!isLoadingReviews && reviews.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 reveal-on-scroll reveal-hidden">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-slate-900">Client Success Stories</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base px-4">
            Trusted by procurement professionals and engineering teams across Europe and USA.
          </p>
        </div>

        {/* Circular Review Loop */}
        <div className="relative reveal-on-scroll reveal-hidden [animation-delay:200ms] py-10 -my-10">
          {isLoadingReviews && (
            <div className="text-center text-slate-500 font-medium py-10">
              Loading success stories...
            </div>
          )}
          {!isLoadingReviews && reviews.length === 0 && (
            <div className="text-center text-slate-500 font-medium py-10">
              No success stories available yet.
            </div>
          )}
          {!isLoadingReviews && reviews.length > 0 && (
            reviews.length >= 4 ? (
              <div className="relative group/slider overflow-visible">
                <div className="relative overflow-hidden -mx-4 px-4">
                  <div ref={sliderRef} className="flex gap-6 w-max select-none will-change-transform">
                    {reviews.map((review, index) => renderReviewCard(review, `r1-${index}`))}
                    {reviews.map((review, index) => renderReviewCard(review, `r2-${index}`))}
                  </div>
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10" />
                </div>

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
            )
          )}
        </div>

      </div>
    </section>
  );
};

export default ClientReviews;
