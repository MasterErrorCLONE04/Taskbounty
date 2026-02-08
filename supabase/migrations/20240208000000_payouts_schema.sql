-- Payouts and Stripe Connect Integration Schema

-- 1. Add stripe_connect_id to users to link with Express accounts
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_connect_id VARCHAR(255);

-- 2. Create Withdrawals table to track fund transfers
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING' | 'COMPLETED' | 'FAILED'
  stripe_transfer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Add index for performance
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
