-- Script SEGURO para limpiar duplicados paso a paso

-- PASO 1: Crear tabla de respaldo COMPLETA
CREATE TABLE IF NOT EXISTS players_backup_before_cleanup AS
SELECT *, NOW() as backup_timestamp
FROM players;

-- PASO 2: Mostrar qué se va a eliminar (SIN ELIMINAR AÚN)
SELECT 
    'REGISTROS QUE SE ELIMINARÍAN' as accion,
    p.id,
    p.name,
    p.email,
    p.passport,
    p.created_at
FROM players p
WHERE p.id NOT IN (
    SELECT DISTINCT ON (email, passport) id
    FROM players
    ORDER BY email, passport, created_at DESC
)
ORDER BY p.email, p.passport;

-- PASO 3: Mostrar qué se va a MANTENER
SELECT 
    'REGISTROS QUE SE MANTENDRÍAN' as accion,
    p.id,
    p.name,
    p.email,
    p.passport,
    p.created_at
FROM players p
WHERE p.id IN (
    SELECT DISTINCT ON (email, passport) id
    FROM players
    ORDER BY email, passport, created_at DESC
)
ORDER BY p.email, p.passport;

-- PASO 4: Contar totales
SELECT 
    'RESUMEN DE LIMPIEZA' as tipo,
    (SELECT COUNT(*) FROM players) as total_actual,
    (SELECT COUNT(*) FROM (
        SELECT DISTINCT ON (email, passport) id
        FROM players
        ORDER BY email, passport, created_at DESC
    ) unique_records) as total_despues_limpieza,
    (SELECT COUNT(*) FROM players) - (SELECT COUNT(*) FROM (
        SELECT DISTINCT ON (email, passport) id
        FROM players
        ORDER BY email, passport, created_at DESC
    ) unique_records) as registros_a_eliminar;

-- COMENTARIO: Para ejecutar la limpieza real, descomenta las siguientes líneas:
/*
-- PASO 5: ELIMINAR DUPLICADOS (DESCOMENTA PARA EJECUTAR)
DELETE FROM players 
WHERE id NOT IN (
    SELECT DISTINCT ON (email, passport) id
    FROM players
    ORDER BY email, passport, created_at DESC
);

-- PASO 6: AGREGAR RESTRICCIONES ÚNICAS
CREATE UNIQUE INDEX IF NOT EXISTS players_email_unique ON players (email);
CREATE UNIQUE INDEX IF NOT EXISTS players_passport_unique ON players (passport);

-- PASO 7: VERIFICAR RESULTADO
SELECT 'LIMPIEZA COMPLETADA' as status, COUNT(*) as total_final FROM players;
*/
