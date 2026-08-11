import React, { useState } from 'react';
import { X, Phone, MessageSquare, Copy, Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const phoneNumber = '+573116052531';
  const displayPhone = '+57 311 605 2531';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B2A4A]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E9E1D2] z-10 animate-modal my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D2] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EAF1FB] text-[#1D5DBF]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B2A4A] leading-tight">
                Contacto Directo
              </h2>
              <p className="text-xs text-[#7A7264]">Plataforma Nexo Colombia</p>
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
          Para preguntas, sugerencias técnicas, correcciones sobre información o alianzas institucionales:
        </p>

        {/* Contact Card matching HTML prototype design */}
        <div className="bg-[#FAF7F1] border border-[#E9E1D2] rounded-2xl p-4 flex items-center gap-4 mb-5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2A4A] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
            JD
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-extrabold text-[#0B2A4A] truncate">
              Juan David Ramírez
            </div>
            <div className="text-xs text-[#7A7264] leading-snug">
              Responsable de construcción y visualización
            </div>
            <div className="text-sm font-black text-[#1D5DBF] mt-1">
              {displayPhone}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-[#2F8F5B] hover:bg-[#257348] text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Directo</span>
          </a>

          <button
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-[#FAF7F1] hover:bg-[#EAF1FB] border border-[#E9E1D2] hover:border-[#1D5DBF] text-[#0B2A4A] font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2F8F5B]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar número'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
