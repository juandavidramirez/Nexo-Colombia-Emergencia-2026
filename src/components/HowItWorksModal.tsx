import React from 'react';
import { X, HelpCircle, Search, PlusCircle, ShieldCheck, MapPin, Heart, Users, Phone, Info } from 'lucide-react';

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
        className="fixed inset-0 bg-[#0B2A4A]/65 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Center Wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-3xl border border-[#E9E1D2] flex flex-col my-8 animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#FAF7F1] border-b border-[#E9E1D2] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EAF1FB] text-[#1D5DBF] rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0B2A4A] uppercase tracking-wide leading-none">
                  ¿Cómo funciona Nexo?
                </h3>
                <p className="text-xs text-[#7A7264] font-semibold mt-1">
                  Guía de consulta, registro y curaduría de la información
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
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[70vh]">
            
            <p className="text-sm text-[#5B6B7A] leading-relaxed">
              Nexo es una plataforma de articulación ciudadana, curación de contenido y centralización de contenido, respaldada por los <strong className="text-[#0B2A4A]">Global Shapers de Colombia y Venezuela</strong>. Su objetivo es actuar como un puente directo, transparente y seguro entre la ayuda social y las necesidades de la emergencia. En Nexo puedes realizar dos acciones principales: <strong>consultar información útil</strong> o <strong>registrar nuevos aportes</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
              
              {/* Column 1: CONSULTAR */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E9E1D2]/60">
                  <div className="p-1.5 bg-[#EAF1FB] text-[#1D5DBF] rounded-lg">
                    <Search className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-[#0B2A4A] uppercase tracking-wide">
                    1. Consultar Información
                  </h4>
                </div>

                <p className="text-xs text-[#7A7264] leading-relaxed">
                  Para buscar ayuda o necesidades activas, dirígete a las <strong>secciones de búsqueda y filtrado</strong> en la parte superior del portal principal. Allí puedes escribir palabras clave, filtrar por ciudad, o seleccionar categorías.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-[#0B2A4A]">
                    La información está clasificada en 6 categorías principales:
                  </div>

                  <ul className="space-y-2.5">
                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">💰</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Dónde donar dinero</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Cuentas bancarias oficiales de fundaciones y organizaciones con verificación estricta para transferencias y donaciones monetarias directas.
                        </span>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">🆘</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Qué se necesita ahora (Necesidades)</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Requerimientos urgentes y carencias recolectadas directamente en el terreno, con prioridad en las ciudades y comunidades más afectadas.
                        </span>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">📦</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Puntos de acopio y albergues</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Centros autorizados para recibir ayudas materiales físicas y espacios de refugio temporal para familias afectadas.
                        </span>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">🏘️</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Iniciativas y Servicios para la gente</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Redes de apoyo comunitario, brigadas médicas, soporte psicológico de primeros auxilios y logística voluntaria gratuita.
                        </span>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">🔍</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Búsqueda de Personas y Mascotas</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Enlaces a plataformas de reporte y listados verificados de personas y animales rescatados o en albergues.
                        </span>
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="text-xs shrink-0 mt-0.5">📞</span>
                      <div>
                        <span className="font-extrabold text-[#0B2A4A] block text-xs">Contactos Oficiales</span>
                        <span className="text-[11px] text-[#7A7264] leading-normal block">
                          Directorio telefónico y canales de emergencia de organismos de socorro, alcaldías, gobernaciones y entidades de salud pública.
                        </span>
                      </div>
                    </li>
                  </ul>

                  <div className="text-[11px] text-[#1D5DBF] font-bold italic bg-[#EAF1FB]/50 p-2 rounded-xl border border-[#D0E2FF]/40">
                    💡 Nota: Actualmente operamos con estas categorías básicas, pero iremos abriendo más canales a medida que la emergencia lo requiera.
                  </div>
                </div>
              </div>

              {/* Column 2: REGISTRAR Y CURADURÍA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E9E1D2]/60">
                  <div className="p-1.5 bg-[#FFF6E2] text-[#8A5A00] rounded-lg">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-[#0B2A4A] uppercase tracking-wide">
                    2. Registrar Ayuda o Reportes
                  </h4>
                </div>

                <p className="text-xs text-[#7A7264] leading-relaxed">
                  Cualquier ciudadano, colectivo u organización que conozca una iniciativa de apoyo o una necesidad real en su territorio puede proponerla de forma gratuita haciendo clic en el botón <strong>"Comparte información"</strong>.
                </p>

                <div className="bg-[#FAF7F1] border border-[#E9E1D2] rounded-2xl p-4 space-y-3.5">
                  <div className="flex gap-2 items-center">
                    <ShieldCheck className="w-5 h-5 text-[#2F8F5B]" />
                    <span className="text-xs font-black text-[#0B2A4A] uppercase tracking-wider">
                      Información Curada y Verificada
                    </span>
                  </div>

                  <p className="text-xs text-[#1E1B16] leading-relaxed">
                    Para mantener la confiabilidad de la plataforma y combatir noticias falsas o datos caducados, <strong>ningún registro se publica de manera automática</strong>.
                  </p>

                  <div className="space-y-2 text-xs text-[#5B6B7A] leading-relaxed pl-1.5 border-l-2 border-[#2F8F5B]/30">
                    <div>
                      📍 <strong className="text-[#0B2A4A]">Revisión Manual:</strong> Un miembro asignado del equipo de <strong className="text-[#0B2A4A]">Global Shapers Colombia y Venezuela</strong> audita y contacta directamente la iniciativa propuesta.
                    </div>
                    <div>
                      📍 <strong className="text-[#0B2A4A]">Fuentes Fidedignas:</strong> Validamos que los datos (direcciones, teléfonos, cuentas de banco, fechas y necesidades críticas) provengan de una <strong className="text-[#0B2A4A]">fuente 100% real y fidedigna</strong>.
                    </div>
                    <div>
                      📍 <strong className="text-[#0B2A4A]">Sello de Confianza:</strong> Una vez aprobado, el registro se visualiza públicamente con el distintivo <span className="font-extrabold text-[#2F8F5B] bg-[#E7F4EC] px-1.5 py-0.5 rounded">✓ Verificado</span> y el nombre del voluntario responsable de su revisión.
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#7A7264] leading-relaxed pt-2">
                  Este riguroso filtro humano garantiza un directorio limpio y optimiza la distribución de recursos en los municipios más afectados.
                </div>
              </div>

            </div>

            {/* Note Panel */}
            <div className="bg-[#FAF7F1] border border-[#E9E1D2] rounded-2xl p-4 flex gap-3">
              <div className="text-base shrink-0">💡</div>
              <div className="text-xs text-[#5B6B7A] leading-relaxed">
                <strong>¿Quieres unirte al equipo de verificación de tu ciudad?</strong> Escríbenos a través del botón de <strong>Contacto</strong> en la barra de navegación superior. Trabajamos de forma totalmente voluntaria, transparente y sin ánimo de lucro.
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E9E1D2] px-6 py-4 bg-[#FAF7F1] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0B2A4A] text-white text-xs font-extrabold rounded-xl hover:bg-[#1D5DBF] transition-colors cursor-pointer shadow-xs"
            >
              Entendido, gracias
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
