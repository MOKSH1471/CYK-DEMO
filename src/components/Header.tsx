import React from 'react';
import { CardNav, CardNavItem, CardNavLink } from './CardNav';

interface HeaderProps {
  onOpenEnquiry: (prefilledStage?: number) => void;
  onOpenServices: (serviceSlug?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry, onOpenServices }) => {
  const items: CardNavItem[] = [
    {
      label: 'Growth Journey',
      description: 'The 8-stage end-to-end restaurant consulting pipeline.',
      links: [
        { label: 'Stage 01: Concept & Feasibility', href: '#journey' },
        { label: 'Stage 03: Kitchen Planning & Setup', href: '#journey' },
        { label: 'Stage 05: Menu Engineering & R&D', href: '#journey' },
        { label: 'Stage 08: National Expansion', href: '#journey' }
      ]
    },
    {
      label: 'Services',
      description: '13 bespoke services across Culinary, Architecture & Expansion.',
      links: [
        { label: 'Explore All 13 Services', href: '#services' },
        { label: 'Culinary Direction & Menu R&D', href: '#services' },
        { label: 'Kitchen Setup & Operations', href: '#services' },
        { label: 'Franchise Consulting & SOPs', href: '#services' }
      ]
    },
    {
      label: 'Work & Proof',
      description: 'Delivered client brands, founder voices & industry insights.',
      links: [
        { label: 'Verified Client Work', href: '#projects' },
        { label: 'Founder Testimonials', href: '#testimonials' },
        { label: 'HoReCa Talks Videos', href: '#horeca-talks' },
        { label: 'Contact & HQs', href: '#contact' }
      ]
    }
  ];

  const handleLinkClick = (link: CardNavLink) => {
    if (link.href === '#services') {
      onOpenServices();
      return;
    }
    if (link.href?.startsWith('#')) {
      const targetId = link.href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-[100] px-4 pointer-events-none">
      <div className="pointer-events-auto">
        <CardNav
          logo={
            <img
              src="./cyk-logo.png"
              alt="CYK Hospitalities"
              style={{
                height: '32px',
                maxHeight: '32px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                display: 'block'
              }}
            />
          }
          logoAlt="CYK Hospitalities"
          logoHref="#"
          items={items}
          cta={{
            label: 'Start your project ↗',
            onClick: () => onOpenEnquiry()
          }}
          theme="dark"
          surface="glass"
          accentColor="#847445"
          cardEffect="rise"
          openOn="click"
          maxWidth={860}
          onLinkClick={handleLinkClick}
        />
      </div>
    </header>
  );
};
