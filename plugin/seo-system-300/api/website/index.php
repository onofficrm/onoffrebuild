<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : array_merge(seosys300_json_input(), $_POST);
$action = seosys300_action($input);

if ($method === 'GET') {
    if ($action === 'files') {
        $order_id = isset($_GET['orderId']) ? (int) $_GET['orderId'] : (isset($_GET['order_id']) ? (int) $_GET['order_id'] : 0);
        $order = seosys300_get_owned_order($order_id, seosys300_current_mb_id());
        if (!$order) {
            seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
        }
        seosys300_json_ok(array('files' => seosys300_file_list_for_order($order_id)));
    }
    $project_id = isset($_GET['projectId']) ? (int) $_GET['projectId'] : (isset($_GET['project_id']) ? (int) $_GET['project_id'] : 0);
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }
    seosys300_json_ok(array(
        'order' => seosys300_order_get_current($project_id),
    ));
}

if ($method !== 'POST' && $method !== 'PATCH' && $method !== 'PUT') {
    seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
}

seosys300_require_csrf($input);

if ($action === 'upload') {
    $order_id = isset($_POST['orderId']) ? (int) $_POST['orderId'] : (isset($input['orderId']) ? (int) $input['orderId'] : 0);
    $category = isset($_POST['category']) ? $_POST['category'] : (isset($input['category']) ? $input['category'] : 'other');
    $memo = isset($_POST['memo']) ? $_POST['memo'] : '';
    $file = seosys300_upload_file($order_id, $category, $memo);
    seosys300_json_ok($file, 201);
}

if ($action === 'delete_file' || $action === 'delete-file') {
    $file_id = isset($input['fileId']) ? (int) $input['fileId'] : (isset($input['id']) ? (int) $input['id'] : 0);
    seosys300_json_ok(seosys300_delete_file($file_id));
}

if ($action === 'draft') {
    $project_id = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    seosys300_json_ok(seosys300_order_ensure_draft($project_id), 201);
}

if ($action === 'submit') {
    seosys300_json_ok(seosys300_order_save($input, true));
}

$saved = seosys300_order_save($input, false);
seosys300_json_ok($saved);
