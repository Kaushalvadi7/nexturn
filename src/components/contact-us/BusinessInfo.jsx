import React from 'react';

const BusinessInfo = () => {
  return (
    <section className="pb-12 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Business Hours Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a2b3c]">Business Hours</h3>
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm text-slate-600 font-medium">Saturday - Thursday</span>
                <span className="text-sm text-[#52a17b] font-bold">8:00 AM - 8:00 PM IST</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <span className="text-sm text-slate-600 font-medium">Friday</span>
                <span className="text-sm text-slate-400 font-bold">Closed</span>
              </div>
              {/* <div className="flex justify-between items-center py-2.5">
                <span className="text-sm text-slate-600 font-medium">Sunday</span>
                <span className="text-sm text-slate-400 font-bold">Closed</span>
              </div> */}
            </div>

            <div className="mt-6 p-5 bg-slate-50/50 rounded-lg">
              <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                <span className="font-bold text-[#1a2b3c]">Note:</span> For urgent technical inquiries outside business hours, please use WhatsApp or email. We respond to all messages within 24 hours.
              </p>
            </div>
          </div>

          {/* Global Time Zones Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a2b3c]">Global Time Zones</h3>
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <div>
                  <p className="text-sm text-slate-900 font-bold">India (IST)</p>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">UTC +5:30</p>
                </div>
                <span className="text-[#1a2b3c] font-bold text-sm">08:00 AM - 08:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <div>
                  <p className="text-sm text-slate-900 font-bold">Europe (CET)</p>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">UTC +1:00</p>
                </div>
                <span className="text-[#1a2b3c] font-bold text-sm">03:30 AM - 03:30 PM</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                <div>
                  <p className="text-sm text-slate-900 font-bold">USA East (EST)</p>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">UTC -5:00</p>
                </div>
                <span className="text-[#1a2b3c] font-bold text-sm">09:30 PM - 09:30 AM</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <p className="text-sm text-slate-900 font-bold">USA West (PST)</p>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">UTC -8:00</p>
                </div>
                <span className="text-[#1a2b3c] font-bold text-sm">06:30 PM - 06:30 AM</span>
              </div>
            </div>

            <div className="mt-6 text-center px-4">
              <p className="text-[9px] leading-relaxed text-slate-400 font-medium">
                Current time displayed is as of January 5, 2026. We coordinate with clients across all major time zones for convenient communication.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BusinessInfo;
