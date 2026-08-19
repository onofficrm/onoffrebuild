<?php
/**
 * Environment guards for SEO SYSTEM 300 CLI migration / E2E.
 * DB-free so CLI unit tests can load this file.
 */

function seosys300_production_host_needles()
{
    return array('icrm.co.kr', 'onoff.icrm', 'onoff.icrm.co.kr');
}

function seosys300_guard_host_string()
{
    $bits = array();
    if (!empty($_SERVER['HTTP_HOST'])) {
        $bits[] = (string) $_SERVER['HTTP_HOST'];
    }
    if (!empty($_SERVER['SERVER_NAME'])) {
        $bits[] = (string) $_SERVER['SERVER_NAME'];
    }
    if (function_exists('gethostname')) {
        $bits[] = (string) gethostname();
    }
    if (defined('G5_URL')) {
        $bits[] = (string) G5_URL;
    }
    return strtolower(implode(' ', $bits));
}

function seosys300_looks_like_production_host($hostBlob = null)
{
    $blob = $hostBlob !== null ? strtolower((string) $hostBlob) : seosys300_guard_host_string();
    foreach (seosys300_production_host_needles() as $needle) {
        if ($needle !== '' && strpos($blob, $needle) !== false) {
            return true;
        }
    }
    return false;
}

function seosys300_mysql_host_is_local($host)
{
    $host = strtolower(trim((string) $host));
    if ($host === '' || $host === 'localhost' || $host === '127.0.0.1' || $host === '::1' || $host === 'db') {
        return true;
    }
    return (bool) preg_match('/\.local$/', $host);
}

function seosys300_mysql_host_is_docker_dev($host)
{
    return strtolower(trim((string) $host)) === 'db';
}

function seosys300_looks_like_production_db($host, $dbName)
{
    $blob = strtolower(trim((string) $host) . ' ' . trim((string) $dbName));
    return strpos($blob, 'icrm') !== false;
}

function seosys300_db_name_allowlisted($dbName, $allowlistCsv)
{
    $dbName = trim((string) $dbName);
    $allow = array();
    foreach (explode(',', (string) $allowlistCsv) as $item) {
        $item = trim($item);
        if ($item !== '') {
            $allow[] = $item;
        }
    }
    if ($dbName === '' || empty($allow)) {
        return false;
    }
    return in_array($dbName, $allow, true);
}

/**
 * @return array{ok:bool,code:string,message:string}
 */
function seosys300_cli_safety_check($opts = array())
{
    $needMigration = !empty($opts['migration']);
    $needE2e = !empty($opts['e2e']);
    $env = isset($opts['env']) ? (string) $opts['env'] : (string) getenv('SEOSYS300_ENV');
    $allowMig = isset($opts['allow_migration']) ? (string) $opts['allow_migration'] : (string) getenv('SEOSYS300_ALLOW_MIGRATION');
    $e2e = isset($opts['e2e_flag']) ? (string) $opts['e2e_flag'] : (string) getenv('SEOSYS300_E2E');
    $allowDb = isset($opts['allow_db']) ? (string) $opts['allow_db'] : (string) getenv('SEOSYS300_ALLOW_DB');
    $confirm = isset($opts['confirm']) ? (string) $opts['confirm'] : (string) getenv('SEOSYS300_E2E_CONFIRM');
    $hostBlob = isset($opts['host_blob']) ? (string) $opts['host_blob'] : seosys300_guard_host_string();
    $mysqlHost = isset($opts['mysql_host']) ? (string) $opts['mysql_host'] : (defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '');
    $mysqlDb = isset($opts['mysql_db']) ? (string) $opts['mysql_db'] : (defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '');
    $allowlist = isset($opts['db_allowlist']) ? (string) $opts['db_allowlist'] : (string) getenv('SEOSYS300_DB_ALLOWLIST');

    if (isset($opts['sapi']) ? $opts['sapi'] !== 'cli' : php_sapi_name() !== 'cli') {
        return array('ok' => false, 'code' => 'CLI_ONLY', 'message' => 'CLI only.');
    }
    if (seosys300_looks_like_production_host($hostBlob)) {
        return array('ok' => false, 'code' => 'PRODUCTION_HOST', 'message' => 'Production hostname blocked.');
    }
    if ($env === 'production') {
        return array('ok' => false, 'code' => 'PRODUCTION_ENV', 'message' => 'SEOSYS300_ENV=production blocked.');
    }
    if ($env !== 'development') {
        return array('ok' => false, 'code' => 'ENV_NOT_DEVELOPMENT', 'message' => 'Set SEOSYS300_ENV=development.');
    }
    if ($confirm !== 'dev-only') {
        return array('ok' => false, 'code' => 'CONFIRM_REQUIRED', 'message' => 'Set SEOSYS300_E2E_CONFIRM=dev-only.');
    }
    if ($needMigration && $allowMig !== '1') {
        return array('ok' => false, 'code' => 'MIGRATION_NOT_ALLOWED', 'message' => 'Set SEOSYS300_ALLOW_MIGRATION=1.');
    }
    if ($needE2e && ($e2e !== '1' || $allowDb !== '1')) {
        return array('ok' => false, 'code' => 'E2E_NOT_ALLOWED', 'message' => 'Set SEOSYS300_E2E=1 and SEOSYS300_ALLOW_DB=1.');
    }
    if (($needMigration || $needE2e) && seosys300_looks_like_production_db($mysqlHost, $mysqlDb)) {
        return array('ok' => false, 'code' => 'PRODUCTION_DB', 'message' => 'icrm/production DB identifiers blocked.');
    }
    if (($needMigration || $needE2e) && $mysqlHost !== '' && !seosys300_mysql_host_is_docker_dev($mysqlHost)) {
        return array('ok' => false, 'code' => 'DB_HOST_NOT_DOCKER', 'message' => 'G5_MYSQL_HOST must be db (Docker MariaDB service).');
    }
    if ($mysqlHost !== '' && !seosys300_mysql_host_is_local($mysqlHost) && !seosys300_mysql_host_is_docker_dev($mysqlHost)) {
        return array('ok' => false, 'code' => 'REMOTE_DB_HOST', 'message' => 'MySQL host is not local.');
    }
    if (($needMigration || $needE2e) && $mysqlDb !== '' && $mysqlDb !== 'seosys300_dev') {
        return array('ok' => false, 'code' => 'DB_NAME_NOT_DEV', 'message' => 'G5_MYSQL_DB must be seosys300_dev.');
    }
    if ($mysqlDb !== '' && !seosys300_db_name_allowlisted($mysqlDb, $allowlist)) {
        return array('ok' => false, 'code' => 'DB_NOT_ALLOWLISTED', 'message' => 'G5_MYSQL_DB is not in SEOSYS300_DB_ALLOWLIST.');
    }
    return array('ok' => true, 'code' => 'OK', 'message' => 'guard passed');
}

