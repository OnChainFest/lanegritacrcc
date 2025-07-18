-- Script para eliminar tablas relacionadas con QR
-- Ejecutar en Supabase SQL Editor

-- Eliminar tablas QR si existen
DROP TABLE IF EXISTS validation_qrs CASCADE;
DROP TABLE IF EXISTS player_wallets CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;

-- Verificar que las tablas fueron eliminadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('validation_qrs', 'player_wallets', 'email_logs');

-- Si el resultado está vacío, las tablas fueron eliminadas exitosamente
