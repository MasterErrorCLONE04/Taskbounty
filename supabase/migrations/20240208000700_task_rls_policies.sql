-- Enable Row Level Security for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read OPEN tasks (for landing page and marketplace)
CREATE POLICY "Tasks are publicly readable when open"
ON public.tasks FOR SELECT
USING (status = 'OPEN' OR auth.uid() = client_id OR auth.uid() = assigned_worker_id);

-- Policy: Clients can insert their own tasks
CREATE POLICY "Clients can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Policy: Clients can update their own tasks
CREATE POLICY "Clients can update own tasks"
ON public.tasks FOR UPDATE
USING (auth.uid() = client_id);
