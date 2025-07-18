-- Script para identificar duplicados sin hacer cambios

-- Verificar duplicados por email
SELECT 
    'DUPLICADOS POR EMAIL' as tipo,
    email, 
    COUNT(*) as cantidad,
    STRING_AGG(id::text, ', ') as ids_duplicados,
    STRING_AGG(name, ' | ') as nombres,
    STRING_AGG(created_at::text, ' | ') as fechas_creacion
FROM players 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;

-- Separador
SELECT '---' as separador;

-- Verificar duplicados por passport
SELECT 
    'DUPLICADOS POR PASSPORT' as tipo,
    passport, 
    COUNT(*) as cantidad,
    STRING_AGG(id::text, ', ') as ids_duplicados,
    STRING_AGG(name, ' | ') as nombres,
    STRING_AGG(created_at::text, ' | ') as fechas_creacion
FROM players 
GROUP BY passport 
HAVING COUNT(*) > 1
ORDER BY cantidad DESC;

-- Separador
SELECT '---' as separador;

-- Resumen total
SELECT 
    'RESUMEN' as tipo,
    COUNT(*) as total_jugadores,
    COUNT(DISTINCT email) as emails_unicos,
    COUNT(DISTINCT passport) as passports_unicos,
    COUNT(*) - COUNT(DISTINCT email) as duplicados_email,
    COUNT(*) - COUNT(DISTINCT passport) as duplicados_passport
FROM players;
