<?php
/**
 * CRM read API for SEO SYSTEM 300 projects.
 *
 * Source of truth stays g5_seosys300_projects. GET only.
 * The student portal at /seo-system-300/projects lists the same active rows.
 *
 * Auth matches api/crm/website-orders.php:
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
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-ONOFF-Contract-Token, X-Api-Token');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function onoff_crm_seo_projects_fail($error, $message, $status)
{
    http_response_code((int) $status);
    echo json_encode(array(
        'ok' => false,
        'error' => (string) $error,
        'message' => (string) $message,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_crm_seo_projects_token()
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

$bearer = onoff_crm_seo_projects_token();
if ($bearer === null) {
    onoff_crm_seo_projects_fail('unauthorized', 'Authentication required.', 401);
}
if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
    onoff_crm_seo_projects_fail('not_configured', 'CRM API token is not configured.', 503);
}
if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
    onoff_crm_seo_projects_fail('unauthorized', 'Invalid API token.', 401);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    onoff_crm_seo_projects_fail('method_not_allowed', 'GET only.', 405);
}

global $g5;
if (!seosys300_tables_ready()) {
    onoff_crm_seo_projects_fail('tables_missing', 'Project tables are not ready.', 503);
}

$mb = isset($_GET['mb']) ? trim((string) $_GET['mb']) : '';
if ($mb !== '' && !preg_match('/^[A-Za-z0-9_]{1,20}$/', $mb)) {
    onoff_crm_seo_projects_fail('validation_error', 'Invalid member id.', 422);
}

$table = $g5['seosys300_projects_table'];
$ktable = $g5['seosys300_project_keywords_table'];
$memberTable = isset($g5['member_table']) ? $g5['member_table'] : 'g5_member';
$enrollTable = function_exists('onoff_education_enrollment_table') ? onoff_education_enrollment_table() : '';
$enrollJoin = '';
$enrollCols = "'' AS applicant_name, '' AS enroll_email, '' AS enroll_phone";
if ($enrollTable !== '') {
    $enrollCols = 'e.applicant_name, e.email AS enroll_email, e.phone AS enroll_phone';
    $enrollJoin = "LEFT JOIN `{$enrollTable}` e ON e.en_id = (
        SELECT en_id FROM `{$enrollTable}`
        WHERE mb_id = p.mb_id
        ORDER BY en_id DESC
        LIMIT 1
    )";
}
$where = 'p.is_active = 1';
if ($mb !== '') {
    $where .= " AND p.mb_id = '" . seosys300_esc($mb) . "'";
}
$rows = seosys300_fetch_all("SELECT p.*, m.mb_name, m.mb_email, m.mb_hp, {$enrollCols}
    FROM `{$table}` p
    LEFT JOIN `{$memberTable}` m ON m.mb_id = p.mb_id
    {$enrollJoin}
    WHERE {$where}
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 500");

$ids = array();
foreach ($rows as $row) {
    $ids[] = (int) $row['id'];
}
$keywordsByProject = array();
if ($ids) {
    $idSql = implode(',', $ids);
    $keywordRows = seosys300_fetch_all("SELECT project_id, keyword FROM `{$ktable}` WHERE project_id IN ({$idSql}) ORDER BY priority ASC, id ASC");
    foreach ($keywordRows as $keywordRow) {
        $pid = (int) $keywordRow['project_id'];
        $word = trim((string) $keywordRow['keyword']);
        if ($word === '') {
            continue;
        }
        if (!isset($keywordsByProject[$pid])) {
            $keywordsByProject[$pid] = array();
        }
        $keywordsByProject[$pid][] = $word;
    }
}

$projects = array();
foreach ($rows as $row) {
    $id = (int) $row['id'];
    $projects[] = array(
        'id' => $id,
        'mbId' => (string) $row['mb_id'],
        'memberName' => (string) (($row['mb_name'] ?? '') !== '' ? $row['mb_name'] : ($row['applicant_name'] ?? '')),
        'memberEmail' => (string) (($row['mb_email'] ?? '') !== '' ? $row['mb_email'] : ($row['enroll_email'] ?? '')),
        'memberPhone' => (string) (($row['mb_hp'] ?? '') !== '' ? $row['mb_hp'] : ($row['enroll_phone'] ?? '')),
        'name' => (string) $row['name'],
        'businessType' => (string) $row['business_type'],
        'purposes' => seosys300_decode_list($row['purposes']),
        'domain' => (string) $row['domain'],
        'status' => (string) $row['status'],
        'progress' => (int) $row['progress'],
        'keywords' => isset($keywordsByProject[$id]) ? $keywordsByProject[$id] : array(),
        'createdAt' => (string) $row['created_at'],
        'updatedAt' => (string) $row['updated_at'],
    );
}

echo json_encode(array(
    'ok' => true,
    'total' => count($projects),
    'projects' => $projects,
), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
