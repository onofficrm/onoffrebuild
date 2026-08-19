-- Rollback 002. Requires dropping child tables first. Do not run on production.

DROP TABLE IF EXISTS `g5_seosys300_admin_notes`;
DROP TABLE IF EXISTS `g5_seosys300_activities`;
DROP TABLE IF EXISTS `g5_seosys300_daily_missions`;
DROP TABLE IF EXISTS `g5_seosys300_task_results`;
DROP TABLE IF EXISTS `g5_seosys300_project_roadmap_tasks`;
DROP TABLE IF EXISTS `g5_seosys300_roadmap_tasks`;
DROP TABLE IF EXISTS `g5_seosys300_roadmap_steps`;
