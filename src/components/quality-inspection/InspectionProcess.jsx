import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const inspectionStages = [
  {
    id: 1,
    title: "Raw Material Inspection",
    subtitle: "Stage 1",
    description:
      "Before production begins, we verify the integrity of the metal. We ensure the chemical composition and grade exactly match your project requirements.",
    image: "https://images.unsplash.com/photo-1685038408124-e20ecac92293",
    items: [
      "Material grade verification.",
      "Chemical composition analysis.",
      "Verification of Material Test Reports (MTR).",
      "Surface quality inspection.",
      "Dimensional tolerance check.",
    ],
    layout: "image-left",
  },
  {
    id: 2,
    title: "First-Article Inspection (FAI)",
    subtitle: "Stage 2",
    description:
      'We produce a "First-Off" sample at the start of every new batch. This part is strictly measured against your technical drawings using high-precision equipment like CMM or profile projectors to ensure 100% specification compliance before the full machine run starts.',
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_14c456e15-1767070339668.png",
    items: [
      "100% dimensional check against blueprints.",
      "Prevents errors before mass production begins.",
    ],
    layout: "image-right",
  },
  {
    id: 3,
    title: "In-Process Inspection",
    subtitle: "Stage 3",
    description:
      'Quality is monitored in real-time. Our operators perform periodic checks during the machining process to ensure the equipment is maintaining micron-level tolerances',
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_14c456e15-1767070339668.png",
    items: [
      "Continuous monitoring to prevent tool wear errors.",
      "Maintains consistency across high-volume bulk orders.",
      "Early detection and correction of measurement shifts.",
    ],
    layout: "image-left",
  },
  {
    id: 4,
    title: "Post-Machining Inspection",
    subtitle: "Stage 4",
    description:
      "Comprehensive dimensional and visual inspection of completed components before secondary operations or final packaging.",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_10202005b-1764660484309.png",
    items: [
      "Complete dimensional verification",
      "Thread gauge inspection",
      "Surface defect detection",
      "Batch sampling protocol",
    ],
    layout: "image-right",
  },
  {
    id: 5,
    title: "Secondary Operations QC",
    subtitle: "Stage 5",
    description:
      "Quality verification after threading, knurling, drilling, or other secondary operations to ensure specification compliance.",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_1c98175f5-1767508857901.png",
    items: [
      "Thread pitch and depth verification",
      "Knurling pattern consistency",
      "Hole diameter and depth accuracy",
      "Surface treatment quality",
    ],
    layout: "image-left",
  },
  {
    id: 6,
    title: "Final Inspection & Documentation",
    subtitle: "Stage 6",
    description:
      "Complete quality audit with measurement reports and certification before shipment approval. All metal components are verified for total alignment with your engineering specifications.",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_1ab90500c-1766997138557.png",
    items: [
      "100% visual inspection.",
      "Random dimensional sampling.",
      "Packaging quality verification.",
      "Inspection report generation.",
    ],
    layout: "image-right",
  },
];

