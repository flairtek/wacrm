-- ============================================================
-- Migration 043: Add OpenRouter as supported AI provider.
--
-- Updates provider CHECK constraints on ai_configs and ai_usage_log
-- to accept 'openrouter' alongside 'openai' and 'anthropic'.
--
-- Idempotent — safe to run multiple times.
-- ============================================================

ALTER TABLE ai_configs
  DROP CONSTRAINT IF EXISTS ai_configs_provider_check;

ALTER TABLE ai_configs
  ADD CONSTRAINT ai_configs_provider_check
  CHECK (provider IN ('openai', 'anthropic', 'openrouter'));

ALTER TABLE IF EXISTS ai_usage_log
  DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;

ALTER TABLE IF EXISTS ai_usage_log
  ADD CONSTRAINT ai_usage_log_provider_check
  CHECK (provider IN ('openai', 'anthropic', 'openrouter'));
