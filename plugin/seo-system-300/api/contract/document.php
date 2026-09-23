<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once G5_PATH . '/lib/onoff-service-contract.lib.php';

onoff_service_contract_ensure_tables();
seosys300_require_login();

$sc_id = isset($_GET['sc_id']) ? (int) $_GET['sc_id'] : 0;
if ($sc_id < 1) {
    http_response_code(422);
    echo 'contract id required';
    exit;
}

$row = onoff_service_contract_get_by_id($sc_id);
if (!$row) {
    http_response_code(404);
    echo 'not found';
    exit;
}

$mb_id = seosys300_current_mb_id();
$is_admin = function_exists('seosys300_is_admin') && seosys300_is_admin();
if (!$is_admin && (string) ($row['sc_mb_id'] ?? '') !== (string) $mb_id) {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

$html = '';
$snapshot_raw = (string) ($row['sc_contract_snapshot'] ?? '');
if ($snapshot_raw !== '') {
    $snapshot = json_decode($snapshot_raw, true);
    if (is_array($snapshot) && !empty($snapshot['html'])) {
        $html = (string) $snapshot['html'];
    }
}

if (trim($html) === '') {
    $form = onoff_service_contract_form_from_row($row);
    $course_id = (string) ($row['sc_course_id'] ?? 'marketing-service');
    $addenda = onoff_service_contract_addendum_list($sc_id, false);
    $html = onoff_service_contract_render_html($course_id, $form, array(
        'amount' => $form['amount'] ?? '',
        'startDate' => $form['startDate'] ?? '',
        'endDate' => $form['endDate'] ?? '',
        'serviceScope' => $form['serviceScope'] ?? '',
        'negotiatedTerms' => $form['negotiatedTerms'] ?? '',
        'specialClauses' => $form['specialClauses'] ?? '',
        'addenda' => $addenda,
    ));
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
echo $html;
exit;
