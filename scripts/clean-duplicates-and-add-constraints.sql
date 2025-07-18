-- Script para limpiar duplicados existentes y agregar restricciones únicas

-- Paso 1: Identificar y mostrar duplicados por email
SELECT email, COUNT(*) as count, 
       STRING_AGG(id::text, ', ') as duplicate_ids,
       STRING_AGG(name, ', ') as names
FROM players 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Paso 2: Identificar y mostrar duplicados por passport
SELECT passport, COUNT(*) as count,
       STRING_AGG(id::text, ', ') as duplicate_ids,
       STRING_AGG(name, ', ') as names
FROM players 
GROUP BY passport 
HAVING COUNT(*) > 1;

-- Paso 3: Crear tabla temporal con registros únicos (mantener el más reciente)
CREATE TEMP TABLE players_unique AS
SELECT DISTINCT ON (email, passport) *
FROM players
ORDER BY email, passport, created_at DESC;

-- Paso 4: Mostrar cuántos registros se van a eliminar
SELECT 
  (SELECT COUNT(*) FROM players) as total_original,
  (SELECT COUNT(*) FROM players_unique) as total_unique,
  (SELECT COUNT(*) FROM players) - (SELECT COUNT(*) FROM players_unique) as to_delete;

-- Paso 5: Respaldar registros duplicados antes de eliminar
CREATE TABLE IF NOT EXISTS players_duplicates_backup AS
SELECT p.*, NOW() as backup_date
FROM players p
WHERE p.id NOT IN (SELECT id FROM players_unique);

-- Paso 6: Eliminar duplicados (mantener solo los únicos)
DELETE FROM players 
WHERE id NOT IN (SELECT id FROM players_unique);

-- Paso 7: Agregar restricciones únicas
CREATE UNIQUE INDEX IF NOT EXISTS players_email_unique 
ON players (email);

CREATE UNIQUE INDEX IF NOT EXISTS players_passport_unique 
ON players (passport);

-- Paso 8: Agregar comentarios
COMMENT ON INDEX players_email_unique IS 'Evita registros duplicados por email';
COMMENT ON INDEX players_passport_unique IS 'Evita registros duplicados por pasaporte/cédula';

-- Paso 9: Mostrar resumen final
SELECT 
  'Limpieza completada' as status,
  (SELECT COUNT(*) FROM players) as total_players_final,
  (SELECT COUNT(*) FROM players_duplicates_backup) as duplicates_backed_up;
