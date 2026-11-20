<?php
/**
 * CRM read API for SEO SYSTEM 300 dashboard data.
 *
 * Source of truth stays in the SEO SYSTEM 300 tables. This endpoint is GET-only
 * and never creates missions, changes mission state, or writes customer data.
 */
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.use_cookies', '0');
    ini_set('session.use_only_cookies', '1');
}

include_once dirname(__DIR__, 2) . '/common.php';
include_once G5_PATH . '/lib/onoff-education.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/tables.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/constants.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/db.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/project.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/website.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/roadmap.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/mission.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/revision.lib.php';
include_once G5_PATH . '/plugin/seo-system-300/lib/class_journey.lib.php';

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

function onoff_crm_seo_dash_fail($error, $message, $status)
{
    http_response_code((int) $status);
    echo json_encode(array(
        'ok' => false,
        'error' => (string) $error,
        'message' => (string) $message,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_crm_seo_dash_token()
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

function onoff_crm_seo_dash_member_expr()
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
            WHERE mb_id = p.mb_id
            ORDER BY en_id DESC
            LIMIT 1
        )",
    );
}

function onoff_crm_seo_dash_member_item($row)
{
    return array(
        'memberName' => (string) (($row['mb_name'] ?? '') !== '' ? $row['mb_name'] : ($row['applicant_name'] ?? '')),
        'memberEmail' => (string) (($row['mb_email'] ?? '') !== '' ? $row['mb_email'] : ($row['enroll_email'] ?? '')),
        'memberPhone' => (string) (($row['mb_hp'] ?? '') !== '' ? $row['mb_hp'] : ($row['enroll_phone'] ?? '')),
    );
}

