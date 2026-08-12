import React from 'react';
import { X, HelpCircle, FileText, CheckCircle, Users } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="how-it-works-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0B2A4A]/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Center Wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-xl transition-all w-full max-w-2xl border border-[#E9E1D2] flex flex-col my-8 animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#FAF7F1] border-b border-[#E9E1D2] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#EAF1FB] text-[#1D5DBF] rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0B2A4A] uppercase tracking-wide leading-none">
                  ¿Cómo funciona Nexo?
                </h3>
                <p className="text-xs text-[#7A7264] font-semibold mt-1">
                  Guía de verificación y movilización ciudadana
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#7A7264] hover:bg-[#E9E1D2]/40 hover:text-[#0B2A4A] transition-colors cursor-pointer"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="text-sm text-[#5B6B7A] leading-relaxed">
              Nexo es una plataforma ciudadana impulsada por <strong>Global Shapers</strong>. Nuestro propósito es conectar de manera confiable la ayuda con las necesidades reales de la emergencia, asegurando que cada dato publicado pase por un riguroso proceso de validación.
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#EAF1FB] text-[#1D5DBF] font-black text-xs flex items-center justify-center border-2 border-[#1D5DBF]/20">
                    1
                  </div>
                  <div className="w-0.5 h-12 bg-[#E9E1D2]/60" />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h4 className="text-sm font-black text-[#0B2A4A] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1D5DBF]" />
                    Paso 1: Registro Ciudadano
                  </h4>
                  <p className="text-xs text-[#7A7264] mt-1 leading-relaxed">
                    Cualquier ciudadano o entidad puede proponer una iniciativa, punto de acopio o necesidad mediante el formulario de <strong>"Comparte información"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#FFF6E2] text-[#8A5A00] font-black text-xs flex items-center justify-center border-2 border-[#FFB81C]/20">
                    2
                  </div>
                  <div className="w-0.5 h-12 bg-[#E9E1D2]/60" />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h4 className="text-sm font-black text-[#0B2A4A] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8A5A00]" />
                    Paso 2: Curaduría y Verificación
                  </h4>
                  <p className="text-xs text-[#7A7264] mt-1 leading-relaxed">
                    Un equipo de voluntarios verificadores de <strong>Global Shapers Colombia y Venezuela</strong> contacta a los organizadores para validar la veracidad de los datos, horarios y urgencia.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#E7F4EC] text-[#2F8F5B] font-black text-xs flex items-center justify-center border-2 border-[#2F8F5B]/20">
                    3
                  </div>
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <h4 className="text-sm font-black text-[#0B2A4A] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#2F8F5B]" />
                    Paso 3: Publicación Segura
                  </h4>
                  <p className="text-xs text-[#7A7264] mt-1 leading-relaxed">
                    El registro es aprobado con la marca de <strong>✓ Verificado</strong> y el nombre del voluntario responsable, permitiendo que la información confiable esté disponible al público de inmediato.
                  </p>
                </div>
              </div>
            </div>

            {/* Note Panel */}
            <div className="bg-[#FAF7F1] border border-[#E9E1D2] rounded-2xl p-4 flex gap-3">
              <div className="text-base">💡</div>
              <div className="text-xs text-[#5B6B7A] leading-relaxed">
                <strong>¿Quieres ayudar a validar datos?</strong> Escríbenos a través del botón de <strong>Contacto</strong>. Todo el equipo de Nexo opera sin fines de lucro en pro de la gestión transparente de la emergencia.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E9E1D2] px-6 py-4 bg-[#FAF7F1] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#0B2A4A] text-white text-xs font-extrabold rounded-xl hover:bg-[#1D5DBF] transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
