-- Check production readiness for tournament system
-- Run this before deployment to ensure everything is working

-- 1. Check if players table exists and has data
SELECT 
  'Players Table Status' as check_type,
  COUNT(*) as total_records,
  COUNT(CASE WHEN payment_status = 'verified' THEN 1 END) as verified_players,
  COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_players,
  MIN(created_at) as first_registration,
  MAX(created_at) as last_registration
FROM players;

-- 2. Check for duplicate emails
SELECT 
  'Duplicate Emails Check' as check_type,
  email,
  COUNT(*) as duplicate_count
FROM players 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 3. Check for duplicate passports
SELECT 
  'Duplicate Passports Check' as check_type,
  passport,
  COUNT(*) as duplicate_count
FROM players 
WHERE passport IS NOT NULL
GROUP BY passport 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 4. Check table structure
SELECT 
  'Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check recent registrations (last 24 hours)
SELECT 
  'Recent Registrations' as check_type,
  COUNT(*) as registrations_last_24h,
  COUNT(CASE WHEN payment_status = 'verified' THEN 1 END) as verified_last_24h
FROM players 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- 6. Sample of recent data
SELECT 
  'Sample Recent Data' as check_type,
  id,
  name,
  email,
  payment_status,
  created_at
FROM players 
ORDER BY created_at DESC 
LIMIT 5;
