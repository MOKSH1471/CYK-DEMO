import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PaperPlane } from './PaperPlane';
import { FlightJourney, getInitialFlightPlaneScreenPos, FlightJourneyHandle } from './FlightJourney';
import { updateFlightState } from '../utils/flightState';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// =============================================================================
// FIX 1: IN-MEMORY MODULE-LEVEL FLAG (Resets on every page reload / refresh)
// =============================================================================
let hasIntroPlayedInAppSession = false;

interface HeroProps {
  onStartJourney: () => void;
  onOpenEnquiry: () => void;
  onConsultStage?: (stageIndex: number) => void;
  onOpenServiceModal?: (stageIndex: number) => void;
  onIntroComplete?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartJourney,
  onOpenEnquiry,
  onConsultStage,
  onOpenServiceModal,
  onIntroComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const flightWrapperRef = useRef<HTMLDivElement>(null);
  const flightShadowRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const sandBackdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetShadowRef = useRef<HTMLDivElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const wobblyBorderRef = useRef<SVGSVGElement>(null);

  // Overlay elements
  const overlayRef = useRef<HTMLDivElement>(null);
  const folderSurfaceRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const stringGroupRef = useRef<SVGGElement>(null);
  const topTabRef = useRef<SVGGElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  // Hero elements inside sheet
  const cykLettersRef = useRef<HTMLDivElement>(null);
  const headlineMaskRef = useRef<HTMLDivElement>(null);
  const underlinePathRef = useRef<SVGPathElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const planeHeroRef = useRef<HTMLDivElement>(null);
  const tiltPlaneWrapperRef = useRef<HTMLDivElement>(null);
  const travelingPlaneRef = useRef<HTMLDivElement>(null);

  // Direct imperative ref for Flight Journey (No React state re-renders during scroll!)
  const flightJourneyRef = useRef<FlightJourneyHandle>(null);

  // ---------------------------------------------------------------------------
  // FIX 1 INTRO REPLAY LOGIC
  // ---------------------------------------------------------------------------
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    // Dev overrides: ?intro=1 forces intro, ?intro=0 skips intro
    const params = new URLSearchParams(window.location.search);
    const param = params.get('intro');
    if (param === '1') return true;
    if (param === '0') return false;

    // Skip only if already played within this in-memory app session (SPA navigation without reload)
    if (hasIntroPlayedInAppSession) return false;

    // Skip if deep linking via URL hash
    if (window.location.hash) return false;

    // Skip for headless crawlers
    if (navigator.webdriver || /bot|crawler|spider/i.test(navigator.userAgent)) return false;

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    return true;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasFinishedIntroRef = useRef(false);

