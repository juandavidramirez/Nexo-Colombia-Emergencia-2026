import React from 'react';
import { X, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2A4A]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E9E1D2] z-10 animate-modal my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D2] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFF6E2] text-[#8A5A00]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B2A4A] leading-tight">
                Comparte información
              </h2>
              <p className="text-xs text-[#7A7264]">Formulario de aporte ciudadano</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A7264] hover:bg-[#FAF7F1] hover:text-[#0B2A4A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#5B6B7A] leading-relaxed mb-4">
          ¿Tienes un punto de acopio, una necesidad urgente o una cuenta de donación para compartir? Este formulario va directo a una cola de revisión para que un curador local lo verifique antes de su publicación.
        </p>

        {/* Form Simulation Box */}
        <div className="bg-[#FAF7F1] border-2 border-dashed border-[#FFB81C]/60 rounded-2xl p-5 text-center mb-5">
          <div className="text-xs font-extrabold text-[#0B2A4A] mb-2 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2F8F5B]" />
            <span>Formulario Oficial de Recolección</span>
          </div>

          <div className="text-xs text-[#7A7264] space-y-2 text-left max-w-sm mx-auto bg-white p-3.5 rounded-xl border border-[#E9E1D2] mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B]" />
              <span>Categoría (Acopio, Donación, Necesidad, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B]" />
              <span>Ciudad o municipio afectado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B]" />
              <span>Detalle de dirección / cuenta / número</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F8F5B]" />
              <span>Tu nombre y cómo lo confirmaste</span>
            </div>
          </div>

          <a
            href="https://docs.google.com/forms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-xs shadow-xs transition-colors"
          >
            <span>Abrir Formulario en Google Forms ↗</span>
          </a>
        </div>

        <div className="text-[11px] text-[#7A7264] text-center italic">
          * Ninguna información se publica automáticamente sin revisión humana.
        </div>
      </div>
    </div>
  );
};
