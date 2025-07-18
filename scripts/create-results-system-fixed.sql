-- Primero verificamos el tipo de ID de la tabla players
-- Si players.id es UUID, usamos UUID en todas las referencias
-- Si players.id es INTEGER, usamos INTEGER

-- Crear tablas para el sistema de resultados
CREATE TABLE IF NOT EXISTS tournament_rounds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    round_number INTEGER NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usar UUID para player_id para que coincida con players.id
CREATE TABLE IF NOT EXISTS player_series (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    round_id UUID REFERENCES tournament_rounds(id) ON DELETE CASCADE,
    series_number INTEGER DEFAULT 1,
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
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, round_id, series_number)
);

CREATE TABLE IF NOT EXISTS player_standings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    round_id UUID REFERENCES tournament_rounds(id) ON DELETE CASCADE,
    total_series INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    total_pins INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    highest_game INTEGER DEFAULT 0,
    highest_series INTEGER DEFAULT 0,
    current_position INTEGER,
    previous_position INTEGER,
    games_played INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, round_id)
);

CREATE TABLE IF NOT EXISTS tournament_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'SERIES_ADDED', 'ACHIEVEMENT', 'POSITION_CHANGE'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    metadata JSONB,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'PERFECT_GAME', 'HIGH_SERIES', 'STRIKE_OUT'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    value INTEGER, -- Puntaje o número asociado
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    series_id UUID REFERENCES player_series(id) ON DELETE SET NULL,
    metadata JSONB
);

-- Insertar rondas por defecto
INSERT INTO tournament_rounds (round_number, round_name, is_active) VALUES
(1, 'Ronda Clasificatoria', true),
(2, 'Llaves A', false),
(3, 'Llaves B', false),
(4, 'Llaves C', false),
(5, 'Llaves D', false),
(6, 'Llaves E', false),
(7, 'Llaves F', false),
(8, 'Llaves G', false),
(9, 'Llaves H', false),
(10, 'Llaves I', false),
(11, 'Final', false)
ON CONFLICT DO NOTHING;

-- Función para actualizar posiciones automáticamente
CREATE OR REPLACE FUNCTION update_player_standings()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar o insertar en player_standings
  INSERT INTO player_standings (
    player_id, 
    round_id, 
    total_series, 
    total_games, 
    total_pins, 
    average_score, 
    highest_game, 
    highest_series,
    games_played,
    last_updated
  )
  SELECT 
    NEW.player_id,
    NEW.round_id,
    COUNT(*) as total_series,
    COUNT(*) * 3 as total_games,
    SUM(total_score) as total_pins,
    AVG(total_score) as average_score,
    MAX(GREATEST(COALESCE(game_1, 0), COALESCE(game_2, 0), COALESCE(game_3, 0))) as highest_game,
    MAX(total_score) as highest_series,
    COUNT(*) * 3 as games_played,
    NOW()
  FROM player_series 
  WHERE player_id = NEW.player_id AND round_id = NEW.round_id
  GROUP BY player_id, round_id
  ON CONFLICT (player_id, round_id) 
  DO UPDATE SET
    total_series = EXCLUDED.total_series,
    total_games = EXCLUDED.total_games,
    total_pins = EXCLUDED.total_pins,
    average_score = EXCLUDED.average_score,
    highest_game = EXCLUDED.highest_game,
    highest_series = EXCLUDED.highest_series,
    games_played = EXCLUDED.games_played,
    last_updated = NOW();

  -- Actualizar posiciones dentro de la ronda
  WITH ranked_players AS (
    SELECT 
      player_id,
      ROW_NUMBER() OVER (ORDER BY average_score DESC, total_pins DESC, highest_series DESC) as new_position
    FROM player_standings
    WHERE round_id = NEW.round_id AND total_series > 0
  )
  UPDATE player_standings 
  SET 
    previous_position = current_position,
    current_position = ranked_players.new_position,
    last_updated = NOW()
  FROM ranked_players
  WHERE player_standings.player_id = ranked_players.player_id 
    AND player_standings.round_id = NEW.round_id;

  -- Detectar logros
  -- Juego perfecto (300)
  IF NEW.game_1 = 300 OR NEW.game_2 = 300 OR NEW.game_3 = 300 THEN
    INSERT INTO player_achievements (player_id, achievement_type, title, description, value, series_id)
    VALUES (
      NEW.player_id,
      'PERFECT_GAME',
      '🎯 ¡Juego Perfecto!',
      'Logró un juego de 300 puntos',
      300,
      NEW.id
    );
    
    INSERT INTO tournament_events (player_id, event_type, title, description, metadata)
    VALUES (
      NEW.player_id,
      'ACHIEVEMENT',
      '🎯 ¡Juego Perfecto!',
      'Logró un juego de 300 puntos',
      jsonb_build_object('achievement', 'PERFECT_GAME', 'score', 300, 'series_id', NEW.id)
    );
  END IF;

  -- Serie alta (más de 250)
  IF NEW.total_score > 250 THEN
    INSERT INTO player_achievements (player_id, achievement_type, title, description, value, series_id)
    VALUES (
      NEW.player_id,
      'HIGH_SERIES',
      '🔥 Serie Alta',
      'Logró una serie de ' || NEW.total_score || ' puntos',
      NEW.total_score,
      NEW.id
    );
    
    INSERT INTO tournament_events (player_id, event_type, title, description, metadata)
    VALUES (
      NEW.player_id,
      'ACHIEVEMENT',
      '🔥 Serie Alta',
      'Logró una serie de ' || NEW.total_score || ' puntos',
      jsonb_build_object('achievement', 'HIGH_SERIES', 'score', NEW.total_score, 'series_id', NEW.id)
    );
  END IF;

  -- Evento de nueva serie
  INSERT INTO tournament_events (player_id, event_type, title, description, metadata)
  VALUES (
    NEW.player_id,
    'SERIES_ADDED',
    'Nueva Serie Registrada',
    'Serie #' || NEW.series_number || ': ' || NEW.total_score || ' puntos',
    jsonb_build_object(
      'series_number', NEW.series_number,
      'total_score', NEW.total_score,
      'games', jsonb_build_array(NEW.game_1, NEW.game_2, NEW.game_3),
      'round_id', NEW.round_id
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar posiciones
DROP TRIGGER IF EXISTS trigger_update_standings ON player_series;
CREATE TRIGGER trigger_update_standings
  AFTER INSERT OR UPDATE ON player_series
  FOR EACH ROW
  EXECUTE FUNCTION update_player_standings();

-- Función para recalcular todas las posiciones
CREATE OR REPLACE FUNCTION recalculate_positions(round_uuid UUID)
RETURNS VOID AS $$
BEGIN
  WITH ranked_players AS (
    SELECT 
      player_id,
      ROW_NUMBER() OVER (ORDER BY average_score DESC, total_pins DESC, highest_series DESC) as new_position
    FROM player_standings 
    WHERE round_id = round_uuid AND total_series > 0
  )
  UPDATE player_standings 
  SET 
    previous_position = current_position,
    current_position = ranked_players.new_position,
    last_updated = NOW()
  FROM ranked_players 
  WHERE player_standings.player_id = ranked_players.player_id 
    AND player_standings.round_id = round_uuid;
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_player_series_player_round ON player_series(player_id, round_id);
CREATE INDEX IF NOT EXISTS idx_player_standings_round ON player_standings(round_id, average_score DESC);
CREATE INDEX IF NOT EXISTS idx_tournament_events_player ON tournament_events(player_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_achievements_player ON player_achievements(player_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_tournament_events_public ON tournament_events(is_public, created_at DESC);
