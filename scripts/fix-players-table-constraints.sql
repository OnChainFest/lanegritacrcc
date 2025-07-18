-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- If total_cost is NOT NULL but should allow NULL, modify it
-- (Only run this if you want to allow NULL values for total_cost)
-- ALTER TABLE players ALTER COLUMN total_cost DROP NOT NULL;

-- Or set a default value for total_cost
ALTER TABLE players ALTER COLUMN total_cost SET DEFAULT 0;

-- Ensure all boolean fields have proper defaults
ALTER TABLE players ALTER COLUMN played_in_2024 SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN handicap SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN senior SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN scratch SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN reenganche SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN marathon SET DEFAULT FALSE;
ALTER TABLE players ALTER COLUMN desperate SET DEFAULT FALSE;

-- Set default for currency and payment_status
ALTER TABLE players ALTER COLUMN currency SET DEFAULT 'USD';
ALTER TABLE players ALTER COLUMN payment_status SET DEFAULT 'pending';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;
