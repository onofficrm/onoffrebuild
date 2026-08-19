<?php
/**
 * Schema verification CLI. Same safety guard as run.php.
 * Usage: php plugin/seo-system-300/migrations/verify.php
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

$plugin = realpath(dirname(__FILE__) . '/..');
$root = realpath(dirname(__FILE__) . '/../../..');
require_once $plugin . '/lib/env_guard.lib.php';

$check = seosys300_cli_safety_check(array('migration' => true, 'intent' => 'verify'));
if (!$check['ok']) {
    fwrite(STDERR, "REFUSED [{$check['code']}] {$check['message']}\n");
    fwrite(STDERR, "Schema verify skipped.\n");
    exit(2);
}

if (!is_file($root . '/data/dbconfig.php') && !is_file($root . '/data/dbconfig.local.php')) {
    fwrite(STDERR, "DEVELOPMENT_DB_NOT_AVAILABLE: no dbconfig.\n");
    exit(3);
}

seosys300_cli_prepare_server();
chdir($root);
include_once $root . '/common.php';

$check2 = seosys300_cli_safety_check(array(
    'migration' => true,
    'intent' => 'verify',
    'require_mysql' => true,
    'mysql_host' => defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '',
    'mysql_db' => defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '',
));
if (!$check2['ok']) {
    fwrite(STDERR, "REFUSED [{$check2['code']}]\n");
    exit(4);
}

$prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
$groups = seosys300_expected_schema_tables($prefix);
$missing = 0;
foreach ($groups as $group => $tables) {
    echo strtoupper($group) . "\n";
    foreach ($tables as $table) {
        $esc = addslashes($table);
        $row = sql_fetch("SHOW TABLES LIKE '{$esc}'");
        $ok = !empty($row);
        echo ($ok ? '  READY ' : '  MISSING ') . $table . "\n";
        if (!$ok) {
            $missing++;
        }
    }
}

$steps = sql_fetch("SELECT COUNT(*) AS c FROM `{$prefix}seosys300_roadmap_steps`");
if ($steps) {
    echo "Roadmap steps: " . (int) $steps['c'] . " (expect 10)\n";
}

$orders = $prefix . 'seosys300_website_orders';
$cols = array();
$colRes = sql_query("SHOW COLUMNS FROM `{$orders}`", false);
if ($colRes) {
    while ($c = sql_fetch_array($colRes)) {
        $cols[strtolower((string) $c['Field'])] = true;
    }
}
foreach (array('order_no', 'extra_json', 'wizard_step') as $needCol) {
    $ok = !empty($cols[$needCol]);
    echo ($ok ? '  READY ' : '  MISSING ') . $orders . '.' . $needCol . "\n";
    if (!$ok) {
        $missing++;
    }
}
$uniqueOrderNo = false;
$idxRes = sql_query("SHOW INDEX FROM `{$orders}`", false);
if ($idxRes) {
    while ($idx = sql_fetch_array($idxRes)) {
        if (isset($idx['Column_name']) && (string) $idx['Column_name'] === 'order_no' && (int) $idx['Non_unique'] === 0) {
            $uniqueOrderNo = true;
        }
    }
}
echo ($uniqueOrderNo ? '  READY ' : '  MISSING ') . $orders . '.order_no UNIQUE' . "\n";
if (!$uniqueOrderNo) {
    $missing++;
}

exit($missing === 0 ? 0 : 9);
