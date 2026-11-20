<?php
/**
 * ONOFF Notification Preferences API.
 * - GET  : current user's notification preferences
 * - POST : update current user's notification preferences
 */
require_once dirname(__DIR__) . '/common.php';
require_once G5_PATH . '/lib/branded-auth/bootstrap.php';
require_once G5_LIB_PATH . '/onoff-notification-preferences.lib.php';

use OnoffMarketing\BrandedAuth\AuthErrors;
use OnoffMarketing\BrandedAuth\BrandedAuthConfig;
use OnoffMarketing\BrandedAuth\CookieJar;
use OnoffMarketing\BrandedAuth\PlatformAuthService;

function onoff_notification_api_json($payload, $status = 200)
{
    http_response_code((int) $status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_notification_api_error($code, $message, $status)
{
    onoff_notification_api_json(array(
        'ok' => false,
        'success' => false,
        'code' => (string) $code,
        'error' => (string) $code,
        'message' => (string) $message,
    ), $status);
}

function onoff_notification_current_session()
{
    if (!BrandedAuthConfig::isEnabled() || !BrandedAuthConfig::isPlatformAuthEnabled() || !BrandedAuthConfig::isConfigured()) {
        onoff_notification_api_error(AuthErrors::NOT_CONFIGURED, AuthErrors::userMessage(AuthErrors::NOT_CONFIGURED), 503);
    }

    try {
        $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
        $session = PlatformAuthService::getSession($cookies);
        CookieJar::forwardToBrowser($session['setCookies']);
        if (!empty($session['sessionExpired'])) {
            onoff_notification_api_error(AuthErrors::SESSION_EXPIRED, AuthErrors::userMessage(AuthErrors::SESSION_EXPIRED), 401);
        }
        if (empty($session['authenticated'])) {
            onoff_notification_api_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
        }

        $data = is_array($session['data']) ? $session['data'] : array();
        $mb_id = (string) ($data['member_id'] ?? $data['mb_id'] ?? $data['mbId'] ?? '');
        if ($mb_id === '') {
            onoff_notification_api_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
        }

        return array($mb_id, $data);
    } catch (Throwable $e) {
        onoff_notification_api_error(AuthErrors::CORE_UNAVAILABLE, AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE), 502);
    }
}

function onoff_notification_api_bool($value)
{
    return !empty($value) && !in_array(strtolower((string) $value), array('0', 'false', 'off', 'no'), true);
}

global $is_admin;

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if (!in_array($method, array('GET', 'POST'), true)) {
    onoff_notification_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
}

list($mb_id, $session_data) = onoff_notification_current_session();
$can_manage_admin = $is_admin === 'super';
$defaults = onoff_notification_default_preferences(
    $mb_id,
    (string) ($session_data['phone'] ?? $session_data['mb_hp'] ?? $session_data['mobile'] ?? ''),
    (string) ($session_data['email'] ?? $session_data['mb_email'] ?? ''),
    $can_manage_admin
);

if ($method === 'GET') {
    $preferences = onoff_notification_get_preferences($mb_id, $defaults);
    onoff_notification_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array(
            'preferences' => $preferences,
            'canManageAdmin' => $can_manage_admin,
            'member' => array(
                'mbId' => $mb_id,
                'name' => (string) ($session_data['display_name'] ?? $session_data['mb_name'] ?? ''),
            ),
        ),
    ));
}

$raw = file_get_contents('php://input');
$body = json_decode((string) $raw, true);
if (!is_array($body)) {
    $body = $_POST;
}

$saved = onoff_notification_save_preferences($mb_id, array(
    'phone' => $body['phone'] ?? '',
    'email' => $body['email'] ?? '',
    'kakao_enabled' => onoff_notification_api_bool($body['kakao_enabled'] ?? false),
    'email_enabled' => onoff_notification_api_bool($body['email_enabled'] ?? false),
    'education_active_enabled' => onoff_notification_api_bool($body['education_active_enabled'] ?? false),
    'inquiry_admin_enabled' => onoff_notification_api_bool($body['inquiry_admin_enabled'] ?? false),
), $can_manage_admin);

onoff_notification_api_json(array(
    'ok' => true,
    'success' => true,
    'data' => array(
        'preferences' => $saved,
        'canManageAdmin' => $can_manage_admin,
    ),
));
