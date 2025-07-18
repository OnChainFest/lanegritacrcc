# 📋 Guía del Administrador - Torneo La Negrita 2025

## Índice
1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Panel de Administración](#panel-de-administración)
4. [Gestión de Jugadores](#gestión-de-jugadores)
5. [Sistema de Resultados](#sistema-de-resultados)
6. [Gestión de Llaves](#gestión-de-llaves)
7. [Validación QR](#validación-qr)
8. [Envío de Emails](#envío-de-emails)
9. [Integración Supabase](#integración-supabase)
10. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Esta plataforma permite administrar completamente el Torneo La Negrita 2025 del Country Club Costa Rica. Incluye gestión de jugadores, resultados, llaves de competencia y comunicación automática.

### Características principales:
- ✅ Registro y verificación de jugadores
- ✅ Sistema de resultados en tiempo real
- ✅ Generación automática de llaves
- ✅ Validación QR para acceso
- ✅ Envío automático de emails
- ✅ Dashboard con estadísticas

---

## Configuración Inicial

### 1. Variables de Entorno Requeridas

Crea un archivo `.env.local` con las siguientes variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Authentication
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hash_bcrypt_de_tu_contraseña
ADMIN_EMAIL=admin@country.co.cr

# Email Configuration
FROM_EMAIL=boliche@country.co.cr
SENDGRID_API_KEY=tu_sendgrid_api_key
RESEND_API_KEY=tu_resend_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NODE_ENV=production
\`\`\`

### 2. Configuración de Supabase

#### Paso 1: Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Clic en "New Project"
4. Completa los datos:
   - **Name**: `torneo-la-negrita-2025`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la más cercana (US East recomendado)

#### Paso 2: Obtener Credenciales
1. Ve a **Settings > API**
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

#### Paso 3: Configurar Base de Datos
Ejecuta estos scripts SQL en el **SQL Editor** de Supabase:

\`\`\`sql
-- 1. Crear tablas principales
-- Ejecutar: scripts/create-tables.sql
-- Ejecutar: scripts/create-auth-tables.sql
-- Ejecutar: scripts/create-results-system-fixed.sql
-- Ejecutar: scripts/create-bracket-tables-complete.sql
\`\`\`

#### Paso 4: Configurar SMTP
1. Ve a **Authentication > Settings > SMTP Settings**
2. Configura tu proveedor de email:

**Para Gmail:**
\`\`\`
Host: smtp.gmail.com
Port: 587
Username: tu-email@gmail.com
Password: tu-app-password
Sender email: boliche@country.co.cr
Sender name: Torneo La Negrita
\`\`\`

**Para SendGrid:**
\`\`\`
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: tu-sendgrid-api-key
Sender email: boliche@country.co.cr
Sender name: Torneo La Negrita
\`\`\`

### 3. Generar Hash de Contraseña

Ejecuta este script para generar el hash de tu contraseña de admin:

\`\`\`bash
npm run generate-admin-hash
\`\`\`

O usa este código:
\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'tu-contraseña-segura';
const hash = bcrypt.hashSync(password, 12);
console.log('ADMIN_PASSWORD_HASH=' + hash);
\`\`\`

---

## Panel de Administración

### Acceso al Panel
1. Ve a `https://tu-dominio.com/admin`
2. Usa las credenciales configuradas en las variables de entorno
3. El sistema te redirigirá al dashboard principal

### Dashboard Principal

El dashboard muestra 4 métricas clave:

#### 📊 Estadísticas Principales
- **Total Jugadores**: Número total de registros
- **Verificados**: Jugadores con pago confirmado
- **Pendientes**: Jugadores esperando verificación
- **Ingresos Totales**: Suma total recaudada

#### 🔄 Actualización de Datos
- Clic en **"Actualizar"** para refrescar las estadísticas
- Los datos se actualizan automáticamente cada vez que cambias algo

---

## Gestión de Jugadores

### Pestaña "Jugadores"

#### Funciones Principales:

#### 1. **Búsqueda de Jugadores**
- Usa la barra de búsqueda para filtrar por:
  - Nombre del jugador
  - Email
  - Número de teléfono
- La búsqueda es en tiempo real

#### 2. **Tabla de Jugadores**
Cada fila muestra:
- **Nombre**: Nombre completo del jugador
- **Email**: Correo electrónico
- **Teléfono**: Número de contacto
- **Estado Pago**: 
  - 🟢 **Verificado**: Pago confirmado
  - 🟡 **Pendiente**: Esperando verificación
- **QR Validado**: 
  - 🔵 **Validado**: QR escaneado en el evento
  - 🔴 **Sin validar**: Aún no ha llegado
- **Fecha Registro**: Cuándo se registró
- **Acciones**: Botones de acción

#### 3. **Acciones por Jugador**

##### 👁️ **Ver Detalles**
- Clic en el ícono del ojo
- Muestra información completa:
  - Datos personales
  - Contacto de emergencia
  - Estado de pago
  - Dirección de wallet (si aplica)

##### ✅ **Verificar Pago**
- Clic en el botón verde ✅
- Cambia el estado a "Verificado"
- **Automáticamente envía email de confirmación**
- Genera código QR para el jugador

##### ❌ **Marcar como Pendiente**
- Clic en el botón rojo ❌
- Cambia el estado a "Pendiente"
- Usar si hay problemas con el pago

##### 📧 **Enviar Email**
- Clic en el botón azul 📧
- Reenvía email de confirmación
- Incluye código QR actualizado

#### 4. **Proceso de Verificación Recomendado**

\`\`\`
1. Jugador se registra → Estado: "Pendiente"
2. Verificas el pago → Clic en ✅
3. Sistema envía email automático
4. Jugador recibe QR code
5. En el evento → Validar QR
\`\`\`

---

## Sistema de Resultados

### Pestaña "Resultados"

#### 1. **Agregar Nueva Serie**

##### Campos Requeridos:
- **Jugador**: Selecciona de la lista (solo jugadores verificados)
- **Ronda**: Selecciona ronda 1-6
- **Juego 1**: Puntaje del primer juego (0-300)
- **Juego 2**: Puntaje del segundo juego (0-300)
- **Juego 3**: Puntaje del tercer juego (0-300)

##### Proceso:
1. Selecciona el jugador del dropdown
2. Elige la ronda correspondiente
3. Ingresa los 3 puntajes
4. El **Total** se calcula automáticamente
5. Clic en **"Agregar Serie"**

#### 2. **Clasificación General**

##### Información Mostrada:
- **Posición**: Ranking actual
- **Nombre**: Nombre del jugador
- **Series jugadas**: Número de series completadas
- **Juegos totales**: Total de juegos (series × 3)
- **Puntaje Total**: Suma de todos los juegos
- **Promedio**: Promedio por juego
- **Mejor juego**: Puntaje más alto individual

##### Características:
- Se actualiza automáticamente al agregar series
- Los primeros 3 lugares tienen fondo dorado
- Ordenado por puntaje total descendente

#### 3. **Gestión de Rondas**

##### Crear Nueva Ronda:
1. Ve a la sección de rondas
2. Clic en **"Agregar Ronda"**
3. Ingresa:
   - **Nombre**: Ej. "Ronda Clasificatoria 1"
   - **Fecha**: Fecha de la ronda
4. La ronda se crea automáticamente

##### Estados de Ronda:
- **Activa**: Ronda en curso
- **Inactiva**: Ronda completada

---

## Gestión de Llaves

### Pestaña "Llaves"

#### 1. **Crear Nueva Llave**

##### Campos:
- **Nombre**: Ej. "Llave A - Clasificatoria"
- **Descripción**: Descripción opcional
- **Máximo Jugadores**: Límite de participantes
- **Fecha Inicio**: Cuándo comienza
- **Estado**: Activa/Inactiva

##### Proceso:
1. Clic en **"Crear Nueva Llave"**
2. Completa el formulario
3. Clic en **"Crear Llave"**

#### 2. **Agregar Jugadores a Llaves**

##### Método Manual:
1. Selecciona la llave
2. Clic en **"Agregar Jugador"**
3. Selecciona jugador del dropdown
4. Confirma la acción

##### Método Automático:
1. Clic en **"Auto-asignar"**
2. El sistema distribuye jugadores automáticamente
3. Basado en ranking actual

#### 3. **Gestión de Llaves**

##### Acciones Disponibles:
- **Ver Participantes**: Lista de jugadores en la llave
- **Editar Llave**: Modificar configuración
- **Eliminar Llave**: Borrar llave (solo si está vacía)
- **Generar Bracket**: Crear bracket visual

---

## Validación QR

### Función "Validar QR"

#### 1. **Acceso**
- Botón **"Validar QR"** en la esquina superior derecha
- Disponible desde cualquier pestaña

#### 2. **Métodos de Validación**

##### Validación Manual:
1. Clic en pestaña **"Manual"**
2. Pega el código QR completo
3. Formato: `TORNEO-LA-NEGRITA-2025:ID:Nombre`
4. Presiona Enter o clic **"Validar QR"**

##### Validación por Cámara:
- **Próximamente disponible**
- Por ahora usa validación manual

#### 3. **Proceso de Validación**

\`\`\`
1. Jugador llega al evento
2. Muestra su código QR (email o impreso)
3. Administrador abre validador QR
4. Escanea o ingresa código manualmente
5. Sistema verifica:
   - Código válido
   - Jugador existe
   - Pago verificado
6. Marca como "QR Validado"
7. Jugador puede participar
\`\`\`

#### 4. **Resultados de Validación**

##### ✅ **Validación Exitosa**:
- Mensaje verde de confirmación
- Muestra datos del jugador
- Actualiza estado en la base de datos

##### ❌ **Error de Validación**:
- Mensaje rojo con el error
- Posibles causas:
  - Código QR inválido
  - Jugador no encontrado
  - Pago no verificado
  - Código ya usado

---

## Envío de Emails

### Sistema Automático

#### 1. **Cuándo se Envían Emails**
- **Automáticamente** al verificar pago de jugador
- **Manualmente** usando botón de reenvío

#### 2. **Contenido del Email**
- Saludo personalizado con nombre
- Confirmación de registro
- ID de registro único
- **Código QR embebido**
- Instrucciones para el evento
- Información de contacto

#### 3. **Configuración de Email**

##### Template HTML:
El email incluye:
- Header con logos del torneo
- Mensaje de bienvenida personalizado
- Código QR generado automáticamente
- Información del evento
- Footer con datos de contacto

##### Personalización:
- **Remitente**: `boliche@country.co.cr`
- **Nombre**: `Torneo La Negrita`
- **Asunto**: `Confirmación - Torneo La Negrita 2025`

#### 4. **Solución de Problemas de Email**

##### Email no llega:
1. Verifica configuración SMTP en Supabase
2. Revisa carpeta de spam del destinatario
3. Confirma que el email del jugador es correcto
4. Usa botón **"Reenviar Email"**

##### Error al enviar:
1. Revisa logs en la consola del navegador
2. Verifica variables de entorno
3. Confirma configuración de Supabase Auth

---

## Integración Supabase

### Configuración Completa

#### 1. **Estructura de Base de Datos**

##### Tablas Principales:
\`\`\`sql
players                 -- Jugadores registrados
tournament_rounds       -- Rondas del torneo
player_series          -- Resultados por serie
tournament_brackets    -- Llaves de competencia
bracket_players        -- Jugadores en cada llave
login_attempts         -- Intentos de login
user_activities        -- Actividades de admin
\`\`\`

#### 2. **Configuración de Autenticación**

##### En Supabase Dashboard:
1. **Authentication > Settings > General**
2. Configurar:
   - **Site URL**: `https://tu-dominio.com`
   - **Redirect URLs**: `https://tu-dominio.com/auth/callback`

##### SMTP Settings:
\`\`\`
Enable custom SMTP: ✅
SMTP Host: smtp.gmail.com (o tu proveedor)
SMTP Port: 587
SMTP User: tu-email@gmail.com
SMTP Pass: tu-app-password
\`\`\`

#### 3. **Políticas de Seguridad (RLS)**

##### Configuración Recomendada:
\`\`\`sql
-- Permitir lectura pública de jugadores verificados
CREATE POLICY "Public read verified players" ON players
FOR SELECT USING (payment_status = 'verified');

-- Solo admin puede modificar
CREATE POLICY "Admin only modify" ON players
FOR ALL USING (auth.role() = 'service_role');
\`\`\`

#### 4. **Edge Functions (Opcional)**

##### Para Funcionalidades Avanzadas:
\`\`\`typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Lógica de envío de email personalizada
  return new Response("OK")
})
\`\`\`

##### Desplegar:
\`\`\`bash
supabase functions deploy send-email
\`\`\`

---

## Solución de Problemas

### Problemas Comunes

#### 1. **Error de Conexión a Supabase**

##### Síntomas:
- "Configuración de base de datos incompleta"
- Datos no cargan
- Errores en consola

##### Solución:
1. Verifica variables de entorno:
   \`\`\`bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   \`\`\`
2. Confirma que las credenciales son correctas
3. Revisa que el proyecto Supabase esté activo

#### 2. **Emails No Se Envían**

##### Síntomas:
- "Error enviando email"
- Jugadores no reciben confirmación

##### Solución:
1. Verifica configuración SMTP en Supabase
2. Confirma que `FROM_EMAIL` está verificado
3. Revisa límites de envío del proveedor
4. Usa el modo de prueba primero

#### 3. **QR No Valida**

##### Síntomas:
- "Código QR inválido"
- Jugador no puede acceder

##### Solución:
1. Verifica formato del QR: `TORNEO-LA-NEGRITA-2025:ID:Nombre`
2. Confirma que el jugador está verificado
3. Regenera el QR reenviando email
4. Usa validación manual como respaldo

#### 4. **Resultados No Se Guardan**

##### Síntomas:
- Error al agregar serie
- Clasificación no actualiza

##### Solución:
1. Verifica que el jugador esté verificado
2. Confirma que los puntajes están en rango (0-300)
3. Revisa permisos de base de datos
4. Recarga la página y reintenta

### Logs y Debugging

#### 1. **Consola del Navegador**
- Presiona F12 para abrir DevTools
- Ve a la pestaña "Console"
- Busca errores en rojo

#### 2. **Logs de Supabase**
- Ve a tu proyecto en Supabase
- **Logs > API Logs**
- Filtra por errores

#### 3. **Logs de Vercel** (si usas Vercel)
- Ve a tu proyecto en Vercel
- **Functions > View Function Logs**

### Contacto de Soporte

Para problemas técnicos:
- **Email**: soporte@country.co.cr
- **Teléfono**: +506 2xxx-xxxx
- **Horario**: Lunes a Viernes, 8am-5pm

---

## Checklist de Implementación

### Antes del Evento

#### ✅ Configuración Inicial
- [ ] Variables de entorno configuradas
- [ ] Supabase proyecto creado y configurado
- [ ] Base de datos con tablas creadas
- [ ] SMTP configurado y probado
- [ ] Contraseña de admin generada

#### ✅ Pruebas del Sistema
- [ ] Registro de jugador de prueba
- [ ] Verificación de pago funciona
- [ ] Email de confirmación llega
- [ ] QR code se genera correctamente
- [ ] Validación QR funciona
- [ ] Resultados se guardan correctamente
- [ ] Clasificación se actualiza

#### ✅ Día del Evento
- [ ] Sistema funcionando correctamente
- [ ] Dispositivos para validar QR listos
- [ ] Personal capacitado en el uso
- [ ] Respaldo de datos configurado

### Durante el Evento

#### ✅ Validación de Acceso
- [ ] Validar QR de cada participante
- [ ] Marcar asistencia en el sistema
- [ ] Resolver problemas de QR inválidos

#### ✅ Registro de Resultados
- [ ] Ingresar resultados después de cada serie
- [ ] Verificar que la clasificación se actualiza
- [ ] Mantener respaldo manual de puntajes

#### ✅ Comunicación
- [ ] Enviar actualizaciones por email si es necesario
- [ ] Mantener información actualizada en pantallas

---

Esta guía cubre todas las funcionalidades principales de la plataforma. Para funciones específicas o problemas no cubiertos aquí, consulta la documentación técnica o contacta al equipo de soporte.
