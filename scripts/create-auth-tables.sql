-- Tabla para intentos de login
CREATE TABLE login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ip TEXT NOT NULL,
  username TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Tabla para actividades de usuario
CREATE TABLE user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip TEXT,
  user_agent TEXT
);

-- Tabla para eventos de seguridad
CREATE TABLE security_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  event TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false
);

-- Tabla para tokens de recuperación
CREATE TABLE password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Índices para mejor rendimiento
CREATE INDEX idx_login_attempts_ip_created ON login_attempts(ip, created_at);
CREATE INDEX idx_login_attempts_username ON login_attempts(username);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created ON user_activities(created_at);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_password_reset_tokens_email ON password_reset_tokens(email);

-- Políticas RLS (Row Level Security)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Solo administradores pueden ver estos datos
CREATE POLICY "Admin only access" ON login_attempts FOR ALL USING (false);
CREATE POLICY "Admin only access" ON user_activities FOR ALL USING (false);
CREATE POLICY "Admin only access" ON security_events FOR ALL USING (false);
CREATE POLICY "Admin only access" ON password_reset_tokens FOR ALL USING (false);
