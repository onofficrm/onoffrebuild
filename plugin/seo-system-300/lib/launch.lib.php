<?php
/**
 * SEO SYSTEM 300 public launch control. Config-only; no DB.
 * Default mode is off until SEOSYS300_LAUNCH_MODE is set.
 */

$seosys300LaunchConfig = dirname(__FILE__) . '/../config.local.php';
if (defined('_GNUBOARD_') && is_file($seosys300LaunchConfig)) {
    include_once $seosys300LaunchConfig;
}

if (!function_exists('seosys300_env')) {
    function seosys300_env($name, $default = '')
    {
        $v = getenv($name);
        if ($v === false || $v === '') {
            return $default;
        }
        return (string) $v;
    }
}

function seosys300_launch_mode()
{
    $mode = strtolower(trim(seosys300_env('SEOSYS300_LAUNCH_MODE', 'off')));
    if (!in_array($mode, array('off', 'admin', 'pilot', 'all'), true)) {
        return 'off';
    }
    return $mode;
}

function seosys300_pilot_mb_ids()
{
    $ids = array();
    foreach (explode(',', seosys300_env('SEOSYS300_PILOT_USERS')) as $item) {
        $item = strtolower(trim($item));
        if ($item !== '') {
            $ids[$item] = true;
        }
    }
    return array_keys($ids);
}

function seosys300_launch_mb_id($explicit = null)
{
    if ($explicit !== null) {
        return strtolower(trim((string) $explicit));
    }
    if (function_exists('seosys300_public_member')) {
        $user = seosys300_public_member();
        if (is_array($user) && !empty($user['mbId'])) {
            return strtolower(trim((string) $user['mbId']));
        }
    }
    global $member;
    if (!empty($member['mb_id'])) {
        return strtolower(trim((string) $member['mb_id']));
    }
    return '';
}

function seosys300_is_pilot_member($mbId = null)
{
    $mbId = seosys300_launch_mb_id($mbId);
    if ($mbId === '') {
        return false;
    }
    return in_array($mbId, seosys300_pilot_mb_ids(), true);
}

/**
 * @param array $opts authenticated, is_admin, mb_id
 */
function seosys300_is_launch_allowed($opts = array())
{
    $mode = seosys300_launch_mode();
    if ($mode === 'off') {
        return false;
    }

    $authenticated = array_key_exists('authenticated', $opts)
        ? (bool) $opts['authenticated']
        : (function_exists('seosys300_is_member') && seosys300_is_member());
    if (!$authenticated) {
        return false;
    }

    $isAdmin = array_key_exists('is_admin', $opts)
        ? (bool) $opts['is_admin']
        : (function_exists('seosys300_is_admin') && seosys300_is_admin());
    $mbId = array_key_exists('mb_id', $opts) ? seosys300_launch_mb_id($opts['mb_id']) : seosys300_launch_mb_id();

    if ($mode === 'all') {
        return true;
    }
    if ($mode === 'admin') {
        return $isAdmin;
    }
    if ($mode === 'pilot') {
        return $isAdmin || seosys300_is_pilot_member($mbId);
    }
    return false;
}

function seosys300_launch_public_state()
{
    return array(
        'launchMode' => seosys300_launch_mode(),
        'launchAllowed' => seosys300_is_launch_allowed(),
    );
}

function seosys300_require_launch_access()
{
    if (!seosys300_is_launch_allowed()) {
        if (function_exists('seosys300_json_error')) {
            seosys300_json_error(403, 'launch_not_allowed', 'SEO SYSTEM 300을 준비하고 있습니다.');
        }
        http_response_code(403);
        exit;
    }
}
