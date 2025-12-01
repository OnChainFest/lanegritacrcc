-- ============================================
-- SCRIPT COMPLETO PARA SUPABASE
-- Torneo La Negrita CRCC 2025
-- ============================================

-- 1. CREAR TABLA DE TORNEOS
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('registration', 'brackets_formed', 'in_progress', 'completed')) DEFAULT 'registration',
  total_players INTEGER DEFAULT 0,
  brackets_generated BOOLEAN DEFAULT false
);

-- 2. CREAR TABLA DE JUGADORES (con todas las columnas para Stripe)
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Información básica
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  nationality TEXT NOT NULL,
  passport TEXT,
  league TEXT,
  gender TEXT CHECK (gender IN ('M', 'F', 'male', 'female')),

  -- Información de contacto de emergencia
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  -- Categorías y configuración
  categories JSONB DEFAULT '{}',
  package_size INTEGER,
  scratch BOOLEAN DEFAULT false,
  played_in_2024 BOOLEAN DEFAULT false,

  -- Información de pago
  total_cost DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  currency TEXT CHECK (currency IN ('CRC', 'USD')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'partial', 'refunded')),
  payment_method TEXT,
  payment_proof TEXT,

  -- Stripe integration
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,

  -- QR Code
  qr_code TEXT,

  -- Timestamps
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,

  -- Torneo info
  handicap_average DECIMAL(5,2),
  assigned_bracket TEXT,
  position INTEGER
);

-- 3. CREAR TABLA DE BRACKETS
CREATE TABLE IF NOT EXISTS brackets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  max_players INTEGER DEFAULT 8,
  status VARCHAR(50) DEFAULT 'pending',
  players JSONB DEFAULT '[]',
  matchups JSONB DEFAULT '[]',
  winners JSONB DEFAULT '[]',
  losers JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT false,
  round_number INTEGER NOT NULL,
  tournament_id UUID REFERENCES tournaments(id)
);

-- 4. CREAR TABLA DE RONDAS DEL TORNEO
CREATE TABLE IF NOT EXISTS tournament_rounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tournament_id UUID REFERENCES tournaments(id),
  round_number INTEGER NOT NULL,
  round_name TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  UNIQUE(tournament_id, round_number)
);

-- 5. CREAR TABLA DE SERIES DE JUGADORES (resultados de juegos)
CREATE TABLE IF NOT EXISTS player_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  game_1 INTEGER CHECK (game_1 >= 0 AND game_1 <= 300),
  game_2 INTEGER CHECK (game_2 >= 0 AND game_2 <= 300),
  game_3 INTEGER CHECK (game_3 >= 0 AND game_3 <= 300),
  total_score INTEGER,
  UNIQUE(player_id, round_number)
);

-- 6. CREAR TABLA DE STANDINGS (clasificaciones)
CREATE TABLE IF NOT EXISTS tournament_standings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id),
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  average_score DECIMAL(6,2),
  best_game INTEGER,
  position INTEGER,
  category TEXT,
  UNIQUE(player_id, tournament_id)
);

-- 7. CREAR TABLA DE INTENTOS DE LOGIN (seguridad)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT false,
  error_message TEXT
);

-- 8. CREAR TABLA DE ACTIVIDADES DE USUARIO (auditoría)
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar torneo actual
INSERT INTO tournaments (name, year, status)
VALUES ('Torneo La Negrita', 2025, 'registration')
ON CONFLICT DO NOTHING;

-- Insertar rondas del torneo
INSERT INTO tournament_rounds (tournament_id, round_number, round_name, status)
SELECT
  (SELECT id FROM tournaments WHERE year = 2025 LIMIT 1),
  round_number,
  round_name,
  'pending'
FROM (VALUES
  (1, 'Ronda 1'),
  (2, 'Ronda 2'),
  (3, 'Ronda 3'),
  (4, 'Cuartos de Final'),
  (5, 'Semifinales'),
  (6, 'Final')
) AS rounds(round_number, round_name)
ON CONFLICT DO NOTHING;

