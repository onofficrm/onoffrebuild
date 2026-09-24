<?php
/**
 * ONOFF education enrollments — CRM staff API.
 *
 * Auth: same token as contracts (Bearer / X-ONOFF-Contract-Token) or GNUBoard super-admin.
 *
 * GET  (no action)     → list enrollments (+ statusCounts)
 * GET  ?action=pending → pending_deposit queue for CRM alerts
 * POST { action: approve|update, enId, ... }
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__, 2) . '/common.php';
require_once G5_LIB_PATH . '/onoff-education.lib.php';

function onoff_crm_education_cors()
{
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim((string) $_SERVER['HTTP_ORIGIN']) : '';
    if ($origin === 'https://crm.icrm.co.kr') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: false');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-ONOFF-Contract-Token, X-Api-Token');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

function onoff_crm_education_json($payload, $status = 200)
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    onoff_crm_education_cors();
    http_response_code((int) $status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_crm_education_ok($data, $status = 200)
{
    onoff_crm_education_json(array('ok' => true, 'data' => $data), $status);
}

function onoff_crm_education_fail($code, $message, $status)
{
    onoff_crm_education_json(array(
        'ok' => false,
        'error' => array(
            'code' => (string) $code,
            'message' => (string) $message,
        ),
    ), $status);
}

function onoff_crm_education_read_body()
{
    $raw = file_get_contents('php://input');
    $body = json_decode((string) $raw, true);
    return is_array($body) ? $body : array();
}

function onoff_crm_education_bearer_token()
{
    $header = isset($_SERVER['HTTP_AUTHORIZATION']) ? (string) $_SERVER['HTTP_AUTHORIZATION'] : '';
    if ($header === '' && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if ($header !== '' && preg_match('/^\s*Bearer\s+(\S+)\s*$/i', $header, $m)) {
        return (string) $m[1];
    }
    if (!empty($_SERVER['HTTP_X_ONOFF_CONTRACT_TOKEN'])) {
        return trim((string) $_SERVER['HTTP_X_ONOFF_CONTRACT_TOKEN']);
    }
    if (!empty($_SERVER['HTTP_X_API_TOKEN'])) {
        return trim((string) $_SERVER['HTTP_X_API_TOKEN']);
    }
    return null;
}

/**
 * @return array{actor_type:string,actor_mb_id:string}
 */
function onoff_crm_education_require_auth()
{
    global $is_admin, $member;

    $bearer = onoff_crm_education_bearer_token();
    if ($bearer !== null) {
        if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
            onoff_crm_education_fail('not_configured', 'CRM API token is not configured.', 503);
        }
        if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
            onoff_crm_education_fail('unauthorized', 'Invalid API token.', 401);
        }
        return array('actor_type' => 'crm', 'actor_mb_id' => 'crm');
    }

    if (isset($is_admin) && $is_admin === 'super') {
        $mb_id = is_array($member) ? (string) ($member['mb_id'] ?? '') : '';
        if ($mb_id === '') {
            $mb_id = 'admin';
        }
        return array('actor_type' => 'admin', 'actor_mb_id' => $mb_id);
    }

    onoff_crm_education_fail('unauthorized', 'Authentication required.', 401);
}

function onoff_crm_education_serialize($row)
{
    if (!$row || !is_array($row)) {
        return null;
    }
    $base = onoff_education_serialize_enrollment($row);
    if (!$base) {
        return null;
    }
    $base['phone'] = (string) ($row['phone'] ?? '');
    $base['email'] = (string) ($row['email'] ?? '');
    $base['admin_memo'] = (string) ($row['admin_memo'] ?? '');
    return $base;
}

function onoff_crm_education_status_counts()
{
    $table = onoff_education_enrollment_table();
    $counts = array(
        'pending_deposit' => 0,
        'pending_contract' => 0,
        'active' => 0,
        'expired' => 0,
        'cancelled' => 0,
    );
    $result = sql_query(" select status, count(*) as cnt from {$table} group by status ");
    while ($row = sql_fetch_array($result)) {
        $status = onoff_education_normalize_status($row['status']);
        if (isset($counts[$status])) {
            $counts[$status] = (int) $row['cnt'];
        }
    }
    return $counts;
}

onoff_crm_education_cors();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$auth = onoff_crm_education_require_auth();
onoff_education_ensure_table();
$table = onoff_education_enrollment_table();
$action = isset($_GET['action']) ? trim((string) $_GET['action']) : '';

