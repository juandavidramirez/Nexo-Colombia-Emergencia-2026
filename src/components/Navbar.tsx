import React from 'react';
import { PhoneCall, ArrowLeft, HeartHandshake, Info } from 'lucide-react';
import { ViewPage } from '../types';

interface NavbarProps {
  currentPage: ViewPage;
  onNavigate: (page: ViewPage) => void;
  onOpenContactModal: () => void;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenContactModal,
  onOpenShareModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E9E1D2] shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 w-full">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-1"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[#0B2A4A] flex items-center justify-center text-[#FFB81C] font-black text-base sm:text-lg shadow-[0_0_0_3px_#FFF6E2] group-hover:scale-105 transition-transform shrink-0">
            NC
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B2A4A] leading-none tracking-tight flex items-center gap-2 truncate">
              Nexo Colombia
            </div>
            <div className="text-[11px] sm:text-xs md:text-sm font-bold text-[#1D5DBF] leading-tight mt-0.5 sm:mt-1 truncate max-w-xs sm:max-w-md lg:max-w-xl">
              Centro de información curada y verificada en respuesta a la emergencia
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
          {currentPage === 'quienes-somos' ? (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#1D5DBF] bg-[#EAF1FB] hover:bg-[#d6e4f8] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Volver al sitio</span>
            </button>
          ) : (
            <>
              {/* Quiénes somos tab */}
              <button
                onClick={() => onNavigate('quienes-somos')}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B2A4A] hover:bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#0B2A4A] transition-colors cursor-pointer"
                title="Quiénes somos"
              >
                <Info className="w-4 h-4 text-[#1D5DBF] shrink-0" />
                <span className="hidden md:inline">Quiénes somos</span>
              </button>

              {/* Contacto tab */}
              <button
                onClick={onOpenContactModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B2A4A] hover:bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#0B2A4A] transition-colors cursor-pointer"
                title="Contacto"
              >
                <PhoneCall className="w-4 h-4 text-[#2F8F5B] shrink-0" />
                <span className="hidden md:inline">Contacto</span>
              </button>

              {/* Comparte información */}
              <button
                onClick={onOpenShareModal}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#C1443B] hover:bg-[#A83830] shadow-xs transition-all active:scale-[0.98] shrink-0 cursor-pointer"
                title="Comparte información"
              >
                <HeartHandshake className="w-4 h-4 text-white shrink-0" />
                <span className="hidden sm:inline">Comparte información</span>
                <span className="sm:hidden">Compartir</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ribbon header accent */}
      <div className="ribbon-gradient" />
    </header>
  );
};

