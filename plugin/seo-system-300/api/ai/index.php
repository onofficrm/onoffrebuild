<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();

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
    if ($action === 'context') {
        seosys300_json_ok(seosys300_ai_coach_context_full($project_id, $mb));
    }
    $cache = seosys300_ai_cache_get($project_id);
    $data = null;
    if ($cache) {
        $decoded = json_decode($cache['analysis_json'], true);
        $data = is_array($decoded) ? $decoded : null;
    }
    seosys300_json_ok(array(
        'configured' => seosys300_ai_configured(),
        'cached' => $data !== null,
        'data' => $data,
        'createdAt' => $cache ? (string) $cache['updated_at'] : null,
        'dataAsOf' => $cache ? (string) $cache['data_as_of'] : null,
        'healthRuleBased' => seosys300_unified_seo_summary($project_id, $mb)['health'],
    ));
}

seosys300_require_csrf($input);

if ($action === 'analyze') {
    $force = !empty($input['force']);
    $res = seosys300_ai_analyze($project_id, $mb, $force);
    if (empty($res['ok'])) {
        seosys300_json_error(409, isset($res['code']) ? $res['code'] : 'AI_PROVIDER_FAILED', $res['code'] === 'AI_NOT_CONFIGURED' ? 'AI Coach 설정이 필요합니다.' : 'AI 분석을 불러오지 못했습니다.');
    }
    seosys300_json_ok($res);
}

if ($action === 'chat') {
    $res = seosys300_ai_chat($project_id, $mb, isset($input['message']) ? $input['message'] : '');
    if (empty($res['ok'])) {
        seosys300_json_error(409, isset($res['code']) ? $res['code'] : 'AI_PROVIDER_FAILED', $res['code'] === 'AI_NOT_CONFIGURED' ? 'AI Coach 설정이 필요합니다.' : 'AI 응답을 불러오지 못했습니다.');
    }
    seosys300_json_ok($res);
}

if ($action === 'add-mission' || $action === 'add_mission') {
    $key = isset($input['roadmapTaskKey']) ? (string) $input['roadmapTaskKey'] : '';
    seosys300_json_ok(array('missions' => seosys300_ai_add_mission($project_id, $mb, $key)));
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
