import React from 'react';
import { Link } from "react-router-dom";

const ContactHero = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-24 text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/8201293-uhd_3840_2160_25fps.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/70 z-10 pointer-events-none"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
           
          {/* Left Content */}
          <div className="space-y-7 animate-fade-in-up">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-3 text-white/60 text-sm font-medium mb-6">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-white font-bold underline decoration-accent decoration-2 underline-offset-4 pointer-events-none">Contact Us</span>
            </nav>
 
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-sm">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              <span className="text-[12px] text-white uppercase tracking-[0.2em]">Global Support</span>
            </div>
 
            <div className="space-y-2">

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Get in Touch with Our
              </h1>

              <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-accent leading-tight tracking-tight drop-shadow-lg">
                Technical Team
              </h2>

            </div>


 
            <p className="text-lg md:text-xl text-white leading-relaxed max-w-xl font-medium">
              Request a quote, submit technical drawings, or discuss your custom metal component requirements with our engineering experts.
            </p>
 
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(224,112,1,0.2)] group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-accent text-xl font-black">check</span>
                </div>
                <span className="text-sm md:text-base text-white font-bold transition-colors">Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(224,112,1,0.2)] group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-accent text-xl font-black">support_agent</span>
                </div>
                <span className="text-sm md:text-base text-white font-bold transition-colors">Technical consultation available</span>
              </div>
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(224,112,1,0.2)] group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-accent text-xl font-black">verified_user</span>
                </div>
                <span className="text-sm md:text-base text-white font-bold transition-colors">Secure file upload</span>
              </div>
               <div className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(224,112,1,0.2)] group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-accent text-xl font-black">verified_user</span>
                </div>
                <span className="text-sm md:text-base text-white font-bold transition-colors"> Good Quality</span>
              </div>
               
            </div>
          </div>
 
          {/* Right Content: Image */}
          <div className="relative group animate-fade-in-right lg:mt-32">
             {/* <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50 aspect-square lg:aspect-[4/3]">
               <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
                 alt="Customer Success Team" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
             </div> */}
             
             {/* Decorative element */}
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactHero;
