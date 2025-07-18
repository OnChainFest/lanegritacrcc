-- Script para limpiar datos mock y preparar tablas para entrada manual
-- Torneo La Negrita 2025
-- Fecha: 2025-01-15

-- =====================================================
-- PASO 1: LIMPIAR DATOS MOCK DE TODAS LAS TABLAS
-- =====================================================

-- Limpiar datos de series de jugadores (resultados)
DELETE FROM player_series;
PRINT 'Datos eliminados de player_series';

-- Limpiar datos de rondas del torneo
DELETE FROM tournament_rounds;
PRINT 'Datos eliminados de tournament_rounds';

-- Limpiar datos de jugadores en brackets
DELETE FROM bracket_players;
PRINT 'Datos eliminados de bracket_players';

-- Limpiar datos de brackets
DELETE FROM tournament_brackets;
PRINT 'Datos eliminados de tournament_brackets';

-- =====================================================
-- PASO 2: REINICIAR SECUENCIAS DE ID
-- =====================================================

-- Reiniciar secuencia de brackets
ALTER SEQUENCE tournament_brackets_id_seq RESTART WITH 1;
PRINT 'Secuencia tournament_brackets_id_seq reiniciada';

-- Reiniciar secuencia de rondas
ALTER SEQUENCE tournament_rounds_id_seq RESTART WITH 1;
PRINT 'Secuencia tournament_rounds_id_seq reiniciada';

-- Reiniciar secuencia de series
ALTER SEQUENCE player_series_id_seq RESTART WITH 1;
PRINT 'Secuencia player_series_id_seq reiniciada';

-- =====================================================
-- PASO 3: VERIFICAR QUE LAS TABLAS ESTÉN VACÍAS
-- =====================================================

-- Verificar conteos
SELECT 
    'tournament_brackets' as tabla,
    COUNT(*) as registros
FROM tournament_brackets

UNION ALL

SELECT 
    'bracket_players' as tabla,
    COUNT(*) as registros
FROM bracket_players

UNION ALL

SELECT 
    'tournament_rounds' as tabla,
    COUNT(*) as registros
FROM tournament_rounds

UNION ALL

SELECT 
    'player_series' as tabla,
    COUNT(*) as registros
FROM player_series;

-- =====================================================
-- PASO 4: MOSTRAR ESTRUCTURA DE TABLAS PARA REFERENCIA
-- =====================================================

-- Mostrar estructura de las tablas principales
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('tournament_brackets', 'bracket_players', 'player_series', 'tournament_rounds')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- PASO 5: VERIFICAR QUE LOS JUGADORES EXISTEN
-- =====================================================

-- Verificar que los jugadores existen para poder agregarlos a brackets
SELECT 
    COUNT(*) as total_players,
    COUNT(CASE WHEN payment_status = 'verified' THEN 1 END) as verified_players
FROM players;

-- Mostrar algunos jugadores verificados disponibles
SELECT 
    id,
    name,
    email,
    payment_status,
    qr_validated
FROM players 
WHERE payment_status = 'verified'
ORDER BY name
LIMIT 10;

-- =====================================================
-- PASO 6: EJEMPLOS DE INSERCIÓN MANUAL
-- =====================================================

-- COMENTARIOS CON EJEMPLOS DE USO:

/*
EJEMPLO 1: Crear un bracket
INSERT INTO tournament_brackets (name, description, max_players, status) 
VALUES ('Bracket A', 'Primer bracket del torneo', 16, 'active');

EJEMPLO 2: Agregar jugador a bracket
INSERT INTO bracket_players (bracket_id, player_id, position) 
VALUES (1, 'uuid-del-jugador', 1);

EJEMPLO 3: Crear una ronda
INSERT INTO tournament_rounds (bracket_id, round_number, round_name, status) 
VALUES (1, 1, 'Ronda 1', 'active');

EJEMPLO 4: Agregar serie de un jugador
INSERT INTO player_series (player_id, bracket_id, round_id, round_number, game_1, game_2, game_3, total_score) 
VALUES ('uuid-del-jugador', 1, 1, 1, 150, 180, 170, 500);

EJEMPLO 5: Consultar jugadores disponibles para agregar a brackets
SELECT id, name, email, payment_status, qr_validated 
FROM players 
WHERE payment_status = 'verified' AND qr_validated = true
ORDER BY name;
*/

-- =====================================================
-- PASO 7: VERIFICACIÓN DE ÍNDICES
-- =====================================================

-- Verificar índices existentes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('tournament_brackets', 'bracket_players', 'player_series', 'tournament_rounds')
ORDER BY tablename, indexname;

-- =====================================================
-- PASO 8: VERIFICACIÓN FINAL
-- =====================================================

SELECT 'LIMPIEZA COMPLETADA EXITOSAMENTE' as resultado;
SELECT 'Las tablas están listas para entrada manual de datos' as estado;
SELECT 'Usa los ejemplos comentados arriba para agregar datos' as instrucciones;
