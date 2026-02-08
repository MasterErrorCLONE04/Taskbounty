-- Initial Schema for TaskBounty with Triggers

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'both', -- 'client' | 'worker' | 'both'
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Balances Table
CREATE TABLE IF NOT EXISTS balances (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  available_balance DECIMAL(10,2) DEFAULT 0,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to create balance for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.balances (user_id)
  VALUES (new.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  bounty_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  deadline TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  client_id UUID REFERENCES users(id) NOT NULL,
  assigned_worker_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  worker_id UUID REFERENCES users(id) NOT NULL,
  proposal_text TEXT NOT NULL,
  estimated_time VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  client_id UUID REFERENCES users(id) NOT NULL,
  worker_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED'
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) NOT NULL,
  opened_by UUID REFERENCES users(id) NOT NULL,
  reason TEXT NOT NULL,
  evidence TEXT,
  status VARCHAR(20) DEFAULT 'open', -- 'open' | 'resolved'
  resolution VARCHAR(20), -- 'release' | 'refund' | NULL
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Notifications Table (MVP)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- State Logs Table
CREATE TABLE IF NOT EXISTS state_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'task' | 'payment' | 'dispute'
  entity_id UUID NOT NULL,
  old_state VARCHAR(50),
  new_state VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