  // Guarantee that all hero text, stickers, plane, and CTAs are 100% visible
  const ensureHeroContentVisible = useCallback(() => {
    if (cykLettersRef.current?.children) {
      gsap.set(cykLettersRef.current.children, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: (i: number) => [-3.5, 2.5, -2][i] || 0
      });
    }
    if (headlineMaskRef.current) {
      gsap.set(headlineMaskRef.current, { y: 0, opacity: 1 });
    }
    if (underlinePathRef.current) {
      underlinePathRef.current.style.strokeDashoffset = '0';
    }
    if (subtextRef.current) {
      gsap.set(subtextRef.current, { opacity: 1, y: 0 });
    }
    if (ctaGroupRef.current) {
      gsap.set(ctaGroupRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
    }
    if (planeHeroRef.current) {
      gsap.set(planeHeroRef.current, { scale: 1, opacity: 1, y: 0, rotate: 0 });
    }
    if (sheetContentRef.current) {
      sheetContentRef.current.style.opacity = '1';
      sheetContentRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (sheetRef.current) {
      sheetRef.current.style.opacity = '1';
    }
  }, []);

  // Complete & teardown intro
  const finishIntro = useCallback((isImmediate = false) => {
    if (hasFinishedIntroRef.current) return;
    hasFinishedIntroRef.current = true;
    hasIntroPlayedInAppSession = true;
    onIntroComplete?.();

    if (introTimelineRef.current) {
      introTimelineRef.current.kill();
    }

    ensureHeroContentVisible();
    document.body.style.overflow = '';

    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: isImmediate ? 0.15 : 0.45,
        ease: 'power2.out',
        onComplete: () => {
          setIsOverlayActive(false);
          ensureHeroContentVisible();
        }
      });
    } else {
      setIsOverlayActive(false);
      ensureHeroContentVisible();
    }
  }, [ensureHeroContentVisible, onIntroComplete]);

  // If intro is already skipped or inactive on load, notify parent and ensure content is visible
  useEffect(() => {
    if (!isOverlayActive) {
      ensureHeroContentVisible();
      onIntroComplete?.();
    }
  }, [isOverlayActive, ensureHeroContentVisible, onIntroComplete]);

  // Device detection & tilt setup
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      setIsTouchDevice(touch);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Pointer hover tilt (Direct DOM transform - ZERO React re-renders)
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!tiltPlaneWrapperRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      tiltPlaneWrapperRef.current.style.transform = `translate3d(${dx * 16}px, ${dy * 12}px, 0)`;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isTouchDevice]);

  // Folder Intro Animation
  useEffect(() => {
    if (!isOverlayActive) {
      ensureHeroContentVisible();
      return;
    }

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        finishIntro(false);
      }
    });
    introTimelineRef.current = tl;

    // 1. Hold on closed folder with hint fade
    if (hintRef.current) {
      tl.to(hintRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: 'power1.out'
      }, 0.35);
    }

    // 2. String unwinds from top tab & tab rotates off
    if (stringGroupRef.current) {
      tl.to(stringGroupRef.current, {
        opacity: 0,
        y: 40,
        scaleY: 1.2,
        rotation: 10,
        transformOrigin: '150px 200px',
        duration: 0.7,
        ease: 'power2.in'
      }, 0.55);
    }

    if (topTabRef.current) {
      tl.to(topTabRef.current, {
        rotation: -45,
        x: -14,
        y: 8,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.in'
      }, 0.65);
    }

    // 3. Flap folds back past vertical (-175deg)
    if (flapRef.current) {
      tl.to(flapRef.current, {
        rotateX: -175,
        duration: 0.85,
        ease: 'power2.inOut',
        transformOrigin: 'top center'
      }, 1.15);
    }

    // 4. Folder front panel slides down
    if (folderSurfaceRef.current) {
      tl.to(folderSurfaceRef.current, {
        y: '115vh',
        duration: 0.95,
        ease: 'power3.in'
      }, 1.75);
    }

    // 5. C, Y, K sticker letters rise out with friendly bounce
    if (cykLettersRef.current) {
      tl.fromTo(
        cykLettersRef.current.children,
        { y: 50, opacity: 0, scale: 0.75, rotate: (i) => [-15, 12, -10][i] || 0 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: (i) => [-3.5, 2.5, -2][i] || 0,
          stagger: 0.12,
          duration: 0.75,
          ease: 'back.out(1.9)'
        },
        1.95
      );
    }

    // 6. Paper plane slides out of folder, unfolds, and settles into hover
    if (planeHeroRef.current) {
      tl.fromTo(
        planeHeroRef.current,
        { scale: 0.35, opacity: 0, y: 70, rotate: -35 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.85,
          ease: 'back.out(1.6)'
        },
        2.1
      );
    }

    // 7. Headline mask-reveal & underline
    if (headlineMaskRef.current) {
      tl.fromTo(
        headlineMaskRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' },
        2.25
      );
    }

    if (underlinePathRef.current) {
      tl.fromTo(
        underlinePathRef.current,
        { strokeDashoffset: 490 },
        { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' },
        2.55
      );
    }

    // 8. Subtext and CTAs fade in
    if (subtextRef.current) {
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        2.45
      );
    }

    if (ctaGroupRef.current) {
      tl.fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        2.6
      );
    }

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [isOverlayActive, finishIntro]);

  // Skip keyboard/wheel listeners
  useEffect(() => {
    if (!isOverlayActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finishIntro(true);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 8) {
        finishIntro(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && Math.abs(e.touches[0].clientY - touchStartY) > 12) {
        finishIntro(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOverlayActive, finishIntro]);

  // Safety watchdog: Never trap the user
  useEffect(() => {
    if (!isOverlayActive) return;
    const safetyTimer = setTimeout(() => {
      finishIntro(true);
    }, 5500);
    return () => clearTimeout(safetyTimer);
  }, [isOverlayActive, finishIntro]);

  // ---------------------------------------------------------------------------
  // SHARED PINNED SCROLL ENGINE: Hero (180vh) + Flight Journey (1080vh) = 1260vh
  // HIGH-PERFORMANCE: Imperative GPU transforms, cached metrics, ZERO React re-renders!
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !pinWrapperRef.current) return;

    const HERO_PORTION_RATIO = 180 / 1260; // 0.142857 (14.286% of total scroll)

    // Cache metrics and elements once
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let handoffTarget = getInitialFlightPlaneScreenPos(vw, vh);

    const waBtn = document.getElementById('floating-whatsapp');
    const navCta = document.querySelector('.card-nav-cta') as HTMLElement | null;

    let lastPhase: 'hero' | 'flight' = 'hero';
    let lastFlightP = -1;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinWrapperRef.current,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        vw = window.innerWidth;
        vh = window.innerHeight;
        handoffTarget = getInitialFlightPlaneScreenPos(vw, vh);
      },
      onUpdate: (self) => {
        const p = self.progress;

        // =====================================================================
        // PHASE 1: HERO OVERLAY ACTIVE (p <= HERO_PORTION_RATIO)
        // =====================================================================
        if (p <= HERO_PORTION_RATIO) {
          const pHero = Math.min(1, Math.max(0, p / HERO_PORTION_RATIO));

          if (lastPhase !== 'hero') {
            lastPhase = 'hero';
            if (flightWrapperRef.current) {
              flightWrapperRef.current.style.pointerEvents = 'none';
            }
          }

          // Always ensure hero overlay is visible and ready in Phase 1 (Never stuck!)
          if (heroOverlayRef.current) {
            heroOverlayRef.current.style.display = 'flex';
            heroOverlayRef.current.style.pointerEvents = pHero > 0.25 ? 'none' : 'auto';
          }

          // Ensure flight is at 0 (imperative, NO React state!)
          if (lastFlightP !== 0) {
            lastFlightP = 0;
            flightJourneyRef.current?.updateFlight(0);
            updateFlightState(0, false);
          }

          // ===================================================================
          // BEAT 1 (0.00 – 0.25): HERO SHEET DETACHES (Full -> Sheet on Sand)
          // ===================================================================
          if (pHero <= 0.25) {
            const b1 = pHero / 0.25;

            // 1. Hero Sheet Detaches (1.0 -> 0.92, 0 -> -0.8deg)
            if (sheetRef.current) {
              const scale = 1 - b1 * 0.08;
              const rotate = -b1 * 0.8;
              sheetRef.current.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
              sheetRef.current.style.borderRadius = `${b1 * 18}px`;
              sheetRef.current.style.opacity = '1';
            }

            // 2. Pre-baked GPU shadow on Hero sheet (Zero paint cost)
            if (sheetShadowRef.current) {
              const scale = 1 - b1 * 0.08;
              const rotate = -b1 * 0.8;
              sheetShadowRef.current.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
              sheetShadowRef.current.style.borderRadius = `${b1 * 18}px`;
              sheetShadowRef.current.style.opacity = `${b1 * 0.7}`;
            }

            // 3. Sand Backdrop Opacity (0 -> 1)
            if (sandBackdropRef.current) {
              sandBackdropRef.current.style.opacity = `${b1}`;
            }

            // 4. Wobbly Border on Hero Sheet
            if (wobblyBorderRef.current) {
              wobblyBorderRef.current.style.opacity = `${b1}`;
            }

            // 5. Hero Content: Headline & CYK move up and fade out smoothly
            if (sheetContentRef.current) {
              const moveUpY = -b1 * 50;
              sheetContentRef.current.style.transform = `translate3d(0, ${moveUpY}px, 0)`;
              sheetContentRef.current.style.opacity = `${Math.max(0, 1 - b1 * 1.5)}`;
            }

            // 6. Hero CTAs fade out
            if (ctaGroupRef.current) {
              ctaGroupRef.current.style.opacity = `${Math.max(0, 1 - b1 * 1.5)}`;
              ctaGroupRef.current.style.pointerEvents = b1 > 0.2 ? 'none' : 'auto';
            }

            // 7. Flight Journey Sheet Underneath: sits as lower sheet on sand
            if (flightWrapperRef.current) {
              flightWrapperRef.current.style.transform = 'scale(0.94) rotate(0.6deg)';
              flightWrapperRef.current.style.borderRadius = '16px';
            }
            if (flightShadowRef.current) {
              flightShadowRef.current.style.transform = 'scale(0.94) rotate(0.6deg)';
              flightShadowRef.current.style.borderRadius = '16px';
              flightShadowRef.current.style.opacity = `${b1 * 0.6}`;
            }

            // 8. Hero Plane stays in sheet
            if (travelingPlaneRef.current) {
              travelingPlaneRef.current.style.opacity = '0';
            }
            if (planeHeroRef.current) {
              planeHeroRef.current.style.opacity = '1';
            }

            // 9. Nav CTA & Floating WhatsApp fade out
            if (waBtn) {
              waBtn.style.opacity = `${Math.max(0, 1 - b1 * 1.5)}`;
              waBtn.style.pointerEvents = b1 > 0.4 ? 'none' : 'auto';
            }
            if (navCta) {
              navCta.style.opacity = `${Math.max(0, 1 - b1 * 1.5)}`;
              navCta.style.pointerEvents = b1 > 0.4 ? 'none' : 'auto';
            }
          }
          // ===================================================================
          // BEAT 2 (0.25 – 0.65): SHEET TRANSITION (Hero slides up/off, Journey revealed)
          // ===================================================================
          else if (pHero <= 0.65) {
            const b2 = (pHero - 0.25) / 0.40;

            if (sandBackdropRef.current) {
              sandBackdropRef.current.style.opacity = '1';
            }

            // Hero sheet glides UP and away
            if (sheetRef.current) {
              const slideY = -b2 * 125;
              const tilt = -0.8 - b2 * 1.5;
              sheetRef.current.style.transform = `scale(0.92) translate3d(0, ${slideY}vh, 0) rotate(${tilt}deg)`;
              sheetRef.current.style.borderRadius = '18px';
              sheetRef.current.style.opacity = `${Math.max(0, 1 - b2 * 1.8)}`;
            }

            if (sheetShadowRef.current) {
              const slideY = -b2 * 125;
              const tilt = -0.8 - b2 * 1.5;
              sheetShadowRef.current.style.transform = `scale(0.92) translate3d(0, ${slideY}vh, 0) rotate(${tilt}deg)`;
              sheetShadowRef.current.style.opacity = `${Math.max(0, 0.7 * (1 - b2 * 1.8))}`;
            }

            // Journey sheet sits cleanly on sand
            if (flightWrapperRef.current) {
              flightWrapperRef.current.style.transform = 'scale(0.94) rotate(0.6deg)';
              flightWrapperRef.current.style.borderRadius = '16px';
            }
            if (flightShadowRef.current) {
              flightShadowRef.current.style.transform = 'scale(0.94) rotate(0.6deg)';
              flightShadowRef.current.style.opacity = '0.6';
            }

            // Traveling plane glides across sand toward Stop 01
            if (planeHeroRef.current) {
              planeHeroRef.current.style.opacity = '0';
            }
            if (travelingPlaneRef.current) {
              travelingPlaneRef.current.style.opacity = '1';

              const startX = vw * 0.70;
              const startY = vh * 0.50;
              const currentX = startX + (handoffTarget.screenX - startX) * b2;
              const currentY = startY + (handoffTarget.screenY - startY) * b2;
              const currentRot = 0 + (handoffTarget.rotation - 0) * b2;

              travelingPlaneRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRot}deg)`;
            }
          }
          // ===================================================================
          // BEAT 3 (0.65 – 1.00): REVERSE ATTACH (Journey sheet attaches: Sheet -> Full)
          // ===================================================================
          else {
            const b3 = (pHero - 0.65) / 0.35;

            // Hero sheet is offscreen above viewport at opacity 0 (Never breaks scroll-up!)
            if (sheetRef.current) {
              sheetRef.current.style.transform = 'scale(0.92) translate3d(0, -125vh, 0) rotate(-2.3deg)';
              sheetRef.current.style.opacity = '0';
            }
            if (sheetShadowRef.current) {
              sheetShadowRef.current.style.opacity = '0';
            }

            // Journey sheet expands 0.94 -> 1.0, straightens 0.6deg -> 0deg, radius 16px -> 0px
            if (flightWrapperRef.current) {
              const currentScale = 0.94 + b3 * 0.06;
              const currentRot = 0.6 * (1 - b3);
              const currentRadius = 16 * (1 - b3);

              flightWrapperRef.current.style.transform = b3 >= 0.999 ? 'none' : `scale(${currentScale}) rotate(${currentRot}deg)`;
              flightWrapperRef.current.style.borderRadius = `${currentRadius}px`;
            }

            if (flightShadowRef.current) {
              const currentScale = 0.94 + b3 * 0.06;
              const currentRot = 0.6 * (1 - b3);
              const currentRadius = 16 * (1 - b3);
              flightShadowRef.current.style.transform = b3 >= 0.999 ? 'none' : `scale(${currentScale}) rotate(${currentRot}deg)`;
              flightShadowRef.current.style.borderRadius = `${currentRadius}px`;
              flightShadowRef.current.style.opacity = `${0.6 * (1 - b3)}`;
            }

            if (sandBackdropRef.current) {
              sandBackdropRef.current.style.opacity = `${1 - b3}`;
            }

            if (travelingPlaneRef.current) {
              travelingPlaneRef.current.style.opacity = '1';
              travelingPlaneRef.current.style.transform = `translate3d(${handoffTarget.screenX}px, ${handoffTarget.screenY}px, 0) rotate(${handoffTarget.rotation}deg)`;
            }
          }
        }
        // =====================================================================
        // PHASE 2: FLIGHT JOURNEY SCROLL (p > HERO_PORTION_RATIO)
        // =====================================================================
        else {
          const pFlight = Math.min(1, Math.max(0, (p - HERO_PORTION_RATIO) / (1 - HERO_PORTION_RATIO)));

          if (lastPhase !== 'flight') {
            lastPhase = 'flight';

            if (heroOverlayRef.current) {
              heroOverlayRef.current.style.display = 'none';
              heroOverlayRef.current.style.pointerEvents = 'none';
            }

            if (flightWrapperRef.current) {
              flightWrapperRef.current.style.pointerEvents = 'auto';
              flightWrapperRef.current.style.transform = 'none';
              flightWrapperRef.current.style.borderRadius = '0px';
            }

            if (flightShadowRef.current) {
              flightShadowRef.current.style.opacity = '0';
            }

            if (sandBackdropRef.current) {
              sandBackdropRef.current.style.opacity = '0';
            }

            if (travelingPlaneRef.current) {
              travelingPlaneRef.current.style.opacity = '0';
            }
          }

          // Direct imperative flight update (NO React setState!)
          lastFlightP = pFlight;
          flightJourneyRef.current?.updateFlight(pFlight);
          updateFlightState(pFlight, pFlight > 0.01 && pFlight < 0.99);

          // Nav CTA and WhatsApp re-appear smoothly
          if (waBtn) {
            const waAlpha = Math.min(1, Math.max(0, (pFlight - 0.05) * 5));
            waBtn.style.opacity = `${waAlpha}`;
            waBtn.style.pointerEvents = waAlpha > 0.5 ? 'auto' : 'none';
          }
          if (navCta) {
            const navAlpha = Math.min(1, Math.max(0, (pFlight - 0.05) * 5));
            navCta.style.opacity = `${navAlpha}`;
            navCta.style.pointerEvents = navAlpha > 0.5 ? 'auto' : 'none';
          }
        }
      }
    });

    return () => {
      st.kill();
      // Restore external components
      const waBtn = document.getElementById('floating-whatsapp');
      if (waBtn) {
        waBtn.style.opacity = '1';
        waBtn.style.pointerEvents = 'auto';
      }
      const navCta = document.querySelector('.card-nav-cta') as HTMLElement | null;
      if (navCta) {
        navCta.style.opacity = '1';
        navCta.style.pointerEvents = 'auto';
      }
    };
  }, []);

  return (
    <>
      {/* =======================================================================
          SCENE 1: FULL-SCREEN KRAFT DOCUMENT FOLDER OPENING OVERLAY
      ======================================================================== */}
      {isOverlayActive && (
        <aside
          ref={overlayRef}
          id="kraft-intro-overlay"
          aria-label="CYK Hospitalities Dossier"
          className="fixed inset-0 w-full h-[100svh] z-[200] overflow-hidden bg-[#FAF8F5] select-none"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 45%'
          }}
        >
          <div
            ref={folderSurfaceRef}
            className="relative w-[106vw] h-[106svh] -top-[3svh] -left-[3vw] flex flex-col justify-between overflow-hidden will-change-transform"
            style={{
              background: 'linear-gradient(145deg, #CBB08E 0%, #C49E74 35%, #B98B5E 75%, #AC7C4F 100%)',
              transform: isMobile ? 'none' : 'rotateX(5deg) rotateZ(-1deg)',
              transformStyle: 'preserve-3d',
              boxShadow: 'inset 0 0 100px rgba(50, 25, 10, 0.35)'
            }}
          >
            {/* Kraft Paper Fibres & Specks (Pure GPU CSS - 0 CPU calculation) */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-multiply z-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #7A522C 1px, transparent 1px), radial-gradient(circle at 20% 30%, #5C3C22 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px, 48px 48px'
              }}
            />

            {/* TOP FLAP */}
            <div
              ref={flapRef}
              className="relative w-full h-[40svh] z-20 will-change-transform"
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d'
              }}
            >
              <svg
                viewBox="0 0 1440 400"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path
                  d="M 0 0 L 1440 0 L 1440 280 C 1200 300, 960 380, 720 380 C 480 380, 240 300, 0 280 Z"
                  fill="url(#flap-gradient)"
                />
                <path
                  d="M 0 279 C 240 299, 480 379, 720 379 C 960 379, 1200 299, 1440 279"
                  fill="none"
                  stroke="#8B5E34"
                  strokeWidth="2.5"
                  opacity="0.65"
                />
                <defs>
                  <linearGradient id="flap-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C49E74" />
                    <stop offset="60%" stopColor="#B68759" />
                    <stop offset="100%" stopColor="#A87748" />
                  </linearGradient>
                </defs>
              </svg>

              {/* FIGURE-EIGHT STRING & EYELET TABS */}
              <div className="absolute top-[380px] -translate-y-1/2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <svg
                  width="180"
                  height="260"
                  viewBox="0 0 180 260"
                  className="overflow-visible"
                >
                  <g ref={topTabRef} transform="translate(90, 60)">
                    <circle cx="0" cy="0" r="28" fill="#B08355" stroke="#7A522C" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="14" fill="#D4AF37" stroke="#684518" strokeWidth="2" />
                    <circle cx="0" cy="0" r="7" fill="#1C120A" />
                  </g>

                  <g transform="translate(90, 200)">
                    <circle cx="0" cy="0" r="28" fill="#B08355" stroke="#7A522C" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="14" fill="#D4AF37" stroke="#684518" strokeWidth="2" />
                    <circle cx="0" cy="0" r="7" fill="#1C120A" />
                  </g>

                  <g ref={stringGroupRef}>
                    <path
                      d="M 90 60 C 130 60, 145 130, 90 130 C 35 130, 50 200, 90 200 C 135 200, 150 130, 90 130 C 30 130, 45 60, 90 60"
                      fill="none"
                      stroke="#22170E"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 90 200 Q 120 230, 145 255"
                      fill="none"
                      stroke="#22170E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* FOLDER BODY / BOTTOM PANEL */}
            <div className="relative w-full px-8 pb-12 flex items-end justify-between z-10">
              <div
                ref={hintRef}
                className="text-xs sm:text-sm font-mono tracking-widest text-[#4A321E]/80 italic uppercase select-none animate-pulse"
              >
                Opening dossier...
              </div>

              <div className="flex flex-col items-end">
                <div className="border-2 border-dashed border-[#5C3C22]/60 px-3.5 py-1.5 rounded-lg text-right transform rotate-1">
                  <div className="text-[11px] font-mono font-bold tracking-widest text-[#3D2411] uppercase">
                    CYK · DOSSIER · 2026
                  </div>
                  <div className="text-[9px] font-mono tracking-wider text-[#5C3C22] uppercase">
                    CONFIDENTIAL FOOD VENTURES
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Lip Fold Line */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#8C6239]/80 shadow-[0_-3px_8px_rgba(0,0,0,0.25)]" />
          </div>
        </aside>
      )}

      {/* =======================================================================
          MASTER COMBINED PINNED VIEWPORT: Hero + Flight Journey
          Length: 1360vh (180vh Hero + 1080vh Flight + 100vh Sticky Viewport)
      ======================================================================== */}
      <div
        id="journey"
        ref={containerRef}
        className="relative w-full h-[1360vh] bg-[#FAF8F5]"
      >
        <div
          ref={pinWrapperRef}
          className="relative w-full h-screen overflow-hidden bg-[#FAF8F5]"
        >
          {/* -------------------------------------------------------------------
              LAYER 0 (BOTTOM): SAND BACKDROP
              Warm sand surface behind both sheets. Fades in during Beat 1 and out in Beat 3.
          -------------------------------------------------------------------- */}
          <div
            ref={sandBackdropRef}
            className="absolute inset-0 bg-[#EFE7D6] pointer-events-none transition-opacity duration-100 z-0"
            style={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#847445 0.75px, transparent 0.75px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* Pre-baked GPU shadow for the Flight Journey sheet (Zero paint cost) */}
          <div
            ref={flightShadowRef}
            className="absolute inset-0 pointer-events-none opacity-0 will-change-transform z-5"
            style={{
              boxShadow: '0 30px 60px -15px rgba(60, 45, 20, 0.32), 0 12px 25px -10px rgba(60, 45, 20, 0.18)',
              transformOrigin: 'center center'
            }}
          />

          {/* -------------------------------------------------------------------
              LAYER 10: THE LIVE FLIGHT JOURNEY CAMERA WORLD
              Sitting as the lower document sheet on the sand backdrop.
              Attaches in reverse during Beat 3 (0.94 -> 1.0, 0.6deg -> 0deg).
          -------------------------------------------------------------------- */}
          <div
            ref={flightWrapperRef}
            className="absolute inset-0 w-full h-full z-10 overflow-hidden pointer-events-none bg-[#FAF8F5] will-change-transform"
            style={{ isolation: 'isolate', transformOrigin: 'center center', contain: 'paint' }}
          >
            <FlightJourney
              ref={flightJourneyRef}
              isEmbedded={true}
              onConsultStage={onConsultStage || (() => {})}
              onOpenServiceModal={onOpenServiceModal || (() => {})}
              stopCount={8}
            />
          </div>

          {/* Traveling Plane during Hero Beat 2/3 handoff */}
          <div
            ref={travelingPlaneRef}
            className="absolute top-0 left-0 z-20 pointer-events-none opacity-0 will-change-transform"
            style={{ transformOrigin: 'center center' }}
          >
            <PaperPlane
              scale={0.52}
              accentColor="#847445"
              beaconColor="#C5A869"
              showShadow={true}
              showBeacon={true}
            />
          </div>

          {/* -------------------------------------------------------------------
              LAYER 30 (TOP): THE HERO SHEET OVERLAY
              Lifts and glides up/away out of the viewport during Beat 2.
          -------------------------------------------------------------------- */}
          <div
            ref={heroOverlayRef}
            className="absolute inset-0 w-full h-full z-30 overflow-hidden flex items-center justify-center will-change-transform bg-transparent pointer-events-auto"
          >
            {/* Pre-baked GPU shadow for the Hero sheet */}
            <div
              ref={sheetShadowRef}
              className="absolute inset-0 max-w-7xl mx-auto rounded-2xl pointer-events-none opacity-0 will-change-transform z-5"
              style={{
                boxShadow: '0 30px 60px -15px rgba(60, 45, 20, 0.35), 0 12px 25px -10px rgba(60, 45, 20, 0.20)',
                transformOrigin: 'center center'
              }}
            />

            {/* THE PAPER SHEET CONTAINER */}
            <div
              ref={sheetRef}
              className="relative w-full h-full max-w-7xl mx-auto bg-[#FAF8F5] overflow-hidden will-change-transform flex flex-col justify-center px-6 sm:px-12 lg:px-16 pt-24 sm:pt-28 pb-12 z-10"
              style={{
                transformOrigin: 'center center'
              }}
            >
              {/* Hand-Drawn Wobbly Olive-Gold SVG Border */}
              <svg
                ref={wobblyBorderRef}
                viewBox="0 0 1200 800"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-0 transition-opacity duration-200"
                aria-hidden="true"
              >
                <path
                  d="M 15 15 Q 300 12, 600 16 Q 900 13, 1185 15 Q 1188 200, 1184 400 Q 1187 600, 1185 785 Q 900 788, 600 784 Q 300 787, 15 785 Q 12 600, 16 400 Q 13 200, 15 15 Z"
                  fill="none"
                  stroke="#847445"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.75"
                />
              </svg>

              {/* SHEET CONTENT WRAPPER */}
              <div
                ref={sheetContentRef}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center will-change-transform"
              >
                {/* Left Column: Lettering, Headline, CTAs */}
                <div className="lg:col-span-7 space-y-6">

                  {/* A. STICKER-CUT 'C Y K' DISPLAY MARK */}
                  <div
                    ref={cykLettersRef}
                    className="flex items-center gap-2.5 sm:gap-3.5 select-none"
                    aria-label="CYK Hospitalities"
                  >
                    {/* STICKER 'C' */}
                    <div
                      className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-[#847445] text-[#FAF8F5] font-black text-3xl sm:text-4xl shadow-md border-[3.5px] border-[#FFFDF8] will-change-transform"
                      style={{
                        fontFamily: "'Fredoka', 'Outfit', sans-serif",
                        transform: 'rotate(-3.5deg)',
                        boxShadow: '0 8px 18px rgba(60, 45, 20, 0.20), 0 3px 6px rgba(45, 25, 10, 0.14)'
                      }}
                    >
                      <div className="absolute inset-1.5 rounded-xl border border-dashed border-[#FAF8F5]/65 pointer-events-none" />
                      <span className="relative z-10 drop-shadow-xs">C</span>
                    </div>

                    {/* STICKER 'Y' */}
                    <div
                      className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-[#C8A27A] text-[#1C120A] font-black text-3xl sm:text-4xl shadow-md border-[3.5px] border-[#FFFDF8] will-change-transform"
                      style={{
                        fontFamily: "'Fredoka', 'Outfit', sans-serif",
                        transform: 'rotate(2.5deg)',
                        boxShadow: '0 8px 18px rgba(60, 45, 20, 0.20), 0 3px 6px rgba(45, 25, 10, 0.14)'
                      }}
                    >
                      <div className="absolute inset-1.5 rounded-xl border border-dashed border-[#1C120A]/40 pointer-events-none" />
                      <span className="relative z-10 drop-shadow-xs">Y</span>
                    </div>

                    {/* STICKER 'K' */}
                    <div
                      className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-[#C5A869] text-[#FAF8F5] font-black text-3xl sm:text-4xl shadow-md border-[3.5px] border-[#FFFDF8] will-change-transform"
                      style={{
                        fontFamily: "'Fredoka', 'Outfit', sans-serif",
                        transform: 'rotate(-2deg)',
                        boxShadow: '0 8px 18px rgba(60, 45, 20, 0.20), 0 3px 6px rgba(45, 25, 10, 0.14)'
                      }}
                    >
                      <div className="absolute inset-1.5 rounded-xl border border-dashed border-[#FAF8F5]/65 pointer-events-none" />
                      <span className="relative z-10 drop-shadow-xs">K</span>

                      {/* Gold Plane Stamp Accent */}
                      <span
                        title="CYK Aviation Stamp"
                        className="absolute -top-2 -right-2.5 text-[11px] bg-[#847445] text-white p-0.5 px-1.5 rounded-full shadow-sm font-sans flex items-center justify-center"
                      >
                        ✈
                      </span>
                    </div>

                    <div className="ml-2 flex flex-col">
                      <span className="text-[10px] font-mono tracking-widest text-[#847445] uppercase font-bold">
                        Hospitalities
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">
                        Est. Gurugram
                      </span>
                    </div>
                  </div>

                  {/* B. HEADLINE WITH PALE-GOLD UNDERLINE */}
                  <div ref={headlineMaskRef} className="overflow-hidden space-y-3">
                    <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#14181F] tracking-tight leading-[1.12]">
                      We build food businesses from scratch,{' '}
                      <span className="relative inline-block whitespace-nowrap text-[#847445]">
                        and stay until they scale.
                        <svg
                          viewBox="0 0 490 20"
                          className="absolute -bottom-2 left-0 w-full h-4 overflow-visible pointer-events-none"
                          aria-hidden="true"
                        >
                          <path
                            ref={underlinePathRef}
                            d="M 2 10 Q 120 4, 245 8 Q 370 12, 488 6"
                            fill="none"
                            stroke="#C5A869"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeDasharray="490"
                            strokeDashoffset="490"
                          />
                        </svg>
                      </span>
                    </h1>
                  </div>

                  {/* Supporting Copy */}
                  <p
                    ref={subtextRef}
                    className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed font-normal max-w-xl"
                  >
                    From concept, location, menu, kitchen, interiors, hiring, marketing, and franchising.
                  </p>

                  {/* C. CTAs */}
                  <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4 pt-2 transition-opacity duration-200">
                    <button
                      onClick={onStartJourney}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer group"
                    >
                      <span>Start your project</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={onOpenEnquiry}
                      className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white/80 hover:bg-white text-[#14181F] hover:text-[#847445] border border-[#EAEAEA] hover:border-[#847445]/40 font-semibold text-sm sm:text-base transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98]"
                    >
                      Talk to us
                    </button>
                  </div>

                </div>

                {/* Right Column: Signature Paper Plane & Flight Line */}
                <div
                  ref={planeHeroRef}
                  className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] sm:min-h-[420px]"
                >
                  <svg
                    viewBox="0 0 500 500"
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M 250 250 C 290 290, 370 380, 430 520 C 460 590, 460 670, 450 760"
                      fill="none"
                      stroke="#847445"
                      strokeWidth="3.2"
                      strokeDasharray="3 15"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>

                  <div
                    ref={tiltPlaneWrapperRef}
                    className="relative transition-transform duration-300 ease-out will-change-transform"
                  >
                    <div className="hero-plane-bob">
                      <PaperPlane
                        scale={0.58}
                        accentColor="#847445"
                        beaconColor="#C5A869"
                        showShadow={true}
                        showBeacon={true}
                      />
                    </div>
                  </div>

                  <style>{`
                    @keyframes heroPlaneGentleBob {
                      0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                      }
                      50% {
                        transform: translateY(-8px) rotate(-1.5deg);
                      }
                    }
                    .hero-plane-bob {
                      animation: heroPlaneGentleBob 4.2s ease-in-out infinite;
                    }
                  `}</style>
                </div>

              </div>

              {/* Scroll Cue Line */}
              <button
                onClick={onStartJourney}
                aria-label="Scroll to Growth Journey"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-xs text-[#847445] font-mono tracking-widest font-semibold hover:text-[#6E6038] transition-colors cursor-pointer group select-none z-20"
              >
                <span className="uppercase text-[10px] tracking-wider">The Journey Begins</span>
                <div className="w-4 h-7 rounded-full border border-[#847445]/40 flex items-start justify-center p-1">
                  <div className="w-1 h-2 rounded-full bg-[#847445] animate-bounce" />
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Hero;
