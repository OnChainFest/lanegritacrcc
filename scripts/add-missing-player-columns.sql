-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- Add missing boolean columns for categories if they don't exist
DO $$ 
BEGIN
    -- Add handicap column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'handicap') THEN
        ALTER TABLE players ADD COLUMN handicap BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added handicap column';
    END IF;

    -- Add senior column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'senior') THEN
        ALTER TABLE players ADD COLUMN senior BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added senior column';
    END IF;

    -- Add scratch column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'scratch') THEN
        ALTER TABLE players ADD COLUMN scratch BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added scratch column';
    END IF;

    -- Add reenganche column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'reenganche') THEN
        ALTER TABLE players ADD COLUMN reenganche BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added reenganche column';
    END IF;

    -- Add marathon column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'marathon') THEN
        ALTER TABLE players ADD COLUMN marathon BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added marathon column';
    END IF;

    -- Add desperate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'desperate') THEN
        ALTER TABLE players ADD COLUMN desperate BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added desperate column';
    END IF;

    -- Ensure total_cost has a default value
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'total_cost') THEN
        ALTER TABLE players ALTER COLUMN total_cost SET DEFAULT 0;
        RAISE NOTICE 'Set default for total_cost';
    END IF;

    -- Ensure other fields have proper defaults
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'played_in_2024') THEN
        ALTER TABLE players ALTER COLUMN played_in_2024 SET DEFAULT FALSE;
        RAISE NOTICE 'Set default for played_in_2024';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'currency') THEN
        ALTER TABLE players ALTER COLUMN currency SET DEFAULT 'USD';
        RAISE NOTICE 'Set default for currency';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'payment_status') THEN
        ALTER TABLE players ALTER COLUMN payment_status SET DEFAULT 'pending';
        RAISE NOTICE 'Set default for payment_status';
    END IF;

END $$;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;
