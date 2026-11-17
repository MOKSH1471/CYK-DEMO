import React, { useState, useEffect } from 'react';
import {
  X, Check, ArrowRight, ArrowLeft, Send, CheckCircle,
  MapPin, Sparkles, MessageSquare
} from 'lucide-react';

interface EnquiryWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialStageIndex?: number;
}

interface FormData {
  currentStage: string;
  format: string;
  servicesNeeded: string[];
  city: string;
  budget: string;
  timeline: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export const EnquiryWizard: React.FC<EnquiryWizardProps> = ({
  isOpen,
  onClose,
  initialStageIndex
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    currentStage: "Idea stage with budget",
    format: "Dine-in Restaurant",
    servicesNeeded: ["Concept Ideation & Proposition"],
    city: "",
    budget: "50 Lakhs - 1 Crore",
    timeline: "1 - 3 months",
    fullName: "",
    phone: "",
    email: "",
    notes: ""
  });

  useEffect(() => {
    if (initialStageIndex !== undefined) {
      if (initialStageIndex === 0) setForm(prev => ({ ...prev, currentStage: "Idea stage with budget" }));
      if (initialStageIndex === 2) setForm(prev => ({ ...prev, currentStage: "Prime commercial space already acquired" }));
      if (initialStageIndex >= 6) setForm(prev => ({ ...prev, currentStage: "Ready for franchise & nationwide expansion" }));
    }
  }, [initialStageIndex, isOpen]);

  if (!isOpen) return null;

  const handleToggleService = (service: string) => {
    setForm(prev => {
      const exists = prev.servicesNeeded.includes(service);
      if (exists) {
        return { ...prev, servicesNeeded: prev.servicesNeeded.filter(s => s !== service) };
      } else {
        return { ...prev, servicesNeeded: [...prev.servicesNeeded, service] };
      }
    });
  };

