<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once G5_PATH . '/lib/onoff-service-contract.lib.php';

onoff_service_contract_ensure_tables();
seosys300_require_login();

$sc_id = isset($_GET['sc_id']) ? (int) $_GET['sc_id'] : 0;
$row = null;

if ($sc_id > 0) {
    $row = onoff_service_contract_get_by_id($sc_id);
} else {
    $mb_id = seosys300_current_mb_id();
    $row = onoff_service_contract_get_for_member($mb_id);
    if ($row) {
        $sc_id = (int) ($row['sc_id'] ?? 0);
    }
}

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

$rel = ltrim((string) ($row['sc_signature_file_path'] ?? ''), '/');
if ($rel === '') {
    http_response_code(404);
    echo 'not found';
    exit;
}

$path = onoff_service_contract_abs_from_data_path($rel);
$data_root = realpath(G5_DATA_PATH);
$real_file = $path !== '' ? realpath($path) : false;
if ($data_root === false || $real_file === false || strpos($real_file, $data_root) !== 0 || !is_file($real_file)) {
    http_response_code(404);
    echo 'not found';
    exit;
}

header('Content-Type: image/png');
header('Content-Length: ' . (string) filesize($real_file));
header('Cache-Control: private, no-store');
header('X-Content-Type-Options: nosniff');
readfile($real_file);
exit;