const InspectionProcess = () => {

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const slidesContainerRef = useRef(null);

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

    const fallbackTimer = setTimeout(() => {
      if (sectionRef.current) {
        const elements = sectionRef.current.querySelectorAll(".reveal-on-scroll");
        elements.forEach((el) => el.classList.add("reveal-visible"));
      }
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !slidesContainerRef.current) return;

    const slides = gsap.utils.toArray('.inspection-slide');
    
    // The sticky scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", 
        end: "bottom bottom", 
        scrub: 1.2,
        pin: slidesContainerRef.current,
        pinSpacing: false,
        anticipatePin: 1,
      }
    });

    // Set initial state for slides (except the first one)
    slides.forEach((slide, i) => {
      if (i === 0) return;
      const stage = inspectionStages[i];
      
      // Alternate initial clip paths based on layout to match reference
      if (stage.layout === "image-right") {
        gsap.set(slide, { clipPath: 'inset(0% 0% 0% 100%)' }); // Hide to the right
      } else {
        gsap.set(slide, { clipPath: 'inset(0% 100% 0% 0%)' }); // Hide to the left
      }
    });

    // Animate each slide
    slides.forEach((slide, i) => {
      if (i === 0) return;
      const stage = inspectionStages[i];
      const startTime = (i / inspectionStages.length) * inspectionStages.length;

      // Slide Reveal (Alternating Wipe)
      tl.to(slide, 
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: "power2.inOut",
        },
        startTime
      );

      // Parallax content effect
      const content = slide.querySelector('.slide-content');
      const xOffset = stage.layout === "image-right" ? 100 : -100;
      
      tl.fromTo(content,
        { x: xOffset, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
        },
        startTime + 0.1
      );
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [inspectionStages.length]);



  return (
    <section ref={sectionRef} className="pt-3 bg-slate-50">
      {/* Mobile Header (Scrolls away) */}
      <div className="block md:hidden container mx-auto px-6 mb-8">
        <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Six-Stage Inspection Process
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mx-auto">
            Every component undergoes systematic quality verification at
            multiple production stages, ensuring consistent precision and
            reliability.
          </p>
        </div>
      </div>


      {/* Sticky Slide Animation Section */}
      <div ref={containerRef} className="relative w-full h-[510vh] bg-white overflow-hidden">
        
        {/* The inner container that GSAP will lock to the screen */}
        <div ref={slidesContainerRef} className="h-screen w-full flex flex-col relative overflow-hidden">
          
          {/* Desktop Header Section (Persistent & Non-Absolute) */}
          <div className="hidden md:block w-full z-[70] pt-20 pb-8 px-6 lg:px-[5%] bg-white/80 backdrop-blur-md">



            <div className="scroll-mt-24 reveal-on-scroll reveal-hidden text-center max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                Six-Stage Inspection Process
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Every component undergoes systematic quality verification at
                multiple production stages, ensuring consistent precision and
                reliability.
              </p>
            </div>
          </div>

          {/* Slides Content Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            {inspectionStages.map((stage, index) => (
              <div
                key={stage.id}
                className="inspection-slide absolute inset-0 w-full h-full flex items-center justify-center bg-white will-change-transform will-change-[clip-path]"
                style={{ zIndex: index + 1 }}
              >
                <div className="slide-content container mx-auto px-6 lg:px-[5%] w-full">
                  {/* Original content design preserved */}
                  <div
                    className={`flex flex-col ${stage.layout === "image-right" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-4 md:gap-8`}
                  >
                    {/* Image Section */}
                    <div className="w-full md:w-1/2">
                      <div className="relative group overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                        <img
                          src={stage.image}
                          alt={stage.title}
                          className="w-full aspect-[16/10] object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500"></div>
                      </div>
                    </div>

                    {/* Text Section with Timeline Guide */}
                    <div className="w-full md:w-1/2 relative pl-8 md:pl-10">
                      {/* Background Stage Number */}
                      <div className="absolute -top-8 left-8 md:-top-14 md:left-5 text-[80px] md:text-[140px] font-black text-slate-100 select-none pointer-events-none z-0 leading-none">
                        0{index + 1}
                      </div>



                      <div className="space-y-4 md:space-y-6 relative z-10">
                        <div>
                          <span className="text-orange-600 font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-1 md:mb-2 block">
                            {stage.subtitle}
                          </span>
                          <h3 className="text-xl md:text-3xl lg:text-4xl font-bold font-display text-[#1e293b] leading-tight">
                            {stage.title}
                          </h3>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                          <p className="text-slate-500 leading-relaxed font-body text-base md:text-lg max-w-xl">
                            {stage.description}
                          </p>

                          <ul className="grid grid-cols-1 gap-2 md:gap-5">


                            {stage.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="mt-1.5 min-w-[20px] h-[20px] rounded-full bg-green-100 flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span className="text-secondary font-medium text-sm md:text-base">
                                  {item}
                                </span>

                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 right-10 z-[100] flex flex-col items-end gap-2 text-slate-400 font-mono text-[10px] tracking-widest uppercase pointer-events-none">
          <div className="flex gap-2">
            {inspectionStages.map((_, i) => (
              <div key={i} className={`w-8 h-[2px] bg-slate-200 opacity-50`} />
            ))}
          </div>
          {/* <span>Scroll to Navigate Workflow</span> */}
        </div>
      </div>
    </section>

  );
};

export default InspectionProcess;
