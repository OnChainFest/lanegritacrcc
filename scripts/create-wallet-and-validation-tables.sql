-- Tabla para wallets de jugadores
CREATE TABLE player_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL UNIQUE,
  private_key TEXT NOT NULL, -- En producción, encriptar
  mnemonic TEXT NOT NULL, -- En producción, encriptar
  is_active BOOLEAN DEFAULT true,
  network TEXT DEFAULT 'ethereum',
  balance DECIMAL(20,8) DEFAULT 0
);

-- Tabla para QRs de validación
CREATE TABLE validation_qrs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL, -- URL del QR generado
  qr_data TEXT NOT NULL UNIQUE, -- Datos únicos del QR
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by TEXT, -- Quien validó el QR (organizador)
  validation_location TEXT -- Donde se validó
);

-- Tabla para logs de emails enviados
CREATE TABLE email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL, -- 'confirmation', 'reminder', etc.
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'failed', 'pending')) DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Índices para mejor rendimiento
CREATE INDEX idx_player_wallets_player_id ON player_wallets(player_id);
CREATE INDEX idx_player_wallets_address ON player_wallets(wallet_address);
CREATE INDEX idx_validation_qrs_player_id ON validation_qrs(player_id);
CREATE INDEX idx_validation_qrs_data ON validation_qrs(qr_data);
CREATE INDEX idx_validation_qrs_used ON validation_qrs(is_used);
CREATE INDEX idx_email_logs_player_id ON email_logs(player_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);

-- Políticas RLS
ALTER TABLE player_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_qrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (ajustar según necesidades)
CREATE POLICY "Players can view their own wallet" ON player_wallets FOR SELECT USING (true);
CREATE POLICY "Players can view their own QR" ON validation_qrs FOR SELECT USING (true);
CREATE POLICY "Email logs viewable by all" ON email_logs FOR SELECT USING (true);

-- Permitir inserción y actualización
CREATE POLICY "Allow wallet creation" ON player_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow QR creation" ON validation_qrs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow QR updates" ON validation_qrs FOR UPDATE USING (true);
CREATE POLICY "Allow email log creation" ON email_logs FOR INSERT WITH CHECK (true);
