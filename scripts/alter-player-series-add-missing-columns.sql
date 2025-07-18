-- Agregar columnas faltantes a la tabla player_series
ALTER TABLE player_series 
ADD COLUMN IF NOT EXISTS round_number INTEGER DEFAULT 1 NOT NULL;

ALTER TABLE player_series 
ADD COLUMN IF NOT EXISTS series_total INTEGER;

-- Actualizar series_total para registros existentes
UPDATE player_series 
SET series_total = game_1 + game_2 + game_3 
WHERE series_total IS NULL;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_player_series_round ON player_series(round_number);
CREATE INDEX IF NOT EXISTS idx_player_series_total ON player_series(series_total);

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'player_series' 
ORDER BY ordinal_position;
