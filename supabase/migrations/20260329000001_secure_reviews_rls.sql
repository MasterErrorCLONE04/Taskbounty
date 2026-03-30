-- ==========================================
-- Security Migration: Enforce RLS on Reviews
-- ==========================================

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT 
USING (true);

-- 2. Only reviewers can insert their own reviews
CREATE POLICY "Reviewers can insert own reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);
