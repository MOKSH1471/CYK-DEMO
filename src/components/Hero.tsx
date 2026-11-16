import React, { useEffect, useRef, useState } from 'react';
import { StrokeText } from './StrokeText';

interface HeroProps {
  onStartJourney: () => void;
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onOpenEnquiry
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Background layers for each full-screen beat
  const bgHeroRef = useRef<HTMLDivElement>(null);
  const bgConceptRef = useRef<HTMLDivElement>(null);
  const bgLocationRef = useRef<HTMLDivElement>(null);
  const bgMenuRef = useRef<HTMLDivElement>(null);

  // Content layers for each full-screen beat
  const contentHeroRef = useRef<HTMLDivElement>(null);
  const contentConceptRef = useRef<HTMLDivElement>(null);
  const contentLocationRef = useRef<HTMLDivElement>(null);
  const contentMenuRef = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  const metricsRef = useRef<{
    containerTop: number;
    scrollDistance: number;
    width: number;
    height: number;
  }>({
    containerTop: 0,
    scrollDistance: 1,
    width: 1440,
    height: 900
  });

  // Check reduced motion & window resize
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);

    const onMqChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mq.addEventListener('change', onMqChange);

    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Compute container dimensions
  useEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current || !stageRef.current) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;
      const scrollDistance = Math.max(1, containerRef.current.offsetHeight - h);

      metricsRef.current = {
        containerTop,
        scrollDistance,
        width: w,
        height: h
      };
    };

    updateMetrics();

    let resizeTimer: number;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateMetrics, 100);
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // FULL-SCREEN SCROLL TRANSITIONS: Cross-fades & Ken Burns Zoom (60fps)
  // Direct DOM manipulation via requestAnimationFrame — no React re-renders on scroll
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;

    let rafId: number | null = null;
    let lastStep = 0;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const { containerTop, scrollDistance } = metricsRef.current;
        const scrollY = window.scrollY;
        const progress = Math.min(1, Math.max(0, (scrollY - containerTop) / scrollDistance));

        // =====================================================================
        // BEAT 0: RESTING HERO (0.00 -> 0.20)
        // =====================================================================
        if (contentHeroRef.current && bgHeroRef.current) {
          if (progress < 0.20) {
            const rel = progress / 0.20;
            bgHeroRef.current.style.opacity = `${1 - rel * 0.7}`;
            bgHeroRef.current.style.transform = `scale(${1 + rel * 0.05})`;

            contentHeroRef.current.style.opacity = `${1 - rel * 1.3}`;
            contentHeroRef.current.style.transform = `translate3d(0, ${-rel * 50}px, 0)`;
            contentHeroRef.current.style.pointerEvents = rel > 0.5 ? 'none' : 'auto';
          } else {
            bgHeroRef.current.style.opacity = '0';
            contentHeroRef.current.style.opacity = '0';
            contentHeroRef.current.style.pointerEvents = 'none';
          }
        }

        // =====================================================================
        // BEAT 1: FULL-SCREEN "01 / CONCEPT" (0.20 -> 0.45)
        // =====================================================================
        if (bgConceptRef.current && contentConceptRef.current) {
          if (progress >= 0.18 && progress < 0.45) {
            const rel = (progress - 0.18) / 0.27; // 0 to 1
            let opacity = 0;
            if (rel < 0.25) opacity = rel / 0.25;
            else if (rel <= 0.75) opacity = 1;
            else opacity = (1 - rel) / 0.25;

            const scale = 1.04 - rel * 0.04;
            bgConceptRef.current.style.opacity = `${opacity}`;
            bgConceptRef.current.style.transform = `scale(${scale})`;

            const textY = (1 - Math.min(1, rel / 0.3)) * 30;
            contentConceptRef.current.style.opacity = `${opacity}`;
            contentConceptRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
          } else {
            bgConceptRef.current.style.opacity = '0';
            contentConceptRef.current.style.opacity = '0';
          }
        }

        // =====================================================================
        // BEAT 2: FULL-SCREEN "02 / LOCATION" (0.45 -> 0.70)
        // =====================================================================
        if (bgLocationRef.current && contentLocationRef.current) {
          if (progress >= 0.43 && progress < 0.70) {
            const rel = (progress - 0.43) / 0.27; // 0 to 1
            let opacity = 0;
            if (rel < 0.25) opacity = rel / 0.25;
            else if (rel <= 0.75) opacity = 1;
            else opacity = (1 - rel) / 0.25;

            const scale = 1.04 - rel * 0.04;
            bgLocationRef.current.style.opacity = `${opacity}`;
            bgLocationRef.current.style.transform = `scale(${scale})`;

            const textY = (1 - Math.min(1, rel / 0.3)) * 30;
            contentLocationRef.current.style.opacity = `${opacity}`;
            contentLocationRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
          } else {
            bgLocationRef.current.style.opacity = '0';
            contentLocationRef.current.style.opacity = '0';
          }
        }

        // =====================================================================
        // BEAT 3: FULL-SCREEN "03 / MENU" (0.70 -> 0.96)
        // =====================================================================
        if (bgMenuRef.current && contentMenuRef.current) {
          if (progress >= 0.68 && progress <= 1.0) {
            const rel = (progress - 0.68) / 0.28; // 0 to 1
            let opacity = 0;
            if (rel < 0.25) opacity = rel / 0.25;
            else if (rel <= 0.75) opacity = 1;
            else opacity = Math.max(0, (1 - rel) / 0.25);

            const scale = 1.04 - rel * 0.04;
            bgMenuRef.current.style.opacity = `${opacity}`;
            bgMenuRef.current.style.transform = `scale(${scale})`;

            const textY = (1 - Math.min(1, rel / 0.3)) * 30;
            contentMenuRef.current.style.opacity = `${opacity}`;
            contentMenuRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
          } else {
            bgMenuRef.current.style.opacity = '0';
            contentMenuRef.current.style.opacity = '0';
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion]);

  // Responsive font size calculation for StrokeText based on screen width
  const strokeFontSize = Math.max(30, Math.min(62, Math.round(windowWidth * 0.045)));

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isReducedMotion ? 'min-h-screen' : 'h-[340vh]'} bg-[#121316] text-[#FAF8F5]`}
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div
        ref={stageRef}
        className={`${isReducedMotion ? 'relative py-28' : 'sticky top-0 h-screen'} w-full overflow-hidden flex flex-col justify-center`}
      >

        {/* =====================================================================
            1. FULL-SCREEN BACKGROUND LAYERS (Cover 100vw x 100vh)
        ====================================================================== */}

        {/* BG 0: Resting Hero Official CYK Banner */}
        <div
          ref={bgHeroRef}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out will-change-[transform,opacity]"
        >
          <img
            src="./images/hero/cyk-hero-banner.jpg"
            alt="CYK Hospitalities Official Banner"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Deep cinematic scrim: pure dark contrast, NO white fog */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/80 pointer-events-none" />
        </div>

        {/* BG 1: Concept Full-Screen Photo */}
        <div
          ref={bgConceptRef}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          <img
            src="./images/hero/hero-concept-4k.webp"
            alt="Artisanal culinary concept"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/75 pointer-events-none" />
        </div>

        {/* BG 2: Location Full-Screen Photo */}
        <div
          ref={bgLocationRef}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          <img
            src="./images/hero/hero-location-4k.webp"
            alt="Turnkey hospitality dining space architecture"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/75 pointer-events-none" />
        </div>

        {/* BG 3: Menu & Kitchen Full-Screen Photo */}
        <div
          ref={bgMenuRef}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ease-out will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          <img
            src="./images/hero/hero-menu-4k.webp"
            alt="Chef plating at pass with precision"
            className="w-full h-full object-cover object-[center_35%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/75 pointer-events-none" />
        </div>


        {/* =====================================================================
            2. FULL-SCREEN SCENE TYPOGRAPHIC OVERLAYS
        ====================================================================== */}

        {/* OVERLAY 1: CONCEPT */}
        <div
          ref={contentConceptRef}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 sm:p-14 lg:p-20 max-w-7xl mx-auto w-full transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              Concept.
            </h2>

            <p className="text-base sm:text-xl lg:text-2xl text-[#FAF8F5]/90 font-light leading-relaxed max-w-2xl drop-shadow">
              Culinary vision, financial feasibility, customer profiling & brand identity built from complete zero.
            </p>
          </div>
        </div>

        {/* OVERLAY 2: LOCATION */}
        <div
          ref={contentLocationRef}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 sm:p-14 lg:p-20 max-w-7xl mx-auto w-full transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              Location.
            </h2>

            <p className="text-base sm:text-xl lg:text-2xl text-[#FAF8F5]/90 font-light leading-relaxed max-w-2xl drop-shadow">
              Prime real estate sourcing across Delhi NCR, master leasing negotiations & turnkey interior execution.
            </p>
          </div>
        </div>

        {/* OVERLAY 3: MENU */}
        <div
          ref={contentMenuRef}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-8 sm:p-14 lg:p-20 max-w-7xl mx-auto w-full transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              Menu & Kitchen.
            </h2>

            <p className="text-base sm:text-xl lg:text-2xl text-[#FAF8F5]/90 font-light leading-relaxed max-w-2xl drop-shadow">
              Chef-driven recipe R&D, commercial kitchen equipment layouts, recipe costing & kitchen team SOPs.
            </p>
          </div>
        </div>


        {/* =====================================================================
            3. BEAT 0: RESTING HERO CONTENT (Frame 1, On-Screen at Load)
            Features <StrokeText /> from React Bits with animated outline draw & liquid fill!
        ====================================================================== */}
        <div
          ref={contentHeroRef}
          className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center transition-all duration-300 px-4 pt-16 sm:pt-20"
        >

          {/* StrokeText Animated Editorial Headline (React Bits component) */}
          <div data-testid="hero-headline" className="w-full flex flex-col items-center gap-0.5 sm:gap-1.5">
            <StrokeText
              text="We build food businesses"
              strokeColor="#C5A869"
              fillColor="#FAF8F5"
              strokeWidth={1.4}
              drawDuration={1.0}
              fillDelay={0.1}
              stagger={0.025}
              fontSize={strokeFontSize}
              fontWeight={800}
              letterSpacing={-1.5}
              fillMode="wipe"
              wipeFrom="left"
              trigger="mount"
              hoverRedraw={true}
              shadow={false}
              className="w-full"
            />
            <StrokeText
              text="from scratch, and stay"
              strokeColor="#C5A869"
              fillColor="#FAF8F5"
              strokeWidth={1.4}
              drawDuration={1.0}
              fillDelay={0.18}
              stagger={0.025}
              fontSize={strokeFontSize}
              fontWeight={800}
              letterSpacing={-1.5}
              fillMode="wipe"
              wipeFrom="left"
              trigger="mount"
              hoverRedraw={true}
              shadow={false}
              className="w-full"
            />
            <StrokeText
              text="until they scale."
              strokeColor="#C5A869"
              fillColor="#FAF8F5"
              strokeWidth={1.4}
              drawDuration={1.0}
              fillDelay={0.25}
              stagger={0.025}
              fontSize={strokeFontSize}
              fontWeight={800}
              letterSpacing={-1.5}
              fillMode="wipe"
              wipeFrom="left"
              trigger="mount"
              hoverRedraw={true}
              shadow={false}
              className="w-full"
            />
          </div>

          {/* Subtext: Verified client scope */}
          <p
            data-testid="hero-subtext"
            className="mt-6 max-w-2xl text-xs sm:text-sm md:text-base text-[#FAF8F5]/90 leading-relaxed font-normal"
          >
            From concept, location, menu, kitchen, interiors, hiring, marketing, and franchising.
          </p>

          {/* BOTH BUTTONS: Fully visible inside first viewport without scrolling */}
          <div
            data-testid="hero-buttons"
            className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {/* Primary: Solid Official Olive-Gold */}
            <button
              data-testid="primary-hero-button"
              onClick={onStartJourney}
              className="px-8 py-3.5 rounded-full bg-[#847445] hover:bg-[#6E6038] text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer active:scale-[0.98]"
            >
              Start your journey
            </button>

            {/* Secondary: Clean text link with underline */}
            <button
              data-testid="secondary-hero-button"
              onClick={onOpenEnquiry}
              className="text-xs sm:text-sm font-medium text-white hover:text-[#C5A869] underline underline-offset-4 decoration-1 hover:decoration-[#C5A869] transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0"
            >
              Talk to us
            </button>
          </div>

          {/* Clean Thin Vertical Scroll Cue Line (Pulse animation, no text) */}
          {!isReducedMotion && (
            <div className="mt-8 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-[1px] h-8 bg-[#C5A869]/70 animate-pulse shadow-sm" />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
