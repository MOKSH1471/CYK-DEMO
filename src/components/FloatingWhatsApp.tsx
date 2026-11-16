import React from 'react';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href="https://wa.me/918285288098?text=Hello%20CYK%20Hospitalities,%20I%20would%20like%20to%20discuss%20a%20food%20business%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </div>
  );
};
