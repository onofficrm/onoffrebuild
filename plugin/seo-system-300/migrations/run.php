<?php
/**
 * SEO SYSTEM 300 migration runner (CLI).
 *
 * Development:
 *   SEOSYS300_ENV=development
 *   SEOSYS300_ALLOW_MIGRATION=1
 *   SEOSYS300_E2E_CONFIRM=dev-only
 *   SEOSYS300_DB_ALLOWLIST=<exact G5_MYSQL_DB>
 *   Host must be Docker service `db` and DB must be seosys300_dev or seosys300_rehearsal.
 *
 * Production (explicit path only; never disguise as development):
 *   SEOSYS300_ENV=production
 *   SEOSYS300_ALLOW_MIGRATION=1          (required for --apply)
 *   SEOSYS300_DB_ALLOWLIST=<exact DB>
 *   SEOSYS300_DB_HOST_ALLOWLIST=<exact host>
 *   SEOSYS300_BACKUP_CONFIRMED=1         (required for --apply)
 *   SEOSYS300_PRODUCTION_CONFIRM=SEO-SYSTEM-300-PRODUCTION
 *   php run.php --apply --confirm-production=SEO-SYSTEM-300-PRODUCTION
 *
 * Usage:
 *   php plugin/seo-system-300/migrations/run.php --status
 *   php plugin/seo-system-300/migrations/run.php --apply
 *   php plugin/seo-system-300/migrations/run.php --apply --confirm-production=SEO-SYSTEM-300-PRODUCTION
 *
 * This file is not invoked by GitHub Actions.
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

$plugin = realpath(dirname(__FILE__) . '/..');
$root = realpath(dirname(__FILE__) . '/../../..');
require_once $plugin . '/lib/env_guard.lib.php';

$apply = in_array('--apply', $argv, true);
$intent = $apply ? 'apply' : 'status';
$cliConfirm = seosys300_cli_flag_value($argv, '--confirm-production');
$envName = trim((string) getenv('SEOSYS300_ENV'));
$isProd = ($envName === 'production');

$opts = array(
    'migration' => true,
    'e2e' => false,
    'intent' => $intent,
    'cli_production_confirm' => $cliConfirm,
);
$check = seosys300_cli_safety_check($opts);
if (!$check['ok']) {
    fwrite(STDERR, "REFUSED [{$check['code']}] {$check['message']}\n");
    fwrite(STDERR, "Migration not executed.\n");
    exit(2);
}

$dbconfig = $root . '/data/dbconfig.php';
$dbconfigLocal = $root . '/data/dbconfig.local.php';
if (!is_file($dbconfig) && !is_file($dbconfigLocal)) {
    fwrite(STDERR, "DBCONFIG_MISSING: data/dbconfig.php is missing. Cannot prove DB isolation. NOT RUN.\n");
    exit(3);
}

seosys300_cli_prepare_server();
$chdir = getcwd();
chdir($root);
include_once $root . '/common.php';
chdir($chdir);

$check2 = seosys300_cli_safety_check(array(
    'migration' => true,
    'intent' => $intent,
    'require_mysql' => true,
    'cli_production_confirm' => $cliConfirm,
    'mysql_host' => defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '',
    'mysql_db' => defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '',
));
if (!$check2['ok']) {
    fwrite(STDERR, "REFUSED after GNUBoard bootstrap [{$check2['code']}] {$check2['message']}\n");
    exit(4);
}

$prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
$migTable = $prefix . 'seosys300_migrations';
$mysqlHost = defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '';
$mysqlDb = defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '';

function seosys300_runner_query($sql)
{
    $res = sql_query($sql, false);
    return $res;
}

function seosys300_runner_table_exists($table)
{
    $esc = addslashes($table);
    $row = sql_fetch("SHOW TABLES LIKE '{$esc}'");
    return !empty($row);
}

$createSql = "CREATE TABLE IF NOT EXISTS `{$migTable}` (
  `migration` varchar(80) NOT NULL DEFAULT '',
  `applied_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `checksum` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`migration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8";

if ($isProd && !$apply) {
    echo "Production --status is read-only: history table is not created if missing.\n";
} else {
    if (!seosys300_runner_query($createSql)) {
        fwrite(STDERR, "Failed to ensure migrations table.\n");
        exit(5);
    }
}

$applied = array();
if (seosys300_runner_table_exists($migTable)) {
    $res = seosys300_runner_query("SELECT migration, applied_at, checksum FROM `{$migTable}`");
    if ($res) {
        while ($row = sql_fetch_array($res)) {
            $applied[$row['migration']] = $row;
        }
    }
}

$dir = dirname(__FILE__);
$files = seosys300_ordered_migrations();

echo "Migration status (prefix={$prefix})\n";
$pending = array();
foreach ($files as $file) {
    $path = $dir . '/' . $file;
    $sum = seosys300_migration_checksum($path);
    $isApplied = isset($applied[$file]);
    $mark = $isApplied ? 'APPLIED' : 'PENDING';
    echo "  {$mark}  {$file}\n";
    if (!$isApplied) {
        $pending[] = array('file' => $file, 'path' => $path, 'checksum' => $sum);
    } elseif ($applied[$file]['checksum'] !== '' && $applied[$file]['checksum'] !== $sum) {
        fwrite(STDERR, "CHECKSUM_MISMATCH for {$file}. Refusing to continue.\n");
        exit(6);
    }
}

if (!$apply) {
    echo $pending ? count($pending) . " pending.\n" : "All listed migrations are recorded as applied.\n";
    exit(0);
}

echo "ENV: {$envName}\n";
echo "HOST: {$mysqlHost}\n";
echo "DB: {$mysqlDb}\n";
echo "PREFIX: {$prefix}\n";
echo "PENDING:\n";
if (!$pending) {
    echo "  (none)\n";
    echo "Nothing to apply.\n";
    exit(0);
}
foreach ($pending as $item) {
    echo "  {$item['file']}\n";
}

if ($isProd) {
    echo "Production apply: checksums recorded only after each file succeeds. No automatic DOWN.\n";
} else {
    echo "Backup reminder: dump the isolated development database before applying. See docs/production-migration-plan.md\n";
}

foreach ($pending as $item) {
    echo "Applying {$item['file']} ...\n";
    $sql = file_get_contents($item['path']);
    if ($sql === false || $sql === '') {
        fwrite(STDERR, "Empty migration {$item['file']}\n");
        exit(7);
    }
    $chunks = seosys300_split_sql_statements($sql);
    foreach ($chunks as $chunk) {
        if (!seosys300_runner_query($chunk)) {
            fwrite(STDERR, "FAILED on {$item['file']}. Stopped. Later files were not applied. History is written only after success. No automatic DOWN.\n");
            exit(8);
        }
    }
    $now = date('Y-m-d H:i:s');
    $fileEsc = addslashes($item['file']);
    $sumEsc = addslashes($item['checksum']);
    if (!seosys300_runner_query("INSERT INTO `{$migTable}` SET migration='{$fileEsc}', applied_at='{$now}', checksum='{$sumEsc}'")) {
        fwrite(STDERR, "FAILED recording history for {$item['file']}. Stopped. Later files were not applied.\n");
        exit(8);
    }
    echo "  OK {$item['file']}\n";
}

echo "Done.\n";
exit(0);
