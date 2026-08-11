export type CategoryType = 
  | 'donar'
  | 'acopio'
  | 'necesidades'
  | 'hub'
  | 'buscar'
  | 'contactos';

export type UrgencyLevel = 'urgent' | 'medium' | 'low';

export interface EmergencyRecord {
  id: string;
  categoria: CategoryType;
  ciudad: string; // e.g. "Bogotá", "Pereira", "Nacional", "Medellín, Cali, Bogotá"
  estado: 'aprobado' | 'pendiente' | 'rechazado';
  
  // Donar
  organizacion?: string;
  banco?: string;
  tipo_cuenta?: string;
  numero_cuenta?: string;
  tipo_transferencia?: 'Nacional' | 'Internacional' | 'Ambas';
  
  // Acopio / General
  titulo?: string;
  horario?: string;
  recibe?: string;
  direccion?: string;
  maps_link?: string;
  
  // Necesidades
  nivel_urgencia?: UrgencyLevel;
  descripcion?: string;
  fuente?: string;
  
  // Iniciativas
  lidera?: string;
  tipo_iniciativa?: string;
  link_display?: string;
  link?: string;
  
  // Buscar personas/mascotas
  tipo_buscar?: 'Personas' | 'Mascotas';
  link_externo?: string;
  
  // Contactos oficiales
  entidad?: string;
  
  // Shared audit metadata
  confirmado_por?: string;
  fecha?: string;
  fecha_hora?: string;
  contacto?: string;
  imagen_fuente?: string;
  foto_display?: string;
}

export interface EmergencyBalance {
  muertos: number;
  heridos: number;
  desaparecidos: number;
  encontrados_con_vida: number;
  fuente: string;
  actualizado: string;
}

export interface HubInfo {
  id: string;
  codigo: string;
  ciudad: string;
  persona: string;
  rol_actividad: string;
  estado: 'activo' | 'pendiente';
}

export type ViewPage = 'home' | 'quienes-somos';