function onoff_crm_seo_dash_today_missions($project_id, $mb_id, $date)
{
    global $g5;
    if (!seosys300_mission_tables_ready()) {
        return array();
    }
    $table = $g5['seosys300_daily_missions_table'];
    $tt = $g5['seosys300_roadmap_tasks_table'];
    $rows = seosys300_fetch_all("SELECT m.*, t.title, t.description, t.related_tool
        FROM `{$table}` m
        LEFT JOIN `{$tt}` t ON t.id = m.roadmap_task_id
        WHERE m.project_id = " . (int) $project_id . "
          AND m.mb_id = '" . seosys300_esc($mb_id) . "'
          AND m.mission_date = '" . seosys300_esc($date) . "'
        ORDER BY m.sort_order ASC, m.id ASC");
    $out = array();
    foreach ($rows as $row) {
        $out[] = array(
            'id' => (int) $row['id'],
            'projectId' => (int) $row['project_id'],
            'title' => (string) ($row['title'] ?? ''),
            'description' => (string) ($row['description'] ?? ''),
            'status' => (string) $row['status'],
            'isCompleted' => (string) $row['status'] === 'completed',
            'missionDate' => (string) $row['mission_date'],
            'completedAt' => $row['completed_at'] ? (string) $row['completed_at'] : null,
            'relatedTool' => (string) ($row['related_tool'] ?? ''),
        );
    }
    return $out;
}

function onoff_crm_seo_dash_streak($mb_id)
{
    global $g5;
    if (!seosys300_mission_tables_ready()) {
        return 0;
    }
    $table = $g5['seosys300_daily_missions_table'];
    $rows = seosys300_fetch_all("SELECT mission_date,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS done,
            COUNT(*) AS total
        FROM `{$table}`
        WHERE mb_id = '" . seosys300_esc($mb_id) . "'
        GROUP BY mission_date
        ORDER BY mission_date DESC
        LIMIT 30");
    $streak = 0;
    foreach ($rows as $row) {
        if ((int) $row['total'] > 0 && (int) $row['done'] >= (int) $row['total']) {
            $streak++;
            continue;
        }
        break;
    }
    return $streak;
}

function onoff_crm_seo_dash_class($project_id, $project)
{
    $payload = seosys300_class_payload((int) $project_id, $project);
    $mission = isset($payload['mission']) && is_array($payload['mission']) ? $payload['mission'] : array();
    $open = array();
    foreach (($payload['steps'] ?? array()) as $step) {
        if (!is_array($step) || (string) ($step['status'] ?? '') === 'done') {
            continue;
        }
        $open[] = array(
            'key' => (string) ($step['key'] ?? ''),
            'title' => (string) ($step['title'] ?? ''),
        );
    }
    $keywords = array();
    foreach (seosys300_project_keywords((int) $project_id) as $keyword) {
        $word = trim((string) ($keyword['keyword'] ?? ''));
        if ($word !== '') {
            $keywords[] = $word;
        }
    }
    return array(
        'currentStepKey' => (string) ($mission['stepKey'] ?? ''),
        'currentStepTitle' => (string) ($mission['title'] ?? ''),
        'nextAction' => (string) ($mission['prompt'] ?? ''),
        'chosenDomain' => isset($payload['domain']['chosen']) ? (string) $payload['domain']['chosen'] : (string) ($project['domain'] ?? ''),
        'keywords' => $keywords,
        'openSteps' => $open,
    );
}

function onoff_crm_seo_dash_order($project_id, $mb_id)
{
    $order = seosys300_current_order_for_project((int) $project_id, (string) $mb_id);
    if (!$order) {
        return null;
    }
    return array(
        'id' => (int) $order['id'],
        'orderNo' => (string) $order['order_no'],
        'siteName' => (string) $order['site_name'],
        'status' => (string) $order['status'],
        'projectId' => (int) $order['project_id'],
    );
}

function onoff_crm_seo_dash_revisions($project_id, $order_id)
{
    if ((int) $order_id < 1 || !function_exists('seosys300_revision_ensure_tables')) {
        return array();
    }
    seosys300_revision_ensure_tables();
    $closed = array('completed', 'cancelled', 'expired');
    $closedSql = "'" . implode("','", array_map('seosys300_esc', $closed)) . "'";
    $table = seosys300_revision_tickets_table();
    $rows = seosys300_fetch_all("SELECT id, title, status, created_at
        FROM `{$table}`
        WHERE order_id = " . (int) $order_id . "
          AND project_id = " . (int) $project_id . "
          AND status NOT IN ({$closedSql})
        ORDER BY id DESC
        LIMIT 20");
    $out = array();
    foreach ($rows as $row) {
        $out[] = array(
            'id' => (int) $row['id'],
            'title' => (string) $row['title'],
            'status' => (string) $row['status'],
            'createdAt' => (string) $row['created_at'],
        );
    }
    return $out;
}

$bearer = onoff_crm_seo_dash_token();
if ($bearer === null) {
    onoff_crm_seo_dash_fail('unauthorized', 'Authentication required.', 401);
}
if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
    onoff_crm_seo_dash_fail('not_configured', 'CRM API token is not configured.', 503);
}
if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
    onoff_crm_seo_dash_fail('unauthorized', 'Invalid API token.', 401);
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    onoff_crm_seo_dash_fail('method_not_allowed', 'GET only.', 405);
}
if (!seosys300_tables_ready()) {
    onoff_crm_seo_dash_fail('tables_missing', 'Project tables are not ready.', 503);
}

global $g5;
$mb = isset($_GET['mb']) ? trim((string) $_GET['mb']) : '';
if ($mb !== '' && !preg_match('/^[A-Za-z0-9_]{1,100}$/', $mb)) {
    onoff_crm_seo_dash_fail('validation_error', 'Invalid member id.', 422);
}

$member = onoff_crm_seo_dash_member_expr();
$pt = $g5['seosys300_projects_table'];
$mt = isset($g5['member_table']) ? $g5['member_table'] : 'g5_member';
$where = 'p.is_active = 1';
if ($mb !== '') {
    $where .= " AND p.mb_id = '" . seosys300_esc($mb) . "'";
}
$rows = seosys300_fetch_all("SELECT p.*, m.mb_name, m.mb_email, m.mb_hp, {$member['cols']}
    FROM `{$pt}` p
    LEFT JOIN `{$mt}` m ON m.mb_id = p.mb_id
    {$member['join']}
    WHERE {$where}
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 500");

$date = seosys300_today_date();
$items = array();
foreach ($rows as $row) {
    $pid = (int) $row['id'];
    $owner = (string) $row['mb_id'];
    $missions = onoff_crm_seo_dash_today_missions($pid, $owner, $date);
    $completed = 0;
    foreach ($missions as $mission) {
        if (!empty($mission['isCompleted'])) {
            $completed++;
        }
    }
    $order = onoff_crm_seo_dash_order($pid, $owner);
    $memberInfo = onoff_crm_seo_dash_member_item($row);
    $items[] = array_merge(array(
        'id' => $pid,
        'mbId' => $owner,
        'name' => (string) $row['name'],
        'progress' => (int) $row['progress'],
        'domain' => (string) $row['domain'],
        'today' => array(
            'date' => $date,
            'total' => count($missions),
            'completed' => $completed,
            'streakDays' => onoff_crm_seo_dash_streak($owner),
            'missions' => $missions,
        ),
        'class' => onoff_crm_seo_dash_class($pid, $row),
        'websiteOrder' => $order,
        'openRevisions' => $order ? onoff_crm_seo_dash_revisions($pid, (int) $order['id']) : array(),
    ), $memberInfo);
}

echo json_encode(array(
    'ok' => true,
    'total' => count($items),
    'students' => $items,
), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
