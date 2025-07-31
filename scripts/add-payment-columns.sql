-- Add payment related columns to players table if they don't exist
DO $$
BEGIN
    -- Check if amount_paid column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'players' AND column_name = 'amount_paid') THEN
        ALTER TABLE players ADD COLUMN amount_paid DECIMAL(10,2);
    END IF;

    -- Check if payment_method column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'players' AND column_name = 'payment_method') THEN
        ALTER TABLE players ADD COLUMN payment_method VARCHAR(50);
    END IF;

    -- Check if payment_notes column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'players' AND column_name = 'payment_notes') THEN
        ALTER TABLE players ADD COLUMN payment_notes TEXT;
    END IF;

    -- Check if payment_status column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'players' AND column_name = 'payment_status') THEN
        ALTER TABLE players ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
    END IF;

    -- Check if payment_updated_at column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'players' AND column_name = 'payment_updated_at') THEN
        ALTER TABLE players ADD COLUMN payment_updated_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Create index on player_id for faster lookups
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_players_id') THEN
        CREATE INDEX idx_players_id ON players(id);
    END IF;

    -- Create index on payment_status for faster filtering
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_players_payment_status') THEN
        CREATE INDEX idx_players_payment_status ON players(payment_status);
    END IF;

    -- Update payment status based on amount_paid
    UPDATE players 
    SET payment_status = 'verified' 
    WHERE amount_paid IS NOT NULL AND amount_paid > 0 AND payment_status = 'pending';

    -- Set default values for existing records
    UPDATE players 
    SET amount_paid = 0 
    WHERE amount_paid IS NULL;
END $$;

-- Add comment to columns for better documentation
COMMENT ON COLUMN players.amount_paid IS 'Amount paid by the player in their local currency (CRC or USD)';
COMMENT ON COLUMN players.payment_method IS 'Method used for payment (transfer, cash, card, etc)';
COMMENT ON COLUMN players.payment_notes IS 'Additional notes about the payment';
COMMENT ON COLUMN players.payment_status IS 'Current payment status (pending, verified, partial)';
COMMENT ON COLUMN players.payment_updated_at IS 'Timestamp of the last payment update';
