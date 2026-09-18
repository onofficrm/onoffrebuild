<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once(dirname(__FILE__) . '/../../lib/class_journey.lib.php');

seosys300_require_login();
seosys300_require_tables();
seosys300_class_ensure_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$projectId = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($input['projectId']) ? (int) $input['projectId'] : 0);

if ($method === 'GET') {
    seosys300_class_dispatch_reminders();
    if ($projectId < 1) {
        $projectId = seosys300_class_latest_project_id(seosys300_current_mb_id());
    }
    seosys300_json_ok(seosys300_class_payload($projectId));
}

seosys300_require_csrf($input);
if ($action === 'prep') {
    seosys300_json_ok(seosys300_class_save_prep($input));
}
if ($action === 'meet') {
    seosys300_json_ok(seosys300_class_save_meet($input));
}
if ($action === 'step') {
    seosys300_json_ok(seosys300_class_save_step($input));
}
if ($action === 'budget') {
    seosys300_json_ok(seosys300_class_save_budget($input));
}

seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
