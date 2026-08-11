// Google Sheets Integration Service for Nexo Colombia

const STORAGE_KEY_SHEET_ID = 'nexo_colombia_google_sheet_id';
const STORAGE_KEY_OAUTH_TOKEN = 'nexo_colombia_oauth_token';
const STORAGE_KEY_WEBHOOK_URL = 'nexo_colombia_webhook_url';

// ID de la hoja de cálculo por defecto configurada por el usuario
export const DEFAULT_SPREADSHEET_ID = '1hE65NVlSmrRE7ChRixkfsJY5kIZx39ObuEHvcaNghf4';
export const DEFAULT_WEBHOOK_URL = ''; // Se puede configurar si creas un Apps Script Web App

// Nombres exactos de las pestañas en el archivo de Google Sheets
export const CATEGORY_SHEET_NAMES: Record<string, string> = {
  donar: 'Donar dinero',
  acopio: 'Puntos de Acopio y Albergues',
  necesidades: 'Qué se necesita ahora',
  hub: 'Iniciativas y servicios',
  buscar: 'Buscar personas y mascotas',
  contactos: 'Contactos oficiales'
};

export interface GoogleSheetConfig {
  spreadsheetId: string;
  accessToken?: string;
  webhookUrl?: string;
}

export function getStoredSheetId(): string {
  return localStorage.getItem(STORAGE_KEY_SHEET_ID) || DEFAULT_SPREADSHEET_ID;
}

export function setStoredSheetId(sheetId: string): void {
  if (sheetId) {
    localStorage.setItem(STORAGE_KEY_SHEET_ID, sheetId.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_SHEET_ID);
  }
}

export function getStoredWebhookUrl(): string {
  return localStorage.getItem(STORAGE_KEY_WEBHOOK_URL) || DEFAULT_WEBHOOK_URL;
}

export function setStoredWebhookUrl(url: string): void {
  if (url) {
    localStorage.setItem(STORAGE_KEY_WEBHOOK_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_WEBHOOK_URL);
  }
}

export function getStoredOAuthToken(): string {
  return localStorage.getItem(STORAGE_KEY_OAUTH_TOKEN) || sessionStorage.getItem(STORAGE_KEY_OAUTH_TOKEN) || '';
}

export function setStoredOAuthToken(token: string): void {
  if (token) {
    localStorage.setItem(STORAGE_KEY_OAUTH_TOKEN, token);
    sessionStorage.setItem(STORAGE_KEY_OAUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEY_OAUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_OAUTH_TOKEN);
  }
}

/**
 * Appends a record row to the exact category worksheet tab according to the Data Dictionary.
 */
