import React from 'react';
import { useContactInfo } from '../common/contactInfo';

const MapSection = () => {
  const { info, hrefs } = useContactInfo();
  const location = info.location || "Industrial Area, Jamnagar\nGujarat 361004, India";
  const mapEmbedUrl = hrefs.mapEmbed || "https://www.google.com/maps?q=22.4707,70.0577&z=14&output=embed";
  const directionsUrl = hrefs.mapDirections || "https://www.google.com/maps/dir/?api=1&destination=22.4707,70.0577";
  const facilityLabel = String(location)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)[0] || "Jamnagar, Gujarat, India";

  const logisticsDetail = [
    {
      icon: "local_shipping",
      label: "Global Seaports",
      points: ["Mundra Port", "Kandla Port", "Nhava sheva Port", "JNPT Port"]
    },
    {
      icon: "flight",
      label: "Aviation Network",
      primary: "Ahmedabad Airport",
      secondary: "Regional & International cargo support",
      distance: "300 - 350 km",
    },
    {
      icon: "factory",
      label: "Factory Visits",
      primary: "Factory visits are by appointment only.",
      secondary: "Please contact us to schedule",
      // distance: "08 km",
    }
  ];

  return (
    <section className="py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20 mb-6">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Strategically Located</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Visit Our Global <span className="text-accent underline decoration-accent/30 underline-offset-8">Export Hub</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Located in the heart of Jamnagar's industrial belt, our facility is optimized for international 
              logistics with seamless connectivity to India's largest commercial ports.
            </p>
          </div>
          <div className="hidden lg:block pb-2">
             <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                   <span className="material-symbols-outlined text-white">location_on</span>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facility Location</p>
                   <p className="text-sm font-bold text-slate-900">{facilityLabel}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Immersive Map Container */}
        <div className="relative group mb-12">
           <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="h-[450px] md:h-[600px] w-full bg-slate-50 relative">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   loading="lazy" 
                   title="Nexturn Manufacturing Location" 
                   referrerPolicy="no-referrer-when-downgrade" 
                   src={mapEmbedUrl}
                   className="border-0 grayscale-0 contrast-125 opacity-90 group-hover:grayscale-0 transition-all duration-1000"
                 ></iframe>
                 
                 {/* Floating Overlay Info (Desktop Only) */}
                 <div className="absolute bottom-8 right-8 hidden md:block max-w-[280px]">
                    <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl text-white">
                       <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Facility Address</h4>
                       <p className="text-sm font-medium leading-relaxed opacity-80 whitespace-pre-line mb-4">
                          {location}
                       </p>
                       <a 
                        href={directionsUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-accent text-slate-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                       >
                          Get Directions
                          <span className="material-symbols-outlined text-sm">near_me</span>
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Logistics Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {logisticsDetail.map((item, idx) => (
             <div key={idx} className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                {idx === 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-accent transition-colors">{item.icon}</span>
                       </div>
                       <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{item.label}</h4>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                       {item.points.map((p, pIdx) => (
                         <div key={pIdx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{p}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-accent transition-colors">{item.icon}</span>
                       </div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.distance}</span>
                    </div>

                    <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">{item.label}</h4>
                    <p className="text-lg font-bold text-slate-900 mb-2 truncate">{item.primary}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                       {item.secondary}
                    </p>
                  </>
                )}
             </div>
           ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
           <p className="text-slate-400 text-sm font-medium">
             Factory visits are available for verified international buyers. Please contact our trade relations team to schedule an appointment.
           </p>
        </div>

      </div>
    </section>
  );
};

export default MapSection;
