<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

$seosys300Local = dirname(__FILE__) . '/../config.local.php';
if (is_file($seosys300Local)) {
    include_once $seosys300Local;
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

function seosys300_google_client_id()
{
    return trim(seosys300_env('SEOSYS300_GOOGLE_CLIENT_ID'));
}

function seosys300_google_client_secret()
{
    return trim(seosys300_env('SEOSYS300_GOOGLE_CLIENT_SECRET'));
}

function seosys300_google_redirect_uri()
{
    return trim(seosys300_env('SEOSYS300_GOOGLE_REDIRECT_URI'));
}

function seosys300_google_configured()
{
    return seosys300_google_client_id() !== ''
        && seosys300_google_client_secret() !== ''
        && seosys300_google_redirect_uri() !== ''
        && seosys300_token_key() !== '';
}

function seosys300_portal_path()
{
    $path = trim(seosys300_env('SEOSYS300_PORTAL_PATH', '/seo-system-300'));
    if ($path === '' || $path[0] !== '/') {
        return '/seo-system-300';
    }
    return rtrim($path, '/');
}

function seosys300_http_timeout()
{
    $n = (int) seosys300_env('SEOSYS300_HTTP_TIMEOUT', '15');
    if ($n < 5) {
        $n = 5;
    }
    if ($n > 30) {
        $n = 30;
    }
    return $n;
}

function seosys300_require_google_config()
{
    if (!seosys300_google_configured()) {
        seosys300_json_error(503, 'GOOGLE_NOT_CONFIGURED', 'Google API 설정이 필요합니다.');
    }
}
