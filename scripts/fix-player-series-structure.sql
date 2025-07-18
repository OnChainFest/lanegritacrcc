-- Verificar y corregir la estructura de player_series
DO $$
BEGIN
    -- Verificar si la columna round_number existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_series' 
        AND column_name = 'round_number'
    ) THEN
        -- Agregar la columna round_number si no existe
        ALTER TABLE player_series ADD COLUMN round_number INTEGER;
        RAISE NOTICE 'Columna round_number agregada a player_series';
    END IF;

    -- Verificar si la columna total existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_series' 
        AND column_name = 'total'
    ) THEN
        -- Agregar la columna total si no existe
        ALTER TABLE player_series ADD COLUMN total INTEGER;
        RAISE NOTICE 'Columna total agregada a player_series';
    END IF;

    -- Verificar si la columna created_at existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'player_series' 
        AND column_name = 'created_at'
    ) THEN
        -- Agregar la columna created_at si no existe
        ALTER TABLE player_series ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Columna created_at agregada a player_series';
    END IF;
END $$;

-- Actualizar valores NULL en round_number si existen
UPDATE player_series 
SET round_number = 1 
WHERE round_number IS NULL;

-- Actualizar valores NULL en total si existen
UPDATE player_series 
SET total = COALESCE(game1, 0) + COALESCE(game2, 0) + COALESCE(game3, 0)
WHERE total IS NULL;

-- Hacer round_number NOT NULL después de actualizar valores
ALTER TABLE player_series ALTER COLUMN round_number SET NOT NULL;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_player_series_round ON player_series(round_number);
CREATE INDEX IF NOT EXISTS idx_player_series_player_round ON player_series(player_id, round_number);

-- Mostrar la estructura actual de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'player_series'
ORDER BY ordinal_position;
