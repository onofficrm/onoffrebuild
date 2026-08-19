-- SEO SYSTEM 300 website order wizard extensions
-- REQUIRES 001_projects_and_website.sql first (and 002-004 if already applied).
-- Prefix assumes G5_TABLE_PREFIX=g5_
-- ALTER only. Do not DROP existing tables. Do not run on production from this branch.
--
-- order_no: product identifier assigned on submit from primary key (WEB-{year}-{id}).
-- Drafts keep NULL so UNIQUE does not collide on empty strings. MySQL UNIQUE allows
-- multiple NULLs. Submitted values are UNIQUE at the database.

SET NAMES utf8;

ALTER TABLE `g5_seosys300_website_orders`
  ADD COLUMN `order_no` varchar(32) NULL DEFAULT NULL AFTER `id`,
  ADD COLUMN `extra_json` mediumtext NULL AFTER `target_region`,
  ADD UNIQUE KEY `order_no` (`order_no`);

ALTER TABLE `g5_seosys300_website_orders`
  MODIFY `wizard_step` varchar(32) NOT NULL DEFAULT 'intro';

UPDATE `g5_seosys300_website_orders`
  SET extra_json = '{}'
  WHERE extra_json IS NULL OR extra_json = '';
