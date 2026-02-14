-- Add plan column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan TEXT CHECK (plan IN ('basic', 'premium', 'premium_plus'));

-- Update existing verified users to 'premium' (optional default)
UPDATE public.users 
SET plan = 'premium' 
WHERE is_verified = true AND plan IS NULL;
