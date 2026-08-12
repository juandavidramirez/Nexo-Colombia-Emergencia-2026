import React from 'react';
import { EmergencyBalance, CategoryType } from '../types';
import { Activity, ShieldAlert, Heart, MapPin, Building2, PhoneCall, Sparkles, Search, AlertTriangle } from 'lucide-react';

interface SiteMetricsData {
  donar: number;
  acopio: number;
  necesidades: number;
  hub: number;
  buscar: number;
  contactos: number;
  iniciativas?: number;
  donaciones?: number;
}

interface DashboardMetricsProps {
  siteMetrics: SiteMetricsData;
  balance: EmergencyBalance;
  onSelectCategory?: (category: CategoryType) => void;
}

/**
 * Upper Banner: Balance oficial de la emergencia
 * Standalone horizontal bar card with identical sizing and responsive layout
 */
export const EmergencyBalanceBanner: React.FC<{ balance: EmergencyBalance }> = ({ balance }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#FFB81C] p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Header (Cohesive with other platform cards, with a hint of warm brand styling) */}
      <div className="flex items-center gap-2.5 lg:max-w-[35%] shrink-0">
        <div className="p-1.5 sm:p-2 rounded-xl bg-[#FFF6E2] border border-[#FFB81C]/40 text-[#8A5A00] shrink-0">
          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-[#0B2A4A] uppercase tracking-wider leading-tight">
            Balance oficial de la emergencia
          </h3>
          <p className="text-[10px] sm:text-xs text-[#7A7264] font-semibold mt-0.5 leading-tight">
            {balance.fuente} · {balance.actualizado}
          </p>
        </div>
      </div>

      {/* 4 Indicator Scorecards styled in exact harmony with PlatformMobilizationMetrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
        <div className="bg-[#FAF7F1] border border-[#E9E1D2] px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-1.5 min-w-0 shadow-3xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#5B6B7A] truncate text-left">
            Fallecidos
          </span>
          <span className="text-xs sm:text-sm font-black text-[#C1443B] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#E9E1D2]/80">
            {balance.muertos}
          </span>
        </div>

        <div className="bg-[#FAF7F1] border border-[#E9E1D2] px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-1.5 min-w-0 shadow-3xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#5B6B7A] truncate text-left">
            Heridos
          </span>
          <span className="text-xs sm:text-sm font-black text-[#8A5A00] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#E9E1D2]/80">
            {balance.heridos}
          </span>
        </div>

        <div className="bg-[#FAF7F1] border border-[#E9E1D2] px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-1.5 min-w-0 shadow-3xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#5B6B7A] truncate text-left">
            Desaparecidos
          </span>
          <span className="text-xs sm:text-sm font-black text-[#7A7264] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#E9E1D2]/80">
            {balance.desaparecidos}
          </span>
        </div>

        {/* Highlighted in Blue for brand identity instead of green */}
        <div className="bg-[#EAF1FB] border border-[#1D5DBF]/40 px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-1.5 min-w-0 shadow-3xs w-full">
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] sm:text-xs font-extrabold text-[#1D5DBF] truncate text-left">
              Con vida
            </span>
            <Sparkles className="w-3 h-3 text-[#1D5DBF] animate-pulse shrink-0 hidden sm:inline-block" />
          </div>
          <span className="text-xs sm:text-sm font-black text-[#1D5DBF] shrink-0 bg-white px-2 py-0.5 rounded-lg border border-[#1D5DBF]/30">
            {balance.encontrados_con_vida}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Lower Section: Movilización en la plataforma
 * 6 Scorecards in 100% responsive full grid layout
 */
export const PlatformMobilizationMetrics: React.FC<{
  siteMetrics: SiteMetricsData;
  onSelectCategory?: (category: CategoryType) => void;
}> = ({ siteMetrics, onSelectCategory }) => {
  const categoriesInOrder: {
    key: CategoryType;
    label: string;
    count: number;
    icon: React.ReactNode;
    hoverBorder: string;
    iconColor: string;
  }[] = [
    {
      key: 'donar',
      label: 'Cuentas donación',
      count: siteMetrics.donar ?? siteMetrics.donaciones ?? 0,
      icon: <Heart className="w-3.5 h-3.5 shrink-0 text-[#2F8F5B]" />,
      hoverBorder: 'hover:border-[#2F8F5B]',
      iconColor: 'text-[#2F8F5B]'
    },
    {
      key: 'acopio',
      label: 'Puntos de acopio',
      count: siteMetrics.acopio ?? 0,
      icon: <MapPin className="w-3.5 h-3.5 shrink-0 text-[#8A5A00]" />,
      hoverBorder: 'hover:border-[#FFB81C]',
      iconColor: 'text-[#8A5A00]'
    },
    {
      key: 'necesidades',
      label: 'Necesidades',
      count: siteMetrics.necesidades ?? 0,
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#C1443B]" />,
      hoverBorder: 'hover:border-[#C1443B]',
      iconColor: 'text-[#C1443B]'
    },
    {
      key: 'hub',
      label: 'Iniciativas y serv.',
      count: siteMetrics.hub ?? siteMetrics.iniciativas ?? 0,
      icon: <Building2 className="w-3.5 h-3.5 shrink-0 text-[#1D5DBF]" />,
      hoverBorder: 'hover:border-[#1D5DBF]',
      iconColor: 'text-[#1D5DBF]'
    },
    {
      key: 'buscar',
      label: 'Búsquedas',
      count: siteMetrics.buscar ?? 0,
      icon: <Search className="w-3.5 h-3.5 shrink-0 text-[#8A5A00]" />,
      hoverBorder: 'hover:border-[#8A5A00]',
      iconColor: 'text-[#8A5A00]'
    },
    {
      key: 'contactos',
      label: 'Contactos',
      count: siteMetrics.contactos ?? 0,
      icon: <PhoneCall className="w-3.5 h-3.5 shrink-0 text-[#0B2A4A]" />,
      hoverBorder: 'hover:border-[#0B2A4A]',
      iconColor: 'text-[#0B2A4A]'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E9E1D2] p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Header (Left aligned & centered vertically on tablet/desktop) */}
      <div className="flex items-center gap-2.5 md:max-w-[28%] shrink-0">
        <div className="p-1.5 sm:p-2 rounded-xl bg-[#EAF1FB] text-[#1D5DBF] shrink-0">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-[#0B2A4A] uppercase tracking-wider leading-tight">
            Movilización activa en Nexo
          </h3>
          <p className="text-[10px] sm:text-xs text-[#7A7264] font-semibold mt-0.5 leading-tight">
            Recursos y puntos verificados
          </p>
        </div>
      </div>

      {/* 6 Indicator Scorecards in compact 2-column layout (center and right) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        {categoriesInOrder.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory?.(cat.key)}
            className={`bg-[#FAF7F1] border border-[#E9E1D2] ${cat.hoverBorder} px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between gap-1.5 min-w-0 shadow-3xs cursor-pointer hover:shadow-2xs active:scale-95 group w-full`}
            title={`Ver ${cat.label}`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="shrink-0">
                {cat.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-[#5B6B7A] truncate group-hover:text-[#0B2A4A] transition-colors text-left">
                {cat.label}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black text-[#0B2A4A] shrink-0 ml-1.5 bg-white px-2 py-0.5 rounded-lg border border-[#E9E1D2]/80 group-hover:border-[#1D5DBF]/40 transition-colors">
              {cat.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ siteMetrics, balance, onSelectCategory }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4 flex flex-col gap-3">
      <EmergencyBalanceBanner balance={balance} />
      <PlatformMobilizationMetrics siteMetrics={siteMetrics} onSelectCategory={onSelectCategory} />
    </div>
  );
};


