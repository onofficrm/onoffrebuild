<?php
/**
 * ONOFF service points BFF.
 *
 * Same-host browser → /api/points.php → Core Platform Auth/Point API.
 * This endpoint does not start a local GNUBoard session.
 *
 * Actions:
 * - GET  ?action=history : local service usage history for logged-in member
 * - POST ?action=use     : authenticated Core point debit + local usage log
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__) . '/lib/branded-auth/bootstrap.php';

use OnoffMarketing\BrandedAuth\AuthErrors;
use OnoffMarketing\BrandedAuth\BrandedAuthConfig;
use OnoffMarketing\BrandedAuth\BrandedAuthException;
use OnoffMarketing\BrandedAuth\CookieJar;
use OnoffMarketing\BrandedAuth\PlatformAuthClient;
use OnoffMarketing\BrandedAuth\PlatformAuthService;

function onoff_points_env_bool($key, $default = false)
{
    $raw = getenv($key);
    if ($raw === false || trim((string) $raw) === '') {
        return (bool) $default;
    }
    $v = strtolower(trim((string) $raw));
    return in_array($v, array('1', 'true', 'yes', 'on'), true);
}

function onoff_points_env($key, $default = '')
{
    $raw = getenv($key);
    return $raw === false || $raw === '' ? $default : (string) $raw;
}

function onoff_points_json($payload, $status = 200)
{
    http_response_code((int) $status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_points_error($code, $message, $status)
{
    onoff_points_json(array(
        'ok' => false,
        'success' => false,
        'code' => (string) $code,
        'error' => (string) $code,
        'message' => (string) $message,
    ), $status);
}

function onoff_points_read_body()
{
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || trim($raw) === '') {
        return $_POST ?: array();
    }
    $json = json_decode($raw, true);
    return is_array($json) ? $json : array();
}

function onoff_points_usage_dir()
{
    $dir = dirname(__DIR__) . '/data/service_point_usage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $ht = $dir . '/.htaccess';
    $ht_contents = is_file($ht) ? (string) @file_get_contents($ht) : '';
    if (strpos($ht_contents, 'Require all denied') === false) {
        @file_put_contents($ht, "Options -Indexes\nRequire all denied\nDeny from all\n");
    }
    return $dir;
}

function onoff_points_platform_id()
{
    return preg_replace('/[^a-z0-9_\-]/i', '', BrandedAuthConfig::platformId());
}

function onoff_points_usage_file($platform)
{
    $platform = preg_replace('/[^a-z0-9_\-]/i', '', (string) $platform);
    if ($platform === '') {
        $platform = 'onoff';
    }
    return onoff_points_usage_dir() . '/' . $platform . '.jsonl';
}

function onoff_points_append_usage($platform, array $row)
{
    $file = onoff_points_usage_file($platform);
    $line = json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($line)) {
        return false;
    }
    return @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
}

function onoff_points_recent_usage($platform, $mb_id, $limit)
{
    $file = onoff_points_usage_file($platform);
    if (!is_file($file) || !is_readable($file)) {
        return array();
    }
    $limit = max(1, min(100, (int) $limit));
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return array();
    }

    $items = array();
    for ($i = count($lines) - 1; $i >= 0 && count($items) < $limit; $i--) {
        $row = json_decode((string) $lines[$i], true);
        if (!is_array($row)) {
            continue;
        }
        if ((string) ($row['mb_id'] ?? '') !== (string) $mb_id) {
            continue;
        }
        $items[] = $row;
    }
    return $items;
}

function onoff_points_find_usage_by_request($platform, $mb_id, $request_id)
{
    $file = onoff_points_usage_file($platform);
    if (!is_file($file) || !is_readable($file)) {
        return null;
    }
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return null;
    }
    for ($i = count($lines) - 1; $i >= 0; $i--) {
        $row = json_decode((string) $lines[$i], true);
        if (!is_array($row)) {
            continue;
        }
        if (
            (string) ($row['mb_id'] ?? '') === (string) $mb_id
            && (string) ($row['request_id'] ?? '') === (string) $request_id
        ) {
            return $row;
        }
    }
    return null;
}

function onoff_points_lock_file($platform, $request_id)
{
    $platform = preg_replace('/[^a-z0-9_\-]/i', '', (string) $platform);
    $request_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $request_id);
    $dir = onoff_points_usage_dir() . '/locks';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    return $dir . '/' . $platform . '_' . sha1($request_id) . '.lock';
}

function onoff_points_acquire_lock($platform, $request_id)
{
    $file = onoff_points_lock_file($platform, $request_id);
    $fp = @fopen($file, 'c');
    if (!$fp) {
        return null;
    }
    if (!@flock($fp, LOCK_EX | LOCK_NB)) {
        @fclose($fp);
        return null;
    }
    @ftruncate($fp, 0);
    @fwrite($fp, (string) time());
    return array('fp' => $fp, 'file' => $file);
}

function onoff_points_release_lock($lock)
{
    if (!is_array($lock) || empty($lock['fp'])) {
        return;
    }
    @flock($lock['fp'], LOCK_UN);
    @fclose($lock['fp']);
}

function onoff_points_require_session($cookies)
{
    $session = PlatformAuthService::getSession($cookies);
    CookieJar::forwardToBrowser($session['setCookies']);
    if (!empty($session['sessionExpired'])) {
        onoff_points_error(AuthErrors::SESSION_EXPIRED, AuthErrors::userMessage(AuthErrors::SESSION_EXPIRED), 401);
    }
    if (empty($session['authenticated'])) {
        onoff_points_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
    }
    $data = is_array($session['data']) ? $session['data'] : array();
    $mb_id = (string) ($data['member_id'] ?? $data['mb_id'] ?? '');
    if ($mb_id === '') {
        onoff_points_error(AuthErrors::UNAUTHORIZED, AuthErrors::userMessage(AuthErrors::UNAUTHORIZED), 401);
    }
    return array($session, $mb_id);
}

function onoff_points_clean_id($value, $fallback = '')
{
    $v = preg_replace('/[^a-z0-9_\-]/i', '', (string) $value);
    return $v !== '' ? $v : $fallback;
}

try {
    if (!BrandedAuthConfig::isEnabled() || !BrandedAuthConfig::isPlatformAuthEnabled() || !BrandedAuthConfig::isConfigured()) {
        onoff_points_error(AuthErrors::NOT_CONFIGURED, AuthErrors::userMessage(AuthErrors::NOT_CONFIGURED), 503);
    }

    $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
    $action = (string) ($_GET['action'] ?? 'history');
    $cookies = (string) ($_SERVER['HTTP_COOKIE'] ?? '');
    list($session, $mb_id) = onoff_points_require_session($cookies);
    $platform = onoff_points_platform_id();

    if ($action === 'history') {
        if ($method !== 'GET') {
            onoff_points_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
        }
        $limit = (int) ($_GET['limit'] ?? 50);
        $points = PlatformAuthService::getPoints($cookies, $limit);
        CookieJar::forwardToBrowser($points['setCookies']);
        onoff_points_json(array(
            'ok' => true,
            'success' => true,
            'data' => array(
                'platform' => $platform,
                'mb_id' => $mb_id,
                'balance' => $points['balance'],
                'core_history' => $points['history'],
                'service_history' => onoff_points_recent_usage($platform, $mb_id, $limit),
            ),
        ));
    }

    if ($action === 'use') {
        if ($method !== 'POST') {
            onoff_points_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
        }
        if (!onoff_points_env_bool('ONOFF_PLATFORM_POINT_USE_ENABLED', false)) {
            onoff_points_error('POINT_USE_DISABLED', '포인트 사용 API가 아직 활성화되지 않았습니다.', 503);
        }

        $body = onoff_points_read_body();
        $request_id = onoff_points_clean_id($body['request_id'] ?? '', '');
        $service = onoff_points_clean_id($body['service'] ?? $platform, $platform);
        $task = onoff_points_clean_id($body['task'] ?? 'use', 'use');
        $points = (int) ($body['points'] ?? 0);
        $metadata = is_array($body['metadata'] ?? null) ? $body['metadata'] : array();

        if ($request_id === '' || strlen($request_id) > 80) {
            onoff_points_error('INVALID_REQUEST_ID', 'request_id가 올바르지 않습니다.', 400);
        }
        if ($points < 1 || $points > 10000000) {
            onoff_points_error('INVALID_POINTS', '포인트 값이 올바르지 않습니다.', 400);
        }

        $existing = onoff_points_find_usage_by_request($platform, $mb_id, $request_id);
        if (is_array($existing)) {
            $existing['idempotent'] = true;
            onoff_points_json(array(
                'ok' => true,
                'success' => true,
                'data' => $existing,
            ));
        }

        $lock = onoff_points_acquire_lock($platform, $request_id);
        if ($lock === null) {
            onoff_points_error('REQUEST_IN_PROGRESS', '동일한 포인트 사용 요청이 처리 중입니다.', 409);
        }

        try {
            $existing = onoff_points_find_usage_by_request($platform, $mb_id, $request_id);
            if (is_array($existing)) {
                $existing['idempotent'] = true;
                onoff_points_json(array(
                    'ok' => true,
                    'success' => true,
                    'data' => $existing,
                ));
            }

            $path = trim(onoff_points_env('ONOFF_PLATFORM_POINT_USE_PATH', 'auth/point/use'));
            if ($path === '') {
                $path = 'auth/point/use';
            }

            $core_payload = array(
                'request_id' => $request_id,
                'platform' => $platform,
                'service' => $service,
                'task' => $task,
                'mb_id' => $mb_id,
                'points' => $points,
                'metadata' => $metadata,
            );

            $res = PlatformAuthClient::request($path, array(
                'method' => 'POST',
                'body' => $core_payload,
                'cookies' => $cookies,
                'timeoutMs' => 30000,
            ));
            CookieJar::forwardToBrowser($res['setCookies']);

            if (!$res['ok']) {
                onoff_points_error(
                    $res['code'] ?: 'POINT_USE_FAILED',
                    $res['message'] ?: '포인트 차감에 실패했습니다.',
                    $res['status'] >= 400 ? $res['status'] : 502
                );
            }

            $data = is_array($res['data']) ? $res['data'] : array();
            $balance_after = $data['balance_after'] ?? $data['point_balance'] ?? $data['balance'] ?? null;
            $usage = array(
                'request_id' => $request_id,
                'platform' => $platform,
                'service' => $service,
                'task' => $task,
                'mb_id' => $mb_id,
                'points' => $points,
                'balance_after' => $balance_after,
                'metadata' => $metadata,
                'created_at' => gmdate('c'),
                'core' => $data,
            );
            onoff_points_append_usage($platform, $usage);

            onoff_points_json(array(
                'ok' => true,
                'success' => true,
                'data' => $usage,
            ));
        } finally {
            onoff_points_release_lock($lock);
        }
    }

    onoff_points_error('NOT_FOUND', 'Unknown points action', 404);
} catch (BrandedAuthException $e) {
    onoff_points_error($e->errorCode, $e->getMessage(), $e->httpStatus);
} catch (Throwable $e) {
    onoff_points_error(AuthErrors::CORE_UNAVAILABLE, AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE), 502);
}
