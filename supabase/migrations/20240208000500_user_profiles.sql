-- Add professional profile fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public profile info of other users 
-- (Excluding sensitive info like exact balance which is in another table)
CREATE POLICY "Profiles are public" 
ON public.users FOR SELECT 
USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Note: We already have a trigger for balance creation. 
-- We might want to add a trigger to ensure privacy but usually, 
-- we handle column visibility in the API/Select layer.
