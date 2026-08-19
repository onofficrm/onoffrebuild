<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$mb = seosys300_current_mb_id();
$project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($input['projectId']) ? (int) $input['projectId'] : 0);

if ($method === 'GET') {
    if ($action === 'registry') {
        seosys300_json_ok(array('tools' => seosys300_tool_registry(), 'aiConfigured' => seosys300_ai_configured()));
    }
    seosys300_require_tables();
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }
    $project = seosys300_get_owned_project($project_id, $mb);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    if ($action === 'summary' || $action === 'unified') {
        seosys300_json_ok(seosys300_unified_seo_summary($project_id, $mb));
    }
    seosys300_json_ok(array(
        'tools' => seosys300_tools_status_for_project($project_id),
        'registry' => seosys300_tool_registry(),
    ));
}

seosys300_require_csrf($input);
$project_id = isset($input['projectId']) ? (int) $input['projectId'] : $project_id;
if ($project_id < 1) {
    seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
}
$project = seosys300_get_owned_project($project_id, $mb);
if (!$project) {
    seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
}
if (!seosys300_tools_tables_ready()) {
    seosys300_json_error(503, 'tables_missing', '도구 연결 테이블이 아직 준비되지 않았습니다.');
}

$tool_key = isset($input['toolKey']) ? strtolower((string) $input['toolKey']) : '';

if ($action === 'manual-result' || $action === 'manual_result') {
    if (!seosys300_tool_key_allowed($tool_key)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 도구입니다.');
    }
    $payload = isset($input['payload']) && is_array($input['payload']) ? $input['payload'] : $input;
    seosys300_json_ok(seosys300_tool_upsert_manual($project_id, $mb, $tool_key, $payload));
}

if ($action === 'apply-domain' || $action === 'apply_domain') {
    $domain = isset($input['domain']) ? (string) $input['domain'] : '';
    $confirm = !empty($input['confirm']);
    seosys300_json_ok(seosys300_tool_apply_domain($project_id, $mb, $domain, $confirm));
}

if ($action === 'sync') {
    if (!seosys300_tool_key_allowed($tool_key)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 도구입니다.');
    }
    seosys300_json_ok(seosys300_adapter_sync($tool_key));
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
