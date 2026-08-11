import React from 'react';
import { CategoryType } from '../types';
import { CITIES_LIST } from '../data/seedData';
import { MapPin, X, Search } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

export const CATEGORY_ITEMS: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'donar', label: 'Dónde donar dinero', icon: '💰' },
  { key: 'acopio', label: 'Puntos de acopio', icon: '📦' },
  { key: 'necesidades', label: 'Qué se necesita ahora', icon: '🆘' },
  { key: 'hub', label: 'Iniciativas por ciudad', icon: '🏘️' },
  { key: 'buscar', label: 'Buscar personas y mascotas', icon: '🔍' },
  { key: 'contactos', label: 'Contactos oficiales', icon: '📞' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  onClearFilters,
  resultsCount
}) => {
  const hasActiveFilters = selectedCity !== 'Todas' || searchQuery.trim().length > 0;

  return (
    <section id="tabsAnchor" className="sticky top-[58px] sm:top-[68px] z-40 bg-[#FAF7F1]/95 backdrop-blur-md border-y border-[#E9E1D2] py-4 px-4 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        
        {/* LEVEL 1: Primary Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
          {CATEGORY_ITEMS.map((item) => {
            const isActive = activeCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectCategory(item.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0B2A4A] text-white shadow-md ring-2 ring-[#0B2A4A]'
                    : 'bg-white text-[#7A7264] border border-[#E9E1D2] hover:bg-[#FAF7F1] hover:text-[#0B2A4A]'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* LEVEL 2: Secondary Filter Bar (Search + City Selector) */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E9E1D2] shadow-xs flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7264] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrar o buscar palabras en esta categoría (banco, ciudad, medicinas...)"
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] text-[#1E1B16] placeholder:text-[#7A7264] focus:outline-none focus:ring-2 focus:ring-[#1D5DBF] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A7264] hover:text-[#0B2A4A] font-bold bg-[#E9E1D2] hover:bg-[#d8cfbe] rounded-full w-4 h-4 flex items-center justify-center"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* Architectural Sub-level: City Selector Dropdown */}
          <div className="relative inline-flex items-center w-full sm:w-auto shrink-0">
            <MapPin className="w-3.5 h-3.5 absolute left-3.5 text-[#1D5DBF] pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-8 py-2 text-xs sm:text-sm font-extrabold bg-[#EAF1FB] border border-[#1D5DBF]/30 text-[#0B2A4A] rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1D5DBF] hover:bg-[#d8e7fa] transition-colors"
            >
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c === 'Todas' ? '📍 Filtrar por ciudad (Todas)' : `📍 Ciudad: ${c}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Status & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-[#7A7264] px-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-[#0B2A4A] bg-white px-3 py-1 rounded-lg border border-[#E9E1D2]">
              {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </span>

            {selectedCity !== 'Todas' && (
              <span className="inline-flex items-center gap-1 bg-[#EAF1FB] text-[#1D5DBF] font-bold px-2.5 py-0.5 rounded-md border border-[#1D5DBF]/20">
                <span>Ciudad: {selectedCity}</span>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#FFF6E2] text-[#8A5A00] font-bold px-2.5 py-0.5 rounded-md border border-[#FFB81C]/30">
                <span>Búsqueda: "{searchQuery}"</span>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C1443B] hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

