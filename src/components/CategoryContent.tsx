import React, { useState, useEffect } from 'react';
import { EmergencyRecord, CategoryType } from '../types';
import { getVerificadoPorText } from '../utils/formatters';
import { 
  ExternalLink, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Search
} from 'lucide-react';

interface CategoryContentProps {
  category: CategoryType;
  records: EmergencyRecord[];
  onOpenDetail: (record: EmergencyRecord) => void;
  onClearFilters: () => void;
}

export const CategoryContent: React.FC<CategoryContentProps> = ({
  category,
  records,
  onOpenDetail,
  onClearFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Sub-filter state for category 'buscar' (Personas / Mascotas)
  const [buscarSubFilter, setBuscarSubFilter] = useState<'Todos' | 'Personas' | 'Mascotas'>('Todos');

  // Reset page and subfilter on category change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, records.length, buscarSubFilter]);

  // Compute records to render based on sub-filter for 'buscar'
  const activeRecords = category === 'buscar' && buscarSubFilter !== 'Todos'
    ? records.filter(r => r.tipo_buscar === buscarSubFilter)
    : records;

  // Pagination metrics
  const totalPages = Math.ceil(activeRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, activeRecords.length);
  const displayedRecords = activeRecords.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('tabsAnchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 pt-6 border-t border-[#E9E1D2] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#7A7264] font-semibold">
          Mostrando <strong className="text-[#0B2A4A] font-black">{startIndex + 1}</strong> a <strong className="text-[#0B2A4A] font-black">{endIndex}</strong> de <strong className="text-[#0B2A4A] font-black">{activeRecords.length}</strong> resultados
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[#E9E1D2] bg-white text-[#0B2A4A] hover:bg-[#FAF7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2A4A] text-white shadow-xs'
                    : 'bg-white border border-[#E9E1D2] text-[#0B2A4A] hover:bg-[#FAF7F1]'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[#E9E1D2] bg-white text-[#0B2A4A] hover:bg-[#FAF7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Empty State handler
  if (activeRecords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E9E1D2] p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF6E2] text-[#8A5A00] flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-[#0B2A4A] mb-1">
          No encontramos resultados
        </h3>
        <p className="text-sm text-[#7A7264] mb-6">
          Intenta cambiar el tipo de filtro, la ciudad seleccionada o limpiar el texto de búsqueda para ver más información.
        </p>
        <button
          onClick={() => {
            setBuscarSubFilter('Todos');
            onClearFilters();
          }}
          className="px-4 py-2 rounded-xl bg-[#0B2A4A] text-white text-xs font-bold hover:bg-[#081E38] transition-colors cursor-pointer"
        >
          Limpiar todos los filtros
        </button>
      </div>
    );
  }

  // 1. DONAR DINERO (💰)
  if (category === 'donar') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecords.map((it) => (
            <div 
              key={it.id} 
              className="bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden flex flex-col hover:border-[#1D5DBF] hover:shadow-md transition-all group"
            >
              {/* Badge Header Strip (No image) */}
              <div className="bg-[#FAF7F1] border-b border-[#E9E1D2] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-white text-[#7A7264] border border-[#E9E1D2] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                    📍 {it.ciudad}
                  </span>
                  {it.tipo_transferencia && (
                    <span className="bg-[#FFF6E2] text-[#8A5A00] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                      {it.tipo_transferencia}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B16] leading-snug group-hover:text-[#1D5DBF] transition-colors">
                    {it.organizacion}
                  </h3>
                  {(it.banco || it.tipo_cuenta) && (
                    <div className="text-xs font-bold text-[#0B2A4A] mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#1D5DBF] shrink-0" />
                      <span>{it.banco || 'Información bancaria'} {it.tipo_cuenta ? `· ${it.tipo_cuenta}` : ''}</span>
                    </div>
                  )}
                </div>

                {it.descripcion && (
                  <p className="text-xs text-[#7A7264] line-clamp-2">
                    {it.descripcion}
                  </p>
                )}

                {/* External URL / Website button if present */}
                {it.link_externo && (
                  <div className="pt-1">
                    <a
                      href={it.link_externo.startsWith('http') ? it.link_externo : `https://${it.link_externo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF1FB] hover:bg-[#DCE7F8] text-[#1D5DBF] text-xs font-extrabold transition-colors border border-[#C2D8F2] w-full justify-center group-hover:border-[#1D5DBF]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[240px]">
                        Sitio Web: {it.link_externo.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                      </span>
                    </a>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-[#E9E1D2]/60 flex items-center justify-between text-[11px] font-bold">
                  {it.estado === 'pendiente' ? (
                    <span className="text-[#856404] flex items-center gap-1">
                      <span>⏳ Verificación pendiente</span>
                    </span>
                  ) : (
                    <span className="text-[#2F8F5B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[200px]">Verificado por {getVerificadoPorText(it)}</span>
                    </span>
                  )}
                  <span className="text-[#7A7264] font-normal">{it.fecha}</span>
                </div>

                <button
                  onClick={() => onOpenDetail(it)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F1] hover:bg-[#EAF1FB] border border-[#E9E1D2] hover:border-[#1D5DBF] text-[#0B2A4A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-1"
                >
                  <span>Ver número de cuenta y detalles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    );
  }

  // 2. PUNTOS DE ACOPIO (📦)
  if (category === 'acopio') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecords.map((it) => (
            <div 
              key={it.id} 
              className="bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden flex flex-col hover:border-[#FFB81C] hover:shadow-md transition-all group"
            >
              {/* Badge Header Strip (No image) */}
              <div className="bg-[#FFF6E2] border-b border-[#E9E1D2] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-white text-[#0B2A4A] font-extrabold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                    📍 {it.ciudad}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B16] leading-snug group-hover:text-[#8A5A00] transition-colors">
                    {it.titulo}
                  </h3>
                  <div className="text-xs font-bold text-[#8A5A00] mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{it.horario}</span>
                  </div>
                </div>

                {it.recibe && (
                  <div className="bg-[#FAF7F1] p-2.5 rounded-xl border border-[#E9E1D2] text-xs text-[#1E1B16]">
                    <span className="font-extrabold text-[#0B2A4A] block mb-0.5">Reciben:</span>
                    <p className="text-[#5B6B7A] line-clamp-2">{it.recibe}</p>
                  </div>
                )}

                <div className="mt-auto pt-2 border-t border-[#E9E1D2]/60 text-[11px] text-[#7A7264] flex items-center justify-between flex-wrap gap-1">
                  {it.estado === 'pendiente' ? (
                    <span className="text-[#856404] font-bold">⏳ Verificación pendiente</span>
                  ) : (
                    <span className="text-[#2F8F5B] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Verificado por {getVerificadoPorText(it)}</span>
                    </span>
                  )}
                  <span className="font-medium ml-auto">{it.fecha}</span>
                </div>

                <button
                  onClick={() => onOpenDetail(it)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F1] hover:bg-[#FFF6E2] border border-[#E9E1D2] hover:border-[#FFB81C] text-[#0B2A4A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver dirección completa y contacto</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    );
  }

  // 3. QUÉ SE NECESITA AHORA (🆘)
  if (category === 'necesidades') {
    return (
      <div>
        <div className="flex flex-col gap-3.5 max-w-4xl mx-auto">
          {displayedRecords.map((it) => {
            const isUrgent = it.nivel_urgencia === 'urgent';
            return (
              <div 
                key={it.id} 
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-md flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-4 ${
                  isUrgent 
                    ? 'border-l-8 border-l-[#C1443B] border-y-[#E9E1D2] border-r-[#E9E1D2]' 
                    : 'border-l-8 border-l-[#FFB81C] border-y-[#E9E1D2] border-r-[#E9E1D2]'
                }`}
              >
                <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${
                      isUrgent ? 'bg-[#FBEAE8] text-[#8C2E27]' : 'bg-[#FFF6E2] text-[#8A5A00]'
                    }`}>
                      {isUrgent ? '🔴 Urgencia Alta' : '🟡 Urgencia Media'}
                    </span>
                    <span className="text-[11px] font-bold text-[#0B2A4A] bg-[#FAF7F1] px-2 py-0.5 rounded-md border border-[#E9E1D2]">
                      📍 {it.ciudad}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1E1B16] leading-snug">
                    {it.titulo}
                  </h3>

                  <p className="text-xs text-[#5B6B7A] line-clamp-2">
                    {it.descripcion}
                  </p>

                  <div className="text-[11px] text-[#7A7264] flex items-center gap-2 flex-wrap mt-1">
                    {it.fuente && <span className="font-semibold text-[#0B2A4A]">Fuente: {it.fuente}</span>}
                    {it.fuente && <span>•</span>}
                    {it.estado === 'pendiente' ? (
                      <span className="text-[#856404] font-bold">⏳ Verificación pendiente</span>
                    ) : (
                      <span>Verificado por: <strong className="text-[#2F8F5B]">{getVerificadoPorText(it)}</strong></span>
                    )}
                    {it.fecha_hora && <span>•</span>}
                    {it.fecha_hora && <span>{it.fecha_hora}</span>}
                  </div>
                </div>

                <button
                  onClick={() => onOpenDetail(it)}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-[#FAF7F1] hover:bg-[#FBEAE8] border border-[#E9E1D2] hover:border-[#C1443B] text-[#8C2E27] text-xs font-bold transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  <span>Cómo ayudar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
        {renderPagination()}
      </div>
    );
  }

  // 4. INICIATIVAS POR CIUDAD (🏘️)
  if (category === 'hub') {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecords.map((it) => (
            <div 
              key={it.id} 
              className="bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden flex flex-col hover:border-[#0B2A4A] hover:shadow-md transition-all group"
            >
              {/* Badge Header Strip (No image) */}
              <div className="bg-[#EAF1FB] border-b border-[#E9E1D2] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {it.tipo_iniciativa && (
                    <span className="bg-[#0B2A4A] text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-2xs">
                      {it.tipo_iniciativa}
                    </span>
                  )}
                  <span className="bg-white text-[#0B2A4A] font-extrabold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                    📍 {it.ciudad}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B16] leading-snug group-hover:text-[#0B2A4A] transition-colors">
                    {it.titulo}
                  </h3>
                  <div className="text-xs font-extrabold text-[#1D5DBF] mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{it.organizacion} {it.lidera ? `· ${it.lidera}` : ''}</span>
                  </div>
                </div>

                {it.descripcion && (
                  <p className="text-xs text-[#5B6B7A] line-clamp-3">
                    {it.descripcion}
                  </p>
                )}

                {/* Direct External Link if available */}
                {(it.link_display || it.link_externo || it.link || (it.contacto && /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(com|co|org|net|gov|io|app|me|site))\b/i.test(it.contacto.trim()))) && (
                  <div className="pt-1">
                    <a
                      href={(it.link_display || it.link_externo || it.link || it.contacto!).startsWith('http') 
                        ? (it.link_display || it.link_externo || it.link || it.contacto!) 
                        : `https://${(it.link_display || it.link_externo || it.link || it.contacto!)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF1FB] hover:bg-[#DCE7F8] text-[#1D5DBF] text-xs font-extrabold transition-colors border border-[#C2D8F2] w-full justify-center group-hover:border-[#1D5DBF]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        Ir al sitio web / red de la iniciativa
                      </span>
                    </a>
                  </div>
                )}

                <div className="mt-auto pt-2 border-t border-[#E9E1D2]/60 text-[11px] text-[#7A7264] flex items-center justify-between flex-wrap gap-1">
                  {it.estado === 'pendiente' ? (
                    <span className="text-[#856404] font-bold">⏳ Verificación pendiente</span>
                  ) : (
                    <span className="text-[#2F8F5B] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Verificado por {getVerificadoPorText(it)}</span>
                    </span>
                  )}
                  <span className="font-medium ml-auto">{it.fecha}</span>
                </div>

                <button
                  onClick={() => onOpenDetail(it)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F1] hover:bg-[#EAF1FB] border border-[#E9E1D2] hover:border-[#1D5DBF] text-[#0B2A4A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Ver detalles de iniciativa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    );
  }

  // 5. BUSCAR PERSONAS Y MASCOTAS (🔍)
  if (category === 'buscar') {
    return (
      <div className="flex flex-col gap-5">
        {/* Sub-filter tabs for Buscar: Todos / Personas / Mascotas */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-3 rounded-2xl border border-[#E9E1D2] shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-[#0B2A4A] uppercase tracking-wider px-1">
              Filtrar por:
            </span>
            <button
              onClick={() => setBuscarSubFilter('Todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                buscarSubFilter === 'Todos'
                  ? 'bg-[#0B2A4A] text-white shadow-2xs'
                  : 'bg-[#FAF7F1] text-[#7A7264] border border-[#E9E1D2] hover:bg-[#EAF1FB] hover:text-[#0B2A4A]'
              }`}
            >
              Todos ({records.length})
            </button>
            <button
              onClick={() => setBuscarSubFilter('Personas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                buscarSubFilter === 'Personas'
                  ? 'bg-[#1D5DBF] text-white shadow-2xs'
                  : 'bg-[#FAF7F1] text-[#7A7264] border border-[#E9E1D2] hover:bg-[#EAF1FB] hover:text-[#1D5DBF]'
              }`}
            >
              👤 Personas ({records.filter(r => r.tipo_buscar === 'Personas').length})
            </button>
            <button
              onClick={() => setBuscarSubFilter('Mascotas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                buscarSubFilter === 'Mascotas'
                  ? 'bg-[#8A5A00] text-white shadow-2xs'
                  : 'bg-[#FAF7F1] text-[#7A7264] border border-[#E9E1D2] hover:bg-[#FFF6E2] hover:text-[#8A5A00]'
              }`}
            >
              🐾 Mascotas ({records.filter(r => r.tipo_buscar === 'Mascotas').length})
            </button>
          </div>

          <div className="text-xs font-semibold text-[#7A7264]">
            {activeRecords.length} iniciativas de búsqueda registradas
          </div>
        </div>

        {/* Standard cards grid matching other categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecords.map((it) => (
            <div 
              key={it.id} 
              className="bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden flex flex-col hover:border-[#1D5DBF] hover:shadow-md transition-all group"
            >
              {/* Badge Header Strip */}
              <div className="bg-[#FAF7F1] border-b border-[#E9E1D2] px-4 py-3 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-2xs ${
                    it.tipo_buscar === 'Mascotas' ? 'bg-[#FFF6E2] text-[#8A5A00]' : 'bg-[#EAF1FB] text-[#1D5DBF]'
                  }`}>
                    {it.tipo_buscar === 'Mascotas' ? '🐾 Mascotas' : '👤 Personas'}
                  </span>
                  <span className="bg-white text-[#7A7264] border border-[#E9E1D2] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                    📍 {it.ciudad}
                  </span>
                  {it.estado === 'pendiente' ? (
                    <span className="bg-[#FFF3CD] text-[#856404] border border-[#FFEEBA] font-extrabold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                      ⏳ Verificación pendiente
                    </span>
                  ) : (
                    <span className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-2xs">
                      ✓ Verificado
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B16] leading-snug group-hover:text-[#1D5DBF] transition-colors">
                    {it.titulo}
                  </h3>
                  {it.organizacion && (
                    <div className="text-xs font-bold text-[#1D5DBF] mt-1 flex items-center gap-1">
                      <span>Organiza: {it.organizacion}</span>
                    </div>
                  )}
                </div>

                {it.descripcion && (
                  <p className="text-xs text-[#5B6B7A] line-clamp-3">
                    {it.descripcion}
                  </p>
                )}

                {/* Direct External Link */}
                {it.link_externo && (
                  <div className="pt-1">
                    <a
                      href={it.link_externo.startsWith('http') ? it.link_externo : `https://${it.link_externo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF1FB] hover:bg-[#DCE7F8] text-[#1D5DBF] text-xs font-extrabold transition-colors border border-[#C2D8F2] w-full justify-center group-hover:border-[#1D5DBF]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[220px]">
                        Ir al canal directo: {it.link_externo.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
                      </span>
                    </a>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-[#E9E1D2]/60 flex items-center justify-between text-[11px] text-[#7A7264] font-medium">
                  {it.estado === 'pendiente' ? (
                    <span className="text-[#856404] font-bold">⏳ Pendiente de verificación</span>
                  ) : (
                    <span className="text-[#2F8F5B] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Verificado por {getVerificadoPorText(it)}</span>
                    </span>
                  )}
                  <span>{it.fecha || 'Reciente'}</span>
                </div>

                <button
                  onClick={() => onOpenDetail(it)}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F1] hover:bg-[#EAF1FB] border border-[#E9E1D2] hover:border-[#1D5DBF] text-[#0B2A4A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
                >
                  <span>Ver detalles y contactos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
      </div>
    );
  }

  // 6. CONTACTOS OFICIALES (📞)
  if (category === 'contactos') {
    return (
      <div>
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {displayedRecords.map((it) => {
            const contactVal = it.contacto || '';
            const isPhone = /^\+?\d[\d\s-]{4,}$/.test(contactVal.trim()) || contactVal === '123';
            const isEmail = contactVal.includes('@');

            return (
              <div 
                key={it.id} 
                className="bg-white rounded-2xl border border-[#E9E1D2] p-4 sm:p-5 hover:border-[#1D5DBF] transition-all hover:shadow-xs flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-[240px]">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF1FB] text-[#1D5DBF] flex items-center justify-center shrink-0 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[10px] font-bold text-[#7A7264] bg-[#FAF7F1] px-2 py-0.5 rounded-md border border-[#E9E1D2]">
                        📍 {it.ciudad}
                      </span>
                      {it.estado === 'pendiente' ? (
                        <span className="text-[10px] font-bold text-[#856404] bg-[#FFF3CD] px-2 py-0.5 rounded-md border border-[#FFEEBA]">
                          ⏳ Verificación pendiente
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#2F8F5B] bg-[#E6F4EA] px-2 py-0.5 rounded-md border border-[#CEEAD6] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>Verificado por {getVerificadoPorText(it)}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-[#0B2A4A]">
                      {it.entidad}
                    </h3>

                    {it.descripcion && (
                      <p className="text-xs text-[#5B6B7A] mt-0.5">
                        {it.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E9E1D2]">
                  {contactVal && (
                    <div className="text-right">
                      {isPhone ? (
                        <a 
                          href={`tel:${contactVal.replace(/\s/g, '')}`} 
                          className="inline-flex items-center gap-1.5 text-sm font-black text-[#1D5DBF] hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{contactVal}</span>
                        </a>
                      ) : isEmail ? (
                        <a 
                          href={`mailto:${contactVal}`} 
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D5DBF] hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{contactVal}</span>
                        </a>
                      ) : (
                        <a 
                          href={`https://${contactVal.replace(/^https?:\/\//, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1D5DBF] hover:underline"
                        >
                          <span>{contactVal}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => onOpenDetail(it)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F1] hover:bg-[#EAF1FB] border border-[#E9E1D2] hover:border-[#1D5DBF] text-[#0B2A4A] text-xs font-bold transition-colors shrink-0"
                  >
                    Detalle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {renderPagination()}
      </div>
    );
  }

  return null;
};
