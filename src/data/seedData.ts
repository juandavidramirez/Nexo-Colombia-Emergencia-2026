import { EmergencyRecord, EmergencyBalance, HubInfo } from '../types';

export const INITIAL_BALANCE: EmergencyBalance = {
  muertos: 112,
  heridos: 340,
  desaparecidos: 58,
  encontrados_con_vida: 27,
  fuente: 'UNGRD · Puesto de Mando Unificado',
  actualizado: 'hoy 6:40pm'
};

export const INITIAL_HUBS: HubInfo[] = [
  {
    id: 'hub-riohacha',
    codigo: 'RI',
    ciudad: 'Riohacha Hub',
    persona: 'Arianna Borely',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-cartagena',
    codigo: 'CT',
    ciudad: 'Cartagena Hub',
    persona: 'Valentina Velasquez',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-santamarta',
    codigo: 'SM',
    ciudad: 'Santa Marta Hub',
    persona: 'Mariana Castro',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-bogota',
    codigo: 'BO',
    ciudad: 'Bogotá Hub',
    persona: 'Natalia Castro',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-medellin',
    codigo: 'ME',
    ciudad: 'Medellín Hub',
    persona: 'Silvia Rojas',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-manizales',
    codigo: 'MA',
    ciudad: 'Manizales Hub',
    persona: 'Paola Carmona',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-armenia',
    codigo: 'AR',
    ciudad: 'Armenia Hub',
    persona: 'Sharif Giraldo',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-cali',
    codigo: 'CL',
    ciudad: 'Cali Hub',
    persona: 'Andrea Jaramillo',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-pereira',
    codigo: 'PE',
    ciudad: 'Pereira Hub',
    persona: 'Yhojan Rojas',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-barranquilla',
    codigo: 'BA',
    ciudad: 'Barranquilla Hub',
    persona: 'Yuz Madera',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-caracas',
    codigo: 'CR',
    ciudad: 'Caracas Hub',
    persona: 'María Cristina París',
    rol_actividad: 'Líder de Hub',
    estado: 'activo'
  },
  {
    id: 'hub-choco',
    codigo: 'CH',
    ciudad: 'Chocó',
    persona: 'Búsqueda de punto de contacto',
    rol_actividad: 'Actualmente no tenemos Hub activo en Chocó, pronto tendremos un punto de contacto.',
    estado: 'pendiente'
  }
];

