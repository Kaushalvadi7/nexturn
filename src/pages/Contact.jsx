import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ContactHero from '../components/contact-us/ContactHero';
import ContactOptions from '../components/contact-us/ContactOptions';
import QuoteForm from '../components/contact-us/QuoteForm';
import BusinessInfo from '../components/contact-us/BusinessInfo';
import MapSection from '../components/contact-us/MapSection';
import ContactFAQ from '../components/contact-us/ContactFAQ';
import ForSeo from '../components/ForSeo';

const Contact = () => {
  return (
    <>
      <ForSeo
        title="Contact Us | Nexturn Component Craft"
        description="Get in touch with Nexturn Component Craft. Request a quote or inquire about our precision engineering and CNC machining services."
        keywords="contact Nexturn Component Craft, request a quote, precision engineering inquiry, CNC machining contact, custom metal components inquiry"
        path="/contact-us"
        serviceSchema={{
          serviceName: "Contact Nexturn Component Craft",
          serviceDescription: "Get in touch for precision engineering inquiries and quote requests.",
        }}
      />
      <div className="min-h-screen bg-white text-foreground">
        {/* Hero Section */}
        <div id="overview" className="scroll-mt-16">
          <ContactHero />
        </div>

        {/* Connection Options Grid */}
        <div id="contact-options" className="scroll-mt-16">
          <ContactOptions />
        </div>

        {/* Request a Quote Multi-step Form */}
        <div id="quote-form" className="scroll-mt-16">
          <QuoteForm />
        </div>

        {/* Business Hours and Global Time Zones */}
        <div id="business-info" className="scroll-mt-16">
          <BusinessInfo />
        </div>

        {/* Map and Location Facility Section */}
        <div id="map" className="scroll-mt-16">
          <MapSection />
        </div>

        {/* Frequently Asked Questions */}
        <div id="faq" className="scroll-mt-16">
          <ContactFAQ />
        </div>

      </div>
    </>
  );
};

export default Contact;
