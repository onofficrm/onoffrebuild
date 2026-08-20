-- SEO SYSTEM 300 student notifications (in-app inbox)
-- REQUIRES 001_projects_and_website.sql first.
-- Prefix assumes G5_TABLE_PREFIX=g5_
-- No FOREIGN KEY (GNUBoard convention). Engine: InnoDB utf8.

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mb_id` varchar(20) NOT NULL DEFAULT '',
  `project_id` int(11) NOT NULL DEFAULT 0,
  `order_id` int(11) NOT NULL DEFAULT 0,
  `event_type` varchar(60) NOT NULL DEFAULT '',
  `title` varchar(191) NOT NULL DEFAULT '',
  `body` varchar(500) NOT NULL DEFAULT '',
  `action_tab` varchar(40) NOT NULL DEFAULT '',
  `action_sub_tab` varchar(40) NOT NULL DEFAULT '',
  `severity` varchar(20) NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `email_sent` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mb_created` (`mb_id`,`created_at`),
  KEY `mb_unread` (`mb_id`,`is_read`),
  KEY `project_id` (`project_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
