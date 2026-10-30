<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once(dirname(__FILE__) . '/../../lib/class_journey.lib.php');
include_once(dirname(__FILE__) . '/../../lib/revision.lib.php');

seosys300_require_admin();

$method = seosys300_request_method();
$input = ($method === 'GET') ? $_GET : seosys300_json_input();
$action = seosys300_action($input);
$skipCoreTables = ($method === 'GET' && in_array($action, array('diagnostics', 'integrations', 'tool-health', 'tool_health', 'ai-monitor', 'ai_monitor'), true));
if (!$skipCoreTables) {
    seosys300_require_tables();
}

if ($method === 'GET') {
    if ($action === 'website-orders' || $action === 'website_orders' || $action === 'orders' || $action === 'kanban') {
        seosys300_json_ok(array(
            'orders' => seosys300_admin_kanban_orders(),
        ));
    }
    if ($action === 'order-detail' || $action === 'order_detail') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        seosys300_json_ok(seosys300_admin_order_detail($id));
    }
    if ($action === 'inbox') {
        seosys300_json_ok(array(
            'items' => seosys300_admin_inbox_items(),
        ));
    }
    if ($action === 'student-detail' || $action === 'student_detail') {
        $mb = isset($_GET['mbId']) ? (string) $_GET['mbId'] : '';
        seosys300_json_ok(seosys300_admin_student_detail($mb));
    }
    if ($action === 'projects' || $action === 'project-list' || $action === 'project_list') {
        seosys300_json_ok(array(
            'projects' => seosys300_admin_project_list(),
        ));
    }
    if ($action === 'notes') {
        $pid = isset($_GET['projectId']) ? (int) $_GET['projectId'] : 0;
        $oid = isset($_GET['orderId']) ? (int) $_GET['orderId'] : 0;
        seosys300_json_ok(array('notes' => seosys300_admin_notes($pid, $oid)));
    }
    if ($action === 'diagnostics') {
        seosys300_json_ok(seosys300_admin_diagnostics());
    }
    if ($action === 'integrations') {
        $filter = isset($_GET['filter']) ? preg_replace('/[^a-z0-9_]/', '', (string) $_GET['filter']) : '';
        seosys300_json_ok(array('items' => seosys300_admin_integrations_monitor($filter)));
    }
    if ($action === 'tool-health' || $action === 'tool_health') {
        seosys300_json_ok(array('items' => seosys300_admin_tool_health()));
    }
    if ($action === 'ai-monitor' || $action === 'ai_monitor') {
        seosys300_json_ok(array('items' => seosys300_admin_ai_monitor()));
    }
    if ($action === 'classes' || $action === 'class-queue') {
        seosys300_json_ok(seosys300_class_admin_queue());
    }
    if ($action === 'geo' || $action === 'geo-queue') {
        $filter = isset($_GET['status']) ? (string) $_GET['status'] : 'review';
        seosys300_json_ok(seosys300_geo_admin_queue_extended($filter));
    }
    if ($action === 'revisions' || $action === 'revision-queue' || $action === 'revision_queue') {
        $filter = isset($_GET['status']) ? (string) $_GET['status'] : 'open';
        seosys300_json_ok(seosys300_revision_admin_queue($filter));
    }
    if ($action === 'revision-detail' || $action === 'revision_detail') {
        $id = isset($_GET['ticketId']) ? (int) $_GET['ticketId'] : (isset($_GET['id']) ? (int) $_GET['id'] : 0);
        seosys300_json_ok(seosys300_revision_admin_detail($id));
    }
    seosys300_json_ok(array(
        'projects' => seosys300_admin_project_list(),
    ));
}

seosys300_require_csrf($input);

if ($action === 'change-status' || $action === 'change_status') {
    $id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    $status = isset($input['status']) ? (string) $input['status'] : '';
    $memo = isset($input['memo']) ? (string) $input['memo'] : '';
    seosys300_json_ok(seosys300_admin_change_order_status($id, $status, $memo));
}

if ($action === 'note' || $action === 'admin-note') {
    $pid = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $oid = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    $note = isset($input['note']) ? (string) $input['note'] : '';
    seosys300_json_ok(seosys300_admin_add_note($pid, $oid, $note), 201);
}

if ($action === 'request-more-info' || $action === 'request_more_info' || $action === 'request-materials') {
    $id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    seosys300_json_ok(seosys300_admin_request_more_info($id, $input));
}

if ($action === 'preview-url' || $action === 'preview_url' || $action === 'save-preview-url') {
    $id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    if ($id < 1) {
        seosys300_json_error(422, 'validation_error', '주문을 선택해주세요.');
    }
    seosys300_apply_order_fields($id, array(
        'previewUrl' => isset($input['previewUrl']) ? $input['previewUrl'] : '',
    ), true);
    seosys300_json_ok(seosys300_admin_order_detail($id));
}

if ($action === 'request-checklist' || $action === 'request_checklist' || $action === 'save-checklist') {
    $id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    seosys300_json_ok(seosys300_admin_save_request_checklist($id, $input));
}

if ($action === 'sync-metrics' || $action === 'sync_metrics') {
    seosys300_require_metrics_tables();
    $pid = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $provider = isset($input['provider']) ? (string) $input['provider'] : '';
    $res = seosys300_admin_sync_project($pid, $provider);
    if (empty($res['ok'])) {
        seosys300_json_error(409, $res['code'], seosys300_sync_user_message($res['code']));
    }
    seosys300_json_ok($res);
}

if ($action === 'class-save' || $action === 'class_save') {
    seosys300_json_ok(seosys300_class_admin_save($input));
}

if ($action === 'geo-save' || $action === 'geo_save') {
    seosys300_json_ok(seosys300_geo_admin_save($input));
}

if ($action === 'geo-help-save' || $action === 'geo_help_save') {
    seosys300_json_ok(seosys300_geo_admin_help_save($input));
}

if ($action === 'revision-save' || $action === 'revision_save') {
    seosys300_json_ok(seosys300_revision_admin_save($input));
}

if ($action === 'revision-upload' || $action === 'revision_upload') {
    $id = isset($_POST['ticketId']) ? (int) $_POST['ticketId'] : (isset($input['ticketId']) ? (int) $input['ticketId'] : 0);
    seosys300_json_ok(seosys300_revision_upload_file($id, seosys300_current_mb_id(), true), 201);
}

seosys300_json_error(400, 'unknown_action', '요청을 처리할 수 없습니다.');
