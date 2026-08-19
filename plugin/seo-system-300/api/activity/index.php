<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_method('GET');
seosys300_require_login();
seosys300_require_tables();
if (!seosys300_activity_tables_ready()) {
    seosys300_json_error(503, 'tables_missing', '활동 기록 테이블이 아직 준비되지 않았습니다.');
}

$project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : 0;
if ($project_id < 1) {
    seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
}
$project = seosys300_get_owned_project($project_id, seosys300_current_mb_id());
if (!$project) {
    seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
}

$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 30;
$before = isset($_GET['before']) ? (int) $_GET['before'] : 0;
$type = isset($_GET['activity_type']) ? (string) $_GET['activity_type'] : '';

seosys300_json_ok(array(
    'activities' => seosys300_activity_list($project_id, $limit, $before, $type),
));
