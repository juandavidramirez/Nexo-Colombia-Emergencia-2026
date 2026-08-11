# Nexo Colombia — Centro de Información Emergencia Sísmica

Plataforma pública de lectura rápida y sin fricción de acceso para la consulta de información verificada sobre la emergencia sísmica en Colombia.

## Arquitectura y Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Persistencia & Datos:** 
  - Capa de datos cliente/servidor desacoplada con fallback a datos semilla sembrados (`src/data/seedData.ts`).
  - Esquema SQL de Supabase con Row Level Security (RLS) restringido exclusivamente a filas con `estado = 'aprobado'` (`src/data/supabase-schema.sql`).
- **Caché & Performance:** Filtrado instantáneo en cliente sobre el conjunto de datos cargado en memoria, garantizando respuesta inmediata incluso ante picos altos de tráfico.

## Sincronización Google Sheet → Supabase

1. **Curaduría:** Los voluntario/curadores editan el Google Sheet maestro.
2. **Google Apps Script:** Un trigger `onEdit` y un temporizador ejecutan un script que sincroniza los registros hacia la base de datos Supabase.
3. **Seguridad RLS:** Las lecturas públicas desde el cliente sólo pueden consultar registros donde `estado = 'aprobado'`. Los registros `pendiente` o `rechazado` permanecen ocultos.

## Ajuste de Intervalo de Revalidación (ISR)

Para desplegar en Next.js u otros entornos de producción con Server-Side Rendering (ISR), configura `revalidate` en un rango de 60–120 segundos. Debido a que el desfase entre Google Sheets y Supabase es de varios minutos, una revalidación cada 60–120 segundos en el Edge CDN es óptima para mantener la carga del servidor de origen en cero.
