<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();
seosys300_require_roadmap_tables();
if (!seosys300_mission_tables_ready()) {
    seosys300_json_error(503, 'tables_missing', '미션 테이블이 아직 준비되지 않았습니다.');
}

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($input['projectId']) ? (int) $input['projectId'] : 0);

if ($method === 'GET') {
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }
    $project = seosys300_get_owned_project($project_id, seosys300_current_mb_id());
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    seosys300_json_ok(array(
        'date' => seosys300_today_date(),
        'timezone' => seosys300_timezone(),
        'missions' => seosys300_generate_missions($project_id),
    ));
}

seosys300_require_csrf($input);
$project_id = isset($input['projectId']) ? (int) $input['projectId'] : $project_id;
$mission_id = isset($input['missionId']) ? (int) $input['missionId'] : 0;

if ($action === 'generate') {
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }
    $project = seosys300_get_owned_project($project_id, seosys300_current_mb_id());
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    seosys300_json_ok(array(
        'date' => seosys300_today_date(),
        'missions' => seosys300_generate_missions($project_id),
    ));
}

if ($action === 'complete') {
    seosys300_json_ok(array('missions' => seosys300_complete_mission($mission_id)));
}
if ($action === 'reopen') {
    seosys300_json_ok(array('missions' => seosys300_reopen_mission($mission_id)));
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
