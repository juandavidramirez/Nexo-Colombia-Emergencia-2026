import { EmergencyRecord, EmergencyBalance, HubInfo, CategoryType } from '../types';
import { INITIAL_RECORDS, INITIAL_BALANCE, INITIAL_HUBS } from '../data/seedData';

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

  constructor() {
    // Attempt Supabase fetch if env credentials exist in the browser
    this.tryFetchSupabase();
  }

  private async tryFetchSupabase() {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (url && key) {
        const response = await fetch(`${url}/rest/v1/nexo_registros?estado=eq.aprobado`, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            this.records = data;
          }
        }
      }
    } catch {
      // Gracefully fall back to seed data
    }
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
        const isNational = normalizeText(item.ciudad).includes('nacional');
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
    // Dynamic counts from active records
    const iniciativas = this.records.filter(r => r.categoria === 'hub' && r.estado === 'aprobado').length;
    const acopio = this.records.filter(r => r.categoria === 'acopio' && r.estado === 'aprobado').length;
    const donaciones = this.records.filter(r => r.categoria === 'donar' && r.estado === 'aprobado').length;
    const contactos = this.records.filter(r => r.categoria === 'contactos' && r.estado === 'aprobado').length;

    return {
      iniciativas,
      acopio,
      donaciones,
      contactos
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
