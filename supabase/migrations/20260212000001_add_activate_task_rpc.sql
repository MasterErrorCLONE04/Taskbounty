-- Function to safely activate a task from a webhook bypassing RLS
-- This uses SECURITY DEFINER to run as the database owner
CREATE OR REPLACE FUNCTION public.activate_task_webhook(p_task_id UUID, p_payment_intent_id TEXT)
RETURNS void AS $$
BEGIN
  -- 1. Update payment status to HELD
  UPDATE public.payments
  SET status = 'HELD', updated_at = NOW()
  WHERE stripe_payment_intent_id = p_payment_intent_id
    AND task_id = p_task_id;

  -- 2. Update task status to OPEN
  UPDATE public.tasks
  SET status = 'OPEN', updated_at = NOW()
  WHERE id = p_task_id;

  -- 3. Log the state change (Optional but good for audit)
  -- We don't have the clientId easily here unless we pass it, 
  -- but we can infer it or just leave it for now.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
