import React, { useEffect, useRef, useState } from 'react';
import { JOURNEY_STAGES, CONFIRMED_CITIES } from '../data/mockData';
import { 
  Lightbulb, Calculator, MapPin, Utensils, Palette, ChefHat, 
  Megaphone, Store, ArrowRight, Quote
} from 'lucide-react';

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

interface GrowthJourneyProps {
  onConsultStage: (stageIndex: number) => void;
  onOpenServiceModal: (stageIndex: number) => void;
}

interface PathPoint {
  x: number;
  y: number;
  angle: number;
}

export const GrowthJourney: React.FC<GrowthJourneyProps> = ({ 
  onConsultStage,
  onOpenServiceModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const planeSvgRef = useRef<SVGGElement>(null);
  const forkPathRef = useRef<SVGGElement>(null);
  const stageElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // LUT (Lookup table) of precomputed points along path
  const lutRef = useRef<PathPoint[]>([]);
  const pathLengthRef = useRef<number>(0);
  const isReducedMotionRef = useRef<boolean>(false);

  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotionRef.current = mq.matches;
    setIsReducedMotion(mq.matches);

    const onMqChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
      setIsReducedMotion(e.matches);
    };
    mq.addEventListener('change', onMqChange);

    const computeLUT = () => {
      if (!pathRef.current) return;

      try {
        const totalLen = pathRef.current.getTotalLength();
        pathLengthRef.current = totalLen;

        if (maskPathRef.current) {
          maskPathRef.current.style.strokeDasharray = `${totalLen}`;
          maskPathRef.current.style.strokeDashoffset = `${totalLen}`;
        }

        const sampleCount = 800;
        const newLUT: PathPoint[] = [];

        for (let i = 0; i <= sampleCount; i++) {
          const dist = (i / sampleCount) * totalLen;
          const pt = pathRef.current.getPointAtLength(dist);
          
          const prevDist = Math.max(0, dist - 6);
          const nextDist = Math.min(totalLen, dist + 6);
          const ptPrev = pathRef.current.getPointAtLength(prevDist);
          const ptNext = pathRef.current.getPointAtLength(nextDist);

          const dx = ptNext.x - ptPrev.x;
          const dy = ptNext.y - ptPrev.y;
          const rad = Math.atan2(dy, dx);
          const deg = (rad * 180) / Math.PI + 90;

          newLUT.push({ x: pt.x, y: pt.y, angle: deg });
        }

        lutRef.current = newLUT;
      } catch (err) {
        // Fallback
      }
    };

    computeLUT();

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(computeLUT, 150);
    };

    window.addEventListener('resize', handleResize);

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!corridorRef.current || isReducedMotionRef.current) return;

        const corridorRect = corridorRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Accurate scroll tracking: plane stays in sync without lagging
        const startTrigger = windowHeight * 0.55;
        const scrollDistance = startTrigger - corridorRect.top;
        const totalSpan = corridorRect.height - (windowHeight * 0.35);
        const progress = Math.max(0, Math.min(1, scrollDistance / totalSpan));

        // 1. Position plane on the path
        const lut = lutRef.current;
        if (lut.length > 0 && planeSvgRef.current) {
          const idx = Math.min(lut.length - 1, Math.floor(progress * (lut.length - 1)));
          const pt = lut[idx];
          
          planeSvgRef.current.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${pt.angle})`);
          
          if (progress > 0.005 && progress < 0.99) {
            const fadeInOpacity = Math.min(1, (progress - 0.005) * 35);
            planeSvgRef.current.style.opacity = `${fadeInOpacity}`;
          } else {
            planeSvgRef.current.style.opacity = '0';
          }
        }

        // 2. Reveal dotted trail strictly behind the plane
        if (maskPathRef.current && pathLengthRef.current > 0) {
          const offset = pathLengthRef.current * (1 - progress);
          maskPathRef.current.style.strokeDashoffset = `${offset}`;
        }

        // 3. Staggered reveals
        stageElementsRef.current.forEach((el) => {
          if (!el) return;
          const stageRect = el.getBoundingClientRect();
          if (stageRect.top <= windowHeight * 0.82) {
            if (!el.classList.contains('stage-revealed')) {
              el.classList.add('stage-revealed');
            }
          } else {
            if (el.classList.contains('stage-revealed')) {
              el.classList.remove('stage-revealed');
            }
          }
        });

        // 4. Reveal fork at Stage 08
        if (forkPathRef.current) {
          if (progress >= 0.93) {
            forkPathRef.current.style.opacity = '1';
          } else {
            forkPathRef.current.style.opacity = '0';
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onMqChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section 
      id="journey" 
      ref={containerRef}
      className="relative py-20 bg-white text-[#14181F] overflow-hidden"
    >
      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 z-20">
        <div className="pb-8 border-b border-[#EAEAEA] max-w-3xl">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14181F] tracking-tight">
            The Growth Journey
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            "From empty plot to expanding brand." Every CYK service appears at the moment in your food business's life when it matters.
          </p>
        </div>
      </div>

      {/* FLIGHT CORRIDOR WRAPPER */}
      <div ref={corridorRef} className="relative">
        
        {/* SVG Canvas for Trail, Clouds and Moving Plane (Centered directly in flight corridor) */}
        {!isReducedMotion && (
          <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1000 3450" 
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <mask id="plane-trail-mask">
                  <path
                    ref={maskPathRef}
                    d="M 500 80
                       C 420 220, 410 320, 500 440
                       C 590 560, 580 700, 500 820
                       C 410 940, 420 1080, 500 1200
                       C 590 1320, 580 1460, 500 1580
                       C 410 1700, 420 1840, 500 1960
                       C 590 2080, 580 2220, 500 2340
                       C 410 2460, 420 2600, 500 2720
                       C 590 2840, 580 2980, 500 3100
                       L 500 3280"
                    stroke="#FFFFFF"
                    strokeWidth="32"
                    strokeLinecap="round"
                    fill="none"
                  />
                </mask>
              </defs>

              {/* Guide path for sampling */}
              <path
                ref={pathRef}
                d="M 500 80
                   C 420 220, 410 320, 500 440
                   C 590 560, 580 700, 500 820
                   C 410 940, 420 1080, 500 1200
                   C 590 1320, 580 1460, 500 1580
                   C 410 1700, 420 1840, 500 1960
                   C 590 2080, 580 2220, 500 2340
                   C 410 2460, 420 2600, 500 2720
                   C 590 2840, 580 2980, 500 3100
                   L 500 3280"
                stroke="transparent"
                strokeWidth="1"
              />

              {/* CLOUDS IN THE AIRSPACE: Positioned strictly along the center flight path (Never behind photos!) */}
              <g className="clouds-airspace pointer-events-none" opacity="0.85">
                {/* Cloud 1: In the airspace between Stage 01 and 02 */}
                <g transform="translate(460, 610) scale(0.85)">
                  <path 
                    d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z" 
                    fill="#FFFFFF" 
                    fillOpacity="0.95"
                    stroke="#D9D4C7" 
                    strokeWidth="1.5" 
                    strokeLinejoin="round" 
                  />
                </g>
                {/* Cloud 2: In the airspace between Stage 03 and 04 */}
                <g transform="translate(470, 1370) scale(0.9)">
                  <path 
                    d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z" 
                    fill="#FFFFFF" 
                    fillOpacity="0.95"
                    stroke="#D9D4C7" 
                    strokeWidth="1.5" 
                    strokeLinejoin="round" 
                  />
                </g>
                {/* Cloud 3: In the airspace between Stage 05 and 06 */}
                <g transform="translate(460, 2130) scale(0.85)">
                  <path 
                    d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z" 
                    fill="#FFFFFF" 
                    fillOpacity="0.95"
                    stroke="#D9D4C7" 
                    strokeWidth="1.5" 
                    strokeLinejoin="round" 
                  />
                </g>
                {/* Cloud 4: In the airspace between Stage 07 and 08 */}
                <g transform="translate(470, 2890) scale(0.9)">
                  <path 
                    d="M 20 40 A 15 15 0 0 1 45 25 A 25 25 0 0 1 85 25 A 15 15 0 0 1 110 40 A 12 12 0 0 1 100 55 L 25 55 A 12 12 0 0 1 20 40 Z" 
                    fill="#FFFFFF" 
                    fillOpacity="0.95"
                    stroke="#D9D4C7" 
                    strokeWidth="1.5" 
                    strokeLinejoin="round" 
                  />
                </g>
              </g>

              {/* DOTTED TRAIL ONLY BEHIND THE PLANE IN OFFICIAL LOGO COLOR */}
              <path
                d="M 500 80
                   C 420 220, 410 320, 500 440
                   C 590 560, 580 700, 500 820
                   C 410 940, 420 1080, 500 1200
                   C 590 1320, 580 1460, 500 1580
                   C 410 1700, 420 1840, 500 1960
                   C 590 2080, 580 2220, 500 2340
                   C 410 2460, 420 2600, 500 2720
                   C 590 2840, 580 2980, 500 3100
                   L 500 3280"
                stroke="#847445"
                strokeWidth="3"
                strokeDasharray="1 14"
                strokeLinecap="round"
                fill="none"
                mask="url(#plane-trail-mask)"
              />

              {/* FORK AT THE END IN LOGO COLOR */}
              <g 
                ref={forkPathRef} 
                className="transition-opacity duration-500 ease-out"
                style={{ opacity: 0 }}
              >
                <path d="M 500 3280 C 460 3320, 360 3360, 260 3400" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 3280 C 480 3320, 440 3360, 420 3400" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 3280 C 520 3320, 560 3360, 580 3400" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />
                <path d="M 500 3280 C 540 3320, 640 3360, 740 3400" stroke="#847445" strokeWidth="2.5" strokeDasharray="3 6" strokeLinecap="round" />

                <circle cx="260" cy="3400" r="4" fill="#847445" />
                <circle cx="420" cy="3400" r="4" fill="#847445" />
                <circle cx="580" cy="3400" r="4" fill="#847445" />
                <circle cx="740" cy="3400" r="4" fill="#847445" />
              </g>

              {/* SMALL COMPACT PAPER PLANE WITH LOGO ACCENT */}
              <g 
                ref={planeSvgRef} 
                className="pointer-events-none"
                style={{ opacity: 0, transition: 'opacity 0.2s ease-out' }}
              >
                {/* Pre-rendered subtle shadow */}
                <g transform="translate(2, 4) scale(0.20) translate(-110, -90)" opacity="0.15">
                  <path d="M110 20 L25 140 L110 115 Z" fill="#000000" />
                  <path d="M110 20 L195 140 L110 115 Z" fill="#000000" />
                  <path d="M110 20 L110 160 L102 116 Z" fill="#000000" />
                  <path d="M110 20 L110 160 L118 116 Z" fill="#000000" />
                </g>

                {/* Plane Body */}
                <g transform="scale(0.20) translate(-110, -90)">
                  <path d="M110 20 L25 140 L110 115 Z" fill="#FFFFFF" stroke="#D1C7BA" strokeWidth="2" />
                  <path d="M110 20 L195 140 L110 115 Z" fill="#F8F7F4" stroke="#D1C7BA" strokeWidth="2" />
                  <path d="M110 20 L110 160 L102 116 Z" fill="#E8E4DA" />
                  <path d="M110 20 L110 160 L118 116 Z" fill="#D6D0C2" />
                  <path d="M110 20 L102 45 L118 45 Z" fill="#847445" />
                </g>
              </g>
            </svg>
          </div>
        )}

        {/* 8 STAGES CONTENT STREAM */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          
          <div className="md:hidden absolute top-8 bottom-24 left-6 w-0.5 border-l-2 border-dotted border-[#847445] pointer-events-none" />

          <div className="space-y-20 md:space-y-28">
            {JOURNEY_STAGES.map((stage, index) => {
              const Stamp = STAMP_ICONS[stage.stampIcon] || Lightbulb;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={stage.id}
                  id={`stage-${stage.id}`}
                  ref={(el) => (stageElementsRef.current[index] = el)}
                  className={`relative grid md:grid-cols-12 gap-8 md:gap-14 items-center pl-14 md:pl-0 ${
                    isReducedMotion ? 'stage-revealed' : ''
                  }`}
                >
                  
                  {/* Stage Stamp Center Node on Trail */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-2 md:top-1/2 md:-translate-y-1/2 z-20">
                    <div className="stage-reveal-item stage-item-1 w-12 h-12 rounded-xl bg-white border border-[#EAEAEA] text-[#847445] flex items-center justify-center shadow-sm">
                      <Stamp className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Left/Right Text Column */}
                  <div className={`md:col-span-5 ${isEven ? 'md:order-1' : 'md:order-2 md:col-start-8'}`}>
                    <div className="space-y-3">
                      <div className="stage-reveal-item stage-item-2 flex items-baseline gap-3">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#847445]">
                          {stage.number}
                        </span>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#14181F]">
                          {stage.title}
                        </h3>
                      </div>

                      <p className="stage-reveal-item stage-item-2 text-xs font-serif italic text-slate-500">
                        "{stage.tagline}"
                      </p>

                      <p className="stage-reveal-item stage-item-3 text-slate-600 text-sm leading-relaxed">
                        {stage.description}
                      </p>

                      <div className="stage-reveal-item stage-item-4 pt-1">
                        <div className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Services: </span>
                          <span>{stage.cykServices.join(', ')}</span>
                        </div>
                      </div>

                      <div className="stage-reveal-item stage-item-4 pt-2">
                        <ul className="text-xs text-slate-700 space-y-1">
                          {stage.deliverables.slice(0, 3).map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-1.5">
                              <span className="text-[#847445] font-bold mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="stage-reveal-item stage-item-4 pt-2">
                        <button
                          onClick={() => onConsultStage(stage.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#847445] hover:text-[#6E6038] transition-colors cursor-pointer"
                        >
                          <span>Consult on {stage.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right/Left Single Proof Container */}
                  <div className={`md:col-span-5 ${isEven ? 'md:order-2 md:col-start-8' : 'md:order-1'}`}>
                    <div className="stage-reveal-item stage-item-5 card-border rounded-2xl p-4 shadow-sm overflow-hidden border border-[#EAEAEA]">
                      <div className="h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img 
                          src={stage.proofProject.image} 
                          alt={stage.proofProject.name}
                          loading="lazy"
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900">{stage.proofProject.name}:</strong> {stage.proofProject.caption}
                      </div>

                      {stage.clientQuote && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2">
                          <Quote className="w-3.5 h-3.5 text-[#847445] shrink-0 mt-0.5" />
                          <div className="text-[11px] text-slate-600 italic">
                            "{stage.clientQuote.text}"
                            <span className="block not-italic font-semibold text-slate-800 mt-0.5">
                              — {stage.clientQuote.author}, {stage.clientQuote.brand}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* FORK DESTINATIONS */}
          <div className="mt-20 pt-8 border-t border-[#EAEAEA] max-w-2xl mx-auto text-center relative z-20">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Expansion Hubs (Confirmed Projects)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONFIRMED_CITIES.map((c) => (
                <div key={c.name} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#EAEAEA] text-xs font-semibold text-slate-800 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#847445] shrink-0" />
                  <span className="truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SEPARATE FINAL CTA */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div id="contact" className="mt-24 pt-16 border-t border-[#EAEAEA] text-center max-w-xl mx-auto">
          <h4 className="font-display font-extrabold text-3xl sm:text-4xl text-[#14181F] tracking-tight">
            Tell us what you're building.
          </h4>
          <p className="text-slate-600 text-sm sm:text-base mt-3 mb-8 leading-relaxed">
            From the initial napkin sketch to unit-level profitability and multi-city scale.
          </p>
          <button
            onClick={() => onConsultStage(0)}
            className="px-8 py-3.5 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            Start your project
          </button>
        </div>
      </div>
    </section>
  );
};
