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
// CENTRAL CONFIGURATION OBJECT (Deterministic Coordinates & Layout per Stop)
// =============================================================================
export interface StopConfig {
  id: number;
  number: string;
  // SVG Path Anchor Point [x, y]
  pathPoint: [number, number];
  // Control point arriving into this stop [x, y] (for interior stops 02-07)
  controlIn?: [number, number];
  // Outgoing control point from this stop [x, y]
  controlOut?: [number, number];
  // Text column layout (floating on canvas, NO BOX)
  textPosition: [number, number]; // [x, y]
  textWidth: number;
  // Case study photo card layout
  cardPosition: [number, number]; // [x, y] diagonally offset
  cardWidth: number;
  photoHeight: number;
  cardRotation: number;           // deg between -2 and 2
  cardShadow: string;
  // Optimal camera center framing both text + card + plane
  cameraAnchor: [number, number];
}

export const FLIGHT_CONFIG = {
  world: {
    baseW: 5600,
    baseH: 7400,
    padding: 800
  },
  refResolution: {
    w: 1440,
    h: 900
  },
  scrollVhPerStop: 1.15,
  scrub: true,
  parallax: {
    far: 0.25,
    mid: 0.55,
    near: 1.25
  },
  plane: {
    rotationLerp: 0.22,
    scale: 0.24
  },
  trail: {
    faintOpacity: 0.18,
    brightOpacity: 0.85,
    leadAhead: 0.025
  },
  cameraDamping: 0.12, // Lerp factor for buttery camera gliding
  mobileBreakpoint: 768,

  // ---------------------------------------------------------------------------
  // ORGANIC 8-STOP WAYPOINTS & LAYOUT (Uneven spacing, diagonal & vertical sections)
  // ---------------------------------------------------------------------------
  stops: [
    // Stop 01: "The Idea" — upper left-center
    {
      id: 0,
      number: "01",
      pathPoint: [1400, 700],
      controlOut: [2000, 800],
      textPosition: [1640, 480],
      textWidth: 440,
      cardPosition: [2140, 520],
      cardWidth: 430,
      photoHeight: 210,
      cardRotation: -1.3,
      cardShadow: "shadow-xl",
      cameraAnchor: [1880, 700]
    },
    // Stop 02: "The Numbers" — upper right (wide lazy diagonal sprint)
    {
      id: 1,
      number: "02",
      pathPoint: [3600, 1400],
      controlIn: [3100, 1250],
      controlOut: [4100, 1550], // Mirrored: 2*(3600, 1400) - (3100, 1250)
      textPosition: [2460, 1180],
      textWidth: 440,
      cardPosition: [2960, 1140],
      cardWidth: 420,
      photoHeight: 200,
      cardRotation: 1.7,
      cardShadow: "shadow-2xl",
      cameraAnchor: [3050, 1400]
    },
    // Stop 03: "The Place" — mid left-center (wide descending turnaround sweep)
    {
      id: 2,
      number: "03",
      pathPoint: [2000, 2400],
      controlIn: [2400, 2300],
      controlOut: [1600, 2500], // Mirrored: 2*(2000, 2400) - (2400, 2300)
      textPosition: [2240, 2180],
      textWidth: 430,
      cardPosition: [2730, 2140],
      cardWidth: 450,
      photoHeight: 220,
      cardRotation: -0.8,
      cardShadow: "shadow-xl",
      cameraAnchor: [2480, 2400]
    },
    // Stop 04: "The Menu & Kitchen" — mid left (near-vertical plunge!)
    {
      id: 3,
      number: "04",
      pathPoint: [1500, 3300],
      controlIn: [1450, 2900],
      controlOut: [1550, 3700], // Mirrored: 2*(1500, 3300) - (1450, 2900)
      textPosition: [1740, 3080],
      textWidth: 440,
      cardPosition: [2240, 3130],
      cardWidth: 410,
      photoHeight: 200,
      cardRotation: 1.8,
      cardShadow: "shadow-xl",
      cameraAnchor: [2000, 3300]
    },
    // Stop 05: "The Brand & Space" — mid right (fast dynamic eastward sweep)
    {
      id: 4,
      number: "05",
      pathPoint: [3500, 4100],
      controlIn: [3000, 4050],
      controlOut: [4000, 4150], // Mirrored: 2*(3500, 4100) - (3000, 4050)
      textPosition: [2360, 3880],
      textWidth: 440,
      cardPosition: [2860, 3840],
      cardWidth: 450,
      photoHeight: 230,
      cardRotation: -1.6,
      cardShadow: "shadow-2xl",
      cameraAnchor: [2950, 4100]
    },
    // Stop 06: "The Team" — lower center (gentle hook)
    {
      id: 5,
      number: "06",
      pathPoint: [2400, 4900],
      controlIn: [2800, 4800],
      controlOut: [2000, 5000], // Mirrored: 2*(2400, 4900) - (2800, 4800)
      textPosition: [2640, 4680],
      textWidth: 430,
      cardPosition: [3130, 4650],
      cardWidth: 410,
      photoHeight: 195,
      cardRotation: 0.9,
      cardShadow: "shadow-lg",
      cameraAnchor: [2880, 4900]
    },
    // Stop 07: "The Launch" — lower left (descending turnaround)
    {
      id: 6,
      number: "07",
      pathPoint: [1300, 5700],
      controlIn: [1350, 5350],
      controlOut: [1250, 6050], // Mirrored: 2*(1300, 5700) - (1350, 5350)
      textPosition: [1540, 5480],
      textWidth: 440,
      cardPosition: [2040, 5520],
      cardWidth: 430,
      photoHeight: 210,
      cardRotation: -1.2,
      cardShadow: "shadow-xl",
      cameraAnchor: [1800, 5700]
    },
    // Stop 08: "The Expansion" — bottom right (grand finale arrival)
    {
      id: 7,
      number: "08",
      pathPoint: [3800, 6500],
      controlIn: [3100, 6450],
      textPosition: [2650, 6280],
      textWidth: 450,
      cardPosition: [3170, 6240],
      cardWidth: 460,
      photoHeight: 235,
      cardRotation: 1.5,
      cardShadow: "shadow-2xl",
      cameraAnchor: [3250, 6500]
    }
  ] as StopConfig[]
};

