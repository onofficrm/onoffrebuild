<?php
/**
 * CRM read API for SEO System 300 website orders.
 *
 * Source of truth stays g5_seosys300_website_orders.
 * GET lists submitted orders. POST updates status (progress follows the status)
 * and appends customer-visible feedback. CRM must not write other columns.
 *
 * Auth matches api/crm/education.php:
 *   Authorization: Bearer <ONOFF_CRM_CONTRACT_API_TOKEN>
 *   X-ONOFF-Contract-Token / X-Api-Token (Cafe24 drops Authorization)
 */
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_cookies', '0');
    ini_set('session.use_only_cookies', '1');
}

include_once dirname(__DIR__, 2) . '/common.php';
include_once G5_PATH . '/lib/onoff-education.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/tables.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/db.lib.php';

header('Content-Type: application/json; charset=utf-8');

$origin = isset($_SERVER['HTTP_ORIGIN']) ? (string) $_SERVER['HTTP_ORIGIN'] : '';
if ($origin === 'https://crm.icrm.co.kr') {
    header('Access-Control-Allow-Origin: https://crm.icrm.co.kr');
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-ONOFF-Contract-Token, X-Api-Token');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function onoff_crm_website_fail($error, $message, $status)
{
    http_response_code((int) $status);
    echo json_encode(array(
        'ok' => false,
        'error' => (string) $error,
        'message' => (string) $message,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_crm_website_token()
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

$bearer = onoff_crm_website_token();
if ($bearer === null) {
    onoff_crm_website_fail('unauthorized', 'Authentication required.', 401);
}
if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
    onoff_crm_website_fail('not_configured', 'CRM API token is not configured.', 503);
}
if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
    onoff_crm_website_fail('unauthorized', 'Invalid API token.', 401);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'POST') {
    onoff_crm_website_handle_update();
}
if ($method !== 'GET') {
    onoff_crm_website_fail('method_not_allowed', 'GET or POST only.', 405);
}
if (isset($_GET['file'])) {
    onoff_crm_website_send_file((int) $_GET['file']);
}

function onoff_crm_website_updates($extraJson)
{
    $data = json_decode((string) $extraJson, true);
    if (!is_array($data) || empty($data['customerUpdates']) || !is_array($data['customerUpdates'])) {
        return array();
    }
    $out = array();
    foreach ($data['customerUpdates'] as $item) {
        if (!is_array($item)) {
            continue;
        }
        $message = isset($item['message']) ? trim((string) $item['message']) : '';
        if ($message === '') {
            continue;
        }
        $files = array();
        if (isset($item['files']) && is_array($item['files'])) {
            foreach ($item['files'] as $file) {
                if (!is_array($file)) {
                    continue;
                }
                $fileId = isset($file['id']) ? (int) $file['id'] : 0;
                $name = isset($file['name']) ? trim((string) $file['name']) : '';
                if ($fileId < 1 || $name === '') {
                    continue;
                }
                $files[] = array(
                    'id' => $fileId,
                    'name' => $name,
                    'size' => isset($file['size']) ? (int) $file['size'] : 0,
                );
            }
        }
        $out[] = array(
            'id' => isset($item['id']) ? (string) $item['id'] : '',
            'message' => $message,
            'author' => isset($item['author']) ? substr(trim((string) $item['author']), 0, 40) : '',
            'createdAt' => isset($item['createdAt']) ? (string) $item['createdAt'] : '',
            'files' => $files,
        );
    }
    return $out;
}

function onoff_crm_website_staff_notes($extraJson)
{
    $data = json_decode((string) $extraJson, true);
    if (!is_array($data) || empty($data['staffNotes']) || !is_array($data['staffNotes'])) {
        return array();
    }
    $out = array();
    foreach ($data['staffNotes'] as $item) {
        if (!is_array($item)) {
            continue;
        }
        $message = isset($item['message']) ? trim((string) $item['message']) : '';
        if ($message === '') {
            continue;
        }
        $out[] = array(
            'id' => isset($item['id']) ? (string) $item['id'] : '',
            'message' => $message,
            'author' => isset($item['author']) ? substr(trim((string) $item['author']), 0, 40) : '',
            'createdAt' => isset($item['createdAt']) ? (string) $item['createdAt'] : '',
        );
    }
    return $out;
}

function onoff_crm_website_extra($extraJson)
{
    $data = json_decode((string) $extraJson, true);
    return is_array($data) ? $data : array();
}

function onoff_crm_website_string_list($value)
{
    if (is_string($value) && $value !== '') {
        $decoded = json_decode($value, true);
        if (is_array($decoded)) {
            $value = $decoded;
        } else {
            return array($value);
        }
    }
    if (!is_array($value)) {
        return array();
    }
    $out = array();
    foreach ($value as $item) {
        if (is_string($item) || is_numeric($item)) {
            $text = trim((string) $item);
            if ($text !== '') {
                $out[] = $text;
            }
        }
    }
    return $out;
}

function onoff_crm_website_contacts($extra)
{
    $src = isset($extra['contacts']) && is_array($extra['contacts']) ? $extra['contacts'] : array();
    $out = array();
    foreach ($src as $key => $value) {
        if (!is_string($key) || (!is_string($value) && !is_numeric($value))) {
            continue;
        }
        $text = trim((string) $value);
        if ($text === '') {
            continue;
        }
        $out[$key] = substr($text, 0, 200);
    }
    return $out;
}

function onoff_crm_website_relations($orderId)
{
    global $g5;
    $oid = (int) $orderId;
    $menus = array();
    $features = array();
    $references = array();
    $files = array();
    $menuRows = seosys300_fetch_all("SELECT label, parent_id FROM `{$g5['seosys300_website_menu_table']}` WHERE order_id = {$oid} ORDER BY sort_order ASC, id ASC");
    foreach ($menuRows as $row) {
        $label = trim((string) $row['label']);
        if ($label === '') {
            continue;
        }
        $menus[] = array(
            'label' => $label,
            'parentId' => (int) $row['parent_id'],
        );
    }
    $featureRows = seosys300_fetch_all("SELECT feature_key, feature_label FROM `{$g5['seosys300_website_features_table']}` WHERE order_id = {$oid} ORDER BY id ASC");
    foreach ($featureRows as $row) {
        $features[] = array(
            'key' => (string) $row['feature_key'],
            'label' => (string) ($row['feature_label'] !== '' ? $row['feature_label'] : $row['feature_key']),
        );
    }
    $refRows = seosys300_fetch_all("SELECT url, memo FROM `{$g5['seosys300_website_references_table']}` WHERE order_id = {$oid} ORDER BY sort_order ASC, id ASC");
    foreach ($refRows as $row) {
        $url = trim((string) $row['url']);
        if ($url === '') {
            continue;
        }
        $references[] = array(
            'url' => $url,
            'memo' => (string) $row['memo'],
        );
    }
    $fileRows = seosys300_fetch_all("SELECT id, category, original_name, file_size, memo FROM `{$g5['seosys300_website_files_table']}` WHERE order_id = {$oid} AND status <> 'deleted' ORDER BY id DESC");
    foreach ($fileRows as $row) {
        $files[] = array(
            'id' => (int) $row['id'],
            'category' => (string) $row['category'],
            'name' => (string) $row['original_name'],
            'size' => (int) $row['file_size'],
            'memo' => (string) $row['memo'],
        );
    }
    return array($menus, $features, $references, $files);
}

function onoff_crm_website_item($row)
{
    $extra = onoff_crm_website_extra(isset($row['extra_json']) ? $row['extra_json'] : '');
    list($menus, $features, $references, $files) = onoff_crm_website_relations((int) $row['id']);
    return array(
        'id' => (int) $row['id'],
        'orderNo' => (string) $row['order_no'],
        'projectId' => (int) $row['project_id'],
        'mbId' => (string) $row['mb_id'],
        'memberName' => (string) ((($row['mb_name'] ?? '') !== '') ? $row['mb_name'] : ($row['applicant_name'] ?? '')),
        'memberEmail' => (string) ((($row['mb_email'] ?? '') !== '') ? $row['mb_email'] : ($row['enroll_email'] ?? '')),
        'status' => (string) $row['status'],
        'siteName' => (string) $row['site_name'],
        'siteType' => (string) $row['site_type'],
        'purposes' => onoff_crm_website_string_list(isset($row['purposes']) ? $row['purposes'] : ''),
        'industry' => (string) $row['industry'],
        'region' => (string) $row['region'],
        'contactName' => (string) ($row['brand_name'] ?? ''),
        'contactPhone' => (string) ($row['phone'] ?? ''),
        'contactEmail' => (string) ($row['email'] ?? ''),
        'businessDescription' => (string) ($row['business_description'] ?? ''),
        'currentUrl' => (string) ($row['current_url'] ?? ''),
        'designStyle' => (string) ($row['design_style'] ?? ''),
        'primaryColor' => (string) ($row['primary_color'] ?? ''),
        'customColor' => (string) ($row['custom_color'] ?? ''),
        'targetRegion' => (string) ($row['target_region'] ?? ''),
        'secondaryStyle' => isset($extra['secondaryStyle']) ? (string) $extra['secondaryStyle'] : '',
        'colorPreset' => isset($extra['colorPreset']) ? (string) $extra['colorPreset'] : '',
        'accentColor' => isset($extra['accentColor']) ? (string) $extra['accentColor'] : '',
        'contacts' => onoff_crm_website_contacts($extra),
        'extraRequest' => isset($extra['extraRequest']) ? (string) $extra['extraRequest'] : '',
        'businessInfoNote' => isset($extra['businessInfoNote']) ? (string) $extra['businessInfoNote'] : '',
        'boardRequests' => onoff_crm_website_string_list(isset($extra['boardRequests']) ? $extra['boardRequests'] : array()),
        'programRequests' => onoff_crm_website_string_list(isset($extra['programRequests']) ? $extra['programRequests'] : array()),
        'menus' => $menus,
        'features' => $features,
        'references' => $references,
        'files' => $files,
        'progress' => (int) $row['progress'],
        'submittedAt' => (string) $row['submitted_at'],
        'updatedAt' => (string) $row['updated_at'],
        'customerUpdates' => onoff_crm_website_updates(isset($row['extra_json']) ? $row['extra_json'] : ''),
        'staffNotes' => onoff_crm_website_staff_notes(isset($row['extra_json']) ? $row['extra_json'] : ''),
    );
}

function onoff_crm_website_load_libs()
{
    $plugin = G5_PATH . '/plugin/seo-system-300/lib';
    include_once $plugin . '/constants.php';
    include_once $plugin . '/api.lib.php';
    include_once $plugin . '/website.lib.php';
    include_once $plugin . '/activity.lib.php';
    include_once $plugin . '/notify.lib.php';
    include_once $plugin . '/project.lib.php';
    include_once $plugin . '/roadmap.lib.php';
    include_once $plugin . '/admin.lib.php';
    include_once $plugin . '/validate.php';
    include_once $plugin . '/upload.lib.php';
}

function onoff_crm_website_enroll_sql()
{
    $enrollTable = function_exists('onoff_education_enrollment_table') ? onoff_education_enrollment_table() : '';
    if ($enrollTable === '') {
        return array(
            'cols' => "'' AS applicant_name, '' AS enroll_email, '' AS enroll_phone",
            'join' => '',
        );
    }
    return array(
        'cols' => 'e.applicant_name, e.email AS enroll_email, e.phone AS enroll_phone',
        'join' => "LEFT JOIN `{$enrollTable}` e ON e.en_id = (
            SELECT en_id FROM `{$enrollTable}`
            WHERE mb_id = o.mb_id
            ORDER BY en_id DESC
            LIMIT 1
        )",
    );
}

function onoff_crm_website_find_row($id)
{
    global $g5;
    $orders = $g5['seosys300_website_orders_table'];
    $members = $g5['member_table'];
    $enroll = onoff_crm_website_enroll_sql();
    return seosys300_fetch(
        "SELECT o.id, o.order_no, o.project_id, o.mb_id, o.status, o.site_name, o.site_type,
                o.purposes, o.industry, o.region, o.brand_name, o.phone, o.email, o.extra_json,
                o.business_description, o.current_url, o.design_style, o.primary_color,
                o.custom_color, o.target_region,
                o.progress, o.submitted_at, o.updated_at, m.mb_email, m.mb_name, {$enroll['cols']}
         FROM `{$orders}` o
         LEFT JOIN `{$members}` m ON m.mb_id = o.mb_id
         {$enroll['join']}
         WHERE o.id = " . (int) $id . " AND o.status <> 'draft'
         LIMIT 1"
    );
}

function onoff_crm_website_send_file($fileId)
{
    global $g5;
    $fileId = (int) $fileId;
    if ($fileId < 1) {
        onoff_crm_website_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $files = $g5['seosys300_website_files_table'];
    $orders = $g5['seosys300_website_orders_table'];
    $row = seosys300_fetch(
        "SELECT f.*, o.status AS order_status
         FROM `{$files}` f
         INNER JOIN `{$orders}` o ON o.id = f.order_id
         WHERE f.id = {$fileId} AND f.status <> 'deleted' AND o.status <> 'draft'
         LIMIT 1"
    );
    if (!$row) {
        onoff_crm_website_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $plugin = G5_PATH . '/plugin/seo-system-300/lib';
    include_once $plugin . '/upload.lib.php';
    $root = realpath(seosys300_upload_root());
    $abs = realpath(seosys300_upload_root() . '/' . ltrim((string) $row['file_path'], '/'));
    if (!$root || !$abs || strpos($abs, $root) !== 0 || !is_file($abs)) {
        onoff_crm_website_fail('file_not_found', '파일을 찾을 수 없습니다.', 404);
    }
    $name = (string) ($row['original_name'] !== '' ? $row['original_name'] : $row['stored_name']);
    $safe = str_replace(array('"', "\r", "\n"), '', $name);
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $safe . '"; filename*=UTF-8\'\'' . rawurlencode($name));
    header('Content-Length: ' . filesize($abs));
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    readfile($abs);
    exit;
}

function onoff_crm_website_upload_list()
{
    if (empty($_FILES['files']) || !is_array($_FILES['files'])) {
        return array();
    }
    $bag = $_FILES['files'];
    if (!isset($bag['name'])) {
        return array();
    }
    if (!is_array($bag['name'])) {
        return array($bag);
    }
    $out = array();
    $count = count($bag['name']);
    for ($i = 0; $i < $count; $i++) {
        $out[] = array(
            'name' => $bag['name'][$i],
            'type' => isset($bag['type'][$i]) ? $bag['type'][$i] : '',
            'tmp_name' => isset($bag['tmp_name'][$i]) ? $bag['tmp_name'][$i] : '',
            'error' => isset($bag['error'][$i]) ? $bag['error'][$i] : UPLOAD_ERR_NO_FILE,
            'size' => isset($bag['size'][$i]) ? $bag['size'][$i] : 0,
        );
    }
    return $out;
}

function onoff_crm_website_store_upload($order, $file)
{
    global $g5;
    $error = (int) $file['error'];
    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($error !== UPLOAD_ERR_OK) {
        onoff_crm_website_fail('upload_failed', '첨부파일을 올리지 못했습니다.', 422);
    }
    $size = (int) $file['size'];
    if ($size < 1 || $size > 8 * 1024 * 1024) {
        onoff_crm_website_fail('file_too_large', '첨부파일은 8MB 이하로 올려 주세요.', 422);
    }
    $original = isset($file['name']) ? (string) $file['name'] : 'file';
    $blocked = seosys300_blocked_upload_ext();
    if (seosys300_filename_has_blocked_ext($original, $blocked)) {
        onoff_crm_website_fail('file_type_denied', '허용되지 않은 파일 형식입니다.', 422);
    }
    $ext = seosys300_safe_ext($original);
    $allowed = seosys300_allowed_upload_ext();
    if ($ext === '' || !in_array($ext, $allowed, true)) {
        onoff_crm_website_fail('file_type_denied', '허용되지 않은 파일 형식입니다.', 422);
    }
    $tmp = (string) $file['tmp_name'];
    if ($tmp === '' || !is_uploaded_file($tmp)) {
        onoff_crm_website_fail('upload_missing', '첨부파일을 확인하지 못했습니다.', 422);
    }
    $head = @file_get_contents($tmp, false, null, 0, 256);
    if (is_string($head) && preg_match('/<\?php|<\?=|<script[\s>]/i', $head)) {
        onoff_crm_website_fail('file_type_denied', '허용되지 않은 파일 형식입니다.', 422);
    }
    seosys300_ensure_upload_htaccess();
    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    $mbId = (string) $order['mb_id'];
    $relDir = seosys300_safe_mb_dir($mbId) . '/' . (int) $order['project_id'] . '/' . (int) $order['id'];
    $absDir = seosys300_upload_root() . '/' . $relDir;
    if (!is_dir($absDir) && !@mkdir($absDir, 0755, true)) {
        onoff_crm_website_fail('save_failed', '첨부파일을 저장하지 못했습니다.', 500);
    }
    $absPath = $absDir . '/' . $stored;
    if (!@move_uploaded_file($tmp, $absPath)) {
        onoff_crm_website_fail('save_failed', '첨부파일을 저장하지 못했습니다.', 500);
    }
    @chmod($absPath, 0644);
    $now = seosys300_now();
    $mime = function_exists('seosys300_detect_mime') ? seosys300_detect_mime($absPath) : 'application/octet-stream';
    $table = $g5['seosys300_website_files_table'];
    $relPath = $relDir . '/' . $stored;
    $sql = "INSERT INTO `{$table}` SET
        order_id = " . (int) $order['id'] . ",
        project_id = " . (int) $order['project_id'] . ",
        mb_id = '" . seosys300_esc($mbId) . "',
        category = 'other',
        original_name = '" . seosys300_esc(substr($original, 0, 255)) . "',
        stored_name = '" . seosys300_esc($stored) . "',
        file_path = '" . seosys300_esc($relPath) . "',
        mime_type = '" . seosys300_esc(substr((string) $mime, 0, 100)) . "',
        file_size = {$size},
        memo = 'crm_feedback',
        status = 'uploaded',
        created_at = '{$now}',
        updated_at = '{$now}'";
    if (!seosys300_query($sql)) {
        @unlink($absPath);
        onoff_crm_website_fail('save_failed', '첨부파일을 저장하지 못했습니다.', 500);
    }
    return array(
        'id' => (int) sql_insert_id(),
        'name' => substr($original, 0, 255),
        'size' => $size,
    );
}

function onoff_crm_website_handle_update()
{
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? (string) $_SERVER['CONTENT_TYPE'] : '';
    $isMultipart = stripos($contentType, 'multipart/form-data') !== false;
    if ($isMultipart) {
        $input = $_POST;
    } else {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw ? $raw : '', true);
    }
    if (!is_array($input)) {
        onoff_crm_website_fail('validation_error', '요청 본문이 필요합니다.', 422);
    }
    $id = isset($input['id']) ? (int) $input['id'] : 0;
    $status = isset($input['status']) ? trim((string) $input['status']) : '';
    $feedback = isset($input['feedback']) ? trim((string) $input['feedback']) : '';
    $staffNote = isset($input['staffNote']) ? trim((string) $input['staffNote']) : '';
    $author = isset($input['author']) ? trim((string) $input['author']) : '';
    if (function_exists('mb_substr')) {
        $author = mb_substr($author, 0, 40);
        $staffNote = mb_substr($staffNote, 0, 1000);
    } else {
        $author = substr($author, 0, 40);
        $staffNote = substr($staffNote, 0, 1000);
    }
    $uploads = $isMultipart ? onoff_crm_website_upload_list() : array();
    $pending = 0;
    foreach ($uploads as $file) {
        if ((int) $file['error'] !== UPLOAD_ERR_NO_FILE) {
            $pending++;
        }
    }
    if ($id < 1) {
        onoff_crm_website_fail('validation_error', '주문을 지정해주세요.', 422);
    }
    if ($pending > 5) {
        onoff_crm_website_fail('validation_error', '첨부파일은 5개까지 올릴 수 있습니다.', 422);
    }
    if ($status === '' && $feedback === '' && $staffNote === '' && $pending === 0) {
        onoff_crm_website_fail('validation_error', '진행 상태, 피드백, 직원 메모, 첨부파일 중 하나를 입력해주세요.', 422);
    }
    if ($status === 'draft') {
        onoff_crm_website_fail('draft_not_allowed', '임시저장으로는 바꿀 수 없습니다.', 422);
    }
    if (strlen($feedback) > 1000) {
        onoff_crm_website_fail('validation_error', '피드백은 1000자 이하로 입력해주세요.', 422);
    }
    onoff_crm_website_load_libs();
    $row = onoff_crm_website_find_row($id);
    if (!$row) {
        onoff_crm_website_fail('order_not_found', '주문을 찾을 수 없습니다.', 404);
    }
    if ($status !== '' && $status !== (string) $row['status']) {
        if (!seosys300_is_allowed_order_status($status)) {
            onoff_crm_website_fail('validation_error', '허용되지 않은 주문 상태입니다.', 422);
        }
        seosys300_admin_change_order_status($id, $status, 'CRM 진행 상태 변경');
    }
    $savedFiles = array();
    foreach ($uploads as $file) {
        $saved = onoff_crm_website_store_upload($row, $file);
        if ($saved) {
            $savedFiles[] = $saved;
        }
    }
    if ($feedback !== '' || count($savedFiles) > 0) {
        seosys300_append_customer_update($id, $feedback, $savedFiles, $author);
    }
    if ($staffNote !== '') {
        seosys300_append_staff_note($id, $staffNote, $author);
    }
    $fresh = onoff_crm_website_find_row($id);
    echo json_encode(array(
        'ok' => true,
        'item' => $fresh ? onoff_crm_website_item($fresh) : null,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

global $g5;
$orders = $g5['seosys300_website_orders_table'];
$members = $g5['member_table'];
$email = isset($_GET['email']) ? trim((string) $_GET['email']) : '';
$status = isset($_GET['status']) ? trim((string) $_GET['status']) : '';
$page = max(1, (int) ($_GET['page'] ?? 1));
$limit = min(100, max(1, (int) ($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$enroll = onoff_crm_website_enroll_sql();
$where = array("o.status <> 'draft'");
if ($email !== '') {
    $esc = sql_real_escape_string($email);
    $emailMatch = "(o.email = '{$esc}' OR m.mb_email = '{$esc}'";
    if ($enroll['join'] !== '') {
        $emailMatch .= " OR e.email = '{$esc}'";
    }
    $emailMatch .= ')';
    $where[] = $emailMatch;
}
if ($status !== '') {
    $esc = sql_real_escape_string($status);
    $where[] = "o.status = '{$esc}'";
}
$whereSql = implode(' AND ', $where);

$countRow = seosys300_fetch(
    "SELECT COUNT(*) AS cnt
     FROM `{$orders}` o
     LEFT JOIN `{$members}` m ON m.mb_id = o.mb_id
     {$enroll['join']}
     WHERE {$whereSql}"
);
$total = $countRow ? (int) $countRow['cnt'] : 0;
$rows = seosys300_fetch_all(
    "SELECT o.id, o.order_no, o.project_id, o.mb_id, o.status, o.site_name, o.site_type,
            o.purposes, o.industry, o.region, o.brand_name, o.phone, o.email, o.extra_json,
            o.business_description, o.current_url, o.design_style, o.primary_color,
            o.custom_color, o.target_region,
            o.progress, o.submitted_at, o.updated_at, m.mb_email, m.mb_name, {$enroll['cols']}
     FROM `{$orders}` o
     LEFT JOIN `{$members}` m ON m.mb_id = o.mb_id
     {$enroll['join']}
     WHERE {$whereSql}
     ORDER BY o.id DESC
     LIMIT {$offset}, {$limit}"
);

$items = array();
foreach ($rows as $row) {
    $items[] = onoff_crm_website_item($row);
}

echo json_encode(array(
    'ok' => true,
    'page' => $page,
    'limit' => $limit,
    'total' => $total,
    'items' => $items,
), JSON_UNESCAPED_UNICODE);