function seosys300_expected_schema_tables($prefix = 'g5_')
{
    $p = $prefix;
    return array(
        'core' => array(
            $p . 'seosys300_projects',
            $p . 'seosys300_project_keywords',
            $p . 'seosys300_website_orders',
            $p . 'seosys300_website_menu',
            $p . 'seosys300_website_features',
            $p . 'seosys300_website_references',
            $p . 'seosys300_website_files',
            $p . 'seosys300_website_status_history',
        ),
        'roadmap' => array(
            $p . 'seosys300_roadmap_steps',
            $p . 'seosys300_roadmap_tasks',
            $p . 'seosys300_project_roadmap_tasks',
            $p . 'seosys300_task_results',
            $p . 'seosys300_daily_missions',
            $p . 'seosys300_activities',
            $p . 'seosys300_admin_notes',
        ),
        'google' => array(
            $p . 'seosys300_google_connections',
            $p . 'seosys300_project_integrations',
            $p . 'seosys300_gsc_daily',
            $p . 'seosys300_gsc_queries',
            $p . 'seosys300_gsc_pages',
            $p . 'seosys300_ga4_daily',
            $p . 'seosys300_sync_runs',
        ),
        'tools_ai' => array(
            $p . 'seosys300_tool_integrations',
            $p . 'seosys300_ai_runs',
            $p . 'seosys300_ai_analysis_cache',
        ),
        'meta' => array(
            $p . 'seosys300_migrations',
        ),
    );
}

function seosys300_expected_step_keys()
{
    return array(
        'project_setup',
        'website',
        'domain',
        'technical_seo',
        'keywords',
        'content',
        'backlink',
        'traffic',
        'analytics',
        'growth',
    );
}

function seosys300_ordered_migrations()
{
    return array(
        '001_projects_and_website.sql',
        '002_roadmap_missions_activity_admin.sql',
        '003_google_metrics.sql',
        '004_tools_ai.sql',
        '005_website_order_wizard.sql',
    );
}

function seosys300_migration_checksum($path)
{
    if (!is_file($path)) {
        return '';
    }
    return hash_file('sha256', $path);
}

function seosys300_split_sql_statements($sql)
{
    $sql = preg_replace('/^\s*--.*$/m', '', (string) $sql);
    $parts = preg_split('/;\s*$/m', $sql);
    $out = array();
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part !== '') {
            $out[] = $part;
        }
    }
    return $out;
}

/**
 * CLI-only. Fill the minimum $_SERVER keys GNUBoard common.php reads.
 * Does not run under Apache. Never sets production hostnames.
 */
function seosys300_cli_prepare_server()
{
    if (php_sapi_name() !== 'cli') {
        return;
    }
    $defaults = array(
        'SERVER_PORT' => '80',
        'HTTP_HOST' => 'localhost',
        'SERVER_NAME' => 'localhost',
        'REQUEST_URI' => '/',
        'REMOTE_ADDR' => '127.0.0.1',
        'SERVER_ADDR' => '127.0.0.1',
        'HTTPS' => 'off',
    );
    foreach ($defaults as $key => $value) {
        if (!isset($_SERVER[$key]) || $_SERVER[$key] === '') {
            $_SERVER[$key] = $value;
        }
    }
    if (empty($_SERVER['SCRIPT_NAME'])) {
        $_SERVER['SCRIPT_NAME'] = '/plugin/seo-system-300/migrations/cli.php';
    }
}
