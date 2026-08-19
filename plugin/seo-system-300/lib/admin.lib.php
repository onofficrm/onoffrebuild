<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_admin_notes_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_admin_notes_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_admin_notes_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_apply_website_progress($order_id, $status)
{
    global $g5;
    $pct = seosys300_website_progress_for_status($status);
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_website_orders_table']}` SET progress = {$pct}, updated_at = '{$now}' WHERE id = " . (int) $order_id);
    return $pct;
}

function seosys300_admin_change_order_status($order_id, $to_status, $memo = '')
{
    global $g5;
    if (!seosys300_is_allowed_order_status($to_status)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 주문 상태입니다.');
    }
    $to_status = seosys300_normalize_order_status($to_status);
    $table = $g5['seosys300_website_orders_table'];
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = " . (int) $order_id . " LIMIT 1");
    if (!$row) {
        seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
    }
    $from = (string) $row['status'];
    if ($from === $to_status) {
        return seosys300_admin_order_detail((int) $order_id);
    }
    if (!seosys300_begin()) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $now = seosys300_now();
    $draft = $to_status === 'draft' ? 1 : 0;
    $submitted = ($to_status !== 'draft' && empty($row['submitted_at'])) ? ", submitted_at = '{$now}'" : '';
    $pct = seosys300_website_progress_for_status($to_status);
    if (!seosys300_query("UPDATE `{$table}` SET status = '" . seosys300_esc($to_status) . "', is_draft = {$draft}, progress = {$pct}, updated_at = '{$now}' {$submitted} WHERE id = " . (int) $order_id)) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    seosys300_append_status_history((int) $order_id, $from, $to_status, 'admin', $memo);
    if (!seosys300_commit()) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    seosys300_log_activity((int) $row['project_id'], 'WEBSITE_STATUS_CHANGED', '홈페이지 상태가 변경되었습니다.', array(
        'entity_type' => 'website_order',
        'entity_id' => (int) $order_id,
        'metadata' => array('from' => $from, 'to' => $to_status),
    ));
    seosys300_notify_order_event('WEBSITE_STATUS_CHANGED', array(
        'order_id' => (int) $order_id,
        'from' => $from,
        'to' => $to_status,
    ));
    seosys300_sync_auto_roadmap((int) $row['project_id']);
    return seosys300_admin_order_detail((int) $order_id);
}

function seosys300_admin_request_more_info($order_id, $input)
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_orders_table'];
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$oid} LIMIT 1");
    if (!$row) {
        seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
    }
    $title = isset($input['title']) ? trim((string) $input['title']) : '';
    $body = isset($input['body']) ? trim((string) $input['body']) : (isset($input['message']) ? trim((string) $input['message']) : '');
    if ($title === '' || $body === '') {
        seosys300_json_error(422, 'validation_error', '제목과 요청 내용을 입력해주세요.');
    }
    $categories = array();
    if (isset($input['categories']) && is_array($input['categories'])) {
        foreach ($input['categories'] as $c) {
            $categories[] = seosys300_normalize_category($c);
        }
    } elseif (isset($input['category']) && (string) $input['category'] !== '') {
        $categories[] = seosys300_normalize_category($input['category']);
    }
    $adminMemo = isset($input['adminMemo']) ? substr(trim((string) $input['adminMemo']), 0, 4000) : '';
    $request = array(
        'title' => substr($title, 0, 191),
        'body' => substr($body, 0, 4000),
        'categories' => $categories,
        'requestedAt' => seosys300_now(),
    );
    $payload = array(
        'materialsRequest' => $request,
    );
    seosys300_apply_order_fields($oid, $payload, true);
    if (seosys300_normalize_order_status($row['status']) !== 'need_more_info') {
        seosys300_admin_change_order_status($oid, 'need_more_info', $title);
    } else {
        seosys300_append_status_history($oid, (string) $row['status'], 'need_more_info', 'admin', $title);
    }
    if ($adminMemo !== '') {
        seosys300_admin_add_note((int) $row['project_id'], $oid, $adminMemo);
    }
    seosys300_log_activity((int) $row['project_id'], 'WEBSITE_MATERIALS_REQUESTED', '추가 자료가 요청되었습니다.', array(
        'entity_type' => 'website_order',
        'entity_id' => $oid,
        'metadata' => array('title' => $title),
    ));
    seosys300_notify_order_event('WEBSITE_MATERIALS_REQUESTED', array(
        'order_id' => $oid,
        'project_id' => (int) $row['project_id'],
    ));
    return seosys300_admin_order_detail($oid);
}

