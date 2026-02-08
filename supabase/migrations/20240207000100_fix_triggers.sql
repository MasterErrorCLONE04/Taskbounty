-- Fix User Synchronization Trigger
-- This script ensures that when a user signs up via Supabase Auth, 
-- a record is automatically created in the public.users table.

-- 1. Create the improved handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), 
    COALESCE(new.raw_user_meta_data->>'role', 'both')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach trigger to auth.users (requires specific permissions in Supabase)
-- Note: If running on a local Supabase, this works. On hosted, might need Dashboard.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Ensure public.balances trigger still exists and is correct
-- This one stays as is, triggered by public.users insertion.
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.balances (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_public_user_created ON public.users;
CREATE TRIGGER on_public_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_balance();
