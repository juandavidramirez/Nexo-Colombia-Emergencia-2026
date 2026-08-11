import React from 'react';
import { HubInfo, CategoryType } from '../types';
import { ShieldCheck, ArrowRight, ArrowLeft, Users, Building2 } from 'lucide-react';

interface QuienesSomosViewProps {
  hubs: HubInfo[];
  onNavigateHomeWithCategory: (cat: CategoryType) => void;
  onNavigateHome: () => void;
}

export const QuienesSomosView: React.FC<QuienesSomosViewProps> = ({
  hubs,
  onNavigateHomeWithCategory,
  onNavigateHome
}) => {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">
      {/* Top back button with proper spacing */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1D5DBF] hover:bg-[#EAF1FB] px-3.5 py-2 rounded-xl transition-colors border border-transparent hover:border-[#D0E2FF]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio principal</span>
        </button>
      </div>

      {/* Title & Subtitle Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7A7264] mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB81C]"></span>
          <span>Quiénes somos</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B2A4A] leading-tight mb-3 tracking-tight">
          Detrás de Nexo Colombia está Global Shapers
        </h1>

        <p className="text-base sm:text-lg text-[#7A7264] leading-relaxed max-w-2xl font-normal">
          Antes de pedirte que confíes en esta información, queremos que sepas quién la está curando. Esto es lo que hay que saber.
        </p>
      </div>

      {/* Section 1: ¿Qué es Global Shapers? */}
      <section className="mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E1D2] shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-[#EAF1FB] text-[#1D5DBF]">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0B2A4A]">
            ¿Qué es Global Shapers?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1E1B16] leading-relaxed">
          <strong className="text-[#0B2A4A]">Global Shapers Community</strong> es una red global de jóvenes líderes, impulsada por el Foro Económico Mundial, organizada en capítulos locales en ciudades de todo el mundo. En Colombia y Venezuela, varios de esos capítulos se activaron para responder a la emergencia sísmica, de ahí nace Nexo Colombia.
        </p>
      </section>

      {/* Section 2: ¿Qué es un Hub? */}
      <section className="mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E1D2] shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-[#FFF6E2] text-[#8A5A00]">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0B2A4A]">
            ¿Qué es un Hub?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1E1B16] leading-relaxed">
          Un Hub es el punto de encuentro de la comunidad de Global Shapers en cada ciudad, algo así como su sede o sucursal local. Cada ciudad con presencia de Shapers tiene el suyo, y es el equipo que coordina la respuesta en su territorio.
        </p>
      </section>

      {/* Section 3: Hubs activos */}
      <section className="mb-8">
        <h2 className="text-xl font-extrabold text-[#0B2A4A] mb-2">
          Hubs activos en esta respuesta
        </h2>
        <p className="text-sm text-[#7A7264] mb-6">
          Cada ciudad con un Hub activo tiene un líder coordinando directamente. Si no hay un Hub activo todavía, lo indicamos con un aviso claro.
        </p>

        {/* Featured Regional Leader: Eca Iguarán */}
        <div className="mb-4 bg-[#FAF7F1] border border-[#E9E1D2] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-11 h-11 rounded-full bg-[#0B2A4A] text-white font-black text-sm flex items-center justify-center shrink-0">
            EI
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-[#0B2A4A]">
                Eca Iguarán
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#EAF1FB] text-[#1D5DBF]">
                Líder Regional
              </span>
            </div>
            <div className="text-xs sm:text-sm text-[#7A7264] mt-0.5 leading-normal">
              Líder de la comunidad Global Shapers Colombia y Venezuela
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-[#EAF1FB] text-[#1D5DBF] shrink-0 hidden sm:inline-block">
            Coordinación
          </span>
        </div>

        <div className="space-y-3">
          {hubs.map((h) => {
            const isChoco = h.ciudad.toLowerCase().includes('choco') || h.id.includes('choco');
            const isActive = h.estado === 'activo' && !isChoco;

            return (
              <div
                key={h.id}
                className="bg-white border border-[#E9E1D2] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs"
              >
                <div className="w-11 h-11 rounded-full bg-[#EAF1FB] text-[#1D5DBF] font-black text-sm flex items-center justify-center shrink-0">
                  {h.codigo}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-base font-extrabold text-[#0B2A4A]">
                    {h.ciudad}
                  </div>
                  {isChoco ? (
                    <div className="text-xs sm:text-sm text-[#8A5A00] mt-0.5 font-medium leading-normal">
                      Actualmente no tenemos Hub activo en Chocó, pero pronto tendremos un punto de contacto.
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-[#7A7264] mt-0.5 leading-normal">
                      <span className="font-bold text-[#0B2A4A]">Líder:</span> {h.persona}
                    </div>
                  )}
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-md shrink-0 ${
                    isActive
                      ? 'bg-[#E7F4EC] text-[#2F8F5B]'
                      : 'bg-[#FFF6E2] text-[#8A5A00]'
                  }`}
                >
                  {isActive ? 'Activo' : 'En búsqueda de contacto'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Verificación */}
      <section className="mb-10 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E1D2] shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-xl bg-[#E7F4EC] text-[#2F8F5B]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0B2A4A]">
            ¿Cómo verificamos la información?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#1E1B16] leading-relaxed">
          Todo lo que ves en Nexo Colombia pasa por un curador con nombre y Hub asignado antes de publicarse. Nada se publica sin un responsable identificable, esa es la regla que no negociamos.
        </p>
      </section>

      {/* Bottom CTA */}
      <div className="pt-2">
        <button
          onClick={() => onNavigateHomeWithCategory('hub')}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0B2A4A] hover:bg-[#081E38] text-white font-extrabold text-sm sm:text-base shadow-md transition-all active:scale-[0.98]"
        >
          <span>Ver iniciativas y servicios por ciudad</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  );
};
