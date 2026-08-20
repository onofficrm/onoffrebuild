-- SEO SYSTEM 300 — Production Migration 005 HeidiSQL Postflight
-- Run AFTER migrations/005_website_order_wizard.sql succeeds.
-- Do not run .down.sql unless restoring from a verified backup decision.

SET NAMES utf8;

SELECT DATABASE() AS current_database;

SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'order_no';
-- Expect: Field=order_no, Type=varchar(32), Null=YES, Key=UNI, Default=NULL

SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'extra_json';
-- Expect: Field=extra_json, Type=mediumtext, Null=YES

SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'wizard_step';
-- Expect: Type=varchar(32), Null=NO, Default=intro

SHOW INDEX FROM `g5_seosys300_website_orders` WHERE Key_name = 'order_no';
-- Expect: Non_unique=0 (UNIQUE), Column_name=order_no

SELECT COUNT(*) AS website_orders_count_after FROM `g5_seosys300_website_orders`;

SELECT
  SUM(CASE WHEN extra_json IS NULL OR extra_json = '' THEN 1 ELSE 0 END) AS empty_extra_json,
  SUM(CASE WHEN extra_json = '{}' THEN 1 ELSE 0 END) AS empty_object_extra_json,
  SUM(CASE WHEN order_no IS NULL THEN 1 ELSE 0 END) AS null_order_no,
  SUM(CASE WHEN order_no IS NOT NULL AND order_no <> '' THEN 1 ELSE 0 END) AS set_order_no
FROM `g5_seosys300_website_orders`;

-- Duplicate product order numbers must be zero
SELECT order_no, COUNT(*) AS c
FROM `g5_seosys300_website_orders`
WHERE order_no IS NOT NULL AND order_no <> ''
GROUP BY order_no
HAVING c > 1;

SELECT
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'g5_seosys300_website_orders'
  AND COLUMN_NAME IN ('order_no', 'extra_json', 'wizard_step');

-- Optional: record history (checksum of 005_website_order_wizard.sql)
-- sha256: 2be5d7c7cef87de59e96862fa874cffa2c1f10b042312cea8769875dd42caa8b
-- INSERT INTO `g5_seosys300_migrations` (`migration`, `applied_at`, `checksum`)
-- VALUES ('005_website_order_wizard.sql', NOW(), '2be5d7c7cef87de59e96862fa874cffa2c1f10b042312cea8769875dd42caa8b');
