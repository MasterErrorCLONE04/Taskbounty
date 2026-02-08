-- Improved Workaround to bypass email confirmation during development
-- This trigger sets confirmation dates directly on the NEW record BEFORE it is saved.

CREATE OR REPLACE FUNCTION public.auto_confirm_user_fn()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  NEW.last_sign_in_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use BEFORE INSERT to avoid updating the table during or after insertion
DROP TRIGGER IF EXISTS on_auth_user_created_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user_fn();

-- Note: This only works for NEW users. 
-- For existing users, you must manually confirm them in the Supabase Dashboard.
