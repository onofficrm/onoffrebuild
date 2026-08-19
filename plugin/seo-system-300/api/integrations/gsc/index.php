<?php
include_once(dirname(__FILE__) . '/../../_init.php');

seosys300_require_login();
seosys300_require_metrics_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$mb = seosys300_current_mb_id();
$project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($input['projectId']) ? (int) $input['projectId'] : 0);

if ($project_id < 1) {
    seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
}
$project = seosys300_get_owned_project($project_id, $mb);
if (!$project) {
    seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
}

if ($method === 'GET') {
    $sites = seosys300_gsc_list_sites($mb);
    $out = array();
    foreach ($sites as $s) {
        $out[] = array(
            'siteUrl' => $s['siteUrl'],
            'permissionLevel' => $s['permissionLevel'],
            'recommended' => !seosys300_domain_mismatch($project['domain'], $s['siteUrl']),
            'mismatch' => seosys300_domain_mismatch($project['domain'], $s['siteUrl']),
        );
    }
    seosys300_json_ok(array(
        'projectDomain' => (string) $project['domain'],
        'sites' => $out,
        'selected' => seosys300_integration_public(seosys300_integration_get($project_id, 'GOOGLE_SEARCH_CONSOLE')),
    ));
}

seosys300_require_csrf($input);

if ($action === 'select') {
    $siteUrl = isset($input['siteUrl']) ? trim((string) $input['siteUrl']) : '';
    if ($siteUrl === '' || strlen($siteUrl) > 255) {
        seosys300_json_error(422, 'validation_error', 'Search Console 속성을 선택해주세요.');
    }
    $conn = seosys300_google_connection_row($mb);
    if (!$conn || (string) $conn['status'] !== 'connected') {
        seosys300_json_error(409, 'GOOGLE_NOT_CONNECTED', seosys300_sync_user_message('GOOGLE_NOT_CONNECTED'));
    }
    $row = seosys300_integration_upsert($project_id, $mb, 'GOOGLE_SEARCH_CONSOLE', (int) $conn['id'], $siteUrl, $siteUrl, $siteUrl);
    seosys300_log_activity($project_id, 'GSC_PROPERTY_SELECTED', 'Search Console 속성을 연결했습니다.', array(
        'entity_type' => 'integration',
        'entity_id' => (int) $row['id'],
    ));
    $sync = seosys300_sync_gsc($project_id, $mb, 'initial', 90, true);
    seosys300_json_ok(array(
        'integration' => seosys300_integration_public($row),
        'domainMismatch' => seosys300_domain_mismatch($project['domain'], $siteUrl),
        'sync' => $sync,
    ));
}

if ($action === 'sync') {
    $res = seosys300_sync_gsc($project_id, $mb, 'manual', 90, false);
    if (empty($res['ok'])) {
        seosys300_json_error(409, $res['code'], seosys300_sync_user_message($res['code']));
    }
    seosys300_json_ok($res);
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
