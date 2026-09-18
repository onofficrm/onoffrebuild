<?php
/**
 * ONOFF Education API.
 * - GET ?action=access : logged-in Core member classroom access check
 */
require_once dirname(__DIR__) . '/common.php';
require_once G5_PATH . '/lib/branded-auth/bootstrap.php';
require_once G5_LIB_PATH . '/onoff-education.lib.php';

use OnoffMarketing\BrandedAuth\AuthErrors;
use OnoffMarketing\BrandedAuth\BrandedAuthConfig;
use OnoffMarketing\BrandedAuth\CookieJar;
use OnoffMarketing\BrandedAuth\PlatformAuthService;

function onoff_education_api_json($payload, $status = 200)
{
    http_response_code((int) $status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_education_api_error($code, $message, $status)
{
    onoff_education_api_json(array(
        'ok' => false,
        'success' => false,
        'code' => (string) $code,
        'error' => (string) $code,
        'message' => (string) $message,
    ), $status);
}

function onoff_education_api_latest_enrollment($mb_id, $course_id)
{
    onoff_education_ensure_table();
    $table = onoff_education_enrollment_table();
    $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
    $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
    if ($mb_id === '') {
        return null;
    }
    if ($course_id === '') {
        $course_id = 'seo-geo-master';
    }
    $row = sql_fetch(" select *
                         from {$table}
                        where mb_id = '" . sql_real_escape_string($mb_id) . "'
                          and course_id = '" . sql_real_escape_string($course_id) . "'
                        order by en_id desc
                        limit 1 ");
    return $row ?: null;
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : 'access';
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($action !== 'access') {
    onoff_education_api_error('NOT_FOUND', 'Unknown education action', 404);
}
if ($method !== 'GET') {
    onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
}

if (!BrandedAuthConfig::isEnabled() || !BrandedAuthConfig::isPlatformAuthEnabled() || !BrandedAuthConfig::isConfigured()) {
    onoff_education_api_error(AuthErrors::NOT_CONFIGURED, AuthErrors::userMessage(AuthErrors::NOT_CONFIGURED), 503);
}

try {
    $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
    $session = PlatformAuthService::getSession($cookies);
    CookieJar::forwardToBrowser($session['setCookies']);
    if (!empty($session['sessionExpired'])) {
        onoff_education_api_error(AuthErrors::SESSION_EXPIRED, AuthErrors::userMessage(AuthErrors::SESSION_EXPIRED), 401);
    }
    if (empty($session['authenticated'])) {
        onoff_education_api_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
    }

    $data = is_array($session['data']) ? $session['data'] : array();
    $mb_id = (string) ($data['member_id'] ?? $data['mb_id'] ?? $data['mbId'] ?? '');
    if ($mb_id === '') {
        onoff_education_api_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
    }

    $course_id = isset($_GET['course_id']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $_GET['course_id']) : 'seo-geo-master';
    if ($course_id === '') {
        $course_id = 'seo-geo-master';
    }

    $active = onoff_education_get_active_enrollment($mb_id, $course_id);
    $latest = $active ?: onoff_education_api_latest_enrollment($mb_id, $course_id);

    onoff_education_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array(
            'access' => (bool) $active,
            'course_id' => $course_id,
            'mb_id' => $mb_id,
            'member_name' => (string) ($data['display_name'] ?? $data['mb_name'] ?? ''),
            'enrollment' => onoff_education_serialize_enrollment($latest),
        ),
    ));
} catch (Throwable $e) {
    onoff_education_api_error(AuthErrors::CORE_UNAVAILABLE, AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE), 502);
}
