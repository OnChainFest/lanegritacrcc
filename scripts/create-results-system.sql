-- Crear tablas para el sistema de resultados
CREATE TABLE IF NOT EXISTS tournament_rounds (
    id SERIAL PRIMARY KEY,
    round_number INTEGER NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_series (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    round_id INTEGER REFERENCES tournament_rounds(id) ON DELETE CASCADE,
    game_1 INTEGER CHECK (game_1 >= 0 AND game_1 <= 300),
    game_2 INTEGER CHECK (game_2 >= 0 AND game_2 <= 300),
    game_3 INTEGER CHECK (game_3 >= 0 AND game_3 <= 300),
    total_score INTEGER GENERATED ALWAYS AS (COALESCE(game_1, 0) + COALESCE(game_2, 0) + COALESCE(game_3, 0)) STORED,
    average_score DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN (CASE WHEN game_1 IS NOT NULL THEN 1 ELSE 0 END + 
                  CASE WHEN game_2 IS NOT NULL THEN 1 ELSE 0 END + 
                  CASE WHEN game_3 IS NOT NULL THEN 1 ELSE 0 END) > 0 
            THEN (COALESCE(game_1, 0) + COALESCE(game_2, 0) + COALESCE(game_3, 0))::DECIMAL / 
                 (CASE WHEN game_1 IS NOT NULL THEN 1 ELSE 0 END + 
                  CASE WHEN game_2 IS NOT NULL THEN 1 ELSE 0 END + 
                  CASE WHEN game_3 IS NOT NULL THEN 1 ELSE 0 END)
            ELSE 0 
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_standings (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    total_games INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    highest_game INTEGER DEFAULT 0,
    highest_series INTEGER DEFAULT 0,
    position INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

CREATE TABLE IF NOT EXISTS tournament_events (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'game_added', 'achievement', 'position_change'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_achievements (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'perfect_game', 'high_series', 'strike_streak'
    achievement_data JSONB,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar posiciones
CREATE OR REPLACE FUNCTION update_player_standings()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estadísticas del jugador
    INSERT INTO player_standings (player_id, total_games, total_score, average_score, highest_game, highest_series)
    SELECT 
        p.id,
        COUNT(ps.id) * 3 as total_games,
        COALESCE(SUM(ps.total_score), 0) as total_score,
        COALESCE(AVG(ps.total_score), 0) as average_score,
        COALESCE(MAX(GREATEST(ps.game_1, ps.game_2, ps.game_3)), 0) as highest_game,
        COALESCE(MAX(ps.total_score), 0) as highest_series
    FROM players p
    LEFT JOIN player_series ps ON p.id = ps.player_id
    WHERE p.id = COALESCE(NEW.player_id, OLD.player_id)
    GROUP BY p.id
    ON CONFLICT (player_id) 
    DO UPDATE SET
        total_games = EXCLUDED.total_games,
        total_score = EXCLUDED.total_score,
        average_score = EXCLUDED.average_score,
        highest_game = EXCLUDED.highest_game,
        highest_series = EXCLUDED.highest_series,
        last_updated = CURRENT_TIMESTAMP;

    -- Actualizar posiciones
    WITH ranked_players AS (
        SELECT 
            player_id,
            ROW_NUMBER() OVER (ORDER BY average_score DESC, total_score DESC) as new_position
        FROM player_standings
        WHERE total_games > 0
    )
    UPDATE player_standings 
    SET position = ranked_players.new_position
    FROM ranked_players
    WHERE player_standings.player_id = ranked_players.player_id;

    -- Detectar logros
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Juego perfecto (300)
        IF NEW.game_1 = 300 OR NEW.game_2 = 300 OR NEW.game_3 = 300 THEN
            INSERT INTO player_achievements (player_id, achievement_type, achievement_data)
            VALUES (NEW.player_id, 'perfect_game', jsonb_build_object('series_id', NEW.id, 'score', 300));
        END IF;

        -- Serie alta (mayor a 250)
        IF NEW.total_score > 250 THEN
            INSERT INTO player_achievements (player_id, achievement_type, achievement_data)
            VALUES (NEW.player_id, 'high_series', jsonb_build_object('series_id', NEW.id, 'score', NEW.total_score));
        END IF;

        -- Registrar evento
        INSERT INTO tournament_events (player_id, event_type, event_data)
        VALUES (NEW.player_id, 'game_added', jsonb_build_object('series_id', NEW.id, 'total_score', NEW.total_score));
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_update_standings ON player_series;
CREATE TRIGGER trigger_update_standings
    AFTER INSERT OR UPDATE OR DELETE ON player_series
    FOR EACH ROW EXECUTE FUNCTION update_player_standings();

-- Insertar ronda inicial
INSERT INTO tournament_rounds (round_number, round_name, is_active) 
VALUES (1, 'Ronda Clasificatoria', true)
ON CONFLICT DO NOTHING;

-- Inicializar standings para jugadores existentes
INSERT INTO player_standings (player_id, total_games, total_score, average_score, highest_game, highest_series)
SELECT 
    p.id,
    0 as total_games,
    0 as total_score,
    0 as average_score,
    0 as highest_game,
    0 as highest_series
FROM players p
ON CONFLICT (player_id) DO NOTHING;
