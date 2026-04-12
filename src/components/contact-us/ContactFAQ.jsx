import React, { useState } from 'react';
import { useContactInfo } from '../common/contactInfo';

  const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { hrefs } = useContactInfo();

  const faqs = [
    {
      question: "What is your typical response time for quote requests?",
      answer: "We respond to all quote requests within 24 hours during business days. For urgent inquiries, please contact us via WhatsApp for immediate assistance. Complex technical requirements may require additional time for accurate quotation."
    },
    {
      question: "What file formats do you accept for technical drawings?",
      answer: "We primarily accept PDF, DWG, DXF, and STEP files. If you have other formats, please let us know, and we'll check compatibility with our engineering software."
    },
    {
      question: "Do you provide samples before bulk production?",
      answer: "Yes, we encourage sample approval for custom components. This ensures all specifications are met before proceeding with large-scale manufacturing."
    },
    {
      question: "What are your minimum order quantities?",
      answer: "MOQs vary depending on the technical complexity and material grade of the component. We support both prototype development and high-volume production."
    },
    {
      question: "How do I schedule a factory visit?",
      answer: "Factory visits are available by appointment for qualified buyers. Please contact our technical team via the form above or WhatsApp to coordinate a suitable time."
    },
    {
      question: "What payment terms do you offer for international orders?",
      answer: "We offer flexible payment terms for international clients, including LC and secure bank transfers, depending on the order volume and history."
    }
  ];

  return (
    <section className="pt-8 pb-24 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[18px] text-slate-600 leading-relaxed">
            Quick answers to common questions about our inquiry process and services
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-[#f4f6f8] rounded-xl border transition-all duration-300 ${
                openIndex === index ? 'border-slate-200 ring-1 ring-slate-100' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full text-left p-6 md:p-8 flex items-center justify-between group cursor-pointer"
              >
                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-[#1a2b3c]' : 'text-slate-700'}`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                   <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 md:px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions? Card */}
        {/* <div className="mt-16 bg-white border border-slate-100 rounded-2xl p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-8 group">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-primary transition-colors">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-grow space-y-3">
            <h4 className="text-2xl font-bold text-[#1a2b3c]">Still have questions?</h4>
            <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
              Our technical team is here to help. Contact us directly for personalized assistance with your specific requirements.
            </p>
            <div className="pt-4 flex flex-row md:flex-wrap gap-2 sm:gap-4 w-full md:w-auto">
              <a 
                href={hrefs.mailto || "mailto:info@nexturn.in"}
                className="flex-1 md:flex-initial bg-[#1a2b3c] hover:bg-[#152331] text-white px-3 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all cursor-pointer shadow-lg shadow-slate-200 text-xs sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">Email Us</span>
              </a>
              <a 
                href={hrefs.whatsapp || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-initial bg-[#0f7d0f] hover:bg-[#0c6b0c] text-white px-3 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all cursor-pointer shadow-lg shadow-green-100 text-xs sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 fill-current transition-transform group-hover:scale-110 shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.57 0-3.11-.42-4.47-1.21l-.32-.19-3.15.83.84-3.04-.2-.33c-.87-1.39-1.34-3.01-1.34-4.67 0-4.73 3.85-8.58 8.58-8.58 2.29 0 4.44.89 6.06 2.51 1.62 1.62 2.51 3.77 2.51 6.06.01 4.73-3.84 8.59-8.57 8.59zm4.75-6.5c-.26-.13-1.53-.75-1.77-.84-.23-.09-.4-.13-.57.13-.17.26-.65.84-.79.97-.15.15-.3.17-.55.04-.25-.13-1.07-.39-2.03-1.25-.74-.66-1.25-1.48-1.39-1.73-.14-.26-.01-.39.12-.52.12-.11.26-.3.39-.45s.17-.26.26-.43c.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.77 2.7 4.28 3.78.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.68-1.19.2-.58.2-1.08.15-1.19-.06-.1-.21-.17-.47-.3z"></path>
                </svg>
                <span className="truncate whitespace-nowrap">
                  <span className="md:hidden">WhatsApp</span>
                  <span className="hidden md:inline">WhatsApp Chat</span>
                </span>
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default ContactFAQ;
