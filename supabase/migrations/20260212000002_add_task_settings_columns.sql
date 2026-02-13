-- Add visibility and submission preference columns to tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_late_submissions BOOLEAN DEFAULT false;