// Builder: builds continuous C1 SVG path string with mirrored tangents
function buildOrganicPathD(stops: StopConfig[]): string {
  if (stops.length < 2) return '';
  let d = `M ${stops[0].pathPoint[0]} ${stops[0].pathPoint[1]}`;

  for (let i = 0; i < stops.length - 1; i++) {
    const curr = stops[i];
    const next = stops[i + 1];
    const cpOut = curr.controlOut || [
      curr.pathPoint[0] + (next.pathPoint[0] - curr.pathPoint[0]) * 0.35,
      curr.pathPoint[1] + (next.pathPoint[1] - curr.pathPoint[1]) * 0.35
    ];
    const cpIn = next.controlIn || [
      next.pathPoint[0] - (next.pathPoint[0] - curr.pathPoint[0]) * 0.35,
      next.pathPoint[1] - (next.pathPoint[1] - curr.pathPoint[1]) * 0.35
    ];
    d += ` C ${cpOut[0]} ${cpOut[1]}, ${cpIn[0]} ${cpIn[1]}, ${next.pathPoint[0]} ${next.pathPoint[1]}`;
  }

  return d;
}

// Shortest angle difference handling ±180° wrap
function shortestAngleDelta(target: number, current: number): number {
  return ((((target - current + 540) % 360) - 180));
}

// Cubic smoothstep easing
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

interface FlightJourneyProps {
  onConsultStage: (stageIndex: number) => void;
  onOpenServiceModal: (stageIndex: number) => void;
  stopCount?: number;
}

