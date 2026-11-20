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

if (!function_exists('seosys300_require_admin')) {
    function seosys300_require_admin()
    {
        seosys300_require_login();
        if (!seosys300_is_admin()) {
            seosys300_json_error(403, 'forbidden', '관리자 권한이 필요합니다.');
        }
    }
}

if (!function_exists('seosys300_contract_access_payload')) {
    /**
     * @return array<string,mixed>
     */
    function seosys300_contract_access_payload()
    {
        $empty = array(
            'applies' => false,
            'signed' => true,
            'blocked' => false,
            'graceActive' => false,
            'requires' => false,
            'hasSignedHistory' => false,
            'viewable' => false,
            'status' => '',
            'courseId' => '',
            'path' => '/seo-system-300/contract',
            'version' => '',
            'rejectionReason' => '',
        );
        if (!seosys300_is_member()) {
            return $empty;
        }
        if (seosys300_is_admin()) {
            return $empty;
        }
        $lib = dirname(__FILE__) . '/../../../lib/onoff-service-contract.lib.php';
        if (is_file($lib)) {
            include_once $lib;
        }
        if (!function_exists('onoff_service_contract_access')) {
            return $empty;
        }
        $mbId = seosys300_current_mb_id();
        if ($mbId === '') {
            $mbId = seosys300_launch_mb_id();
        }
        $access = onoff_service_contract_access($mbId);
        return is_array($access) ? $access : $empty;
    }
}

if (!function_exists('seosys300_require_contract_clear')) {
    /**
     * When marketing contract is blocked, only allowlisted APIs may proceed.
     * Call after seosys300_require_login() on non-allowlisted endpoints.
     */
    function seosys300_require_contract_clear()
    {
        if (seosys300_is_admin()) {
            return;
        }
        $contract = seosys300_contract_access_payload();
        if (empty($contract['applies']) || empty($contract['blocked'])) {
            return;
        }
        $script = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : '';
        $allow = (
            strpos($script, '/api/session') !== false
            || strpos($script, '/api/contract/') !== false
            || strpos($script, '/api/notifications/') !== false
        );
        if ($allow) {
            return;
        }
        seosys300_json_error(403, 'contract_required', '서비스 계약 체결(또는 승인) 후 이용할 수 있습니다.');
    }
}

if (!function_exists('seosys300_require_login')) {
    function seosys300_require_login()
    {
        if (!seosys300_is_member()) {
            seosys300_json_error(401, 'unauthorized', '로그인이 필요합니다.');
        }
        seosys300_require_launch_access();
        seosys300_require_contract_clear();
    }
}

