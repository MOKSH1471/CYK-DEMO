import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GrowthJourney } from './components/GrowthJourney';
import { AudienceSelector } from './components/AudienceSelector';
import { CaseStudies } from './components/CaseStudies';
import { TestimonialsSection } from './components/TestimonialsSection';
import { HoReCaTalks } from './components/HoReCaTalks';
import { Footer } from './components/Footer';
import { EnquiryWizard } from './components/EnquiryWizard';
import { ServicesModal } from './components/ServicesModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [prefilledStage, setPrefilledStage] = useState<number | undefined>(undefined);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | undefined>(undefined);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const handleOpenEnquiry = (stageIndex?: number) => {
    setPrefilledStage(stageIndex);
    setEnquiryOpen(true);
  };

  const handleOpenServices = (slug?: string) => {
    setSelectedServiceSlug(slug);
    setServicesOpen(true);
  };

  const handleStartJourney = () => {
    const el = document.getElementById('journey');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121316] flex flex-col font-sans selection:bg-[#847445] selection:text-white">
      {/* 1. Sticky Header with Official Logo & Anchor Links */}
      <Header
        isIntroComplete={isIntroComplete}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenServices={() => handleOpenServices()}
      />

      <main className="flex-grow">
        {/* 2. Hero + Growth Flight Journey: Unified pinned viewport */}
        <Hero
          onStartJourney={handleStartJourney}
          onOpenEnquiry={() => handleOpenEnquiry()}
          onConsultStage={(stageIndex) => handleOpenEnquiry(stageIndex)}
          onOpenServiceModal={() => handleOpenServices()}
          onIntroComplete={() => setIsIntroComplete(true)}
        />

        {/* 3. Growth Journey: Stages 01 to 08 with continuous flight corridor */}
        <GrowthJourney
          onConsultStage={(stageIndex) => handleOpenEnquiry(stageIndex)}
          onOpenServiceModal={() => handleOpenServices()}
        />

        {/* 4. Services: Audience segmentation and entry pathways */}
        <AudienceSelector
          onSelectAudience={(targetStage) => handleOpenEnquiry(targetStage)}
        />

        {/* 5. Work / Projects: Verified case studies with dual-facet filtering */}
        <CaseStudies
          onEnquireProject={() => handleOpenEnquiry()}
        />

        {/* 6. Voices: Verbatim client testimonials carousel */}
        <TestimonialsSection />

        {/* 7. Insights: HoReCa Talks domain authority articles */}
        <HoReCaTalks />
      </main>

      {/* 8. Footer: Official registered address, legal links, and brand identity */}
      <Footer
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenServices={() => handleOpenServices()}
      />

      {/* Clean Floating WhatsApp button (no chat popup) */}
      <FloatingWhatsApp />

      {/* Interactive Contact / Service Modals */}
      <EnquiryWizard
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialStageIndex={prefilledStage}
      />

      <ServicesModal
        isOpen={servicesOpen}
        onClose={() => setServicesOpen(false)}
        initialServiceSlug={selectedServiceSlug}
        onSelectService={(slug) => {
          setServicesOpen(false);
          handleOpenEnquiry();
        }}
      />
    </div>
  );
}

export default App;
