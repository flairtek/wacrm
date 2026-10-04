-- ============================================================
-- 044_realtime_replica_identity
--
-- Set REPLICA IDENTITY FULL on tables subscribed via Supabase Realtime
-- (messages, conversations, message_reactions, member_presence, flow_runs)
-- and ensure they are enrolled in the supabase_realtime publication.
--
-- Background:
-- When Row Level Security (RLS) is enabled or when client channels use
-- column filters (e.g. filter: 'conversation_id=eq...'), Supabase
-- Realtime requires REPLICA IDENTITY FULL to evaluate RLS policies and
-- column filters on UPDATE and DELETE events. Without REPLICA IDENTITY
-- FULL, PostgreSQL logical replication WAL records only contain the
-- primary key, causing Supabase Realtime to drop UPDATE events (such as
-- message status changes to delivered/read/failed, unread count increments,
-- last message text updates, and reactions).
--
-- Idempotent — safe to run multiple times.
-- ============================================================

ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER TABLE message_reactions REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS member_presence REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS flow_runs REPLICA IDENTITY FULL;

-- Ensure all realtime tables are in the supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'message_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'member_presence'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE member_presence;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'flow_runs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE flow_runs;
  END IF;
END $$;
