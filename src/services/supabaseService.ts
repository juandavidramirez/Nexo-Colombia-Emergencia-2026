import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EmergencyRecord } from '../types';

let supabaseClient: SupabaseClient | null = null;

export const DEFAULT_SUPABASE_URL = "https://rovtonhncnlycfvjjjum.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdnRvbmhuY25seWNmdmpqanVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDQxMjcsImV4cCI6MjEwMjAyMDEyN30.dv7AdWPuRCbpcrFVGjENraKiM34KDb5Z-4rrcd3_TIk";

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || DEFAULT_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

export function setSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem('SUPABASE_URL', url.trim());
  localStorage.setItem('SUPABASE_ANON_KEY', anonKey.trim());
  supabaseClient = null;
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const client = getSupabaseClient();
  if (!client) {
    const { url, anonKey } = getSupabaseCredentials();
    if (!url) return { success: false, message: 'Falta la VITE_SUPABASE_URL.' };
    if (!anonKey) return { success: false, message: 'Falta la VITE_SUPABASE_ANON_KEY.' };
    return { success: false, message: 'No se pudo crear el cliente de Supabase.' };
  }

  try {
    const { data, error } = await client.from('nexo_donaciones').select('id').limit(1);
    if (error) {
      return { success: false, message: `Error de consulta en Supabase: ${error.message} (Código: ${error.code})`, details: error };
    }
    return { success: true, message: 'Conexión exitosa a Supabase con la tabla nexo_donaciones.', details: data };
  } catch (err: any) {
    return { success: false, message: `Excepción al conectar con Supabase: ${err.message || String(err)}` };
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;
  
  try {
    supabaseClient = createClient(url, anonKey);
    return supabaseClient;
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
    return null;
  }
}

/**
 * Inserts a record directly into its dedicated Supabase table according to category parametrization:
 * 1. Donar dinero -> nexo_donaciones
 * 2. Puntos de Acopio y Albergues -> nexo_acopio_albergues
 * 3. Qué se necesita ahora -> nexo_necesidades
 * 4. Iniciativas por ciudad -> nexo_iniciativas
 * 5. Buscar personas y mascotas -> nexo_buscar
 */
export async function insertRecordToSupabase(record: EmergencyRecord & { donacion_metodo?: 'cuenta' | 'link' }) {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase is not configured yet (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY).');
    return { success: false, message: 'Supabase no está configurado.' };
  }

  const nowIso = new Date().toISOString();
  const generatedId = record.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  try {
    const cat = record.categoria as string;
    switch (cat) {
      case 'donaciones':
      case 'donar': {
        const payload = {
          id: generatedId,
          fecha_actualizacion: nowIso,
          organizacion: record.organizacion || '',
          descripcion_organizacion: record.descripcion_organizacion || record.descripcion || '',
          banco: record.banco || '',
          tipo_cuenta: record.tipo_cuenta || 'Ahorros',
          numero_cuenta: record.numero_cuenta || '',
          ciudad_cobertura: record.ciudad_cobertura || record.ciudad || 'Nacional',
          tipo_transferencia: record.tipo_transferencia || 'Nacional',
          contacto_seguimiento: record.contacto_seguimiento || record.contacto || '',
          link: record.link || '',
          imagen_fuente: record.imagen_fuente || '',
          confirmado_por: '',
          fuente: 'Formulario público',
          estado: 'pendiente',
          origen: 'publico',
          extraido_por: ''
        };
        const { data, error } = await client.from('nexo_donaciones').insert([payload]);
        if (error) throw error;
        return { success: true, data };
      }

      case 'acopio': {
        const payload = {
          id: generatedId,
          fecha_actualizacion: nowIso,
          ciudad: record.ciudad || 'Nacional',
          titulo: record.titulo || record.organizacion || '',
          direccion: record.direccion || '',
          tipo: record.tipo_espacio || record.Tipo || 'Acopio',
          maps_link: record.maps_link || '',
          horario: record.horario || '',
          recibe: record.recibe || '',
          contacto: record.contacto || '',
          imagen_fuente: record.imagen_fuente || '',
          foto_display: record.foto_display || '',
          confirmado_por: '',
          fuente: 'Formulario público',
          estado: 'pendiente',
          origen: 'publico',
          extraido_por: ''
        };
        const { data, error } = await client.from('nexo_acopio_albergues').insert([payload]);
        if (error) throw error;
        return { success: true, data };
      }

      case 'necesidades': {
        const payload = {
          id: generatedId,
          fecha_hora: nowIso,
          ciudad: record.ciudad || 'Nacional',
          titulo: record.titulo || '',
          descripcion: record.descripcion || '',
          nivel_urgencia: record.nivel_urgencia || 'Media',
          contacto: record.contacto || '',
          imagen_fuente: record.imagen_fuente || '',
          fuente: record.fuente || 'Formulario público',
          confirmado_por: '',
          estado: 'pendiente',
          origen: 'publico',
          extraido_por: ''
        };
        const { data, error } = await client.from('nexo_necesidades').insert([payload]);
        if (error) throw error;
        return { success: true, data };
      }

      case 'hub':
      case 'iniciativas': {
        const payload = {
          id: generatedId,
          fecha_actualizacion: nowIso,
          ciudad: record.ciudad || '',
          titulo: record.titulo || '',
          organizacion: record.organizacion || '',
          lidera: record.lidera || '',
          descripcion: record.descripcion || '',
          contacto: record.contacto || '',
          tipo_iniciativa: record.tipo_iniciativa || '',
          imagen_fuente: record.imagen_fuente || '',
          link_display: record.link_display || record.link || '',
          confirmado_por: '',
          fuente: 'Formulario público',
          estado: 'pendiente',
          origen: 'publico',
          extraido_por: ''
        };
        const { data, error } = await client.from('nexo_iniciativas').insert([payload]);
        if (error) throw error;
        return { success: true, data };
      }

      case 'buscar': {
        const payload = {
          id: generatedId,
          fecha: nowIso,
          tipo: record.tipo_buscar || record.tipo || 'Personas',
          nombre: record.nombre || record.titulo || '',
          descripcion: record.descripcion || '',
          link: record.link || record.link_externo || '',
          foto_display: record.foto_display || '',
          confirmado_por: '',
          estado: 'pendiente',
          origen: 'publico'
        };
        const { data, error } = await client.from('nexo_buscar').insert([payload]);
        if (error) throw error;
        return { success: true, data };
      }

      default:
        return { success: false, message: `Categoría ${record.categoria} no soportada para inserción directa.` };
    }
  } catch (err: any) {
    console.error(`Error al insertar en Supabase para ${record.categoria}:`, err);
    return { success: false, message: err.message || 'Error al conectar con Supabase' };
  }
}
