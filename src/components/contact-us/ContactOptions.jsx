import React from 'react';
import { useContactInfo } from '../common/contactInfo';

const ContactOptions = () => {
  const { info, hrefs } = useContactInfo();

  const options = [
    {
      title: "Phone Support",
      details: info.phone || "+91 98765 43210",
      subDetails: "Mon-Sat: 9:00 AM - 6:00 PM IST",
      linkText: "Call Now",
      linkHref: hrefs.tel || "tel:+919876543210",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      title: "Email Inquiries",
      details: info.email || "sales@nexturnprecision.com",
      subDetails: "Response within 24 hours",
      linkText: "Send Email",
      linkHref: hrefs.mailto || "mailto:sales@nexturnprecision.com",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "WhatsApp Business",
      details: info.whatsapp || "+91 98765 43210",
      subDetails: "Instant technical discussions",
      linkText: "Chat on WhatsApp",
      linkHref: hrefs.whatsapp || "#",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "Factory Location",
      details: info.location || "Jamnagar, Gujarat, India",
      subDetails: "Visit by appointment",
      linkText: "Get Directions",
      linkHref: hrefs.maps || "https://maps.google.com/?q=Jamnagar,Gujarat,India",
      icon: (
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="pt-8 pb-5 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Multiple Ways to Connect
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Choose your preferred communication channel for technical inquiries, quote requests, or general questions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {options.map((option, index) => (
            <div key={index} className="bg-[#f4f6f8] p-5 sm:p-10 rounded-xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-primary hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center mb-4 sm:mb-8 shadow-sm group-hover:scale-110 transition-transform shrink-0">
                <div className="scale-75 sm:scale-100">{option.icon}</div>
              </div>
              <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-primary mb-2 sm:mb-4 leading-tight">{option.title}</h3>
              <p className="text-secondary font-bold text-[10px] sm:text-sm mb-1 sm:mb-2 break-all sm:break-normal">{option.details}</p>
              <p className="text-slate-500 text-[9px] sm:text-xs font-medium mb-4 sm:mb-8 leading-tight px-1 sm:px-4">
                {option.subDetails}
              </p>
              <a 
                href={option.linkHref}
                target={option.linkHref.startsWith('http') ? '_blank' : undefined}
                rel={option.linkHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="mt-auto flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-bold text-primary group-hover:text-accent transition-colors"
              >
                {option.linkText}
                <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
