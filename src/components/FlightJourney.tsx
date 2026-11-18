import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { JOURNEY_STAGES } from '../data/mockData';
import { 
  Lightbulb, Calculator, MapPin, Utensils, Palette, ChefHat, 
  Megaphone, Store, ArrowRight, Quote 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STAMP_ICONS: Record<string, React.ElementType> = {
  Lightbulb,
  Calculator,
  MapPin,
  Utensils,
  Palette,
  ChefHat,
  Megaphone,
  Store
};

// =============================================================================
// CENTRAL FLIGHT CONFIGURATION OBJECT (Tune speeds, scales & easing here)
// =============================================================================
export const FLIGHT_CONFIG = {
  // Total scroll distance per stop in viewport heights
  scrollVhPerStop: 110,
  // GSAP scrub lag (seconds of smooth inertia)
  scrubLag: 0.8,
  // Z-axis camera perspective
  perspective: 1200,
  // Parallax layer speeds (relative to scroll velocity)
  layerSpeeds: {
    farClouds: 0.25,
    midClouds: 0.55,
    nearClouds: 1.6, // Fast sweep past viewport edges
    numeral: 0.35,
    content: 1.0,
    plane: 1.0
  },
  // Scale animations
  scaleValues: {
    nearCloudEnd: 2.2, // Clouds scale up as camera flies through them
    cardStart: 0.92,   // Case study card scales up to 1.0 upon arrival
    numeralStart: 0.85,
    numeralEnd: 1.15
  },
  // Mobile performance thresholds
  mobileMaxNearClouds: 1,
  desktopMaxNearClouds: 3
};

interface FlightJourneyProps {
  onConsultStage: (stageIndex: number) => void;
  onOpenServiceModal: (stageIndex: number) => void;
  stopCount?: number;
}

export const FlightJourney: React.FC<FlightJourneyProps> = ({
  onConsultStage,
  onOpenServiceModal,
  stopCount = 8 // ALL 8 STOPS (01 through 08)
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);
  const trailMaskPathRef = useRef<SVGPathElement>(null);
  const forkGroupRef = useRef<SVGGElement>(null);

  // Parallax Layer Refs
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const nearLayerRef = useRef<HTMLDivElement>(null);
  const cameraStageRef = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Active stages (Stops 01 through 08)
  const activeStages = useMemo(() => {
    return JOURNEY_STAGES.slice(0, stopCount);
  }, [stopCount]);

  // Check reduced motion & mobile media query
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mqMotion.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mqMotion.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      mqMotion.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // LENIS SMOOTH SCROLL INITIALIZATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [isReducedMotion]);

  // ---------------------------------------------------------------------------
  // GSAP SCROLLTRIGGER FLIGHT & MULTI-LAYER PARALLAX ENGINE (ALL 8 STOPS)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !pinWrapperRef.current) return;

    // Calculate total path length for stroke dash animation
    let pathLen = 5000;
    if (trailPathRef.current) {
      try {
        pathLen = trailPathRef.current.getTotalLength();
      } catch {
        pathLen = 5000;
      }
    }

    if (trailMaskPathRef.current) {
      trailMaskPathRef.current.style.strokeDasharray = `${pathLen}`;
      trailMaskPathRef.current.style.strokeDashoffset = `${pathLen}`;
    }

    const ctx = gsap.context(() => {
      const pinWrapper = pinWrapperRef.current;
      const totalStops = activeStages.length;
      const totalScrollHeight = `${totalStops * FLIGHT_CONFIG.scrollVhPerStop}vh`;

      // Master ScrollTrigger timeline pinned to the viewport
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalScrollHeight}`,
          pin: pinWrapper,
          scrub: FLIGHT_CONFIG.scrubLag,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // 1. Far Layer (Drifts slowly, soft scale)
      if (farLayerRef.current) {
        masterTl.to(
          farLayerRef.current,
          {
            y: -240 * FLIGHT_CONFIG.layerSpeeds.farClouds,
            scale: 1.12,
            ease: 'none'
          },
          0
        );
      }

      // 2. Mid Layer (Medium speed outline clouds)
      if (midLayerRef.current) {
        masterTl.to(
          midLayerRef.current,
          {
            y: -600 * FLIGHT_CONFIG.layerSpeeds.midClouds,
            ease: 'none'
          },
          0
        );
      }

      // 3. Near Layer (Fast flying clouds scaling and sweeping past edges between stops)
      if (nearLayerRef.current) {
        const nearClouds = nearLayerRef.current.querySelectorAll('.near-cloud');
        nearClouds.forEach((cloud, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          masterTl.fromTo(
            cloud,
            { scale: 0.7, opacity: 0, x: 0, y: 200 },
            {
              scale: FLIGHT_CONFIG.scaleValues.nearCloudEnd,
              opacity: 0.35,
              x: dir * 240,
              y: -500,
              ease: 'power1.inOut',
              repeat: Math.ceil(totalStops / 2),
              yoyo: true
            },
            i * 0.15
          );
        });
      }

      // 4. Trail & Paper Plane Flight Motion
      if (trailPathRef.current && trailMaskPathRef.current && planeRef.current) {
        const path = trailPathRef.current;
        const mask = trailMaskPathRef.current;
        const plane = planeRef.current;

        const proxy = { progress: 0 };

        masterTl.to(
          proxy,
          {
            progress: 1,
            ease: 'none',
            onUpdate: () => {
              const p = proxy.progress;
              const currentDist = p * pathLen;
              
              // Unmask the trail ahead of the plane
              mask.style.strokeDashoffset = `${pathLen * (1 - p)}`;

              // Get current tangent angle and coordinates
              const pt = path.getPointAtLength(currentDist);
              const pNext = path.getPointAtLength(Math.min(pathLen, currentDist + 5));
              const pPrev = path.getPointAtLength(Math.max(0, currentDist - 5));

              const dx = pNext.x - pPrev.x;
              const dy = pNext.y - pPrev.y;
              const rad = Math.atan2(dy, dx);
              const deg = (rad * 180) / Math.PI + 90; // Align plane nose

              plane.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${deg})`);
              plane.style.opacity = p > 0.01 && p < 0.99 ? '1' : `${Math.max(0, p * 50)}`;

              // Optional camera horizontal bank/pan between curves
              if (cameraStageRef.current) {
                const bankOffset = Math.sin(p * Math.PI * (totalStops - 1)) * 18;
                cameraStageRef.current.style.transform = `translateX(${bankOffset}px)`;
              }
            }
          },
          0
        );
      }

      // 5. Fork at Stage 08 (Expansion Hubs reveal)
      if (forkGroupRef.current) {
        masterTl.to(
          forkGroupRef.current,
          { opacity: 1, ease: 'power2.out', duration: 0.1 },
          0.88
        );
      }

      // 6. Sequential Transitions across ALL 8 STOPS (01 through 08)
      const segmentDuration = 1 / totalStops;

      activeStages.forEach((_, index) => {
        const stopEl = document.getElementById(`flight-stop-${index}`);
        if (!stopEl) return;

        const numeralEl = stopEl.querySelector('.flight-numeral');
        const cardEl = stopEl.querySelector('.flight-case-card');
        const textEl = stopEl.querySelector('.flight-text-col');
        const stampEl = stopEl.querySelector('.flight-stamp-node');

        const stopStart = index * segmentDuration;
        const stopEnd = (index + 1) * segmentDuration;

        if (index === 0) {
          // Stop 01 starts in-view
          gsap.set(stopEl, { opacity: 1, zIndex: 10 });
          gsap.set(cardEl, { scale: 1, y: 0, opacity: 1 });
          gsap.set(textEl, { opacity: 1, y: 0 });
          gsap.set(stampEl, { scale: 1, opacity: 1 });
          if (numeralEl) gsap.set(numeralEl, { opacity: 0.14, scale: 1 });

          // Exit transition as camera flies toward Stop 02
          masterTl.to(
            [textEl, cardEl, stampEl],
            {
              opacity: 0,
              y: -45,
              scale: 0.94,
              ease: 'power2.in',
              duration: segmentDuration * 0.3
            },
            stopEnd - segmentDuration * 0.3
          );

          if (numeralEl) {
            masterTl.to(
              numeralEl,
              {
                y: -90,
                opacity: 0,
                ease: 'power2.in',
                duration: segmentDuration * 0.3
              },
              stopEnd - segmentDuration * 0.3
            );
          }
        } else {
          // Stops 02 through 08: Start hidden
          gsap.set(stopEl, { opacity: 0, zIndex: 10 + index });
          if (cardEl) gsap.set(cardEl, { scale: FLIGHT_CONFIG.scaleValues.cardStart, y: 40, opacity: 0 });
          if (textEl) gsap.set(textEl, { opacity: 0, y: 30 });
          if (stampEl) gsap.set(stampEl, { scale: 0.3, opacity: 0 });
          if (numeralEl) gsap.set(numeralEl, { opacity: 0, scale: FLIGHT_CONFIG.scaleValues.numeralStart });

          // Arrival Phase: Fade into view
          masterTl.to(
            stopEl,
            { opacity: 1, duration: segmentDuration * 0.22, ease: 'power1.out' },
            stopStart
          );

          // Pop in stamp icon tile at center node
          if (stampEl) {
            masterTl.to(
              stampEl,
              { scale: 1, opacity: 1, duration: segmentDuration * 0.25, ease: 'back.out(1.6)' },
              stopStart + segmentDuration * 0.08
            );
          }

          // Case study card scales in and settles
          if (cardEl) {
            masterTl.to(
              cardEl,
              {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: segmentDuration * 0.3,
                ease: 'power2.out'
              },
              stopStart + segmentDuration * 0.12
            );
          }

          // Text column slides up
          if (textEl) {
            masterTl.to(
              textEl,
              { opacity: 1, y: 0, duration: segmentDuration * 0.28, ease: 'power2.out' },
              stopStart + segmentDuration * 0.1
            );
          }

          // Giant background numeral glides
          if (numeralEl) {
            masterTl.to(
              numeralEl,
              {
                opacity: 0.14,
                scale: FLIGHT_CONFIG.scaleValues.numeralEnd,
                y: -30,
                duration: segmentDuration * 0.4,
                ease: 'sine.out'
              },
              stopStart + segmentDuration * 0.08
            );
          }

          // Exit transition (except for Stop 08 which is the final destination)
          if (index < totalStops - 1) {
            masterTl.to(
              [textEl, cardEl, stampEl],
              {
                opacity: 0,
                y: -45,
                scale: 0.94,
                ease: 'power2.in',
                duration: segmentDuration * 0.3
              },
              stopEnd - segmentDuration * 0.3
            );

            if (numeralEl) {
              masterTl.to(
                numeralEl,
                {
                  y: -90,
                  opacity: 0,
                  ease: 'power2.in',
                  duration: segmentDuration * 0.3
                },
                stopEnd - segmentDuration * 0.3
              );
            }
          }
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion, activeStages]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className={`relative bg-gradient-to-b from-[#FAF8F5] via-[#F6F1E8] to-[#FAF8F5] text-[#14181F] ${
        isReducedMotion ? 'py-20' : 'h-[900vh]'
      }`}
    >
      {/* PINNED STAGE VIEWPORT (Full-Screen Flight Stage) */}
      <div
        ref={pinWrapperRef}
        className={`${
          isReducedMotion ? 'relative' : 'sticky top-0 h-screen'
        } w-full overflow-hidden flex flex-col justify-center`}
      >

        {/* -------------------------------------------------------------------
            DEPTH LAYER 1: FAR LAYER (Large faint outline clouds & radial glow)
        -------------------------------------------------------------------- */}
        <div 
          ref={farLayerRef} 
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        >
          {/* Ambient Warm Golden/Cream Glows */}
          <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-[#847445]/6 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[#C5A869]/8 blur-[140px]" />

          {/* Large Faint SVG Outline Clouds (Speed: Slowest) */}
          <svg className="w-full h-full opacity-40" viewBox="0 0 1440 900" fill="none">
            {/* Far Cloud Left */}
            <path
              d="M120 320 C140 280, 200 270, 240 300 C270 270, 330 270, 360 310 C390 300, 440 330, 430 370 C440 410, 390 440, 350 440 L140 440 C100 440, 80 400, 100 360 C90 340, 105 325, 120 320 Z"
              stroke="#D9D4C7"
              strokeWidth="1.5"
              fill="rgba(255, 255, 255, 0.45)"
            />
            {/* Far Cloud Right */}
            <path
              d="M1020 180 C1040 140, 1100 130, 1140 160 C1170 130, 1230 130, 1260 170 C1290 160, 1340 190, 1330 230 C1340 270, 1290 300, 1250 300 L1040 300 C1000 300, 980 260, 1000 220 C990 200, 1005 185, 1020 180 Z"
              stroke="#D9D4C7"
              strokeWidth="1.5"
              fill="rgba(255, 255, 255, 0.45)"
            />
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            DEPTH LAYER 2: MID LAYER (Normal outline clouds, medium speed)
        -------------------------------------------------------------------- */}
        <div 
          ref={midLayerRef} 
          className="absolute inset-0 pointer-events-none z-1 overflow-hidden"
        >
          <svg className="w-full h-full opacity-70" viewBox="0 0 1440 900" fill="none">
            {/* Mid Cloud Upper Center */}
            <g transform="translate(680, 100) scale(0.9)">
              <path
                d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z"
                fill="#FFFFFF"
                fillOpacity="0.9"
                stroke="#D9D4C7"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
            {/* Mid Cloud Lower Center */}
            <g transform="translate(420, 680) scale(0.95)">
              <path
                d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z"
                fill="#FFFFFF"
                fillOpacity="0.9"
                stroke="#D9D4C7"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            FLIGHT PATH & MOVING PAPER PLANE (The Spine Across All 8 Stops)
        -------------------------------------------------------------------- */}
        {!isReducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-5">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1000 1900" 
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <mask id="flight-trail-mask-all">
                  <path
                    ref={trailMaskPathRef}
                    d="M 500 50
                       C 400 120, 360 200, 500 280
                       C 640 360, 640 440, 500 520
                       C 360 600, 360 680, 500 760
                       C 640 840, 640 920, 500 1000
                       C 360 1080, 360 1160, 500 1240
                       C 640 1320, 640 1400, 500 1480
                       C 360 1560, 400 1640, 500 1720
                       L 500 1850"
                    stroke="#FFFFFF"
                    strokeWidth="32"
                    strokeLinecap="round"
                    fill="none"
                  />
                </mask>
              </defs>

              {/* Guide path for sampling points & tangents */}
              <path
                ref={trailPathRef}
                d="M 500 50
                   C 400 120, 360 200, 500 280
                   C 640 360, 640 440, 500 520
                   C 360 600, 360 680, 500 760
                   C 640 840, 640 920, 500 1000
                   C 360 1080, 360 1160, 500 1240
                   C 640 1320, 640 1400, 500 1480
                   C 360 1560, 400 1640, 500 1720
                   L 500 1850"
                stroke="transparent"
                strokeWidth="1"
              />

              {/* Dotted Flight Path that draws ahead of plane */}
              <path
                d="M 500 50
                   C 400 120, 360 200, 500 280
                   C 640 360, 640 440, 500 520
                   C 360 600, 360 680, 500 760
                   C 640 840, 640 920, 500 1000
                   C 360 1080, 360 1160, 500 1240
                   C 640 1320, 640 1400, 500 1480
                   C 360 1560, 400 1640, 500 1720
                   L 500 1850"
                stroke="#847445"
                strokeWidth="3"
                strokeDasharray="2 12"
                strokeLinecap="round"
                fill="none"
                mask="url(#flight-trail-mask-all)"
              />

              {/* FORK AT STAGE 08 IN OFFICIAL LOGO COLOR */}
              <g 
                ref={forkGroupRef} 
                style={{ opacity: 0 }}
                className="transition-opacity duration-500 ease-out"
              >
                <path d="M 500 1850 C 460 1870, 360 1890, 260 1910" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 1850 C 480 1870, 440 1890, 420 1910" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 1850 C 520 1870, 560 1890, 580 1910" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 1850 C 540 1870, 640 1890, 740 1910" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />

                <circle cx="260" cy="1910" r="4" fill="#847445" />
                <circle cx="420" cy="1910" r="4" fill="#847445" />
                <circle cx="580" cy="1910" r="4" fill="#847445" />
                <circle cx="740" cy="1910" r="4" fill="#847445" />
              </g>

              {/* Moving Origami Paper Plane with Logo Gold Accent Tip */}
              <g 
                ref={planeRef} 
                className="pointer-events-none"
                style={{ opacity: 0 }}
              >
                {/* Plane Shadow */}
                <g transform="translate(3, 6) scale(0.24) translate(-110, -90)" opacity="0.16">
                  <path d="M110 20 L25 140 L110 115 Z" fill="#000000" />
                  <path d="M110 20 L195 140 L110 115 Z" fill="#000000" />
                  <path d="M110 20 L110 160 L102 116 Z" fill="#000000" />
                  <path d="M110 20 L110 160 L118 116 Z" fill="#000000" />
                </g>

                {/* Plane Wings */}
                <g transform="scale(0.24) translate(-110, -90)">
                  <path d="M110 20 L25 140 L110 115 Z" fill="#FFFFFF" stroke="#D1C7BA" strokeWidth="2" />
                  <path d="M110 20 L195 140 L110 115 Z" fill="#F8F7F4" stroke="#D1C7BA" strokeWidth="2" />
                  <path d="M110 20 L110 160 L102 116 Z" fill="#E8E4DA" />
                  <path d="M110 20 L110 160 L118 116 Z" fill="#D6D0C2" />
                  {/* CYK Brand Olive-Gold Nose Tip */}
                  <path d="M110 20 L102 45 L118 45 Z" fill="#847445" />
                </g>
              </g>
            </svg>
          </div>
        )}

        {/* -------------------------------------------------------------------
            STAGE CONTENT STOPS (Z-Pinned Destinations 01 through 08)
        -------------------------------------------------------------------- */}
        <div 
          ref={cameraStageRef}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 transition-transform duration-200"
        >
          {/* Section Heading Badge */}
          <div className="absolute -top-16 sm:-top-20 left-4 sm:left-8 z-30">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#EAEAEA] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#847445] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#847445] uppercase tracking-wider">
                The Growth Flight
              </span>
            </div>
          </div>

          {activeStages.map((stage, index) => {
            const Stamp = STAMP_ICONS[stage.stampIcon] || Lightbulb;
            const isEven = index % 2 === 0;

            return (
              <div
                key={stage.id}
                id={`flight-stop-${index}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto transition-opacity duration-300"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                {/* GIANT OUTLINED BACKGROUND NUMERAL (Depth Layer: Behind content) */}
                <div 
                  className={`flight-numeral absolute select-none pointer-events-none font-mono font-black text-[160px] sm:text-[240px] md:text-[300px] leading-none ${
                    isEven ? 'right-4 sm:right-12' : 'left-4 sm:left-12'
                  } top-1/2 -translate-y-1/2 text-transparent z-0`}
                  style={{
                    WebkitTextStroke: '2px rgba(132, 116, 69, 0.18)',
                    opacity: 0.14
                  }}
                >
                  {stage.number}
                </div>

                {/* DESTINATION CONTENT GRID */}
                <div className="relative z-10 w-full grid md:grid-cols-12 gap-6 sm:gap-10 md:gap-14 items-center">
                  
                  {/* Center Node Stamp Tile (Pops in at path center) */}
                  <div className="flight-stamp-node hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAEAEA] text-[#847445] flex items-center justify-center shadow-lg shadow-[#847445]/10">
                      <Stamp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Left/Right Text Column */}
                  <div className={`flight-text-col md:col-span-5 ${isEven ? 'md:order-1' : 'md:order-2 md:col-start-8'}`}>
                    <div className="space-y-3 sm:space-y-4 bg-white/75 md:bg-transparent p-6 md:p-0 rounded-2xl backdrop-blur-sm md:backdrop-blur-none border border-[#EAEAEA]/80 md:border-0 shadow-xs md:shadow-none">
                      
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#847445]">
                          {stage.number}
                        </span>
                        <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#14181F] tracking-tight">
                          {stage.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm font-serif italic text-slate-500">
                        "{stage.tagline}"
                      </p>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Services Pills */}
                      <div className="pt-1">
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Services: </span>
                          <span>{stage.cykServices.join(', ')}</span>
                        </div>
                      </div>

                      {/* Deliverables Bullet List */}
                      <div className="pt-1">
                        <ul className="text-xs text-slate-700 space-y-1.5">
                          {stage.deliverables.slice(0, 3).map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[#847445] font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive CTA */}
                      <div className="pt-2">
                        <button
                          onClick={() => onConsultStage(stage.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#847445]/10 hover:bg-[#847445] text-[#847445] hover:text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs group"
                        >
                          <span>Consult on {stage.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right/Left Foreground Case Study Card */}
                  <div className={`flight-case-card md:col-span-5 ${isEven ? 'md:order-2 md:col-start-8' : 'md:order-1'}`}>
                    <div className="bg-white/92 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/5 border border-[#EAEAEA] transition-shadow duration-300 hover:shadow-2xl">
                      
                      {/* Real Case Study Photo */}
                      <div className="h-44 sm:h-52 rounded-xl overflow-hidden mb-3.5 bg-slate-100 relative group">
                        <img 
                          src={stage.proofProject.image} 
                          alt={stage.proofProject.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium uppercase tracking-wider">
                          {stage.proofProject.type}
                        </div>
                      </div>

                      {/* Caption */}
                      <div className="text-xs sm:text-sm text-slate-700 leading-snug">
                        <strong className="text-slate-900 font-bold">{stage.proofProject.name}: </strong> 
                        {stage.proofProject.caption}
                      </div>

                      {/* Verbatim Client Quote */}
                      {stage.clientQuote && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2.5">
                          <Quote className="w-4 h-4 text-[#847445] shrink-0 mt-0.5" />
                          <div className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed">
                            "{stage.clientQuote.text}"
                            <span className="block not-italic font-semibold text-slate-800 mt-1">
                              — {stage.clientQuote.author}, {stage.clientQuote.brand}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* -------------------------------------------------------------------
            DEPTH LAYER 3: NEAR LAYER (Blurred clouds sweeping past camera)
        -------------------------------------------------------------------- */}
        <div 
          ref={nearLayerRef}
          className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
        >
          {/* Near Cloud 1: Bottom Right sweeps past */}
          <div 
            className="near-cloud absolute -bottom-10 -right-20 w-[420px] h-[260px] rounded-full bg-white/70 blur-2xl" 
            style={{ willChange: 'transform, opacity' }}
          />
          {/* Near Cloud 2: Top Left sweeps past */}
          {!isMobile && (
            <div 
              className="near-cloud absolute -top-16 -left-24 w-[480px] h-[300px] rounded-full bg-white/60 blur-3xl"
              style={{ willChange: 'transform, opacity' }}
            />
          )}
        </div>

      </div>
    </section>
  );
};