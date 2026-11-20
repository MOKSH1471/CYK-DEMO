import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS } from '../data/mockData';
import { Project } from '../types';
import { Filter, Layers, MapPin, ArrowUpRight, X, Check, ExternalLink } from 'lucide-react';
import { getLenis } from '../utils/lenis';

interface CaseStudiesProps {
  onEnquireProject: (projectName?: string) => void;
}

// Realistic metallic brass trombone paper clip
const PaperClip: React.FC<{ className?: string }> = ({ className = "w-5.5 h-11" }) => (
  <svg
    viewBox="0 0 26 50"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Soft paper cast shadow */}
    <path
      d="M 9 14 V 38 C 9 43, 17 43, 17 38 V 8 C 17 3, 5 3, 5 8 V 39 C 5 47, 21 47, 21 39 V 15"
      stroke="#5A4322"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.3"
      transform="translate(1, 1.2)"
    />
    {/* Base dark brass wire */}
    <path
      d="M 9 14 V 38 C 9 43, 17 43, 17 38 V 8 C 17 3, 5 3, 5 8 V 39 C 5 47, 21 47, 21 39 V 15"
      stroke="#7A5A24"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Metallic golden highlight wire */}
    <path
      d="M 9 14 V 38 C 9 43, 17 43, 17 38 V 8 C 17 3, 5 3, 5 8 V 39 C 5 47, 21 47, 21 39 V 15"
      stroke="url(#brass-clip-grad)"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="brass-clip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3E5C8" />
        <stop offset="30%" stopColor="#C5A869" />
        <stop offset="70%" stopColor="#A08144" />
        <stop offset="100%" stopColor="#D4BA7E" />
      </linearGradient>
    </defs>
  </svg>
);

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onEnquireProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStageTag, setSelectedStageTag] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const modalFlapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const categories = ['All', 'QSR', 'Cafe', 'Bar & Restaurant', 'Bakery'];
  const stageTags = [
    'All',
    'Concept',
    'Location',
    'Menu/R&D',
    'Backend Ops',
    'Brand Expansion'
  ];

  const filteredProjects = FEATURED_PROJECTS.filter((p: Project) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchStage = selectedStageTag === 'All' || p.stageTags.includes(selectedStageTag as any);
    return matchCat && matchStage;
  });

  const cardTilts = [-1.0, 0.8, -0.6, 1.2, -0.8, 0.6];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeModalProject) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeModalProject]);

  // Close Modal with Smooth Reversal and Focus Return
  const closeModal = useCallback(() => {
    if (!activeModalProject) return;
    if (isReducedMotion || !modalFlapRef.current) {
      setActiveModalProject(null);
      lastTriggerRef.current?.focus();
      return;
    }
    gsap.to(modalFlapRef.current, {
      y: 16,
      scale: 0.97,
      opacity: 0,
      duration: 0.16,
      ease: 'power2.in',
      force3D: true,
      onComplete: () => {
        setActiveModalProject(null);
        lastTriggerRef.current?.focus();
      }
    });
  }, [activeModalProject, isReducedMotion]);

  // Escape Key Listener
  useEffect(() => {
    if (!activeModalProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalProject, closeModal]);

  // Snappy GPU Hardware-Accelerated Modal Entrance
  useEffect(() => {
    if (activeModalProject && modalFlapRef.current && !isReducedMotion) {
      gsap.fromTo(
        modalFlapRef.current,
        {
          y: 20,
          scale: 0.96,
          opacity: 0,
          force3D: true
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.22,
          ease: 'power3.out',
          force3D: true
        }
      );
    }
  }, [activeModalProject, isReducedMotion]);

  const handleOpenProjectModal = (project: Project, e: React.MouseEvent<HTMLButtonElement>) => {
    lastTriggerRef.current = e.currentTarget;
    setActiveModalProject(project);
  };

  return (
    <section id="projects" className="py-20 bg-[#FAF8F5] border-b border-[#E8E2D5] scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Hand-Drawn Olive-Gold Underline */}
        <div className="max-w-2xl mb-12">
          <div className="inline-block relative">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#14181F] tracking-tight">
              Projects & Case Studies
            </h2>
            <svg
              viewBox="0 0 260 12"
              className="absolute -bottom-1.5 left-0 w-full h-2.5 overflow-visible pointer-events-none text-[#C5A869]"
              aria-hidden="true"
            >
              <path
                d="M 2 6 Q 65 1, 130 5 Q 195 9, 258 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-3 text-[#574C43] text-sm sm:text-base leading-relaxed">
            Real food businesses consulted and delivered by CYK Hospitalities across Delhi NCR and Western Uttar Pradesh.
          </p>
        </div>

        {/* 2-Facet Filters: "FOLDER TABS" */}
        <div className="p-5 rounded-2xl bg-[#FFFDF8] border border-[#E8E2D5] shadow-xs mb-10 space-y-4">

          {/* Facet 1: Business Format */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#847445] mr-2 flex items-center gap-1.5 font-bold select-none">
              <Filter className="w-3.5 h-3.5 text-[#847445]" />
              Format:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  className={`text-xs px-3.5 py-1.5 rounded-t-lg rounded-b-sm font-mono tracking-wide transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none ${
                    isActive
                      ? 'bg-[#847445] text-[#FAF8F5] font-bold border-[2px] border-white ring-1 ring-[#C8A27A]/50 shadow-xs scale-[1.02]'
                      : 'bg-[#FAF8F5] text-[#574C43] hover:text-[#14181F] hover:bg-[#F4EFE6] border border-dashed border-[#C5A869]/50 shadow-3xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Facet 2: Stage CYK Covered */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E8E2D5]/70">
            <span className="text-xs font-mono uppercase tracking-wider text-[#847445] mr-2 flex items-center gap-1.5 font-bold select-none">
              <Layers className="w-3.5 h-3.5 text-[#847445]" />
              Stage:
            </span>
            {stageTags.map((tag) => {
              const isActive = selectedStageTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedStageTag(tag)}
                  aria-pressed={isActive}
                  className={`text-xs px-3.5 py-1.5 rounded-t-lg rounded-b-sm font-mono tracking-wide transition-all cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none ${
                    isActive
                      ? 'bg-[#847445] text-[#FAF8F5] font-bold border-[2px] border-white ring-1 ring-[#C8A27A]/50 shadow-xs scale-[1.02]'
                      : 'bg-[#FAF8F5] text-[#574C43] hover:text-[#14181F] hover:bg-[#F4EFE6] border border-dashed border-[#C5A869]/50 shadow-3xs'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

        </div>

        {/* Project Cards Grid: "CASE FOLDERS" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project, idx) => {
            const tilt = isReducedMotion ? 0 : cardTilts[idx % cardTilts.length];

            return (
              <div
                key={project.id}
                className="group relative rounded-2xl bg-[#FFFDF8] border border-[#E8E2D5] shadow-xs hover:border-[#847445]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden focus-within:ring-2 focus-within:ring-[#847445]"
                style={{
                  transform: `rotate(${tilt}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                {/* Stitched Dashed Inner Border */}
                <div
                  className="absolute inset-1.5 rounded-xl border border-dashed border-[#C5A869]/35 pointer-events-none z-10"
                  aria-hidden="true"
                />

                <div>
                  {/* Top Edge: Manila Tab with Stamp-style Format label & Case Dossier ID */}
                  <div className="relative z-20 flex items-center justify-between px-5 pt-3.5 pb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded border border-dashed border-[#847445]/60 text-[#847445] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#847445]/5">
                      FORMAT: {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#847445]/60 tracking-widest uppercase">
                      DOSSIER #{String(project.id).replace(/-/g, '').slice(0, 6).toUpperCase()}
                    </span>
                  </div>

                  {/* Logo / Artwork Area: Consistent Cream Paper Label with Paper Clip */}
                  <div className="relative mx-4 mt-1 mb-4">
                    {/* Metallic Paper Clip graphic holding the label over top edge */}
                    <div
                      className="absolute -top-4 right-6 z-30 transition-transform duration-300 group-hover:rotate-12 group-hover:-translate-y-0.5 pointer-events-none drop-shadow-sm"
                      aria-hidden="true"
                    >
                      <PaperClip className="w-5.5 h-11" />
                    </div>

                    {/* Centered & Contained Artwork */}
                    <div className="relative rounded-xl bg-[#FAF8F5] border border-dashed border-[#C5A869]/60 p-3 h-44 flex items-center justify-center overflow-hidden shadow-3xs group-hover:bg-white transition-colors">
                      <img
                        src={project.image}
                        alt={`Artwork for ${project.name}`}
                        loading="lazy"
                        className="w-full h-full object-contain max-h-36 rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>

                  {/* Card Body: Readable Location, Project Title, Description, Stage Tags */}
                  <div className="px-5 pb-2 space-y-3 relative z-20">
                    {/* Location: strictly ON the cream card body with dark warm grey text (WCAG AA compliant) */}
                    <div className="flex items-center gap-1.5 text-xs text-[#574C43] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#847445] shrink-0" aria-hidden="true" />
                      <span className="truncate">{project.city}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-display font-extrabold text-xl text-[#14181F] tracking-tight group-hover:text-[#847445] transition-colors">
                      {project.name}
                    </h3>

                    {/* Description: exactly 3 lines with proper CSS ellipsis */}
                    <p className="text-xs text-[#574C43] leading-[1.65] line-clamp-3 break-words">
                      {project.brief}
                    </p>

                    {/* Stage Tags as Sticky Labels with Individual Tilts */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {project.stageTags.map((tag, tagIdx) => {
                        const tagTilts = [-1.2, 0.9, -0.7, 1.1, -1.0];
                        return (
                          <span
                            key={tagIdx}
                            className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E4D7B6]/75 text-[#847445] border border-[#C5A869]/40 shadow-3xs select-none"
                            style={{
                              transform: isReducedMotion ? 'none' : `rotate(${tagTilts[tagIdx % tagTilts.length]}deg)`
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Kraft Tab "View Details" Button */}
                <div className="p-5 pt-4 relative z-20">
                  <button
                    onClick={(e) => handleOpenProjectModal(project, e)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#C8A27A]/25 hover:bg-[#847445] text-[#14181F] hover:text-[#FAF8F5] font-bold text-xs border border-[#C8A27A]/50 hover:border-[#847445] shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-between cursor-pointer group/btn focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
                  >
                    <span className="font-sans tracking-tight">View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#847445] group-hover/btn:text-[#FAF8F5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =======================================================================
          CASE STUDY DOSSIER MODAL: THE FOLDER OPENS (Craft Paper Flap-Lift)
      ======================================================================== */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-title"
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-[#18120A]/60 overflow-hidden"
          onClick={closeModal}
          data-lenis-prevent
        >
          <div
            ref={modalFlapRef}
            style={{
              background: 'linear-gradient(180deg, #FFFDF8 0%, #FAF8F5 55%, #F4EFE6 100%)',
              boxShadow: '0 25px 60px -15px rgba(45, 30, 15, 0.4), 0 0 0 1px rgba(132, 116, 69, 0.2)'
            }}
            className="relative w-full max-w-2xl max-h-[88vh] flex flex-col my-auto rounded-3xl border-2 border-[#C8A27A]/50 overflow-hidden cursor-default will-change-[transform,opacity]"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Hand-Drawn / Stitched Dashed Inner Border (Pure CSS GPU layer) */}
            <div
              className="absolute inset-2.5 rounded-2xl border border-dashed border-[#C5A869]/50 pointer-events-none z-10"
              aria-hidden="true"
            />

            {/* Washi Tape Strip at Top Left (-6deg Kraft Stripe) */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-8 z-30 w-16 h-5 pointer-events-none select-none shadow-xs opacity-90"
              style={{
                transform: 'rotate(-6deg)',
                background: 'repeating-linear-gradient(45deg, rgba(200, 162, 122, 0.85), rgba(200, 162, 122, 0.85) 4px, rgba(132, 116, 69, 0.5) 4px, rgba(132, 116, 69, 0.5) 8px)',
                clipPath: 'polygon(0% 20%, 5% 0%, 10% 20%, 15% 0%, 20% 20%, 100% 0%, 95% 20%, 100% 40%, 95% 60%, 100% 80%, 95% 100%, 0% 100%, 5% 80%, 0% 60%, 5% 40%)'
              }}
            />

            {/* Top Folder Header Tab Rim */}
            <div className="relative z-20 px-6 pt-5 pb-3 border-b border-[#E8E2D5] bg-[#FAF8F5]/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#847445] text-[#FAF8F5] uppercase tracking-wider shadow-xs">
                  DOSSIER · {activeModalProject.category}
                </span>
                <span className="text-[11px] font-mono text-[#847445] font-semibold">
                  REF #{activeModalProject.id.toUpperCase()}
                </span>
              </div>

              {/* Close Button: Kraft Tab Pill */}
              <button
                onClick={closeModal}
                className="group flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C8A27A]/25 hover:bg-[#847445] text-[#14181F] hover:text-[#FAF8F5] font-bold text-xs border border-[#C8A27A]/50 transition-all duration-200 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#847445] focus-visible:outline-none"
                aria-label="Close dossier modal"
              >
                <span>Close</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Dossier Content Body */}
            <div
              className="relative z-20 flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y'
              }}
              data-lenis-prevent
            >

              {/* Dossier Title & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#574C43] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#847445]" aria-hidden="true" />
                  <span>{activeModalProject.city}</span>
                  <span className="text-[#C5A869]">·</span>
                  <span>CYK Hospitalities Consulting Delivery</span>
                </div>

                <h2
                  id="case-study-title"
                  className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight"
                >
                  {activeModalProject.name}
                </h2>
              </div>

              {/* Real Project Image styled as Taped Print */}
              <div className="relative p-2.5 pb-3 rounded-lg bg-[#FFFDF8] border border-[#E8E2D5] shadow-md">
                <div className="relative h-44 sm:h-52 w-full rounded overflow-hidden bg-[#FAF8F5] border border-black/10 flex items-center justify-center p-2">
                  <img
                    src={activeModalProject.image}
                    alt={`Photograph of ${activeModalProject.name}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="pt-2 px-1 flex items-center justify-between text-xs">
                  <span
                    className="text-base text-[#2C2117] font-bold"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    {activeModalProject.name} · Site Documentation
                  </span>
                  <span className="text-[10px] font-mono text-[#847445] uppercase">
                    FORMAT: {activeModalProject.category}
                  </span>
                </div>
              </div>

              {/* Story / About This Project */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#847445] font-bold mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#847445]" />
                  <span>About This Project</span>
                </h4>
                <p className="text-sm text-[#14181F] leading-relaxed">
                  {activeModalProject.brief}
                </p>
              </div>

              {/* Deliverables / What CYK Hospitalities Provided */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#847445] font-bold mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#847445]" />
                  <span>What CYK Hospitalities Delivered</span>
                </h4>
                <div className="grid gap-2">
                  {activeModalProject.whatCYKDid.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5] shadow-3xs"
                    >
                      <div className="w-4 h-4 rounded-full bg-[#847445]/15 border border-[#847445]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#847445]" />
                      </div>
                      <span className="text-xs sm:text-sm text-[#2C2117] leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Stamp */}
              {activeModalProject.outcome && (
                <div className="p-4 rounded-2xl bg-[#E4D7B6]/30 border border-[#C5A869]/50 shadow-3xs">
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#847445] font-bold mb-1 flex items-center gap-1">
                    <span>★</span>
                    <span>Verified Project Outcome</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#14181F] font-semibold leading-relaxed">
                    {activeModalProject.outcome}
                  </p>
                </div>
              )}

              {/* Source Verification Link */}
              <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between text-xs text-[#574C43]">
                <span className="text-[11px] font-mono text-[#847445]/80 truncate max-w-[280px] sm:max-w-md">
                  Source: {activeModalProject.source}
                </span>
                <a
                  href={activeModalProject.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#847445] hover:underline"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="relative z-20 px-6 py-4 bg-[#F4EFE6]/80 border-t border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-mono text-[#574C43]">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#C8A27A]/40 text-[10px]">Esc</kbd> to close dossier
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={closeModal}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#574C43] font-bold text-xs border border-[#C8A27A]/40 transition-colors cursor-pointer shadow-3xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const name = activeModalProject.name;
                    closeModal();
                    onEnquireProject(name);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-[#FAF8F5] font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Consult Similar Concept</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