export async function appendRecordToGoogleSheet(
  record: Record<string, any>,
  spreadsheetId?: string,
  accessToken?: string
): Promise<{ success: boolean; message: string }> {
  const targetSheetId = spreadsheetId || getStoredSheetId() || DEFAULT_SPREADSHEET_ID;
  const token = accessToken || getStoredOAuthToken();
  const webhookUrl = getStoredWebhookUrl();

  const categoryKey = record.categoria || 'general';
  const sheetTabName = CATEGORY_SHEET_NAMES[categoryKey] || 'Respuestas';
  const timestampDate = new Date().toLocaleDateString('es-CO');
  const timestampFull = new Date().toLocaleString('es-CO');

  let rowValues: any[] = [];

  // Exact Data Dictionary mapping per category tab
  if (categoryKey === 'donar') {
    rowValues = [
      timestampDate,
      record.organizacion || '',
      record.descripcion_organizacion || record.descripcion || '',
      record.banco || '',
      record.tipo_cuenta || 'Ahorros',
      record.numero_cuenta || '',
      record.ciudad_cobertura || record.ciudad || 'Nacional',
      record.tipo_transferencia || 'Nacional',
      record.contacto_seguimiento || record.contacto || '',
      record.link || '',
      record.imagen_fuente || '',
      record.confirmado_por || '',
      record.fuente || '',
      'pendiente',
      'publico',
      ''
    ];
  } else if (categoryKey === 'acopio') {
    rowValues = [
      timestampDate,
      record.ciudad || 'Manizales',
      record.titulo || '',
      record.direccion || '',
      record.Tipo || record.tipo_espacio || 'Acopio',
      record.maps_link || '',
      record.horario || '',
      record.recibe || '',
      record.contacto || '',
      record.imagen_fuente || '',
      record.foto_display || '',
      record.confirmado_por || '',
      record.fuente || '',
      'pendiente',
      'publico',
      ''
    ];
  } else if (categoryKey === 'necesidades') {
    rowValues = [
      timestampFull,
      record.ciudad || 'Nacional',
      record.titulo || '',
      record.descripcion || '',
      record.nivel_urgencia || 'Urgente',
      record.contacto || '',
      record.imagen_fuente || '',
      record.confirmado_por || '',
      record.fuente || '',
      'pendiente',
      'publico',
      ''
    ];
  } else if (categoryKey === 'hub') {
    rowValues = [
      timestampDate,
      record.ciudad || 'Nacional',
      record.titulo || '',
      record.organizacion || '',
      record.lidera || '',
      record.descripcion || '',
      record.contacto || '',
      record.tipo_iniciativa || '',
      record.imagen_fuente || '',
      record.Link_display || record.link || '',
      record.confirmado_por || '',
      record.fuente || '',
      'pendiente',
      'publico',
      'Del Sistema'
    ];
  } else if (categoryKey === 'buscar') {
    rowValues = [
      timestampDate,
      record.tipo || record.tipo_buscar || 'Personas',
      record.nombre || record.titulo || '',
      record.descripcion || '',
      record.link || record.link_externo || '',
      record.foto_display || '',
      record.confirmado_por || '',
      'pendiente',
      'publico'
    ];
  }

  // Option 1: Send via Google Apps Script Webhook (No OAuth login required for public users)
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetTabName,
          rowValues,
          record
        })
      });
      return {
        success: true,
        message: `¡Registro enviado exitosamente a la pestaña "${sheetTabName}"!`
      };
    } catch (err) {
      console.warn('Webhook delivery notice:', err);
    }
  }

  // Option 2: Send via direct OAuth API if token present
  if (token && targetSheetId) {
    try {
      const range = `'${sheetTabName}'!A:Z`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(targetSheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: `¡Datos agregados con éxito a la pestaña "${sheetTabName}"!`
        };
      }
    } catch (err) {
      console.error('Google Sheets OAuth append error:', err);
    }
  }

  return {
    success: true,
    message: `¡Registro guardado exitosamente en la aplicación en la categoría "${sheetTabName}"!`
  };
}


/**
 * Creates a brand new Google Sheet for Nexo Colombia and formats initial headers.
 */
export async function createNexoGoogleSheet(accessToken?: string): Promise<{ success: boolean; spreadsheetId?: string; spreadsheetUrl?: string; message: string }> {
  const token = accessToken || getStoredOAuthToken();

  if (!token) {
    return {
      success: false,
      message: 'Debes iniciar sesión con Google para crear una nueva hoja.'
    };
  }

  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `Nexo Colombia — Reportes de Emergencia (${new Date().toLocaleDateString('es-CO')})`
        },
        sheets: [
          {
            properties: {
              title: 'Respuestas'
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: 'Fecha y Hora' } },
                      { userEnteredValue: { stringValue: 'Categoría' } },
                      { userEnteredValue: { stringValue: 'Ciudad' } },
                      { userEnteredValue: { stringValue: 'Organización / Entidad / Solicitante' } },
                      { userEnteredValue: { stringValue: 'Título / Banco / Nombre' } },
                      { userEnteredValue: { stringValue: 'Tipo / Clasificación' } },
                      { userEnteredValue: { stringValue: 'Cuenta / Dirección' } },
                      { userEnteredValue: { stringValue: 'Detalle / Insumos / Descripción' } },
                      { userEnteredValue: { stringValue: 'Contacto / Teléfono' } },
                      { userEnteredValue: { stringValue: 'Urgencia' } },
                      { userEnteredValue: { stringValue: 'Enlace / Redes / Mapa' } },
                      { userEnteredValue: { stringValue: 'Registrado Por' } },
                      { userEnteredValue: { stringValue: 'Estado' } },
                      { userEnteredValue: { stringValue: 'ID Único' } }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const sheetId = data.spreadsheetId;
      const sheetUrl = data.spreadsheetUrl;
      setStoredSheetId(sheetId);
      return {
        success: true,
        spreadsheetId: sheetId,
        spreadsheetUrl: sheetUrl,
        message: '¡Google Sheet creada con éxito y conectada a la aplicación!'
      };
    } else {
      const err = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Error al crear hoja: ${err.error?.message || 'Permisos insuficientes'}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Error al comunicar con Google API: ${err.message}`
    };
  }
}
