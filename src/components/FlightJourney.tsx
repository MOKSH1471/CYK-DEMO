import React, { useEffect, useRef, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { JOURNEY_STAGES } from '../data/mockData';
import { 
  Lightbulb, Calculator, MapPin, Utensils, Palette, ChefHat, 
  Megaphone, Store, ArrowRight, Quote, CheckCircle2, Sparkles, Sun
} from 'lucide-react';
import { PaperPlane } from './PaperPlane';

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

export interface StopConfig {
  id: number;
  number: string;
  pathPoint: [number, number];
  controlIn?: [number, number];
  controlOut?: [number, number];
  textPosition: [number, number];
  textWidth: number;
  cardPosition: [number, number];
  cardWidth: number;
  photoHeight: number;
  cardRotation: number;
  cardShadow: string;
  cameraAnchor: [number, number];
  fixCode: string;
  airportType: string;
  telemetry: string;
}

export const FLIGHT_CONFIG = {
  world: {
    baseW: 6000,
    baseH: 12400,
    padding: 800
  },
  refResolution: {
    w: 1440,
    h: 900
  },
  scrollVhPerStop: 1.35,
  scrub: true,
  parallax: {
    far: 0.35,
    mid: 0.65,
    near: 1.25
  },
  plane: {
    rotationLerp: 0.75,
    scale: 0.44
  },
  cameraDamping: 0.22,
  mobileBreakpoint: 768,

  // 8 Dedicated Stops: Equal 1400px vertical steps, comfortable clearance below floating nav
  stops: [
    // Stop 01: The Idea (Left)
    {
      id: 0,
      number: '01',
      cameraAnchor: [1000, 950],
      textPosition: [360, 720],
      textWidth: 540,
      cardPosition: [1000, 740],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: -1.5,
      cardShadow: 'shadow-2xl',
      pathPoint: [1680, 870],
      controlOut: [2500, 1170],
      fixCode: 'ORIGIN: CYK-01',
      airportType: 'CONCEPT AIRFIELD',
      telemetry: 'RUNWAY 01L · ELEV 1,200 FT'
    },
    // Stop 02: The Numbers (Right) - 1400px below Stop 01
    {
      id: 1,
      number: '02',
      cameraAnchor: [4100, 2350],
      textPosition: [3520, 2120],
      textWidth: 540,
      cardPosition: [4160, 2140],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: 1.8,
      cardShadow: 'shadow-2xl',
      pathPoint: [3200, 2270],
      controlIn: [2800, 1970],
      controlOut: [3600, 2570],
      fixCode: 'WAYPOINT: CYK-02',
      airportType: 'FEASIBILITY AERODROME',
      telemetry: 'RUNWAY 02R · ELEV 1,850 FT'
    },
    // Stop 03: The Place (Left) - 1400px below Stop 02
    {
      id: 2,
      number: '03',
      cameraAnchor: [1000, 3750],
      textPosition: [360, 3520],
      textWidth: 540,
      cardPosition: [1000, 3540],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: -1.2,
      cardShadow: 'shadow-2xl',
      pathPoint: [1680, 3670],
      controlIn: [2100, 3370],
      controlOut: [1260, 3970],
      fixCode: 'WAYPOINT: CYK-03',
      airportType: 'SITE ACQUISITION RADAR',
      telemetry: 'RUNWAY 03 · ELEV 2,100 FT'
    },
    // Stop 04: The Menu & Kitchen (Right) - 1400px below Stop 03
    {
      id: 3,
      number: '04',
      cameraAnchor: [4100, 5150],
      textPosition: [3520, 4920],
      textWidth: 540,
      cardPosition: [4160, 4940],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: 1.5,
      cardShadow: 'shadow-2xl',
      pathPoint: [3200, 5070],
      controlIn: [2800, 4770],
      controlOut: [3600, 5370],
      fixCode: 'WAYPOINT: CYK-04',
      airportType: 'CULINARY LAB TERMINAL',
      telemetry: 'RUNWAY 04L · ELEV 2,450 FT'
    },
    // Stop 05: The Brand & Space (Left) - 1400px below Stop 04
    {
      id: 4,
      number: '05',
      cameraAnchor: [1000, 6550],
      textPosition: [360, 6320],
      textWidth: 540,
      cardPosition: [1000, 6340],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: -1.6,
      cardShadow: 'shadow-2xl',
      pathPoint: [1680, 6470],
      controlIn: [2100, 6170],
      controlOut: [1260, 6770],
      fixCode: 'WAYPOINT: CYK-05',
      airportType: 'BRAND ARCHITECTURE BASE',
      telemetry: 'RUNWAY 05R · ELEV 2,900 FT'
    },
    // Stop 06: The Team (Right) - 1400px below Stop 05
    {
      id: 5,
      number: '06',
      cameraAnchor: [4100, 7950],
      textPosition: [3520, 7720],
      textWidth: 540,
      cardPosition: [4160, 7740],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: 1.3,
      cardShadow: 'shadow-2xl',
      pathPoint: [3200, 7870],
      controlIn: [2800, 7570],
      controlOut: [3600, 8170],
      fixCode: 'WAYPOINT: CYK-06',
      airportType: 'CREW TALENT AIRBASE',
      telemetry: 'RUNWAY 06 · ELEV 3,250 FT'
    },
    // Stop 07: The Launch (Left) - 1400px below Stop 06
    {
      id: 6,
      number: '07',
      cameraAnchor: [1000, 9350],
      textPosition: [360, 9120],
      textWidth: 540,
      cardPosition: [1000, 9140],
      cardWidth: 490,
      photoHeight: 240,
      cardRotation: -1.0,
      cardShadow: 'shadow-2xl',
      pathPoint: [1680, 9270],
      controlIn: [2100, 8970],
      controlOut: [1260, 9570],
      fixCode: 'WAYPOINT: CYK-07',
      airportType: 'MAIDEN LAUNCH STRIP',
      telemetry: 'RUNWAY 07R · ELEV 3,800 FT'
    },
    // Stop 08: The Expansion (Right) - 1400px below Stop 07
    {
      id: 7,
      number: '08',
      cameraAnchor: [4100, 10750],
      textPosition: [3520, 10520],
      textWidth: 540,
      cardPosition: [4160, 10540],
      cardWidth: 490,
      photoHeight: 250,
      cardRotation: 1.6,
      cardShadow: 'shadow-2xl',
      pathPoint: [3200, 10670],
      controlIn: [2800, 10370],
      fixCode: 'DESTINATION: CYK-08',
      airportType: 'NATIONAL EXPANSION AERODROME',
      telemetry: 'TERMINAL MAIN · FINAL ARRIVAL'
    }
  ] as StopConfig[]
};

// Continuous C1 SVG path string with smooth tangents
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

function shortestAngleDelta(target: number, current: number): number {
  return ((((target - current + 540) % 360) - 180));
}

function smootherstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

// Continuous cloud scenery across the journey
const SKY_CLOUDS = [
  // Upper sky (Stops 1-2 & transition)
  { x: 300, y: 350, scale: 1.4, opacity: 0.75 },
  { x: 1800, y: 550, scale: 1.1, opacity: 0.65 },
  { x: 2350, y: 1250, scale: 1.35, opacity: 0.80 },
  { x: 2850, y: 1650, scale: 1.45, opacity: 0.85 },
  { x: 3200, y: 400, scale: 1.5, opacity: 0.70 },
  { x: 4400, y: 750, scale: 1.2, opacity: 0.60 },
  { x: 1100, y: 1200, scale: 1.3, opacity: 0.65 },
  { x: 4200, y: 1700, scale: 1.3, opacity: 0.65 },
  { x: 500, y: 2000, scale: 1.2, opacity: 0.60 },

  // Mid-upper sky (Stops 2-4 & transition corridors)
  { x: 2600, y: 2700, scale: 1.5, opacity: 0.80 },
  { x: 2150, y: 3050, scale: 1.35, opacity: 0.75 },
  { x: 1900, y: 2400, scale: 1.5, opacity: 0.70 },
  { x: 3600, y: 2750, scale: 1.4, opacity: 0.75 },
  { x: 800, y: 3100, scale: 1.3, opacity: 0.65 },
  { x: 2400, y: 4250, scale: 1.45, opacity: 0.80 },
  { x: 2800, y: 4650, scale: 1.55, opacity: 0.85 },
  { x: 4300, y: 3800, scale: 1.2, opacity: 0.60 },
  { x: 1400, y: 4200, scale: 1.5, opacity: 0.75 },
  { x: 4700, y: 4900, scale: 1.4, opacity: 0.70 },

  // Mid-lower sky (Stops 4-6 & transition corridors)
  { x: 600, y: 5300, scale: 1.3, opacity: 0.65 },
  { x: 2600, y: 5550, scale: 1.4, opacity: 0.80 },
  { x: 2100, y: 5950, scale: 1.5, opacity: 0.85 },
  { x: 3900, y: 6000, scale: 1.4, opacity: 0.70 },
  { x: 1200, y: 6400, scale: 1.5, opacity: 0.70 },
  { x: 2400, y: 7050, scale: 1.45, opacity: 0.80 },
  { x: 2850, y: 7450, scale: 1.5, opacity: 0.85 },
  { x: 4500, y: 7100, scale: 1.5, opacity: 0.75 },
  { x: 700, y: 7500, scale: 1.2, opacity: 0.60 },

  // Deep sky (Stops 6-8 & transition corridors)
  { x: 4100, y: 8200, scale: 1.4, opacity: 0.75 },
  { x: 2550, y: 8350, scale: 1.45, opacity: 0.80 },
  { x: 2100, y: 8750, scale: 1.5, opacity: 0.85 },
  { x: 1500, y: 8600, scale: 1.5, opacity: 0.70 },
  { x: 4800, y: 9300, scale: 1.4, opacity: 0.70 },
  { x: 2400, y: 9750, scale: 1.4, opacity: 0.80 },
  { x: 2850, y: 10150, scale: 1.5, opacity: 0.85 },
  { x: 800, y: 9700, scale: 1.3, opacity: 0.65 },
  { x: 4200, y: 10400, scale: 1.4, opacity: 0.70 },
  { x: 1600, y: 10800, scale: 1.5, opacity: 0.70 },
  { x: 3400, y: 11200, scale: 1.3, opacity: 0.65 },
  { x: 2200, y: 11700, scale: 1.6, opacity: 0.75 }
];

export interface FlightJourneyHandle {
  updateFlight: (progress: number) => void;
}

interface FlightJourneyProps {
  onConsultStage: (stageIndex: number) => void;
  onOpenServiceModal: (stageIndex: number) => void;
  stopCount?: number;
  isEmbedded?: boolean;
  externalProgress?: number;
}

export function getInitialFlightPlaneScreenPos(vw: number, vh: number) {
  const scaleW = vw / 1440;
  const scaleH = (vh - 80) / 620;
  const s = Math.max(0.85, Math.min(1.15, Math.min(scaleW, scaleH)));
  const topNavOffset = 70;
  const targetX = -1000 * s + vw / 2;
  const targetY = -950 * s + (vh + topNavOffset) / 2;
  const screenX = targetX + 1680 * s;
  const screenY = targetY + 870 * s;
  const rotation = 110.1;
  return { screenX, screenY, rotation, scale: s };
}


// -----------------------------------------------------------------------------
// TRANSITION ATMOSPHERE ELEMENTS (Rendered directly in world coordinate space)
// -----------------------------------------------------------------------------
const WIND_SWIRLS = [
  { x: 2200, y: 1450, scale: 1.25, rotation: 12, opacity: 0.75 },
  { x: 2750, y: 1750, scale: 1.1, rotation: -10, opacity: 0.70 },
  { x: 2700, y: 2800, scale: 1.3, rotation: -20, opacity: 0.75 },
  { x: 2100, y: 3150, scale: 1.1, rotation: 18, opacity: 0.70 },
  { x: 2300, y: 4200, scale: 1.25, rotation: 8, opacity: 0.75 },
  { x: 2850, y: 4550, scale: 1.15, rotation: -14, opacity: 0.70 },
  { x: 2700, y: 5600, scale: 1.3, rotation: -18, opacity: 0.75 },
  { x: 2150, y: 5950, scale: 1.1, rotation: 16, opacity: 0.70 },
  { x: 2350, y: 7000, scale: 1.25, rotation: 14, opacity: 0.75 },
  { x: 2800, y: 7350, scale: 1.15, rotation: -12, opacity: 0.70 },
  { x: 2750, y: 8400, scale: 1.3, rotation: -22, opacity: 0.75 },
  { x: 2100, y: 8800, scale: 1.1, rotation: 18, opacity: 0.70 },
  { x: 2350, y: 9800, scale: 1.25, rotation: 14, opacity: 0.75 },
  { x: 2800, y: 10150, scale: 1.15, rotation: -10, opacity: 0.70 }
];

const BIRD_FLOCKS = [
  { x: 2250, y: 1350, scale: 1.35, rotation: -8 },
  { x: 2650, y: 4250, scale: 1.3, rotation: 6 },
  { x: 2200, y: 7100, scale: 1.35, rotation: -6 },
  { x: 2600, y: 9900, scale: 1.3, rotation: 8 }
];

const HOT_AIR_BALLOONS = [
  { x: 2350, y: 2950, scale: 1.45 },
  { x: 2450, y: 5750, scale: 1.38 },
  { x: 2500, y: 8600, scale: 1.45 }
];

export const FlightJourney = forwardRef<FlightJourneyHandle, FlightJourneyProps>(({
  onConsultStage,
  onOpenServiceModal,
  stopCount = 8,
  isEmbedded = false,
  externalProgress
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  // Parallax layers
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);

  // SVG Elements
  const pathRef = useRef<SVGPathElement>(null);
  const trailMaskPathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const smoothedAngleRef = useRef<number>(0);
  const applyFlightProgressRef = useRef<((progress: number) => void) | null>(null);

  // Initialized to Stop 01 Camera Anchor with +35px navbar safety clearance
  const cameraStateRef = useRef({
    currentX: -1000 * 0.9 + 1440 / 2,
    currentY: -950 * 0.9 + (900 + 70) / 2,
    targetX: -1000 * 0.9 + 1440 / 2,
    targetY: -950 * 0.9 + (900 + 70) / 2
  });

  const activeCount = Math.max(2, Math.min(8, stopCount));
  const activeConfigs = useMemo(() => FLIGHT_CONFIG.stops.slice(0, activeCount), [activeCount]);
  const activeStages = useMemo(() => JOURNEY_STAGES.slice(0, activeCount), [activeCount]);
  const activePathD = useMemo(() => buildOrganicPathD(activeConfigs), [activeConfigs]);

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
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    // Use default GSAP lag smoothing to absorb frame jitter

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [isReducedMotion]);

  // Continuous Camera Damping (Only for non-embedded standalone mode)
  useEffect(() => {
    if (isReducedMotion || isEmbedded) return;

    const updateCameraTick = () => {
      const cam = cameraStateRef.current;
      const factor = FLIGHT_CONFIG.cameraDamping;

      cam.currentX += (cam.targetX - cam.currentX) * factor;
      cam.currentY += (cam.targetY - cam.currentY) * factor;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleW = vw / 1440;
      const scaleH = (vh - 80) / 620;
      const s = Math.max(0.85, Math.min(1.15, Math.min(scaleW, scaleH)));

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${cam.currentX}px, ${cam.currentY}px, 0) scale(${s})`;
        worldRef.current.style.transformOrigin = '0 0';
      }

      if (farLayerRef.current) {
        farLayerRef.current.style.transform = `translate3d(${cam.currentX * FLIGHT_CONFIG.parallax.far}px, ${cam.currentY * FLIGHT_CONFIG.parallax.far}px, 0) scale(${s})`;
        farLayerRef.current.style.transformOrigin = '0 0';
      }
      if (midLayerRef.current) {
        midLayerRef.current.style.transform = `translate3d(${cam.currentX * FLIGHT_CONFIG.parallax.mid}px, ${cam.currentY * FLIGHT_CONFIG.parallax.mid}px, 0) scale(${s})`;
        midLayerRef.current.style.transformOrigin = '0 0';
      }
    };

    gsap.ticker.add(updateCameraTick);

    return () => {
      gsap.ticker.remove(updateCameraTick);
    };
  }, [isReducedMotion, isEmbedded]);

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

    // Exact cumulative stop distance sampling
    const stopDistances: number[] = [0];
    for (let i = 1; i < activeConfigs.length; i++) {
      const targetPoint = activeConfigs[i].pathPoint;
      let closestDist = (i / totalSegments) * totalPathLen;
      let minDistanceSq = Infinity;

      const startScan = Math.max(0, stopDistances[i - 1]);
      const endScan = totalPathLen;
      const step = 20;

      for (let d = startScan; d <= endScan; d += step) {
        const pt = pathEl.getPointAtLength(d);
        const dx = pt.x - targetPoint[0];
        const dy = pt.y - targetPoint[1];
        const dSq = dx * dx + dy * dy;
        if (dSq < minDistanceSq) {
          minDistanceSq = dSq;
          closestDist = d;
        }
      }

      const fineStart = Math.max(0, closestDist - 25);
      const fineEnd = Math.min(totalPathLen, closestDist + 25);
      for (let d = fineStart; d <= fineEnd; d += 1) {
        const pt = pathEl.getPointAtLength(d);
        const dx = pt.x - targetPoint[0];
        const dy = pt.y - targetPoint[1];
        const dSq = dx * dx + dy * dy;
        if (dSq < minDistanceSq) {
          minDistanceSq = dSq;
          closestDist = d;
        }
      }
      stopDistances.push(closestDist);
    }
    stopDistances[stopDistances.length - 1] = totalPathLen;

    // Set initial plane position & correct orientation immediately on mount
    const pt0 = pathEl.getPointAtLength(0);
    const ptAhead0 = pathEl.getPointAtLength(Math.min(totalPathLen, 15));
    const initDeg = Math.atan2(ptAhead0.y - pt0.y, ptAhead0.x - pt0.x) * (180 / Math.PI) + 90;
    smoothedAngleRef.current = initDeg;
    if (planeRef.current) {
      planeRef.current.setAttribute(
        'transform',
        `translate(${pt0.x}, ${pt0.y}) rotate(${initDeg})`
      );
    }

    const getScaleFactor = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleW = vw / 1440;
      const scaleH = (vh - 80) / 620;
      return Math.max(0.85, Math.min(1.15, Math.min(scaleW, scaleH)));
    };

    let scaleFactor = getScaleFactor();

    const applyFlightProgress = (rawScroll: number) => {
      const startHold = 0.04;
      const endHold = 0.06;
      const dwellRatio = 0.20;

      let segIdx = 0;
      let localFlight = 0;

      if (rawScroll <= startHold) {
        segIdx = 0;
        localFlight = 0;
      } else if (rawScroll >= 1.0 - endHold) {
        segIdx = totalSegments - 1;
        localFlight = 1;
      } else {
        const effectiveScroll = (rawScroll - startHold) / (1.0 - startHold - endHold);
        const scaled = effectiveScroll * totalSegments;
        segIdx = Math.min(totalSegments - 1, Math.max(0, Math.floor(scaled)));
        const tau = Math.max(0, Math.min(1, scaled - segIdx));

        if (tau < dwellRatio) {
          localFlight = 0;
        } else if (tau > 1 - dwellRatio) {
          localFlight = 1;
        } else {
          localFlight = smootherstep(dwellRatio, 1 - dwellRatio, tau);
        }
      }

      const dStart = stopDistances[segIdx] || 0;
      const dEnd = stopDistances[segIdx + 1] || totalPathLen;
      const currentDist = dStart + (dEnd - dStart) * localFlight;

      // Trail Progressive Reveal: strictly behind plane
      if (trailMaskPathRef.current) {
        const revealedLen = Math.max(0, Math.min(totalPathLen, currentDist));
        trailMaskPathRef.current.style.strokeDashoffset = `${totalPathLen - revealedLen}`;
      }

      // Sample plane position & banking angle with +90 deg offset
      const pt = pathEl.getPointAtLength(currentDist);
      const lookAheadDist = Math.min(totalPathLen, currentDist + 12);
      const lookBehindDist = Math.max(0, currentDist - 12);
      const ptAhead = pathEl.getPointAtLength(lookAheadDist);
      const ptBehind = pathEl.getPointAtLength(lookBehindDist);

      const dx = ptAhead.x - ptBehind.x;
      const dy = ptAhead.y - ptBehind.y;
      const targetDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      const deltaDeg = shortestAngleDelta(targetDeg, smoothedAngleRef.current);
      smoothedAngleRef.current += deltaDeg * FLIGHT_CONFIG.plane.rotationLerp;

      if (planeRef.current) {
        planeRef.current.setAttribute(
          'transform',
          `translate(${pt.x}, ${pt.y}) rotate(${smoothedAngleRef.current})`
        );
      }

      // Camera Lockstep Interpolation
      const currStop = activeConfigs[segIdx];
      const nextStop = activeConfigs[Math.min(activeConfigs.length - 1, segIdx + 1)];

      const anchorX = currStop.cameraAnchor[0] + (nextStop.cameraAnchor[0] - currStop.cameraAnchor[0]) * localFlight;
      const anchorY = currStop.cameraAnchor[1] + (nextStop.cameraAnchor[1] - currStop.cameraAnchor[1]) * localFlight;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // +70px vertical offset ensures comfortable clearance below floating nav
      const topNavOffset = 70;
      const targetX = -anchorX * scaleFactor + vw / 2;
      const targetY = -anchorY * scaleFactor + (vh + topNavOffset) / 2;

      cameraStateRef.current.targetX = targetX;
      cameraStateRef.current.targetY = targetY;

      // When embedded, update transforms directly for instantaneous 60fps locked response without damping lag
      if (isEmbedded) {
        cameraStateRef.current.currentX = targetX;
        cameraStateRef.current.currentY = targetY;

        if (worldRef.current) {
          worldRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${scaleFactor})`;
          worldRef.current.style.transformOrigin = '0 0';
        }
        if (farLayerRef.current) {
          farLayerRef.current.style.transform = `translate3d(${targetX * FLIGHT_CONFIG.parallax.far}px, ${targetY * FLIGHT_CONFIG.parallax.far}px, 0) scale(${scaleFactor})`;
          farLayerRef.current.style.transformOrigin = '0 0';
        }
        if (midLayerRef.current) {
          midLayerRef.current.style.transform = `translate3d(${targetX * FLIGHT_CONFIG.parallax.mid}px, ${targetY * FLIGHT_CONFIG.parallax.mid}px, 0) scale(${scaleFactor})`;
          midLayerRef.current.style.transformOrigin = '0 0';
        }
      }
    };

    applyFlightProgressRef.current = applyFlightProgress;

    // If initial embedded progress is supplied, immediately evaluate Stop 01
    if (isEmbedded) {
      applyFlightProgress(typeof externalProgress === 'number' ? externalProgress : 0);
      return;
    }

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
        applyFlightProgress(self.progress);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [activeCount, activeConfigs, isReducedMotion, isEmbedded]);

  useImperativeHandle(ref, () => ({
    updateFlight: (p: number) => {
      if (applyFlightProgressRef.current) {
        applyFlightProgressRef.current(p);
      }
    }
  }), []);

  // Synchronize when externalProgress updates in embedded mode
  useEffect(() => {
    if (isEmbedded && typeof externalProgress === 'number' && applyFlightProgressRef.current) {
      applyFlightProgressRef.current(externalProgress);
    }
  }, [isEmbedded, externalProgress]);

  if (isReducedMotion) {
    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-16">
          {activeStages.map((stage) => (
            <div key={stage.id} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-sm font-mono text-[#847445] font-bold">STAGE {stage.number}</div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stage.title}</h3>
              <p className="text-slate-600 mt-2">{stage.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      id={isEmbedded ? undefined : 'journey'}
      ref={containerRef}
      className={isEmbedded ? 'absolute inset-0 w-full h-full overflow-hidden' : 'relative w-full bg-[#FAF8F5] text-[#14181F] overflow-hidden'}
    >
      {/* PINNED VIEWPORT */}
      <div
        ref={pinWrapperRef}
        className={isEmbedded ? 'relative w-full h-full overflow-hidden flex items-center justify-center' : 'relative w-full h-screen overflow-hidden flex items-center justify-center'}
        style={{ contain: 'paint' }}
      >
        {/* ATMOSPHERIC GLOWS (Hardware-accelerated CSS radial gradients - 0 blur cost) */}
        <div
          className="absolute top-1/4 left-1/4 w-[750px] h-[750px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(132, 116, 69, 0.08) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[850px] h-[850px] rounded-full pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(197, 168, 105, 0.10) 0%, transparent 70%)'
          }}
        />

        {/* -------------------------------------------------------------------
            1. FAR LAYER (z-5, Golden Sun, Clouds, Migrating Birds, Hot Air Balloons)
        -------------------------------------------------------------------- */}
        <div
          ref={farLayerRef}
          className="absolute top-0 left-0 pointer-events-none z-5"
          style={{
            width: `${FLIGHT_CONFIG.world.baseW}px`,
            height: `${FLIGHT_CONFIG.world.baseH}px`,
            willChange: 'transform'
          }}
        >
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${FLIGHT_CONFIG.world.baseW} ${FLIGHT_CONFIG.world.baseH}`}
            fill="none"
          >
            <defs>
              {/* Radial gradient for the golden sun */}
              <radialGradient id="sun-glow-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
                <stop offset="40%" stopColor="#F6DF95" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#C5A869" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#C5A869" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sunset-glow-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2D6" stopOpacity="1" />
                <stop offset="45%" stopColor="#E5B262" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#847445" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#847445" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* --- GOLDEN SUN 1 (Between Stop 1 and 2 Transition) --- */}
            <g transform="translate(2500, 1600)">
              {/* Massive Outer Ambient Aura */}
              <circle cx="0" cy="0" r="420" fill="url(#sun-glow-core)" opacity="0.4" />
              {/* Concentric Golden Halo Rings */}
              <circle cx="0" cy="0" r="240" stroke="#C5A869" strokeWidth="1.5" strokeDasharray="6 12" opacity="0.35" />
              <circle cx="0" cy="0" r="150" stroke="#C5A869" strokeWidth="1.5" opacity="0.5" />
              <circle cx="0" cy="0" r="85" fill="#FFE89E" opacity="0.8" />
              <circle cx="0" cy="0" r="65" fill="#FFFFFF" opacity="0.95" />
              {/* Radiant Solar Rays */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={`sun-ray-${deg}`}
                  x1={Math.cos((deg * Math.PI) / 180) * 95}
                  y1={Math.sin((deg * Math.PI) / 180) * 95}
                  x2={Math.cos((deg * Math.PI) / 180) * 190}
                  y2={Math.sin((deg * Math.PI) / 180) * 190}
                  stroke="#C5A869"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.35"
                />
              ))}
            </g>

            {/* --- GOLDEN SUN 2 (Between Stop 5 and 6 Transition) --- */}
            <g transform="translate(2650, 7250)">
              <circle cx="0" cy="0" r="380" fill="url(#sunset-glow-core)" opacity="0.45" />
              <circle cx="0" cy="0" r="210" stroke="#847445" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.35" />
              <circle cx="0" cy="0" r="130" stroke="#C5A869" strokeWidth="1.5" opacity="0.45" />
              <circle cx="0" cy="0" r="75" fill="#FFE294" opacity="0.85" />
              <circle cx="0" cy="0" r="55" fill="#FFFFFF" opacity="0.95" />
            </g>

            {/* Clouds in Far Layer */}
            {SKY_CLOUDS.map((cloud, cIdx) => (
              <g
                key={`far-cloud-${cIdx}`}
                transform={`translate(${cloud.x}, ${cloud.y}) scale(${cloud.scale * 1.1})`}
                opacity={cloud.opacity * 0.75}
              >
                <path
                  d="M 40 90 A 35 35 0 0 1 95 65 A 50 50 0 0 1 175 60 A 40 40 0 0 1 230 85 A 30 30 0 0 1 260 120 A 25 25 0 0 1 245 150 L 35 150 A 25 25 0 0 1 20 125 A 30 30 0 0 1 40 90 Z"
                  fill="rgba(255, 255, 255, 0.75)"
                  stroke="#E6E0D4"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            2. MID LAYER (z-10, Aerodynamic Tailwinds & Drifting Clouds)
        -------------------------------------------------------------------- */}
        <div
          ref={midLayerRef}
          className="absolute top-0 left-0 pointer-events-none z-10"
          style={{
            width: `${FLIGHT_CONFIG.world.baseW}px`,
            height: `${FLIGHT_CONFIG.world.baseH}px`,
            willChange: 'transform'
          }}
        >
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${FLIGHT_CONFIG.world.baseW} ${FLIGHT_CONFIG.world.baseH}`}
            fill="none"
          >
            {/* Mid-layer clouds */}
            {SKY_CLOUDS.filter((_, idx) => idx % 2 === 0).map((cloud, cIdx) => (
              <g
                key={`mid-cloud-${cIdx}`}
                transform={`translate(${cloud.x + 350}, ${cloud.y + 200}) scale(${cloud.scale * 0.85})`}
                opacity={cloud.opacity * 0.9}
              >
                <path
                  d="M 30 70 A 25 25 0 0 1 70 50 A 38 38 0 0 1 130 45 A 30 30 0 0 1 175 65 A 22 22 0 0 1 195 90 L 25 90 A 20 20 0 0 1 30 70 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                  stroke="#DED8CB"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* -------------------------------------------------------------------
            3. WORLD CONTAINER (z-30)
        -------------------------------------------------------------------- */}
        <div
          ref={worldRef}
          className="absolute top-0 left-0 pointer-events-auto z-30"
          style={{
            width: `${FLIGHT_CONFIG.world.baseW}px`,
            height: `${FLIGHT_CONFIG.world.baseH}px`
          }}
        >
          {/* Continuous SVG Flight Path & Paper Plane */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
            viewBox={`0 0 ${FLIGHT_CONFIG.world.baseW} ${FLIGHT_CONFIG.world.baseH}`}
            fill="none"
          >
            <defs>
              <mask id="world-trail-reveal-mask">
                <rect x="-2000" y="-2000" width="12000" height="18000" fill="black" />
                <path
                  ref={trailMaskPathRef}
                  d={activePathD}
                  stroke="white"
                  strokeWidth="54"
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

            {/* Revealed Dotted Trail: strictly behind plane */}
            <path
              d={activePathD}
              stroke="#847445"
              strokeWidth="4"
              strokeDasharray="3 15"
              strokeLinecap="round"
              opacity="0.90"
              fill="none"
              mask="url(#world-trail-reveal-mask)"
            />

            {/* --- 1. TRANSITION WIND SWIRLS --- */}
            {WIND_SWIRLS.map((w, idx) => (
              <g key={`wind-swirl-${idx}`} transform={`translate(${w.x}, ${w.y}) scale(${w.scale}) rotate(${w.rotation})`} opacity={w.opacity}>
                {/* Main Breezy Spiral Loop */}
                <path
                  d="M -140 25 C -70 30, 0 18, 55 -5 C 98 -24, 138 -55, 120 -95 C 104 -128, 62 -120, 56 -90 C 50 -60, 82 -48, 102 -58"
                  fill="none"
                  stroke="#C5A869"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Secondary companion gust curl */}
                <path
                  d="M -105 50 C -50 54, 12 42, 58 20 C 85 5, 112 -16, 102 -42 C 90 -62, 62 -56, 58 -36 C 54 -20, 74 -12, 88 -18"
                  fill="none"
                  stroke="#C5A869"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.75"
                />
                {/* Breeze dash particles */}
                <path d="M -175 20 L -150 21" stroke="#C5A869" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
                <path d="M -135 68 L -110 70" stroke="#C5A869" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </g>
            ))}

            {/* --- 2. TRANSITION BIRD FLOCKS (Crisp V-Formation Silhouettes) --- */}
            {BIRD_FLOCKS.map((b, idx) => (
              <g key={`world-bird-flock-${idx}`} transform={`translate(${b.x}, ${b.y}) scale(${b.scale}) rotate(${b.rotation})`} opacity="0.85">
                {/* Lead bird */}
                <path d="M 0 0 Q 14 -12 28 0 Q 42 -12 56 0" stroke="#847445" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                {/* Wingman right 1 */}
                <path d="M 48 26 Q 60 15 72 26 Q 84 15 96 26" stroke="#847445" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Wingman right 2 */}
                <path d="M 94 52 Q 104 43 114 52 Q 124 43 134 52" stroke="#847445" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
                {/* Wingman left 1 */}
                <path d="M -42 24 Q -30 13 -18 24 Q -6 13 6 24" stroke="#847445" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Wingman left 2 */}
                <path d="M -84 48 Q -74 39 -64 48 Q -54 39 -44 48" stroke="#847445" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
              </g>
            ))}

            {/* --- 3. TRANSITION HOT AIR BALLOONS (Prominent, High Detail) --- */}
            {HOT_AIR_BALLOONS.map((bln, idx) => (
              <g key={`world-balloon-${idx}`} transform={`translate(${bln.x}, ${bln.y}) scale(${bln.scale})`}>
                {/* Soft ground shadow beneath */}
                <ellipse cx="0" cy="65" rx="35" ry="8" fill="rgba(0,0,0,0.08)" />
                {/* Main Balloon Envelope */}
                <path
                  d="M 0 -85 C 55 -85, 55 -15, 20 20 L 12 28 L -12 28 L -20 20 C -55 -15, -55 -85, 0 -85 Z"
                  fill="#FAF8F5"
                  stroke="#847445"
                  strokeWidth="2.5"
                />
                {/* Center Gold Stripe */}
                <path
                  d="M 0 -85 C 18 -85, 18 -15, 6 28 L -6 28 C -18 -15, -18 -85, 0 -85 Z"
                  fill="#C5A869"
                  opacity="0.9"
                />
                {/* Horizontal Accent Band */}
                <path
                  d="M -46 -40 C -15 -35, 15 -35, 46 -40 L 42 -25 C 15 -20, -15 -20, -42 -25 Z"
                  fill="#847445"
                  opacity="0.9"
                />
                {/* Burner & Ropes */}
                <line x1="-12" y1="28" x2="-8" y2="44" stroke="#847445" strokeWidth="1.8" />
                <line x1="12" y1="28" x2="8" y2="44" stroke="#847445" strokeWidth="1.8" />
                <line x1="-4" y1="28" x2="-3" y2="44" stroke="#C5A869" strokeWidth="1.4" />
                <line x1="4" y1="28" x2="3" y2="44" stroke="#C5A869" strokeWidth="1.4" />
                {/* Glowing Burner Flame */}
                <circle cx="0" cy="34" r="4" fill="#E59834" />
                {/* Wicker Passenger Basket */}
                <rect x="-11" y="44" width="22" height="16" rx="3" fill="#D6C4AA" stroke="#847445" strokeWidth="2" />
                <line x1="-11" y1="52" x2="11" y2="52" stroke="#847445" strokeWidth="1" strokeDasharray="3 2" />
              </g>
            ))}

            {/* Checkpoint Radar Beacons (Omitted on Stop 01 for a clean handoff) */}
            {activeConfigs.map((cfg, idx) => {
              if (idx === 0) return null;
              const [px, py] = cfg.pathPoint;
              return (
                <g key={`waypoint-beacon-${idx}`} className="pointer-events-none">
                  <circle
                    cx={px}
                    cy={py}
                    r="65"
                    stroke="#847445"
                    strokeWidth="1.5"
                    strokeDasharray="5 9"
                    opacity="0.28"
                    fill="none"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="40"
                    stroke="#847445"
                    strokeWidth="1.5"
                    opacity="0.40"
                    fill="rgba(255, 255, 255, 0.65)"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="20"
                    stroke="#847445"
                    strokeWidth="2.5"
                    opacity="0.75"
                    fill="#FAF8F5"
                  />
                  <circle
                    cx={px}
                    cy={py}
                    r="6.5"
                    fill="#847445"
                  />
                  <line x1={px - 28} y1={py} x2={px - 10} y2={py} stroke="#847445" strokeWidth="2" />
                  <line x1={px + 10} y1={py} x2={px + 28} y2={py} stroke="#847445" strokeWidth="2" />
                  <line x1={px} y1={py - 28} x2={px} y2={py - 10} stroke="#847445" strokeWidth="2" />
                  <line x1={px} y1={py + 10} x2={px} y2={py + 28} stroke="#847445" strokeWidth="2" />
                </g>
              );
            })}

            {/* Paper Plane (Shared Reusable Component) */}
            <g ref={planeRef} className="pointer-events-none" style={{ willChange: 'transform' }}>
              <PaperPlane scale={FLIGHT_CONFIG.plane.scale} accentColor="#847445" />
            </g>
          </svg>

          {/* EDITORIAL STOP LAYOUTS */}
          {activeConfigs.map((cfg, idx) => {
            const stage = activeStages[idx];
            if (!stage) return null;
            const Stamp = STAMP_ICONS[stage.stampIcon] || Lightbulb;

            return (
              <div
                key={stage.id}
                id={`world-stop-${idx}`}
                className="absolute pointer-events-auto z-20"
                style={{
                  left: 0,
                  top: 0,
                  width: `${FLIGHT_CONFIG.world.baseW}px`,
                  height: `${FLIGHT_CONFIG.world.baseH}px`,
                  opacity: 1
                }}
              >
                {/* Outlined Background Watermark Numeral */}
                <div
                  className="flight-numeral absolute select-none pointer-events-none font-mono font-black text-[280px] leading-none text-transparent z-0"
                  style={{
                    left: `${cfg.textPosition[0] - 40}px`,
                    top: `${cfg.textPosition[1] - 110}px`,
                    WebkitTextStroke: '2.5px rgba(132, 116, 69, 0.16)',
                    opacity: 0.16
                  }}
                >
                  {stage.number}
                </div>

                {/* 1. FLOATING EDITORIAL TEXT COLUMN */}
                <div
                  className="absolute z-10 space-y-3.5"
                  style={{
                    left: `${cfg.textPosition[0]}px`,
                    top: `${cfg.textPosition[1]}px`,
                    width: `${cfg.textWidth}px`
                  }}
                >
                  {/* On Stop 01: The Growth Journey Section Intro */}
                  {idx === 0 && (
                    <div className="pb-4 mb-3 border-b border-[#EAEAEA]">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#847445] font-bold block mb-1.5">
                        STAGE 01 · CONCEPT AIRFIELD
                      </span>
                      <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] text-[#14181F] tracking-tight leading-[1.12]">
                        The Growth Journey
                      </h2>
                      <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                        "From empty plot to expanding brand." Every CYK service appears at the moment in your food business's life when it matters.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-5xl font-black text-[#847445]">
                      {stage.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#847445] flex items-center justify-center shrink-0 border border-[#847445]/30 shadow-md">
                      <Stamp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono tracking-widest text-[#847445] font-bold uppercase block">
                        CYK GROWTH STAGE
                      </span>
                      <h3 className="font-display font-black text-3xl sm:text-4xl text-[#14181F] tracking-tight">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-serif italic text-[#847445] border-l-2 border-[#C5A869] pl-3 py-0.5">
                    "{stage.tagline}"
                  </p>

                  <p className="text-[#14181F]/90 text-sm sm:text-base leading-relaxed font-normal">
                    {stage.description}
                  </p>

                  <div className="pt-1">
                    <div className="inline-flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white border border-[#847445]/20 shadow-xs text-xs sm:text-sm">
                      <span className="font-bold text-slate-900">Services:</span>
                      <span className="text-[#847445] font-semibold">{stage.cykServices.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <ul className="text-xs sm:text-sm text-slate-800 space-y-2">
                      {stage.deliverables.slice(0, 3).map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5 bg-white p-1.5 px-2.5 rounded-xl border border-slate-100 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-[#847445] shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onConsultStage(stage.id)}
                      className="inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-gradient-to-r from-[#847445] to-[#6E6038] hover:from-[#6E6038] hover:to-[#574C2C] text-white text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                    >
                      <span>Consult on {stage.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 2. CASE-STUDY PHOTO CARD */}
                <div
                  className={`absolute z-10 bg-white rounded-3xl p-5 border border-[#E8E2D5] ${cfg.cardShadow} transition-all duration-300 hover:rotate-0 hover:shadow-2xl hover:-translate-y-2`}
                  style={{
                    left: `${cfg.cardPosition[0]}px`,
                    top: `${cfg.cardPosition[1]}px`,
                    width: `${cfg.cardWidth}px`,
                    transform: `rotate(${cfg.cardRotation}deg)`
                  }}
                >
                  <div 
                    className="rounded-2xl overflow-hidden mb-3.5 bg-slate-100 relative group shadow-inner"
                    style={{ height: `${cfg.photoHeight}px` }}
                  >
                    <img
                      src={stage.proofProject.image}
                      alt={stage.proofProject.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900 text-[10px] text-white font-bold uppercase tracking-wider shadow-md border border-white/20">
                      {stage.proofProject.type}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#847445] text-[10px] text-white font-semibold flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#C5A869]" />
                      <span>CONFIRMED PROJECT</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-bold text-base block mb-0.5">{stage.proofProject.name}</strong>
                    {stage.proofProject.caption}
                  </div>

                  {stage.clientQuote && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2.5 bg-[#FAF8F5] p-2.5 rounded-2xl">
                      <Quote className="w-4 h-4 text-[#847445] shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-700 italic leading-relaxed">
                        "{stage.clientQuote.text}"
                        <span className="block not-italic font-bold text-slate-900 mt-0.5">
                          — {stage.clientQuote.author}, <span className="text-[#847445]">{stage.clientQuote.brand}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. AIRPORT RUNWAY CHECKPOINT HUD BADGE (Hidden on Stop 01 to keep clean aesthetic) */}
                {cfg.id !== 0 && (
                  <div
                    className="absolute pointer-events-none z-15 flex flex-col gap-1.5 select-none"
                    style={{
                      left: `${cfg.pathPoint[0] - 110}px`,
                      top: `${cfg.pathPoint[1] + 75}px`,
                      width: '240px'
                    }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#847445]/30 shadow-md text-[11px] font-mono text-[#14181F]">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A869] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#847445]" />
                      </span>
                      <span className="font-bold tracking-wider text-[#847445]">
                        {cfg.fixCode}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-[10px] font-mono text-white/95 tracking-tight flex items-center justify-between shadow-sm">
                      <span className="truncate">{cfg.airportType}</span>
                      <span className="text-[#C5A869] ml-1 shrink-0 font-bold">CHK</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 tracking-wider pl-1 font-semibold uppercase">
                      {cfg.telemetry}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
});

FlightJourney.displayName = 'FlightJourney';
