-- Rollback 003. Do not run on production.
-- Drop metrics tables before connections.

DROP TABLE IF EXISTS `g5_seosys300_sync_runs`;
DROP TABLE IF EXISTS `g5_seosys300_ga4_daily`;
DROP TABLE IF EXISTS `g5_seosys300_gsc_pages`;
DROP TABLE IF EXISTS `g5_seosys300_gsc_queries`;
DROP TABLE IF EXISTS `g5_seosys300_gsc_daily`;
DROP TABLE IF EXISTS `g5_seosys300_project_integrations`;
DROP TABLE IF EXISTS `g5_seosys300_google_connections`;
