<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once(dirname(__FILE__) . '/../../lib/revision.lib.php');

seosys300_require_login();
seosys300_require_tables();
seosys300_revision_ensure_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : array_merge(seosys300_json_input(), $_POST);
$action = seosys300_action($input);
$mb_id = seosys300_current_mb_id();

if ($method === 'GET') {
    if ($action === 'detail' || $action === 'get') {
        $id = isset($_GET['ticketId']) ? (int) $_GET['ticketId'] : (isset($_GET['id']) ? (int) $_GET['id'] : 0);
        $row = seosys300_revision_get_owned($id, $mb_id);
        if (!$row) {
            seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
        }
        seosys300_revision_expire_quotes();
        $fresh = seosys300_revision_get_row($id);
        seosys300_json_ok(array(
            'ticket' => seosys300_revision_ticket_to_api($fresh, true),
            'quota' => seosys300_revision_free_quota($mb_id),
        ));
    }

    $project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($_GET['project_id']) ? (int) $_GET['project_id'] : 0);
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $order = seosys300_current_order_for_project($project_id, $mb_id);
    $eligible = seosys300_revision_eligible_order($order);
    $payload = seosys300_revision_list_for_student($project_id, $mb_id);
    $payload['eligible'] = (bool) $eligible;
    $payload['orderId'] = $order ? (int) $order['id'] : 0;
    seosys300_json_ok($payload);
}

if ($method !== 'POST' && $method !== 'PATCH' && $method !== 'PUT') {
    seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
}

seosys300_require_csrf($input);

if ($action === 'create' || $action === 'add') {
    seosys300_json_ok(seosys300_revision_create($input, $mb_id), 201);
}

if ($action === 'comment') {
    $id = isset($input['ticketId']) ? (int) $input['ticketId'] : 0;
    $body = isset($input['body']) ? (string) $input['body'] : (isset($input['note']) ? (string) $input['note'] : '');
    seosys300_json_ok(seosys300_revision_student_comment($id, $mb_id, $body));
}

if ($action === 'confirm' || $action === 'confirm-done' || $action === 'confirm_done') {
    $id = isset($input['ticketId']) ? (int) $input['ticketId'] : 0;
    $ok = !isset($input['ok']) || $input['ok'] === true || $input['ok'] === 1 || $input['ok'] === '1';
    seosys300_json_ok(seosys300_revision_confirm_done($id, $mb_id, $ok));
}

if ($action === 'pay' || $action === 'pay-quote' || $action === 'pay_quote' || $action === 'confirm-payment') {
    $id = isset($input['ticketId']) ? (int) $input['ticketId'] : 0;
    seosys300_json_ok(seosys300_revision_confirm_payment($id, $mb_id, $input));
}

if ($action === 'upload') {
    $id = isset($_POST['ticketId']) ? (int) $_POST['ticketId'] : (isset($input['ticketId']) ? (int) $input['ticketId'] : 0);
    seosys300_json_ok(seosys300_revision_upload_file($id, $mb_id, false), 201);
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
