import { EmergencyRecord, EmergencyBalance, HubInfo, CategoryType } from '../types';
import { INITIAL_RECORDS, INITIAL_BALANCE, INITIAL_HUBS } from '../data/seedData';

// Default Supabase Credentials (from project config)
const DEFAULT_SUPABASE_URL = "https://rovtonhncnlycfvjjjum.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdnRvbmhuY25seWNmdmpqanVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDQxMjcsImV4cCI6MjEwMjAyMDEyN30.dv7AdWPuRCbpcrFVGjENraKiM34KDb5Z-4rrcd3_TIk";

// Normalized search string helper (strips accents, lowercase)
export function normalizeText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

class DataService {
  private records: EmergencyRecord[] = INITIAL_RECORDS;
  private balance: EmergencyBalance = INITIAL_BALANCE;
  private hubs: HubInfo[] = INITIAL_HUBS;
  private listeners: Array<() => void> = [];

  constructor() {
    this.tryFetchSupabase();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public async tryFetchSupabase() {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
      if (!url || !key) return;

      const headers = {
        apikey: key,
        Authorization: `Bearer ${key}`
      };

      // Table mapping to categories
      const tablesMap: Record<string, CategoryType> = {
        nexo_donaciones: 'donar',
        nexo_acopio_albergues: 'acopio',
        nexo_necesidades: 'necesidades',
        nexo_iniciativas: 'hub',
        nexo_buscar: 'buscar',
        nexo_contactos: 'contactos'
      };

      const fetchedRecords: EmergencyRecord[] = [];

      // Fetch from the 6 category tables in parallel
      const fetchPromises = Object.entries(tablesMap).map(async ([table, category]) => {
        try {
          const res = await fetch(`${url}/rest/v1/${table}?select=*`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              return data.map((item: any) => this.mapRowToRecord(item, category));
            }
          }
        } catch (err) {
          console.warn(`Error fetching table ${table}:`, err);
        }
        return [];
      });

      const results = await Promise.all(fetchPromises);
      results.forEach((records) => fetchedRecords.push(...records));

      // Fetch balance table
      try {
        const balRes = await fetch(`${url}/rest/v1/nexo_balance?select=*`, { headers });
        if (balRes.ok) {
          const balData = await balRes.json();
          if (Array.isArray(balData) && balData.length > 0) {
            // Helper to parse dates in multiple potential formats
            const parseDateFlexible = (dateStr: any): Date | null => {
              if (!dateStr) return null;
              let d = new Date(dateStr);
              if (!isNaN(d.getTime())) return d;
              if (typeof dateStr === 'string' && dateStr.includes(' ')) {
                d = new Date(dateStr.replace(' ', 'T'));
                if (!isNaN(d.getTime())) return d;
              }
              if (typeof dateStr === 'string' && dateStr.includes('/')) {
                const parts = dateStr.trim().split(/[\sT]+/);
                const dateParts = parts[0].split('/');
                if (dateParts.length === 3) {
                  const day = parseInt(dateParts[0], 10);
                  const month = parseInt(dateParts[1], 10) - 1;
                  const year = parseInt(dateParts[2], 10);
                  let hours = 0, minutes = 0, seconds = 0;
                  if (parts[1]) {
                    const timeParts = parts[1].split(':');
                    hours = parseInt(timeParts[0] || '0', 10);
                    minutes = parseInt(timeParts[1] || '0', 10);
                    seconds = parseInt(timeParts[2] || '0', 10);
                  }
                  d = new Date(year, month, day, hours, minutes, seconds);
                  if (!isNaN(d.getTime())) return d;
                }
              }
              return null;
            };

            // Select row whose fecha_hora (or candidate timestamp) is closest to current time
            const now = Date.now();
            let bestRow = balData[0];
            let minDiff = Infinity;

            balData.forEach((row: any) => {
              const dateCandidates = [
                row.fecha_hora,
                row.fecha,
                row.updated_at,
                row.created_at,
                row.ultima_actualizacion
              ];
              for (const cand of dateCandidates) {
                if (!cand) continue;
                const parsed = parseDateFlexible(cand);
                if (parsed) {
                  const diff = Math.abs(now - parsed.getTime());
                  if (diff < minDiff) {
                    minDiff = diff;
                    bestRow = row;
                  }
                  break;
                }
              }
            });

            const rawFuente = bestRow.fuente || bestRow.fuente_oficial || bestRow.entidad || bestRow.organizacion || 'UNGRD · Puesto de Mando Unificado';
            const candDateStr = bestRow.fecha_hora || bestRow.fecha || bestRow.updated_at || bestRow.created_at || bestRow.ultima_actualizacion;
            const parsedDate = parseDateFlexible(candDateStr);

            let formattedDateText = '';
            if (parsedDate) {
              const datePart = parsedDate.toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const timePart = parsedDate.toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              formattedDateText = `${datePart}, ${timePart}`;
            } else {
              const rawDateStr = String(bestRow.actualizado || bestRow.ultima_actualizacion || candDateStr || '');
              formattedDateText = rawDateStr.replace(/^(reporte del|fecha y hora:|fecha:|actualizado:)\s*/i, '').trim();
            }

            this.balance = {
              muertos: parseInt(bestRow.muertos || bestRow.fallecidos_muertos || bestRow.fallecidos || '0', 10) || 0,
              heridos: parseInt(bestRow.heridos || '0', 10) || 0,
              desaparecidos: parseInt(bestRow.desaparecidos || '0', 10) || 0,
              encontrados_con_vida: parseInt(bestRow.encontrados_con_vida || bestRow.rescatados || '0', 10) || 0,
              fuente: rawFuente,
              actualizado: formattedDateText || 'Recientemente'
            };
          }
        }
      } catch (err) {
        console.warn('Error fetching balance:', err);
      }

      // If records were returned from any multi-table, update our local records state
      if (fetchedRecords.length > 0) {
        this.records = fetchedRecords;
        this.notify();
      } else {
        // Fallback check on legacy nexo_registros table if exists
        try {
          const response = await fetch(`${url}/rest/v1/nexo_registros?select=*`, { headers });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              this.records = data.map((item: any) => this.mapRowToRecord(item, item.categoria || 'donar'));
              this.notify();
              return;
            }
          }
        } catch {
          // ignore fallback error
        }
        // If no records in Supabase at all, use initial seed records as safe fallback
        this.records = INITIAL_RECORDS;
        this.notify();
      }
    } catch (e) {
      console.warn('Supabase fetch error:', e);
      if (this.records.length === 0) {
        this.records = INITIAL_RECORDS;
        this.notify();
      }
    }
  }

  private mapRowToRecord(item: any, category: CategoryType): EmergencyRecord {
    const rawEstado = (item.estado || 'aprobado').toString().toLowerCase();
    const estado = rawEstado === 'rechazado' || rawEstado === 'pendiente' ? rawEstado : 'aprobado';

    // Extract potential URL from various possible fields
    const directLink = item.link_externo || item.link || item.link_formulario_web || item.link_directo || item.fuente_link || '';
    let extractedLink = directLink;

    if (!extractedLink) {
      const candidates = [
        item.fuente,
        item.fuente_oficial,
        item.contacto_seguimiento,
        item.contacto_redes,
        item.contacto
      ];
      for (const cand of candidates) {
        if (cand && typeof cand === 'string' && (cand.toLowerCase().includes('http') || cand.toLowerCase().includes('www.') || /\.[a-z]{2,4}(\/|$)/i.test(cand))) {
          extractedLink = cand.trim();
          break;
        }
      }
    }

    return {
      id: item.id || `${category}_${Math.random().toString(36).substring(2, 9)}`,
      categoria: category,
      ciudad: item.ciudad || item.ciudad_municipio || item.ciudad_cobertura || 'Colombia',
      estado: estado,

      // Donar
      organizacion: item.organizacion || item.organizacion_entidad || item.lidera || item.quien_lidera || item.entidad || item.entidad_organismo || item.entidad_plataforma || '',
      banco: item.banco || '',
      tipo_cuenta: item.tipo_cuenta || '',
      numero_cuenta: item.numero_cuenta || '',
      tipo_transferencia: item.tipo_transferencia || 'Nacional',

      // Acopio & General
      titulo: item.titulo || item.nombre_titulo || item.titulo_necesidad || item.organizacion || item.organizacion_entidad || item.entidad || item.entidad_organismo || item.entidad_plataforma || item.tipo_registro || 'Registro',
      horario: item.horario || item.horario_de_atencion || '',
      recibe: item.recibe || item.que_reciben_que_ofrecen || '',
      direccion: item.direccion || item.direccion_lugar || '',
      maps_link: item.maps_link || item.link_google_maps || '',

      // Necesidades
      nivel_urgencia: item.nivel_urgencia || 'urgent',
      descripcion: item.descripcion || item.descripcion_detalle || item.descripcion_instrucciones || item.descripcion_que_hacen || item.descripcion_uso || item.recibe || item.que_reciben_que_ofrecen || '',
      fuente: item.fuente || item.fuente_link || item.fuente_oficial || '',

      // Iniciativas
      lidera: item.lidera || item.quien_lidera || item.organizacion || '',
      tipo_iniciativa: item.tipo_iniciativa || '',

      // Buscar personas / mascotas
      tipo_buscar: item.tipo_buscar || item.tipo_registro || (
        (item.descripcion || item.titulo || '').toString().toLowerCase().includes('mascota') ? 'Mascotas' : 'Personas'
      ),
      link_externo: extractedLink,

      // Contactos
      entidad: item.entidad || item.entidad_organismo || item.entidad_plataforma || item.organizacion || '',

      // Audit metadata
      confirmado_por: item.confirmado_por || item.extraido_por || 'Hub Verificado',
      fecha: item.fecha || item.fecha_hora || 'recientemente',
      fecha_hora: item.fecha_hora || item.fecha || 'recientemente',
      contacto: item.contacto || item.contacto_telefono || item.contacto_redes || item.telefono_contacto || item.contacto_seguimiento || '',
      imagen_fuente: item.imagen_fuente || item.imagen_fuente_captura || '',
      foto_display: item.foto_display || item.imagen_fuente || item.imagen_fuente_captura || ''
    };
  }

  public getRecords(category: CategoryType, city: string, searchQuery: string): EmergencyRecord[] {
    const q = normalizeText(searchQuery);

    return this.records.filter((item) => {
      // 1. Must belong to active category
      if (item.categoria !== category) return false;

      // 2. Must be approved
      if (item.estado !== 'aprobado') return false;

      // 3. City filter
      if (city !== 'Todas') {
        const isNational = normalizeText(item.ciudad).includes('nacional') || normalizeText(item.ciudad).includes('colombia');
        const matchesCity = normalizeText(item.ciudad).includes(normalizeText(city));
        if (!isNational && !matchesCity) {
          return false;
        }
      }

      // 4. Search query
      if (q) {
        const searchableHaystack = [
          item.organizacion,
          item.banco,
          item.titulo,
          item.ciudad,
          item.direccion,
          item.recibe,
          item.descripcion,
          item.lidera,
          item.entidad,
          item.contacto,
          item.confirmado_por
        ]
          .filter(Boolean)
          .join(' ');

        if (!normalizeText(searchableHaystack).includes(q)) {
          return false;
        }
      }

      return true;
    });
  }

  public getSiteMetrics() {
    const donar = this.records.filter(r => r.categoria === 'donar' && r.estado === 'aprobado').length;
    const acopio = this.records.filter(r => r.categoria === 'acopio' && r.estado === 'aprobado').length;
    const necesidades = this.records.filter(r => r.categoria === 'necesidades' && r.estado === 'aprobado').length;
    const hub = this.records.filter(r => r.categoria === 'hub' && r.estado === 'aprobado').length;
    const buscar = this.records.filter(r => r.categoria === 'buscar' && r.estado === 'aprobado').length;
    const contactos = this.records.filter(r => r.categoria === 'contactos' && r.estado === 'aprobado').length;

    return {
      donar,
      acopio,
      necesidades,
      hub,
      buscar,
      contactos,
      // Legacy aliases for backwards compatibility
      iniciativas: hub,
      donaciones: donar,
      total: donar + acopio + necesidades + hub + buscar + contactos
    };
  }

  public getEmergencyBalance(): EmergencyBalance {
    return this.balance;
  }

  public getHubs(): HubInfo[] {
    return this.hubs;
  }
}

export const dataService = new DataService();

