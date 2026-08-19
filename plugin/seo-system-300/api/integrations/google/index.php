<?php
include_once(dirname(__FILE__) . '/../../_init.php');

seosys300_require_login();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$mb = seosys300_current_mb_id();
$tablesReady = seosys300_metrics_tables_ready();

if ($method === 'GET') {
    $conn = $tablesReady ? seosys300_google_connection_row($mb) : null;
    seosys300_json_ok(array(
        'connection' => seosys300_google_connection_public($conn),
        'configured' => seosys300_google_configured(),
        'tablesReady' => $tablesReady,
    ));
}

seosys300_require_metrics_tables();
seosys300_require_csrf($input);

if ($action === 'connect') {
    seosys300_require_google_config();
    seosys300_json_ok(array(
        'authUrl' => seosys300_google_auth_url($mb),
    ));
}

if ($action === 'disconnect') {
    seosys300_google_disconnect($mb);
    seosys300_json_ok(array(
        'disconnected' => true,
        'metricsKept' => true,
        'message' => 'Google 연결은 해제되지만 기존에 수집된 SEO 통계는 유지됩니다.',
    ));
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
