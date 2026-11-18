import React from 'react';
import { FlightJourney } from './FlightJourney';
import { CONFIRMED_CITIES } from '../data/mockData';
import { MapPin } from 'lucide-react';

interface GrowthJourneyProps {
  onConsultStage: (stageIndex: number) => void;
  onOpenServiceModal: (stageIndex: number) => void;
}

export const GrowthJourney: React.FC<GrowthJourneyProps> = ({ 
  onConsultStage,
  onOpenServiceModal
}) => {
  return (
    <div className="relative bg-white text-[#14181F]">
      {/* 1. Header Introduction */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 z-20">
        <div className="pb-8 border-b border-[#EAEAEA] max-w-3xl">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14181F] tracking-tight">
            The Growth Journey
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            "From empty plot to expanding brand." Every CYK service appears at the moment in your food business's life when it matters.
          </p>
        </div>
      </div>

      {/* 2. THE FLIGHT: Scroll-Driven Multi-Layer Z-Axis Parallax Engine (All 8 Stops) */}
      <FlightJourney
        onConsultStage={onConsultStage}
        onOpenServiceModal={onOpenServiceModal}
        stopCount={8}
      />

      {/* 3. FORK DESTINATIONS: Confirmed Expansion Hubs */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 z-20">
        <div className="border-t border-[#EAEAEA] pt-12 max-w-2xl mx-auto text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-4">
            Expansion Hubs (Confirmed Projects)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CONFIRMED_CITIES.map((c) => (
              <div key={c.name} className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#EAEAEA] text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#847445]/40 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#847445] shrink-0" />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SEPARATE FINAL CTA */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 z-20">
        <div id="contact" className="mt-8 pt-16 border-t border-[#EAEAEA] text-center max-w-xl mx-auto">
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
    </div>
  );
};
