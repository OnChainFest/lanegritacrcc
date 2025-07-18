-- Agregar columnas faltantes a la tabla player_series
ALTER TABLE player_series 
ADD COLUMN IF NOT EXISTS round_number INTEGER NOT NULL DEFAULT 1;

ALTER TABLE player_series 
ADD COLUMN IF NOT EXISTS series_total INTEGER;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_player_series_round ON player_series(round_number);
CREATE INDEX IF NOT EXISTS idx_player_series_player_round ON player_series(player_id, round_number);

-- Actualizar series_total para registros existentes (si los hay)
UPDATE player_series 
SET series_total = game_1 + game_2 + game_3 
WHERE series_total IS NULL;

-- Comentario de confirmación
SELECT 'Columnas agregadas exitosamente a player_series' as status;
