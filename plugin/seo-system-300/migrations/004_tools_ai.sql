-- SEO SYSTEM 300 tool integrations + AI runs
-- REQUIRES 001 then 002 then 003_google_metrics.sql first.
-- Prefix assumes G5_TABLE_PREFIX=g5_
-- Do not run this on production from this branch.
-- No FOREIGN KEY. Engine: InnoDB utf8.
-- No content/backlink/traffic cache tables: no student-facing Read API discovered in this workspace.

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_tool_integrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `tool_key` varchar(40) NOT NULL DEFAULT '',
  `integration_level` varchar(30) NOT NULL DEFAULT 'NOT_CONFIGURED',
  `status` varchar(30) NOT NULL DEFAULT 'not_configured',
  `external_project_id` varchar(80) NOT NULL DEFAULT '',
  `external_domain` varchar(255) NOT NULL DEFAULT '',
  `external_account_id` varchar(80) NOT NULL DEFAULT '',
  `last_sync_at` datetime DEFAULT NULL,
  `last_success_at` datetime DEFAULT NULL,
  `last_error_code` varchar(40) NOT NULL DEFAULT '',
  `last_error_message` varchar(255) NOT NULL DEFAULT '',
  `config_json` mediumtext NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_tool` (`project_id`,`tool_key`),
  KEY `mb_id` (`mb_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_ai_runs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `run_type` varchar(30) NOT NULL DEFAULT 'analyze',
  `provider` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(80) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'failed',
  `input_tokens` int(11) DEFAULT NULL,
  `output_tokens` int(11) DEFAULT NULL,
  `estimated_cost` decimal(12,6) DEFAULT NULL,
  `error_code` varchar(40) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_created` (`project_id`,`created_at`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_ai_analysis_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `provider` varchar(40) NOT NULL DEFAULT '',
  `model` varchar(80) NOT NULL DEFAULT '',
  `data_as_of` datetime DEFAULT NULL,
  `analysis_json` mediumtext NOT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
