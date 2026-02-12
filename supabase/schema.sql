-- ==========================================
-- TaskBounty Unified Database Schema
-- Consolidates all migrations + Social Features + Unified Roles
-- ==========================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table (Unified Roles & Profile Info)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'both', -- 'client' | 'worker' | 'both' (Transitioning to 'both' only)
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  stripe_connect_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  verified_until TIMESTAMP WITH TIME ZONE,
  location TEXT,
  website TEXT,
  banner_url TEXT,
  certifications JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Balances Table
CREATE TABLE IF NOT EXISTS public.balances (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  available_balance DECIMAL(10,2) DEFAULT 0,
  pending_balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tasks Table (Bounties)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  bounty_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  category TEXT DEFAULT 'General',
  media_urls TEXT[] DEFAULT '{}',
  client_id UUID REFERENCES public.users(id) NOT NULL,
  assigned_worker_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
COMMENT ON COLUMN public.tasks.category IS 'Categories: Diseño, Código, Content, Video, General';

-- 4. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  proposal_text TEXT NOT NULL,
  estimated_time VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted' | 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  client_id UUID REFERENCES public.users(id) NOT NULL,
  worker_id UUID REFERENCES public.users(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED'
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Withdrawals Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING' | 'COMPLETED' | 'FAILED'
  stripe_transfer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) NOT NULL,
  opened_by UUID REFERENCES public.users(id) NOT NULL,
  reason TEXT NOT NULL,
  evidence TEXT,
  status VARCHAR(20) DEFAULT 'open', -- 'open' | 'resolved'
  resolution VARCHAR(20), -- 'release' | 'refund' | NULL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 9. Reviews System
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Social Features
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.likes (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (task_id, user_id)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Files Table (for tasks)
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER NOT NULL,
    type TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('deliverable', 'evidence', 'asset')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. State Logs
CREATE TABLE IF NOT EXISTS public.state_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'task' | 'payment' | 'dispute'
  entity_id UUID NOT NULL,
  old_state VARCHAR(50),
  new_state VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES public.users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- A. Auth to Public User Sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), 
    COALESCE(new.raw_user_meta_data->>'role', 'both') -- Use role from metadata or default to both
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = COALESCE(new.raw_user_meta_data->>'role', EXCLUDED.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. User to Balance Sync
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.balances (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_public_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_balance();

-- C. Auto confirm users (Dev only toggle)
CREATE OR REPLACE FUNCTION public.auto_confirm_user_fn()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  NEW.last_sign_in_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user_fn();

-- D. Rating Average Update
CREATE OR REPLACE FUNCTION public.update_user_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews
    WHERE target_id = NEW.target_id
  )
  WHERE id = NEW.target_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_submitted
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rating_avg();

-- E. Balance Deduction RPC
CREATE OR REPLACE FUNCTION public.deduct_balance(p_user_id UUID, p_amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE public.balances
  SET available_balance = available_balance - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id
  AND available_balance >= p_amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Saldo insuficiente o usuario no encontrado.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- F. Verification Helper
CREATE OR REPLACE FUNCTION public.is_user_verified(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = p_user_id
    AND is_verified = true
    AND (verified_until IS NULL OR verified_until > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target_id ON public.reviews(target_id);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON public.users(is_verified) WHERE is_verified = true;

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Profiles: Public
CREATE POLICY "Profiles are public" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Tasks: Public if open, owner/assigned can see all
CREATE POLICY "Tasks are publicly readable when open" ON public.tasks FOR SELECT
USING (status = 'OPEN' OR auth.uid() = client_id OR auth.uid() = assigned_worker_id);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = client_id);

-- Social Features: Public Select, Authenticated Actions
CREATE POLICY "Follows are public" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow/unfollow" ON public.follows FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Comments are public" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can comment" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Likes are public" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Users can like/unlike" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Files Security
CREATE POLICY "Users can view files of tasks they are part of" ON public.files FOR SELECT
USING (auth.uid() = uploader_id OR EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND (t.client_id = auth.uid() OR t.assigned_worker_id = auth.uid())));
CREATE POLICY "Users can upload files to tasks they are part of" ON public.files FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND (t.client_id = auth.uid() OR t.assigned_worker_id = auth.uid())));

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('task-files', 'task-files', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('bounty-media', 'bounty-media', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Simplified)
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('task-files', 'avatars', 'bounty-media'));
CREATE POLICY "Public can view avatars/media" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'bounty-media'));