-- ============================================
-- CREAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_payment_status ON players(payment_status);
CREATE INDEX IF NOT EXISTS idx_players_nationality ON players(nationality);
CREATE INDEX IF NOT EXISTS idx_players_stripe_session ON players(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_players_stripe_payment_intent ON players(stripe_payment_intent);
CREATE INDEX IF NOT EXISTS idx_brackets_tournament ON brackets(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_series_player ON player_series(player_id);
CREATE INDEX IF NOT EXISTS idx_player_series_round ON player_series(round_number);
CREATE INDEX IF NOT EXISTS idx_standings_player ON tournament_standings(player_id);
CREATE INDEX IF NOT EXISTS idx_standings_tournament ON tournament_standings(tournament_id);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREAR POLÍTICAS DE SEGURIDAD (RLS POLICIES)
-- ============================================

-- PLAYERS: Lectura pública, escritura pública (para registro)
DROP POLICY IF EXISTS "Players are viewable by everyone" ON players;
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Players can be inserted by everyone" ON players;
CREATE POLICY "Players can be inserted by everyone"
  ON players FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Players can be updated by everyone" ON players;
CREATE POLICY "Players can be updated by everyone"
  ON players FOR UPDATE
  USING (true);

-- BRACKETS: Lectura pública, modificación pública
DROP POLICY IF EXISTS "Brackets are viewable by everyone" ON brackets;
CREATE POLICY "Brackets are viewable by everyone"
  ON brackets FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Brackets can be managed by everyone" ON brackets;
CREATE POLICY "Brackets can be managed by everyone"
  ON brackets FOR ALL
  USING (true);

-- TOURNAMENTS: Lectura pública, actualización pública
DROP POLICY IF EXISTS "Tournaments are viewable by everyone" ON tournaments;
CREATE POLICY "Tournaments are viewable by everyone"
  ON tournaments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tournaments can be updated by everyone" ON tournaments;
CREATE POLICY "Tournaments can be updated by everyone"
  ON tournaments FOR UPDATE
  USING (true);

-- TOURNAMENT ROUNDS: Lectura pública
DROP POLICY IF EXISTS "Rounds are viewable by everyone" ON tournament_rounds;
CREATE POLICY "Rounds are viewable by everyone"
  ON tournament_rounds FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Rounds can be managed by everyone" ON tournament_rounds;
CREATE POLICY "Rounds can be managed by everyone"
  ON tournament_rounds FOR ALL
  USING (true);

-- PLAYER SERIES: Lectura pública, escritura pública
DROP POLICY IF EXISTS "Series are viewable by everyone" ON player_series;
CREATE POLICY "Series are viewable by everyone"
  ON player_series FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Series can be managed by everyone" ON player_series;
CREATE POLICY "Series can be managed by everyone"
  ON player_series FOR ALL
  USING (true);

-- STANDINGS: Lectura pública, escritura pública
DROP POLICY IF EXISTS "Standings are viewable by everyone" ON tournament_standings;
CREATE POLICY "Standings are viewable by everyone"
  ON tournament_standings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Standings can be managed by everyone" ON tournament_standings;
CREATE POLICY "Standings can be managed by everyone"
  ON tournament_standings FOR ALL
  USING (true);

-- LOGIN ATTEMPTS: Solo lectura pública
DROP POLICY IF EXISTS "Login attempts are viewable by everyone" ON login_attempts;
CREATE POLICY "Login attempts are viewable by everyone"
  ON login_attempts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Login attempts can be inserted by everyone" ON login_attempts;
CREATE POLICY "Login attempts can be inserted by everyone"
  ON login_attempts FOR INSERT
  WITH CHECK (true);

-- USER ACTIVITIES: Solo lectura pública
DROP POLICY IF EXISTS "Activities are viewable by everyone" ON user_activities;
CREATE POLICY "Activities are viewable by everyone"
  ON user_activities FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Activities can be inserted by everyone" ON user_activities;
CREATE POLICY "Activities can be inserted by everyone"
  ON user_activities FOR INSERT
  WITH CHECK (true);

-- ============================================
-- CREAR VISTA PARA STANDINGS CON NOMBRES
-- ============================================

CREATE OR REPLACE VIEW player_standings_with_names AS
SELECT
  ps.player_id,
  p.name as player_name,
  ps.total_score,
  ps.games_played,
  ps.average_score,
  ps.best_game,
  ps.position,
  ps.category
FROM tournament_standings ps
JOIN players p ON ps.player_id = p.id
ORDER BY ps.total_score DESC;

-- ============================================
-- FINALIZADO
-- ============================================

-- Verificar tablas creadas
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
