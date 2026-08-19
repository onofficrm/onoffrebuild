<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();
seosys300_require_tables();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$id = isset($_GET['id']) ? (int) $_GET['id'] : (isset($input['id']) ? (int) $input['id'] : 0);

if ($method === 'GET') {
    if ($id > 0 || $action === 'detail') {
        seosys300_json_ok(seosys300_project_detail_for_member($id > 0 ? $id : (int) $input['id']));
    }
    seosys300_json_ok(array(
        'projects' => seosys300_project_list_for_member(isset($_GET['archived']) && $_GET['archived'] === '1'),
    ));
}

if ($method === 'POST' || $method === 'PATCH' || $method === 'PUT') {
    seosys300_require_csrf($input);
    if ($action === 'update' || $method === 'PATCH' || $method === 'PUT') {
        if ($id < 1) {
            seosys300_json_error(422, 'validation_error', '프로젝트 ID가 필요합니다.');
        }
        seosys300_json_ok(seosys300_project_update($id, $input));
    }
    if ($action === 'archive') {
        if ($id < 1) {
            seosys300_json_error(422, 'validation_error', '프로젝트 ID가 필요합니다.');
        }
        seosys300_json_ok(seosys300_project_archive($id));
    }
    $created = seosys300_project_create($input);
    seosys300_json_ok($created, 201);
}

seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
