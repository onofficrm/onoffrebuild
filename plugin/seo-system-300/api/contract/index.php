<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once G5_PATH . '/lib/onoff-service-contract.lib.php';

onoff_service_contract_ensure_tables();
seosys300_require_login();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$mb_id = seosys300_current_mb_id();

if ($method === 'GET') {
    $mode = isset($_GET['mode']) ? (string) $_GET['mode'] : '';
    if ($mode === 'read') {
        $version = isset($_GET['version']) ? (string) $_GET['version'] : '';
        seosys300_json_ok(onoff_service_contract_read_view($mb_id, $version));
    }

    $payload = onoff_service_contract_view_to_api($mb_id);
    if (function_exists('get_token')) {
        $payload['csrfToken'] = get_token();
    }
    seosys300_json_ok($payload);
}

seosys300_require_csrf($input);

if ($action === 'sign') {
    $access = onoff_service_contract_access($mb_id);
    if (empty($access['applies'])) {
        seosys300_json_error(403, 'forbidden', '작성할 수 있는 서비스 계약이 없습니다. 입금 확인(권한 부여) 후 작성할 수 있습니다.');
    }
}

$signature = (string) ($input['signatureData'] ?? '');

if ($action === 'draft') {
    $result = onoff_service_contract_save_draft($mb_id, $input);
    if (empty($result['ok'])) {
        seosys300_json_error(400, 'validation_error', (string) ($result['message'] ?? '저장에 실패했습니다.'));
    }
    seosys300_json_ok(array(
        'message' => (string) ($result['message'] ?? '저장되었습니다.'),
        'contract' => onoff_service_contract_to_api($result['contract'] ?? null),
    ));
}

if ($action === 'signature') {
    $result = onoff_service_contract_save_signature($mb_id, $signature);
    if (empty($result['ok'])) {
        seosys300_json_error(400, 'validation_error', (string) ($result['message'] ?? '서명 저장에 실패했습니다.'));
    }
    seosys300_json_ok(array(
        'message' => (string) ($result['message'] ?? '서명이 저장되었습니다.'),
        'path' => (string) ($result['path'] ?? ''),
    ));
}

if ($action === 'validate') {
    $result = onoff_service_contract_save_draft($mb_id, $input);
    if (empty($result['ok'])) {
        seosys300_json_error(400, 'validation_error', (string) ($result['message'] ?? '검증에 실패했습니다.'));
    }
    seosys300_json_ok(array(
        'message' => 'validated',
        'validated' => true,
        'contract' => onoff_service_contract_to_api($result['contract'] ?? null),
    ));
}

if ($action === 'sign') {
    $result = onoff_service_contract_sign($mb_id, $input, $signature);
    if (empty($result['ok'])) {
        seosys300_json_error(400, 'validation_error', (string) ($result['message'] ?? '계약 서명에 실패했습니다.'));
    }
    seosys300_json_ok(array(
        'message' => (string) ($result['message'] ?? '계약서가 제출되었습니다.'),
        'contract' => onoff_service_contract_to_api($result['contract'] ?? null),
    ));
}

if ($action === 'add_addendum') {
    $row = onoff_service_contract_get_for_member($mb_id);
    if (!$row || (int) ($row['sc_id'] ?? 0) < 1) {
        seosys300_json_error(404, 'not_found', '서비스 계약을 찾을 수 없습니다.');
    }
    $title = (string) ($input['title'] ?? '');
    $body = (string) ($input['body'] ?? '');
    $result = onoff_service_contract_addendum_add((int) $row['sc_id'], $title, $body, 'merchant', $mb_id);
    if (empty($result['ok'])) {
        seosys300_json_error(400, 'validation_error', (string) ($result['message'] ?? '특약 추가에 실패했습니다.'));
    }
    seosys300_json_ok(array(
        'message' => (string) ($result['message'] ?? '특약이 추가되었습니다.'),
        'id' => (int) ($result['id'] ?? 0),
    ));
}

seosys300_json_error(405, 'method_not_allowed', '허용되지 않은 요청 방식입니다.');
