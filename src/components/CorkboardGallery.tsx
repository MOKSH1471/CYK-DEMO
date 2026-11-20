import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface CorkboardPhoto {
  id: string;
  image: string;
  title: string;
  category: string;
  description: string;
  alt: string;
  width: number;
  height: number;
  photoHeight?: number;
  rotation: number;
  tapeColor: 'olive' | 'kraft' | 'paleGold';
  tapeRotation: number;
  doodle?: 'croissant' | 'coffee' | 'chili' | 'steam' | 'sparkle' | 'chefHat' | 'whisk' | 'herbSprig' | 'cocktail' | 'pretzel';
  doodlePosition?: string;
  isMemoCard?: boolean;
  memoNote?: string;
  memoStamp?: string;
}

// Hand-drawn Chef Doodles
const CroissantDoodle: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-[#847445]" }) => (
  <svg viewBox="0 0 48 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M 6 24 C 8 13, 18 6, 24 6 C 30 6, 40 13, 42 24 C 36 26, 32 19, 24 19 C 16 19, 12 26, 6 24 Z"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M 16 11 C 18 15, 19 19, 18 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M 24 6 C 25 11, 25 15, 24 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M 32 11 C 30 15, 29 19, 30 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M 12 18 Q 14 15, 17 17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 31 17 Q 34 15, 36 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CoffeeDoodle: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-[#847445]" }) => (
  <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
    <path
      d="M 10 18 L 13 32 C 14 36, 26 36, 27 32 L 30 18 Z"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="20" cy="18" rx="10" ry="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M 29 21 C 35 21, 35 29, 28 29"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M 7 35 Q 20 38, 33 35"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
    />
    <path
      d="M 16 12 C 15 8, 18 6, 17 3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M 22 11 C 21 7, 24 5, 23 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const ChiliDoodle: React.FC<{ className?: string }> = ({ className = "w-9 h-9 text-[#847445]" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path
      d="M 26 8 C 22 14, 18 26, 8 28 C 14 28, 22 24, 28 12 Z"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 26 8 C 27 5, 30 4, 32 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M 24 10 Q 27 8, 28 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const SteamDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path d="M 10 24 C 8 18, 14 14, 11 8 C 9 4, 12 2, 11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 18 25 C 16 19, 22 15, 19 9 C 17 5, 20 3, 19 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 24 23 C 23 19, 26 16, 24 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SparkleDoodle: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-[#C5A869]" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M 12 2 Q 12 12, 2 12 Q 12 12, 12 22 Q 12 12, 22 12 Q 12 12, 12 2 Z" fill="currentColor" opacity="0.9" />
  </svg>
);

const ChefHatDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path d="M 10 26 L 26 26 L 25 29 L 11 29 Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 10 26 C 6 22, 6 15, 11 13 C 12 8, 17 6, 21 8 C 25 5, 30 8, 30 14 C 33 18, 30 24, 26 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 16 14 C 17 18, 17 22, 16 26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M 21 11 C 21 16, 21 21, 21 26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const WhiskDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path d="M 7 29 L 14 22" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" />
    <path d="M 6 30 L 8 28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="22" cy="14" rx="9" ry="4.5" transform="rotate(-45 22 14)" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="22" cy="14" rx="10" ry="2.2" transform="rotate(-45 22 14)" stroke="currentColor" strokeWidth="1.3" />
    <path d="M 14 22 L 27 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const HerbSprigDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path d="M 8 28 Q 18 18, 28 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M 16 20 C 13 18, 13 13, 17 15 C 19 16, 18 19, 16 20 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M 20 16 C 22 13, 27 13, 25 17 C 24 19, 21 18, 20 16 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M 24 12 C 23 8, 27 7, 28 10 C 28 12, 26 13, 24 12 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M 12 24 C 9 23, 9 19, 13 21 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const CocktailGlassDoodle: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <path d="M 9 10 L 27 10 L 18 20 Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M 18 20 L 18 29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 12 29 L 24 29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 10 7 L 22 19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="16" cy="13" r="2.2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const PretzelDoodle: React.FC<{ className?: string }> = ({ className = "w-9 h-8 text-[#847445]" }) => (
  <svg viewBox="0 0 40 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M 12 22 C 7 19, 6 12, 11 8 C 16 4, 21 9, 20 15 L 20 17 C 19 23, 24 28, 29 24 C 34 20, 33 13, 29 8 C 24 3, 16 3, 11 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M 20 15 C 21 9, 26 4, 31 8 C 36 12, 34 20, 28 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="13" cy="9" r="0.8" fill="currentColor" />
    <circle cx="27" cy="9" r="0.8" fill="currentColor" />
    <circle cx="20" cy="24" r="0.8" fill="currentColor" />
  </svg>
);

export const CORKBOARD_ITEMS: CorkboardPhoto[] = [
  // ROW 1: 6 Items (Only 2 have doodles, well spaced!)
  {
    id: 'risotto',
    image: './images/gallery/gallery-risotto.jpg',
    title: 'Prawn Risotto',
    category: 'Recipe Development & SOP',
    description: 'Arborio emulsion with butter-poached prawns, saffron fumet, and herb oil engineered for high-throughput restaurant kitchens.',
    alt: 'Prawn Risotto recipe formulation developed in CYK test kitchen',
    width: 250,
    height: 168,
    photoHeight: 118,
    rotation: -2.2,
    tapeColor: 'olive',
    tapeRotation: -7
  },
  {
    id: 'croissant',
    image: './images/gallery/gallery-croissant.jpg',
    title: 'Artisan Croissant',
    category: 'Boulangerie Formulation',
    description: '27-layer butter lamination trial with 72-hour cold fermentation for optimal honeycomb crumb structure and oven rise.',
    alt: 'Artisan croissant trial from CYK bakery consultancy lab',
    width: 205,
    height: 178,
    photoHeight: 128,
    rotation: 2.0,
    tapeColor: 'kraft',
    tapeRotation: 10,
    doodle: 'croissant',
    doodlePosition: '-bottom-3 -right-3'
  },
  {
    id: 'memo-1',
    image: '',
    title: 'Culinary Log #84',
    category: 'Standardization Note',
    description: 'Batch trials verify broth emulsification threshold at 92°C with 1.35% salinity curve.',
    alt: 'Chef tasting notes from CYK R&D kitchen',
    width: 215,
    height: 160,
    rotation: -1.2,
    tapeColor: 'paleGold',
    tapeRotation: -5,
    isMemoCard: true,
    memoNote: 'Emulsification at 92°C approved. Salt curve calibrated to 1.35% for regional palette rollout.',
    memoStamp: 'APPROVED · TEST LAB'
  },
  {
    id: 'taco',
    image: './images/gallery/gallery-taco.jpg',
    title: 'Paneer Thecha Taco',
    category: 'Regional Fusion Concept',
    description: 'Smoked cottage cheese glazed with spicy Kolhapuri green chili thecha on warm artisanal corn tortillas.',
    alt: 'Paneer Thecha Taco fusion formulation by CYK',
    width: 255,
    height: 168,
    photoHeight: 118,
    rotation: 2.4,
    tapeColor: 'olive',
    tapeRotation: 8,
    doodle: 'chili',
    doodlePosition: '-bottom-3.5 -right-2'
  },
  {
    id: 'memo-3',
    image: '',
    title: 'Crunch Matrix #05',
    category: 'Texture Analysis',
    description: 'Double-fry starch slurry calibrated at 185°C. Retains audible crispness across 35-min delivery window.',
    alt: 'Texture testing matrix from test kitchen',
    width: 215,
    height: 160,
    rotation: -1.8,
    tapeColor: 'kraft',
    tapeRotation: 7,
    isMemoCard: true,
    memoNote: 'Double-fry starch slurry calibrated at 185°C. Retains audible crispness across 35-min delivery window.',
    memoStamp: 'TEXTURE VERIFIED'
  },
  {
    id: 'corn-chaat',
    image: './images/gallery/gallery-corn-chaat.jpg',
    title: 'Corn Chaat',
    category: 'Contemporary Street Food',
    description: 'Charred sweet corn kernels with spiced pomegranate gel, crispy sev pearls, and tart tamarind foam.',
    alt: 'Contemporary corn chaat plating by CYK Hospitalities',
    width: 250,
    height: 168,
    photoHeight: 118,
    rotation: 1.8,
    tapeColor: 'paleGold',
    tapeRotation: -6,
    doodle: 'herbSprig',
    doodlePosition: '-bottom-2 -left-2'
  },

  // ROW 2: 6 Items (Only 2 have doodles, well spaced!)
  {
    id: 'ramen',
    image: './images/gallery/gallery-ramen.jpg',
    title: 'Craft Ramen',
    category: 'Broth & Noodle Engineering',
    description: '18-hour slow-simmered paitan broth paired with bespoke 38% hydration wavy alkaline noodles.',
    alt: 'Craft Japanese ramen developed in CYK kitchen lab',
    width: 205,
    height: 178,
    photoHeight: 128,
    rotation: -2.5,
    tapeColor: 'kraft',
    tapeRotation: -9
  },
  {
    id: 'memo-2',
    image: '',
    title: 'Boulangerie Sheet #12',
    category: 'Fermentation Parameter',
    description: 'Humidity proofing chamber protocol standardized for multi-unit bakery expansion.',
    alt: 'Bakery formulation parameters sheet',
    width: 215,
    height: 160,
    rotation: 1.5,
    tapeColor: 'kraft',
    tapeRotation: 6,
    doodle: 'whisk',
    doodlePosition: '-bottom-3 -right-2',
    isMemoCard: true,
    memoNote: 'Proofing humidity maintained at 78%. Target oven spring yields +42% volume across test runs.',
    memoStamp: 'LAB BATCH · 2026'
  },
  {
    id: 'falafel',
    image: './images/gallery/gallery-falafel.jpg',
    title: 'Sabudana Falafel',
    category: 'Fasting-Special Innovation',
    description: 'Crispy sago croquettes served over cumin-infused sweet potato hummus with micro-cilantro garnish.',
    alt: 'Sabudana falafel with sweet potato hummus test kitchen formulation',
    width: 205,
    height: 178,
    photoHeight: 128,
    rotation: -1.8,
    tapeColor: 'olive',
    tapeRotation: 11
  },
  {
    id: 'memo-4',
    image: '',
    title: 'Herb Chlorophyll SOP #28',
    category: 'Infusion Protocol',
    description: 'Cold-pressed herb chlorophyll oil stabilized with ascorbic curve for 14-day refrigerated shelf life.',
    alt: 'Herb emulsion protocol sheet',
    width: 215,
    height: 160,
    rotation: -2.0,
    tapeColor: 'olive',
    tapeRotation: -8,
    isMemoCard: true,
    memoNote: 'Cold-pressed herb chlorophyll oil stabilized with ascorbic curve for 14-day refrigerated shelf life.',
    memoStamp: 'SOP VERIFIED'
  },
  {
    id: 'memo-5',
    image: '',
    title: 'Commissary SOP #09',
    category: 'Batch Scaling Protocol',
    description: 'Central commissary batch yields standardized from 4-portion pan tests up to 80kg commissary kettles.',
    alt: 'Commissary batch yield standardization notes',
    width: 215,
    height: 160,
    rotation: 1.8,
    tapeColor: 'paleGold',
    tapeRotation: 5,
    doodle: 'chefHat',
    doodlePosition: '-bottom-3 -left-2',
    isMemoCard: true,
    memoNote: 'Central commissary batch yields standardized from 4-portion pan tests up to 80kg commissary kettles.',
    memoStamp: 'KITCHEN SOP'
  },
  {
    id: 'memo-6',
    image: '',
    title: 'Pastry Sugar R&D #17',
    category: 'Confectionery Trial',
    description: 'Isomalt pulled sugar petals calibrated to 55% ambient RH for luxury banquet presentation.',
    alt: 'Pastry sugar formulation sheet',
    width: 215,
    height: 160,
    rotation: -1.5,
    tapeColor: 'kraft',
    tapeRotation: -6,
    isMemoCard: true,
    memoNote: 'Isomalt pulled sugar petals calibrated to 55% ambient RH for luxury banquet presentation.',
    memoStamp: 'PASTRY LAB'
  }
];

// Reusable Washi Tape with zig-zag cut ends
const WashiTapeStrip: React.FC<{
  color?: 'olive' | 'kraft' | 'paleGold';
  rotation?: number;
  className?: string;
}> = ({ color = 'kraft', rotation = 0, className = '' }) => {
  const backgrounds = {
    kraft: 'repeating-linear-gradient(45deg, rgba(200, 162, 122, 0.85), rgba(200, 162, 122, 0.85) 4px, rgba(168, 126, 84, 0.6) 4px, rgba(168, 126, 84, 0.6) 8px)',
    olive: 'repeating-linear-gradient(-45deg, rgba(132, 116, 69, 0.80), rgba(132, 116, 69, 0.80) 4px, rgba(197, 168, 105, 0.6) 4px, rgba(197, 168, 105, 0.6) 8px)',
    paleGold: 'repeating-linear-gradient(45deg, rgba(228, 215, 182, 0.85), rgba(228, 215, 182, 0.85) 4px, rgba(197, 168, 105, 0.55) 4px, rgba(197, 168, 105, 0.55) 8px)'
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute z-30 pointer-events-none select-none shadow-xs opacity-90 ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        background: backgrounds[color],
        clipPath: 'polygon(0% 15%, 5% 0%, 10% 15%, 15% 0%, 20% 15%, 100% 0%, 95% 15%, 100% 30%, 95% 45%, 100% 60%, 95% 75%, 100% 90%, 95% 100%, 0% 100%, 5% 85%, 0% 70%, 5% 55%, 0% 40%)'
      }}
    />
  );
};