if (!function_exists('seosys300_enrollment_state')) {
    function seosys300_enrollment_state()
    {
        $courseId = 'any';
        $open = array(
            'required' => false,
            'access' => true,
            'status' => '',
            'courseId' => $courseId,
        );
        if (!function_exists('edu_platform_is_request') || !edu_platform_is_request()) {
            return $open;
        }
        if (!seosys300_is_member()) {
            return array(
                'required' => true,
                'access' => false,
                'status' => '',
                'courseId' => $courseId,
            );
        }
        if (seosys300_is_admin()) {
            return array(
                'required' => true,
                'access' => true,
                'status' => 'admin',
                'courseId' => $courseId,
            );
        }

        $lib = dirname(__FILE__) . '/../../../lib/onoff-education.lib.php';
        if (is_file($lib)) {
            include_once $lib;
        }
        $mbId = seosys300_launch_mb_id();
        $active = function_exists('onoff_education_platform_grant_enrollment')
            ? onoff_education_platform_grant_enrollment('any')
            : null;
        if (!$active && function_exists('onoff_education_get_active_enrollment')) {
            $active = onoff_education_get_active_enrollment($mbId, 'any');
        }
        // The ONOFF portal and the education platform can issue different
        // member IDs for the same unified account. Enrollments are created
        // from the ONOFF identity, so fall back to the verified account email
        // when the education identity does not match that enrollment row.
        $member = seosys300_public_member();
        $email = strtolower(trim((string) ($member['mbEmail'] ?? '')));
        if (
            !$active
            && $email !== ''
            && function_exists('onoff_education_enrollment_table')
            && function_exists('sql_fetch')
            && function_exists('onoff_education_platform_course_ids')
        ) {
            $table = onoff_education_enrollment_table();
            $safeEmail = sql_real_escape_string($email);
            $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
            $safeNow = sql_real_escape_string($now);
            $courseList = array();
            foreach (onoff_education_platform_course_ids() as $cid) {
                $courseList[] = "'" . sql_real_escape_string($cid) . "'";
            }
            $inCourses = implode(',', $courseList);
            $activeByEmail = sql_fetch(
                " select *
                    from {$table}
                   where lower(email) = '{$safeEmail}'
                     and course_id in ({$inCourses})
                     and status = 'active'
                     and (starts_at is null or starts_at = '' or starts_at <= '{$safeNow}')
                     and (ends_at is null or ends_at = '' or ends_at >= '{$safeNow}')
                   order by en_id desc
                   limit 1 "
            );
            if (!empty($activeByEmail['en_id'])) {
                $active = $activeByEmail;
            }
        }
        $status = $active ? 'active' : 'none';
        $resolvedCourse = $active ? (string) ($active['course_id'] ?? $courseId) : $courseId;
        if (!$active && function_exists('onoff_education_enrollment_table') && function_exists('sql_fetch') && function_exists('onoff_education_platform_course_ids')) {
            $table = onoff_education_enrollment_table();
            $safe = sql_real_escape_string($mbId);
            $emailWhere = $email !== '' ? " or lower(email) = '" . sql_real_escape_string($email) . "'" : '';
            $courseList = array();
            foreach (onoff_education_platform_course_ids() as $cid) {
                $courseList[] = "'" . sql_real_escape_string($cid) . "'";
            }
            $inCourses = implode(',', $courseList);
            $latest = sql_fetch(" select status, course_id from {$table} where (mb_id = '{$safe}'{$emailWhere}) and course_id in ({$inCourses}) order by en_id desc limit 1 ");
            if (!empty($latest['status'])) {
                $status = (string) $latest['status'];
                $resolvedCourse = (string) ($latest['course_id'] ?? $resolvedCourse);
            }
        }

        $access = (bool) $active;
        $scLib = dirname(__FILE__) . '/../../../lib/onoff-service-contract.lib.php';
        if (is_file($scLib)) {
            include_once $scLib;
        }
        // Marketing / combined: allow platform entry while contract is pending/review so the contract menu works.
        if (
            !$access
            && in_array($status, array('pending_contract', 'pending_deposit'), true)
            && function_exists('onoff_service_contract_applies_course')
            && onoff_service_contract_applies_course($resolvedCourse)
        ) {
            $access = ($status === 'pending_contract');
        }
        if (!$access && function_exists('onoff_service_contract_access')) {
            $scAccess = onoff_service_contract_access($mbId);
            if (!empty($scAccess['applies']) && in_array((string) ($scAccess['status'] ?? ''), array('pending', 'in_progress', 'review_pending', 'rejected', 'renewal'), true)) {
                $access = true;
                if ($resolvedCourse === 'any' || $resolvedCourse === '') {
                    $resolvedCourse = (string) ($scAccess['courseId'] ?? $resolvedCourse);
                }
            }
        }

        return array(
            'required' => true,
            'access' => $access,
            'status' => $status,
            'courseId' => $resolvedCourse,
        );
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

        $enrollment = seosys300_enrollment_state();
        $launch = seosys300_launch_public_state();
        // The enrollment gate is evaluated by the SPA before the launch gate.
        // Once a member is authenticated, launch mode must not replace the
        // active/pending enrollment decision with the generic preparation page.
        if ($authenticated) {
            $launch = array(
                'launchMode' => 'all',
                'launchAllowed' => true,
            );
        }

        return array(
            'authenticated' => $authenticated,
            'isAdmin' => $authenticated && seosys300_is_admin(),
            'adminLevel' => ($authenticated && !empty($is_admin)) ? (string) $is_admin : '',
            'user' => seosys300_public_member(),
            'csrfToken' => $csrf,
            'launchMode' => $launch['launchMode'],
            'launchAllowed' => $launch['launchAllowed'],
            'enrollment' => $enrollment,
            'contract' => seosys300_contract_access_payload(),
        );
    }
}

if (!function_exists('seosys300_safe_return_path')) {
    /**
     * Allow only same-origin SEO SYSTEM 300 paths. Blocks open redirects.
     */
    function seosys300_safe_return_path($raw)
    {
        $prefix = function_exists('edu_platform_portal_prefix') ? edu_platform_portal_prefix() : '/seo-system-300';
        $fallback = ($prefix === '' ? '' : $prefix) . '/dashboard';
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
        $prefix = function_exists('edu_platform_portal_prefix') ? edu_platform_portal_prefix() : '/seo-system-300';
        $onPortal = $prefix === ''
            ? ($path === '/' || ($path !== '' && $path[0] === '/'))
            : ($path === $prefix || strpos($path, $prefix . '/') === 0);
        if (!$onPortal) {
            return $fallback;
        }
        return $url;
    }
}
