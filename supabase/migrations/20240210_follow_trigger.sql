
-- Trigger to notify user when they get a new follower
CREATE OR REPLACE FUNCTION public.notify_on_new_follower()
RETURNS TRIGGER AS $$
DECLARE
    follower_name TEXT;
BEGIN
    -- Get follower name
    SELECT name INTO follower_name FROM public.users WHERE id = NEW.follower_id;
    
    -- Insert notification
    INSERT INTO public.notifications (user_id, type, title, message, link, read)
    VALUES (
        NEW.following_id,
        'follow',
        'New Follower',
        COALESCE(follower_name, 'Someone') || ' started following you',
        '/profile/' || NEW.follower_id,
        false
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_created ON public.follows;

CREATE TRIGGER on_follow_created
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_follower();
