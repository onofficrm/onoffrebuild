<?php
/** Public lecture / marketing standard contracts. Editable by super-admin via GNUBoard content. */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__) . '/common.php';
require_once G5_LIB_PATH . '/onoff-edu-contract.lib.php';

while (ob_get_level() > 0) {
    ob_end_clean();
}

$type = isset($_GET['type']) ? (string) $_GET['type'] : (isset($_GET['co_id']) ? (string) $_GET['co_id'] : 'education');
$contract = onoff_edu_contract_public($type);
http_response_code($contract ? 200 : 404);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (!$contract) {
    echo json_encode(array(
        'ok' => false,
        'message' => '표준계약서를 찾지 못했습니다.',
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode(array(
    'ok' => true,
    'data' => $contract,
), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit;
