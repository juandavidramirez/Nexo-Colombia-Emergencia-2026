import React from 'react';
import { EmergencyBalance } from '../types';
import { Activity, ShieldAlert, Heart, MapPin, Building2, PhoneCall, Sparkles } from 'lucide-react';

interface DashboardMetricsProps {
  siteMetrics: {
    iniciativas: number;
    acopio: number;
    donaciones: number;
    contactos: number;
  };
  balance: EmergencyBalance;
}

/**
 * Upper Banner: Balance oficial de la emergencia
 * Standalone horizontal bar card with identical sizing and responsive layout
 */
export const EmergencyBalanceBanner: React.FC<{ balance: EmergencyBalance }> = ({ balance }) => {
  return (
    <div className="bg-[#FFF6E2] rounded-2xl border border-[#FFB81C] p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <div className="p-2 rounded-xl bg-[#FFB81C]/30 text-[#8A5A00] shrink-0">
          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-[#5C3C00] uppercase tracking-wider leading-none truncate">
            Balance oficial de la emergencia
          </h3>
          <p className="text-[10px] sm:text-xs text-[#8A5A00]/80 font-semibold mt-1 truncate">
            {balance.fuente} · {balance.actualizado}
          </p>
        </div>
      </div>

      {/* 4 Indicator Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
        <div className="bg-white/90 border border-[#FFB81C]/40 px-3 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#5C3C00] leading-none shrink-0">{balance.muertos}</span>
          <span className="text-xs font-bold text-[#5C3C00] truncate">Fallecidos</span>
        </div>

        <div className="bg-white/90 border border-[#FFB81C]/40 px-3 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#5C3C00] leading-none shrink-0">{balance.heridos}</span>
          <span className="text-xs font-bold text-[#5C3C00] truncate">Heridos</span>
        </div>

        <div className="bg-white/90 border border-[#FFB81C]/40 px-3 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#5C3C00] leading-none shrink-0">{balance.desaparecidos}</span>
          <span className="text-xs font-bold text-[#5C3C00] truncate">Desaparecidos</span>
        </div>

        <div className="bg-[#E7F4EC] border border-[#2F8F5B] px-3 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-1.5 min-w-0 shadow-2xs">
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#1E5C3A] leading-none shrink-0">{balance.encontrados_con_vida}</span>
          <span className="text-xs font-extrabold text-[#1E5C3A] truncate">Con vida</span>
          <Sparkles className="w-3.5 h-3.5 text-[#2F8F5B] animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );
};

/**
 * Lower Section: Movilización en la plataforma
 * Standalone horizontal bar card with identical sizing and responsive layout
 */
export const PlatformMobilizationMetrics: React.FC<{
  siteMetrics: {
    iniciativas: number;
    acopio: number;
    donaciones: number;
    contactos: number;
  };
}> = ({ siteMetrics }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E9E1D2] p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 min-w-0 shrink-0">
        <div className="p-2 rounded-xl bg-[#EAF1FB] text-[#1D5DBF] shrink-0">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-[#0B2A4A] uppercase tracking-wider leading-none truncate">
            Movilización activa en Nexo
          </h3>
          <p className="text-[10px] sm:text-xs text-[#7A7264] font-semibold mt-1 truncate">
            Recursos y puntos verificados en Colombia
          </p>
        </div>
      </div>

      {/* 4 Indicator Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
        <div className="bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#1D5DBF] px-3 py-2 sm:py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D5DBF] shrink-0" />
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#0B2A4A] leading-none shrink-0">{siteMetrics.iniciativas}</span>
          <span className="text-xs font-bold text-[#5B6B7A] truncate">Iniciativas</span>
        </div>

        <div className="bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#FFB81C] px-3 py-2 sm:py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A5A00] shrink-0" />
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#0B2A4A] leading-none shrink-0">{siteMetrics.acopio}</span>
          <span className="text-xs font-bold text-[#5B6B7A] truncate">Puntos</span>
        </div>

        <div className="bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#2F8F5B] px-3 py-2 sm:py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2F8F5B] shrink-0" />
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#0B2A4A] leading-none shrink-0">{siteMetrics.donaciones}</span>
          <span className="text-xs font-bold text-[#5B6B7A] truncate">Cuentas</span>
        </div>

        <div className="bg-[#FAF7F1] border border-[#E9E1D2] hover:border-[#0B2A4A] px-3 py-2 sm:py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 min-w-0 shadow-2xs">
          <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0B2A4A] shrink-0" />
          <span className="text-sm sm:text-base lg:text-lg font-black text-[#0B2A4A] leading-none shrink-0">{siteMetrics.contactos}</span>
          <span className="text-xs font-bold text-[#5B6B7A] truncate">Contactos</span>
        </div>
      </div>
    </div>
  );
};

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ siteMetrics, balance }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4 flex flex-col gap-3">
      <EmergencyBalanceBanner balance={balance} />
      <PlatformMobilizationMetrics siteMetrics={siteMetrics} />
    </div>
  );
};

