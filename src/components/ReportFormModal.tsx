import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Send, ChevronRight, HeartHandshake } from 'lucide-react';
import { CategoryType, EmergencyRecord, UrgencyLevel } from '../types';
import { dataService } from '../services/dataService';
import { appendRecordToGoogleSheet, getStoredSheetId } from '../services/googleSheetsService';
import { insertRecordToSupabase } from '../services/supabaseService';

const DICTIONARY_CITIES = [
  'Manizales',
  'Quibdó',
  'Armenia',
  'Pereira',
  'Cali',
  'Medellín',
  'Bogotá',
  'Chocó (Otras zonas)',
  'Otras partes del país',
  'Nacional'
];

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryType;
  onRecordCreated?: () => void;
}

const CATEGORY_OPTIONS: { 
  key: CategoryType; 
  label: string; 
  icon: string; 
  badgeColor: string;
  desc: string;
  examples: string;
}[] = [
  { 
    key: 'donar', 
    label: 'Dónde donar', 
    icon: '💳', 
    badgeColor: 'bg-[#EAF1FB] text-[#1D5DBF] border-[#1D5DBF]/30',
    desc: 'Cuentas bancarias, Nequi, Daviplata y plataformas web de recaudación.',
    examples: 'Ej: Cuenta de ahorros oficial, Nequi de brigada, recaudación Zelle/PayPal'
  },
  { 
    key: 'acopio', 
    label: 'Puntos de acopio / Albergues', 
    icon: '📦', 
    badgeColor: 'bg-[#FFF6E2] text-[#8A5A00] border-[#8A5A00]/30',
    desc: 'Lugares físicos para recibir insumos o refugios para damnificados.',
    examples: 'Ej: Coliseos, sedes comunitarias, escuelas habilitadas'
  },
  { 
    key: 'necesidades', 
    label: 'Necesidades urgentes', 
    icon: '🆘', 
    badgeColor: 'bg-[#FDF2F2] text-[#9B1C1C] border-[#9B1C1C]/30',
    desc: 'Solicitudes prioritarias e insumos faltantes para una comunidad.',
    examples: 'Ej: Medicamentos, herramientas, agua potable, linternas'
  },
  { 
    key: 'hub', 
    label: 'Iniciativa y servicio', 
    icon: '🏘️', 
    badgeColor: 'bg-[#EBF7EE] text-[#1E5E2F] border-[#1E5E2F]/30',
    desc: 'Iniciativas, servicios comunitarios, transporte, apoyo técnico y convocatorias.',
    examples: 'Ej: Red de apoyo psicológico, transporte comunitario, servicio de orientación'
  },
  { 
    key: 'buscar', 
    label: 'Búsqueda de personas / mascotas', 
    icon: '🔍', 
    badgeColor: 'bg-[#FAF5FF] text-[#6B21A8] border-[#6B21A8]/30',
    desc: 'Iniciativas o soluciones que estén generando alertas, reportes o estén relacionados con la búsqueda e identificación de personas y mascotas desaparecidas.',
    examples: 'Ej: Plataforma de alertas de personas extraviadas, canal de reporte o grupo de búsqueda'
  }
];

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onRecordCreated
}) => {
  // Step State: null = Step 1 (Select Type), CategoryType = Step 2 (Form Questions)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Common Form Fields
  const [ciudad, setCiudad] = useState<string>('Manizales');
  const [organizacion, setOrganizacion] = useState<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [contacto, setContacto] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [fuente, setFuente] = useState<string>('');
  const [imagenFuente, setImagenFuente] = useState<string>('');

  // Donar specific
  const [banco, setBanco] = useState<string>('');
  const [tipoCuenta, setTipoCuenta] = useState<string>('Ahorros');
  const [numeroCuenta, setNumeroCuenta] = useState<string>('');
  const [donacionMetodo, setDonacionMetodo] = useState<'cuenta' | 'link'>('cuenta');
  const [tipoTransferencia, setTipoTransferencia] = useState<'Nacional' | 'Internacional'>('Nacional');

  // Acopio specific
  const [tipoEspacio, setTipoEspacio] = useState<'Acopio' | 'Albergue'>('Acopio');
  const [recibe, setRecibe] = useState<string>('');
  const [horario, setHorario] = useState<string>('');
  const [mapsLink, setMapsLink] = useState<string>('');

  // Necesidades specific
  const [nivelUrgencia, setNivelUrgencia] = useState<string>('Media');

  // Hub specific
  const [lidera, setLidera] = useState<string>('');
  const [tipoIniciativa, setTipoIniciativa] = useState<string>('');

  // Buscar specific
  const [tipoBuscar, setTipoBuscar] = useState<'Personas' | 'Mascotas'>('Personas');
  const [fotoDisplay, setFotoDisplay] = useState<string>('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(null);
      setStatusMessage(null);
      resetFormFields();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function resetFormFields() {
    setCiudad('Manizales');
    setOrganizacion('');
    setTitulo('');
    setDescripcion('');
    setContacto('');
    setDireccion('');
    setLink('');
    setFuente('');
    setImagenFuente('');
    setBanco('');
    setTipoCuenta('Ahorros');
    setNumeroCuenta('');
    setDonacionMetodo('cuenta');
    setTipoTransferencia('Nacional');
    setTipoEspacio('Acopio');
    setRecibe('');
    setHorario('');
    setMapsLink('');
    setNivelUrgencia('Media');
    setLidera('');
    setTipoIniciativa('');
    setTipoBuscar('Personas');
    setFotoDisplay('');
  }

  const handleSelectCategory = (catKey: CategoryType) => {
    setSelectedCategory(catKey);
    setStatusMessage(null);
  };

  const handleBackToStep1 = () => {
    setSelectedCategory(null);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    let recordPayload: Partial<EmergencyRecord> & { categoria: CategoryType; donacion_metodo?: 'cuenta' | 'link' } = {
      categoria: selectedCategory,
      ciudad: ciudad || 'Nacional',
      confirmado_por: '',
      estado: 'aprobado',
      fecha: 'Hace un momento',
      fecha_hora: new Date().toISOString()
    };

    if (selectedCategory === 'donar') {
      if (!organizacion.trim()) {
        setStatusMessage({ type: 'error', text: 'El campo Organización es obligatorio (*).' });
        setIsSubmitting(false);
        return;
      }
      if (donacionMetodo === 'cuenta' && !numeroCuenta.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor ingresa el Número de cuenta o Teléfono llave para donación (*).' });
        setIsSubmitting(false);
        return;
      }
      if (donacionMetodo === 'link' && !link.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor ingresa la URL/Link oficial de donación (*).' });
        setIsSubmitting(false);
        return;
      }

      recordPayload = {
        ...recordPayload,
        organizacion: organizacion.trim(),
        descripcion_organizacion: descripcion.trim(),
        descripcion: descripcion.trim() || `Donación a ${organizacion.trim()}`,
        banco: banco.trim(),
        tipo_cuenta: tipoCuenta,
        numero_cuenta: numeroCuenta.trim(),
        ciudad_cobertura: ciudad,
        ciudad: ciudad,
        tipo_transferencia: tipoTransferencia,
        contacto_seguimiento: contacto.trim(),
        contacto: contacto.trim(),
        link: link.trim(),
        link_display: link.trim(),
        imagen_fuente: imagenFuente.trim(),
        fuente: 'Formulario público',
        donacion_metodo: donacionMetodo
      };
    } else if (selectedCategory === 'acopio') {
      if (!ciudad || !titulo.trim() || !direccion.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor completa los campos obligatorios (*): Ciudad, Nombre del punto y Dirección.' });
        setIsSubmitting(false);
        return;
      }
      recordPayload = {
        ...recordPayload,
        ciudad: ciudad,
        titulo: titulo.trim(),
        direccion: direccion.trim(),
        Tipo: tipoEspacio,
        tipo_espacio: tipoEspacio,
        maps_link: mapsLink.trim(),
        horario: horario.trim(),
        recibe: recibe.trim(),
        contacto: contacto.trim(),
        descripcion: `[${tipoEspacio}] ${recibe.trim() ? 'Recibe: ' + recibe.trim() : ''}. Dirección: ${direccion.trim()}`,
        organizacion: titulo.trim(),
        imagen_fuente: imagenFuente.trim(),
        foto_display: fotoDisplay.trim(),
        fuente: 'Formulario público'
      };
    } else if (selectedCategory === 'necesidades') {
      if (!ciudad || !titulo.trim() || !descripcion.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor completa los campos obligatorios (*): Ciudad, Título y Descripción.' });
        setIsSubmitting(false);
        return;
      }
      recordPayload = {
        ...recordPayload,
        ciudad: ciudad,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        nivel_urgencia: nivelUrgencia as any,
        contacto: contacto.trim(),
        organizacion: 'Comunidad Local',
        imagen_fuente: imagenFuente.trim(),
        fuente: fuente.trim() || 'Formulario público'
      };
    } else if (selectedCategory === 'hub') {
      if (!ciudad.trim() || !titulo.trim() || !organizacion.trim() || !descripcion.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor completa los campos obligatorios (*): Ciudad, Título de la iniciativa o servicio, Organización y Descripción.' });
        setIsSubmitting(false);
        return;
      }
      recordPayload = {
        ...recordPayload,
        ciudad: ciudad.trim(),
        titulo: titulo.trim(),
        organizacion: organizacion.trim(),
        lidera: lidera.trim(),
        descripcion: descripcion.trim(),
        contacto: contacto.trim(),
        tipo_iniciativa: tipoIniciativa.trim() || 'Servicio',
        Link_display: link.trim(),
        link: link.trim(),
        link_display: link.trim(),
        imagen_fuente: imagenFuente.trim(),
        fuente: 'Formulario público'
      };
    } else if (selectedCategory === 'buscar') {
      if (!titulo.trim() || !descripcion.trim() || !link.trim()) {
        setStatusMessage({ type: 'error', text: 'Por favor completa los campos obligatorios (*): Nombre de la iniciativa, Qué hace la iniciativa y Link / URL de la iniciativa.' });
        setIsSubmitting(false);
        return;
      }
      recordPayload = {
        ...recordPayload,
        ciudad: ciudad || 'Nacional',
        tipo: tipoBuscar,
        tipo_buscar: tipoBuscar,
        nombre: titulo.trim(),
        titulo: titulo.trim(),
        organizacion: `Iniciativa de búsqueda (${tipoBuscar})`,
        descripcion: descripcion.trim(),
        contacto: contacto.trim(),
        link: link.trim(),
        link_display: link.trim(),
        link_externo: link.trim(),
        foto_display: fotoDisplay.trim(),
        imagen_fuente: fotoDisplay.trim()
      };
    }

    // 1. Save locally to UI State
    const createdRecord = dataService.addRecord(recordPayload);

    // 2. Insert into Supabase table according to category
    let supabaseStatus = '';
    try {
      const res = await insertRecordToSupabase(createdRecord);
      if (res.success) {
        supabaseStatus = 'Guardado en la base de datos de Supabase.';
        dataService.tryFetchSupabase();
      } else if (res.message) {
        console.warn('Supabase notice:', res.message);
        supabaseStatus = `(Supabase: ${res.message})`;
      }
    } catch (sbErr: any) {
      console.warn('Supabase error:', sbErr);
      supabaseStatus = `(Error Supabase: ${sbErr.message || String(sbErr)})`;
    }

    // 3. Backup: Append to Google Sheets if configured
    const targetSheetId = getStoredSheetId();
    if (targetSheetId) {
      try {
        await appendRecordToGoogleSheet(createdRecord, targetSheetId);
      } catch (err) {
        console.warn('Error syncing with Google Sheets:', err);
      }
    }

    setIsSubmitting(false);
    setStatusMessage({
      type: 'success',
      text: `¡Muchas gracias! Tu información se ha registrado con éxito. ${supabaseStatus}`
    });

    if (onRecordCreated) {
      onRecordCreated();
    }

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const activeOptionMeta = CATEGORY_OPTIONS.find((c) => c.key === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B2A4A]/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E9E1D2] shadow-2xl w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#0B2A4A] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#EAF1FB]/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 text-[#FFB81C] text-xs font-black uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Aporte Ciudadano Collaborativo</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Comparte Información
          </h2>
          <p className="text-xs sm:text-sm text-[#EAF1FB]/90 mt-1 max-w-lg">
            Aporta datos verificados a la comunidad. Selecciona la opción que deseas compartir e ingresa la información requerida.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mb-4 p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-fadeIn ${
                statusMessage.type === 'success'
                  ? 'bg-[#EBF7EE] text-[#1E5E2F] border-[#A2DBB0]'
                  : 'bg-[#FDF2F2] text-[#9B1C1C] border-[#F8B4B4]'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2F8F5B] mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-[#C1443B] mt-0.5" />
              )}
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {/* STEP 1: SELECTION OF INFORMATION TYPE */}
          {!selectedCategory ? (
            <div className="space-y-4">
              <div className="text-xs sm:text-sm font-extrabold text-[#0B2A4A] border-b border-[#E9E1D2] pb-2">
                ¿Qué tipo de información deseas compartir?
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleSelectCategory(cat.key)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-2xl border border-[#E9E1D2] bg-[#FAF7F1] hover:bg-white hover:border-[#0B2A4A] hover:shadow-md transition-all cursor-pointer group flex items-start gap-3.5"
                  >
                    <div className="text-2xl sm:text-3xl p-2 rounded-2xl bg-white border border-[#E9E1D2] group-hover:scale-105 transition-transform shrink-0">
                      {cat.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-sm sm:text-base text-[#0B2A4A] group-hover:text-[#1D5DBF] transition-colors">
                          {cat.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#7A7264] group-hover:text-[#0B2A4A] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                      <p className="text-xs text-[#5B6B7A] mt-0.5 font-medium leading-relaxed">
                        {cat.desc}
                      </p>
                      <span className="text-[11px] text-[#7A7264] mt-1 block italic">
                        {cat.examples}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: SPECIFIC QUESTIONS FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Back to Step 1 & Selected Category Header */}
              <div className="flex items-center justify-between gap-2 bg-[#FAF7F1] p-3 rounded-2xl border border-[#E9E1D2]">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B2A4A] bg-white border border-[#E9E1D2] hover:bg-[#EAF1FB] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#1D5DBF]" />
                  <span>Elegir otro tipo</span>
                </button>

                {activeOptionMeta && (
                  <div className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 ${activeOptionMeta.badgeColor}`}>
                    <span>{activeOptionMeta.icon}</span>
                    <span>{activeOptionMeta.label}</span>
                  </div>
                )}
              </div>

              {/* FORM TYPE 1: DONAR */}
              {selectedCategory === 'donar' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Organización / Colectivo *
                      </label>
                      <input
                        type="text"
                        value={organizacion}
                        onChange={(e) => setOrganizacion(e.target.value)}
                        placeholder="Ej. Cruz Roja Colombiana, Techo, Fundación Local"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Ciudad / Cobertura *
                      </label>
                      <select
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        {DICTIONARY_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      ¿Cómo se realiza la donación? *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDonacionMetodo('cuenta')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          donacionMetodo === 'cuenta'
                            ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                            : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                        }`}
                      >
                        🏦 Cuenta Bancaria / Nequi / Billetera
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonacionMetodo('link')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          donacionMetodo === 'link'
                            ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                            : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                        }`}
                      >
                        🔗 Link Web / Plataforma Oficial
                      </button>
                    </div>
                  </div>

                  {donacionMetodo === 'cuenta' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF7F1] p-3 rounded-2xl border border-[#E9E1D2]">
                      <div>
                        <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                          Número de Cuenta / Teléfono Llave *
                        </label>
                        <input
                          type="text"
                          value={numeroCuenta}
                          onChange={(e) => setNumeroCuenta(e.target.value)}
                          placeholder="Ej. 300 123 4567 o 031-123456-8"
                          required
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                          Banco / Entidad (Opcional)
                        </label>
                        <input
                          type="text"
                          value={banco}
                          onChange={(e) => setBanco(e.target.value)}
                          placeholder="Ej. Bancolombia, Nequi, Daviplata"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                          Tipo de Cuenta (Opcional)
                        </label>
                        <select
                          value={tipoCuenta}
                          onChange={(e) => setTipoCuenta(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                        >
                          <option value="Ahorros">Ahorros</option>
                          <option value="Corriente">Corriente</option>
                          <option value="Llave / Nequi">Llave / Nequi</option>
                          <option value="Billetera Digital">Billetera Digital</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#FAF7F1] p-3 rounded-2xl border border-[#E9E1D2]">
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Link de Donación Oficial *
                      </label>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://vaki.co/... o sitio oficial"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Tipo de Transferencia
                      </label>
                      <select
                        value={tipoTransferencia}
                        onChange={(e) => setTipoTransferencia(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        <option value="Nacional">Nacional</option>
                        <option value="Internacional">Internacional (Zelle/PayPal/SWIFT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Contacto de Seguimiento (Opcional)
                      </label>
                      <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +57 300 000 0000 o @organizacion"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Descripción de la Organización (Opcional)
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Nombre del titular, NIT o destino específico de los fondos..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Imagen o Captura Fuente (URL, Opcional)
                    </label>
                    <input
                      type="url"
                      value={imagenFuente}
                      onChange={(e) => setImagenFuente(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>
                </div>
              )}

              {/* FORM TYPE 2: ACOPIO Y ALBERGUES */}
              {selectedCategory === 'acopio' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Ciudad / Municipio *
                      </label>
                      <select
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        {DICTIONARY_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Tipo de Espacio *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTipoEspacio('Acopio')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            tipoEspacio === 'Acopio'
                              ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                              : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                          }`}
                        >
                          📦 Acopio
                        </button>
                        <button
                          type="button"
                          onClick={() => setTipoEspacio('Albergue')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            tipoEspacio === 'Albergue'
                              ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                              : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                          }`}
                        >
                          🏠 Albergue
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Nombre del espacio o lugar *
                    </label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej. Coliseo El Salitre, Casa de la Cultura, Centro Comunitario"
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Dirección exacta o referencia *
                    </label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Ej. Cra 60 # 63-65, frente al parque principal"
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      ¿Qué reciben o prestan? (Opcional)
                    </label>
                    <textarea
                      value={recibe}
                      onChange={(e) => setRecibe(e.target.value)}
                      placeholder="Ej. Alimentos no perecederos, agua, cobijas, atención médica..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Horarios de Atención (Opcional)
                      </label>
                      <input
                        type="text"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        placeholder="Ej. Lunes a Domingo 8:00 AM - 6:00 PM"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Contacto (Opcional)
                      </label>
                      <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +57 310 123 4567"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Ubicación en Google Maps (URL, Opcional)
                    </label>
                    <input
                      type="url"
                      value={mapsLink}
                      onChange={(e) => setMapsLink(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>
                </div>
              )}

              {/* FORM TYPE 3: NECESIDADES URGENTES */}
              {selectedCategory === 'necesidades' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Ciudad / Municipio *
                      </label>
                      <select
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        {DICTIONARY_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Nivel de Urgencia *
                      </label>
                      <select
                        value={nivelUrgencia}
                        onChange={(e) => setNivelUrgencia(e.target.value as UrgencyLevel)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        <option value="urgent">🔴 Alta / Inmediata (Agua, salud, rescate)</option>
                        <option value="medium">🟡 Media (Herramientas, aseo)</option>
                        <option value="low">🟢 Baja (Apoyo general)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Título de la necesidad *
                    </label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej. Insumos médicos urgentes y agua potable para puesto de salud"
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Detalle de Insumos / Necesidades *
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Ej. Se requieren urgentemente 50 linternas, baterías AA, 100 litros de agua y suero para niños..."
                      rows={3}
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Sector / Barrio específico
                      </label>
                      <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Ej. Vereda El Salado, Calle 45 con Cra 12"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Teléfono de Contacto directo
                      </label>
                      <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +57 301 555 4321"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FORM TYPE 4: INICIATIVA Y SERVICIO */}
              {selectedCategory === 'hub' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Ciudad / Cobertura *
                      </label>
                      <select
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        {DICTIONARY_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Tipo de iniciativa o servicio *
                      </label>
                      <select
                        value={tipoIniciativa}
                        onChange={(e) => setTipoIniciativa(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        <option value="Voluntariado y Apoyo Comunitario">Voluntariado y Apoyo Comunitario</option>
                        <option value="Salud y Atención Médica / Psicológica">Salud y Atención Médica / Psicológica</option>
                        <option value="Logística y Transporte">Logística y Transporte</option>
                        <option value="Servicios Técnicos y Profesionales">Servicios Técnicos y Profesionales</option>
                        <option value="Atención e Insumos">Atención e Insumos Comunitarios</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Título de la iniciativa o servicio *
                    </label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej. Transporte comunitario de víveres, Red de apoyo psicológico gratuito"
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Organización / Colectivo *
                      </label>
                      <input
                        type="text"
                        value={organizacion}
                        onChange={(e) => setOrganizacion(e.target.value)}
                        placeholder="Ej. Red de Estudiantes, Brigada K9"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Persona o Liderazgo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={lidera}
                        onChange={(e) => setLidera(e.target.value)}
                        placeholder="Ej. Colectivo Joven / Dra. María"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Descripción y Objetivos *
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Explica en qué consiste la ayuda, horarios y cómo sumarse..."
                      rows={2}
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Teléfono / WhatsApp de contacto
                      </label>
                      <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +57 320 999 8877"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Enlace de Inscripción / Redes
                      </label>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://forms.gle/... o Instagram"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FORM TYPE 5: BÚSQUEDA DE PERSONAS/MASCOTAS (INICIATIVAS Y SOLUCIONES) */}
              {selectedCategory === 'buscar' && (
                <div className="space-y-3.5">
                  <div className="bg-[#FAF5FF] p-3 rounded-xl border border-[#6B21A8]/20 text-xs text-[#6B21A8] flex items-start gap-2">
                    <span className="text-base leading-none shrink-0">ℹ️</span>
                    <p className="leading-relaxed font-medium">
                      <strong>Espacio exclusivo para compartir iniciativas de búsqueda:</strong> Comparte soluciones, plataformas, brigadas o canales que generen alertas, reportes o apoyen la búsqueda e identificación de personas y mascotas desaparecidas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Ciudad / Cobertura *
                      </label>
                      <select
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      >
                        {DICTIONARY_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Orientada a la búsqueda de *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTipoBuscar('Personas')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            tipoBuscar === 'Personas'
                              ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                              : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                          }`}
                        >
                          👤 Personas
                        </button>
                        <button
                          type="button"
                          onClick={() => setTipoBuscar('Mascotas')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            tipoBuscar === 'Mascotas'
                              ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]'
                              : 'bg-[#FAF7F1] border-[#E9E1D2] text-[#7A7264]'
                          }`}
                        >
                          🐾 Mascotas
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Nombre de la iniciativa *
                    </label>
                    <input
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej. Red de Búsqueda AlertaDesaparecidos Colombia, Grupo K9 Rescate Mascotas"
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      ¿Qué hace esta iniciativa en pocas palabras? *
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Describe brevemente cómo la iniciativa genera alertas, centraliza reportes o coordina la búsqueda..."
                      rows={2}
                      required
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Link / URL de la iniciativa *
                      </label>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://... o enlace oficial de la iniciativa"
                        required
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                        Contacto / WhatsApp (Opcional)
                      </label>
                      <input
                        type="text"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej. +57 312 000 1122"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#0B2A4A] mb-1">
                      Fotografía / Imagen (URL, Opcional)
                    </label>
                    <input
                      type="url"
                      value={fotoDisplay}
                      onChange={(e) => setFotoDisplay(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E9E1D2] bg-[#FAF7F1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D5DBF]"
                    />
                  </div>
                </div>
              )}

              {/* Action buttons inside form */}
              <div className="pt-3 border-t border-[#E9E1D2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#7A7264] hover:bg-[#FAF7F1] border border-[#E9E1D2] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#0B2A4A] hover:bg-[#081E38] shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#FFB81C]" />
                      <span>Enviando reporte...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#FFB81C]" />
                      <span>Publicar Información</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
