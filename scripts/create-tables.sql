-- Create players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passport TEXT NOT NULL,
  league TEXT NOT NULL,
  played_in_2024 BOOLEAN DEFAULT false,
  gender TEXT CHECK (gender IN ('M', 'F')) NOT NULL,
  country TEXT CHECK (country IN ('national', 'international')) NOT NULL,
  categories JSONB NOT NULL DEFAULT '{}',
  total_cost DECIMAL(10,2) NOT NULL,
  currency TEXT CHECK (currency IN ('CRC', 'USD')) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  payment_proof TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  handicap_average DECIMAL(5,2),
  assigned_bracket TEXT,
  position INTEGER
);

-- Create brackets table
CREATE TABLE brackets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  players JSONB DEFAULT '[]',
  winners JSONB DEFAULT '[]',
  losers JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT false,
  round_number INTEGER NOT NULL,
  tournament_id UUID REFERENCES tournaments(id)
);

-- Create tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('registration', 'brackets_formed', 'in_progress', 'completed')) DEFAULT 'registration',
  total_players INTEGER DEFAULT 0,
  brackets_generated BOOLEAN DEFAULT false
);

-- Insert current tournament
INSERT INTO tournaments (name, year) VALUES ('Torneo La Negrita', 2025);

-- Create indexes for better performance
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_payment_status ON players(payment_status);
CREATE INDEX idx_players_country ON players(country);
CREATE INDEX idx_brackets_tournament ON brackets(tournament_id);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Players can be inserted by everyone" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players can be updated by everyone" ON players FOR UPDATE USING (true);

CREATE POLICY "Brackets are viewable by everyone" ON brackets FOR SELECT USING (true);
CREATE POLICY "Brackets can be managed by everyone" ON brackets FOR ALL USING (true);

CREATE POLICY "Tournaments are viewable by everyone" ON tournaments FOR SELECT USING (true);
