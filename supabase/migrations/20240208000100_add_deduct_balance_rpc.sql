-- RPC Function for Atomic Balance Deduction

CREATE OR REPLACE FUNCTION public.deduct_balance(p_user_id UUID, p_amount DECIMAL)
RETURNS void AS $$
BEGIN
  -- We use a transaction (implicit in RPC) and row-level locking
  UPDATE public.balances
  SET available_balance = available_balance - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id
  AND available_balance >= p_amount;

  -- Ensure exactly one row was updated (if not, balance was insufficient)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Saldo insuficiente o usuario no encontrado.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
