<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();
seosys300_require_roadmap_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : array_merge(seosys300_json_input(), $_POST);
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
    if ($action === 'results') {
        $task_id = isset($_GET['taskId']) ? (int) $_GET['taskId'] : 0;
        seosys300_json_ok(array('results' => seosys300_task_results_for_project($project_id, $task_id)));
    }
    $step_id = isset($_GET['stepId']) ? (int) $_GET['stepId'] : 0;
    $data = seosys300_roadmap_for_project($project_id);
    if ($step_id > 0) {
        foreach ($data['steps'] as $step) {
            if ((int) $step['id'] === $step_id) {
                seosys300_json_ok(array('step' => $step, 'progress' => $data['progress']));
            }
        }
        seosys300_json_error(404, 'step_not_found', '단계를 찾을 수 없습니다.');
    }
    seosys300_json_ok($data);
}

seosys300_require_csrf($input);
$project_id = isset($input['projectId']) ? (int) $input['projectId'] : $project_id;
$task_id = isset($input['taskId']) ? (int) $input['taskId'] : 0;
if ($project_id < 1) {
    seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
}
$project = seosys300_get_owned_project($project_id, seosys300_current_mb_id());
if (!$project) {
    seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
}

if ($action === 'result' || $action === 'add_result') {
    if ($task_id < 1) {
        seosys300_json_error(422, 'validation_error', '작업 ID가 필요합니다.');
    }
    $created = seosys300_task_result_create($project_id, $task_id, $input);
    seosys300_json_ok($created, 201);
}

if ($action === 'screenshot') {
    seosys300_json_ok(seosys300_upload_task_screenshot($project_id), 201);
}

if ($task_id < 1) {
    seosys300_json_error(422, 'validation_error', '작업 ID가 필요합니다.');
}

global $g5;
$task = seosys300_fetch("SELECT * FROM `{$g5['seosys300_roadmap_tasks_table']}` WHERE id = {$task_id} AND is_active = 1 LIMIT 1");
if (!$task) {
    seosys300_json_error(404, 'task_not_found', '작업을 찾을 수 없습니다.');
}

if ($action === 'start') {
    seosys300_json_ok(array(
        'task' => seosys300_set_project_task_status($project_id, $task_id, 'in_progress', seosys300_current_mb_id()),
        'roadmap' => seosys300_roadmap_for_project($project_id),
    ));
}
if ($action === 'reopen') {
    seosys300_json_ok(array(
        'task' => seosys300_set_project_task_status($project_id, $task_id, 'in_progress', seosys300_current_mb_id()),
        'roadmap' => seosys300_roadmap_for_project($project_id),
    ));
}
if ($action === 'skip') {
    seosys300_json_ok(array(
        'task' => seosys300_set_project_task_status($project_id, $task_id, 'skipped', seosys300_current_mb_id()),
        'roadmap' => seosys300_roadmap_for_project($project_id),
    ));
}
if ($action === 'complete') {
    if ((string) $task['completion_type'] === 'result_required' && !seosys300_task_has_result($project_id, $task_id)) {
        seosys300_json_error(409, 'result_required', '작업 결과를 저장한 뒤 완료할 수 있습니다.');
    }
    seosys300_json_ok(array(
        'task' => seosys300_set_project_task_status($project_id, $task_id, 'completed', seosys300_current_mb_id()),
        'roadmap' => seosys300_roadmap_for_project($project_id),
    ));
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
