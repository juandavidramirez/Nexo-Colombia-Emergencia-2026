import React, { useRef, useState, useEffect } from 'react';
import { CategoryType } from '../types';
import { CITIES_LIST } from '../data/seedData';
import { MapPin, X, Search, ChevronLeft, ChevronRight, SlidersHorizontal, PlusCircle, ShieldCheck } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  categorySubFilter: string;
  onSelectCategorySubFilter: (filter: string) => void;
  verifiedFilter: string;
  onSelectVerifiedFilter: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  resultsCount: number;
  onOpenReportModal?: () => void;
}

export const CATEGORY_ITEMS: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'donar', label: 'Dónde donar dinero', icon: '💰' },
  { key: 'acopio', label: 'Puntos de acopio y albergues', icon: '📦' },
  { key: 'necesidades', label: 'Qué se necesita ahora', icon: '🆘' },
  { key: 'hub', label: 'Iniciativa y servicio', icon: '🏘️' },
  { key: 'buscar', label: 'Buscar personas y mascotas', icon: '🔍' },
  { key: 'contactos', label: 'Contactos oficiales', icon: '📞' },
];

export function getCategorySubFilterConfig(category: CategoryType) {
  switch (category) {
    case 'donar':
      return {
        label: 'Tipo de transferencia',
        options: [
          { value: 'Todas', label: '💳 Transf.: (Todas)' },
          { value: 'Nacional', label: '💳 Transf.: Nacional' },
          { value: 'Internacional', label: '💳 Transf.: Internacional' },
          { value: 'Ambas', label: '💳 Transf.: Ambas' },
        ]
      };
    case 'acopio':
      return {
        label: 'Tipo de espacio',
        options: [
          { value: 'Todos', label: '📦 Espacio: (Todos)' },
          { value: 'Puntos de acopio', label: '📦 Puntos de acopio' },
          { value: 'Albergues y refugios', label: '📦 Albergues y refugios' },
        ]
      };
    case 'necesidades':
      return {
        label: 'Nivel de urgencia',
        options: [
          { value: 'Todas', label: '🆘 Urgencia: (Todas)' },
          { value: 'Alta / Inmediata', label: '🆘 Urgencia: Alta' },
          { value: 'Media', label: '🆘 Urgencia: Media' },
          { value: 'Baja', label: '🆘 Urgencia: Baja' },
        ]
      };
    case 'hub':
      return {
        label: 'Tipo de servicio',
        options: [
          { value: 'Todas', label: '🏘️ Servicio: (Todos)' },
          { value: 'Voluntariado', label: '🏘️ Voluntariado' },
          { value: 'Salud y Brigadas', label: '🏘️ Salud y Brigadas' },
          { value: 'Logística y Transporte', label: '🏘️ Logística y Transporte' },
          { value: 'Atención e Insumos', label: '🏘️ Atención e Insumos' },
        ]
      };
    case 'buscar':
      return {
        label: 'Tipo de búsqueda',
        options: [
          { value: 'Todos', label: '🔍 Búsqueda: (Todos)' },
          { value: 'Personas', label: '👤 Personas' },
          { value: 'Mascotas', label: '🐾 Mascotas' },
        ]
      };
    case 'contactos':
      return {
        label: 'Tipo de entidad',
        options: [
          { value: 'Todas', label: '📞 Entidad: (Todas)' },
          { value: 'Organismos de Socorro', label: '📞 Org. Socorro' },
          { value: 'Alcaldía y Gobernación', label: '📞 Alcaldía / Gob.' },
          { value: 'Salud y Emergencias', label: '📞 Salud / Emerg.' },
        ]
      };
    default:
      return {
        label: 'Filtro',
        options: [{ value: 'Todas', label: 'Todas' }]
      };
  }
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  categorySubFilter,
  onSelectCategorySubFilter,
  verifiedFilter,
  onSelectVerifiedFilter,
  searchQuery,
  onSearchChange,
  onClearFilters,
  resultsCount,
  onOpenReportModal
}) => {
  const subFilterConfig = getCategorySubFilterConfig(activeCategory);
  const hasActiveSubFilter = categorySubFilter !== 'Todas' && categorySubFilter !== 'Todos';
  const hasActiveVerified = verifiedFilter !== 'Todos';
  const hasActiveFilters = selectedCity !== 'Todas' || searchQuery.trim().length > 0 || hasActiveSubFilter || hasActiveVerified;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="tabsAnchor" className="sticky top-[61px] sm:top-[76px] z-40 bg-[#FAF7F1]/95 backdrop-blur-md border-y border-[#E9E1D2] py-4 px-4 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        
        {/* LEVEL 1: Primary Category Tabs with Left & Right Scroll Arrow Buttons */}
        <div className="relative flex items-center w-full group">
          {/* Left Scroll Arrow */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute -left-2 sm:-left-3 z-10 p-2 rounded-full bg-white text-[#0B2A4A] border border-[#E9E1D2] shadow-lg hover:bg-[#EAF1FB] hover:border-[#1D5DBF] hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              aria-label="Desplazar opciones a la izquierda"
              title="Desplazar a la izquierda"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2A4A]" />
            </button>
          )}

          {/* Scrollable Tabs Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full scroll-smooth"
          >
            {CATEGORY_ITEMS.map((item) => {
              const isActive = activeCategory === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectCategory(item.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all shrink-0 cursor-pointer ${
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

          {/* Right Scroll Arrow */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute -right-2 sm:-right-3 z-10 p-2 rounded-full bg-[#0B2A4A] text-white border border-[#0B2A4A] shadow-lg hover:bg-[#1D5DBF] hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer animate-pulse"
              aria-label="Desplazar opciones a la derecha"
              title="Desplazar a la derecha para ver más opciones"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          )}
        </div>

        {/* LEVEL 2: Compact Integrated Search & Dual Dropdown Filters Box */}
        <div className="bg-white p-3 rounded-2xl border border-[#E9E1D2] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
          {/* Search Input Bar (Flexible size) */}
          <div className="relative flex-1 w-full min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7264] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por palabra clave..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] text-[#1E1B16] placeholder:text-[#7A7264] focus:outline-none focus:ring-2 focus:ring-[#1D5DBF] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7A7264] hover:text-[#0B2A4A] font-bold bg-[#E9E1D2] hover:bg-[#d8cfbe] rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Filters Group (Compact & Wrap-safe for Tablet/Desktop) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Filter 1: Common City Selector Dropdown */}
            <div className="relative inline-flex items-center flex-1 sm:flex-initial">
              <MapPin className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${
                selectedCity !== 'Todas' ? 'text-white' : 'text-[#0B2A4A]'
              }`} />
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className={`w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs font-bold rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] transition-colors border truncate max-w-[180px] ${
                  selectedCity !== 'Todas'
                    ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                    : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#0B2A4A] hover:bg-[#EAF1FB]'
                }`}
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#0B2A4A]">
                    {c === 'Todas' ? '📍 Ciudad: (Todas)' : `📍 ${c}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Category-Specific Dropdown Filter */}
            <div className="relative inline-flex items-center flex-1 sm:flex-initial">
              <SlidersHorizontal className="w-3.5 h-3.5 absolute left-3 text-[#0B2A4A] pointer-events-none" />
              <select
                value={categorySubFilter}
                onChange={(e) => onSelectCategorySubFilter(e.target.value)}
                className={`w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs font-bold rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] transition-colors border truncate max-w-[200px] ${
                  hasActiveSubFilter
                    ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                    : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#0B2A4A] hover:bg-[#EAF1FB]'
                }`}
              >
                {subFilterConfig.options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white text-[#0B2A4A]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Verified Status Filter */}
            <div className="relative inline-flex items-center flex-1 sm:flex-initial">
              <ShieldCheck className="w-3.5 h-3.5 absolute left-3 text-[#2F8F5B] pointer-events-none" />
              <select
                value={verifiedFilter}
                onChange={(e) => onSelectVerifiedFilter(e.target.value)}
                className={`w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs font-bold rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8F5B] transition-colors border truncate max-w-[180px] ${
                  verifiedFilter !== 'Todos'
                    ? 'bg-[#2F8F5B] text-white border-[#2F8F5B]'
                    : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#0B2A4A] hover:bg-[#EAF1FB]'
                }`}
              >
                <option value="Todos" className="bg-white text-[#0B2A4A]">✓ Verif: Todos</option>
                <option value="Sí" className="bg-white text-[#0B2A4A]">✓ Verificado: Sí</option>
                <option value="No" className="bg-white text-[#0B2A4A]">⏳ Verificado: No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Status & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-[#7A7264] px-1 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-[#0B2A4A] bg-white px-3 py-1 rounded-lg border border-[#E9E1D2]">
              {resultsCount} {resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </span>

            {selectedCity !== 'Todas' && (
              <span className="inline-flex items-center gap-1 bg-[#EAF1FB] text-[#1D5DBF] font-bold px-2.5 py-0.5 rounded-md border border-[#1D5DBF]/20">
                <span>Ciudad: {selectedCity}</span>
              </span>
            )}

            {hasActiveSubFilter && (
              <span className="inline-flex items-center gap-1 bg-[#EAF1FB] text-[#0B2A4A] font-bold px-2.5 py-0.5 rounded-md border border-[#0B2A4A]/20">
                <span>{subFilterConfig.label}: {categorySubFilter}</span>
              </span>
            )}

            {verifiedFilter !== 'Todos' && (
              <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#137333] font-bold px-2.5 py-0.5 rounded-md border border-[#CEEAD6]">
                <span>Verificado: {verifiedFilter}</span>
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
              className="inline-flex items-center gap-1 text-xs font-bold text-[#C1443B] hover:underline cursor-pointer"
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


