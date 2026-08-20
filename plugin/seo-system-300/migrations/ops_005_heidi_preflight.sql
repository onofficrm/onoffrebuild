-- SEO SYSTEM 300 — Production Migration 005 HeidiSQL Preflight
-- Table name taken from migrations/005_website_order_wizard.sql
-- Run in HeidiSQL against the PRODUCTION database only.
-- Do NOT run Migration 005 until backup is confirmed and this preflight is reviewed.

SET NAMES utf8;

-- 1) Confirm you are on the intended database
SELECT DATABASE() AS current_database;

-- 2) Table must already exist (001 applied)
SHOW TABLES LIKE 'g5_seosys300_website_orders';

-- 3) Current table definition
SHOW CREATE TABLE `g5_seosys300_website_orders`;

-- 4) Target columns — empty result means column is missing (expected before 005)
SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'order_no';
SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'extra_json';
SHOW COLUMNS FROM `g5_seosys300_website_orders` LIKE 'wizard_step';

-- 5) Index named `order_no` — empty means no collision risk for ADD UNIQUE KEY `order_no`
SHOW INDEX FROM `g5_seosys300_website_orders` WHERE Key_name = 'order_no';

-- 6) Row counts / data safety
SELECT COUNT(*) AS website_orders_count FROM `g5_seosys300_website_orders`;

-- Only meaningful AFTER order_no exists; before 005 this should ERROR with Unknown column
-- Keep commented until postflight / or after ADD COLUMN:
-- SELECT order_no, COUNT(*) c FROM `g5_seosys300_website_orders` WHERE order_no IS NOT NULL AND order_no <> '' GROUP BY order_no HAVING c > 1;

-- wizard_step length / nullability snapshot
SELECT
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE,
  COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'g5_seosys300_website_orders'
  AND COLUMN_NAME IN ('order_no', 'extra_json', 'wizard_step', 'id', 'target_region');

-- 7) Related SEO SYSTEM table presence (read-only)
SHOW TABLES LIKE 'g5_seosys300_%';

-- 8) Optional history table (skip if missing)
-- SHOW TABLES LIKE 'g5_seosys300_migrations';
-- SELECT * FROM `g5_seosys300_migrations` ORDER BY applied_at DESC LIMIT 20;
