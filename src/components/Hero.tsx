import React from 'react';
import { Search, PlusCircle, ShieldCheck, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { EmergencyBalance } from '../types';

interface HeroProps {
  balance: EmergencyBalance;
  onScrollToTabs: () => void;
  onOpenShareModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToTabs, onOpenShareModal }) => {
  return (
    <section className="pt-6 pb-2 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Main Container White Section */}
      <div className="bg-white rounded-3xl border border-[#E9E1D2] p-6 sm:p-8 shadow-xs flex flex-col gap-6 relative overflow-hidden">
        
        {/* TOP SECTION: Hero Headline, Description & Action Buttons */}
        <div>
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0B2A4A] tracking-tight leading-[1.12] mb-4">
            Conectemos cada ayuda con quien la necesita.
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-[#5B6B7A] leading-relaxed mb-6 font-medium max-w-3xl">
            Si necesitas ayuda o quieres darla, aquí encuentras información verificada: puntos de acopio y albergues, donaciones, contactos oficiales e iniciativas y servicios — todo en un solo lugar.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={onScrollToTabs}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>Buscar información</span>
            </button>

            <button
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C1443B] hover:bg-[#A83830] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Comparte información</span>
            </button>
          </div>

          {/* Sub-label metadata underneath buttons */}
          <div className="mt-5 pt-4.5 border-t border-[#E9E1D2]/40 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#7A7264] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2F8F5B] shrink-0 animate-pulse" />
              <span>Iniciativa impulsada y respaldada por los Global Shapers de Colombia y Venezuela</span>
            </div>
            <div className="hidden sm:inline text-[#E9E1D2]">|</div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2F8F5B]" />
              <span>Revisado por voluntarios</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
