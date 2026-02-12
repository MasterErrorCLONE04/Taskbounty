-- Fix Role Registration Trigger
-- This migration updates the handle_new_user trigger to respect the role 
-- passed in the auth metadata instead of hardcoding it to 'both'.

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
