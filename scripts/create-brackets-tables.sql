-- Create tournament brackets table
CREATE TABLE IF NOT EXISTS tournament_brackets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    max_players INTEGER NOT NULL DEFAULT 16 CHECK (max_players > 0),
    current_players INTEGER DEFAULT 0 CHECK (current_players >= 0),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'full', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bracket players table
CREATE TABLE IF NOT EXISTS bracket_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bracket_id UUID NOT NULL REFERENCES tournament_brackets(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position > 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bracket_id, player_id),
    UNIQUE(bracket_id, position)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournament_brackets_status ON tournament_brackets(status);
CREATE INDEX IF NOT EXISTS idx_tournament_brackets_created_at ON tournament_brackets(created_at);
CREATE INDEX IF NOT EXISTS idx_bracket_players_bracket_id ON bracket_players(bracket_id);
CREATE INDEX IF NOT EXISTS idx_bracket_players_player_id ON bracket_players(player_id);
CREATE INDEX IF NOT EXISTS idx_bracket_players_position ON bracket_players(bracket_id, position);

-- Create trigger to update updated_at timestamp
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

-- Add some sample data for testing (optional)
-- INSERT INTO tournament_brackets (name, description, max_players) VALUES
-- ('Eliminatoria A', 'Primera eliminatoria del torneo', 16),
-- ('Eliminatoria B', 'Segunda eliminatoria del torneo', 16),
-- ('Semifinal', 'Semifinal del torneo', 8),
-- ('Final', 'Final del torneo', 4);

COMMIT;
