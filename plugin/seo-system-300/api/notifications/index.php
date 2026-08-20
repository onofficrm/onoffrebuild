<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_login();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);

if ($method === 'GET') {
    if (!seosys300_notifications_tables_ready()) {
        seosys300_json_ok(array(
            'notifications' => array(),
            'unreadCount' => 0,
            'tablesReady' => false,
        ));
    }
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 40;
    $mb = seosys300_current_mb_id();
    seosys300_json_ok(array(
        'notifications' => seosys300_notifications_list($mb, $limit),
        'unreadCount' => seosys300_notifications_unread_count($mb),
        'tablesReady' => true,
    ));
}

seosys300_require_csrf($input);
if (!seosys300_notifications_tables_ready()) {
    seosys300_json_error(503, 'tables_missing', '알림 테이블이 아직 준비되지 않았습니다.');
}

$mb = seosys300_current_mb_id();
if ($action === 'mark-read') {
    $ids = isset($input['ids']) && is_array($input['ids']) ? $input['ids'] : array();
    $unread = seosys300_notifications_mark_read($mb, $ids);
    seosys300_json_ok(array(
        'unreadCount' => $unread,
        'notifications' => seosys300_notifications_list($mb, 40),
    ));
}
if ($action === 'mark-all-read') {
    $unread = seosys300_notifications_mark_read($mb, array());
    seosys300_json_ok(array(
        'unreadCount' => $unread,
        'notifications' => seosys300_notifications_list($mb, 40),
    ));
}

seosys300_json_error(422, 'validation_error', '알 수 없는 요청입니다.');
