import React, { useEffect } from 'react';
import InspectionHero from '../components/quality-inspection/InspectionHero';
import InspectionProcess from '../components/quality-inspection/InspectionProcess';
import InspectionEquipment from '../components/quality-inspection/InspectionEquipment';
import QualityControlCharts from '../components/quality-inspection/QualityControlCharts';
import QualityCertifications from '../components/quality-inspection/QualityCertifications';
import ForSeo from '../components/ForSeo';

const QualityInspection = () => {
  return (
    <>
      <ForSeo
        title="Quality Inspection | Nexturn Component Craft"
        description="Learn about our rigorous quality inspection processes, advanced inspection equipment, and ISO 9001:2015 certified quality control."
        keywords="quality inspection, quality control, ISO 9001:2015, precision measurement, inspection equipment, Nexturn quality assurance"
        path="/quality-inspection"
        serviceSchema={{
          serviceName: "Quality Inspection & Control",
          serviceDescription: "Rigorous quality inspection processes and ISO 9001:2015 certified quality control to ensure precision engineering excellence.",
        }}
      />
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <div id="overview" className="scroll-mt-16">
          <InspectionHero />
        </div>

        {/* Main Content Section */}
        <div id="process" className="scroll-mt-16">
          <InspectionProcess />
        </div>

        {/* Equipment & SPC Section */}
        <div id="equipment" className="scroll-mt-16">
          <InspectionEquipment />
        </div>

        {/* Quality Control Charts Section */}
        <div id="spc-charts" className="scroll-mt-16">
          <QualityControlCharts />
        </div>

        {/* Certifications, Documentation, and Feedback Sections */}
        <div id="certifications" className="scroll-mt-16">
          <QualityCertifications />
        </div>
      </div>
    </>
  );
};

export default QualityInspection;
