-- Create the files table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER NOT NULL,
    type TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('deliverable', 'evidence', 'asset')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Policies for the files table
CREATE POLICY "Users can view files of tasks they are part of"
    ON public.files FOR SELECT
    USING (
        auth.uid() = uploader_id OR
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_id AND (t.client_id = auth.uid() OR t.assigned_worker_id = auth.uid())
        )
);

CREATE POLICY "Users can upload files to tasks they are part of"
    ON public.files FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_id AND (t.client_id = auth.uid() OR t.assigned_worker_id = auth.uid())
        )
);

CREATE POLICY "Users can delete their own files"
    ON public.files FOR DELETE
    USING (auth.uid() = uploader_id);

-- STORAGE CONFIGURATION
-- Note: Buckets are usually created via the Supabase Dashboard or API, 
-- but we can insert into storage.buckets if needed.
-- Policies for storage.objects are more common in migrations.

INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-files', 'task-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- We'll allow authenticated users to upload, but strictly limit SELECT to task participants.

CREATE POLICY "Authenticated users can upload task files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'task-files');

CREATE POLICY "Task participants can view task files"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'task-files' AND
    EXISTS (
        SELECT 1 FROM public.files f
        JOIN public.tasks t ON f.task_id = t.id
        WHERE f.path = name AND (t.client_id = auth.uid() OR t.assigned_worker_id = auth.uid() OR f.uploader_id = auth.uid())
    )
);

CREATE POLICY "Uploader can delete their own stored files"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'task-files' AND
    (SELECT auth.uid() = uploader_id FROM public.files WHERE path = name)
);
