import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenEnquiry: () => void;
  onOpenServices: (slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEnquiry, onOpenServices }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-white border-t border-[#EAEAEA] text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Identity & Official Corporate Office */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <img 
                src="/cyk-logo.png" 
                alt="CYK Hospitalities Pvt. Ltd." 
                className="h-12 w-auto object-contain mb-2" 
              />
            </a>
            
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
              Turnkey F&B and restaurant consultants. From concept development and kitchen engineering to culinary R&D, real estate leasing, and franchise expansion.
            </p>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-800">Corporate Headquarters:</div>
              <div>Unit 201, 2nd Floor, Good Earth City Centre, Sector 50, Gurugram, Haryana 122018</div>
              <div>Contact: <a href="mailto:conceptyourkitchen@gmail.com" className="text-slate-800 underline hover:text-[#847445]">conceptyourkitchen@gmail.com</a></div>
              <div>Phone: <a href="tel:+918285288098" className="text-slate-800 underline hover:text-[#847445]">+91 82852 88098</a></div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase font-bold text-slate-900 tracking-wider">
              Consultancy
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenServices('concept')} className="hover:text-[#847445] transition-colors text-left">
                  Concept & Dining Proposition
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('kitchen')} className="hover:text-[#847445] transition-colors text-left">
                  Commercial Kitchen Planning
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('menu')} className="hover:text-[#847445] transition-colors text-left">
                  Recipe & Menu R&D
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('leasing')} className="hover:text-[#847445] transition-colors text-left">
                  Real Estate & Mall Leasing
                </button>
              </li>
              <li>
                <button onClick={() => onOpenServices('franchise')} className="hover:text-[#847445] transition-colors text-left">
                  Franchise & Expansion Strategy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase font-bold text-slate-900 tracking-wider">
              Explore
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#journey" className="hover:text-[#847445] transition-colors">The 8-Stage Journey</a></li>
              <li><a href="#projects" className="hover:text-[#847445] transition-colors">Delivered Work</a></li>
              <li><a href="#testimonials" className="hover:text-[#847445] transition-colors">Client Testimonials</a></li>
              <li><a href="#about" className="hover:text-[#847445] transition-colors">Why CYK</a></li>
              <li><a href="#horeca-talks" className="hover:text-[#847445] transition-colors">HoReCa Talks</a></li>
            </ul>
          </div>

          {/* Col 4: Action */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs uppercase font-bold text-slate-900 tracking-wider">
              Start Project
            </h5>
            <p className="text-xs text-slate-500">
              Consult directly with our culinary, operational, and leasing specialists.
            </p>
            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#847445] hover:bg-[#6E6038] text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Begin Discovery</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} CYK Hospitalities Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setLegalModal('privacy')} className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setLegalModal('terms')} className="hover:text-slate-600 transition-colors">
              Terms of Engagement
            </button>
            <a 
              href="https://x.com/CykLtd" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-600 transition-colors"
            >
              @CykLtd
            </a>
          </div>
        </div>
      </div>

      {/* Legal modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-xl border border-[#EAEAEA]">
            <h4 className="font-display font-bold text-lg text-slate-900">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Engagement'}
            </h4>
            <div className="text-xs text-slate-600 space-y-2 max-h-60 overflow-y-auto leading-relaxed">
              <p>
                CYK Hospitalities Pvt. Ltd. respects client confidentiality. All concept sketches, culinary formulations, financial models, and site intelligence shared during advisory engagements are covered under reciprocal non-disclosure protections.
              </p>
              <p>
                Inquiries submitted through this site are processed strictly for project feasibility evaluation and advisory correspondence.
              </p>
            </div>
            <div className="pt-2 border-t border-[#EAEAEA]">
              <button 
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
