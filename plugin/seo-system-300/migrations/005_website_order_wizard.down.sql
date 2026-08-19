-- Rollback 005_website_order_wizard.sql. Does not DROP 001-004 tables.
-- Do not run on production from this branch.

SET NAMES utf8;

ALTER TABLE `g5_seosys300_website_orders`
  DROP KEY `order_no`;

ALTER TABLE `g5_seosys300_website_orders`
  DROP COLUMN `order_no`,
  DROP COLUMN `extra_json`;

ALTER TABLE `g5_seosys300_website_orders`
  MODIFY `wizard_step` varchar(20) NOT NULL DEFAULT 'intro';
