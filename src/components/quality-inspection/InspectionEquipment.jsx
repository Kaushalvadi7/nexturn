import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getInspectionEquipment } from '../../lib/api';

const CountUp = ({ end, duration = 2000, suffix = "", decimals = 0 }) => {
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
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

const InspectionEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [equipmentError, setEquipmentError] = useState('');
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setIsLoadingEquipment(true);
      setEquipmentError('');
      try {
        const data = await getInspectionEquipment();
        if (!isActive) return;

        const normalized = (Array.isArray(data) ? data : []).map((row) => ({
          id: row.id,
          title: row.title || '',
          subtitle: row.measurement || '',
          accuracy: row.accuracy || '',
          application: Array.isArray(row.application) ? row.application : [],
          icon: row.icon_name || 'straighten',
        }));

        setEquipment(normalized);
      } catch (error) {
        if (!isActive) return;
        console.error('Failed to load inspection equipment', error);
        setEquipment([]);
        setEquipmentError(error?.message || 'Failed to load inspection equipment.');
      } finally {
        if (isActive) setIsLoadingEquipment(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, []);

  // GSAP Infinite Scroll Logic
  useEffect(() => {
    if (!isLoadingEquipment && equipment.length >= 4 && sliderRef.current) {
      const slider = sliderRef.current;
      const scrollWidth = slider.scrollWidth;
      const halfWidth = scrollWidth / 2;

      // Ensure we haven't already created the animation or if dependencies changed
      if (animationRef.current) animationRef.current.kill();

      animationRef.current = gsap.to(slider, {
        x: -halfWidth,
        duration: 35, // Adjusted for smoother default motion
        ease: "none",
        repeat: -1,
        paused: false
      });

      const handleMouseEnter = () => {
         if (animationRef.current) animationRef.current.pause();
      };
      const handleMouseLeave = () => {
         if (animationRef.current && !animationRef.current.vars.manual) animationRef.current.play();
      };

      slider.addEventListener('mouseenter', handleMouseEnter);
      slider.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (animationRef.current) animationRef.current.kill();
        slider.removeEventListener('mouseenter', handleMouseEnter);
        slider.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isLoadingEquipment, equipment]);

  const handleManualScroll = (direction) => {
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = { vars: { manual: true }, kill: () => {} }; // Marker to prevent restart
    }

    const slider = sliderRef.current;
    if (!slider) return;

    const scrollWidth = slider.scrollWidth;
    const halfWidth = scrollWidth / 2;
    const currentX = gsap.getProperty(slider, "x");
    
    // Calculate precise item width (card + gap)
    const card = slider.querySelector(':first-child');
    const gap = 32; // Defined in className "flex gap-8"
    const itemFullWidth = card ? card.offsetWidth + gap : 432;
    
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

  const spcStats = [
    { label: 'First Pass Yield', end: 98.5, suffix: '%', decimals: 1, trend: 'up' },
    { label: 'Process Capability (Cpk)', end: 1.67, suffix: '', decimals: 2, trend: 'neutral' },
    { label: 'Defect Rate', end: 0.8, suffix: '%', decimals: 1, trend: 'down' },
    { label: 'On-Time Delivery', end: 99.2, suffix: '%', decimals: 1, trend: 'up' },
  ];

  // Helper to render an item to avoid code duplication
  const renderItem = (item, key) => (
    <div
      key={key}
      className={`${equipment.length >= 4 ? 'w-[calc(100vw-64px)] sm:w-[320px] md:w-[400px] shrink-0' : ''} bg-white p-10 rounded-xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start gap-6 text-left">
        <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[26px] text-primary">{item.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-primary mb-1 break-words">{item.title}</h3>
          <p className="text-accent text-sm font-medium mb-6 uppercase tracking-wider break-words">{item.subtitle}</p>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Accuracy</p>
              <p className="text-secondary font-medium text-sm break-words whitespace-pre-wrap">{item.accuracy}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Application</p>
              <p className="text-secondary text-sm leading-relaxed break-words whitespace-pre-wrap">{item.application.join(', ') || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="pt-8 pb-24 bg-[#f4f7f9]">
      <div className="container mx-auto px-6 lg:px-[5%]">
        {/* Equipment Specifications Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Inspection Equipment Specifications
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Calibrated precision measurement instruments ensuring accurate dimensional verification and quality compliance.
          </p>
        </div>

        {/* Dynamic Display Logic */}
        <div className="mb-20 relative">
          {equipmentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-semibold">
              {equipmentError}
            </div>
          )}
          {isLoadingEquipment && (
            <div className="bg-white border border-slate-100 text-slate-500 px-6 py-4 rounded-xl text-sm font-semibold">
              Loading inspection equipment...
            </div>
          )}
          {!isLoadingEquipment && equipment.length === 0 && !equipmentError && (
            <div className="bg-white border border-dashed border-slate-200 text-slate-500 px-6 py-10 rounded-xl text-sm font-semibold text-center">
              No inspection equipment has been published yet.
            </div>
          )}

          {!isLoadingEquipment && equipment.length > 0 && (
            equipment.length >= 4 ? (
              /* Circular Slider for 4+ items */
              <div className="relative group/slider overflow-visible">
                <div className="relative overflow-hidden -mx-6 px-4 sm:px-0">
                  <div 
                    ref={sliderRef}
                    className="flex gap-8 w-max select-none will-change-transform"
                  >
                    {/* Two iterations of mapping to create the seamless loop effect */}
                    {equipment.map((item, idx) => renderItem(item, `round1-${item.id}-${idx}`))}
                    {equipment.map((item, idx) => renderItem(item, `round2-${item.id}-${idx}`))}
                  </div>
                  
                  {/* Fade overlays for smooth edges */}
                  <div className="hidden sm:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50/50 to-transparent pointer-events-none z-10"></div>
                  <div className="hidden sm:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none z-10"></div>
                </div>

                {/* Manual Navigation Buttons - Positioned outside the cards */}
                <button 
                  onClick={() => handleManualScroll('left')}
                  className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-12 h-12 rounded-full bg-primary shadow-xl border border-primary flex items-center justify-center text-white hover:bg-[#254a7c] transition-all pointer-events-auto cursor-pointer z-20"
                >
                  <span className="material-symbols-outlined font-bold">chevron_left</span>
                </button>
                <button 
                  onClick={() => handleManualScroll('right')}
                  className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-12 h-12 rounded-full bg-primary shadow-xl border border-primary flex items-center justify-center text-white hover:bg-[#254a7c] transition-all pointer-events-auto cursor-pointer z-20"
                >
                  <span className="material-symbols-outlined font-bold">chevron_right</span>
                </button>
              </div>
            ) : (
              /* Standard Grid for 1-3 items */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipment.map((item) => renderItem(item, item.id))}
              </div>
            )
          )}
        </div>

        {/* Calibration Callout */}
         <div className="mt-12 mb-20 flex items-start gap-4 bg-white/50 py-4 px-8 rounded-full border border-slate-100 max-w-fit mx-auto">
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] text-white font-bold leading-none flex-shrink-0 mt-1">
                i
              </div>
              <div className="space-y-0.5 text-left pr-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Calibration & Maintenance</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  All measurement instruments are calibrated annually by NABL-accredited laboratories. Calibration
                  certificates are maintained for traceability. Daily verification checks ensure measurement accuracy
                  throughout production cycles.
                </p>
              </div>
            </div>



        {/* Statistical Process Control */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Statistical Process Control</h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Data-driven quality monitoring with real-time process capability analysis and continuous improvement
            tracking.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {spcStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col items-center group hover:border-accent/30 transition-colors h-full"
            >
              <div className="mb-4 sm:mb-6 relative">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    stat.trend === 'up'
                      ? 'bg-green-50 text-green-600'
                      : stat.trend === 'down'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {stat.trend === 'up' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"
                      />
                    </svg>
                  )}
                  {stat.trend === 'down' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0v-8m0 8l-9-9-4 4-6-6"
                      />
                    </svg>
                  )}
                  {stat.trend === 'neutral' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-2xl sm:text-4xl font-bold text-primary mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                <CountUp end={stat.end} suffix={stat.suffix} decimals={stat.decimals} />
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 font-bold leading-tight">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InspectionEquipment;