  const generateWhatsAppMessage = () => {
    const text = `Hello CYK Hospitalities,\n\nI just filled out your Website Discovery Enquiry:\n\n` +
      `• Name: ${form.fullName}\n` +
      `• Phone: ${form.phone}\n` +
      `• City: ${form.city}\n` +
      `• Project Stage: ${form.currentStage}\n` +
      `• Format: ${form.format}\n` +
      `• Budget: ${form.budget}\n` +
      `• Services Needed: ${form.servicesNeeded.join(', ')}\n\n` +
      `I would like to schedule an introductory consultation with Pulkit Arora or Simranjeet Singh.`;
    return encodeURIComponent(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-[#EAEAEA] p-6 sm:p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header & Step Tracker */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#847445] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Structured Discovery Enquiry
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Step {currentStep} of 5
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#847445] transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* STEP 1: Current Status */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">
                      Where are you currently in your project?
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      Helps our directors assign the right hospitality advisory team.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { label: "Idea stage with budget", desc: "You have a food concept vision and capital to invest." },
                      { label: "Prime commercial space already acquired", desc: "You have a retail location or hotel and need the right culinary concept." },
                      { label: "Operating 1-3 outlets", desc: "You have an active brand and need kitchen optimization or prime leasing." },
                      { label: "Ready for franchise & nationwide expansion", desc: "You want FOCO/FOFO modeling and multi-city rollouts." }
                    ].map((opt) => (
                      <label
                        key={opt.label}
                        className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${form.currentStage === opt.label
                          ? 'bg-[#847445]/10 border-[#847445] text-slate-900 shadow-sm'
                          : 'bg-white border-[#EAEAEA] text-slate-700 hover:border-slate-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name="currentStage"
                          checked={form.currentStage === opt.label}
                          onChange={() => setForm({ ...form, currentStage: opt.label })}
                          className="mt-1 accent-[#847445]"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900">{opt.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Format & Concept */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">
                      What dining format are you creating?
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      We engineer floor plans, exhaust requirements, and menus according to dining volume.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Cafe & Bistro",
                      "Dine-in Restaurant",
                      "Quick Service (QSR)",
                      "Bar, Brewery & Lounge",
                      "Cloud Kitchen / Commissary",
                      "Bakery & Dessert Parlour"
                    ].map((fmt) => (
                      <button
                        type="button"
                        key={fmt}
                        onClick={() => setForm({ ...form, format: fmt })}
                        className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${form.format === fmt
                          ? 'bg-[#847445] text-white border-[#847445] shadow-md shadow-[#847445]/20'
                          : 'bg-slate-50 text-slate-700 border-[#EAEAEA] hover:border-slate-400'
                          }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Services Needed */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">
                      Which CYK services do you require?
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      Select all that apply. CYK provides both modular advisory and turnkey execution.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {[
                      "Concept Ideation & Proposition",
                      "Commercial Kitchen Architecture & Layout",
                      "Recipe Formulation & Menu Engineering",
                      "Location Scouting & Mall Retail Leasing",
                      "Chef & Kitchen Staff Hiring / Training",
                      "Pre-Opening Operations SOPs & Drills",
                      "Brand Identity & Packaging Design",
                      "Franchise Modeling & Documentation"
                    ].map((srv) => {
                      const isSelected = form.servicesNeeded.includes(srv);
                      return (
                        <button
                          type="button"
                          key={srv}
                          onClick={() => handleToggleService(srv)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${isSelected
                            ? 'bg-[#847445]/10 border-[#847445] text-[#847445] font-bold'
                            : 'bg-white border-[#EAEAEA] text-slate-700 hover:border-slate-400'
                            }`}
                        >
                          <span>{srv}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#847445] shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: City, Timeline & Budget */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">
                      Project Parameters
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      Target territory and investment scale.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#847445]" />
                        Target City / Region
                      </label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Gurugram, Delhi NCR, Bareilly, Meerut, Agra"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#847445] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                          Estimated Budget (INR)
                        </label>
                        <select
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 focus:outline-none focus:border-[#847445] focus:bg-white cursor-pointer"
                        >
                          <option value="Under 25 Lakhs">Under 25 Lakhs</option>
                          <option value="25 - 50 Lakhs">25 - 50 Lakhs</option>
                          <option value="50 Lakhs - 1 Crore">50 Lakhs - 1 Crore</option>
                          <option value="1 Crore - 2.5 Crore">1 Crore - 2.5 Crore</option>
                          <option value="2.5 Crore+">2.5 Crore+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                          Desired Launch Timeline
                        </label>
                        <select
                          value={form.timeline}
                          onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 focus:outline-none focus:border-[#847445] focus:bg-white cursor-pointer"
                        >
                          <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
                          <option value="1 - 3 months">1 - 3 months</option>
                          <option value="3 - 6 months">3 - 6 months</option>
                          <option value="6+ months (Planning)">6+ months (Planning)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Contact Details */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-black text-2xl text-[#14181F]">
                      Where should our directors send your brief?
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      All submissions are strictly confidential.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#847445] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                          Phone Number (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#847445] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@domain.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#847445] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Project Notes / Specific Vision (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Tell us about your culinary direction, target mall/high-street, or current stage."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#EAEAEA] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#847445] focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white text-xs font-bold transition-all shadow-md shadow-[#847445]/20 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#847445] hover:bg-[#6E6038] text-white text-xs font-bold transition-all shadow-md shadow-[#847445]/30 hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Connect</span>
                  </button>
                )}
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#14181F]">
                Enquiry Received!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Thank you, <strong>{form.fullName}</strong>. Your project profile has been routed to CYK directors <strong>Pulkit Arora</strong> and <strong>Simranjeet Singh</strong>. We guarantee a preliminary response within 24 hours.
              </p>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#EAEAEA] text-left space-y-3">
              <div className="text-xs font-mono text-[#847445] font-bold uppercase tracking-wider">
                Fast-Track on WhatsApp:
              </div>
              <p className="text-xs text-slate-600">
                Want immediate feedback? We have pre-formatted your exact enquiry parameters into a one-click WhatsApp message directly to our desk.
              </p>

              <a
                href={`https://wa.me/918285288098?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send via WhatsApp (+91 82852 88098)</span>
              </a>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                onClose();
              }}
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              Done & Return to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
