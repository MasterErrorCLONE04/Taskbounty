-- Add category column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Add a comment to documented allowed categories (informational)
COMMENT ON COLUMN public.tasks.category IS 'Categories: Diseño, Código, Content, Video, General';
