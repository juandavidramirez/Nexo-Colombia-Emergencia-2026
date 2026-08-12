import { EmergencyRecord } from '../types';

export function normalizeText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Returns the verifier name for approved records.
 * Priority:
 * 1. Explicit DB field (confirmado_por / verificado_por), if it's not generic 'verificado'
 * 2. Person (lidera / persona)
 * 3. Organization (organizacion / entidad / fuente)
 * 4. Fallback: 'admin'
 */
export function getVerificadoPorText(record: EmergencyRecord): string {
  const c = record.confirmado_por?.trim();
  if (c && c.toLowerCase() !== 'verificado' && c.toLowerCase() !== 'confirmado') {
    return c;
  }
  if (record.lidera?.trim()) {
    return record.lidera.trim();
  }
  if (record.organizacion?.trim()) {
    return record.organizacion.trim();
  }
  if (record.entidad?.trim()) {
    return record.entidad.trim();
  }
  if (record.fuente?.trim()) {
    return record.fuente.trim();
  }
  if (c) {
    return c;
  }
  return 'admin';
}

export function formatDisplayDate(dateStr?: string, horaStr?: string): string {
  if (!dateStr || dateStr.toLowerCase().includes('reciente')) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    return horaStr ? `${day}/${month}/${year} ${horaStr}` : `${day}/${month}/${year}`;
  }

  // Check if ISO format or valid date string
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = String(parsed.getFullYear()).slice(-2);
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();
    const hasTime = hours > 0 || minutes > 0;
    const timeStr = hasTime ? ` ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` : (horaStr ? ` ${horaStr}` : '');
    return `${day}/${month}/${year}${timeStr}`;
  }

  // Clean raw string if already formatted
  let clean = dateStr.replace(/de/gi, '').replace(/\s+/g, ' ').trim();
  if (horaStr && !clean.includes(':')) {
    clean += ` ${horaStr}`;
  }
  return clean;
}
