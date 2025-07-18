# 🔧 Solución de Problemas - Torneo La Negrita 2025

## Problemas de Conexión

### Error: "Configuración de base de datos incompleta"

#### Síntomas:
- Dashboard no carga datos
- Mensaje de error en consola
- Estadísticas muestran 0

#### Causas Posibles:
1. Variables de entorno faltantes
2. Credenciales incorrectas de Supabase
3. Proyecto Supabase pausado/eliminado

#### Solución:
\`\`\`bash
# 1. Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# 2. Si están vacías, configurar:
export NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="tu-service-key"

# 3. Reiniciar aplicación
npm run dev
\`\`\`

#### Verificación:
1. Ve a Supabase Dashboard
2. Confirma que el proyecto está activo
3. Verifica las credenciales en Settings > API

---

## Problemas de Email

### Error: "Error enviando email"

#### Síntomas:
- Botón de email no funciona
- Jugadores no reciben confirmación
- Error en consola del navegador

#### Causas Posibles:
1. SMTP no configurado en Supabase
2. Credenciales de email incorrectas
3. Límites de envío alcanzados
4. Email del jugador inválido

#### Solución Paso a Paso:

##### 1. Verificar Configuración SMTP:
\`\`\`
Supabase Dashboard > Authentication > Settings > SMTP Settings

✅ Enable custom SMTP: Activado
✅ SMTP Host: smtp.gmail.com (o tu proveedor)
✅ SMTP Port: 587
✅ SMTP User: tu-email@gmail.com
✅ SMTP Pass: tu-app-password
✅ SMTP Admin Email: admin@country.co.cr
\`\`\`

##### 2. Generar App Password (Gmail):
\`\`\`
1. Ve a Google Account Settings
2. Security > 2-Step Verification
3. App passwords > Generate new
4. Usa esta contraseña en SMTP Pass
\`\`\`

##### 3. Verificar Template:
\`\`\`
Authentication > Email Templates > Invite user
- Confirma que el template está configurado
- Verifica que las variables {{ .UserMetaData.player_name }} están presentes
\`\`\`

##### 4. Probar Envío Manual:
\`\`\`javascript
// En consola del navegador
fetch('/api/send-confirmation-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    player: { id: 'test', name: 'Test', email: 'tu-email@gmail.com' },
    qrCodeUrl: 'https://example.com/qr.png'
  })
}).then(r => r.json()).then(console.log)
\`\`\`

---

## Problemas de QR

### Error: "Código QR inválido"

#### Síntomas:
- QR no valida en el evento
- Mensaje de error al escanear
- Jugador no puede acceder

#### Causas Posibles:
1. Formato de QR incorrecto
2. Jugador no verificado
3. QR ya usado (si aplica)
4. Caracteres especiales en nombre

#### Solución:

##### 1. Verificar Formato:
\`\`\`
Formato correcto: TORNEO-LA-NEGRITA-2025:UUID:NombreJugador
Ejemplo: TORNEO-LA-NEGRITA-2025:123e4567-e89b-12d3-a456-426614174000:Juan Pérez
\`\`\`

##### 2. Regenerar QR:
\`\`\`
1. Ve a pestaña Jugadores
2. Busca al jugador
3. Clic en botón "Reenviar Email"
4. Nuevo QR se genera automáticamente
\`\`\`

##### 3. Validación Manual:
\`\`\`
1. Clic en "Validar QR"
2. Pega código completo
3. Si falla, verifica que jugador esté verificado
4. Usa búsqueda manual como respaldo
\`\`\`

---

## Problemas de Resultados

### Error: "Error agregando serie"

#### Síntomas:
- Formulario no se envía
- Resultados no aparecen en clasificación
- Error al seleccionar jugador

#### Causas Posibles:
1. Jugador no verificado
2. Puntajes fuera de rango
3. Serie duplicada
4. Problemas de permisos

#### Solución:

##### 1. Verificar Jugador:
\`\`\`
- Solo jugadores con estado "Verificado" aparecen en dropdown
- Si no aparece, verificar pago primero
\`\`\`

##### 2. Validar Puntajes:
\`\`\`
- Rango válido: 0-300 por juego
- No usar números negativos
- No dejar campos vacíos
\`\`\`

##### 3. Verificar Permisos en Supabase:
\`\`\`sql
-- Ejecutar en SQL Editor
SELECT * FROM player_series LIMIT 5;

-- Si da error de permisos:
ALTER TABLE player_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access" ON player_series
FOR ALL USING (auth.role() = 'service_role');
\`\`\`

---

## Problemas de Autenticación

### Error: "Credenciales inválidas"

#### Síntomas:
- No puede acceder al admin
- Login falla constantemente
- Sesión expira rápidamente

#### Causas Posibles:
1. Contraseña incorrecta
2. Hash de contraseña mal generado
3. Variables de entorno incorrectas
4. JWT_SECRET cambiado

#### Solución:

##### 1. Regenerar Hash de Contraseña:
\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'tu-nueva-contraseña';
const hash = bcrypt.hashSync(password, 12);
console.log('ADMIN_PASSWORD_HASH=' + hash);
\`\`\`

##### 2. Verificar Variables:
\`\`\`bash
echo $ADMIN_USERNAME
echo $ADMIN_PASSWORD_HASH
echo $JWT_SECRET
\`\`\`

##### 3. Limpiar Sesión:
\`\`\`javascript
// En consola del navegador
localStorage.clear();
sessionStorage.clear();
location.reload();
\`\`\`

---

## Problemas de Performance

### Página carga lenta

#### Síntomas:
- Dashboard tarda en cargar
- Búsquedas lentas
- Timeouts frecuentes

#### Causas Posibles:
1. Muchos registros en base de datos
2. Consultas no optimizadas
3. Falta de índices
4. Límites de Supabase alcanzados

#### Solución:

##### 1. Optimizar Consultas:
\`\`\`sql
-- Crear índices faltantes
CREATE INDEX IF NOT EXISTS idx_players_payment_status ON players(payment_status);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);
CREATE INDEX IF NOT EXISTS idx_player_series_player_round ON player_series(player_id, round_number);
\`\`\`

##### 2. Paginación:
\`\`\`javascript
// Limitar resultados
const { data } = await supabase
  .from('players')
  .select('*')
  .range(0, 49) // Solo primeros 50
  .order('created_at', { ascending: false });
\`\`\`

##### 3. Verificar Límites:
\`\`\`
Supabase Dashboard > Settings > Usage
- Database size
- API requests
- Bandwidth usage
\`\`\`

---

## Problemas de Datos

### Datos duplicados o inconsistentes

#### Síntomas:
- Jugadores aparecen duplicados
- Clasificación incorrecta
- Totales no cuadran

#### Causas Posibles:
1. Registros duplicados
2. Datos corruptos
3. Migraciones incompletas
4. Concurrencia de usuarios

#### Solución:

##### 1. Limpiar Duplicados:
\`\`\`sql
-- Encontrar duplicados por email
SELECT email, COUNT(*) 
FROM players 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Eliminar duplicados (mantener el más reciente)
DELETE FROM players 
WHERE id NOT IN (
  SELECT DISTINCT ON (email) id 
  FROM players 
  ORDER BY email, created_at DESC
);
\`\`\`

##### 2. Recalcular Totales:
\`\`\`sql
-- Actualizar totales de series
UPDATE player_series 
SET total_score = game_1 + game_2 + game_3 
WHERE total_score != game_1 + game_2 + game_3;
\`\`\`

##### 3. Backup Antes de Limpiar:
\`\`\`bash
# Exportar datos antes de modificar
supabase db dump --data-only > backup-$(date +%Y%m%d).sql
\`\`\`

---

## Herramientas de Debugging

### Consola del Navegador

#### Acceso:
- **Chrome/Edge**: F12 o Ctrl+Shift+I
- **Firefox**: F12 o Ctrl+Shift+K
- **Safari**: Cmd+Option+I

#### Qué Buscar:
\`\`\`javascript
// Errores en rojo
console.error("Error message");

// Requests fallidos
// Network tab > Filter by "Fetch/XHR"

// Estado de variables
console.log("Current state:", state);
\`\`\`

### Logs de Supabase

#### Acceso:
1. Supabase Dashboard
2. Logs > API Logs
3. Filtrar por:
   - Status: 4xx, 5xx (errores)
   - Method: POST, PUT (modificaciones)
   - Path: /rest/v1/players

#### Información Útil:
- Request body
- Response status
- Error messages
- Execution time

### Logs de Vercel (si aplica)

#### Acceso:
1. Vercel Dashboard
2. Tu proyecto > Functions
3. View Function Logs

#### Filtros:
- Error level
- Time range
- Function name

---

## Contacto de Emergencia

### Durante el Evento

#### Soporte Técnico Inmediato:
- **WhatsApp**: +506 xxxx-xxxx
- **Email**: emergencia@country.co.cr
- **Backup Admin**: admin2@country.co.cr

#### Procedimiento de Emergencia:
1. **Problema crítico**: Llamar inmediatamente
2. **Problema menor**: WhatsApp con screenshot
3. **Datos perdidos**: No tocar nada, contactar inmediatamente

### Información para Soporte

#### Incluir Siempre:
- URL exacta donde ocurre el problema
- Screenshot del error
- Pasos para reproducir
- Navegador y versión
- Hora exacta del problema

#### Ejemplo de Reporte:
\`\`\`
PROBLEMA: No se pueden agregar resultados
URL: https://torneo.country.co.cr/admin
ERROR: "Error agregando serie"
PASOS: 
1. Selecciono jugador "Juan Pérez"
2. Ronda 1, puntajes 150, 180, 200
3. Clic "Agregar Serie"
4. Aparece error

NAVEGADOR: Chrome 120.0.0.0
HORA: 15:30, 15 Feb 2025
SCREENSHOT: [adjunto]
\`\`\`

---

Esta guía cubre los problemas más comunes. Para situaciones no cubiertas aquí, contacta inmediatamente al equipo de soporte técnico.
