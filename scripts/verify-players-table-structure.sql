-- Verificar la estructura actual de la tabla players
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- Si la tabla no existe o tiene problemas, crearla con la estructura correcta
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    passport VARCHAR(100) NOT NULL,
    league VARCHAR(255) NOT NULL,
    played_in_2024 BOOLEAN DEFAULT FALSE,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    country VARCHAR(20) NOT NULL CHECK (country IN ('national', 'international')),
    total_cost DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'pending',
    handicap BOOLEAN DEFAULT FALSE,
    senior BOOLEAN DEFAULT FALSE,
    scratch BOOLEAN DEFAULT FALSE,
    reenganche BOOLEAN DEFAULT FALSE,
    marathon BOOLEAN DEFAULT FALSE,
    desperate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_country ON players(country);
CREATE INDEX IF NOT EXISTS idx_players_payment_status ON players(payment_status);

-- Verificar que la tabla se creó correctamente
SELECT COUNT(*) as total_players FROM players;