export const FlightJourney: React.FC<FlightJourneyProps> = ({
  onConsultStage,
  onOpenServiceModal,
  stopCount = 8
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  // Parallax Siblings (all sit at z-5 to z-15, BELOW World z-30)
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const nearLayerRef = useRef<HTMLDivElement>(null);

  // SVG Elements
  const pathRef = useRef<SVGPathElement>(null);
  const trailMaskPathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const smoothedAngleRef = useRef<number>(0);
  
  // Damped Camera Coordinates
  const cameraStateRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0
  });

  const activeCount = Math.max(2, Math.min(8, stopCount));
  const activeConfigs = useMemo(() => FLIGHT_CONFIG.stops.slice(0, activeCount), [activeCount]);
  const activeStages = useMemo(() => JOURNEY_STAGES.slice(0, activeCount), [activeCount]);
  const activePathD = useMemo(() => buildOrganicPathD(activeConfigs), [activeConfigs]);

  // Motion preference & resize
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mqMotion.matches);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < FLIGHT_CONFIG.mobileBreakpoint);
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

  // Lenis Smooth Scrolling
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

  // Continuous Camera Damping via GSAP Ticker
  useEffect(() => {
    if (isReducedMotion) return;

    const updateCameraTick = () => {
      const cam = cameraStateRef.current;
      const factor = FLIGHT_CONFIG.cameraDamping;

      cam.currentX += (cam.targetX - cam.currentX) * factor;
      cam.currentY += (cam.targetY - cam.currentY) * factor;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleW = vw / FLIGHT_CONFIG.refResolution.w;
      const scaleH = (vh - 80) / 720;
      const s = Math.max(0.60, Math.min(1.05, Math.min(scaleW, scaleH)));

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${cam.currentX}px, ${cam.currentY}px, 0) scale(${s})`;
        worldRef.current.style.transformOrigin = '0 0';
      }

      if (farLayerRef.current) {
        farLayerRef.current.style.transform = `translate3d(${cam.currentX * FLIGHT_CONFIG.parallax.far}px, ${cam.currentY * FLIGHT_CONFIG.parallax.far}px, 0)`;
      }
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translate3d(${cam.currentX * FLIGHT_CONFIG.parallax.mid}px, ${cam.currentY * FLIGHT_CONFIG.parallax.mid}px, 0)`;
      }
      if (nearLayerRef.current) {
        const nearX = (cam.currentX * FLIGHT_CONFIG.parallax.near) % 900;
        const nearY = (cam.currentY * FLIGHT_CONFIG.parallax.near) % 700;
        nearLayerRef.current.style.transform = `translate3d(${nearX}px, ${nearY}px, 0)`;
      }
    };

    gsap.ticker.add(updateCameraTick);

    return () => {
      gsap.ticker.remove(updateCameraTick);
    };
  }, [isReducedMotion]);

  // GSAP ScrollTrigger Flight Engine
  useEffect(() => {
    if (isReducedMotion || !containerRef.current || !pinWrapperRef.current || !pathRef.current) return;

    const pathEl = pathRef.current;
    const totalPathLen = pathEl.getTotalLength();

    if (trailMaskPathRef.current) {
      trailMaskPathRef.current.style.strokeDasharray = `${totalPathLen}`;
      trailMaskPathRef.current.style.strokeDashoffset = `${totalPathLen}`;
    }

    const totalSegments = activeCount - 1;

    // Viewport responsive scale factor
    const getScaleFactor = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleW = vw / FLIGHT_CONFIG.refResolution.w;
      const scaleH = (vh - 80) / 720;
      return Math.max(0.60, Math.min(1.05, Math.min(scaleW, scaleH)));
    };

    let scaleFactor = getScaleFactor();

    // Master ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => `+=${activeCount * window.innerHeight * FLIGHT_CONFIG.scrollVhPerStop}`,
      pin: pinWrapperRef.current,
      scrub: FLIGHT_CONFIG.scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        scaleFactor = getScaleFactor();
      },
      onUpdate: (self) => {
        const rawScroll = self.progress;

        // Smooth piecewise remap with smoothstep easing (no step changes in speed)
        let flightProgress = 0;
        let isDwell = false;
        let currentStopIdx = 0;

        const startHold = 0.045;
        const endHold = 0.055;
        const dwellHalf = 0.024;

        if (rawScroll <= startHold) {
          flightProgress = 0;
          isDwell = true;
          currentStopIdx = 0;
        } else if (rawScroll >= 1.0 - endHold) {
          flightProgress = 1.0;
          isDwell = true;
          currentStopIdx = activeCount - 1;
        } else {
          // Remap interior scroll span smoothly
          const effectiveScroll = (rawScroll - startHold) / (1.0 - startHold - endHold);
          const nominalStopPos = effectiveScroll * totalSegments;
          const nearestStop = Math.round(nominalStopPos);
          const distToStop = Math.abs(nominalStopPos - nearestStop);

          if (distToStop < dwellHalf * totalSegments) {
            flightProgress = nearestStop / totalSegments;
            isDwell = true;
            currentStopIdx = nearestStop;
          } else {
            // Smooth transit curve
            flightProgress = nominalStopPos / totalSegments;
            isDwell = false;
            currentStopIdx = Math.floor(nominalStopPos);
          }
        }

        const clampedProgress = Math.max(0, Math.min(1, flightProgress));
        const currentDist = clampedProgress * totalPathLen;

        // 1. Trail Progressive Reveal
        if (trailMaskPathRef.current) {
          const leadAhead = Math.min(1, clampedProgress + FLIGHT_CONFIG.trail.leadAhead);
          trailMaskPathRef.current.style.strokeDashoffset = `${totalPathLen * (1 - leadAhead)}`;
        }

        // 2. Sample plane position & banking angle
        const pt = pathEl.getPointAtLength(currentDist);
        const sampleOffset = 8;
        const pNext = pathEl.getPointAtLength(Math.min(totalPathLen, currentDist + sampleOffset));
        const pPrev = pathEl.getPointAtLength(Math.max(0, currentDist - sampleOffset));

        const dx = pNext.x - pPrev.x;
        const dy = pNext.y - pPrev.y;
        const rawRad = Math.atan2(dy, dx);
        const rawDeg = (rawRad * 180) / Math.PI + 90;

        const angleDiff = shortestAngleDelta(rawDeg, smoothedAngleRef.current);
        smoothedAngleRef.current += angleDiff * FLIGHT_CONFIG.plane.rotationLerp;

        if (planeRef.current) {
          planeRef.current.setAttribute(
            'transform',
            `translate(${pt.x}, ${pt.y}) rotate(${smoothedAngleRef.current})`
          );
        }

        // 3. Camera Target using Camera Anchors from Stop Configs
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const segIdx = Math.min(totalSegments - 1, Math.max(0, Math.floor(clampedProgress * totalSegments)));
        const segT = (clampedProgress * totalSegments) - segIdx;
        const currAnchor = activeConfigs[segIdx].cameraAnchor;
        const nextAnchor = activeConfigs[segIdx + 1]?.cameraAnchor || currAnchor;

        // Smooth cubic blend between stop camera anchors
        const smoothT = smoothstep(0, 1, segT);
        const anchorX = currAnchor[0] + (nextAnchor[0] - currAnchor[0]) * smoothT;
        const anchorY = currAnchor[1] + (nextAnchor[1] - currAnchor[1]) * smoothT;

        // Vertical centering in the clear zone below fixed nav (80px)
        const navHeight = 80 * scaleFactor;
        const availableHeight = vh - navHeight;
        const camCenterY = navHeight + (availableHeight / 2);

        // Update Target (Damped follow lerps smoothly toward this)
        cameraStateRef.current.targetX = -anchorX * scaleFactor + vw / 2;
        cameraStateRef.current.targetY = -anchorY * scaleFactor + camCenterY;

        // Near clouds fade out during dwell so text is 100% crisp
        if (nearLayerRef.current) {
          nearLayerRef.current.style.opacity = isDwell ? '0' : '0.40';
        }

        // Subtle scale entrance for content (finishes well before dwell)
        activeConfigs.forEach((cfg, idx) => {
          const stopNominal = idx / totalSegments;
          const dist = Math.abs(clampedProgress - stopNominal);
          const stopEl = document.getElementById(`world-stop-${idx}`);
          if (!stopEl) return;
          const scale = dist < 0.14 ? 0.96 + 0.04 * (1 - dist / 0.14) : 0.96;
          stopEl.style.transform = `scale(${Math.min(1.0, scale)})`;
        });
      }
    });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      trigger.kill();
    };
  }, [isReducedMotion, activeCount, activeConfigs, activeStages]);

  // ===========================================================================
  // REDUCED MOTION STATIC FALLBACK
  // ===========================================================================
  if (isReducedMotion) {
    return (
      <section id="journey" className="relative bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          {activeStages.map((stage, idx) => {
            const Stamp = STAMP_ICONS[stage.stampIcon] || Lightbulb;
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={stage.id} 
                className="grid md:grid-cols-12 gap-8 items-start py-8 border-b border-[#EAEAEA]"
              >
                <div className={`md:col-span-6 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-3xl font-extrabold text-[#847445]">{stage.number}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#847445]/10 text-[#847445] flex items-center justify-center shrink-0 border border-[#847445]/20">
                      <Stamp className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">{stage.title}</h3>
                  </div>
                  <p className="text-sm font-serif italic text-slate-500 mb-3">"{stage.tagline}"</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{stage.description}</p>
                  <button
                    onClick={() => onConsultStage(stage.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#847445] text-white text-xs font-bold"
                  >
                    <span>Consult on {stage.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className={`md:col-span-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="rounded-2xl overflow-hidden border border-[#EAEAEA] bg-white p-4 shadow-sm">
                    <img src={stage.proofProject.image} alt={stage.proofProject.name} className="w-full h-52 object-cover rounded-xl mb-3" />
                    <div className="text-xs font-bold text-slate-900">{stage.proofProject.name}</div>
                    <div className="text-xs text-slate-500">{stage.proofProject.caption}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // ===========================================================================
  // INTERACTIVE FLIGHT EXPERIENCE
  // ===========================================================================
  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full bg-[#FAF8F5] text-[#14181F]"
    >
      {/* PINNED VIEWPORT (100vw × 100vh) */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center"
      >
        {/* -------------------------------------------------------------------
            1. FAR LAYER (z-5, BELOW World z-30)
        -------------------------------------------------------------------- */}
        <div
          ref={farLayerRef}
          className="absolute inset-0 pointer-events-none z-5 overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] rounded-full bg-[#847445]/6 blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[750px] h-[750px] rounded-full bg-[#C5A869]/8 blur-[160px]" />
          <svg className="w-full h-full opacity-35" viewBox="0 0 1440 900" fill="none">
            <path
              d="M120 320 C140 280, 200 270, 240 300 C270 270, 330 270, 360 310 C390 300, 440 330, 430 370 C440 410, 390 440, 350 440 L140 440 C100 440, 80 400, 100 360 C90 340, 105 325, 120 320 Z"
              stroke="#D9D4C7"
              strokeWidth="1.5"
              fill="rgba(255, 255, 255, 0.45)"
            />
            <path
              d="M1020 180 C1040 140, 1100 130, 1140 160 C1170 130, 1230 130, 1260 170 C1290 160, 1340 190, 1330 230 C1340 270, 1290 300, 1250 300 L1040 300 C1000 300, 980 260, 1000 220 C990 200, 1005 185, 1020 180 Z"
              stroke="#D9D4C7"
              strokeWidth="1.5"
              fill="rgba(255, 255, 255, 0.45)"
            />
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            2. MID LAYER (z-10, BELOW World z-30)
        -------------------------------------------------------------------- */}
        <div
          ref={midLayerRef}
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          <svg className="w-full h-full opacity-65" viewBox="0 0 1440 900" fill="none">
            <g transform="translate(680, 120) scale(0.95)">
              <path
                d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z"
                fill="#FFFFFF"
                fillOpacity="0.85"
                stroke="#D9D4C7"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(380, 640) scale(1.0)">
              <path
                d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z"
                fill="#FFFFFF"
                fillOpacity="0.85"
                stroke="#D9D4C7"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            3. NEAR LAYER (z-15, BELOW World z-30, Fades out during dwell)
        -------------------------------------------------------------------- */}
        <div
          ref={nearLayerRef}
          className="absolute inset-0 pointer-events-none z-15 overflow-hidden transition-opacity duration-300"
          style={{ willChange: 'transform, opacity' }}
        >
          <div
            className="near-cloud absolute -bottom-10 -right-20 w-[440px] h-[280px] rounded-full bg-white/70 blur-2xl pointer-events-none"
            style={{ willChange: 'transform' }}
          />
          {!isMobile && (
            <div
              className="near-cloud absolute -top-16 -left-24 w-[500px] h-[320px] rounded-full bg-white/60 blur-3xl pointer-events-none"
              style={{ willChange: 'transform' }}
            />
          )}
          {!isMobile && (
            <div
              className="near-cloud absolute top-1/2 right-1/3 w-[360px] h-[220px] rounded-full bg-white/50 blur-2xl pointer-events-none"
              style={{ willChange: 'transform' }}
            />
          )}
        </div>

        {/* -------------------------------------------------------------------
            4. WORLD CONTAINER (z-30, In Front of all Clouds & Glows)
        -------------------------------------------------------------------- */}
        <div
          ref={worldRef}
          className="absolute top-0 left-0 pointer-events-auto z-30"
          style={{
            width: `${FLIGHT_CONFIG.world.baseW}px`,
            height: `${FLIGHT_CONFIG.world.baseH}px`
          }}
        >
          {/* Continuous SVG Flight Path & Paper Plane (z-10 inside world) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
            viewBox={`0 0 ${FLIGHT_CONFIG.world.baseW} ${FLIGHT_CONFIG.world.baseH}`}
            fill="none"
          >
            <defs>
              <mask id="world-trail-reveal-mask">
                <rect x="-1000" y="-1000" width="7600" height="9400" fill="black" />
                <path
                  ref={trailMaskPathRef}
                  d={activePathD}
                  stroke="white"
                  strokeWidth="52"
                  strokeLinecap="round"
                  fill="none"
                />
              </mask>
            </defs>

            <path
              ref={pathRef}
              d={activePathD}
              stroke="transparent"
              strokeWidth="1"
              fill="none"
            />

            {/* Faint Full Dotted Trail */}
            <path
              d={activePathD}
              stroke="#847445"
              strokeWidth="3"
              strokeDasharray="3 14"
              strokeLinecap="round"
              opacity={FLIGHT_CONFIG.trail.faintOpacity}
              fill="none"
            />

            {/* Bright Revealed Dotted Trail */}
            <path
              d={activePathD}
              stroke="#847445"
              strokeWidth="3.5"
              strokeDasharray="3 14"
              strokeLinecap="round"
              opacity={FLIGHT_CONFIG.trail.brightOpacity}
              fill="none"
              mask="url(#world-trail-reveal-mask)"
            />

            {/* Moving Origami Paper Plane with Gold Nose Tip */}
            <g ref={planeRef} className="pointer-events-none" style={{ willChange: 'transform' }}>
              <g transform="translate(4, 8) scale(0.24) translate(-110, -90)" opacity="0.18">
                <path d="M110 20 L25 140 L110 115 Z" fill="#000000" />
                <path d="M110 20 L195 140 L110 115 Z" fill="#000000" />
                <path d="M110 20 L110 160 L102 116 Z" fill="#000000" />
                <path d="M110 20 L110 160 L118 116 Z" fill="#000000" />
              </g>
              <g transform="scale(0.24) translate(-110, -90)">
                <path d="M110 20 L25 140 L110 115 Z" fill="#FFFFFF" stroke="#D1C7BA" strokeWidth="2" />
                <path d="M110 20 L195 140 L110 115 Z" fill="#F8F7F4" stroke="#D1C7BA" strokeWidth="2" />
                <path d="M110 20 L110 160 L102 116 Z" fill="#E8E4DA" />
                <path d="M110 20 L110 160 L118 116 Z" fill="#D6D0C2" />
                <path d="M110 20 L102 45 L118 45 Z" fill="#847445" />
              </g>
            </g>
          </svg>

          {/* EDITORIAL STOP LAYOUTS (NO TEXT BOX CONTAINER, ROTATED PHOTO CARDS, z-20) */}
          {activeConfigs.map((cfg, idx) => {
            const stage = activeStages[idx];
            if (!stage) return null;
            const Stamp = STAMP_ICONS[stage.stampIcon] || Lightbulb;

            return (
              <div
                key={stage.id}
                id={`world-stop-${idx}`}
                className="absolute pointer-events-auto z-20 transition-transform duration-200"
                style={{
                  left: 0,
                  top: 0,
                  width: `${FLIGHT_CONFIG.world.baseW}px`,
                  height: `${FLIGHT_CONFIG.world.baseH}px`,
                  opacity: 1 // Permanent opacity 1.0 (no ghosting, camera pan handles exit)
                }}
              >
                {/* GIANT OUTLINED BACKGROUND NUMERAL BEHIND TEXT */}
                <div
                  className="flight-numeral absolute select-none pointer-events-none font-mono font-black text-[230px] leading-none text-transparent z-0"
                  style={{
                    left: `${cfg.textPosition[0] - 40}px`,
                    top: `${cfg.textPosition[1] - 110}px`,
                    WebkitTextStroke: '2px rgba(132, 116, 69, 0.16)',
                    opacity: 0.15
                  }}
                >
                  {stage.number}
                </div>

                {/* 1. FLOATING EDITORIAL TEXT COLUMN (NO BOX CONTAINER) */}
                <div
                  className="absolute z-10 space-y-4"
                  style={{
                    left: `${cfg.textPosition[0]}px`,
                    top: `${cfg.textPosition[1]}px`,
                    width: `${cfg.textWidth}px`
                  }}
                >
                  {/* Title Row with Integrated Stamp Tile */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-extrabold text-[#847445]">
                      {stage.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/95 text-[#847445] flex items-center justify-center shrink-0 border border-[#847445]/20 shadow-2xs">
                      <Stamp className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight">
                      {stage.title}
                    </h3>
                  </div>

                  {/* Italic Tagline */}
                  <p className="text-xs sm:text-sm font-serif italic text-slate-500">
                    "{stage.tagline}"
                  </p>

                  {/* High Contrast Description */}
                  <p className="text-[#14181F]/85 text-xs sm:text-sm leading-relaxed">
                    {stage.description}
                  </p>

                  {/* CYK Services */}
                  <div className="pt-1.5">
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Services: </span>
                      <span>{stage.cykServices.join(', ')}</span>
                    </div>
                  </div>

                  {/* Key Deliverables Bullet Points */}
                  <div className="pt-1">
                    <ul className="text-xs text-slate-700 space-y-1">
                      {stage.deliverables.slice(0, 3).map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className="text-[#847445] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive CTA */}
                  <div className="pt-3">
                    <button
                      onClick={() => onConsultStage(stage.id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs group"
                    >
                      <span>Consult on {stage.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 2. CASE-STUDY PHOTO CARD (Diagonally offset, slightly rotated, auto-height) */}
                <div
                  className={`absolute z-10 bg-white rounded-2xl p-5 border border-[#EAEAEA] ${cfg.cardShadow} transition-transform duration-300 hover:rotate-0`}
                  style={{
                    left: `${cfg.cardPosition[0]}px`,
                    top: `${cfg.cardPosition[1]}px`,
                    width: `${cfg.cardWidth}px`,
                    transform: `rotate(${cfg.cardRotation}deg)`
                  }}
                >
                  {/* Photo with Custom Sized Height per stop */}
                  <div 
                    className="rounded-xl overflow-hidden mb-3.5 bg-slate-100 relative group"
                    style={{ height: `${cfg.photoHeight}px` }}
                  >
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

                  {/* Verbatim Quote */}
                  {stage.clientQuote && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start gap-2.5">
                      <Quote className="w-4 h-4 text-[#847445] shrink-0 mt-0.5" />
                      <div className="text-[11px] text-slate-600 italic leading-relaxed">
                        "{stage.clientQuote.text}"
                        <span className="block not-italic font-semibold text-slate-800 mt-1">
                          — {stage.clientQuote.author}, {stage.clientQuote.brand}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
