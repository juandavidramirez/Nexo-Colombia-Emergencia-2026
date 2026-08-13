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

function getRecordDateInfo(item: EmergencyRecord) {
  const rawStr = (item.fecha_hora || item.fecha || '').trim();
  
  if (rawStr.toLowerCase().includes('hace') || rawStr.toLowerCase().includes('reciente') || rawStr.toLowerCase().includes('hoy') || !rawStr) {
    const now = new Date();
    const dayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return {
      timestamp: now.getTime(),
      dayString,
      hasTime: true
    };
  }

  const parsed = new Date(rawStr);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const dayString = `${year}-${month}-${day}`;
    
    const hasTimeInString = /T\d{2}:\d{2}|\d{2}:\d{2}/.test(rawStr);
    const hasTime = hasTimeInString || (parsed.getHours() !== 0 || parsed.getMinutes() !== 0 || parsed.getSeconds() !== 0);
    return {
      timestamp: parsed.getTime(),
      dayString,
      hasTime
    };
  }

  const hasTime = /\d{1,2}:\d{2}/.test(rawStr);
  const match = rawStr.match(/(\d{1,2})[\/\s]+([a-zA-Záéíóúñ]+|\d{1,2})[\/\s]+(\d{2,4})/);
  let dayString = '2026-01-01';
  if (match) {
    const d = match[1].padStart(2, '0');
    const mStr = match[2].toLowerCase();
    const months: Record<string, string> = {
      ene: '01', feb: '02', mar: '03', abr: '04', may: '05', jun: '06',
      jul: '07', ago: '08', sep: '09', oct: '10', nov: '11', dic: '12',
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const m = months[mStr] || (isNaN(Number(mStr)) ? '01' : mStr.padStart(2, '0'));
    let y = match[3];
    if (y.length === 2) y = `20${y}`;
    dayString = `${y}-${m}-${d}`;
  }

  return {
    timestamp: Date.parse(rawStr) || 0,
    dayString,
    hasTime
  };
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
        nexo_personas: 'buscar',
        nexo_mascotas: 'buscar',
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
    const estado = rawEstado === 'rechazado' ? 'rechazado' : rawEstado === 'pendiente' ? 'pendiente' : 'aprobado';

    // Extract potential URL from various possible fields
    const directLink = item.link_display || item.link_externo || item.link || item.url || item.link_formulario_web || item.link_directo || item.fuente_link || item.link_web || item.link_instagram || item.canal_oficial || '';
    let extractedLink = directLink;

    if (!extractedLink) {
      const candidates = [
        item.link_display,
        item.link_externo,
        item.link,
        item.url,
        item.fuente_link,
        item.contacto_redes,
        item.contacto_seguimiento,
        item.contacto,
        item.fuente,
        item.fuente_oficial
      ];
      for (const cand of candidates) {
        if (cand && typeof cand === 'string') {
          const trimmed = cand.trim();
          if (
            trimmed.toLowerCase().includes('http') ||
            trimmed.toLowerCase().includes('www.') ||
            /\b[a-zA-Z0-9-]+\.(com|co|org|net|gov|edu|io|app|me|site|lat|tv)\b/i.test(trimmed)
          ) {
            extractedLink = trimmed;
            break;
          } else if (trimmed.startsWith('@')) {
            extractedLink = `https://instagram.com/${trimmed.substring(1)}`;
            break;
          }
        }
      }
    }

    const finalLink = item.link_display || extractedLink || item.link_externo || item.link || '';

    return {
      id: item.id || `${category}_${Math.random().toString(36).substring(2, 9)}`,
      categoria: category,
      ciudad: item.ciudad || item.ciudad_municipio || item.ciudad_cobertura || 'Colombia',
      estado: estado,

      // Donar
      organizacion: item.organizacion || item.nombre || item.organizacion_entidad || item.lidera || item.quien_lidera || item.entidad || item.entidad_organismo || item.entidad_plataforma || '',
      banco: item.banco || '',
      tipo_cuenta: item.tipo_cuenta || '',
      numero_cuenta: item.numero_cuenta || '',
      tipo_transferencia: item.tipo_transferencia || 'Nacional',

      // Acopio & General
      titulo: item.titulo || item.nombre || item.nombre_titulo || item.titulo_necesidad || item.organizacion || item.organizacion_entidad || item.entidad || item.entidad_organismo || item.entidad_plataforma || item.tipo_registro || 'Registro',
      horario: item.horario || item.horario_de_atencion || '',
      recibe: item.recibe || item.que_reciben_que_ofrecen || '',
      direccion: item.direccion || item.direccion_lugar || '',
      maps_link: item.maps_link || item.link_google_maps || '',
      tipo_espacio: item.tipo_espacio || item.Tipo || item.tipo || 'Acopio',
      Tipo: item.Tipo || item.tipo_espacio || item.tipo || 'Acopio',
      tipo: item.tipo || item.tipo_espacio || item.Tipo || 'Acopio',

      // Necesidades
      nivel_urgencia: item.nivel_urgencia || 'urgent',
      descripcion: item.descripcion || item.descripcion_detalle || item.descripcion_instrucciones || item.descripcion_que_hacen || item.descripcion_uso || item.recibe || item.que_reciben_que_ofrecen || '',
      fuente: item.fuente || item.fuente_link || item.fuente_oficial || '',

      // Iniciativas
      lidera: item.lidera || item.quien_lidera || item.organizacion || '',
      tipo_iniciativa: item.tipo_iniciativa || '',
      link_display: item.link_display || finalLink,
      link_externo: item.link_externo || finalLink,
      link: item.link || finalLink,

      // Buscar personas / mascotas
      tipo_buscar: item.tipo_buscar || item.tipo_registro || item.tipo || (
        (item.descripcion || item.titulo || item.nombre || '').toString().toLowerCase().includes('mascota') ||
        (item.descripcion || item.titulo || item.nombre || '').toString().toLowerCase().includes('perro') ||
        (item.descripcion || item.titulo || item.nombre || '').toString().toLowerCase().includes('gato') ||
        (item.descripcion || item.titulo || item.nombre || '').toString().toLowerCase().includes('animal') ? 'Mascotas' : 'Personas'
      ),

      // Contactos
      entidad: item.entidad || item.entidad_organismo || item.entidad_plataforma || item.organizacion || '',

      // Audit metadata
      confirmado_por: item.confirmado_por || item.verificado_por || item.extraido_por || item.curador || item.curado_por || item.revisado_por || '',
      fecha: item.fecha || item.fecha_hora || 'recientemente',
      fecha_hora: item.fecha_hora || item.fecha || 'recientemente',
      contacto: item.contacto || item.contacto_telefono || item.contacto_redes || item.telefono_contacto || item.contacto_seguimiento || '',
      imagen_fuente: item.imagen_fuente || item.imagen_fuente_captura || '',
      foto_display: item.foto_display || item.imagen_fuente || item.imagen_fuente_captura || ''
    };
  }

  public getRecords(
    category: CategoryType,
    city: string,
    searchQuery: string,
    categorySubFilter: string = 'Todas',
    verifiedFilter: string = 'Todos'
  ): EmergencyRecord[] {
    const q = normalizeText(searchQuery);

    const filtered = this.records.filter((item) => {
      // 1. Must belong strictly to active category
      if (item.categoria !== category) return false;

      // 2. Exclude rejected records only
      if (item.estado === 'rechazado') return false;

      // 3. Strict City Filter (Enforces exact city match when a city is selected)
      if (city && city !== 'Todas') {
        const targetCity = normalizeText(city);
        const itemCity = normalizeText(item.ciudad || '');

        // Item must explicitly contain the selected city name
        if (!itemCity.includes(targetCity)) {
          return false;
        }
      }

      // Verification status filter
      if (verifiedFilter && verifiedFilter !== 'Todos') {
        const isVer = item.estado === 'aprobado';
        if (verifiedFilter === 'Sí') {
          if (!isVer) return false;
        } else if (verifiedFilter === 'No') {
          if (isVer) return false;
        }
      }

      // 4. Category-specific Sub-Filter condition (Strict AND requirement)
      if (categorySubFilter && categorySubFilter !== 'Todas' && categorySubFilter !== 'Todos') {
        if (category === 'donar') {
          const trans = (item.tipo_transferencia || '').toLowerCase();
          const text = normalizeText(`${item.banco} ${item.tipo_cuenta} ${item.descripcion} ${item.organizacion}`);
          if (categorySubFilter === 'Nacional') {
            const isNac = trans.includes('nacional') || trans.includes('ambas') || text.includes('nequi') || text.includes('daviplata') || text.includes('bancolombia') || text.includes('ahorros') || text.includes('corriente');
            if (!isNac) return false;
          } else if (categorySubFilter === 'Internacional') {
            const isInt = trans.includes('internacional') || trans.includes('ambas') || text.includes('zelle') || text.includes('paypal') || text.includes('swift') || text.includes('iban') || text.includes('usd') || text.includes('eur');
            if (!isInt) return false;
          } else if (categorySubFilter === 'Ambas') {
            if (!trans.includes('ambas')) return false;
          }
        } else if (category === 'acopio') {
          const rawTipo = normalizeText(`${item.tipo_espacio || item.Tipo || item.tipo || ''}`);
          const text = normalizeText(`${item.titulo} ${item.recibe} ${item.descripcion} ${item.organizacion}`);
          const isAlbergue = rawTipo.includes('albergue') || rawTipo.includes('refugio') || rawTipo === 'albergue' || text.includes('albergue') || text.includes('refugio') || text.includes('hospedaje') || text.includes('alojamiento') || text.includes('paso') || text.includes('dormir') || text.includes('refugiat') || text.includes('albergado');
          if (categorySubFilter === 'Albergues y refugios' && !isAlbergue) return false;
          if (categorySubFilter === 'Puntos de acopio' && isAlbergue) return false;
        } else if (category === 'necesidades') {
          const urg = (item.nivel_urgencia || '').toLowerCase();
          if (categorySubFilter === 'Alta / Inmediata') {
            if (!urg.includes('urgent') && !urg.includes('alta') && !urg.includes('urgente') && !urg.includes('high')) return false;
          } else if (categorySubFilter === 'Media') {
            if (!urg.includes('medium') && !urg.includes('media')) return false;
          } else if (categorySubFilter === 'Baja') {
            if (!urg.includes('low') && !urg.includes('baja')) return false;
          }
        } else if (category === 'hub') {
          const text = normalizeText(`${item.tipo_iniciativa} ${item.titulo} ${item.descripcion} ${item.organizacion}`);
          if (categorySubFilter === 'Voluntariado') {
            if (!text.includes('voluntar')) return false;
          } else if (categorySubFilter === 'Salud y Brigadas') {
            const isSalud = text.includes('salud') || text.includes('medic') || text.includes('brigada') || text.includes('psico') || text.includes('sanitar') || text.includes('primeros auxilios');
            if (!isSalud) return false;
          } else if (categorySubFilter === 'Logística y Transporte') {
            const isLogistics = text.includes('logis') || text.includes('transp') || text.includes('acopio') || text.includes('cadena') || text.includes('entrega') || text.includes('censo') || text.includes('corredor');
            if (!isLogistics) return false;
          } else if (categorySubFilter === 'Atención e Insumos') {
            const isSpecificOther = text.includes('voluntar') || text.includes('salud') || text.includes('medic') || text.includes('psico');
            if (isSpecificOther) return false;
          }
        } else if (category === 'buscar') {
          if (categorySubFilter === 'Personas') {
            const isPersona = item.tipo_buscar === 'Personas' || normalizeText(`${item.titulo} ${item.descripcion}`).includes('persona') || normalizeText(`${item.titulo} ${item.descripcion}`).includes('busca');
            if (!isPersona) return false;
          } else if (categorySubFilter === 'Mascotas') {
            const isMascota = item.tipo_buscar === 'Mascotas' || normalizeText(`${item.titulo} ${item.descripcion}`).includes('mascota') || normalizeText(`${item.titulo} ${item.descripcion}`).includes('perro') || normalizeText(`${item.titulo} ${item.descripcion}`).includes('gato') || normalizeText(`${item.titulo} ${item.descripcion}`).includes('animal');
            if (!isMascota) return false;
          }
        } else if (category === 'contactos') {
          const text = normalizeText(`${item.entidad} ${item.titulo} ${item.descripcion}`);
          if (categorySubFilter === 'Organismos de Socorro') {
            const isSocorro = text.includes('cruz roja') || text.includes('defensa civil') || text.includes('bomberos') || text.includes('ungrd') || text.includes('socorro') || text.includes('rescate') || text.includes('diger') || text.includes('dagrd') || text.includes('pmu');
            if (!isSocorro) return false;
          } else if (categorySubFilter === 'Alcaldía y Gobernación') {
            const isGob = text.includes('alcaldia') || text.includes('gobernacion') || text.includes('secretaria') || text.includes('policia') || text.includes('ejercito') || text.includes('alcalde') || text.includes('gobierno') || text.includes('interior');
            if (!isGob) return false;
          } else if (categorySubFilter === 'Salud y Emergencias') {
            const isSaludEmerg = text.includes('salud') || text.includes('hospital') || text.includes('linea') || text.includes('emergencia') || text.includes('psicol') || text.includes('geologico') || text.includes('sgc') || text.includes('123');
            if (!isSaludEmerg) return false;
          }
        }
      }

      // 5. Search query (Text keyword matching)
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
          item.confirmado_por,
          item.tipo_iniciativa,
          item.tipo_buscar
        ]
          .filter(Boolean)
          .join(' ');

        if (!normalizeText(searchableHaystack).includes(q)) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const infoA = getRecordDateInfo(a);
      const infoB = getRecordDateInfo(b);

      const dayTimeA = infoA.dayString ? new Date(infoA.dayString).getTime() : 0;
      const dayTimeB = infoB.dayString ? new Date(infoB.dayString).getTime() : 0;

      if (dayTimeA !== dayTimeB) {
        return dayTimeB - dayTimeA; // most recent day first
      }

      // Same day: records with time come before records without time
      if (infoA.hasTime && !infoB.hasTime) return -1;
      if (!infoA.hasTime && infoB.hasTime) return 1;

      // Both have time or both do not have time on the same day: sort by timestamp descending
      if (infoA.timestamp !== infoB.timestamp) {
        return infoB.timestamp - infoA.timestamp;
      }

      return 0;
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

  public addRecord(item: Partial<EmergencyRecord> & { categoria: CategoryType }): EmergencyRecord {
    const category = item.categoria;
    const mapped = this.mapRowToRecord({
      ...item,
      estado: item.estado || 'aprobado',
      fecha: item.fecha || 'Hace un momento',
      fecha_hora: item.fecha_hora || new Date().toISOString()
    }, category);

    // Prepend to top of list
    this.records.unshift(mapped);
    this.notify();

    // Async attempt to persist to Supabase if table exists
    this.tryPersistSupabase(mapped, category);

    return mapped;
  }

  private async tryPersistSupabase(record: EmergencyRecord, category: CategoryType) {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
      if (!url || !key) return;

      const categoryToTable: Record<CategoryType, string> = {
        donar: 'nexo_donaciones',
        acopio: 'nexo_acopio_albergues',
        necesidades: 'nexo_necesidades',
        hub: 'nexo_iniciativas',
        buscar: 'nexo_buscar',
        contactos: 'nexo_contactos'
      };

      const table = categoryToTable[category];
      if (!table) return;

      await fetch(`${url}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(record)
      });
    } catch (err) {
      console.warn('Supabase auto-persist attempt:', err);
    }
  }
}

export const dataService = new DataService();

