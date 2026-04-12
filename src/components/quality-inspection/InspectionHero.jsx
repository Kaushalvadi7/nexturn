import React from 'react';

import { Link } from "react-router-dom";

const InspectionHero = () => {
  return (
    <section className="relative pt-24 pb-24 lg:pt-24 home-hero-bg-premium text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
           
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in-up">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-3 text-white/60 text-sm font-medium mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-white font-bold underline decoration-accent decoration-2 underline-offset-4">Quality Inspection</span>
            </nav>
 
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-sm">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              <span className="text-[12px]  text-white uppercase tracking-[0.2em]">Quality Assurance</span>
            </div>
 
            <div className="space-y-2">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
               Quality & Precision
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-accent leading-tight tracking-tight drop-shadow-lg">
                Inspection Systems
              </h2>

            </div>

 
            <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-3xl font-medium">
             At Nexturn Componentcraft, quality is built into every stage, not just checked at the end.
              Using advanced tools and a rigorous six-stage process, we ensure every metal component—from 
              small prototypes to bulk orders—meets international standards with micron-level precision and
               absolute reliability.
            </p>
 
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5 pt-4">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform text-2xl">
                    fact_check
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">6</span>
                </div>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                  Inspection Stages
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform text-2xl">
                    high_quality
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">100%</span>
                </div>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                  Component Testing
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/15 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-orange-400 group-hover:scale-110 transition-transform text-2xl">
                    verified
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">ISO</span>
                </div>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                  Certified Processes
                </p>
              </div>
            </div>
          </div>
 
          {/* Right Content: Image */}
          <div className="relative flex items-center justify-center lg:justify-end animate-fade-in-right lg:pt-16 group">
               <div className="relative z-10 w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
               <img 
                 src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=2070" 
                 alt="CMM Quality Measurement" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
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
                  Quality Assured
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-400 mt-1 whitespace-nowrap">
                  100% inspection at every stage
                </p>
              </div>
            </div> 
             
             {/* Decorative element */}
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InspectionHero;
