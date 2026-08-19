-- Rollback 004_tools_ai.sql. Requires 001-003 already applied if restoring those tables.
-- Do not run on production from this branch.

SET NAMES utf8;

DROP TABLE IF EXISTS `g5_seosys300_ai_analysis_cache`;
DROP TABLE IF EXISTS `g5_seosys300_ai_runs`;
DROP TABLE IF EXISTS `g5_seosys300_tool_integrations`;
