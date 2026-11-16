import React from 'react';
import { Sparkles, TrendingUp, Building2, ArrowRight } from 'lucide-react';

interface AudienceSelectorProps {
  onSelectAudience: (targetStage: number) => void;
}

export const AudienceSelector: React.FC<AudienceSelectorProps> = ({ onSelectAudience }) => {
  const pathways = [
    {
      icon: Sparkles,
      tag: "First-Time Founder",
      title: "I have an idea & capital, but no restaurant experience",
      description: "You have a vision and budget, but need end-to-end guidance from business planning and commercial kitchen setup to staff training and launch.",
      jumpToText: "Explore Stage 01: The Idea",
      targetStage: 0
    },
    {
      icon: TrendingUp,
      tag: "Operating Brand",
      title: "I have 1-2 outlets and want to scale nationally",
      description: "Your proof of concept works. Now you need central commissary planning, standardized recipes, franchise documentation, and mall leasing.",
      jumpToText: "Explore Stage 08: The Expansion",
      targetStage: 7
    },
    {
      icon: Building2,
      tag: "Property Owner & Investor",
      title: "I have vacant commercial real estate",
      description: "You own commercial space, a hotel dining facility, or cafeteria and need an operating food concept and backend kitchen setup.",
      jumpToText: "Explore Stage 03: The Place",
      targetStage: 2
    }
  ];

  return (
    <section id="services" className="py-16 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mb-10">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#14181F] tracking-tight">
            Choose your starting point
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Select where you currently stand to jump directly to the relevant stage of the Growth Journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pathways.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onSelectAudience(item.targetStage)}
                className="group relative p-6 rounded-2xl bg-white border border-[#EAEAEA] hover:border-[#847445] cursor-pointer transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      {item.tag}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#847445] transition-colors" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#14181F] mb-2 group-hover:text-[#847445] transition-colors">
                    "{item.title}"
                  </h3>
                  
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#847445] pt-3 border-t border-slate-100">
                  <span>{item.jumpToText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
