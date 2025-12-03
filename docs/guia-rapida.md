# 🚀 Guía Rápida - PadelFlow

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
5. Jugador recibe QR code de acceso
\`\`\`

### 2. Validar QR en el Torneo
\`\`\`
1. Clic en "Validar QR" (esquina superior)
2. Pega código QR del jugador
3. Formato: PADELFLOW-2025:ID:Nombre
4. Enter o "Validar QR"
5. ✅ = Puede jugar | ❌ = Problema
\`\`\`

### 3. Registrar Resultados de Partidos
\`\`\`
1. Ve a pestaña "Resultados"
2. Selecciona partido y jugadores
3. Ingresa resultado de sets (ej: 6-4, 6-3)
4. "Guardar Resultado"
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
- **Soporte Técnico**: soporte@padelflow.com
- **Admin Principal**: admin@padelflow.com
