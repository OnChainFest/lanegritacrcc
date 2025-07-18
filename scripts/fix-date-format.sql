-- Fix date format issues in tournament_rounds table
-- This script will update any invalid date formats

-- First, let's see what dates we have
SELECT id, name, date, created_at 
FROM tournament_rounds 
ORDER BY created_at DESC;

-- Update any dates that might be in wrong format
-- This handles common date format issues
UPDATE tournament_rounds 
SET date = CASE 
  WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN date::date
  WHEN date ~ '^\d{2}/\d{2}/\d{4}$' THEN 
    TO_DATE(date, 'MM/DD/YYYY')::text
  WHEN date ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN 
    TO_DATE(date, 'M/D/YYYY')::text
  ELSE '2025-01-20'  -- Default fallback date
END
WHERE date IS NOT NULL;

-- Ensure all dates are in proper YYYY-MM-DD format
UPDATE tournament_rounds 
SET date = '2025-01-20'
WHERE date IS NULL OR date = '' OR NOT (date ~ '^\d{4}-\d{2}-\d{2}$');

-- Verify the fix
SELECT id, name, date, 
       CASE 
         WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN 'Valid'
         ELSE 'Invalid'
       END as date_status
FROM tournament_rounds 
ORDER BY created_at DESC;
