-- Verify and create players table with correct structure
-- This script ensures the players table exists with all required columns

-- Create the players table if it doesn't exist
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
    
    -- Category columns
    handicap BOOLEAN DEFAULT FALSE,
    senior BOOLEAN DEFAULT FALSE,
    scratch BOOLEAN DEFAULT FALSE,
    
    -- Extra columns
    reenganche BOOLEAN DEFAULT FALSE,
    marathon BOOLEAN DEFAULT FALSE,
    desperate BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_country ON players(country);
CREATE INDEX IF NOT EXISTS idx_players_payment_status ON players(payment_status);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Show final table structure
\d players;

-- Show sample data if any exists
SELECT COUNT(*) as total_players FROM players;
SELECT * FROM players LIMIT 3;
