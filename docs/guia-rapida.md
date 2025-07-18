# 🚀 Guía Rápida - Torneo La Negrita 2025

## Acceso Rápido
- **URL Admin**: `https://tu-dominio.com/admin`
- **Usuario**: `admin` (configurable)
- **Contraseña**: La que configuraste en `ADMIN_PASSWORD_HASH`

## Flujo Principal

### 1. Verificar Jugador (Más Común)
\`\`\`
1. Ve a pestaña "Jugadores"
2. Busca al jugador por nombre/email
3. Clic en botón verde ✅ "Verificar Pago"
4. Sistema envía email automáticamente
5. Jugador recibe QR code
\`\`\`

### 2. Validar QR en el Evento
\`\`\`
1. Clic en "Validar QR" (esquina superior)
2. Pega código QR del jugador
3. Formato: TORNEO-LA-NEGRITA-2025:ID:Nombre
4. Enter o "Validar QR"
5. ✅ = Puede jugar | ❌ = Problema
\`\`\`

### 3. Registrar Resultados
\`\`\`
1. Ve a pestaña "Resultados"
2. Selecciona jugador y ronda
3. Ingresa puntajes de 3 juegos
4. "Agregar Serie"
5. Clasificación se actualiza automáticamente
\`\`\`

## Problemas Frecuentes

### Email no llega
- Revisa spam del jugador
- Usa botón "Reenviar Email"
- Verifica configuración SMTP en Supabase

### QR no valida
- Verifica que jugador esté verificado
- Copia código completo
- Usa formato correcto

### Datos no cargan
- Verifica variables de entorno Supabase
- Recarga página
- Revisa consola del navegador (F12)

## Contactos de Emergencia
- **Soporte Técnico**: soporte@country.co.cr
- **Admin Principal**: admin@country.co.cr
