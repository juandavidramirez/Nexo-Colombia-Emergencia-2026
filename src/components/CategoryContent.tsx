import React, { useState, useEffect } from 'react';
import { EmergencyRecord, CategoryType } from '../types';
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

  // Reset to page 1 on category or filter/records change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, records.length]);

  // Pagination metrics
  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, records.length);
  const displayedRecords = records.slice(startIndex, endIndex);

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
          Mostrando <strong className="text-[#0B2A4A] font-black">{startIndex + 1}</strong> a <strong className="text-[#0B2A4A] font-black">{endIndex}</strong> de <strong className="text-[#0B2A4A] font-black">{records.length}</strong> resultados
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[#E9E1D2] bg-white text-[#0B2A4A] hover:bg-[#FAF7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
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
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-[#E9E1D2] bg-white text-[#0B2A4A] hover:bg-[#FAF7F1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Empty State handler
  if (records.length === 0 && category !== 'buscar') {
    return (
      <div className="bg-white rounded-2xl border border-[#E9E1D2] p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF6E2] text-[#8A5A00] flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-[#0B2A4A] mb-1">
          No encontramos resultados
        </h3>
        <p className="text-sm text-[#7A7264] mb-6">
          Intenta cambiar la ciudad seleccionada o limpiar el texto de búsqueda para ver más información verificada.
        </p>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-xl bg-[#0B2A4A] text-white text-xs font-bold hover:bg-[#081E38] transition-colors"
        >
          Limpiar filtros de búsqueda
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
              {/* Image header */}
              <div className="h-36 bg-gradient-to-br from-[#E7EFFB] to-[#DCE7F8] relative overflow-hidden flex items-center justify-center text-[#9AAEC2]">
                {it.foto_display ? (
                  <img 
                    src={it.foto_display} 
                    alt={it.organizacion} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-60" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#EAF1FB] text-[#1D5DBF] font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                    DONAR
                  </span>
                  <span className="bg-[#FAF7F1] text-[#7A7264] border border-[#E9E1D2] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-xs">
                    {it.ciudad}
                  </span>
                  {it.tipo_transferencia && (
                    <span className="bg-[#FFF6E2] text-[#8A5A00] font-bold text-[10px] uppercase px-2 py-1 rounded-md shadow-xs">
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
                  <div className="text-xs font-bold text-[#0B2A4A] mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#1D5DBF]" />
                    <span>{it.banco} · {it.tipo_cuenta}</span>
                  </div>
                </div>

                {it.descripcion && (
                  <p className="text-xs text-[#7A7264] line-clamp-2">
                    {it.descripcion}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-[#E9E1D2]/60 flex items-center justify-between text-[11px] text-[#2F8F5B] font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[180px]">Confirmado por {it.confirmado_por}</span>
                  </span>
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
              {/* Image header */}
              <div className="h-36 bg-gradient-to-br from-[#FFF6E2] to-[#FFE3AB] relative overflow-hidden flex items-center justify-center text-[#8A5A00]">
                {it.foto_display ? (
                  <img 
                    src={it.foto_display} 
                    alt={it.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-60" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#FFF6E2] text-[#8A5A00] font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                    ACOPIO
                  </span>
                  <span className="bg-white text-[#0B2A4A] font-extrabold text-[10px] uppercase px-2 py-1 rounded-md shadow-xs">
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

                <div className="mt-auto pt-2 text-[11px] text-[#7A7264] flex items-center justify-between">
                  <span>📍 {it.direccion}</span>
                  <span className="font-medium">{it.fecha}</span>
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
                    <span className="font-semibold text-[#0B2A4A]">Fuente: {it.fuente}</span>
                    <span>•</span>
                    <span>Confirmado por: <strong className="text-[#2F8F5B]">{it.confirmado_por}</strong></span>
                    <span>•</span>
                    <span>{it.fecha_hora}</span>
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
              {/* Image header */}
              <div className="h-36 bg-gradient-to-br from-[#EAF1FB] to-[#DCE7F8] relative overflow-hidden flex items-center justify-center text-[#1D5DBF]">
                {it.foto_display ? (
                  <img 
                    src={it.foto_display} 
                    alt={it.titulo} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 opacity-60" />
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#0B2A4A] text-white font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                    INICIATIVA
                  </span>
                  <span className="bg-white text-[#0B2A4A] font-extrabold text-[10px] uppercase px-2 py-1 rounded-md shadow-xs">
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

                <div className="mt-auto pt-2 text-[11px] text-[#7A7264] flex items-center justify-between">
                  <span>Coordinación activa</span>
                  <span>{it.fecha}</span>
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
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Banner destacado canal Colombia Te Busca */}
        <div className="bg-white border-2 border-dashed border-[#1D5DBF]/40 rounded-2xl p-6 sm:p-8 text-center bg-gradient-to-b from-[#EAF1FB]/50 to-white shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF1FB] text-[#1D5DBF] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#0B2A4A] mb-2">
            Buscar o reportar una persona desaparecida
          </h3>
          <p className="text-sm text-[#5B6B7A] max-w-2xl mx-auto mb-5 leading-relaxed">
            No construimos un registro propio duplicado — <strong className="text-[#0B2A4A]">Colombia Te Busca</strong> centraliza la búsqueda de personas a nivel nacional. Nexo Colombia enlaza directamente para agilizar la respuesta unificada.
          </p>
          <a
            href="https://colombiatebusca.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span>Ir a colombiatebusca.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Section title for local animal/person relief initiatives */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase text-[#7A7264] tracking-wider">
              Otras iniciativas de búsqueda — Personas y Mascotas
            </span>
            <div className="h-px bg-[#E9E1D2] flex-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedRecords.map((it) => (
              <div 
                key={it.id} 
                className="bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden flex flex-col hover:border-[#1D5DBF] hover:shadow-md transition-all p-4"
              >
                <div className="h-32 rounded-xl bg-[#EAF1FB] relative overflow-hidden mb-3 flex items-center justify-center text-[#1D5DBF]">
                  {it.foto_display ? (
                    <img 
                      src={it.foto_display} 
                      alt={it.titulo} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 opacity-60" />
                  )}
                  <span className={`absolute top-2.5 left-2.5 font-black text-[10px] uppercase px-2 py-0.5 rounded-md ${
                    it.tipo_buscar === 'Mascotas' ? 'bg-[#FFF6E2] text-[#8A5A00]' : 'bg-[#EAF1FB] text-[#1D5DBF]'
                  }`}>
                    {it.tipo_buscar === 'Mascotas' ? '🐾 Mascotas' : '👤 Personas'}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-[#0B2A4A] mb-1">
                  {it.titulo}
                </h4>

                <p className="text-xs text-[#5B6B7A] mb-4 flex-1">
                  {it.descripcion}
                </p>

                {it.link_externo && (
                  <a
                    href={it.link_externo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1D5DBF] hover:underline mt-auto"
                  >
                    <span>Ir al enlace directo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
          {renderPagination()}
        </div>
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
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-[#7A7264] bg-[#FAF7F1] px-2 py-0.5 rounded-md border border-[#E9E1D2]">
                        📍 {it.ciudad}
                      </span>
                      {it.confirmado_por && (
                        <span className="text-[10px] font-bold text-[#2F8F5B]">
                          ✓ {it.confirmado_por}
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