if ($method === 'GET' && ($action === '' || $action === 'list')) {
    $status_raw = isset($_GET['status']) ? trim((string) $_GET['status']) : '';
    $status = '';
    if ($status_raw !== '' && $status_raw !== 'all') {
        $status = onoff_education_normalize_status($status_raw);
    }
    $stx = isset($_GET['stx']) ? trim(strip_tags((string) $_GET['stx'])) : '';
    $mb_id = isset($_GET['mb_id']) ? preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $_GET['mb_id']) : '';
    $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
    $per = isset($_GET['per']) ? max(1, min(200, (int) $_GET['per'])) : 50;

    $where = ' where (1) ';
    if ($status !== '') {
        $where .= " and status = '" . sql_real_escape_string($status) . "' ";
    }
    if ($mb_id !== '') {
        $where .= " and mb_id = '" . sql_real_escape_string($mb_id) . "' ";
    }
    if ($stx !== '') {
        $safe = sql_real_escape_string($stx);
        $where .= " and (mb_id like '%{$safe}%' or applicant_name like '%{$safe}%' or phone like '%{$safe}%' or email like '%{$safe}%' or course_id like '%{$safe}%') ";
    }

    $count_row = sql_fetch(" select count(*) as cnt from {$table} {$where} ");
    $total = (int) ($count_row['cnt'] ?? 0);
    $from = ($page - 1) * $per;
    $items = array();
    $result = sql_query(" select * from {$table} {$where} order by en_id desc limit {$from}, {$per} ");
    while ($row = sql_fetch_array($result)) {
        $items[] = onoff_crm_education_serialize($row);
    }

    onoff_crm_education_ok(array(
        'items' => $items,
        'page' => $page,
        'per' => $per,
        'total' => $total,
        'statusCounts' => onoff_crm_education_status_counts(),
        'actor' => $auth,
    ));
}

if ($method === 'GET' && $action === 'pending') {
    $since_id = isset($_GET['sinceId']) ? max(0, (int) $_GET['sinceId']) : 0;
    $where = " where status = 'pending_deposit' ";
    if ($since_id > 0) {
        $where .= ' and en_id > ' . (int) $since_id . ' ';
    }
    $items = array();
    $result = sql_query(" select * from {$table} {$where} order by en_id desc limit 50 ");
    while ($row = sql_fetch_array($result)) {
        $items[] = onoff_crm_education_serialize($row);
    }
    $counts = onoff_crm_education_status_counts();
    onoff_crm_education_ok(array(
        'items' => $items,
        'pendingCount' => (int) ($counts['pending_deposit'] ?? 0),
        'statusCounts' => $counts,
    ));
}

if ($method === 'POST') {
    $body = onoff_crm_education_read_body();
    $post_action = isset($body['action']) ? trim((string) $body['action']) : 'approve';
    $en_id = isset($body['enId']) ? (int) $body['enId'] : (isset($body['en_id']) ? (int) $body['en_id'] : 0);
    if ($en_id < 1) {
        onoff_crm_education_fail('bad_request', 'enId is required.', 400);
    }
    $before = onoff_education_get_enrollment($en_id);
    if (!$before) {
        onoff_crm_education_fail('not_found', 'Enrollment not found.', 404);
    }

    if ($post_action === 'approve') {
        // CRM grants lecture permission only: pending_deposit → pending_contract.
        // Never jump to active (contract-signing flow must remain intact).
        $current = onoff_education_normalize_status($before['status'] ?? '');
        if ($current !== 'pending_deposit') {
            onoff_crm_education_fail(
                'invalid_status',
                'approve is only allowed from pending_deposit (current: ' . $current . ').',
                409
            );
        }
        $next_status = 'pending_contract';
        $memo = isset($body['adminMemo']) ? (string) $body['adminMemo'] : (string) ($before['admin_memo'] ?? '');
        if ($memo === '') {
            $memo = 'CRM 강의권한 승인 (' . date('Y-m-d H:i:s') . ', actor=' . $auth['actor_mb_id'] . ')';
        }
        onoff_education_update_enrollment($en_id, array(
            'mb_id' => $before['mb_id'],
            'status' => $next_status,
            'deposit_amount' => $before['deposit_amount'] ?? 0,
            'depositor_name' => $before['depositor_name'] ?? '',
            'starts_at' => $before['starts_at'] ?? null,
            'ends_at' => $before['ends_at'] ?? null,
            'admin_memo' => $memo,
        ));
        $after = onoff_education_get_enrollment($en_id);
        onoff_crm_education_ok(array(
            'enrollment' => onoff_crm_education_serialize($after),
            'message' => '강의 권한을 승인했습니다. 고객은 계약 서명 단계로 진행합니다.',
        ));
    }

    // CRM is read + approve only. Arbitrary status writes (esp. → active) stay on GNUBoard admin.
    onoff_crm_education_fail('bad_request', 'Unsupported action. Use action=approve.', 400);
}

onoff_crm_education_fail('method_not_allowed', 'Method not allowed.', 405);
