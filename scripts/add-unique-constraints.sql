-- Agregar restricciones únicas para evitar duplicados
-- Esto debe ejecutarse en Supabase SQL Editor

-- Agregar índice único para email
CREATE UNIQUE INDEX IF NOT EXISTS players_email_unique 
ON players (email);

-- Agregar índice único para passport
CREATE UNIQUE INDEX IF NOT EXISTS players_passport_unique 
ON players (passport);

-- Opcional: Agregar comentarios para documentar
COMMENT ON INDEX players_email_unique IS 'Evita registros duplicados por email';
COMMENT ON INDEX players_passport_unique IS 'Evita registros duplicados por pasaporte/cédula';
