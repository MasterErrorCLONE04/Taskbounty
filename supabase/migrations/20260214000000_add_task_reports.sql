
-- Create task_reports table
CREATE TABLE IF NOT EXISTS public.task_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for task_reports
ALTER TABLE public.task_reports ENABLE ROW LEVEL SECURITY;

-- Policies for task_reports
CREATE POLICY "Users can create reports"
    ON public.task_reports
    FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports"
    ON public.task_reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create task_hides table
CREATE TABLE IF NOT EXISTS public.task_hides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(task_id, user_id)
);

-- Enable RLS for task_hides
ALTER TABLE public.task_hides ENABLE ROW LEVEL SECURITY;

-- Policies for task_hides
CREATE POLICY "Users can hide tasks"
    ON public.task_hides
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their hidden tasks"
    ON public.task_hides
    FOR SELECT
    USING (auth.uid() = user_id);