export const INITIAL_RECORDS: EmergencyRecord[] = [
  // 1. DONAR DINERO (💰)
  {
    id: 'don-1',
    categoria: 'donar',
    ciudad: 'Nacional',
    estado: 'aprobado',
    organizacion: 'Cruz Roja Colombiana',
    banco: 'Bancolombia',
    tipo_cuenta: 'Cuenta de Ahorros',
    numero_cuenta: '123-456789-00',
    tipo_transferencia: 'Nacional',
    confirmado_por: 'Laura G. · Hub Bogotá',
    fecha: 'hace 3h',
    contacto: '+57 601 437 6300',
    foto_display: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Fondo oficial para atención inmediata de heridos, compra de kits de emergencia y suministro de agua potable.'
  },
  {
    id: 'don-2',
    categoria: 'donar',
    ciudad: 'Medellín, Cali, Bogotá',
    estado: 'aprobado',
    organizacion: 'ABACO Banco de Alimentos',
    banco: 'Bancolombia',
    tipo_cuenta: 'Cuenta Corriente',
    numero_cuenta: '987-654321-00',
    tipo_transferencia: 'Nacional',
    confirmado_por: 'Camilo R. · Hub Medellín',
    fecha: 'hace 5h',
    contacto: 'donaciones@abaco.org.co',
    foto_display: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Compra masiva y logística de alimentos no perecederos para comedores comunitarios y albergues temporales.'
  },
  {
    id: 'don-3',
    categoria: 'donar',
    ciudad: 'Nacional',
    estado: 'aprobado',
    organizacion: 'Global Shapers — Impact Officers LATAM',
    banco: 'Davivienda',
    tipo_cuenta: 'Cuenta de Ahorros',
    numero_cuenta: '000-111222-33',
    tipo_transferencia: 'Internacional',
    confirmado_por: 'Hub Barranquilla',
    fecha: 'hace 1 día',
    contacto: 'impact@globalshapers.org',
    foto_display: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Fondo internacional para equipamiento técnico de cuadrillas de rescate local y potabilizadoras portátiles.'
  },
  {
    id: 'don-4',
    categoria: 'donar',
    ciudad: 'Pereira, Manizales',
    estado: 'aprobado',
    organizacion: 'Fundación Eje Cafetero Solidario',
    banco: 'Banco de Bogotá',
    tipo_cuenta: 'Cuenta de Ahorros',
    numero_cuenta: '450-891234-11',
    tipo_transferencia: 'Nacional',
    confirmado_por: 'Johana P. · Hub Pereira',
    fecha: 'hace 6h',
    contacto: '+57 310 456 7890',
    foto_display: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Adquisición de carpas térmicas, linternas industriales y generadores eléctricos para municipios rurales.'
  },

  // 2. PUNTOS DE ACOPIO (📦)
  {
    id: 'aco-1',
    categoria: 'acopio',
    ciudad: 'Bogotá',
    estado: 'aprobado',
    titulo: 'Cruz Roja — Palacio de los Deportes',
    organizacion: 'Cruz Roja Colombiana',
    horario: 'Lunes a Domingo · 8:00 am – 6:00 pm',
    recibe: 'Agua embotellada, cobijas térmicas, kits de aseo personal, alimentos no perecederos',
    direccion: 'Calle 63 # 59A-06, NQS',
    maps_link: 'https://maps.google.com/?q=Palacio+de+los+Deportes+Bogota',
    contacto: '+57 601 437 6300',
    confirmado_por: 'Laura G. · Hub Bogotá',
    fecha: 'hace 3h',
    foto_display: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Punto masivo de recolección y embalaje para distribución en vuelos humanitarios hacia el occidente.'
  },
  {
    id: 'aco-2',
    categoria: 'acopio',
    ciudad: 'Pereira',
    estado: 'aprobado',
    titulo: 'Coliseo Menor de Pereira',
    organizacion: 'Alcaldía de Pereira & Hub Pereira',
    horario: 'Lunes a Domingo · 7:00 am – 8:00 pm',
    recibe: 'Ropa abrigada (buen estado), pañales (bebés y adultos), kit de primeros auxilios',
    direccion: 'Carrera 13 # 14-40, Centro',
    maps_link: 'https://maps.google.com/?q=Coliseo+Menor+Pereira',
    contacto: '+57 300 111 2222',
    confirmado_por: 'Johana P. · Hub Pereira',
    fecha: 'hace 5h',
    foto_display: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Centro recepcionador habilitado como punto de acopio y refugio temporal diurno.'
  },
  {
    id: 'aco-3',
    categoria: 'acopio',
    ciudad: 'Manizales',
    estado: 'aprobado',
    titulo: 'Universidad de Caldas — Sede Central',
    organizacion: 'Defensa Civil & Voluntariado Universitario',
    horario: 'Lunes a Sábado · 8:00 am – 7:00 pm',
    recibe: 'Alimentos no perecederos, agua en garrafón, linternas y pilas D/AA',
    direccion: 'Calle 65 # 26-10, Palogrande',
    maps_link: 'https://maps.google.com/?q=Universidad+de+Caldas+Central',
    contacto: '+57 300 222 3333',
    confirmado_por: 'Valentina R. · Hub Manizales',
    fecha: 'hace 1 día',
    foto_display: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Punto administrado por brigadistas universitarios para empaque de kits de vereda.'
  },
  {
    id: 'aco-4',
    categoria: 'acopio',
    ciudad: 'Cali',
    estado: 'aprobado',
    titulo: 'Coliseo El Pueblo — Puerta 4',
    organizacion: 'Global Shapers Cali & Gestión del Riesgo',
    horario: 'Lunes a Domingo · 7:00 am – 8:00 pm',
    recibe: 'Colchonetas impermeables, carpas, herramientas de mano (palas, picos), guantes de carnaza',
    direccion: 'Av. Pasoancho con Cra 52',
    maps_link: 'https://maps.google.com/?q=Coliseo+El+Pueblo+Cali',
    contacto: '+57 300 333 4444',
    confirmado_por: 'Andrés M. · Hub Cali',
    fecha: 'hace 6h',
    foto_display: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Centro neurálgico de acopio para enviar convoyes hacia zona rural del Valle y Cauca.'
  },
  {
    id: 'aco-5',
    categoria: 'acopio',
    ciudad: 'Barranquilla',
    estado: 'aprobado',
    titulo: 'Paso del Norte — Centro Logístico',
    organizacion: 'Hub Barranquilla & Club Rotario',
    horario: 'Lunes a Viernes · 8:00 am – 5:00 pm',
    recibe: 'Medicamentos básicos, suero oral, pastillas potabilizadoras de agua',
    direccion: 'Vía 40 # 73-290',
    maps_link: 'https://maps.google.com/?q=Via+40+Barranquilla',
    contacto: '+57 301 777 9900',
    confirmado_por: 'Hub Barranquilla',
    fecha: 'hace 12h',
    foto_display: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    descripcion: 'Consolidación de medicamentos y suministros médicos para transporte aéreo.'
  },

  // 3. QUÉ SE NECESITA AHORA (🆘)
  {
    id: 'nec-1',
    categoria: 'necesidades',
    ciudad: 'Quibdó',
    estado: 'aprobado',
    titulo: 'Plantas eléctricas a diésel y combustible urgente',
    nivel_urgencia: 'urgent',
    descripcion: 'Se necesitan con urgencia 3 plantas eléctricas portátiles (mínimo 5kW) y diésel para mantener operativo el centro hospitalario de campaña y refrigeración de insumos médicos.',
    fuente: 'Curador Chocó / Centro Médico Local',
    confirmado_por: 'Juan David Ramírez',
    contacto: '+57 311 605 2531',
    fecha_hora: 'hace 2h'
  },
  {
    id: 'nec-2',
    categoria: 'necesidades',
    ciudad: 'Cali',
    estado: 'aprobado',
    titulo: 'Voluntarios certificados en rescate e inspección de estructuras',
    nivel_urgencia: 'urgent',
    descripcion: 'Se requieren ingenieros civiles, arquitectos o socorristas certificados para evaluación rápida de habitabilidad en barrios periféricos afectados.',
    fuente: 'Andrés M. · Hub Cali',
    confirmado_por: 'Andrés M.',
    contacto: '+57 300 555 6666',
    fecha_hora: 'hace 4h'
  },
  {
    id: 'nec-3',
    categoria: 'necesidades',
    ciudad: 'Pereira',
    estado: 'aprobado',
    titulo: 'Pañales para recién nacidos y leche de fórmula etapa 1 y 2',
    nivel_urgencia: 'medium',
    descripcion: 'Familias albergadas temporalmente en el Coliseo Menor reportan desabastecimiento de kits lactantes y teteros esterilizados.',
    fuente: 'Johana P. · Hub Pereira',
    confirmado_por: 'Johana P.',
    contacto: '+57 300 666 7777',
    fecha_hora: 'hace 6h'
  },
  {
    id: 'nec-4',
    categoria: 'necesidades',
    ciudad: 'Manizales',
    estado: 'aprobado',
    titulo: 'Botas de caucho industriales y plásticos gruesos para techos',
    nivel_urgencia: 'medium',
    descripcion: 'Para familias con viviendas con daños parciales en techos ante amenaza de precipitaciones en ladera.',
    fuente: 'Valentina R. · Hub Manizales',
    confirmado_por: 'Valentina R.',
    contacto: '+57 300 999 0000',
    fecha_hora: 'hace 8h'
  },

  // 4. INICIATIVAS POR CIUDAD (🏘️)
  {
    id: 'ini-1',
    categoria: 'hub',
    ciudad: 'Pereira',
    estado: 'aprobado',
    titulo: 'Red de Búsqueda y Enlace Familiar',
    organizacion: 'Global Shapers Pereira',
    lidera: 'Johana P.',
    descripcion: 'Coordinación voluntaria para personas sin contacto familiar. Verificación presencial en albergues y centros de salud.',
    contacto: '+57 300 777 8888',
    link_display: 'https://instagram.com/globalshaperspereira',
    fecha: 'hace 2h',
    foto_display: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
    tipo_iniciativa: 'búsqueda y comunicación'
  },
  {
    id: 'ini-2',
    categoria: 'hub',
    ciudad: 'Cali',
    estado: 'aprobado',
    titulo: 'Jornada Logística y Corredor Humanitario',
    organizacion: 'Global Shapers Cali',
    lidera: 'Andrés M.',
    descripcion: 'Operativa diaria de recepción, separación por categoría y despacho de suministros hacia municipios vecinos.',
    contacto: '+57 300 888 9999',
    link_display: 'https://instagram.com/globalshaperscali',
    fecha: 'hace 4h',
    foto_display: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    tipo_iniciativa: 'logística y acopio'
  },
  {
    id: 'ini-3',
    categoria: 'hub',
    ciudad: 'Manizales',
    estado: 'aprobado',
    titulo: 'Levantamiento de Necesidades en Zona Rural',
    organizacion: 'Global Shapers Manizales',
    lidera: 'Valentina R.',
    descripcion: 'Mapeo veredal en motocicleta y radiofrecuencia para registrar comunidades aisladas por derrumbes.',
    contacto: '+57 300 999 0000',
    link_display: 'https://instagram.com/globalshapersmanizales',
    fecha: 'hace 1 día',
    foto_display: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80',
    tipo_iniciativa: 'censo rural'
  },
  {
    id: 'ini-4',
    categoria: 'hub',
    ciudad: 'Bogotá',
    estado: 'aprobado',
    titulo: 'Habilitación de Refugios Temporales y Apoyo Psicosocial',
    organizacion: 'Cruz Roja Colombiana & Voluntarios Shapers',
    lidera: 'Equipo Cruz Roja',
    descripcion: 'Atención psicológica de primeros auxilios y espacios seguros para niños y adultos mayores.',
    contacto: '+57 601 555 4444',
    link_display: 'https://cruzrojacolombiana.org',
    fecha: 'hace 8h',
    foto_display: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
    tipo_iniciativa: 'salud y refugio'
  },

  // 5. BUSCAR PERSONAS Y MASCOTAS (🔍)
  {
    id: 'bus-1',
    categoria: 'buscar',
    ciudad: 'Nacional',
    estado: 'aprobado',
    titulo: 'Colombia Te Busca — Plataforma Oficial de Registro y Consulta',
    organizacion: 'Colombia Te Busca',
    tipo_buscar: 'Personas',
    descripcion: 'Plataforma nacional unificada para el registro, consulta y cruce de datos de personas desaparecidas o localizadas en refugios y albergues.',
    contacto: 'colombiatebusca.com',
    link_display: 'https://colombiatebusca.com',
    link_externo: 'https://colombiatebusca.com',
    link: 'https://colombiatebusca.com',
    confirmado_por: 'Plataforma Nacional',
    foto_display: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bus-2',
    categoria: 'buscar',
    ciudad: 'Nacional',
    estado: 'aprobado',
    titulo: 'Cruz Roja Colombiana — Servicio de Restablecimiento de Contacto Familiar (RCF)',
    organizacion: 'Cruz Roja Colombiana',
    tipo_buscar: 'Personas',
    descripcion: 'Atención unificada y recepción de solicitudes para ubicar a familiares sin contacto o incomunicados por la emergencia sísmica.',
    contacto: 'cruzrojacolombiana.org',
    link_display: 'https://cruzrojacolombiana.org',
    link_externo: 'https://cruzrojacolombiana.org',
    link: 'https://cruzrojacolombiana.org',
    confirmado_por: 'Cruz Roja Colombia',
    foto_display: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bus-3',
    categoria: 'buscar',
    ciudad: 'Pereira',
    estado: 'aprobado',
    titulo: 'Brigada de Búsqueda y Registro Pereira',
    organizacion: 'Red Ciudadana Pereira',
    tipo_buscar: 'Personas',
    descripcion: 'Voluntarios en terreno rastreando zonas afectadas para cruzar datos y enviar reportes verificados a Colombia Te Busca.',
    contacto: '+57 300 777 8888',
    link_display: 'https://colombiatebusca.com',
    link_externo: 'https://colombiatebusca.com',
    confirmado_por: 'Global Shapers Pereira',
    foto_display: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bus-4',
    categoria: 'buscar',
    ciudad: 'Cali',
    estado: 'aprobado',
    titulo: 'Rescate Animal y Reunificación de Mascotas Cali',
    organizacion: 'Red de Protección Animal Cali',
    tipo_buscar: 'Mascotas',
    descripcion: 'Coordinación comunitaria para rescate de perros y gatos extraviados durante el sismo y alojamiento temporal.',
    contacto: 'instagram.com/rescateanimalcali',
    link_display: 'https://instagram.com/rescateanimalcali',
    link_externo: 'https://instagram.com/rescateanimalcali',
    confirmado_por: 'Voluntariado Animal Cali',
    foto_display: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'bus-5',
    categoria: 'buscar',
    ciudad: 'Pereira',
    estado: 'aprobado',
    titulo: 'Huellitas Pereira — Refugio Temporal Animal',
    organizacion: 'Fundación Huellitas',
    tipo_buscar: 'Mascotas',
    descripcion: 'Hogar de paso para mascotas de familias damnificadas mientras se estabiliza su situación habitacional.',
    contacto: 'facebook.com/huellitaspereira',
    link_display: 'https://facebook.com/huellitaspereira',
    link_externo: 'https://facebook.com/huellitaspereira',
    confirmado_por: 'Fundación Huellitas',
    foto_display: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80'
  },

  // 6. CONTACTOS OFICIALES (📞)
  {
    id: 'con-1',
    categoria: 'contactos',
    ciudad: 'Nacional',
    estado: 'aprobado',
    entidad: 'Línea Unificada de Emergencias Nacional',
    contacto: '123',
    confirmado_por: 'Ministerio del Interior',
    descripcion: 'Línea prioritaria gratuita para solicitar ambulancias, cuerpo de bomberos, policía o rescate inmediato.'
  },
  {
    id: 'con-2',
    categoria: 'contactos',
    ciudad: 'Nacional',
    estado: 'aprobado',
    entidad: 'UNGRD — Puesto de Mando Unificado Nacional',
    contacto: 'gestiondelriesgo.gov.co',
    confirmado_por: 'UNGRD Oficial',
    descripcion: 'Coordinación oficial de la respuesta nacional a la emergencia sísmica y boletines de evolución técnica.'
  },
  {
    id: 'con-3',
    categoria: 'contactos',
    ciudad: 'Nacional',
    estado: 'aprobado',
    entidad: 'Servicio Geológico Colombiano (SGC)',
    contacto: 'sgc.gov.co',
    confirmado_por: 'SGC Oficial',
    descripcion: 'Información sísmica oficial, réplicas registradas, monitoreo tectónico y recomendaciones técnicas.'
  },
  {
    id: 'con-4',
    categoria: 'contactos',
    ciudad: 'Nacional',
    estado: 'aprobado',
    entidad: 'Cruz Roja Colombiana — Central Nacional',
    contacto: 'cruzrojacolombiana.org',
    confirmado_por: 'Cruz Roja',
    descripcion: 'Directorio nacional de donaciones, puntos de acopio oficiales y restablecimiento de contactos familiares.'
  },
  {
    id: 'con-5',
    categoria: 'contactos',
    ciudad: 'Cali',
    estado: 'aprobado',
    entidad: 'Gestión del Riesgo Cali (DAGRD)',
    contacto: '+57 602 889 1120',
    confirmado_por: 'Alcaldía de Cali',
    descripcion: 'Línea local para reporte de colapsos estructurales, fugas de gas o árboles en riesgo en Santiago de Cali.'
  },
  {
    id: 'con-6',
    categoria: 'contactos',
    ciudad: 'Pereira',
    estado: 'aprobado',
    entidad: 'DIGER Pereira — Gestión del Riesgo',
    contacto: '+57 606 324 8210',
    confirmado_por: 'Alcaldía de Pereira',
    descripcion: 'Atención a emergencias locales, evaluación técnica de edificaciones y coordinación de albergues en Risaralda.'
  }
];

export const CITIES_LIST = [
  'Todas',
  'Bogotá',
  'Cali',
  'Medellín',
  'Pereira',
  'Manizales',
  'Quibdó',
  'Barranquilla'
];
