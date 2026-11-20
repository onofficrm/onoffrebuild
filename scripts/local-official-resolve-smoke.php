<?php
/**
 * CLI smoke for dual-route resolve + official gate (no DB).
 * Usage:
 *   php scripts/local-official-resolve-smoke.php
 */

define('_GNUBOARD_', true);

$root = dirname(__FILE__) . '/..';
if (!defined('ONOFF_BUILDER_PATH')) {
    define('ONOFF_BUILDER_PATH', $root . '/plugin/onoff-builder-bridge');
}
if (!defined('ONOFF_BUILDER_IMPORTS_PATH')) {
    define('ONOFF_BUILDER_IMPORTS_PATH', ONOFF_BUILDER_PATH . '/imports');
}
if (!defined('ONOFF_BUILDER_DATA_PATH')) {
    define('ONOFF_BUILDER_DATA_PATH', ONOFF_BUILDER_PATH . '/data');
}
if (!defined('ONOFF_BUILDER_IMPORTS_JSON')) {
    define('ONOFF_BUILDER_IMPORTS_JSON', ONOFF_BUILDER_DATA_PATH . '/imports.json');
}

if (!function_exists('onoff_builder_has_import')) {
    function onoff_builder_has_import($project_id)
    {
        $id = preg_replace('/[^a-z0-9_-]/', '', strtolower(trim((string) $project_id)));
        if ($id === '') {
            return false;
        }
        $dir = ONOFF_BUILDER_IMPORTS_PATH . '/' . $id;
        return is_dir($dir) && is_file($dir . '/index.html');
    }
}

// Minimal stubs used by home.php / importer sanitize helpers
if (!function_exists('g5site_cfg')) {
    function g5site_cfg($key, $default = '')
    {
        global $site_config;
        if (!isset($site_config) || !is_array($site_config) || !array_key_exists($key, $site_config)) {
            return (string) $default;
        }
        $val = $site_config[$key];
        if ($val === null || $val === false) {
            return (string) $default;
        }
        if (is_bool($val)) {
            return $val ? '1' : '';
        }
        $val = trim((string) $val);
        return $val !== '' ? $val : (string) $default;
    }
}
if (!function_exists('g5site_cfg_bool')) {
    function g5site_cfg_bool($key, $default = false)
    {
        $raw = g5site_cfg($key, $default ? '1' : '');
        if ($raw === '') {
            return (bool) $default;
        }
        $v = strtolower(trim((string) $raw));
        return in_array($v, array('1', 'true', 'yes', 'on', 'y'), true);
    }
}

$site_config = array(
    'home_builder_bridge_id' => 'onoffmarketing',
    'official_builder_bridge_id' => 'onoff-builder-official',
    'official_builder_routes_enabled' => true,
    'onoff_builder_bridge_enabled' => true,
);

require_once dirname(__FILE__) . '/../plugin/onoff-builder-bridge/lib/importer.php';
require_once dirname(__FILE__) . '/../plugin/onoff-builder-bridge/lib/home.php';

$cases = array(
    '/' => 'onoff-builder-official',
    '/features/routine' => 'onoff-builder-official',
    '/contact' => 'onoff-builder-official',
    '/services/seo' => 'onoff-builder-official',
    '/pricing' => 'onoff-builder-official',
    '/login' => 'onoffmarketing',
    '/account' => 'onoffmarketing',
    '/community' => 'onoff-builder-official',
    '/education' => 'onoffmarketing',
    '/seo-platform' => 'onoffmarketing',
);

$fail = 0;
echo "gate_armed=" . (onoff_builder_official_routes_armed() ? 'yes' : 'no') . PHP_EOL;
foreach ($cases as $path => $expect) {
    $got = onoff_builder_resolve_request_project_id($path);
    $ok = $got === $expect;
    echo ($ok ? 'OK' : 'FAIL') . " {$path} => {$got} (expect {$expect})" . PHP_EOL;
    if (!$ok) {
        $fail++;
    }
}

// Gate off must fall back
$site_config['official_builder_routes_enabled'] = false;
$gotHome = onoff_builder_resolve_request_project_id('/');
$okOff = $gotHome === 'onoffmarketing';
echo ($okOff ? 'OK' : 'FAIL') . " gate_off / => {$gotHome} (expect onoffmarketing)" . PHP_EOL;
if (!$okOff) {
    $fail++;
}

exit($fail > 0 ? 2 : 0);
