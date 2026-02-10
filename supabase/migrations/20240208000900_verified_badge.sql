-- Add verification fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_until TIMESTAMP WITH TIME ZONE;

-- Create index for faster filtering of verified freelancers
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON public.users(is_verified) WHERE is_verified = true;

-- Helper to check if a user is currently verified
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
