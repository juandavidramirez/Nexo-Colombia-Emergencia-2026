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
