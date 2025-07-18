-- Primero, agregar las columnas faltantes si no existen
DO $$ 
BEGIN
    -- Agregar game1_score si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_series' AND column_name = 'game1_score') THEN
        ALTER TABLE player_series ADD COLUMN game1_score INTEGER;
    END IF;
    
    -- Agregar game2_score si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_series' AND column_name = 'game2_score') THEN
        ALTER TABLE player_series ADD COLUMN game2_score INTEGER;
    END IF;
    
    -- Agregar game3_score si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_series' AND column_name = 'game3_score') THEN
        ALTER TABLE player_series ADD COLUMN game3_score INTEGER;
    END IF;
    
    -- Agregar series_total si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_series' AND column_name = 'series_total') THEN
        ALTER TABLE player_series ADD COLUMN series_total INTEGER;
    END IF;
    
    -- Agregar round_number si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'player_series' AND column_name = 'round_number') THEN
        ALTER TABLE player_series ADD COLUMN round_number INTEGER DEFAULT 1;
    END IF;
END $$;

-- Mostrar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'player_series'
ORDER BY ordinal_position;

-- Vista 1: Series con nombres de jugadores
CREATE OR REPLACE VIEW player_series_with_names AS
SELECT 
    ps.id,
    ps.player_id,
    p.name as player_name,
    p.email as player_email,
    ps.game1_score,
    ps.game2_score,
    ps.game3_score,
    ps.series_total,
    ps.round_number,
    ps.created_at
FROM player_series ps
INNER JOIN players p ON ps.player_id = p.id
ORDER BY ps.created_at DESC;

-- Vista 2: Clasificación de jugadores con estadísticas
CREATE OR REPLACE VIEW player_standings_view AS
SELECT 
    p.id as player_id,
    p.name as player_name,
    p.email as player_email,
    COUNT(ps.id) as series_count,
    COUNT(ps.id) * 3 as games_played,
    COALESCE(SUM(ps.series_total), 0) as total_score,
    CASE 
        WHEN COUNT(ps.id) > 0 THEN 
            ROUND(COALESCE(SUM(ps.series_total), 0)::numeric / (COUNT(ps.id) * 3), 1)
        ELSE 0 
    END as average_score,
    COALESCE(MAX(GREATEST(ps.game1_score, ps.game2_score, ps.game3_score)), 0) as best_game,
    COALESCE(MAX(ps.series_total), 0) as best_series,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(ps.series_total), 0) DESC) as position
FROM players p
LEFT JOIN player_series ps ON p.id = ps.player_id
WHERE p.payment_status = 'verified'
GROUP BY p.id, p.name, p.email
ORDER BY total_score DESC;

-- Vista 3: Series por ronda
CREATE OR REPLACE VIEW series_by_round_view AS
SELECT 
    ps.round_number,
    COUNT(*) as series_count,
    AVG(ps.series_total) as average_score,
    MAX(ps.series_total) as highest_score,
    MIN(ps.series_total) as lowest_score,
    p.name as top_player
FROM player_series ps
INNER JOIN players p ON ps.player_id = p.id
GROUP BY ps.round_number, p.name
ORDER BY ps.round_number, ps.series_total DESC;

-- Vista 4: Solo jugadores verificados
CREATE OR REPLACE VIEW verified_players_view AS
SELECT 
    id,
    name,
    email,
    nationality,
    league,
    country,
    payment_status,
    created_at
FROM players 
WHERE payment_status = 'verified'
ORDER BY name;

-- Mostrar las vistas creadas
SELECT schemaname, viewname 
FROM pg_views 
WHERE viewname LIKE '%player%' OR viewname LIKE '%series%' OR viewname LIKE '%verified%'
ORDER BY viewname;
