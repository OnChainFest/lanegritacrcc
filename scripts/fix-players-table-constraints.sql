-- Fix players table constraints and defaults
-- This script ensures all required fields have proper defaults

-- First, let's see the current structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- Set proper defaults for all fields
ALTER TABLE players ALTER COLUMN total_cost SET DEFAULT 0;
ALTER TABLE players ALTER COLUMN currency SET DEFAULT 'USD';
ALTER TABLE players ALTER COLUMN payment_status SET DEFAULT 'pending';
ALTER TABLE players ALTER COLUMN played_in_2024 SET DEFAULT FALSE;

-- Set defaults for category columns (if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'handicap') THEN
        ALTER TABLE players ALTER COLUMN handicap SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'senior') THEN
        ALTER TABLE players ALTER COLUMN senior SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'scratch') THEN
        ALTER TABLE players ALTER COLUMN scratch SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'reenganche') THEN
        ALTER TABLE players ALTER COLUMN reenganche SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'marathon') THEN
        ALTER TABLE players ALTER COLUMN marathon SET DEFAULT FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'desperate') THEN
        ALTER TABLE players ALTER COLUMN desperate SET DEFAULT FALSE;
    END IF;
END $$;

-- Update any existing NULL values to proper defaults
UPDATE players SET total_cost = 0 WHERE total_cost IS NULL;
UPDATE players SET currency = 'USD' WHERE currency IS NULL;
UPDATE players SET payment_status = 'pending' WHERE payment_status IS NULL;
UPDATE players SET played_in_2024 = FALSE WHERE played_in_2024 IS NULL;

-- Update category columns if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'handicap') THEN
        UPDATE players SET handicap = FALSE WHERE handicap IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'senior') THEN
        UPDATE players SET senior = FALSE WHERE senior IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'scratch') THEN
        UPDATE players SET scratch = FALSE WHERE scratch IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'reenganche') THEN
        UPDATE players SET reenganche = FALSE WHERE reenganche IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'marathon') THEN
        UPDATE players SET marathon = FALSE WHERE marathon IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'desperate') THEN
        UPDATE players SET desperate = FALSE WHERE desperate IS NULL;
    END IF;
END $$;

-- Show final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- Show count of players
SELECT COUNT(*) as total_players FROM players;
