import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StrokeText } from './StrokeText';

interface HeroProps {
  onStartJourney: () => void;
  onOpenEnquiry: () => void;
}

const TOTAL_FRAMES = 240;

const getFrameSrc = (index: number): string => {
  const padded = String(Math.max(0, Math.min(TOTAL_FRAMES - 1, index))).padStart(3, '0');
  return `./frames/frame_${padded}.webp`;
};

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onOpenEnquiry
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Content layers for each full-screen beat
  const contentHeroRef = useRef<HTMLDivElement>(null);
  const contentConceptRef = useRef<HTMLDivElement>(null);
  const contentLocationRef = useRef<HTMLDivElement>(null);
  const contentMenuRef = useRef<HTMLDivElement>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  // Apple-grade Lerp Physics & Frame Cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isLoopRunningRef = useRef<boolean>(false);

  const metricsRef = useRef<{
    containerTop: number;
    scrollDistance: number;
  }>({
    containerTop: 0,
    scrollDistance: 1
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

      const h = window.innerHeight;
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;
      const scrollDistance = Math.max(1, containerRef.current.offsetHeight - h);

      metricsRef.current = {
        containerTop,
        scrollDistance
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

  // Draw image with object-cover aspect fitting on high-DPI canvas
  const drawCover = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    if (!iw || !ih) return;

    // Calculate aspect cover scale
    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const cx = (cw - nw) / 2;
    const cy = (ch - nh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, cx, cy, nw, nh);
  }, []);

  // Find closest loaded frame (Apple Nearest-Frame Fallback - Zero Flashing Guarantee)
  const getNearestLoadedFrame = useCallback((index: number): HTMLImageElement | null => {
    const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    if (imagesRef.current[target]?.complete && imagesRef.current[target]?.naturalWidth) {
      return imagesRef.current[target];
    }

    // Search outwards in both directions
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = target - offset;
      if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev]?.naturalWidth) {
        return imagesRef.current[prev];
      }
      const next = target + offset;
      if (next < TOTAL_FRAMES && imagesRef.current[next]?.complete && imagesRef.current[next]?.naturalWidth) {
        return imagesRef.current[next];
      }
    }
    return null;
  }, []);

  // Handle canvas sizing for Retina / High-DPI screens
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const best = getNearestLoadedFrame(currentFrameRef.current);
      if (best) drawCover(best);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawCover, getNearestLoadedFrame]);

  // ---------------------------------------------------------------------------
  // APPLE 3-STAGE PROGRESSIVE PRELOADER (0ms blank screen, zero stutter)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const loadSingleFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current[idx]) {
          resolve(imagesRef.current[idx]!);
          return;
        }
        const img = new Image();
        img.src = getFrameSrc(idx);
        img.onload = () => {
          if (!isMounted) return;
          imagesRef.current[idx] = img;
          // If this is the active frame or first frame, draw immediately
          if (idx === 0 && lastDrawnFrameRef.current === -1) {
            drawCover(img);
            lastDrawnFrameRef.current = 0;
          }
          resolve(img);
        };
        img.onerror = () => {
          resolve(img);
        };
      });
    };

    // Stage 1: Load Frame 000 immediately (paints in < 50ms)
    loadSingleFrame(0).then(() => {
      if (!isMounted) return;

      // Stage 2: Load Keyframe Skeleton (every 6th frame) for instant scroll responsiveness
      const skeletonIndices: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i += 6) {
        if (i !== 0) skeletonIndices.push(i);
      }

      Promise.all(skeletonIndices.map(loadSingleFrame)).then(() => {
        if (!isMounted) return;

        // Stage 3: Background stream remaining frames in chunks
        const remainingIndices: number[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (i % 6 !== 0) remainingIndices.push(i);
        }

        let chunkIndex = 0;
        const chunkSize = 12;

        const loadNextChunk = () => {
          if (!isMounted || chunkIndex >= remainingIndices.length) return;
          const chunk = remainingIndices.slice(chunkIndex, chunkIndex + chunkSize);
          chunkIndex += chunkSize;
          Promise.all(chunk.map(loadSingleFrame)).then(() => {
            if ('requestIdleCallback' in window) {
              (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextChunk);
            } else {
              setTimeout(loadNextChunk, 20);
            }
          });
        };

        loadNextChunk();
      });
    });

    return () => {
      isMounted = false;
    };
  }, [drawCover]);

  // ---------------------------------------------------------------------------
  // APPLE LERP RENDER LOOP (Physics inertia with 60–120 FPS hardware acceleration)
  // ---------------------------------------------------------------------------
  const runRenderLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const render = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      // Apple Lerp inertia factor (0.10 gives weighted, expensive fluidity)
      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += diff * 0.10;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastDrawnFrameRef.current) {
        const img = getNearestLoadedFrame(frameToDraw);
        if (img) {
          drawCover(img);
          lastDrawnFrameRef.current = frameToDraw;
        }
      }

      // Continue loop if still catching up to target
      if (Math.abs(targetFrameRef.current - currentFrameRef.current) > 0.02) {
        requestAnimationFrame(render);
      } else {
        isLoopRunningRef.current = false;
      }
    };

    requestAnimationFrame(render);
  }, [drawCover, getNearestLoadedFrame]);

  // ---------------------------------------------------------------------------
  // SCROLL-BOUND ENGINE (Maps scroll progress -> targetFrame & beat overlays)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isReducedMotion) return;

    const onScroll = () => {
      const { containerTop, scrollDistance } = metricsRef.current;
      const scrollY = window.scrollY;
      const progress = Math.min(1, Math.max(0, (scrollY - containerTop) / scrollDistance));

      // Map progress to target frame index [0 .. TOTAL_FRAMES - 1]
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
      runRenderLoop();

      // =====================================================================
      // BEAT 0: RESTING HERO (0.00 -> 0.18)
      // =====================================================================
      if (contentHeroRef.current) {
        if (progress < 0.18) {
          const rel = progress / 0.18;
          contentHeroRef.current.style.opacity = `${1 - rel * 1.3}`;
          contentHeroRef.current.style.transform = `translate3d(0, ${-rel * 45}px, 0)`;
          contentHeroRef.current.style.pointerEvents = rel > 0.5 ? 'none' : 'auto';
        } else {
          contentHeroRef.current.style.opacity = '0';
          contentHeroRef.current.style.pointerEvents = 'none';
        }
      }

      // =====================================================================
      // BEAT 1: FULL-SCREEN "01 / CONCEPT" (0.18 -> 0.44)
      // =====================================================================
      if (contentConceptRef.current) {
        if (progress >= 0.18 && progress < 0.44) {
          const rel = (progress - 0.18) / 0.26;
          let opacity = 0;
          if (rel < 0.22) opacity = rel / 0.22;
          else if (rel <= 0.78) opacity = 1;
          else opacity = (1 - rel) / 0.22;

          const textY = (1 - Math.min(1, rel / 0.25)) * 28;
          contentConceptRef.current.style.opacity = `${opacity}`;
          contentConceptRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
        } else {
          contentConceptRef.current.style.opacity = '0';
        }
      }

      // =====================================================================
      // BEAT 2: FULL-SCREEN "02 / LOCATION & ARCHITECTURE" (0.44 -> 0.72)
      // =====================================================================
      if (contentLocationRef.current) {
        if (progress >= 0.44 && progress < 0.72) {
          const rel = (progress - 0.44) / 0.28;
          let opacity = 0;
          if (rel < 0.22) opacity = rel / 0.22;
          else if (rel <= 0.78) opacity = 1;
          else opacity = (1 - rel) / 0.22;

          const textY = (1 - Math.min(1, rel / 0.25)) * 28;
          contentLocationRef.current.style.opacity = `${opacity}`;
          contentLocationRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
        } else {
          contentLocationRef.current.style.opacity = '0';
        }
      }

      // =====================================================================
      // BEAT 3: FULL-SCREEN "03 / MENU & KITCHEN" (0.72 -> 1.00)
      // =====================================================================
      if (contentMenuRef.current) {
        if (progress >= 0.72 && progress <= 1.0) {
          const rel = (progress - 0.72) / 0.28;
          let opacity = 0;
          if (rel < 0.22) opacity = rel / 0.22;
          else if (rel <= 0.78) opacity = 1;
          else opacity = Math.max(0, (1 - rel) / 0.22);

          const textY = (1 - Math.min(1, rel / 0.25)) * 28;
          contentMenuRef.current.style.opacity = `${opacity}`;
          contentMenuRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
        } else {
          contentMenuRef.current.style.opacity = '0';
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isReducedMotion, runRenderLoop]);

  // Responsive font size calculation for StrokeText based on screen width
  const strokeFontSize = Math.max(30, Math.min(62, Math.round(windowWidth * 0.045)));

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isReducedMotion ? 'min-h-screen' : 'h-[360vh]'} bg-[#121316] text-[#FAF8F5]`}
    >
      {/* Sticky Fullscreen Viewport Stage */}
      <div
        ref={stageRef}
        className={`${isReducedMotion ? 'relative py-28' : 'sticky top-0 h-screen'} w-full overflow-hidden flex flex-col justify-center`}
      >

        {/* =====================================================================
            1. APPLE-STYLE HIGH-DPI GPU CANVAS SCRUBBING ENGINE (240 WebP Frames)
        ====================================================================== */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />
          {/* Deep cinematic vignette scrim for maximum text clarity */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C5A869] font-mono font-bold uppercase tracking-wider w-fit">
              <span>Stage 01</span>
              <span>•</span>
              <span>Blueprint Formulation</span>
            </div>

            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              The Concept.
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C5A869] font-mono font-bold uppercase tracking-wider w-fit">
              <span>Stage 02</span>
              <span>•</span>
              <span>Space Architecture</span>
            </div>

            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              The Space.
            </h2>

            <p className="text-base sm:text-xl lg:text-2xl text-[#FAF8F5]/90 font-light leading-relaxed max-w-2xl drop-shadow">
              Prime real estate sourcing across Delhi NCR, master leasing negotiations & turnkey interior architecture.
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#C5A869] font-mono font-bold uppercase tracking-wider w-fit">
              <span>Stage 03</span>
              <span>•</span>
              <span>Culinary & Kitchen</span>
            </div>

            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] drop-shadow-lg">
              Menu & Kitchen.
            </h2>

            <p className="text-base sm:text-xl lg:text-2xl text-[#FAF8F5]/90 font-light leading-relaxed max-w-2xl drop-shadow">
              Chef-driven recipe R&D, commercial kitchen equipment layouts, recipe costing & kitchen team SOPs.
            </p>
          </div>
        </div>

        {/* =====================================================================
            3. BEAT 0: RESTING HERO CONTENT (Frame 000, On-Screen at Load)
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
