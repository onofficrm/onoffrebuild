-- SEO SYSTEM 300 Google OAuth / GSC / GA4 metrics
-- REQUIRES 001_projects_and_website.sql then 002_roadmap_missions_activity_admin.sql first.
-- Prefix assumes G5_TABLE_PREFIX=g5_
-- Do not run this on production from this branch.
-- No FOREIGN KEY (GNUBoard / 001-002 convention). Engine: InnoDB utf8.

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_google_connections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `google_account_id` varchar(80) NOT NULL DEFAULT '',
  `google_email` varchar(191) NOT NULL DEFAULT '',
  `access_token_encrypted` text NOT NULL,
  `refresh_token_encrypted` text NOT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `scopes` varchar(500) NOT NULL DEFAULT '',
  `status` varchar(30) NOT NULL DEFAULT 'disconnected',
  `connected_at` datetime DEFAULT NULL,
  `last_refresh_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mb_id` (`mb_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_project_integrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `provider` varchar(40) NOT NULL DEFAULT '',
  `connection_id` int(11) NOT NULL DEFAULT 0,
  `external_property_id` varchar(255) NOT NULL DEFAULT '',
  `external_property_name` varchar(191) NOT NULL DEFAULT '',
  `external_property_url` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(30) NOT NULL DEFAULT 'inactive',
  `last_sync_at` datetime DEFAULT NULL,
  `last_success_at` datetime DEFAULT NULL,
  `last_error_code` varchar(40) NOT NULL DEFAULT '',
  `last_error_message` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_provider` (`project_id`,`provider`),
  KEY `mb_id` (`mb_id`),
  KEY `connection_id` (`connection_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_gsc_daily` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `metric_date` date NOT NULL,
  `clicks` int(11) NOT NULL DEFAULT 0,
  `impressions` int(11) NOT NULL DEFAULT 0,
  `ctr` decimal(10,6) NOT NULL DEFAULT 0.000000,
  `position` decimal(10,4) NOT NULL DEFAULT 0.0000,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_date` (`project_id`,`metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_gsc_queries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `metric_date` date NOT NULL,
  `query` varchar(191) NOT NULL DEFAULT '',
  `clicks` int(11) NOT NULL DEFAULT 0,
  `impressions` int(11) NOT NULL DEFAULT 0,
  `ctr` decimal(10,6) NOT NULL DEFAULT 0.000000,
  `position` decimal(10,4) NOT NULL DEFAULT 0.0000,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_date_query` (`project_id`,`metric_date`,`query`),
  KEY `project_date` (`project_id`,`metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_gsc_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `metric_date` date NOT NULL,
  `page` varchar(255) NOT NULL DEFAULT '',
  `clicks` int(11) NOT NULL DEFAULT 0,
  `impressions` int(11) NOT NULL DEFAULT 0,
  `ctr` decimal(10,6) NOT NULL DEFAULT 0.000000,
  `position` decimal(10,4) NOT NULL DEFAULT 0.0000,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_date_page` (`project_id`,`metric_date`,`page`),
  KEY `project_date` (`project_id`,`metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_ga4_daily` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `metric_date` date NOT NULL,
  `active_users` int(11) NOT NULL DEFAULT 0,
  `sessions` int(11) NOT NULL DEFAULT 0,
  `organic_sessions` int(11) NOT NULL DEFAULT 0,
  `engaged_sessions` int(11) NOT NULL DEFAULT 0,
  `page_views` int(11) NOT NULL DEFAULT 0,
  `engagement_rate` decimal(10,6) NOT NULL DEFAULT 0.000000,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_date` (`project_id`,`metric_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_sync_runs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `provider` varchar(40) NOT NULL DEFAULT '',
  `sync_type` varchar(30) NOT NULL DEFAULT 'manual',
  `date_from` date DEFAULT NULL,
  `date_to` date DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'running',
  `rows_received` int(11) NOT NULL DEFAULT 0,
  `started_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `finished_at` datetime DEFAULT NULL,
  `error_code` varchar(40) NOT NULL DEFAULT '',
  `error_message` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_provider_started` (`project_id`,`provider`,`started_at`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
