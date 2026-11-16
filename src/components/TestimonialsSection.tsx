import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight">
            Client Voices
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Verbatim client feedback from operating founders and brand directors across India.
          </p>
        </div>

        {/* Carousel View */}
        <div className="max-w-3xl mx-auto">
          <div className="relative p-7 sm:p-10 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs">

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-mono font-semibold text-slate-500">
                Brand: <strong className="text-slate-900">{current.brand}</strong>
              </span>

              <div className="text-xs font-mono text-slate-400">
                {currentIndex + 1} / {TESTIMONIALS.length}
              </div>
            </div>

            {/* Verbatim quote */}
            <div className="relative mb-6">
              <Quote className="w-8 h-8 text-[#847445]/25 mb-2" />
              <p className="font-serif text-base sm:text-lg text-slate-800 leading-relaxed italic">
                "{current.quote}"
              </p>
            </div>

            {/* Author info & controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-[#14181F]">
                  {current.author}
                </h4>
                <p className="text-xs text-slate-500">
                  {current.brand}
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#847445]/10 hover:text-[#847445] text-slate-700 border border-[#EAEAEA] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={next}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-[#847445]/10 hover:text-[#847445] text-slate-700 border border-[#EAEAEA] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Clean brand pills */}
          <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(idx)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${currentIndex === idx
                  ? 'bg-[#847445] text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-[#EAEAEA]'
                  }`}
              >
                {t.brand}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
