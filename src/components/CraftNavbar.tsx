import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { subscribeFlightState, scrollToFlightStop, FLIGHT_STOPS_META, FlightState } from '../utils/flightState';
import { onLenisReady, getLenis } from '../utils/lenis';

export interface CraftNavLink {
  label: string;
  href?: string;
  badge?: string;
  badgeTilt?: number;
}

export interface CraftNavGroup {
  label: string;
  description: string;
  links: CraftNavLink[];
}

interface CraftNavbarProps {
  isIntroComplete: boolean;
  onOpenEnquiry: (prefilledStage?: number) => void;
  onOpenServices: (serviceSlug?: string) => void;
}

const NAV_GROUPS: CraftNavGroup[] = [
  {
    label: 'Growth Journey',
    description: 'The 8-stage end-to-end restaurant consulting pipeline.',
    links: [
      { label: 'Stage 01: Concept & Feasibility', href: '#journey', badge: '01', badgeTilt: -1.5 },
      { label: 'Stage 03: Kitchen Planning & Setup', href: '#journey', badge: '03', badgeTilt: 1.2 },
      { label: 'Stage 05: Menu Engineering & R&D', href: '#journey', badge: '05', badgeTilt: -2.0 },
      { label: 'Stage 08: National Expansion', href: '#journey', badge: '08', badgeTilt: 1.8 }
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

export const CraftNavbar: React.FC<CraftNavbarProps> = ({
  isIntroComplete,
  onOpenEnquiry,
  onOpenServices
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [flightState, setFlightState] = useState<FlightState>({
    pFlight: 0,
    isInFlight: false,
    activeStopIndex: 0,
    activeStopNumber: '01',
    activeStopTitle: 'The Idea'
  });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const navContainerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subscribe to live flight state
  useEffect(() => {
    return subscribeFlightState((state) => {
      setFlightState(state);
    });
  }, []);

  // Smooth Menu Animations with GSAP (Hardware accelerated 3D flap fold/unfold)
  const closeMenu = useCallback(() => {
    if (!isOpen) return;
    setIsOpen(false);
    menuToggleRef.current?.focus();

    if (isReducedMotion) {
      setIsMenuMounted(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuMounted(false);
      }
    });

    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.18, ease: 'power2.in' }, 0);
    }
    if (panelRef.current) {
      tl.to(
        panelRef.current,
        {
          scaleY: 0.94,
          y: -10,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in',
          force3D: true
        },
        0
      );
    }
    if (mobileModalRef.current) {
      tl.to(
        mobileModalRef.current,
        {
          y: '100%',
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          force3D: true
        },
        0
      );
    }
  }, [isOpen, isReducedMotion]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setIsMenuMounted(true);
    }
  }, [isOpen, closeMenu]);

  // Entrance animation when menu mounts - 100% GPU compositor driven
  useEffect(() => {
    if (isOpen && isMenuMounted && !isReducedMotion) {
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' });
      }
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          {
            scaleY: 0.92,
            y: -12,
            opacity: 0,
            transformOrigin: 'top center',
            force3D: true
          },
          {
            scaleY: 1,
            y: 0,
            opacity: 1,
            duration: 0.26,
            ease: 'power3.out',
            force3D: true
          }
        );
      }
      if (mobileModalRef.current) {
        gsap.fromTo(
          mobileModalRef.current,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.26, ease: 'power3.out', force3D: true }
        );
      }
    }
  }, [isOpen, isMenuMounted, isReducedMotion]);

  // Direction-aware scroll detection via Lenis & window scroll
  useEffect(() => {
    const handleScroll = (currentY: number) => {
      const delta = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      // Compact after 80px scroll
      setIsCompact(currentY > 80);

      // Never hide if open
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      // Hide on scroll down, show on scroll up
      if (delta > 6 && currentY > 120) {
        setIsVisible(false);
      } else if (delta < -5 || currentY < 80) {
        setIsVisible(true);
      }
    };

    const cleanupLenis = onLenisReady((lenis) => {
      lenis.on('scroll', (e: { scroll: number }) => {
        handleScroll(e.scroll);
      });
    });

    const fallbackScroll = () => {
      handleScroll(window.scrollY || document.documentElement.scrollTop);
    };
    window.addEventListener('scroll', fallbackScroll, { passive: true });

    return () => {
      cleanupLenis();
      window.removeEventListener('scroll', fallbackScroll);
    };
  }, [isOpen]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  const handleLinkClick = (href?: string, stageBadge?: string) => {
    closeMenu();

    if (!href) return;

    if (href === '#services') {
      onOpenServices();
      return;
    }

    if (href === '#journey' && stageBadge) {
      const stageIdx = parseInt(stageBadge, 10) - 1;
      if (!isNaN(stageIdx)) {
        scrollToFlightStop(stageIdx);
        return;
      }
    }

    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(el, { duration: 1.1 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Visibility styles
  const isNavShown = isIntroComplete && isVisible;

  return (
    <>
      {/* =======================================================================
          SHARED SVG GRAIN & EDGE FILTERS (Hardware cached, 0 CPU lag)
      ======================================================================== */}
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          {/* Subtle paper fiber speckle */}
          <filter id="craft-paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.52   0 0 0 0 0.45   0 0 0 0 0.32  0 0 0 0.05 0" />
            <feComposite in2="SourceGraphic" in="glitch" operator="in" />
          </filter>

          {/* Hand-drawn underline path template */}
          <path id="hand-underline" d="M 0 5 Q 60 1, 120 4 Q 180 7, 240 3" />
        </defs>
      </svg>

      {/* =======================================================================
          PAGE BACKDROP (Appears behind folder panel when open)
      ======================================================================== */}
      {isMenuMounted && (
        <div
          ref={backdropRef}
          role="presentation"
          onClick={closeMenu}
          className="fixed inset-0 z-[95] bg-[#14100C]/35 will-change-[opacity]"
          aria-hidden="true"
        />
      )}

      {/* =======================================================================
          MAIN NAVBAR HEADER (Paper Bar)
      ======================================================================== */}
      <header
        ref={navContainerRef}
        role="navigation"
        aria-label="Main Navigation"
        className="fixed top-4 sm:top-5 left-0 right-0 z-[100] px-3 sm:px-6 pointer-events-none flex justify-center"
        style={{
          transform: isNavShown ? 'translateY(0)' : 'translateY(-130%)',
          transition: isReducedMotion
            ? 'opacity 0.2s ease'
            : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease',
          opacity: isNavShown ? 1 : 0
        }}
      >
        <div className="relative w-full max-w-4xl pointer-events-auto">

          {/* -----------------------------------------------------------------
              WASHI TAPE 1: TOP LEFT (-8deg Kraft & Olive Stripe)
          ------------------------------------------------------------------ */}
          <div
            aria-hidden="true"
            className="absolute -top-3 left-6 sm:left-10 z-20 w-13 sm:w-16 h-5 pointer-events-none select-none shadow-xs opacity-90 transition-transform duration-300"
            style={{
              transform: 'rotate(-8deg)',
              background: 'repeating-linear-gradient(45deg, rgba(200, 162, 122, 0.8), rgba(200, 162, 122, 0.8) 4px, rgba(132, 116, 69, 0.5) 4px, rgba(132, 116, 69, 0.5) 8px)',
              clipPath: 'polygon(0% 20%, 5% 0%, 10% 20%, 15% 0%, 20% 20%, 100% 0%, 95% 20%, 100% 40%, 95% 60%, 100% 80%, 95% 100%, 0% 100%, 5% 80%, 0% 60%, 5% 40%)'
            }}
          />

          {/* -----------------------------------------------------------------
              WASHI TAPE 2: TOP RIGHT (+7deg Olive & Pale Gold Stripe)
          ------------------------------------------------------------------ */}
          <div
            aria-hidden="true"
            className="absolute -top-3 right-6 sm:right-10 z-20 w-12 sm:w-15 h-5 pointer-events-none select-none shadow-xs opacity-90 transition-transform duration-300"
            style={{
              transform: 'rotate(7deg)',
              background: 'repeating-linear-gradient(-45deg, rgba(132, 116, 69, 0.75), rgba(132, 116, 69, 0.75) 4px, rgba(228, 215, 182, 0.6) 4px, rgba(228, 215, 182, 0.6) 8px)',
              clipPath: 'polygon(0% 0%, 95% 0%, 100% 20%, 95% 40%, 100% 60%, 95% 80%, 100% 100%, 5% 100%, 0% 80%, 5% 60%, 0% 40%, 5% 20%)'
            }}
          />

          {/* -----------------------------------------------------------------
              CLOSED PAPER STRIP CONTAINER
          ------------------------------------------------------------------ */}
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl select-none"
            style={{
              transform: isReducedMotion ? 'none' : 'rotate(-0.8deg)',
              transformOrigin: 'center center',
              background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF8F5 55%, #F4EFE6 100%)',
              boxShadow: '0 12px 28px -6px rgba(60, 45, 20, 0.16), 0 4px 10px -2px rgba(45, 25, 10, 0.08), inset 0 0 0 1px rgba(132, 116, 69, 0.12)'
            }}
          >
            {/* Hand-Drawn / Stitched Dashed Inner Border */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              aria-hidden="true"
            >
              <rect
                x="6"
                y="6"
                width="calc(100% - 12px)"
                height="calc(100% - 12px)"
                rx="20"
                fill="none"
                stroke="#C5A869"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.75"
              />
            </svg>

            {/* BAR INNER CONTENT */}
            <div
              className={`relative z-20 flex items-center justify-between px-3 sm:px-5 transition-all duration-200 ${
                isCompact ? 'py-1.5 sm:py-2' : 'py-2 sm:py-2.5'
              }`}
            >
              {/* LEFT: KRAFT EYELET MENU BUTTON */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  ref={menuToggleRef}
                  onClick={toggleMenu}
                  aria-expanded={isOpen}
                  aria-controls="craft-nav-folder-panel"
                  aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
                  className="group relative flex items-center gap-2 sm:gap-2.5 p-1 pr-3 sm:pr-4 rounded-xl hover:bg-[#847445]/8 focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none transition-colors cursor-pointer"
                >
                  {/* Round Kraft Tab with Brass Eyelet */}
                  <div className="relative w-8 h-8 rounded-full bg-[#C8A27A] border border-[#A87E54] shadow-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
                    {/* Metal Brass Eyelet Rings */}
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] border border-[#847445] flex items-center justify-center shadow-inner">
                      <div className="w-2 h-2 rounded-full bg-[#1C120A]" />
                    </div>

                    {/* Wound String with hanging end */}
                    <svg
                      viewBox="0 0 32 32"
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      aria-hidden="true"
                    >
                      <path
                        d={
                          isOpen
                            ? 'M 16 16 C 22 18, 26 26, 22 34'
                            : 'M 16 16 C 22 14, 24 20, 18 22 C 14 24, 18 28, 20 30'
                        }
                        fill="none"
                        stroke="#1C120A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>

                  {/* Menu / Close Text label in display font */}
                  <div className="relative h-5 overflow-hidden text-left flex flex-col justify-center">
                    <span
                      className={`font-sans font-bold text-xs sm:text-sm tracking-tight text-[#14181F] transition-transform duration-300 ${
                        isOpen ? '-translate-y-5 opacity-0' : 'translate-y-0 opacity-100'
                      }`}
                    >
                      Menu
                    </span>
                    <span
                      className={`font-sans font-bold text-xs sm:text-sm tracking-tight text-[#847445] absolute inset-0 flex items-center transition-transform duration-300 ${
                        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                      }`}
                    >
                      Close
                    </span>
                  </div>
                </button>
              </div>

              {/* CENTER: LOGO STICKER OR LIVE FLIGHT STAGE TRACKER */}
              <div className="flex items-center justify-center">
                {/* 1. LIVE FLIGHT TRACKER: Visible only during Flight Journey on Desktop */}
                {flightState.isInFlight && !isOpen ? (
                  <div className="hidden md:flex flex-col items-center justify-center px-4 py-0.5 animate-fadeIn">
                    {/* Active Stage Label sliding vertically */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#847445] uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#847445] animate-pulse" />
                      <span className="transition-all duration-200">
                        STAGE {flightState.activeStopNumber}: {flightState.activeStopTitle}
                      </span>
                    </div>

                    {/* Stitched dashed thread with 8 knots & riding paper plane */}
                    <div className="relative w-64 h-6 flex items-center justify-center select-none">
                      <svg
                        viewBox="0 0 256 24"
                        className="w-64 h-6 overflow-visible"
                        aria-hidden="true"
                      >
                        {/* Pale gold dashed base thread */}
                        <line
                          x1="12"
                          y1="12"
                          x2="244"
                          y2="12"
                          stroke="#C5A869"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.75"
                        />

                        {/* Active Olive Gold Fill Thread: 100% mathematically locked to the plane */}
                        <line
                          x1="12"
                          y1="12"
                          x2={12 + Math.max(0, Math.min(1, flightState.pFlight)) * 232}
                          y2="12"
                          stroke="#847445"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />

                        {/* 8 Knots / Stop links */}
                        {FLIGHT_STOPS_META.map((stop, idx) => {
                          const knotX = 12 + (idx / 7) * 232;
                          const isActive = idx === flightState.activeStopIndex;
                          const isPast = idx < flightState.activeStopIndex;

                          return (
                            <g
                              key={stop.id}
                              className="cursor-pointer"
                              onClick={() => scrollToFlightStop(idx)}
                            >
                              <title>{`Jump to Stage ${stop.number}: ${stop.title}`}</title>
                              {/* Invisible larger hit target for smooth clicking */}
                              <circle cx={knotX} cy="12" r="9" fill="transparent" />
                              {/* Outer ring on active knot */}
                              {isActive && (
                                <circle
                                  cx={knotX}
                                  cy="12"
                                  r="5.5"
                                  fill="none"
                                  stroke="#847445"
                                  strokeWidth="1.5"
                                  opacity="0.45"
                                />
                              )}
                              {/* Knot dot */}
                              <circle
                                cx={knotX}
                                cy="12"
                                r={isActive ? 3.5 : isPast ? 2.5 : 2}
                                fill={isActive || isPast ? '#847445' : '#C5A869'}
                              />
                            </g>
                          );
                        })}

                        {/* Micro Paper Plane Glyph: strictly riding the exact head of the fill line */}
                        <g
                          transform={`translate(${
                            12 + Math.max(0, Math.min(1, flightState.pFlight)) * 232
                          }, 12)`}
                          className="pointer-events-none"
                        >
                          {/* Paper plane body pointing forward (+X) along the thread */}
                          <path
                            d="M 7 0 L -6 -5 L -2.5 0 L -6 5 Z"
                            fill="#847445"
                          />
                          {/* Paper plane center fold spine */}
                          <path
                            d="M -2.5 0 L 7 0"
                            stroke="#FFFDF8"
                            strokeWidth="0.9"
                            strokeLinecap="round"
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                ) : (
                  /* 2. LOGO STICKER: Hand-crafted sticker badge */
                  <a
                    href="#"
                    aria-label="CYK Hospitalities Home"
                    className="relative inline-flex items-center justify-center px-3.5 py-1 rounded-xl bg-[#FFFDF8] border-[2px] border-white ring-1 ring-[#C8A27A]/50 shadow-xs hover:shadow-sm hover:scale-[1.02] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
                    style={{
                      height: isCompact ? '35px' : '39px',
                      boxShadow: '0 2px 6px rgba(60, 45, 20, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    <img
                      src="./cyk-logo.png"
                      alt="CYK Hospitalities"
                      className="h-6 sm:h-7 w-auto object-contain transition-all duration-200"
                      style={{
                        // Recolor white PNG to authentic rich olive-gold #847445 for perfect paper contrast
                        filter:
                          'brightness(0) saturate(100%) invert(48%) sepia(24%) saturate(740%) hue-rotate(9deg) brightness(90%) contrast(92%)'
                      }}
                    />
                  </a>
                )}
              </div>

              {/* RIGHT: CTA STICKER BUTTON */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEnquiry()}
                  className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-[#FAF8F5] font-bold text-xs sm:text-sm border-[2.5px] border-[#FFFDF8] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 hover:-translate-y-0.5 hover:rotate-[1.5deg] focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
                >
                  {/* Dashed stitched inner line */}
                  <div className="absolute inset-1 rounded-lg border border-dashed border-[#FAF8F5]/60 pointer-events-none" />
                  <span className="relative z-10 font-sans tracking-tight">Start your project</span>
                  <span className="relative z-10 text-xs font-mono group-hover:translate-x-0.5 transition-transform">
                    ↗
                  </span>
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                OPEN MEGA-MENU: 3 FILE-FOLDER TABS
            ---------------------------------------------------------------- */}
            {isMenuMounted && (
              <div
                id="craft-nav-folder-panel"
                ref={panelRef}
                className="relative w-full border-t border-[#847445]/20 bg-[#FAF8F5] rounded-b-2xl sm:rounded-b-3xl overflow-hidden shadow-lg will-change-[transform,opacity]"
                style={{
                  transformOrigin: 'top center'
                }}
              >
                {/* Stitched dashed inner border on drop panel */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  aria-hidden="true"
                >
                  <rect
                    x="6"
                    y="4"
                    width="calc(100% - 12px)"
                    height="calc(100% - 10px)"
                    rx="16"
                    fill="none"
                    stroke="#C5A869"
                    strokeWidth="1.2"
                    strokeDasharray="6 4"
                    opacity="0.6"
                  />
                </svg>

                {/* 3 MANILA FOLDER TAB COLUMNS (Desktop & Tablet) */}
                <div className="relative z-20 p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
                  {NAV_GROUPS.map((group, colIdx) => {
                    const isHovered = hoveredColumn === colIdx;

                    return (
                      <div
                        key={group.label}
                        onMouseEnter={() => setHoveredColumn(colIdx)}
                        onMouseLeave={() => setHoveredColumn(null)}
                        className={`folder-tab-col relative rounded-2xl p-4 sm:p-5 transition-[transform,background-color,box-shadow] duration-150 border border-[#E8E2D5] ${
                          isHovered
                            ? 'bg-[#F4EFE6] -translate-y-1 shadow-sm border-[#847445]/30'
                            : 'bg-[#FFFDF8]/90 shadow-2xs'
                        }`}
                      >
                        {/* Folder Header Tab Shoulder */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#847445]/20">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono tracking-widest text-[#847445] font-bold uppercase">
                              TAB 0{colIdx + 1}
                            </span>
                            <h3 className="font-display font-extrabold text-base sm:text-lg text-[#14181F] tracking-tight">
                              {group.label}
                            </h3>
                          </div>
                          <span className="text-xs text-[#847445]/60 font-mono">📁</span>
                        </div>

                        {/* Column Description */}
                        <p className="text-xs text-[#574C43] leading-relaxed mb-4 min-h-[32px]">
                          {group.description}
                        </p>

                        {/* Links List */}
                        <ul className="space-y-2.5">
                          {group.links.map((link) => (
                            <li key={link.label}>
                              <button
                                onClick={() => handleLinkClick(link.href, link.badge)}
                                className="group/row relative w-full flex items-center justify-between text-left py-1.5 px-2 rounded-lg hover:bg-white/80 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
                              >
                                <div className="flex items-center gap-2.5">
                                  {/* Sticky Numbered Chip for Stages (01, 03, 05, 08) */}
                                  {link.badge ? (
                                    <span
                                      className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#847445] text-white font-mono font-bold text-[11px] shadow-2xs border border-white"
                                      style={{
                                        transform: `rotate(${link.badgeTilt || 0}deg)`
                                      }}
                                    >
                                      {link.badge}
                                    </span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#847445]/50 group-hover/row:bg-[#847445] transition-colors" />
                                  )}

                                  {/* Link Label */}
                                  <span className="font-sans font-semibold text-xs sm:text-sm text-[#14181F] group-hover/row:text-[#847445] group-hover/row:translate-x-1 transition-all duration-200">
                                    {link.label}
                                  </span>
                                </div>

                                {/* Doodle Arrow & Sliding Mini Plane on Hover */}
                                <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 -translate-x-2 group-hover/row:translate-x-0 transition-all duration-200 text-[#847445]">
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="w-3.5 h-3.5 fill-[#847445]"
                                    aria-hidden="true"
                                  >
                                    <polygon points="2,12 22,2 14,22 11,13" />
                                  </svg>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM FOLDER RIM WITH CLOSE HINT & QUICK ACTIONS */}
                <div className="relative z-20 px-6 py-3 bg-[#F4EFE6]/70 border-t border-[#847445]/15 flex items-center justify-between text-xs text-[#574C43]">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[#847445]">
                    CYK · Craft Consulting Dossier · 2026
                  </span>
                  <button
                    onClick={closeMenu}
                    className="font-sans font-semibold hover:text-[#847445] underline decoration-dashed transition-colors cursor-pointer"
                  >
                    Click to close or press Esc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =======================================================================
          MOBILE FULL-SCREEN FOLDER SHEET (<768px when Open)
      ======================================================================== */}
      {isMenuMounted && (
        <div
          ref={mobileModalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="md:hidden fixed inset-0 z-[110] bg-[#FAF8F5] p-5 flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Stitched Border & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-[#847445]/20">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#C8A27A] border border-[#A87E54] flex items-center justify-center text-xs">
                ✈
              </span>
              <span className="font-display font-extrabold text-base text-[#14181F]">
                CYK Navigation
              </span>
            </div>

            <button
              onClick={closeMenu}
              className="px-3.5 py-1.5 rounded-xl bg-[#847445] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              Close ✕
            </button>
          </div>

          {/* Stacked Links List */}
          <div className="py-6 space-y-6">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={group.label} className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#847445] font-bold uppercase">
                  0{gIdx + 1} {group.label}
                </span>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href, link.badge)}
                        className="w-full text-left font-display font-bold text-lg sm:text-xl text-[#14181F] active:text-[#847445] py-1 flex items-center justify-between"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="text-xs font-mono font-bold bg-[#847445] text-white px-2 py-0.5 rounded-md">
                            {link.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Sticky Mobile CTA */}
          <div className="pt-4 border-t border-[#847445]/20">
            <button
              onClick={() => {
                closeMenu();
                onOpenEnquiry();
              }}
              className="w-full py-3.5 rounded-xl bg-[#847445] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Start your project</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      )}

      {/* GSAP / CSS Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 200ms ease-out forwards;
        }
      `}</style>
    </>
  );
};