function seosys300_admin_add_note($project_id, $order_id, $note)
{
    global $g5;
    if (!seosys300_admin_notes_tables_ready()) {
        seosys300_json_error(503, 'tables_missing', '저장 기능이 아직 준비되지 않았습니다.');
    }
    $note = trim((string) $note);
    if ($note === '') {
        seosys300_json_error(422, 'validation_error', '메모를 입력해주세요.');
    }
    if (strlen($note) > 4000) {
        seosys300_json_error(422, 'validation_error', '메모가 너무 깁니다.');
    }
    $now = seosys300_now();
    $table = $g5['seosys300_admin_notes_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        order_id = " . (int) $order_id . ",
        admin_mb_id = '" . seosys300_esc(seosys300_current_mb_id()) . "',
        note = '" . seosys300_esc($note) . "',
        created_at = '{$now}',
        updated_at = '{$now}'");
    return array('id' => (int) sql_insert_id());
}

function seosys300_admin_notes($project_id, $order_id = 0)
{
    global $g5;
    if (!seosys300_admin_notes_tables_ready()) {
        return array();
    }
    $where = 'project_id = ' . (int) $project_id;
    if ($order_id > 0) {
        $where .= ' AND order_id = ' . (int) $order_id;
    }
    $rows = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_admin_notes_table']}` WHERE {$where} ORDER BY id DESC LIMIT 50");
    $out = array();
    foreach ($rows as $row) {
        $out[] = array(
            'id' => (int) $row['id'],
            'projectId' => (int) $row['project_id'],
            'orderId' => (int) $row['order_id'],
            'adminMbId' => (string) $row['admin_mb_id'],
            'note' => (string) $row['note'],
            'createdAt' => (string) $row['created_at'],
        );
    }
    return $out;
}

function seosys300_status_history($order_id)
{
    return seosys300_order_history($order_id);
}

function seosys300_admin_order_detail($order_id)
{
    global $g5;
    $table = $g5['seosys300_website_orders_table'];
    $ptable = $g5['seosys300_projects_table'];
    $row = seosys300_fetch("SELECT o.*, p.name AS project_name, p.domain AS project_domain, p.progress AS project_progress
        FROM `{$table}` o
        LEFT JOIN `{$ptable}` p ON p.id = o.project_id
        WHERE o.id = " . (int) $order_id . " LIMIT 1");
    if (!$row) {
        seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
    }
    list($menus, $features, $refs, $files) = seosys300_order_relations($row['id']);
    $item = seosys300_order_to_api($row, $menus, $features, $refs, $files);
    $item['projectName'] = (string) $row['project_name'];
    $item['projectDomain'] = (string) $row['project_domain'];
    $item['projectProgress'] = (int) $row['project_progress'];
    $item['kanbanColumn'] = seosys300_kanban_column_for_status($row['status']);
    $item['fileCount'] = count($files);
    $item['history'] = seosys300_status_history((int) $row['id']);
    $item['adminNotes'] = seosys300_admin_notes((int) $row['project_id'], (int) $row['id']);
    return $item;
}

function seosys300_admin_kanban_orders()
{
    $orders = seosys300_admin_order_list();
    $out = array();
    foreach ($orders as $order) {
        if ($order['status'] === 'draft') {
            continue;
        }
        $col = seosys300_kanban_column_for_status($order['status']);
        if ($col === '') {
            continue;
        }
        $order['kanbanColumn'] = $col;
        $order['fileCount'] = isset($order['files']) ? count($order['files']) : 0;
        $out[] = $order;
    }
    return $out;
}

function seosys300_admin_inbox_items()
{
    global $g5;
    $items = array();
    $ot = $g5['seosys300_website_orders_table'];
    $pt = $g5['seosys300_projects_table'];
    $waiting = seosys300_fetch_all("SELECT o.*, p.name AS project_name FROM `{$ot}` o LEFT JOIN `{$pt}` p ON p.id = o.project_id WHERE o.status IN ('material_waiting','need_more_info') ORDER BY o.updated_at ASC LIMIT 50");
    foreach ($waiting as $row) {
        $items[] = array(
            'id' => 'mat-' . $row['id'],
            'type' => 'missing_material',
            'title' => '홈페이지 자료 대기',
            'description' => ($row['project_name'] ? $row['project_name'] . ' · ' : '') . '자료 대기 상태입니다.',
            'mbId' => (string) $row['mb_id'],
            'projectId' => (int) $row['project_id'],
            'orderId' => (int) $row['id'],
            'urgentLevel' => 'warning',
        );
    }
    $stale = seosys300_fetch_all("SELECT o.*, p.name AS project_name FROM `{$ot}` o LEFT JOIN `{$pt}` p ON p.id = o.project_id WHERE o.status = 'submitted' AND o.updated_at < DATE_SUB(NOW(), INTERVAL 3 DAY) LIMIT 50");
    foreach ($stale as $row) {
        $items[] = array(
            'id' => 'stale-' . $row['id'],
            'type' => 'review_pending',
            'title' => '접수 후 상태 변화 없음',
            'description' => ($row['project_name'] ? $row['project_name'] . ' · ' : '') . 'SUBMITTED 상태가 3일 이상 유지되고 있습니다.',
            'mbId' => (string) $row['mb_id'],
            'projectId' => (int) $row['project_id'],
            'orderId' => (int) $row['id'],
            'urgentLevel' => 'urgent',
        );
    }
    $review = seosys300_fetch_all("SELECT o.*, p.name AS project_name FROM `{$ot}` o LEFT JOIN `{$pt}` p ON p.id = o.project_id WHERE o.status = 'customer_review' AND o.updated_at < DATE_SUB(NOW(), INTERVAL 3 DAY) LIMIT 50");
    foreach ($review as $row) {
        $items[] = array(
            'id' => 'cr-' . $row['id'],
            'type' => 'review_pending',
            'title' => '고객 검수 장기 대기',
            'description' => ($row['project_name'] ? $row['project_name'] . ' · ' : '') . '고객 검수가 길어지고 있습니다.',
            'mbId' => (string) $row['mb_id'],
            'projectId' => (int) $row['project_id'],
            'orderId' => (int) $row['id'],
            'urgentLevel' => 'warning',
        );
    }
    if (seosys300_activity_tables_ready()) {
        $at = $g5['seosys300_activities_table'];
        $inactive = seosys300_fetch_all("SELECT p.id, p.mb_id, p.name, MAX(a.created_at) AS last_at
            FROM `{$pt}` p
            LEFT JOIN `{$at}` a ON a.project_id = p.id
            WHERE p.is_active = 1
            GROUP BY p.id
            HAVING last_at IS NULL OR last_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
            LIMIT 50");
        foreach ($inactive as $row) {
            $items[] = array(
                'id' => 'inact-' . $row['id'],
                'type' => 'inactive',
                'title' => '7일 이상 활동 없음',
                'description' => ((string) $row['name']) . ' 프로젝트에 최근 활동이 없습니다.',
                'mbId' => (string) $row['mb_id'],
                'projectId' => (int) $row['id'],
                'orderId' => 0,
                'urgentLevel' => 'normal',
            );
        }
    }
    return $items;
}

function seosys300_admin_student_detail($mb_id)
{
    global $g5;
    $mb_id = trim((string) $mb_id);
    if ($mb_id === '') {
        seosys300_json_error(422, 'validation_error', '회원 ID가 필요합니다.');
    }
    $projects = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_projects_table']}` WHERE mb_id = '" . seosys300_esc($mb_id) . "' ORDER BY id DESC");
    $outProjects = array();
    foreach ($projects as $row) {
        $item = seosys300_project_to_api($row, seosys300_project_keywords($row['id']));
        if (seosys300_roadmap_tables_ready()) {
            $rm = seosys300_roadmap_for_project((int) $row['id']);
            $item['roadmap'] = $rm;
        }
        $order = seosys300_current_order_for_project((int) $row['id'], $mb_id);
        $item['websiteOrder'] = $order ? seosys300_order_to_api($order) : null;
        if (seosys300_mission_tables_ready()) {
            $item['todayMissions'] = seosys300_missions_for_date((int) $row['id'], $mb_id, seosys300_today_date());
        }
        if (seosys300_activity_tables_ready()) {
            $item['recentActivity'] = seosys300_activity_list((int) $row['id'], 10);
        }
        $item['adminNotes'] = seosys300_admin_notes((int) $row['id']);
        $outProjects[] = $item;
    }
    return array(
        'mbId' => $mb_id,
        'projects' => $outProjects,
    );
}
