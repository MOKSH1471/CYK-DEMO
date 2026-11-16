import React, { useState } from 'react';
import { HORECA_POSTS } from '../data/mockData';
import { BlogPost } from '../types';
import { Clock, ArrowUpRight, X } from 'lucide-react';

export const HoReCaTalks: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  return (
    <section id="horeca-talks" className="py-20 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14181F] tracking-tight">
            Hospitality Insights
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Industry perspectives on restaurant management, dining aesthetics, and franchising.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {HORECA_POSTS.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl bg-white border border-[#EAEAEA] hover:border-[#847445]/50 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono uppercase font-bold text-[#847445]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {post.date}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#14181F] leading-snug">
                  {post.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {post.author}
                </span>

                <button
                  onClick={() => setActiveArticle(post)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-[#847445]/10 hover:text-[#847445] text-slate-700 border border-[#EAEAEA] transition-colors cursor-pointer"
                  aria-label="Read full article"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white border border-[#EAEAEA] p-6 sm:p-8 shadow-2xl space-y-4">

            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase font-bold text-[#847445]">
                {activeArticle.category} • {activeArticle.date}
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#14181F]">
                {activeArticle.title}
              </h2>
              <div className="text-xs text-slate-500">
                By {activeArticle.author}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-4 space-y-3">
              <p>{activeArticle.excerpt}</p>
              <p className="text-slate-500 italic">
                From the CYK Hospitalities knowledge archives. Full advisory whitepaper available during project consultation.
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                Source: {activeArticle.source}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveArticle(null)}
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
