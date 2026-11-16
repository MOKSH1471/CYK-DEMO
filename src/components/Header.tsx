import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenEnquiry: (prefilledStage?: number) => void;
  onOpenServices: (serviceSlug?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry, onOpenServices }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md py-3.5 border-b border-[#E8E4DA] shadow-xs'
          : 'bg-transparent py-5 border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Official CYK Hospitalities Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src="./cyk-logo.png"
              alt="CYK Hospitalities Pvt. Ltd."
              className={`h-9 sm:h-11 w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] ${
                isScrolled
                  ? ''
                  : 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav
            className={`hidden lg:flex items-center gap-7 text-sm font-medium transition-colors duration-300 ${
              isScrolled ? 'text-[#121316]' : 'text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
            }`}
          >
            <a
              href="#journey"
              className={`transition-colors ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Journey
            </a>

            <button
              onClick={() => onOpenServices()}
              className={`transition-colors cursor-pointer ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Services
            </button>

            <a
              href="#projects"
              className={`transition-colors ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Work
            </a>

            <a
              href="#testimonials"
              className={`transition-colors ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Voices
            </a>

            <a
              href="#horeca-talks"
              className={`transition-colors ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Insights
            </a>

            <a
              href="#contact"
              className={`transition-colors ${
                isScrolled ? 'hover:text-[#847445]' : 'hover:text-[#C5A869]'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Primary Action Button in Official Olive-Gold */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => onOpenEnquiry()}
              className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-full bg-[#847445] hover:bg-[#6E6038] text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Start your project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border transition-colors lg:hidden cursor-pointer ${
              isScrolled
                ? 'bg-white border-[#E8E4DA] text-[#121316]'
                : 'bg-black/30 backdrop-blur-md border-white/20 text-white'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E4DA] px-4 pt-3 pb-6 space-y-3 animate-fadeIn text-[#121316] shadow-lg">
          <a
            href="#journey"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            The Growth Journey
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenServices();
            }}
            className="block w-full text-left py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            All Services
          </button>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            Verified Client Work
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            Founder Voices
          </a>
          <a
            href="#horeca-talks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            HoReCa Talks
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#121316] hover:text-[#847445]"
          >
            Contact & HQs
          </a>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white font-bold text-sm shadow-sm"
            >
              Start your project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
