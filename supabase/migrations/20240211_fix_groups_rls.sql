-- Fix infinite recursion in group_members RLS policy
-- Run this in SQL Editor

-- 1. Drop the problematic "ALL" policy
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;

-- 2. Create separate policies for modification actions (excluding SELECT)

-- Insert
CREATE POLICY "Group admins can insert members" ON public.group_members FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_id -- refers to the new row's group_id
    AND gm.user_id = auth.uid() 
    AND gm.role = 'admin'
  )
);

-- Update
CREATE POLICY "Group admins can update members" ON public.group_members FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.role = 'admin'
  )
);

-- Delete
CREATE POLICY "Group admins can delete members" ON public.group_members FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id 
    AND gm.user_id = auth.uid() 
    AND gm.role = 'admin'
  )
);
