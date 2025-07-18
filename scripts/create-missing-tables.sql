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

-- Crear tabla tournament_rounds si no existe (usando la estructura correcta)
CREATE TABLE IF NOT EXISTS tournament_rounds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    round_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    round_number INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tournament_brackets_status ON tournament_brackets(status);
CREATE INDEX IF NOT EXISTS idx_tournament_rounds_active ON tournament_rounds(is_active);
CREATE INDEX IF NOT EXISTS idx_tournament_rounds_date ON tournament_rounds(start_date);

-- Insertar datos de ejemplo para testing
INSERT INTO tournament_rounds (round_name, start_date, round_number, is_active) 
VALUES 
    ('Ronda 1', '2025-02-01', 1, true),
    ('Ronda 2', '2025-02-08', 2, false),
    ('Semifinal', '2025-02-15', 3, false)
ON CONFLICT DO NOTHING;

INSERT INTO tournament_brackets (bracket_name, bracket_type, max_players, current_players, status)
VALUES 
    ('Eliminatorias Grupo A', 'single-elimination', 16, 8, 'active'),
    ('Eliminatorias Grupo B', 'single-elimination', 16, 12, 'active'),
    ('Final', 'single-elimination', 8, 0, 'pending')
ON CONFLICT DO NOTHING;
