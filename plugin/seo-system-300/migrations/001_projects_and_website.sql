-- SEO SYSTEM 300 projects + website orders
-- Prefix assumes default G5_TABLE_PREFIX=g5_
-- Runtime PHP uses G5_TABLE_PREFIX — do not run this on production from this branch.
-- Engine: InnoDB (plugin tables only) so submit can use transactions.
-- GNUBoard core tables remain MyISAM; no FOREIGN KEY (matches GNUBoard convention).

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `business_type` varchar(100) NOT NULL DEFAULT '',
  `purposes` text NOT NULL,
  `domain` varchar(255) NOT NULL DEFAULT '',
  `website_status` varchar(100) NOT NULL DEFAULT '',
  `domain_status` varchar(150) NOT NULL DEFAULT '',
  `primary_region` varchar(100) NOT NULL DEFAULT '',
  `impressions_goal` int(11) NOT NULL DEFAULT 0,
  `traffic_goal` int(11) NOT NULL DEFAULT 0,
  `content_goal` int(11) NOT NULL DEFAULT 0,
  `referring_domain_goal` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `progress` tinyint(4) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `mb_id` (`mb_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  KEY `mb_active` (`mb_id`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_project_keywords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `keyword` varchar(191) NOT NULL DEFAULT '',
  `priority` int(11) NOT NULL DEFAULT 0,
  `target` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_keyword` (`project_id`,`keyword`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `site_type` varchar(50) NOT NULL DEFAULT '',
  `purposes` text NOT NULL,
  `industry` varchar(100) NOT NULL DEFAULT '',
  `site_name` varchar(255) NOT NULL DEFAULT '',
  `brand_name` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `region` varchar(150) NOT NULL DEFAULT '',
  `business_description` text NOT NULL,
  `current_url` varchar(500) NOT NULL DEFAULT '',
  `design_style` varchar(80) NOT NULL DEFAULT '',
  `primary_color` varchar(30) NOT NULL DEFAULT '',
  `custom_color` varchar(30) NOT NULL DEFAULT '',
  `target_region` varchar(150) NOT NULL DEFAULT '',
  `status` varchar(40) NOT NULL DEFAULT 'draft',
  `progress` tinyint(4) NOT NULL DEFAULT 0,
  `is_draft` tinyint(1) NOT NULL DEFAULT 1,
  `wizard_step` varchar(20) NOT NULL DEFAULT 'intro',
  `submitted_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `mb_id` (`mb_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`),
  KEY `project_draft` (`project_id`,`is_draft`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `label` varchar(191) NOT NULL DEFAULT '',
  `slug` varchar(191) NOT NULL DEFAULT '',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `order_sort` (`order_id`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `feature_key` varchar(50) NOT NULL DEFAULT '',
  `feature_label` varchar(100) NOT NULL DEFAULT '',
  `is_ai_recommended` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_feature` (`order_id`,`feature_key`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_references` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `url` varchar(500) NOT NULL DEFAULT '',
  `memo` varchar(255) NOT NULL DEFAULT '',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `project_id` int(11) NOT NULL DEFAULT 0,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `category` varchar(40) NOT NULL DEFAULT 'other',
  `original_name` varchar(255) NOT NULL DEFAULT '',
  `stored_name` varchar(80) NOT NULL DEFAULT '',
  `file_path` varchar(255) NOT NULL DEFAULT '',
  `mime_type` varchar(100) NOT NULL DEFAULT '',
  `file_size` int(11) NOT NULL DEFAULT 0,
  `memo` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(20) NOT NULL DEFAULT 'uploaded',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `project_id` (`project_id`),
  KEY `mb_id` (`mb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_website_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `from_status` varchar(40) NOT NULL DEFAULT '',
  `to_status` varchar(40) NOT NULL DEFAULT '',
  `changed_by_mb_id` varchar(20) NOT NULL DEFAULT '',
  `changed_by_role` varchar(20) NOT NULL DEFAULT 'student',
  `memo` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
