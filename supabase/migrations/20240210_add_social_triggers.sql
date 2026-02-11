
-- Trigger to notify followers when a task becomes OPEN
CREATE OR REPLACE FUNCTION public.notify_followers_on_new_task()
RETURNS TRIGGER AS $$
DECLARE
    poster_name TEXT;
BEGIN
  -- Only trigger when status becomes OPEN (from draft or insert)
  IF NEW.status = 'OPEN' AND (OLD.status IS NULL OR OLD.status != 'OPEN') THEN
    
    -- Get poster name
    SELECT name INTO poster_name FROM public.users WHERE id = NEW.client_id;
    
    -- Insert notifications for all followers
    INSERT INTO public.notifications (user_id, type, title, message, link, read)
    SELECT 
      f.follower_id,
      'bounty_posted',
      'New Bounty Posted',
      COALESCE(poster_name, 'Someone') || ' posted a new bounty: ' || NEW.title,
      '/tasks/' || NEW.id,
      false
    FROM public.follows f
    WHERE f.following_id = NEW.client_id;
    
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_task_published ON public.tasks;

CREATE TRIGGER on_task_published
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.notify_followers_on_new_task();
