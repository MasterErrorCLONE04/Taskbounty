-- ==========================================
-- Security Migration: Enforce Strict RLS
-- ==========================================

-- Enable Row Level Security (RLS) on previously unprotected sensitive tables
ALTER TABLE public.balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_logs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- 1. Balances Policies
-- --------------------------------------------------------
-- Users can only view their own balance. 
-- Modifications (INSERT, UPDATE, DELETE) are exclusively allowed to `service_role` (backend).
CREATE POLICY "Users can view own balances" 
ON public.balances FOR SELECT 
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- 2. Payments Policies
-- --------------------------------------------------------
-- Task participants (Client or Assigned Worker) can view payments.
CREATE POLICY "Participants can view their payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = worker_id);

-- --------------------------------------------------------
-- 3. Withdrawals Policies
-- --------------------------------------------------------
-- Users can view their own withdrawal history.
CREATE POLICY "Users can view own withdrawals" 
ON public.withdrawals FOR SELECT 
USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- 4. Applications Policies
-- --------------------------------------------------------
-- A. Workers can view the applications they submitted.
CREATE POLICY "Workers can view own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = worker_id);

-- B. Clients can view applications submitted for tasks they own.
CREATE POLICY "Clients can view task applications" 
ON public.applications FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND client_id = auth.uid()));

-- C. Workers can submit new applications representing themselves.
CREATE POLICY "Workers can insert own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = worker_id);

-- D. Clients can update application statuses (e.g., accept/reject) for their tasks.
CREATE POLICY "Clients can update applications" 
ON public.applications FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND client_id = auth.uid()));

-- --------------------------------------------------------
-- 5. Disputes Policies
-- --------------------------------------------------------
-- Participants (Client or Assigned Worker) can view disputes on their tasks.
CREATE POLICY "Participants can view task disputes" 
ON public.disputes FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND (client_id = auth.uid() OR assigned_worker_id = auth.uid())));

-- Participants can open new disputes as themselves.
CREATE POLICY "Participants can insert disputes" 
ON public.disputes FOR INSERT 
WITH CHECK (auth.uid() = opened_by);

-- --------------------------------------------------------
-- 6. Messages (Task Work Room) Policies
-- --------------------------------------------------------
-- Participants can view messages belonging to their assigned task rooms.
CREATE POLICY "Participants can view task messages" 
ON public.messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_id AND (client_id = auth.uid() OR assigned_worker_id = auth.uid())));

-- Participants can send messages impersonating only themselves.
CREATE POLICY "Participants can insert task messages" 
ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- --------------------------------------------------------
-- 7. State Logs Policies
-- --------------------------------------------------------
-- Users can view logs tied specifically to them.
CREATE POLICY "Users can view their state logs" 
ON public.state_logs FOR SELECT 
USING (user_id = auth.uid());
