-- Allow users to join and leave groups
-- Run this in SQL Editor

-- Policy to allow users to join (insert themselves)
CREATE POLICY "Authenticated users can join groups" ON public.group_members FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Policy to allow users to leave (delete themselves)
CREATE POLICY "Authenticated users can leave groups" ON public.group_members FOR DELETE USING (
  auth.uid() = user_id
);
