# ⚙️ Configuración Detallada de Supabase

## Paso a Paso Completo

### 1. Crear Proyecto Supabase

#### Registro y Creación:
1. Ve a [supabase.com](https://supabase.com)
2. Clic en "Start your project"
3. Crea cuenta con GitHub/Google o email
4. Clic en "New Project"
5. Completa:
   - **Organization**: Crea nueva o usa existente
   - **Name**: `padelflow`
   - **Database Password**: Genera contraseña segura (guárdala)
   - **Region**: `US East (N. Virginia)` recomendado
   - **Pricing Plan**: Free tier es suficiente para empezar

### 2. Configurar Base de Datos

#### Ejecutar Scripts SQL:
1. Ve a **SQL Editor** en el dashboard
2. Ejecuta estos scripts en orden:

\`\`\`sql
-- Script 1: Tablas principales
CREATE TABLE players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified')),
    qr_validated BOOLEAN DEFAULT FALSE,
    wallet_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Script 2: Tablas de resultados
CREATE TABLE tournament_rounds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    round_name TEXT NOT NULL,
    round_number INTEGER NOT NULL UNIQUE,
    start_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE player_series (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    round_number INTEGER,
    game_1 INTEGER CHECK (game_1 >= 0 AND game_1 <= 300),
    game_2 INTEGER CHECK (game_2 >= 0 AND game_2 <= 300),
    game_3 INTEGER CHECK (game_3 >= 0 AND game_3 <= 300),
    total_score INTEGER GENERATED ALWAYS AS (game_1 + game_2 + game_3) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Script 3: Tablas de brackets
CREATE TABLE tournament_brackets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bracket_name TEXT NOT NULL,
    description TEXT,
    max_players INTEGER DEFAULT 16,
    current_players INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bracket_players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bracket_id UUID REFERENCES tournament_brackets(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bracket_id, player_id)
);

-- Script 4: Índices para performance
CREATE INDEX idx_players_payment_status ON players(payment_status);
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_player_series_player_id ON player_series(player_id);
CREATE INDEX idx_player_series_round ON player_series(round_number);
\`\`\`

### 3. Configurar Autenticación

#### Settings Generales:
1. Ve a **Authentication > Settings**
2. **General Settings**:
   - **Site URL**: `https://tu-dominio.com`
   - **Redirect URLs**: `https://tu-dominio.com/auth/callback`

#### SMTP Configuration:
1. **Authentication > Settings > SMTP Settings**
2. **Enable custom SMTP**: ✅

**Para Gmail:**
\`\`\`
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: tu-email@gmail.com
SMTP Pass: tu-app-password-de-gmail
SMTP Admin Email: admin@country.co.cr
SMTP Sender Name: Torneo La Negrita
\`\`\`

**Para SendGrid:**
\`\`\`
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: tu-sendgrid-api-key
SMTP Admin Email: admin@country.co.cr
SMTP Sender Name: Torneo La Negrita
\`\`\`

### 4. Configurar Email Templates

#### Template de Confirmación:
1. Ve a **Authentication > Email Templates**
2. Selecciona **"Invite user"**
3. Pega este template:

\`\`\`html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎳 Torneo La Negrita 2025</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Country Club Costa Rica</p>
  </div>
  
  <!-- Content -->
  <div style="padding: 40px 30px;">
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      ¡Hola <strong style="color: #1f2937;">{{ .UserMetaData.player_name }}</strong>!
    </p>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Tu registro ha sido <strong style="color: #059669;">confirmado exitosamente</strong> para el Torneo La Negrita 2025.
    </p>
    
    <!-- Info Box -->
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>📋 ID de Registro:</strong> {{ .UserMetaData.registration_id }}<br>
        <strong>📧 Email:</strong> {{ .Email }}<br>
        <strong>📅 Fecha:</strong> 15 de Febrero, 2025<br>
        <strong>📍 Lugar:</strong> Country Club Costa Rica
      </p>
    </div>
    
    <!-- QR Code Section -->
    <div style="text-align: center; margin: 35px 0; padding: 30px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;">
      <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">🎯 Tu Código QR de Acceso</h3>
      <img src="{{ .UserMetaData.qr_code_url }}" alt="Código QR" style="max-width: 200px; height: auto;" />
      <p style="font-size: 12px; color: #64748b; margin: 10px 0 0 0;">
        💡 Guarda esta imagen en tu teléfono o imprímela
      </p>
    </div>
    
    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Confirmar Participación
      </a>
    </div>
    
    <!-- Instructions -->
    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h4 style="margin-top: 0; color: #1e40af; font-size: 16px;">📋 Instrucciones Importantes:</h4>
      <ul style="color: #1e40af; font-size: 14px; line-height: 1.6;">
        <li>Llega 30 minutos antes de tu horario</li>
        <li>Presenta tu código QR en recepción</li>
        <li>Trae zapatos de bowling o usa los del club</li>
        <li>El torneo inicia puntualmente</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151; text-align: center; margin-top: 30px;">
      ¡Gracias por ser parte del torneo! 🎳
    </p>
  </div>
  
  <!-- Footer -->
  <div style="background: #f8fafc; text-align: center; padding: 30px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb;">
    <p style="margin: 0;">
      <strong>Country Club Costa Rica</strong><br>
      📧 Para consultas: <a href="mailto:boliche@country.co.cr" style="color: #2563eb;">boliche@country.co.cr</a><br>
      📞 Teléfono: +506 2xxx-xxxx
    </p>
  </div>
</div>
\`\`\`

### 5. Configurar Políticas de Seguridad (RLS)

#### Habilitar RLS:
\`\`\`sql
-- Habilitar Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_brackets ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública de jugadores verificados
CREATE POLICY "Public read verified players" ON players
FOR SELECT USING (payment_status = 'verified');

-- Política para que solo service role pueda modificar
CREATE POLICY "Service role full access" ON players
FOR ALL USING (auth.role() = 'service_role');

-- Políticas similares para otras tablas
CREATE POLICY "Public read series" ON player_series
FOR SELECT USING (true);

CREATE POLICY "Service role series access" ON player_series
FOR ALL USING (auth.role() = 'service_role');
\`\`\`

### 6. Obtener Credenciales

#### API Keys:
1. Ve a **Settings > API**
2. Copia estas credenciales:

\`\`\`env
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co

# Public anon key (safe to use in frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (keep secret, server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 7. Configurar Edge Functions (Opcional)

#### Para funcionalidades avanzadas:
\`\`\`bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Crear función
supabase functions new send-tournament-email
\`\`\`

#### Función de ejemplo:
\`\`\`typescript
// supabase/functions/send-tournament-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { player, qrCodeUrl } = await req.json()
  
  // Lógica de envío de email personalizada
  // Usar Deno para enviar emails con plantillas avanzadas
  
  return new Response(
    JSON.stringify({ success: true, message: "Email sent" }),
    { headers: { "Content-Type": "application/json" } }
  )
})
\`\`\`

#### Desplegar función:
\`\`\`bash
supabase functions deploy send-tournament-email
\`\`\`

### 8. Monitoreo y Logs

#### Ver Logs:
1. **Logs > API Logs**: Para ver requests a la API
2. **Logs > Database Logs**: Para ver queries SQL
3. **Logs > Auth Logs**: Para ver autenticación

#### Métricas:
1. **Reports**: Dashboard con estadísticas de uso
2. **Database > Usage**: Uso de almacenamiento
3. **Auth > Users**: Usuarios registrados

### 9. Backup y Seguridad

#### Backup Automático:
- Supabase hace backups automáticos diarios
- Plan gratuito: 7 días de retención
- Plan Pro: 30 días de retención

#### Backup Manual:
\`\`\`bash
# Exportar datos
supabase db dump --data-only > backup.sql

# Restaurar datos
supabase db reset
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
\`\`\`

### 10. Límites del Plan Gratuito

#### Límites Importantes:
- **Database**: 500MB
- **Auth users**: 50,000
- **Edge Functions**: 500,000 invocations/month
- **Bandwidth**: 5GB/month
- **API requests**: 50,000/month

#### Cuándo Actualizar:
- Si superas 500MB de datos
- Si necesitas más de 50,000 usuarios
- Si requieres soporte prioritario
- Si necesitas backups más largos

---

Esta configuración te dará una base sólida para el sistema del torneo. Para configuraciones más avanzadas o problemas específicos, consulta la [documentación oficial de Supabase](https://supabase.com/docs).
