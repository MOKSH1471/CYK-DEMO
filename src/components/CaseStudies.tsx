import React, { useState } from 'react';
import { FEATURED_PROJECTS } from '../data/mockData';
import { Project } from '../types';
import { Filter, Layers, MapPin, ArrowUpRight, X, Check } from 'lucide-react';
import { AccordionGallery, AccordionGalleryItem } from './AccordionGallery';

interface CaseStudiesProps {
  onEnquireProject: (projectName?: string) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onEnquireProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStageTag, setSelectedStageTag] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const galleryItems: AccordionGalleryItem[] = [
    {
      image: './images/gallery/gallery-risotto.jpg',
      label: 'Prawn Risotto — Recipe Development',
      alt: 'Prawn Risotto from the CYK Test Kitchen Gallery'
    },
    {
      image: './images/gallery/gallery-croissant.jpg',
      label: 'Artisan Croissant — Boulangerie Formulation',
      alt: 'Artisan Croissant from the CYK Test Kitchen Gallery'
    },
    {
      image: './images/gallery/gallery-taco.jpg',
      label: 'Paneer Thecha Taco — Regional Fusion',
      alt: 'Paneer Thecha Taco from the CYK Test Kitchen Gallery'
    },
    {
      image: './images/gallery/gallery-ramen.jpg',
      label: 'Craft Ramen — Broth & Noodle Engineering',
      alt: 'Craft Ramen from the CYK Test Kitchen Gallery'
    },
    {
      image: './images/gallery/gallery-corn-chaat.jpg',
      label: 'Corn Chaat — Contemporary Street Food',
      alt: 'Corn Chaat from the CYK Test Kitchen Gallery'
    },
    {
      image: './images/gallery/gallery-falafel.jpg',
      label: 'Sabudana Falafel & Potato Hummus',
      alt: 'Sabudana Falafel and Potato Hummus from the CYK Test Kitchen Gallery'
    }
  ];

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

  return (
    <section id="projects" className="py-20 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight">
            Projects & Case Studies
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Real food businesses consulted and delivered by CYK Hospitalities across Delhi NCR and Western Uttar Pradesh.
          </p>
        </div>

        {/* Gallery Section from CYK Test Kitchen */}
        <div className="mb-14">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#847445] tracking-wide uppercase">
              Culinary R&D Gallery
            </h3>
            <p className="text-xs text-slate-500">
              Proprietary recipes and culinary formulations developed in the CYK test kitchen.
            </p>
          </div>
          <AccordionGallery
            items={galleryItems}
            defaultIndex={0}
            accentColor="#847445"
            overlayColor="#121316"
            textColor="#FAF8F5"
            height={420}
            gap={10}
            radius={18}
            expandRatio={0.46}
            trigger="hover"
            grayscale={true}
          />
        </div>

        {/* 2-Facet Filters */}
        <div className="p-4 rounded-xl bg-white border border-[#EAEAEA] shadow-2xs mb-8 space-y-3">

          {/* Facet 1: Business Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1 font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Format:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${selectedCategory === cat
                  ? 'bg-[#847445] text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-[#EAEAEA]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Facet 2: Stage CYK Covered */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1 font-bold">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Stage:
            </span>
            {stageTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedStageTag(tag)}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${selectedStageTag === tag
                  ? 'bg-[#847445] text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-[#EAEAEA]'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white border border-[#EAEAEA] overflow-hidden hover:border-[#847445]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Real Client Image from conceptyourkitchen.com */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-white/95 text-slate-800 text-[10px] font-mono font-bold shadow-xs">
                    {project.category}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[11px] text-white font-semibold drop-shadow">
                    <MapPin className="w-3 h-3 text-[#847445]" />
                    <span>{project.city}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-xl text-[#14181F]">
                    {project.name}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {project.brief}
                  </p>

                  {/* Stage Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.stageTags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#847445]/10 text-[#847445] font-semibold border border-[#847445]/15">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-[#847445]/10 hover:text-[#847445] text-slate-800 font-bold text-xs border border-[#EAEAEA] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Case Study Modal */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#EAEAEA] p-6 sm:p-8 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 mb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold">
                  {activeModalProject.category}
                </span>
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#847445]" />
                  {activeModalProject.city}
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#14181F]">
                {activeModalProject.name}
              </h2>
            </div>

            {/* Real Project Image */}
            <div className="h-56 rounded-xl overflow-hidden mb-5 border border-slate-200 bg-slate-100">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                  About This Project
                </h4>
                <p className="text-slate-800 leading-relaxed">
                  {activeModalProject.brief}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
                  What CYK Hospitalities Provided
                </h4>
                <div className="grid gap-1.5">
                  {activeModalProject.whatCYKDid.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-[#EAEAEA]">
                      <Check className="w-3.5 h-3.5 text-[#847445] shrink-0 mt-0.5" />
                      <span className="text-slate-800 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {activeModalProject.outcome && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Outcome
                  </h4>
                  <p className="text-slate-900 font-semibold text-xs">
                    {activeModalProject.outcome}
                  </p>
                </div>
              )}

              <div className="pt-2 text-[10.5px] font-mono text-slate-400">
                Source: {activeModalProject.source}
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-5 py-2 rounded-lg bg-[#847445] hover:bg-[#6E6038] text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
