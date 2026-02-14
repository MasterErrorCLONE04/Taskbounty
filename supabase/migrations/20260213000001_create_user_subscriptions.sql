-- Create user_subscriptions table to track multiple active plans
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'premium_plus')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(user_id, tier)
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Backfill existing plans from users table
INSERT INTO public.user_subscriptions (user_id, tier, expires_at)
SELECT id, plan, verified_until 
FROM public.users
WHERE plan IS NOT NULL AND verified_until > NOW()
ON CONFLICT (user_id, tier) DO UPDATE 
SET expires_at = EXCLUDED.expires_at;
