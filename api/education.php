<?php
/**
 * ONOFF Education API.
 * - GET  ?action=access   : member classroom access (+ requiresContract)
 * - GET  ?action=contract : CAP-style education contract state
 * - POST ?action=contract : draft | sign
 * - GET  ?action=admin    : canManageAdmin flag
 * - GET  ?action=list     : admin enrollment list
 * - POST ?action=update   : admin enrollment update (+ Kakao on activate)
 *
 * Do not emit a host-only GNUBoard PHPSESSID — it shadows Domain=.icrm.co.kr Core auth.
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__) . '/common.php';
require_once G5_PATH . '/lib/branded-auth/bootstrap.php';
require_once G5_LIB_PATH . '/onoff-education.lib.php';
if (is_file(G5_LIB_PATH . '/onoff-education-admin-auth.lib.php')) {
    require_once G5_LIB_PATH . '/onoff-education-admin-auth.lib.php';
}

use OnoffMarketing\BrandedAuth\AuthErrors;
use OnoffMarketing\BrandedAuth\BrandedAuthConfig;
use OnoffMarketing\BrandedAuth\CookieJar;
use OnoffMarketing\BrandedAuth\PlatformAuthService;

function onoff_education_api_json($payload, $status = 200)
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
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

function onoff_education_api_body()
{
    $raw = file_get_contents('php://input');
    $body = json_decode((string) $raw, true);
    return is_array($body) ? $body : (is_array($_POST) ? $_POST : array());
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

function onoff_education_api_serialize_admin($row)
{
    $base = onoff_education_serialize_enrollment($row);
    if (!$base) {
        return null;
    }
    $base['phone'] = (string) ($row['phone'] ?? '');
    $base['email'] = (string) ($row['email'] ?? '');
    $base['admin_memo'] = (string) ($row['admin_memo'] ?? '');
    $base['kakao_last_error'] = (string) ($row['kakao_last_error'] ?? '');
    return $base;
}

function onoff_education_api_require_core_session()
{
    if (!BrandedAuthConfig::isEnabled() || !BrandedAuthConfig::isPlatformAuthEnabled() || !BrandedAuthConfig::isConfigured()) {
        onoff_education_api_error(AuthErrors::NOT_CONFIGURED, AuthErrors::userMessage(AuthErrors::NOT_CONFIGURED), 503);
    }
    try {
        $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
        $session = PlatformAuthService::getSession($cookies);
        CookieJar::emitBrowserSessionCookies(
            !empty($session['authenticated']),
            is_array($session['data']) ? $session['data'] : array(),
            $session['setCookies']
        );
        if (!empty($session['sessionExpired'])) {
            CookieJar::clearBrowserSessionCookies();
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
        return array($mb_id, $data, $cookies);
    } catch (Throwable $e) {
        onoff_education_api_error(AuthErrors::CORE_UNAVAILABLE, AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE), 502);
    }
}

function onoff_education_api_require_admin()
{
    global $is_admin, $member;
    onoff_education_api_require_core_session();
    if (function_exists('onoff_education_try_platform_admin_adopt')) {
        onoff_education_try_platform_admin_adopt();
    }
    if ($is_admin !== 'super') {
        onoff_education_api_error('FORBIDDEN', '최고관리자만 접근할 수 있습니다.', 403);
    }
    return (string) ($member['mb_id'] ?? '');
}

function onoff_education_api_maybe_send_kakao($en_id, $before, $after)
{
    if (!is_array($after)
        || $after['status'] !== 'active'
        || (is_array($before) && $before['status'] === 'active')
        || !empty($after['kakao_active_sent_at'])) {
        return;
    }
    $notifier = G5_PATH . '/components/inquiry-notifier.php';
    if (!is_file($notifier)) {
        return;
    }
    include_once $notifier;
    if (!function_exists('onoff_kakao_alimtalk_is_enabled')
        || !onoff_kakao_alimtalk_is_enabled()
        || !function_exists('onoff_send_education_active_kakao_notification')) {
        return;
    }
    $kakao_result = onoff_send_education_active_kakao_notification($after);
    if (function_exists('onoff_education_mark_kakao_active_notification')) {
        $kakao_sent = !empty($kakao_result['ok']) && empty($kakao_result['skipped']);
        $kakao_message = !empty($kakao_result['skipped']) ? '' : (isset($kakao_result['message']) ? $kakao_result['message'] : '');
        onoff_education_mark_kakao_active_notification($en_id, $kakao_sent, $kakao_message);
    }
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : 'access';
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($action === 'access') {
    if ($method !== 'GET') {
        onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
    }
    list($mb_id, $data) = onoff_education_api_require_core_session();
    $course_id = isset($_GET['course_id']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $_GET['course_id']) : '';
    if ($course_id === '' || $course_id === 'any') {
        $course_id = 'any';
    }
    $active = onoff_education_get_active_enrollment($mb_id, $course_id);
    $pending_contract = $active ? null : onoff_education_get_pending_contract_enrollment($mb_id, $course_id);
    $latest_course = $course_id === 'any'
        ? (string) (($active['course_id'] ?? $pending_contract['course_id'] ?? 'seo-geo-master'))
        : $course_id;
    $latest = $active ?: ($pending_contract ?: onoff_education_api_latest_enrollment($mb_id, $latest_course));
    if (!$latest && $course_id === 'any') {
        foreach (onoff_education_platform_course_ids() as $cid) {
            $latest = onoff_education_api_latest_enrollment($mb_id, $cid);
            if ($latest) {
                $latest_course = $cid;
                break;
            }
        }
    }
    $resolved_course = (string) (($active['course_id'] ?? $pending_contract['course_id'] ?? $latest['course_id'] ?? $latest_course));
    // If both education + marketing are pending from combined package, prefer combined contract path.
    $contract_path_course = $resolved_course;
    if ($pending_contract) {
        $edu_pending = onoff_education_get_pending_contract_enrollment($mb_id, 'seo-geo-master');
        $mkt_pending = onoff_education_get_pending_contract_enrollment($mb_id, 'marketing-service');
        if ($edu_pending && $mkt_pending) {
            $same_wr = ((int) ($edu_pending['contract_wr_id'] ?? 0) > 0)
                && ((int) ($edu_pending['contract_wr_id'] ?? 0) === (int) ($mkt_pending['contract_wr_id'] ?? 0));
            if ($same_wr) {
                $contract_path_course = 'education-marketing';
            }
        }
    }
    $platform_entry_url = '';
    if ($active && function_exists('onoff_education_issue_platform_grant')) {
        onoff_education_issue_platform_grant($active);
    }
    if ($active && function_exists('onoff_education_create_platform_grant_token')) {
        $platform_ticket = onoff_education_create_platform_grant_token($active, 120);
        if ($platform_ticket !== '') {
            $platform_entry_url = '/plugin/seo-system-300/classroom-entry.php?ticket=' . rawurlencode($platform_ticket);
        }
    }
    onoff_education_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array(
            'access' => (bool) $active,
            'requiresContract' => (bool) $pending_contract,
            'course_id' => $resolved_course,
            'mb_id' => $mb_id,
            'member_name' => (string) ($data['display_name'] ?? $data['mb_name'] ?? ''),
            'enrollment' => onoff_education_serialize_enrollment($latest),
            'contractPath' => onoff_education_contract_path_for_course($contract_path_course),
            'platform_entry_url' => $platform_entry_url,
        ),
    ));
}

if ($action === 'contract') {
    list($mb_id, $data) = onoff_education_api_require_core_session();
    $body = ($method === 'POST') ? onoff_education_api_body() : array();
    $course_id = isset($_GET['course_id']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $_GET['course_id']) : '';
    if ($course_id === '' && isset($body['course_id'])) {
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $body['course_id']);
    }
    if ($course_id === '') {
        $course_id = 'seo-geo-master';
    }

    if ($method === 'GET') {
        $state = onoff_education_contract_state_for_member($mb_id, $course_id);
        $state['member_name'] = (string) ($data['display_name'] ?? $data['mb_name'] ?? '');
        onoff_education_api_json(array(
            'ok' => true,
            'success' => true,
            'data' => $state,
        ));
    }

    if ($method !== 'POST') {
        onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
    }

    $sub = isset($body['action']) ? (string) $body['action'] : 'draft';
    $pending = onoff_education_get_pending_contract_enrollment($mb_id, $course_id);
    if (!$pending) {
        onoff_education_api_error('CONTRACT_NOT_REQUIRED', '작성할 수강 계약이 없습니다. 입금 확인(권한 부여) 후 작성할 수 있습니다.', 403);
    }
    $en_id = (int) $pending['en_id'];
    $form = array(
        'partyName' => $body['partyName'] ?? $body['party_name'] ?? '',
        'partyPhone' => $body['partyPhone'] ?? $body['party_phone'] ?? '',
        'partyEmail' => $body['partyEmail'] ?? $body['party_email'] ?? '',
        'agreements' => $body['agreements'] ?? array(),
        'packageCourseId' => $course_id,
    );

    if ($sub === 'draft') {
        onoff_education_save_contract_draft($en_id, $form);
        onoff_education_api_json(array(
            'ok' => true,
            'success' => true,
            'data' => onoff_education_contract_state_for_member($mb_id, $course_id),
        ));
    }

    if ($sub === 'sign') {
        $signature = (string) ($body['signatureData'] ?? $body['signature_data'] ?? '');
        $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
        $before = $pending;
        $result = onoff_education_sign_contract($en_id, $form, $signature, $ip);
        if (empty($result['ok'])) {
            onoff_education_api_error('VALIDATION', (string) ($result['message'] ?? '계약 서명에 실패했습니다.'), 400);
        }
        $after = $result['enrollment'];
        onoff_education_api_maybe_send_kakao($en_id, $before, $after);
        $after = onoff_education_get_enrollment($en_id);
        onoff_education_api_json(array(
            'ok' => true,
            'success' => true,
            'data' => array(
                'message' => (string) ($result['message'] ?? ''),
                'enrollment' => onoff_education_serialize_enrollment($after),
                'access' => true,
                'requiresContract' => false,
                'contract' => onoff_education_contract_state_for_member($mb_id, $course_id),
            ),
        ));
    }

    onoff_education_api_error('VALIDATION', 'Unknown contract action', 400);
}

if ($action === 'admin') {
    if ($method !== 'GET') {
        onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
    }
    onoff_education_api_require_core_session();
    $can = false;
    if (function_exists('onoff_education_try_platform_admin_adopt')) {
        $can = (bool) onoff_education_try_platform_admin_adopt();
    }
    global $is_admin;
    if ($is_admin === 'super') {
        $can = true;
    }
    onoff_education_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array('canManageAdmin' => $can),
    ));
}

if ($action === 'list') {
    if ($method !== 'GET') {
        onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
    }
    onoff_education_api_require_admin();
    onoff_education_ensure_table();
    $table = onoff_education_enrollment_table();

    $status = isset($_GET['status']) ? onoff_education_normalize_status($_GET['status']) : '';
    // Empty filter: normalize may coerce — allow blank via raw
    if (!isset($_GET['status']) || trim((string) $_GET['status']) === '' || trim((string) $_GET['status']) === 'all') {
        $status = '';
    }
    $stx = isset($_GET['stx']) ? trim(strip_tags((string) $_GET['stx'])) : '';
    $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
    $rows = 20;

    $where = ' where (1) ';
    if ($status !== '') {
        $where .= " and status = '" . sql_real_escape_string($status) . "' ";
    }
    if ($stx !== '') {
        $safe = sql_real_escape_string($stx);
        $where .= " and (mb_id like '%{$safe}%' or applicant_name like '%{$safe}%' or phone like '%{$safe}%' or email like '%{$safe}%' or course_id like '%{$safe}%' or admin_memo like '%{$safe}%') ";
    }

    $count_row = sql_fetch(" select count(*) as cnt from {$table} {$where} ");
    $total_count = (int) ($count_row['cnt'] ?? 0);
    $total_page = max(1, (int) ceil($total_count / $rows));
    $from_record = ($page - 1) * $rows;

    $status_counts = array(
        'pending_deposit' => 0,
        'pending_contract' => 0,
        'active' => 0,
        'expired' => 0,
        'cancelled' => 0,
    );
    $count_result = sql_query(" select status, count(*) as cnt from {$table} group by status ");
    while ($count_row = sql_fetch_array($count_result)) {
        $count_status = onoff_education_normalize_status($count_row['status']);
        if (isset($status_counts[$count_status])) {
            $status_counts[$count_status] = (int) $count_row['cnt'];
        }
    }

    $items = array();
    $result = sql_query(" select * from {$table} {$where} order by en_id desc limit {$from_record}, {$rows} ");
    while ($row = sql_fetch_array($result)) {
        $items[] = onoff_education_api_serialize_admin($row);
    }

    onoff_education_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array(
            'items' => $items,
            'page' => $page,
            'totalPage' => $total_page,
            'totalCount' => $total_count,
            'statusCounts' => $status_counts,
            'filters' => array('status' => $status, 'stx' => $stx),
        ),
    ));
}

if ($action === 'update') {
    if ($method !== 'POST') {
        onoff_education_api_error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
    }
    onoff_education_api_require_admin();
    $body = onoff_education_api_body();
    $en_id = isset($body['en_id']) ? (int) $body['en_id'] : 0;
    if ($en_id < 1) {
        onoff_education_api_error('VALIDATION', '수강권 ID가 올바르지 않습니다.', 400);
    }
    $before = onoff_education_get_enrollment($en_id);
    if (!$before) {
        onoff_education_api_error('NOT_FOUND', '수강권을 찾을 수 없습니다.', 404);
    }
    onoff_education_update_enrollment($en_id, array(
        'mb_id' => $body['mb_id'] ?? $before['mb_id'],
        'status' => $body['status'] ?? $before['status'],
        'deposit_amount' => $body['deposit_amount'] ?? $before['deposit_amount'],
        'depositor_name' => $body['depositor_name'] ?? $before['depositor_name'],
        'starts_at' => $body['starts_at'] ?? $before['starts_at'],
        'ends_at' => $body['ends_at'] ?? $before['ends_at'],
        'admin_memo' => $body['admin_memo'] ?? $before['admin_memo'],
    ));
    $after = onoff_education_get_enrollment($en_id);
    onoff_education_api_maybe_send_kakao($en_id, $before, $after);
    $after = onoff_education_get_enrollment($en_id);
    onoff_education_api_json(array(
        'ok' => true,
        'success' => true,
        'data' => array(
            'enrollment' => onoff_education_api_serialize_admin($after),
        ),
    ));
}

onoff_education_api_error('NOT_FOUND', 'Unknown education action', 404);
