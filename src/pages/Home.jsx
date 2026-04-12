import HomeSection from "../components/home/HomeSection";
import Capabilities from '../components/home/Capabilities';
import MaterialSpecializations from '../components/home/MaterialSpecializations';
import QualitySystem from '../components/home/QualitySystem';
import ClientReviews from '../components/home/ClientReviews';
import ExportExperience from '../components/home/ExportExperience';
import ForSeo from "../components/ForSeo";

const Home = () => {
  return (
    <>
      <ForSeo
        title="Nexturn Component Craft - Precision Engineering & Export Excellence"
        description="Discover Nexturn Component Craft, an ISO 9001:2015 certified precision engineering company specializing in CNC machining, sheet metal fabrication, and high-quality custom metal components for diverse global markets."
        keywords="precision engineering, CNC machining, sheet metal fabrication, custom metal components, Nexturn Component Craft, export excellence, ISO 9001:2015 engineering,CNC turned parts manufacturer, Precision metal components manufacturer, CNC machining parts supplier, Custom CNC machining services, Brass components manufacturer, Stainless steel CNC parts manufacturer, CNC auto parts supplier, High precision machined components, OEM metal parts manufacturer, CNC parts exporter India, Brass CNC turned components, Stainless steel precision parts, Aluminum CNC machined parts, Mild steel machined components, Automotive CNC components, Electrical brass parts manufacturer, Aerospace precision components, Hydraulic machined parts, CNC parts manufacturer in India for USA, CNC machining supplier for Europe, Export quality CNC components India, ISO certified CNC machining company India, CNC parts exporter to Germany / USA / UK , best CNC machining company in India for export, high precision brass components manufacturer India, custom CNC turned parts supplier for OEM, how to choose CNC machining supplier, CNC machining tolerance and quality standards, ISO certified CNC manufacturer, PPAP approved CNC parts supplier, low PPM manufacturing company, RoHS compliant metal components, 3.1 certified material supplier, CNC turned parts manufacturer, Precision metal components, CNC parts exporter India, Custom CNC machining services, Brass / SS / Aluminum components, CNC parts manufacturer in Jamnagar, Brass components manufacturer in Jamnagar, CNC machining company in Jamnagar India, Precision components manufacturer Jamnagar, Brass turned parts manufacturer Jamnagar, CNC parts exporter from Jamnagar, Brass components manufacturer in Jamnagar for export, CNC machining supplier Jamnagar India for USA, Jamnagar brass parts exporter Europe, High precision CNC components Jamnagar India, CNC parts manufacturer in Jamnagar, Precision components exporter India, Precision Metal Components Manufacturer, Custom CNC Turned Parts India, Brass Components Exporter to USA, High Precision Machined Parts, Contract Manufacturing Services India, Technical & Quality Keywords (For Engineers), Tight Tolerance CNC Machining (±0.01mm), RoHS Compliant Brass Parts, C360 Brass Component Manufacturing, Bespoke Metal Engineering Solutions, ISO 9001:2015 Certified Metal Factory, Precision Turning for Electrical Parts, Material-Specific Keywords, Custom Brass Fittings Manufacturer, Copper Component Precision Machining, Stainless Steel Turned Components, Aluminum Precision Engineering, Lead-Free Brass Components Export, Export & Logistics Keywords, Global Supply Chain Metal Parts, OEM Metal Component Supplier, Industrial Component Export to Europe, Bulk Brass Parts Manufacturing, Precision Component Sourcing India, Long-Tail Keywords, Custom metal components for automotive industry, High volume CNC turning services India, Precision brass parts for gas and fluid power, Export-ready precision engineering partner"
        path="/"
        serviceSchema={{
          serviceName: "Precision Engineering & Export Excellence",
          serviceDescription: "ISO 9001:2015 certified precision engineering company specializing in CNC machining, sheet metal fabrication, and custom metal components for global markets.",
        }}
      />

      <div className="dark:bg-background-dark">
        <div id="hero" className="scroll-mt-24">
          <HomeSection />
        </div>
        <div className="scroll-mt-24">
          <Capabilities />
        </div>
        <div id="materials" className="scroll-mt-24">
          <MaterialSpecializations />
        </div>
        <div id="quality-system" className="scroll-mt-24">
          <QualitySystem />
        </div>
        <div id="client-reviews" className="scroll-mt-24">
          <ClientReviews />
        </div>
        <div id="export-experience" className="scroll-mt-24">
          <ExportExperience />
        </div>
        {/* <div id="request-quote" className="scroll-mt-24">
        <RequestQuote />
      </div> */}
      </div>
    </>
  );
};

export default Home;
