-- Enable Realtime for Messaging Tables
-- Run this in your Supabase Dashboard -> SQL Editor

begin;
  -- Add tables to the publication
  alter publication supabase_realtime add table direct_messages;
  alter publication supabase_realtime add table conversations;
commit;
