import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useContactInfo } from "../common/contactInfo";

const RequestQuote = () => {
  const sectionRef = useRef(null);
  const { hrefs } = useContactInfo();

  const features = [
    {
      icon: "schedule",
      title: "24-Hour Response",
      desc: "Quick turnaround on all inquiries",
    },
    {
      icon: "engineering",
      title: "Technical Support",
      desc: "Expert guidance throughout the process",
    },
    {
      icon: "verified_user",
      title: "Quality Guaranteed",
      desc: "100% inspection and documentation",
    },
  ];

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

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 relative overflow-hidden hero-gradient hero-inner-shadow"
    >
      {/* Diagonal Patterns Overlay - using primary color at 0.1 opacity */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 0, transparent 50%)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Decorative Glows - using primary color for specific pings */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Header */}
        <div className="mb-12 reveal-on-scroll reveal-hidden">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-blue-100/70 max-w-5xl mx-auto text-lg leading-relaxed">
            Get a detailed quotation for your custom metal components. Our
            technical team will review your requirements and respond within 24
            hours with pricing, lead time, and technical recommendations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-6 reveal-on-scroll reveal-hidden [animation-delay:200ms]">
          <Link
            to="/contact-us#quote-form"
            className="flex-1 sm:flex-none px-2 sm:px-10 py-3.5 sm:py-5 bg-accent hover:bg-orange-700 text-white font-bold text-[10px] sm:text-lg rounded-xl shadow-[0_10px_30px_rgba(234,88,12,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-3 group text-center"
          >
            <span className="material-symbols-outlined font-bold text-lg sm:text-2xl group-hover:rotate-12 transition-transform">
              description
            </span>
            <span className="hidden sm:inline">Request Quote</span>
            <span className="sm:hidden">Request Quote</span>
          </Link>

          <a
            href={hrefs.whatsapp || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-none px-2 sm:px-10 py-3.5 sm:py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:border-white/40 font-bold text-[10px] sm:text-lg rounded-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-1.5 sm:gap-3 group text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-6 sm:h-6 fill-current transition-transform group-hover:scale-110 flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.57 0-3.11-.42-4.47-1.21l-.32-.19-3.15.83.84-3.04-.2-.33c-.87-1.39-1.34-3.01-1.34-4.67 0-4.73 3.85-8.58 8.58-8.58 2.29 0 4.44.89 6.06 2.51 1.62 1.62 2.51 3.77 2.51 6.06.01 4.73-3.84 8.59-8.57 8.59zm4.75-6.5c-.26-.13-1.53-.75-1.77-.84-.23-.09-.4-.13-.57.13-.17.26-.65.84-.79.97-.15.15-.3.17-.55.04-.25-.13-1.07-.39-2.03-1.25-.74-.66-1.25-1.48-1.39-1.73-.14-.26-.01-.39.12-.52.12-.11.26-.3.39-.45s.17-.26.26-.43c.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.77 2.7 4.28 3.78.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.68-1.19.2-.58.2-1.08.15-1.19-.06-.1-.21-.17-.47-.3z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp Us</span>
            <span className="sm:hidden">WhatsApp Us</span>
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="reveal-on-scroll reveal-hidden bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all duration-500 group"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(234,88,12,0.4)] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white font-bold">
                  {feature.icon}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-blue-100/50 text-sm font-bold uppercase tracking-widest">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequestQuote;
