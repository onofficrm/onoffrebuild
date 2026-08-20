-- Ops only: record 001–005 after a manual HeidiSQL / phpMyAdmin apply.
-- NOT part of seosys300_ordered_migrations(); the CLI runner never auto-runs this file.
-- Prefix assumes G5_TABLE_PREFIX=g5_. Adjust table name if prefix differs.
-- Checksums must match hash_file('sha256') of each UP SQL in this repo (2161b81+).

SET NAMES utf8;

CREATE TABLE IF NOT EXISTS `g5_seosys300_migrations` (
  `migration` varchar(80) NOT NULL DEFAULT '',
  `applied_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `checksum` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`migration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `g5_seosys300_migrations` (`migration`, `applied_at`, `checksum`) VALUES
('001_projects_and_website.sql', NOW(), 'e525f63f14a30d7ee763fe03788aeb8edf8c4b725602fbcf91621f4dbbc8799f'),
('002_roadmap_missions_activity_admin.sql', NOW(), 'f77b8f954a279677dae1f6cc18121df81254a98ce73c58ace34e94638d425432'),
('003_google_metrics.sql', NOW(), 'dbfea2936c48ceb0d2d54a6f28b6123ea6abc470421c84528c4b51630e0adae7'),
('004_tools_ai.sql', NOW(), '14737f0125be9d04b5b2fc284eae44c7ae53c62dee778e4d23644c225221825a'),
('005_website_order_wizard.sql', NOW(), '2be5d7c7cef87de59e96862fa874cffa2c1f10b042312cea8769875dd42caa8b')
ON DUPLICATE KEY UPDATE
  `checksum` = VALUES(`checksum`),
  `applied_at` = VALUES(`applied_at`);
