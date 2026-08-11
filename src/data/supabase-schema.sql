-- Nexo Colombia - Schema SQL para Supabase (Postgres)
-- Tabla principal de registros verificados y políticas RLS para lectura pública

CREATE TABLE IF NOT EXISTS nexo_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL CHECK (categoria IN ('donar', 'acopio', 'necesidades', 'hub', 'buscar', 'contactos')),
  ciudad TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('aprobado', 'pendiente', 'rechazado')),
  
  -- Campos por categoría
  organizacion TEXT,
  banco TEXT,
  tipo_cuenta TEXT,
  numero_cuenta TEXT,
  tipo_transferencia TEXT,
  
  titulo TEXT,
  horario TEXT,
  recibe TEXT,
  direccion TEXT,
  maps_link TEXT,
  
  nivel_urgencia TEXT,
  descripcion TEXT,
  fuente TEXT,
  
  lidera TEXT,
  tipo_iniciativa TEXT,
  
  tipo_buscar TEXT,
  link_externo TEXT,
  
  entidad TEXT,
  
  -- Auditoría y confirmación
  confirmado_por TEXT,
  fecha TEXT,
  fecha_hora TEXT,
  contacto TEXT,
  imagen_fuente TEXT,
  foto_display TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de balance de emergencia (fuente UNGRD)
CREATE TABLE IF NOT EXISTS nexo_balance (
  id INT PRIMARY KEY DEFAULT 1,
  muertos INT NOT NULL DEFAULT 0,
  heridos INT NOT NULL DEFAULT 0,
  desaparecidos INT NOT NULL DEFAULT 0,
  encontrados_con_vida INT NOT NULL DEFAULT 0,
  fuente TEXT NOT NULL,
  actualizado TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de hubs de Global Shapers
CREATE TABLE IF NOT EXISTS nexo_hubs (
  id TEXT PRIMARY KEY,
  codigo TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  persona TEXT NOT NULL,
  rol_actividad TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pendiente'))
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE nexo_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexo_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexo_hubs ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública: SOLO registros aprobados son legibles por anon/público
CREATE POLICY "Permitir lectura pública solo de estado aprobado"
ON nexo_registros FOR SELECT
USING (estado = 'aprobado');

CREATE POLICY "Permitir lectura pública del balance de la emergencia"
ON nexo_balance FOR SELECT
USING (true);

CREATE POLICY "Permitir lectura pública de los hubs"
ON nexo_hubs FOR SELECT
USING (true);

-- Comentarios explicativos
COMMENT ON TABLE nexo_registros IS 'Registros verificados de ayuda, acopio y contactos para Nexo Colombia';
COMMENT ON POLICY "Permitir lectura pública solo de estado aprobado" ON nexo_registros IS 'Protege datos pendientes o rechazados para que no se expongan públicamente';
