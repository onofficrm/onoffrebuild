<?php
/**
 * SEO SYSTEM 300 API helpers. Prefix seosys300_ to avoid GNUBoard collisions.
 * Does not change GNUBoard login or member tables.
 */
include_once dirname(__FILE__) . '/launch.lib.php';

if (!function_exists('seosys300_json_response')) {
    function seosys300_json_response($data, $status = 200)
    {
        if (!headers_sent()) {
            http_response_code((int) $status);
            header('Content-Type: application/json; charset=utf-8');
            header('Cache-Control: no-store');
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if (!function_exists('seosys300_json_ok')) {
    function seosys300_json_ok($data, $status = 200)
    {
        seosys300_json_response(array(
            'ok' => true,
            'data' => $data,
        ), $status);
    }
}

if (!function_exists('seosys300_json_error')) {
    function seosys300_json_error($status, $code, $message)
    {
        seosys300_json_response(array(
            'ok' => false,
            'error' => array(
                'code' => $code,
                'message' => $message,
            ),
        ), $status);
    }
}

if (!function_exists('seosys300_json_input')) {
    function seosys300_json_input()
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || $raw === '') {
            return is_array($_POST) ? $_POST : array();
        }
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        return is_array($_POST) ? $_POST : array();
    }
}

if (!function_exists('seosys300_action')) {
    function seosys300_action($input = array())
    {
        if (isset($_GET['action']) && $_GET['action'] !== '') {
            return preg_replace('/[^a-z0-9_\-]/i', '', (string) $_GET['action']);
        }
        if (isset($input['action']) && $input['action'] !== '') {
            return preg_replace('/[^a-z0-9_\-]/i', '', (string) $input['action']);
        }
        return '';
    }
}

if (!function_exists('seosys300_csrf_token_from_request')) {
    function seosys300_csrf_token_from_request($input = array())
    {
        if (!empty($_SERVER['HTTP_X_CSRF_TOKEN'])) {
            return trim((string) $_SERVER['HTTP_X_CSRF_TOKEN']);
        }
        if (isset($_POST['token'])) {
            return trim((string) $_POST['token']);
        }
        if (isset($input['token'])) {
            return trim((string) $input['token']);
        }
        if (isset($input['csrfToken'])) {
            return trim((string) $input['csrfToken']);
        }
        return '';
    }
}

if (!function_exists('seosys300_csrf_valid')) {
    /**
     * GNUBoard HMAC token (get_token) without check_token() HTML alert().
     */
    function seosys300_csrf_valid($token, $expire = 7200)
    {
        $token = trim((string) $token);
        $dot = strpos($token, '.');
        if ($token === '' || $dot === false) {
            return false;
        }
        $time = (int) substr($token, 0, $dot);
        $hmac = substr($token, $dot + 1);
        if (abs(time() - $time) > (int) $expire) {
            return false;
        }
        if (!function_exists('get_token') || !function_exists('_get_token_key') || !function_exists('_get_token_secret')) {
            return false;
        }
        $expected = hash_hmac('sha256', _get_token_secret() . '|csrf_token|' . $time, _get_token_key());
        return hash_equals($expected, $hmac);
    }
}

if (!function_exists('seosys300_require_csrf')) {
    function seosys300_require_csrf($input = array())
    {
        $method = seosys300_request_method();
        if ($method === 'GET' || $method === 'HEAD' || $method === 'OPTIONS') {
            return;
        }
        if (!seosys300_csrf_valid(seosys300_csrf_token_from_request($input))) {
            seosys300_json_error(403, 'csrf_invalid', '요청을 확인할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.');
        }
    }
}

if (!function_exists('seosys300_log')) {
    function seosys300_log($message)
    {
        @error_log('[seo-system-300] ' . $message);
    }
}

if (!function_exists('seosys300_request_method')) {
    function seosys300_request_method()
    {
        $method = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : 'GET';
        return $method;
    }
}

if (!function_exists('seosys300_require_method')) {
    function seosys300_require_method($allowed)
    {
        $allowed = (array) $allowed;
        $allowed = array_map('strtoupper', $allowed);
        if (!in_array(seosys300_request_method(), $allowed, true)) {
            seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
        }
    }
}

if (!function_exists('seosys300_is_admin')) {
    function seosys300_is_admin()
    {
        global $is_admin;
        return !empty($is_admin);
    }
}

if (!function_exists('seosys300_is_member')) {
    function seosys300_is_member()
    {
        global $is_member, $member;
        return !empty($is_member) && !empty($member['mb_id']);
    }
}

if (!function_exists('seosys300_public_member')) {
    /**
     * Minimum member fields for the SPA. Never include password, jumin, secrets.
     */
    function seosys300_public_member()
    {
        global $member;

        if (!seosys300_is_member()) {
            return null;
        }

        $name = isset($member['mb_name']) ? trim((string) $member['mb_name']) : '';
        $nick = isset($member['mb_nick']) ? trim((string) $member['mb_nick']) : '';
        $email = isset($member['mb_email']) ? trim((string) $member['mb_email']) : '';

        return array(
            'mbId' => (string) $member['mb_id'],
            'mbName' => $name,
            'mbNick' => $nick,
            'mbEmail' => $email,
        );
    }
}

if (!function_exists('seosys300_get_current_member')) {
    function seosys300_get_current_member()
    {
        return seosys300_public_member();
    }
}

if (!function_exists('seosys300_require_login')) {
    function seosys300_require_login()
    {
        if (!seosys300_is_member()) {
            seosys300_json_error(401, 'unauthorized', '로그인이 필요합니다.');
        }
        seosys300_require_launch_access();
    }
}

if (!function_exists('seosys300_require_admin')) {
    function seosys300_require_admin()
    {
        seosys300_require_login();
        if (!seosys300_is_admin()) {
            seosys300_json_error(403, 'forbidden', '관리자 권한이 필요합니다.');
        }
    }
}

if (!function_exists('seosys300_session_payload')) {
    function seosys300_session_payload()
    {
        global $is_admin;

        $authenticated = seosys300_is_member();

        $csrf = '';
        if (function_exists('get_token')) {
            $csrf = get_token();
        }

        $launch = seosys300_launch_public_state();

        return array(
            'authenticated' => $authenticated,
            'isAdmin' => $authenticated && seosys300_is_admin(),
            'adminLevel' => ($authenticated && !empty($is_admin)) ? (string) $is_admin : '',
            'user' => seosys300_public_member(),
            'csrfToken' => $csrf,
            'launchMode' => $launch['launchMode'],
            'launchAllowed' => $launch['launchAllowed'],
        );
    }
}

if (!function_exists('seosys300_safe_return_path')) {
    /**
     * Allow only same-origin SEO SYSTEM 300 paths. Blocks open redirects.
     */
    function seosys300_safe_return_path($raw)
    {
        $fallback = '/seo-system-300/dashboard';
        $url = trim((string) $raw);
        if ($url === '') {
            return $fallback;
        }
        if (preg_match('/^[a-zA-Z][a-zA-Z0-9+.-]*:/', $url)) {
            return $fallback;
        }
        if (strpos($url, '\\') !== false || strpos($url, '@') !== false) {
            return $fallback;
        }
        if (isset($url[0]) && $url[0] !== '/') {
            return $fallback;
        }
        if (isset($url[1]) && $url[1] === '/') {
            return $fallback;
        }
        $path = $url;
        $qpos = strpos($path, '?');
        if ($qpos !== false) {
            $path = substr($path, 0, $qpos);
        }
        if ($path !== '/seo-system-300' && strpos($path, '/seo-system-300/') !== 0) {
            return $fallback;
        }
        return $url;
    }
}