export const CorkboardGallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const rowTopRef = useRef<HTMLDivElement>(null);
  const rowBottomRef = useRef<HTMLDivElement>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Filter gallery photos for lightbox
  const actionablePhotos = CORKBOARD_ITEMS.filter((item) => !item.isMemoCard && item.image);

  // Open Lightbox
  const openLightbox = (itemId: string, triggerEl: HTMLElement) => {
    lastActiveTriggerRef.current = triggerEl;
    const idx = actionablePhotos.findIndex((p) => p.id === itemId);
    if (idx !== -1) {
      setActiveLightboxIndex(idx);
    }
  };

  // Close Lightbox
  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    lastActiveTriggerRef.current?.focus();
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % actionablePhotos.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + actionablePhotos.length) % actionablePhotos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, actionablePhotos.length, closeLightbox]);

  // Focus trap in Lightbox
  useEffect(() => {
    if (activeLightboxIndex !== null && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [activeLightboxIndex]);

  // Desktop Pinned Horizontal Scroll with GSAP ScrollTrigger
  useEffect(() => {
    // Only pin on desktop screens (>= 1024px) when motion is not reduced
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop || isReducedMotion || !sectionRef.current || !pinWrapperRef.current) return;

    const pinDistance = window.innerHeight * 1.6; // Refined scroll travel (~1440px at 1440x900)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${pinDistance}`,
      pin: pinWrapperRef.current,
      scrub: 1.0, // Silky smooth inertia scrub with Lenis
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        window.dispatchEvent(
          new CustomEvent('corkboard-gallery-active', { detail: { active: self.isActive } })
        );
      },
      onUpdate: (self) => {
        window.dispatchEvent(
          new CustomEvent('corkboard-gallery-active', { detail: { active: self.isActive } })
        );
        const p = self.progress;
        const boardEl = boardRef.current;
        const boardWidth = boardEl ? boardEl.clientWidth : window.innerWidth;

        // Row 1 Parallax translation: stops cleanly at the last card (zero brown space on right!)
        if (rowTopRef.current) {
          const maxScrollTop = Math.max(0, rowTopRef.current.scrollWidth - boardWidth + 36);
          gsap.set(rowTopRef.current, {
            x: -p * maxScrollTop,
            force3D: true
          });
        }

        // Row 2 Parallax translation: stops cleanly at the last card
        if (rowBottomRef.current) {
          const maxScrollBottom = Math.max(0, rowBottomRef.current.scrollWidth - boardWidth + 36);
          gsap.set(rowBottomRef.current, {
            x: -p * maxScrollBottom,
            force3D: true
          });
        }
      }
    });

    // Dedicated navbar hide trigger: smoothly hides the navbar as soon as corkboard enters view
    const navHideTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 120px',
      end: () => `+=${pinDistance + window.innerHeight * 0.4}`,
      onToggle: (self) => {
        window.dispatchEvent(
          new CustomEvent('corkboard-gallery-active', { detail: { active: self.isActive } })
        );
      }
    });

    return () => {
      window.dispatchEvent(
        new CustomEvent('corkboard-gallery-active', { detail: { active: false } })
      );
      st.kill();
      navHideTrigger.kill();
    };
  }, [isReducedMotion]);

  // Split items into 2 rows: 6 items per row for continuous, rich populating
  const rowTopItems = CORKBOARD_ITEMS.slice(0, 6);
  const rowBottomItems = CORKBOARD_ITEMS.slice(6, 12);

  return (
    <>
      <section
        id="gallery"
        ref={sectionRef}
        className="relative w-full bg-[#FAF8F5] scroll-mt-20"
      >
        {/* =====================================================================
            DESKTOP PINNED VIEWPORT (>= 1024px)
            Locked vertically in the middle of the screen
        ====================================================================== */}
        <div
          ref={pinWrapperRef}
          className="hidden lg:flex flex-col justify-center items-center relative w-full h-screen min-h-[620px] max-h-[960px] py-4 px-4 sm:px-8 overflow-hidden select-none"
        >
          {/* Pinned Gallery Section Header: Centered above corkboard */}
          <div className="w-full max-w-7xl mx-auto mb-3 sm:mb-4 shrink-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="inline-block relative">
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight">
                    Culinary R&D Gallery
                  </h2>
                  <svg
                    viewBox="0 0 240 10"
                    className="absolute -bottom-1 left-0 w-full h-2 overflow-visible pointer-events-none text-[#C5A869]"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 5 Q 60 1, 120 4 Q 180 8, 238 3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-[#574C43] mt-1 max-w-xl leading-relaxed">
                  Proprietary recipes and test trials pinned to our development corkboard. Click any print to inspect tasting notes.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-[#847445] bg-[#E4D7B6]/40 px-3 py-1.5 rounded-lg border border-[#C5A869]/30 select-none shrink-0 mb-1">
                <span>Scroll down to pan board</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* THE CORKBOARD SURFACE: Centered and properly proportioned */}
          <div
            ref={boardRef}
            className="relative w-full max-w-7xl h-[74vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl border-8 border-[#B59169] flex flex-col justify-around py-3 sm:py-4"
            style={{
              background: 'linear-gradient(135deg, #D4B991 0%, #C9A97D 50%, #BC996C 100%)',
              boxShadow: 'inset 0 0 100px rgba(70, 45, 15, 0.45), 0 20px 40px -15px rgba(50, 30, 10, 0.3)'
            }}
          >
            {/* Subtle corkboard fiber texture overlay */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#6B4822 1px, transparent 1px), radial-gradient(#8F6335 0.75px, transparent 0.75px)',
                backgroundSize: '16px 16px, 24px 24px',
                backgroundPosition: '0 0, 8px 8px'
              }}
            />

            {/* TOP ROW: PARALLAX PANNING LANE */}
            <div
              ref={rowTopRef}
              className="relative z-20 flex items-center gap-8 pl-8 pr-12 will-change-transform"
            >
              {rowTopItems.map((item) => (
                <CorkboardCard
                  key={item.id}
                  item={item}
                  onOpenLightbox={openLightbox}
                />
              ))}
            </div>

            {/* BOTTOM ROW: PARALLAX PANNING LANE */}
            <div
              ref={rowBottomRef}
              className="relative z-20 flex items-center gap-8 pl-16 pr-12 will-change-transform"
            >
              {rowBottomItems.map((item) => (
                <CorkboardCard
                  key={item.id}
                  item={item}
                  onOpenLightbox={openLightbox}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================================
            MOBILE / TABLET SWIPE ROW (< 1024px)
        ====================================================================== */}
        <div className="lg:hidden relative w-full px-4 sm:px-6 pt-10 pb-12">
          {/* Mobile Section Header */}
          <div className="mb-5">
            <div className="inline-block relative">
              <h2 className="font-display font-black text-2xl text-[#14181F] tracking-tight mt-0.5">
                Culinary R&D Gallery
              </h2>
              <svg
                viewBox="0 0 240 10"
                className="absolute -bottom-1 left-0 w-full h-2 overflow-visible pointer-events-none text-[#C5A869]"
                aria-hidden="true"
              >
                <path
                  d="M 2 5 Q 60 1, 120 4 Q 180 8, 238 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-xs text-[#574C43] mt-1.5 leading-relaxed">
              Proprietary recipes and test trials pinned to our development corkboard.
            </p>
          </div>

          {/* Cork container for mobile swipe */}
          <div
            className="relative w-full rounded-2xl p-4 sm:p-5 border-4 border-[#B59169] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #D4B991 0%, #C9A97D 100%)',
              boxShadow: 'inset 0 0 60px rgba(70, 45, 15, 0.35)'
            }}
          >
            <div className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 px-1 snap-x snap-mandatory scroll-smooth focus-visible:outline-none">
              {CORKBOARD_ITEMS.map((item) => (
                <div key={item.id} className="shrink-0 snap-center">
                  <CorkboardCard
                    item={item}
                    onOpenLightbox={openLightbox}
                  />
                </div>
              ))}
            </div>
            <div className="text-center text-[11px] font-mono text-[#4A321E] pt-2 select-none">
              ← Swipe photos horizontally →
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================================
          LIGHTBOX MODAL (Cream Paper Sheet with Hand-drawn Aesthetic)
      ======================================================================== */}
      {activeLightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
          tabIndex={-1}
          ref={lightboxRef}
          onClick={closeLightbox}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[#18120B]/65 backdrop-blur-xs animate-fadeIn focus-visible:outline-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-[#FFFDF8] border-2 border-[#E8E2D5] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            style={{
              boxShadow: '0 25px 60px -15px rgba(45, 25, 10, 0.4), inset 0 0 40px rgba(132, 116, 69, 0.05)'
            }}
          >
            {/* Top Washi Tape Accents */}
            <WashiTapeStrip color="olive" rotation={-5} className="-top-3 left-10 w-16 h-6" />
            <WashiTapeStrip color="kraft" rotation={6} className="-top-3 right-14 w-14 h-6" />

            {/* Inner Stitched Border */}
            <div
              className="absolute inset-2.5 rounded-2xl border border-dashed border-[#C5A869]/40 pointer-events-none"
              aria-hidden="true"
            />

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close Lightbox"
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-[#FAF8F5] hover:bg-[#847445] text-[#574C43] hover:text-white border border-[#C5A869]/40 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Current Photo Container */}
            <div className="relative z-10 w-full flex items-center justify-center bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5] p-3 sm:p-4 mb-4">
              <img
                src={actionablePhotos[activeLightboxIndex].image}
                alt={actionablePhotos[activeLightboxIndex].alt}
                className="max-h-[52vh] w-auto max-w-full object-contain rounded-lg shadow-xs"
              />
            </div>

            {/* Photo Info & Handwritten Caption */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-t border-[#E8E2D5]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#847445]">
                  {actionablePhotos[activeLightboxIndex].category}
                </span>
                <h4
                  className="text-2xl sm:text-3xl text-[#14181F] font-bold leading-none tracking-tight"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {actionablePhotos[activeLightboxIndex].title}
                </h4>
                <p className="text-xs text-[#574C43] max-w-xl leading-relaxed pt-1">
                  {actionablePhotos[activeLightboxIndex].description}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    setActiveLightboxIndex(
                      (prev) => (prev !== null ? (prev - 1 + actionablePhotos.length) % actionablePhotos.length : 0)
                    )
                  }
                  aria-label="Previous Photo"
                  className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#847445] text-[#574C43] hover:text-white border border-[#C5A869]/40 transition-colors shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#847445]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#847445] font-bold px-1">
                  {activeLightboxIndex + 1} / {actionablePhotos.length}
                </span>
                <button
                  onClick={() =>
                    setActiveLightboxIndex(
                      (prev) => (prev !== null ? (prev + 1) % actionablePhotos.length : 0)
                    )
                  }
                  aria-label="Next Photo"
                  className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#847445] text-[#574C43] hover:text-white border border-[#C5A869]/40 transition-colors shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#847445]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sub-component: Individual Corkboard Card (Photo Print or Memo Sheet)
const CorkboardCard: React.FC<{
  item: CorkboardPhoto;
  onOpenLightbox: (id: string, el: HTMLElement) => void;
}> = ({ item, onOpenLightbox }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // If this item is an authentic culinary lab memo card
  if (item.isMemoCard) {
    return (
      <div
        className="group relative shrink-0 rounded-lg p-3.5 sm:p-4 border border-[#C5A869]/50 shadow-md select-none transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-xl flex flex-col justify-between"
        style={{
          width: `${item.width}px`,
          height: `${item.height}px`,
          transform: `rotate(${item.rotation}deg)`,
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FAF8F5 100%)'
        }}
      >
        <WashiTapeStrip color={item.tapeColor} rotation={item.tapeRotation} className="-top-3 left-1/2 -translate-x-1/2 w-14 h-4.5" />

        {/* Hand-drawn Chef Doodle on Memo Card */}
        {item.doodle && (
          <div
            className={`absolute z-30 pointer-events-none select-none drop-shadow-xs transition-transform duration-300 group-hover:scale-110 ${item.doodlePosition || '-top-3.5 -right-3'}`}
            aria-hidden="true"
          >
            {item.doodle === 'croissant' && <CroissantDoodle className="w-9 h-7 text-[#847445]" />}
            {item.doodle === 'coffee' && <CoffeeDoodle className="w-8 h-8 text-[#847445]" />}
            {item.doodle === 'chili' && <ChiliDoodle className="w-7 h-7 text-[#847445]" />}
            {item.doodle === 'steam' && <SteamDoodle className="w-6 h-6 text-[#847445]" />}
            {item.doodle === 'sparkle' && <SparkleDoodle className="w-5 h-5 text-[#C5A869]" />}
            {item.doodle === 'chefHat' && <ChefHatDoodle className="w-8 h-8 text-[#847445]" />}
            {item.doodle === 'whisk' && <WhiskDoodle className="w-8 h-8 text-[#847445]" />}
            {item.doodle === 'herbSprig' && <HerbSprigDoodle className="w-8 h-8 text-[#847445]" />}
            {item.doodle === 'cocktail' && <CocktailGlassDoodle className="w-7 h-7 text-[#847445]" />}
            {item.doodle === 'pretzel' && <PretzelDoodle className="w-8 h-7 text-[#847445]" />}
          </div>
        )}

        <div className="flex items-center justify-between pb-1.5 border-b border-dashed border-[#C5A869]/50">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#847445] uppercase truncate">
            {item.category}
          </span>
          {item.memoStamp && (
            <span className="text-[7.5px] font-mono font-bold text-[#847445] border border-dashed border-[#847445] px-1 py-0.5 rounded-2xs transform rotate-2 shrink-0 ml-1">
              {item.memoStamp}
            </span>
          )}
        </div>
        <p
          className="text-sm sm:text-base text-[#2C2117] leading-snug pt-1.5"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {item.memoNote}
        </p>
      </div>
    );
  }

  // Printed Photo with Polaroid White Border & Washi Tape
  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="button"
      aria-label={`View photo: ${item.title}`}
      onClick={(e) => onOpenLightbox(item.id, e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenLightbox(item.id, e.currentTarget);
        }
      }}
      className="group relative shrink-0 p-2.5 pb-4 rounded-sm bg-[#FFFDF8] border border-[#E8E2D5] shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:scale-[1.03] hover:shadow-2xl cursor-pointer focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
      style={{
        width: `${item.width}px`,
        transform: `rotate(${item.rotation}deg)`
      }}
    >
      {/* 1 or 2 Pieces of Washi Tape */}
      <WashiTapeStrip
        color={item.tapeColor}
        rotation={item.tapeRotation}
        className="-top-3 left-4 w-12 h-4.5"
      />

      {/* Hand-drawn Chef Doodle on Photo Print */}
      {item.doodle && (
        <div
          className={`absolute z-30 pointer-events-none select-none drop-shadow-xs transition-transform duration-300 group-hover:scale-115 ${item.doodlePosition || '-top-3.5 -right-3'}`}
          aria-hidden="true"
        >
          {item.doodle === 'croissant' && <CroissantDoodle className="w-10 h-8 text-[#847445]" />}
          {item.doodle === 'coffee' && <CoffeeDoodle className="w-9 h-9 text-[#847445]" />}
          {item.doodle === 'chili' && <ChiliDoodle className="w-8 h-8 text-[#847445]" />}
          {item.doodle === 'steam' && <SteamDoodle className="w-7 h-7 text-[#847445]" />}
          {item.doodle === 'sparkle' && <SparkleDoodle className="w-6 h-6 text-[#C5A869]" />}
          {item.doodle === 'chefHat' && <ChefHatDoodle className="w-8 h-8 text-[#847445]" />}
          {item.doodle === 'whisk' && <WhiskDoodle className="w-8 h-8 text-[#847445]" />}
          {item.doodle === 'herbSprig' && <HerbSprigDoodle className="w-8 h-8 text-[#847445]" />}
          {item.doodle === 'cocktail' && <CocktailGlassDoodle className="w-7 h-7 text-[#847445]" />}
          {item.doodle === 'pretzel' && <PretzelDoodle className="w-9 h-8 text-[#847445]" />}
        </div>
      )}

      {/* Image with Constrained Height for Zero Row Cutoff */}
      <div
        className="relative overflow-hidden rounded-2xs bg-[#FAF8F5] border border-black/10"
        style={{ height: `${item.photoHeight || 112}px` }}
      >
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover zoom cue icon */}
        <div className="absolute inset-0 bg-[#1C120A]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="p-1.5 rounded-full bg-white/90 text-[#847445] shadow-xs">
            <ZoomIn className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Handwritten Caption in Caveat */}
      <div className="pt-2 px-0.5 flex items-center justify-between">
        <span
          className="text-base text-[#2C2117] font-bold leading-none tracking-tight truncate group-hover:text-[#847445] transition-colors"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {item.title}
        </span>
        <span className="text-[8.5px] font-mono text-[#847445]/80 uppercase tracking-widest shrink-0 ml-1.5">
          RECIPE R&D
        </span>
      </div>
    </div>
  );
};
