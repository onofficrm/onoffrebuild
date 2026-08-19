<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();

$method = seosys300_request_method();
if ($method !== 'GET') {
    seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
}

$mb = seosys300_current_mb_id();
$project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : 0;
$action = seosys300_action($_GET);
$range = isset($_GET['range']) ? preg_replace('/[^a-z0-9]/', '', (string) $_GET['range']) : '30d';

if ($project_id < 1) {
    seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
}
$project = seosys300_get_owned_project($project_id, $mb);
if (!$project) {
    seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
}

if ($action === 'integration-status' || $action === 'status') {
    seosys300_json_ok(seosys300_metrics_status_payload($project_id, $mb));
}
if ($action === 'timeseries') {
    seosys300_json_ok(seosys300_metrics_timeseries($project_id, $range));
}
if ($action === 'queries') {
    seosys300_json_ok(array('queries' => seosys300_metrics_queries($project_id, $range)));
}
if ($action === 'pages') {
    seosys300_json_ok(array('pages' => seosys300_metrics_pages($project_id, $range)));
}
if ($action === 'before-now' || $action === 'before_now') {
    seosys300_json_ok(seosys300_metrics_before_now($project_id));
}
if ($action === 'opportunities') {
    seosys300_json_ok(array('items' => seosys300_opportunity_rules(seosys300_metrics_queries($project_id, $range))));
}
if ($action === 'coach-context') {
    seosys300_json_ok(seosys300_ai_coach_context($project_id, $mb));
}

seosys300_json_ok(seosys300_metrics_summary($project_id, $mb, $range));
