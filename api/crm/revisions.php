<?php
/**
 * CRM API for SEO System 300 homepage revision tickets.
 *
 * Source of truth stays g5_seosys300_revision_tickets. CRM reads tickets and
 * posts staff feedback. It must not write the table directly.
 *
 * Auth matches api/crm/website-orders.php:
 *   X-ONOFF-Contract-Token (Cafe24 drops Authorization)
 */
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_cookies', '0');
    ini_set('session.use_only_cookies', '1');
}

include_once dirname(__DIR__, 2) . '/common.php';
include_once G5_PATH . '/lib/onoff-education.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/tables.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/db.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/constants.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/validate.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/upload.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/revision.lib.php';

if (!function_exists('seosys300_log')) {
    function seosys300_log($message)
    {
    }
}
if (!function_exists('seosys300_env')) {
    function seosys300_env($name, $default = '')
    {
        $raw = getenv($name);
        return ($raw === false || $raw === '') ? $default : (string) $raw;
    }
}
if (!function_exists('seosys300_current_mb_id')) {
    function seosys300_current_mb_id()
    {
        return '';
    }
}
if (!function_exists('seosys300_is_admin')) {
    function seosys300_is_admin()
    {
        return false;
    }
}

header('Content-Type: application/json; charset=utf-8');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
if ($origin === 'https://crm.icrm.co.kr') {
    header('Access-Control-Allow-Origin: https://crm.icrm.co.kr');
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-ONOFF-Contract-Token, X-Api-Token, X-ONOFF-CRM-Actor');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function onoff_crm_revision_fail($error, $message, $status)
{
    if (!headers_sent()) {
        http_response_code((int) $status);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(array(
        'ok' => false,
        'error' => (string) $error,
        'message' => (string) $message,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

if (!function_exists('seosys300_json_error')) {
    function seosys300_json_error($status, $code, $message)
    {
        onoff_crm_revision_fail($code, $message, $status);
    }
}

function onoff_crm_revision_token()
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

$bearer = onoff_crm_revision_token();
if ($bearer === null) {
    onoff_crm_revision_fail('unauthorized', 'Authentication required.', 401);
}
if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
    onoff_crm_revision_fail('not_configured', 'CRM API token is not configured.', 503);
}
if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
    onoff_crm_revision_fail('unauthorized', 'Invalid API token.', 401);
}

function onoff_crm_revision_actor()
{
    $actor = isset($_SERVER['HTTP_X_ONOFF_CRM_ACTOR']) ? (string) $_SERVER['HTTP_X_ONOFF_CRM_ACTOR'] : 'crm';
    $actor = preg_replace('/[^a-zA-Z0-9_\-]/', '', $actor);
    if ($actor === '') {
        $actor = 'crm';
    }
    return substr($actor, 0, 100);
}

function onoff_crm_revision_enrich($item)
{
    global $g5;
    $oid = isset($item['orderId']) ? (int) $item['orderId'] : 0;
    $order = null;
    if ($oid > 0 && !empty($g5['seosys300_website_orders_table'])) {
        $table = $g5['seosys300_website_orders_table'];
        $order = seosys300_fetch("SELECT id, order_no, site_name, email, mb_id, status FROM `{$table}` WHERE id = {$oid} LIMIT 1");
    }
    $mbId = $order ? (string) $order['mb_id'] : (string) ($item['mbId'] ?? '');
    $memberEmail = '';
    $memberName = '';
    if ($mbId !== '' && !empty($g5['member_table'])) {
        $esc = seosys300_esc($mbId);
        $member = seosys300_fetch("SELECT mb_email, mb_name FROM `{$g5['member_table']}` WHERE mb_id = '{$esc}' LIMIT 1");
        if ($member) {
            $memberEmail = (string) $member['mb_email'];
            $memberName = (string) $member['mb_name'];
        }
    }
    if ($mbId !== '' && ($memberEmail === '' || $memberName === '') && function_exists('onoff_education_enrollment_table')) {
        $enrollTable = onoff_education_enrollment_table();
        $esc = seosys300_esc($mbId);
        $enroll = seosys300_fetch("SELECT applicant_name, email FROM `{$enrollTable}` WHERE mb_id = '{$esc}' ORDER BY en_id DESC LIMIT 1");
        if ($enroll) {
            if ($memberName === '') {
                $memberName = (string) ($enroll['applicant_name'] ?? '');
            }
            if ($memberEmail === '') {
                $memberEmail = (string) ($enroll['email'] ?? '');
            }
        }
    }
    $item['orderNo'] = $order ? (string) $order['order_no'] : '';
    $item['siteName'] = $order ? (string) $order['site_name'] : '';
    $item['orderStatus'] = $order ? (string) $order['status'] : '';
    $item['contactEmail'] = $order ? (string) $order['email'] : '';
    $item['memberEmail'] = $memberEmail;
    $item['memberName'] = $memberName;
    if (isset($item['annotation']) && is_array($item['annotation'])) {
        $snapId = isset($item['annotation']['snapshotFileId']) ? (int) $item['annotation']['snapshotFileId'] : 0;
        if ($snapId > 0) {
            $item['annotation']['snapshotUrl'] = '/api/crm/revisions.php?file=' . $snapId;
        }
    }
    if (!empty($item['files']) && is_array($item['files'])) {
        foreach ($item['files'] as $idx => $file) {
            $fid = isset($file['id']) ? (int) $file['id'] : 0;
            if ($fid > 0) {
                $item['files'][$idx]['downloadUrl'] = '/api/crm/revisions.php?file=' . $fid;
            }
        }
    }
    return $item;
}

function onoff_crm_revision_send_file($fileId)
{
    $fileId = (int) $fileId;
    if ($fileId < 1) {
        onoff_crm_revision_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $row = seosys300_revision_get_file_row($fileId);
    if (!$row) {
        onoff_crm_revision_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $path = rtrim(seosys300_upload_root(), '/') . '/' . ltrim((string) $row['rel_path'], '/');
    $real_root = realpath(seosys300_upload_root());
    $real_file = realpath($path);
    if ($real_root === false || $real_file === false || strpos($real_file, $real_root) !== 0 || !is_file($real_file)) {
        onoff_crm_revision_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $name = str_replace(array("\r", "\n", '"'), '', (string) $row['original_name']);
    $mime = strtolower((string) $row['mime_type']);
    $imageMimes = array(
        'image/jpeg' => 'image/jpeg',
        'image/jpg' => 'image/jpeg',
        'image/png' => 'image/png',
        'image/gif' => 'image/gif',
        'image/webp' => 'image/webp',
    );
    if (isset($imageMimes[$mime])) {
        $mime = $imageMimes[$mime];
    } else {
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $byExt = array('jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp');
        $mime = isset($byExt[$ext]) ? $byExt[$ext] : 'application/octet-stream';
    }
    $inline = $mime !== 'application/octet-stream';
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . (string) filesize($real_file));
    header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . '; filename="' . $name . '"');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    readfile($real_file);
    exit;
}

seosys300_revision_ensure_tables();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && isset($_GET['file'])) {
    onoff_crm_revision_send_file((int) $_GET['file']);
}

if ($method === 'GET') {
    $ticketId = isset($_GET['ticketId']) ? (int) $_GET['ticketId'] : (isset($_GET['id']) ? (int) $_GET['id'] : 0);
    if ($ticketId > 0) {
        $detail = seosys300_revision_admin_detail($ticketId);
        echo json_encode(array(
            'ok' => true,
            'item' => onoff_crm_revision_enrich($detail),
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $status = isset($_GET['status']) ? trim((string) $_GET['status']) : 'open';
    $email = isset($_GET['email']) ? trim((string) $_GET['email']) : '';
    $sinceId = isset($_GET['sinceId']) ? (int) $_GET['sinceId'] : 0;
    $queue = seosys300_revision_admin_queue($status);
    $items = array();
    foreach ($queue['items'] as $item) {
        if ($sinceId > 0 && (int) $item['id'] <= $sinceId) {
            continue;
        }
        $enriched = onoff_crm_revision_enrich($item);
        if ($email !== '') {
            $hay = strtolower($enriched['contactEmail'] . ' ' . $enriched['memberEmail']);
            if (strpos($hay, strtolower($email)) === false) {
                continue;
            }
        }
        $items[] = $enriched;
    }
    echo json_encode(array(
        'ok' => true,
        'status' => $status,
        'total' => count($items),
        'items' => $items,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method !== 'POST') {
    onoff_crm_revision_fail('method_not_allowed', 'GET or POST only.', 405);
}

$raw = file_get_contents('php://input');
$input = json_decode($raw ? $raw : '', true);
if (!is_array($input)) {
    $input = $_POST;
}
$op = isset($input['action']) ? (string) $input['action'] : (isset($input['op']) ? (string) $input['op'] : '');
$op = strtolower(preg_replace('/[^a-z0-9_\-]/', '', $op));
$allowed = array('review', 'need_info', 'need-info', 'free', 'free_progress', 'quote', 'feedback', 'complete_feedback', 'comment', 'start', 'in_progress', 'complete', 'cancel', 'brief');
if (!in_array($op, $allowed, true)) {
    onoff_crm_revision_fail('unknown_action', 'Unsupported feedback action.', 400);
}
$input['op'] = $op;
unset($input['actorMbId'], $input['_actor_mb_id']);

$saved = seosys300_revision_admin_save($input, onoff_crm_revision_actor());
echo json_encode(array(
    'ok' => true,
    'item' => onoff_crm_revision_enrich($saved),
), JSON_UNESCAPED_UNICODE);
