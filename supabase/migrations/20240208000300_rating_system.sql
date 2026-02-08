-- Functional Rating System
-- This migration adds a reviews table and a trigger to update user rating averages

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create index for faster summary queries
CREATE INDEX IF NOT EXISTS idx_reviews_target_id ON public.reviews(target_id);

-- 3. Function to update user rating average
CREATE OR REPLACE FUNCTION public.update_user_rating_avg()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new average for the target user
  UPDATE public.users
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews
    WHERE target_id = NEW.target_id
  )
  WHERE id = NEW.target_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Attach trigger
DROP TRIGGER IF EXISTS on_review_submitted ON public.reviews;
CREATE TRIGGER on_review_submitted
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rating_avg();
