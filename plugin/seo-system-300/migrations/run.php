<?php
/**
 * SEO SYSTEM 300 migration runner (CLI).
 *
 * Does not run unless ALL of:
 *   SEOSYS300_ENV=development
 *   SEOSYS300_ALLOW_MIGRATION=1
 *   SEOSYS300_E2E_CONFIRM=dev-only
 *   SEOSYS300_DB_ALLOWLIST=<exact G5_MYSQL_DB name>
 * and host is not production, MySQL host is local, php_sapi=cli.
 *
 * Usage:
 *   php plugin/seo-system-300/migrations/run.php --status
 *   php plugin/seo-system-300/migrations/run.php --apply
 *
 * Never run against production. This file is not invoked by GitHub Actions.
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

$plugin = realpath(dirname(__FILE__) . '/..');
$root = realpath(dirname(__FILE__) . '/../../..');
require_once $plugin . '/lib/env_guard.lib.php';

$apply = in_array('--apply', $argv, true);

$opts = array('migration' => true, 'e2e' => false);
$check = seosys300_cli_safety_check($opts);
if (!$check['ok']) {
    fwrite(STDERR, "REFUSED [{$check['code']}] {$check['message']}\n");
    fwrite(STDERR, "DEVELOPMENT_DB_NOT_AVAILABLE or production guard. Migration not executed.\n");
    exit(2);
}

$dbconfig = $root . '/data/dbconfig.php';
$dbconfigLocal = $root . '/data/dbconfig.local.php';
if (!is_file($dbconfig) && !is_file($dbconfigLocal)) {
    fwrite(STDERR, "DEVELOPMENT_DB_NOT_AVAILABLE: data/dbconfig.php is missing. Cannot prove DB isolation. NOT RUN.\n");
    exit(3);
}

seosys300_cli_prepare_server();
$chdir = getcwd();
chdir($root);
include_once $root . '/common.php';
chdir($chdir);

$check2 = seosys300_cli_safety_check(array(
    'migration' => true,
    'mysql_host' => defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '',
    'mysql_db' => defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '',
));
if (!$check2['ok']) {
    fwrite(STDERR, "REFUSED after GNUBoard bootstrap [{$check2['code']}] {$check2['message']}\n");
    exit(4);
}

$prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
$migTable = $prefix . 'seosys300_migrations';

function seosys300_runner_query($sql)
{
    $res = sql_query($sql, false);
    return $res;
}

$createSql = "CREATE TABLE IF NOT EXISTS `{$migTable}` (
  `migration` varchar(80) NOT NULL DEFAULT '',
  `applied_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `checksum` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`migration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8";
if (!seosys300_runner_query($createSql)) {
    fwrite(STDERR, "Failed to ensure migrations table.\n");
    exit(5);
}

$applied = array();
$res = seosys300_runner_query("SELECT migration, applied_at, checksum FROM `{$migTable}`");
if ($res) {
    while ($row = sql_fetch_array($res)) {
        $applied[$row['migration']] = $row;
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
        fwrite(STDERR, "Checksum mismatch for {$file}. Refusing to continue.\n");
        exit(6);
    }
}

if (!$apply) {
    echo $pending ? count($pending) . " pending. Re-run with --apply on an isolated development DB only.\n" : "All listed migrations are recorded as applied.\n";
    exit(0);
}

if (!$pending) {
    echo "Nothing to apply.\n";
    exit(0);
}

echo "Backup reminder: mysqldump the development database before applying. See docs/production-migration-plan.md\n";

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
            fwrite(STDERR, "FAILED on {$item['file']}. Stopped. Fix and re-run; already-applied files are skipped via {$migTable}.\n");
            exit(8);
        }
    }
    $now = date('Y-m-d H:i:s');
    $fileEsc = addslashes($item['file']);
    $sumEsc = addslashes($item['checksum']);
    seosys300_runner_query("INSERT INTO `{$migTable}` SET migration='{$fileEsc}', applied_at='{$now}', checksum='{$sumEsc}'");
    echo "  OK {$item['file']}\n";
}

echo "Done.\n";
exit(0);
