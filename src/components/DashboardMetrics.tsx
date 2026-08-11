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
          <p className="text-[11px] sm:text-xs text-[#8A5A00]/90 font-bold mt-1 leading-snug">
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
 * 6 Scorecards in exact sequence matching the navigation option bar
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
      icon: <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#2F8F5B]" />,
      hoverBorder: 'hover:border-[#2F8F5B]',
      iconColor: 'text-[#2F8F5B]'
    },
    {
      key: 'acopio',
      label: 'Puntos de acopio',
      count: siteMetrics.acopio ?? 0,
      icon: <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#8A5A00]" />,
      hoverBorder: 'hover:border-[#FFB81C]',
      iconColor: 'text-[#8A5A00]'
    },
    {
      key: 'necesidades',
      label: 'Necesidades',
      count: siteMetrics.necesidades ?? 0,
      icon: <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#C1443B]" />,
      hoverBorder: 'hover:border-[#C1443B]',
      iconColor: 'text-[#C1443B]'
    },
    {
      key: 'hub',
      label: 'Iniciativas',
      count: siteMetrics.hub ?? siteMetrics.iniciativas ?? 0,
      icon: <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#1D5DBF]" />,
      hoverBorder: 'hover:border-[#1D5DBF]',
      iconColor: 'text-[#1D5DBF]'
    },
    {
      key: 'buscar',
      label: 'Búsquedas',
      count: siteMetrics.buscar ?? 0,
      icon: <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#8A5A00]" />,
      hoverBorder: 'hover:border-[#8A5A00]',
      iconColor: 'text-[#8A5A00]'
    },
    {
      key: 'contactos',
      label: 'Contactos',
      count: siteMetrics.contactos ?? 0,
      icon: <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#0B2A4A]" />,
      hoverBorder: 'hover:border-[#0B2A4A]',
      iconColor: 'text-[#0B2A4A]'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E9E1D2] p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 overflow-hidden">
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

      {/* 6 Indicator Scorecards matching option bar sequence */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 w-full xl:w-auto shrink-0">
        {categoriesInOrder.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelectCategory?.(cat.key)}
            className={`bg-[#FAF7F1] border border-[#E9E1D2] ${cat.hoverBorder} px-3 py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 min-w-0 shadow-2xs cursor-pointer hover:shadow-xs active:scale-95 group text-left`}
            title={`Ver ${cat.label}`}
          >
            {cat.icon}
            <span className="text-sm sm:text-base font-black text-[#0B2A4A] leading-none shrink-0">
              {cat.count}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[#5B6B7A] truncate group-hover:text-[#0B2A4A] transition-colors">
              {cat.label}
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


