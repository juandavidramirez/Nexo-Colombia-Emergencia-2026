import React, { useState } from 'react';
import { EmergencyRecord } from '../types';
import { X, Copy, Check, ExternalLink, MapPin, Phone, Mail, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface DetailModalProps {
  record: EmergencyRecord | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDonar = record.categoria === 'donar';
  const isAcopio = record.categoria === 'acopio';
  const isNecesidades = record.categoria === 'necesidades';
  const isHub = record.categoria === 'hub';
  const isContactos = record.categoria === 'contactos';

  const modalTitle = record.organizacion || record.titulo || record.entidad || 'Detalle de información';

  const contactVal = record.contacto || '';
  const isPhone = /^\+?\d[\d\s-]{4,}$/.test(contactVal.trim());
  const isEmail = contactVal.includes('@');

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2A4A]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E9E1D2] z-10 animate-modal my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#E9E1D2]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#EAF1FB] text-[#1D5DBF]">
                {record.categoria.toUpperCase()}
              </span>
              <span className="text-[11px] font-bold text-[#0B2A4A] bg-[#FAF7F1] px-2 py-0.5 rounded-md border border-[#E9E1D2]">
                📍 {record.ciudad}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2A4A] leading-tight">
              {modalTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A7264] hover:bg-[#FAF7F1] hover:text-[#0B2A4A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo if available */}
        {record.foto_display && (
          <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#FAF7F1] border border-[#E9E1D2] relative">
            <img
              src={record.foto_display}
              alt={modalTitle}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Key-Value Details List */}
        <div className="divide-y divide-[#E9E1D2]/60 text-xs sm:text-sm">
          {/* DONAR DETAILS */}
          {isDonar && (
            <>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Banco</span>
                <span className="font-extrabold text-[#0B2A4A] text-right">{record.banco}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Tipo de cuenta</span>
                <span className="font-bold text-[#1E1B16] text-right">{record.tipo_cuenta}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-4 items-center bg-[#FAF7F1] -mx-6 px-6 py-3 border-y border-[#E9E1D2]">
                <span className="text-[#0B2A4A] font-extrabold shrink-0">Número de cuenta</span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-[#1D5DBF] tracking-wider">{record.numero_cuenta}</span>
                  {record.numero_cuenta && (
                    <button
                      onClick={() => handleCopy(record.numero_cuenta!)}
                      className="p-1.5 rounded-lg bg-white border border-[#E9E1D2] hover:bg-[#EAF1FB] text-[#1D5DBF] transition-colors"
                      title="Copiar número de cuenta"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#2F8F5B]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Cobertura</span>
                <span className="font-bold text-[#1E1B16] text-right">{record.ciudad}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Tipo de transferencia</span>
                <span className="font-bold text-[#8A5A00] text-right">{record.tipo_transferencia}</span>
              </div>
            </>
          )}

          {/* ACOPIO DETAILS */}
          {isAcopio && (
            <>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Dirección</span>
                <span className="font-extrabold text-[#0B2A4A] text-right">{record.direccion}</span>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Horario de recepción</span>
                <span className="font-bold text-[#8A5A00] text-right">{record.horario}</span>
              </div>
              <div className="py-2.5 flex flex-col gap-1">
                <span className="text-[#7A7264] font-medium">Insumos requeridos</span>
                <p className="font-medium text-[#1E1B16] bg-[#FAF7F1] p-3 rounded-xl border border-[#E9E1D2]">
                  {record.recibe}
                </p>
              </div>
              {record.maps_link && (
                <div className="py-2.5 flex justify-between gap-4 items-center">
                  <span className="text-[#7A7264] font-medium">Ubicación en mapa</span>
                  <a
                    href={record.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF1FB] text-[#1D5DBF] font-bold text-xs hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Abrir Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </>
          )}

          {/* NECESIDADES DETAILS */}
          {isNecesidades && (
            <>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Nivel de urgencia</span>
                <span className="font-black text-[#C1443B] text-right">
                  {record.nivel_urgencia === 'urgent' ? '🔴 Urgente / Prioritario' : '🟡 Medio'}
                </span>
              </div>
              <div className="py-2.5 flex flex-col gap-1">
                <span className="text-[#7A7264] font-medium">Descripción completa</span>
                <p className="font-medium text-[#1E1B16] bg-[#FBEAE8] p-3 rounded-xl border border-[#F0C7C2] text-[#8C2E27]">
                  {record.descripcion}
                </p>
              </div>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Fuente original</span>
                <span className="font-bold text-[#0B2A4A] text-right">{record.fuente}</span>
              </div>
            </>
          )}

          {/* INICIATIVAS / HUB DETAILS */}
          {isHub && (
            <>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Organización</span>
                <span className="font-extrabold text-[#0B2A4A] text-right">{record.organizacion}</span>
              </div>
              {record.lidera && (
                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-[#7A7264] font-medium shrink-0">Coordinador / Líder</span>
                  <span className="font-bold text-[#1D5DBF] text-right">{record.lidera}</span>
                </div>
              )}
              <div className="py-2.5 flex flex-col gap-1">
                <span className="text-[#7A7264] font-medium">Actividad en marcha</span>
                <p className="font-medium text-[#1E1B16] bg-[#FAF7F1] p-3 rounded-xl border border-[#E9E1D2]">
                  {record.descripcion}
                </p>
              </div>
            </>
          )}

          {/* CONTACTOS DETAILS */}
          {isContactos && (
            <>
              <div className="py-2.5 flex justify-between gap-4">
                <span className="text-[#7A7264] font-medium shrink-0">Entidad</span>
                <span className="font-extrabold text-[#0B2A4A] text-right">{record.entidad}</span>
              </div>
              <div className="py-2.5 flex flex-col gap-1">
                <span className="text-[#7A7264] font-medium">En qué consiste y cuándo usar</span>
                <p className="font-medium text-[#1E1B16] bg-[#FAF7F1] p-3 rounded-xl border border-[#E9E1D2]">
                  {record.descripcion}
                </p>
              </div>
            </>
          )}

          {/* CONFIRMATION & AUDIT FOOTER */}
          <div className="py-2.5 flex justify-between gap-4">
            <span className="text-[#7A7264] font-medium shrink-0">Verificado por</span>
            <span className="font-bold text-[#2F8F5B] text-right flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{record.confirmado_por || 'Curador Nexo Colombia'}</span>
            </span>
          </div>

          <div className="py-2.5 flex justify-between gap-4">
            <span className="text-[#7A7264] font-medium shrink-0">Última actualización</span>
            <span className="font-medium text-[#7A7264] text-right">{record.fecha || record.fecha_hora || 'reciente'}</span>
          </div>
        </div>

        {/* Action Button Footer */}
        {contactVal && (
          <div className="mt-5 pt-4 border-t border-[#E9E1D2] flex items-center gap-3">
            {isPhone ? (
              <a
                href={`tel:${contactVal.replace(/\s/g, '')}`}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a {contactVal}</span>
              </a>
            ) : isEmail ? (
              <a
                href={`mailto:${contactVal}`}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Escribir a {contactVal}</span>
              </a>
            ) : (
              <button
                onClick={() => handleCopy(contactVal)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#2F8F5B]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Dato copiado!' : `Copiar enlace: ${contactVal}`}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
