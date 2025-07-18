-- Crear tabla tournament_brackets si no existe
CREATE TABLE IF NOT EXISTS tournament_brackets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bracket_name VARCHAR(255) NOT NULL,
    bracket_type VARCHAR(100) NOT NULL,
    max_players INTEGER NOT NULL DEFAULT 16,
    current_players INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla bracket_players si no existe
CREATE TABLE IF NOT EXISTS bracket_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bracket_id UUID NOT NULL REFERENCES tournament_brackets(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bracket_id, player_id)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tournament_brackets_status ON tournament_brackets(status);
CREATE INDEX IF NOT EXISTS idx_tournament_brackets_created_at ON tournament_brackets(created_at);
CREATE INDEX IF NOT EXISTS idx_bracket_players_bracket_id ON bracket_players(bracket_id);
CREATE INDEX IF NOT EXISTS idx_bracket_players_player_id ON bracket_players(player_id);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tournament_brackets_updated_at 
    BEFORE UPDATE ON tournament_brackets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('tournament_brackets', 'bracket_players')
ORDER BY table_name;

-- Mostrar estructura de tournament_brackets
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'tournament_brackets'
ORDER BY ordinal_position;

-- Mostrar estructura de bracket_players
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bracket_players'
ORDER BY ordinal_position;
