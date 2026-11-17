import React, { useState, useEffect } from 'react';
import { SERVICES_LIST } from '../data/mockData';
import { ServiceItem } from '../types';
import {
  X, CheckCircle, Clock, ArrowRight, Layers, Award
} from 'lucide-react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceSlug?: string;
  onSelectService?: (serviceSlug: string) => void;
  onSelectStage?: (stageNumber: number) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  initialServiceSlug,
  onSelectService,
  onSelectStage = () => { }
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES_LIST[0]);

  useEffect(() => {
    if (initialServiceSlug) {
      const match = SERVICES_LIST.find((s) => s.slug === initialServiceSlug);
      if (match) setSelectedService(match);
    }
  }, [initialServiceSlug, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[88vh] rounded-3xl bg-white border border-[#EAEAEA] shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#847445] font-bold">
                CYK Service Master Registry
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-semibold">13 End-to-End Offerings</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#14181F] mt-0.5">
              Comprehensive F&B Consultancy Services
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Service Menu + Right Service Dossier */}
        <div className="flex-1 grid md:grid-cols-12 overflow-hidden">

          {/* Left Service Menu (13 Services) */}
          <div className="md:col-span-5 border-r border-[#EAEAEA] overflow-y-auto p-4 space-y-1.5 bg-slate-50/50">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 py-1 block">
              Select Offering:
            </span>

            {SERVICES_LIST.map((srv) => (
              <button
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center justify-between text-xs cursor-pointer ${selectedService.id === srv.id
                  ? 'bg-[#847445] text-white font-bold shadow-md shadow-[#847445]/20'
                  : 'text-slate-700 hover:bg-white'
                  }`}
              >
                <div>
                  <div className="font-bold">{srv.title}</div>
                  <div className={`text-[10px] ${selectedService.id === srv.id ? 'text-white/90' : 'text-slate-500'}`}>
                    Stage {srv.stageNumber + 1}: {srv.stageName}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
              </button>
            ))}
          </div>

          {/* Right Service Details */}
          <div className="md:col-span-7 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white">

            {/* Header of active service */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#847445]/10 text-[#847445] border border-[#847445]/20">
                  Stage {selectedService.stageNumber + 1}: {selectedService.stageName}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {selectedService.category}
                </span>
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14181F]">
                {selectedService.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {selectedService.fullDesc}
              </p>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#847445] font-bold mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Key Deliverables Checklist
              </h4>
              <div className="grid gap-2">
                {selectedService.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-[#EAEAEA] text-xs text-slate-800">
                    <CheckCircle className="w-4 h-4 text-[#847445] shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Timeline & Why CYK */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-[#EAEAEA] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#847445]" />
                  <span>Estimated Duration:</span>
                </div>
                <div className="font-display font-bold text-base text-[#16191E]">
                  {selectedService.duration}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-[#EAEAEA] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                  <Award className="w-3.5 h-3.5 text-[#847445]" />
                  <span>CYK Advantage:</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {selectedService.whyCYK}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onSelectStage(selectedService.stageNumber);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white font-bold text-xs shadow-md shadow-[#847445]/20 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Jump to Stage {selectedService.stageNumber + 1} on Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/918285288098?text=Hello%20CYK,%20I%20am%20interested%20in%20your%20${encodeURIComponent(selectedService.title)}%20service.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-[#EAEAEA] transition-colors"
              >
                Ask Questions on WhatsApp
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
