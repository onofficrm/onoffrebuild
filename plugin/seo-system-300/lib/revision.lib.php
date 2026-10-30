<?php
/**
 * Website revision tickets: student requests, free/quote workflow, attachments.
 * Tables are created on first use.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_revision_env($name, $default = '')
{
    if (function_exists('seosys300_env')) {
        return seosys300_env($name, $default);
    }
    $raw = getenv($name);
    return ($raw === false || $raw === '') ? $default : (string) $raw;
}

function seosys300_revision_free_per_month()
{
    $n = (int) seosys300_revision_env('SEOSYS300_REVISION_FREE_PER_MONTH', '3');
    return $n > 0 ? $n : 3;
}

function seosys300_revision_quote_days()
{
    $n = (int) seosys300_revision_env('SEOSYS300_REVISION_QUOTE_DAYS', '7');
    return $n > 0 ? $n : 7;
}

function seosys300_revision_tickets_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_tickets';
}

function seosys300_revision_comments_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_comments';
}

function seosys300_revision_files_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_files';
}

function seosys300_revision_ensure_column($table, $column, $definition)
{
    $safeColumn = seosys300_esc($column);
    $row = seosys300_fetch("SHOW COLUMNS FROM `{$table}` LIKE '{$safeColumn}'");
    if ($row) {
        return;
    }
    seosys300_query("ALTER TABLE `{$table}` ADD {$definition}");
}

function seosys300_revision_clamp_percent($value)
{
    $n = (float) $value;
    if ($n < 0) {
        return 0.0;
    }
    if ($n > 100) {
        return 100.0;
    }
    return round($n, 1);
}

function seosys300_revision_normalize_box($box)
{
    if (!is_array($box)) {
        return null;
    }
    $x = seosys300_revision_clamp_percent(isset($box['x']) ? $box['x'] : 0);
    $y = seosys300_revision_clamp_percent(isset($box['y']) ? $box['y'] : 0);
    $w = seosys300_revision_clamp_percent(isset($box['w']) ? $box['w'] : 0);
    $h = seosys300_revision_clamp_percent(isset($box['h']) ? $box['h'] : 0);
    if ($w < 0.5 || $h < 0.5) {
        return null;
    }
    if ($x + $w > 100) {
        $w = seosys300_revision_clamp_percent(100 - $x);
    }
    if ($y + $h > 100) {
        $h = seosys300_revision_clamp_percent(100 - $y);
    }
    return array('x' => $x, 'y' => $y, 'w' => $w, 'h' => $h);
}

function seosys300_revision_normalize_annotation($raw)
{
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        $raw = is_array($decoded) ? $decoded : array();
    }
    if (!is_array($raw)) {
        return null;
    }
    $tool = isset($raw['tool']) ? preg_replace('/[^a-z]/', '', strtolower((string) $raw['tool'])) : '';
    if (!in_array($tool, array('block', 'box', 'pen'), true)) {
        return null;
    }
    $label = trim(isset($raw['label']) ? (string) $raw['label'] : '');
    $label = preg_replace('/[\x00-\x1F\x7F]/u', '', $label);
    if (!is_string($label) || $label === '') {
        $label = '선택한 부분';
    }
    if (function_exists('mb_substr')) {
        $label = mb_substr($label, 0, 80);
    } else {
        $label = substr($label, 0, 80);
    }
    $device = isset($raw['device']) ? preg_replace('/[^a-z]/', '', strtolower((string) $raw['device'])) : 'pc';
    if (!in_array($device, array('pc', 'mobile', 'both'), true)) {
        $device = 'pc';
    }
    $pageUrl = trim(isset($raw['pageUrl']) ? (string) $raw['pageUrl'] : '');
    if (strlen($pageUrl) > 500) {
        $pageUrl = substr($pageUrl, 0, 500);
    }
    $out = array(
        'tool' => $tool,
        'label' => $label,
        'device' => $device,
        'pageUrl' => $pageUrl,
    );
    $box = seosys300_revision_normalize_box(isset($raw['box']) ? $raw['box'] : null);
    if ($box) {
        $out['box'] = $box;
    }
    $snapId = isset($raw['snapshotFileId']) ? (int) $raw['snapshotFileId'] : 0;
    if ($snapId > 0) {
        $out['snapshotFileId'] = $snapId;
    }
    return $out;
}

function seosys300_revision_annotation_with_snapshot($annotation)
{
    if (!is_array($annotation)) {
        return null;
    }
    $fid = isset($annotation['snapshotFileId']) ? (int) $annotation['snapshotFileId'] : 0;
    if ($fid > 0) {
        $file = seosys300_revision_get_file_row($fid);
        if ($file) {
            $api = seosys300_revision_file_to_api($file);
            $annotation['snapshotUrl'] = (string) $api['downloadUrl'];
        }
    }
    return $annotation;
}

function seosys300_revision_bind_snapshot($ticket_id, $file_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return;
    }
    $ann = seosys300_revision_annotation_from_row($row);
    if (!$ann) {
        $ann = array(
            'tool' => 'box',
            'label' => '선택한 영역',
            'device' => 'pc',
            'pageUrl' => (string) $row['page_url'],
        );
    }
    $ann['snapshotFileId'] = (int) $file_id;
    $json = json_encode($ann, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return;
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET annotation_json = '" . seosys300_esc($json) . "', updated_at = '{$now}'
         WHERE id = " . (int) $ticket_id
    );
}

function seosys300_revision_annotation_from_description($description, $pageUrl = '', $device = '')
{
    if (!preg_match('/^\[표시\]\s*(.+?)\s*·\s*(PC|모바일)/u', (string) $description, $m)) {
        return null;
    }
    $box = null;
    if (preg_match('/영역:\s*([\d.]+),([\d.]+)\s*-\s*([\d.]+),([\d.]+)/u', (string) $description, $b)) {
        $box = array(
            'x' => (float) $b[1],
            'y' => (float) $b[2],
            'w' => (float) $b[3] - (float) $b[1],
            'h' => (float) $b[4] - (float) $b[2],
        );
    }
    return seosys300_revision_normalize_annotation(array(
        'tool' => 'block',
        'label' => $m[1],
        'device' => $m[2] === '모바일' ? 'mobile' : ($device !== '' ? $device : 'pc'),
        'pageUrl' => $pageUrl,
        'box' => $box,
    ));
}

function seosys300_revision_annotation_from_row($row)
{
    if (!is_array($row)) {
        return null;
    }
    $fromJson = seosys300_revision_normalize_annotation(isset($row['annotation_json']) ? $row['annotation_json'] : '');
    if ($fromJson) {
        return $fromJson;
    }
    return seosys300_revision_annotation_from_description(
        isset($row['description']) ? $row['description'] : '',
        isset($row['page_url']) ? $row['page_url'] : '',
        isset($row['device']) ? $row['device'] : ''
    );
}

function seosys300_revision_ensure_tables()
{
    static $done = false;
    if ($done) {
        return true;
    }
    $tickets = seosys300_revision_tickets_table();
    $comments = seosys300_revision_comments_table();
    $files = seosys300_revision_files_table();

    $ok = seosys300_query("CREATE TABLE IF NOT EXISTS `{$tickets}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `order_id` int(11) NOT NULL DEFAULT 0,
        `project_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `title` varchar(191) NOT NULL DEFAULT '',
        `description` text NOT NULL,
        `page_url` varchar(500) NOT NULL DEFAULT '',
        `device` varchar(20) NOT NULL DEFAULT 'both',
        `category` varchar(40) NOT NULL DEFAULT 'other',
        `priority` varchar(20) NOT NULL DEFAULT 'normal',
        `status` varchar(30) NOT NULL DEFAULT 'requested',
        `quote_points` int(11) NOT NULL DEFAULT 0,
        `quote_note` text NOT NULL,
        `quote_version` int(11) NOT NULL DEFAULT 0,
        `quote_expires_at` datetime DEFAULT NULL,
        `paid_at` datetime DEFAULT NULL,
        `paid_request_id` varchar(80) NOT NULL DEFAULT '',
        `feedback_note` text NOT NULL,
        `feedback_url` varchar(500) NOT NULL DEFAULT '',
        `annotation_json` text NOT NULL,
        `agent_brief` text NOT NULL,
        `free_used` tinyint(1) NOT NULL DEFAULT 0,
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_mb_status` (`mb_id`,`status`),
        KEY `idx_order` (`order_id`),
        KEY `idx_project` (`project_id`),
        KEY `idx_created` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    $ok2 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$comments}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ticket_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `author_role` varchar(20) NOT NULL DEFAULT 'student',
        `body` text NOT NULL,
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_ticket` (`ticket_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    seosys300_revision_ensure_column($tickets, 'annotation_json', '`annotation_json` text NULL');
    seosys300_revision_ensure_column($tickets, 'agent_brief', '`agent_brief` text NULL');

    $ok3 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$files}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ticket_id` int(11) NOT NULL DEFAULT 0,
        `comment_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `original_name` varchar(255) NOT NULL DEFAULT '',
        `stored_name` varchar(255) NOT NULL DEFAULT '',
        `mime_type` varchar(120) NOT NULL DEFAULT '',
        `file_size` int(11) NOT NULL DEFAULT 0,
        `rel_path` varchar(500) NOT NULL DEFAULT '',
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_ticket` (`ticket_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    $done = ($ok && $ok2 && $ok3);
    return $done;
}

function seosys300_revision_statuses()
{
    return array(
        'requested',
        'reviewing',
        'need_info',
        'free_progress',
        'quote_pending',
        'paid',
        'in_progress',
        'feedback',
        'completed',
        'cancelled',
        'expired',
    );
}

function seosys300_revision_status_label($status)
{
    $map = array(
        'requested' => '요청됨',
        'reviewing' => '검토중',
        'need_info' => '자료 필요',
        'free_progress' => '무료 진행',
        'quote_pending' => '결제 대기',
        'paid' => '결제 완료',
        'in_progress' => '작업중',
        'feedback' => '확인 요청',
        'completed' => '완료',
        'cancelled' => '취소',
        'expired' => '견적 만료',
    );
    $key = (string) $status;
    return isset($map[$key]) ? $map[$key] : $key;
}

function seosys300_revision_categories()
{
    return array('layout', 'design', 'content', 'seo_tag', 'speed', 'other');
}

function seosys300_revision_devices()
{
    return array('pc', 'mobile', 'both');
}

function seosys300_revision_open_statuses()
{
    return array(
        'requested',
        'reviewing',
        'need_info',
        'free_progress',
        'quote_pending',
        'paid',
        'in_progress',
        'feedback',
    );
}

function seosys300_revision_eligible_order($order)
{
    if (!$order || !is_array($order)) {
        return false;
    }
    $status = seosys300_normalize_order_status(isset($order['status']) ? $order['status'] : '');
    return $status !== '' && $status !== 'draft';
}

function seosys300_revision_month_start()
{
    return date('Y-m-01 00:00:00');
}

function seosys300_revision_free_quota($mb_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $mb = seosys300_esc(substr((string) $mb_id, 0, 100));
    $start = seosys300_esc(seosys300_revision_month_start());
    $row = seosys300_fetch(
        "SELECT COUNT(*) AS cnt FROM `{$table}`
         WHERE mb_id = '{$mb}' AND free_used = 1 AND status <> 'cancelled'
           AND created_at >= '{$start}'"
    );
    $used = $row ? (int) $row['cnt'] : 0;
    $limit = seosys300_revision_free_per_month();
    return array(
        'limit' => $limit,
        'used' => $used,
        'remaining' => max(0, $limit - $used),
    );
}

function seosys300_revision_expire_quotes()
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET status = 'expired', updated_at = '{$now}'
         WHERE status = 'quote_pending'
           AND quote_expires_at IS NOT NULL
           AND quote_expires_at < '{$now}'"
    );
}

function seosys300_revision_file_to_api($row)
{
    return array(
        'id' => (int) $row['id'],
        'ticketId' => (int) $row['ticket_id'],
        'commentId' => (int) $row['comment_id'],
        'originalName' => (string) $row['original_name'],
        'mimeType' => (string) $row['mime_type'],
        'fileSize' => (int) $row['file_size'],
        'createdAt' => (string) $row['created_at'],
        'downloadUrl' => '/plugin/seo-system-300/api/revision/download.php?id=' . (int) $row['id'],
    );
}

function seosys300_revision_comment_to_api($row)
{
    return array(
        'id' => (int) $row['id'],
        'ticketId' => (int) $row['ticket_id'],
        'mbId' => (string) $row['mb_id'],
        'authorRole' => (string) $row['author_role'],
        'body' => (string) $row['body'],
        'createdAt' => (string) $row['created_at'],
    );
}

function seosys300_revision_ticket_to_api($row, $withDetail = false)
{
    $ticket = array(
        'id' => (int) $row['id'],
        'orderId' => (int) $row['order_id'],
        'projectId' => (int) $row['project_id'],
        'mbId' => (string) $row['mb_id'],
        'title' => (string) $row['title'],
        'description' => (string) $row['description'],
        'pageUrl' => (string) $row['page_url'],
        'device' => (string) $row['device'],
        'category' => (string) $row['category'],
        'priority' => (string) $row['priority'],
        'status' => (string) $row['status'],
        'statusLabel' => seosys300_revision_status_label($row['status']),
        'quotePoints' => (int) $row['quote_points'],
        'quoteNote' => (string) $row['quote_note'],
        'quoteVersion' => (int) $row['quote_version'],
        'quoteExpiresAt' => $row['quote_expires_at'] ? (string) $row['quote_expires_at'] : null,
        'paidAt' => $row['paid_at'] ? (string) $row['paid_at'] : null,
        'feedbackNote' => (string) $row['feedback_note'],
        'feedbackUrl' => (string) $row['feedback_url'],
        'annotation' => seosys300_revision_annotation_with_snapshot(seosys300_revision_annotation_from_row($row)),
        'agentBrief' => isset($row['agent_brief']) ? (string) $row['agent_brief'] : '',
        'freeUsed' => (int) $row['free_used'] === 1,
        'createdAt' => (string) $row['created_at'],
        'updatedAt' => (string) $row['updated_at'],
    );
    if ($withDetail) {
        $ticket['comments'] = seosys300_revision_list_comments((int) $row['id']);
        $ticket['files'] = seosys300_revision_list_files((int) $row['id']);
    }
    return $ticket;
}

function seosys300_revision_list_comments($ticket_id)
{
    $table = seosys300_revision_comments_table();
    $tid = (int) $ticket_id;
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE ticket_id = {$tid} ORDER BY id ASC"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_comment_to_api($row);
    }
    return $out;
}

function seosys300_revision_list_files($ticket_id)
{
    $table = seosys300_revision_files_table();
    $tid = (int) $ticket_id;
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE ticket_id = {$tid} ORDER BY id ASC"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_file_to_api($row);
    }
    return $out;
}

function seosys300_revision_get_row($ticket_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $id = (int) $ticket_id;
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$id} LIMIT 1");
}

function seosys300_revision_get_owned($ticket_id, $mb_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return null;
    }
    if ((string) $row['mb_id'] !== (string) $mb_id) {
        return null;
    }
    return $row;
}

function seosys300_revision_add_comment($ticket_id, $mb_id, $role, $body)
{
    seosys300_revision_ensure_tables();
    $body = trim((string) $body);
    if ($body === '') {
        return null;
    }
    $table = seosys300_revision_comments_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "INSERT INTO `{$table}` SET
            ticket_id = " . (int) $ticket_id . ",
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            author_role = '" . seosys300_esc($role === 'admin' ? 'admin' : 'student') . "',
            body = '" . seosys300_esc($body) . "',
            created_at = '{$now}'"
    );
    return (int) sql_insert_id();
}

function seosys300_revision_notify($event, $ticket, $extra = array())
{
    if (!function_exists('seosys300_notify_order_event')) {
        return;
    }
    $payload = array_merge(array(
        'order_id' => (int) $ticket['order_id'],
        'project_id' => (int) $ticket['project_id'],
        'mb_id' => (string) $ticket['mb_id'],
        'ticket_id' => (int) $ticket['id'],
        'ticket_title' => (string) $ticket['title'],
        'status' => (string) $ticket['status'],
        'quote_points' => (int) $ticket['quote_points'],
    ), $extra);
    seosys300_notify_order_event($event, $payload);
}

function seosys300_revision_list_for_student($project_id, $mb_id)
{
    seosys300_revision_ensure_tables();
    seosys300_revision_expire_quotes();
    $table = seosys300_revision_tickets_table();
    $pid = (int) $project_id;
    $mb = seosys300_esc(substr((string) $mb_id, 0, 100));
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}`
         WHERE project_id = {$pid} AND mb_id = '{$mb}'
         ORDER BY id DESC
         LIMIT 100"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_ticket_to_api($row, false);
    }
    return array(
        'tickets' => $out,
        'quota' => seosys300_revision_free_quota($mb_id),
        'eligible' => true,
    );
}

function seosys300_revision_create($input, $mb_id)
{
    seosys300_revision_ensure_tables();
    $project_id = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $order_id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }

    $order = null;
    if ($order_id > 0) {
        $order = seosys300_get_owned_order($order_id, $mb_id);
    }
    if (!$order) {
        $order = seosys300_current_order_for_project($project_id, $mb_id);
    }
    if (!$order || !seosys300_revision_eligible_order($order)) {
        seosys300_json_error(409, 'order_not_eligible', '우리 쪽에서 제작 중인 홈페이지 주문이 있을 때만 수정 요청을 할 수 있습니다.');
    }

    $title = trim(isset($input['title']) ? (string) $input['title'] : '');
    $description = trim(isset($input['description']) ? (string) $input['description'] : '');
    if ($title === '') {
        seosys300_json_error(422, 'validation_error', '제목을 입력해주세요.');
    }

    $category = isset($input['category']) ? preg_replace('/[^a-z0-9_]/', '', strtolower((string) $input['category'])) : 'other';
    if (!in_array($category, seosys300_revision_categories(), true)) {
        $category = 'other';
    }
    $device = isset($input['device']) ? preg_replace('/[^a-z]/', '', strtolower((string) $input['device'])) : 'both';
    if (!in_array($device, seosys300_revision_devices(), true)) {
        $device = 'both';
    }
    $priority = isset($input['priority']) && (string) $input['priority'] === 'urgent' ? 'urgent' : 'normal';
    $page_url = trim(isset($input['pageUrl']) ? (string) $input['pageUrl'] : '');
    if (strlen($page_url) > 500) {
        $page_url = substr($page_url, 0, 500);
    }
    $annotation = seosys300_revision_normalize_annotation(isset($input['annotation']) ? $input['annotation'] : null);
    if ($annotation && $page_url === '' && $annotation['pageUrl'] !== '') {
        $page_url = $annotation['pageUrl'];
    }
    if ($annotation && empty($annotation['pageUrl']) && $page_url !== '') {
        $annotation['pageUrl'] = $page_url;
    }
    $annotation_json = $annotation ? json_encode($annotation, JSON_UNESCAPED_UNICODE) : '';

    $now = seosys300_now();
    $table = seosys300_revision_tickets_table();
    seosys300_query(
        "INSERT INTO `{$table}` SET
            order_id = " . (int) $order['id'] . ",
            project_id = " . (int) $order['project_id'] . ",
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            title = '" . seosys300_esc(substr($title, 0, 191)) . "',
            description = '" . seosys300_esc($description) . "',
            page_url = '" . seosys300_esc($page_url) . "',
            device = '" . seosys300_esc($device) . "',
            category = '" . seosys300_esc($category) . "',
            priority = '" . seosys300_esc($priority) . "',
            status = 'requested',
            quote_note = '',
            feedback_note = '',
            feedback_url = '',
            annotation_json = '" . seosys300_esc($annotation_json) . "',
            agent_brief = '',
            created_at = '" . seosys300_esc($now) . "',
            updated_at = '" . seosys300_esc($now) . "'"
    );
    $id = (int) sql_insert_id();
    $row = seosys300_revision_get_row($id);
    seosys300_revision_notify('REVISION_REQUESTED', $row);
    return seosys300_revision_ticket_to_api($row, true);
}

function seosys300_revision_student_comment($ticket_id, $mb_id, $body)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (in_array($row['status'], array('completed', 'cancelled'), true)) {
        seosys300_json_error(409, 'ticket_closed', '완료·취소된 요청에는 댓글을 남길 수 없습니다.');
    }
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', $body);
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    if ($row['status'] === 'need_info') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'reviewing', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
    } else {
        seosys300_query(
            "UPDATE `{$table}` SET updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
    }
    return seosys300_revision_ticket_to_api(seosys300_revision_get_row($ticket_id), true);
}

function seosys300_revision_confirm_done($ticket_id, $mb_id, $ok)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if ($row['status'] !== 'feedback') {
        seosys300_json_error(409, 'invalid_status', '확인 요청 상태에서만 완료할 수 있습니다.');
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    if ($ok) {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'completed', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
        seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '수정 내용을 확인했습니다.');
    } else {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'in_progress', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
        seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '아직 반영되지 않았습니다. 추가 확인 부탁드립니다.');
    }
    $fresh = seosys300_revision_get_row($ticket_id);
    if ($ok) {
        seosys300_revision_notify('REVISION_COMPLETED', $fresh);
    }
    return seosys300_revision_ticket_to_api($fresh, true);
}

function seosys300_revision_pay_request_id($ticket_id, $quote_version)
{
    return 'rev' . (int) $ticket_id . 'q' . (int) $quote_version;
}

function seosys300_revision_confirm_payment($ticket_id, $mb_id, $input)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if ($row['status'] === 'paid' || $row['status'] === 'in_progress' || $row['status'] === 'feedback' || $row['status'] === 'completed') {
        if ((string) $row['paid_request_id'] !== '') {
            return seosys300_revision_ticket_to_api($row, true);
        }
    }
    if ($row['status'] !== 'quote_pending') {
        seosys300_json_error(409, 'invalid_status', '견적 대기 상태에서만 결제할 수 있습니다.');
    }
    if (!empty($row['quote_expires_at']) && strtotime((string) $row['quote_expires_at']) < time()) {
        $table = seosys300_revision_tickets_table();
        $now = seosys300_esc(seosys300_now());
        seosys300_query(
            "UPDATE `{$table}` SET status = 'expired', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
        seosys300_json_error(409, 'quote_expired', '견적 유효기간이 지났습니다. 운영자에게 새 견적을 요청해주세요.');
    }

    $version = isset($input['quoteVersion']) ? (int) $input['quoteVersion'] : 0;
    if ($version < 1 || $version !== (int) $row['quote_version']) {
        seosys300_json_error(409, 'quote_mismatch', '견적 정보가 변경되었습니다. 화면을 새로고침한 뒤 다시 시도해주세요.');
    }
    $points = (int) $row['quote_points'];
    if ($points < 1) {
        seosys300_json_error(422, 'invalid_quote', '견적 금액이 올바르지 않습니다.');
    }

    $request_id = isset($input['requestId']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) $input['requestId']) : '';
    $expected = seosys300_revision_pay_request_id($ticket_id, $version);
    if ($request_id === '' || $request_id !== $expected) {
        seosys300_json_error(422, 'invalid_request_id', '결제 요청 ID가 올바르지 않습니다.');
    }

    $pay = seosys300_revision_debit_points($mb_id, $points, $request_id, array(
        'ticket_id' => (int) $ticket_id,
        'quote_version' => $version,
        'order_id' => (int) $row['order_id'],
    ));
    if (empty($pay['ok'])) {
        seosys300_json_error(
            isset($pay['http']) ? (int) $pay['http'] : 502,
            isset($pay['code']) ? (string) $pay['code'] : 'POINT_USE_FAILED',
            isset($pay['message']) ? (string) $pay['message'] : '포인트 차감에 실패했습니다.'
        );
    }

    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET
            status = 'in_progress',
            paid_at = '{$now}',
            paid_request_id = '" . seosys300_esc($request_id) . "',
            updated_at = '{$now}'
         WHERE id = " . (int) $ticket_id . " AND status = 'quote_pending'"
    );
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '견적 ' . number_format($points) . 'P 결제를 완료했습니다.');
    $fresh = seosys300_revision_get_row($ticket_id);
    seosys300_revision_notify('REVISION_PAID', $fresh);
    return seosys300_revision_ticket_to_api($fresh, true);
}

/**
 * Charge the logged-in member on ONOFF through the same Core wallet
 * hold → capture contract used by /api/points.php?action=use.
 */
function seosys300_revision_debit_points($mb_id, $points, $request_id, $metadata = array())
{
    $bootstrap = dirname(__FILE__) . '/../../../lib/branded-auth/bootstrap.php';
    if (!is_file($bootstrap)) {
        return array(
            'ok' => false,
            'http' => 503,
            'code' => 'POINT_NOT_CONFIGURED',
            'message' => '포인트 결제 설정을 찾을 수 없습니다.',
        );
    }
    require_once $bootstrap;
    if (!\OnoffMarketing\BrandedAuth\BrandedAuthConfig::isConfigured()) {
        return array(
            'ok' => false,
            'http' => 503,
            'code' => 'POINT_NOT_CONFIGURED',
            'message' => '포인트 결제가 설정되어 있지 않습니다.',
        );
    }
    $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
    if ($cookies === '') {
        return array(
            'ok' => false,
            'http' => 401,
            'code' => 'unauthorized',
            'message' => '로그인 세션이 없어 결제할 수 없습니다. 다시 로그인한 뒤 시도해주세요.',
        );
    }
    $meta = is_array($metadata) ? $metadata : array();
    $meta['mb_id'] = (string) $mb_id;
    try {
        $session = \OnoffMarketing\BrandedAuth\PlatformAuthService::getSession($cookies);
        if (empty($session['authenticated'])) {
            return array(
                'ok' => false,
                'http' => 401,
                'code' => 'unauthorized',
                'message' => '온오프 로그인 후 과금 결제를 진행해주세요.',
            );
        }
        $sessionData = is_array($session['data']) ? $session['data'] : array();
        $payer = (string) ($sessionData['member_id'] ?? $sessionData['mb_id'] ?? '');
        if ($payer === '' || $payer !== (string) $mb_id) {
            return array(
                'ok' => false,
                'http' => 403,
                'code' => 'payer_mismatch',
                'message' => '결제는 수정 요청을 접수한 회원 계정으로만 할 수 있습니다.',
            );
        }
        $hold = \OnoffMarketing\BrandedAuth\CoreInternalClient::request('wallet/hold', array(
            'method' => 'POST',
            'cookies' => $cookies,
            'body' => array(
                'service_code' => 'ONOFF',
                'amount' => (int) $points,
                'reference_type' => 'website_revision',
                'reference_id' => (string) $request_id,
                'idempotency_key' => $request_id . ':hold',
                'metadata' => $meta,
            ),
        ));
        if (empty($hold['ok'])) {
            return array(
                'ok' => false,
                'http' => !empty($hold['status']) ? (int) $hold['status'] : 502,
                'code' => !empty($hold['code']) ? (string) $hold['code'] : 'CORE_HOLD_FAILED',
                'message' => !empty($hold['message']) ? (string) $hold['message'] : '포인트 결제 예약에 실패했습니다.',
            );
        }
        $hold_data = is_array($hold['data']) ? $hold['data'] : array();
        $hold_tx = is_array($hold_data['transaction'] ?? null) ? $hold_data['transaction'] : array();
        $hold_id = (string) ($hold_tx['transaction_id'] ?? $hold_tx['hold_transaction_id'] ?? $hold_data['hold_transaction_id'] ?? '');
        if ($hold_id === '') {
            return array(
                'ok' => false,
                'http' => 502,
                'code' => 'CORE_HOLD_INCOMPLETE',
                'message' => '포인트 결제 응답이 불완전합니다. 잠시 후 다시 시도해주세요.',
            );
        }
        $capture = \OnoffMarketing\BrandedAuth\CoreInternalClient::request('wallet/capture', array(
            'method' => 'POST',
            'cookies' => $cookies,
            'body' => array(
                'hold_transaction_id' => $hold_id,
                'idempotency_key' => $request_id . ':capture',
                'amount' => (int) $points,
            ),
        ));
        if (empty($capture['ok'])) {
            return array(
                'ok' => false,
                'http' => !empty($capture['status']) ? (int) $capture['status'] : 502,
                'code' => !empty($capture['code']) ? (string) $capture['code'] : 'CORE_CAPTURE_FAILED',
                'message' => !empty($capture['message']) ? (string) $capture['message'] : '포인트 결제에 실패했습니다.',
            );
        }
        return array('ok' => true, 'hold_transaction_id' => $hold_id);
    } catch (\OnoffMarketing\BrandedAuth\BrandedAuthException $e) {
        return array(
            'ok' => false,
            'http' => (int) $e->httpStatus,
            'code' => (string) $e->errorCode,
            'message' => $e->getMessage() !== '' ? $e->getMessage() : '포인트 결제에 실패했습니다.',
        );
    } catch (\Throwable $e) {
        return array(
            'ok' => false,
            'http' => 502,
            'code' => 'CORE_UNAVAILABLE',
            'message' => '포인트 결제 서버에 연결하지 못했습니다.',
        );
    }
}

function seosys300_revision_work_blocked_until_paid($row)
{
    if (!is_array($row)) {
        return false;
    }
    if ((string) $row['status'] === 'quote_pending') {
        return true;
    }
    return (int) $row['quote_points'] > 0 && empty($row['paid_at']) && !in_array((string) $row['status'], array('cancelled', 'expired', 'free_progress'), true);
}

function seosys300_revision_upload_file($ticket_id, $mb_id, $is_admin = false)
{
    seosys300_revision_ensure_tables();
    $row = $is_admin ? seosys300_revision_get_row($ticket_id) : seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (in_array($row['status'], array('completed', 'cancelled'), true) && !$is_admin) {
        seosys300_json_error(409, 'ticket_closed', '완료·취소된 요청에는 파일을 올릴 수 없습니다.');
    }
    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        seosys300_json_error(422, 'upload_missing', '업로드할 파일을 선택해주세요.');
    }

    $file = $_FILES['file'];
    if (!empty($file['error'])) {
        seosys300_json_error(422, 'upload_failed', '파일 업로드에 실패했습니다.');
    }
    $max = 12 * 1024 * 1024;
    if ((int) $file['size'] > $max || (int) $file['size'] < 1) {
        seosys300_json_error(422, 'file_too_large', '파일은 12MB 이하만 올릴 수 있습니다.');
    }

    $original = isset($file['name']) ? (string) $file['name'] : 'file';
    $blocked = seosys300_blocked_upload_ext();
    if (seosys300_filename_has_blocked_ext($original, $blocked)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }
    $ext = seosys300_safe_ext($original);
    $allowed = seosys300_allowed_upload_ext();
    if ($ext === '' || !in_array($ext, $allowed, true)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    seosys300_ensure_upload_htaccess();
    $mb_dir = seosys300_safe_mb_dir($row['mb_id']);
    $dir = seosys300_upload_root() . '/revisions/' . $mb_dir . '/' . (int) $ticket_id;
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $stored = date('YmdHis') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $dest = $dir . '/' . $stored;
    if (!@move_uploaded_file($file['tmp_name'], $dest)) {
        seosys300_json_error(500, 'upload_failed', '파일 저장에 실패했습니다.');
    }

    $mime = seosys300_detect_mime($dest);
    $rel = 'revisions/' . $mb_dir . '/' . (int) $ticket_id . '/' . $stored;
    $now = seosys300_esc(seosys300_now());
    $table = seosys300_revision_files_table();
    seosys300_query(
        "INSERT INTO `{$table}` SET
            ticket_id = " . (int) $ticket_id . ",
            comment_id = 0,
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            original_name = '" . seosys300_esc(substr($original, 0, 255)) . "',
            stored_name = '" . seosys300_esc($stored) . "',
            mime_type = '" . seosys300_esc(substr($mime, 0, 120)) . "',
            file_size = " . (int) $file['size'] . ",
            rel_path = '" . seosys300_esc($rel) . "',
            created_at = '{$now}'"
    );
    $fid = (int) sql_insert_id();
    $asSnapshot = !empty($_POST['asSnapshot']) || !empty($_POST['snapshot']) || !empty($_POST['as_snapshot']);
    if ($asSnapshot) {
        seosys300_revision_bind_snapshot((int) $ticket_id, $fid);
    }
    $frow = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$fid} LIMIT 1");
    return seosys300_revision_file_to_api($frow);
}

function seosys300_revision_get_file_row($file_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_files_table();
    return seosys300_fetch('SELECT * FROM `' . $table . '` WHERE id = ' . (int) $file_id . ' LIMIT 1');
}

function seosys300_revision_admin_queue($status_filter = '')
{
    seosys300_revision_ensure_tables();
    seosys300_revision_expire_quotes();
    $table = seosys300_revision_tickets_table();
    $where = '1=1';
    if ($status_filter === 'open') {
        $open = array_map('seosys300_esc', seosys300_revision_open_statuses());
        $where = "status IN ('" . implode("','", $open) . "')";
    } elseif ($status_filter !== '' && in_array($status_filter, seosys300_revision_statuses(), true)) {
        $where = "status = '" . seosys300_esc($status_filter) . "'";
    }
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE {$where} ORDER BY
            FIELD(status,'requested','need_info','quote_pending','paid','reviewing','free_progress','in_progress','feedback','expired','completed','cancelled'),
            id DESC
         LIMIT 200"
    );
    $out = array();
    foreach ($rows as $row) {
        $item = seosys300_revision_ticket_to_api($row, false);
        $item['openComments'] = 0;
        $out[] = $item;
    }
    return array(
        'items' => $out,
        'quotaDefault' => seosys300_revision_free_per_month(),
    );
}

function seosys300_revision_admin_detail($ticket_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    $ticket = seosys300_revision_ticket_to_api($row, true);
    $ticket['quota'] = seosys300_revision_free_quota($row['mb_id']);
    return $ticket;
}

function seosys300_revision_admin_save($input, $actor_mb_id = null)
{
    seosys300_revision_ensure_tables();
    $ticket_id = isset($input['ticketId']) ? (int) $input['ticketId'] : 0;
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }

    $action = isset($input['op']) ? preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $input['op'])) : '';
    $admin_id = ($actor_mb_id !== null && (string) $actor_mb_id !== '')
        ? substr((string) $actor_mb_id, 0, 100)
        : seosys300_current_mb_id();
    $authorName = isset($input['author']) ? trim((string) $input['author']) : '';
    $authorName = preg_replace('/[\x00-\x1F\x7F]/u', '', $authorName);
    if (!is_string($authorName)) {
        $authorName = '';
    }
    if ($authorName !== '') {
        $admin_id = function_exists('mb_substr') ? mb_substr($authorName, 0, 40) : substr($authorName, 0, 40);
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    $note = trim(isset($input['note']) ? (string) $input['note'] : '');
    $brief = trim(isset($input['agentBrief']) ? (string) $input['agentBrief'] : '');
    if ($brief === '') {
        $brief = isset($row['agent_brief']) ? trim((string) $row['agent_brief']) : '';
    }
    if ($brief !== '' && $brief !== (isset($row['agent_brief']) ? (string) $row['agent_brief'] : '')) {
        seosys300_query(
            "UPDATE `{$table}` SET agent_brief = '" . seosys300_esc($brief) . "', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        $row['agent_brief'] = $brief;
    }

    if ($action === 'brief') {
        if ($brief === '') {
            seosys300_json_error(422, 'validation_error', '에이전트에게 넘길 지시를 적어주세요.');
        }
        return seosys300_revision_admin_detail($ticket_id);
    }

    if (in_array($action, array('free', 'free_progress', 'quote', 'start', 'in_progress'), true) && $brief === '') {
        seosys300_json_error(422, 'validation_error', '에이전트에게 넘길 지시를 먼저 적어주세요.');
    }

    if ($action === 'review') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'reviewing', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
    } elseif ($action === 'need_info' || $action === 'need-info') {
        if ($note === '') {
            seosys300_json_error(422, 'validation_error', '필요한 자료를 적어주세요.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET status = 'need_info', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_NEED_INFO', $fresh, array('memo' => $note));
    } elseif ($action === 'free' || $action === 'free_progress') {
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'in_progress',
                free_used = 1,
                quote_points = 0,
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        $msg = $note !== '' ? $note : '무료 수정으로 진행합니다.';
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $msg);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_FREE', $fresh);
    } elseif ($action === 'quote') {
        if (in_array((string) $row['status'], array('in_progress', 'feedback', 'completed', 'paid'), true)) {
            seosys300_json_error(409, 'already_started', '이미 진행 중인 수정에는 새로 과금할 수 없습니다.');
        }
        $points = isset($input['quotePoints']) ? (int) $input['quotePoints'] : 0;
        if ($points < 1 || $points > 10000000) {
            seosys300_json_error(422, 'validation_error', '견적 포인트를 올바르게 입력해주세요.');
        }
        $quote_note = trim(isset($input['quoteNote']) ? (string) $input['quoteNote'] : $note);
        $version = (int) $row['quote_version'] + 1;
        $days = seosys300_revision_quote_days();
        $expires = date('Y-m-d H:i:s', time() + ($days * 86400));
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'quote_pending',
                quote_points = {$points},
                quote_note = '" . seosys300_esc($quote_note) . "',
                quote_version = {$version},
                quote_expires_at = '" . seosys300_esc($expires) . "',
                paid_request_id = '',
                paid_at = NULL,
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        $msg = '견적 ' . number_format($points) . 'P' . ($quote_note !== '' ? ' — ' . $quote_note : '');
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $msg);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_QUOTE', $fresh);
    } elseif ($action === 'mark_paid' || $action === 'mark-paid') {
        $request_id = seosys300_revision_pay_request_id($ticket_id, max(1, (int) $row['quote_version']));
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'in_progress',
                paid_at = '{$now}',
                paid_request_id = '" . seosys300_esc($request_id) . "',
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note !== '' ? $note : '운영자가 결제를 확인했습니다. 작업을 시작합니다.');
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_PAID', $fresh);
    } elseif ($action === 'start' || $action === 'in_progress') {
        if (seosys300_revision_work_blocked_until_paid($row)) {
            seosys300_json_error(409, 'payment_required', '고객이 온오프에서 과금 결제를 완료한 뒤에 진행할 수 있습니다.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET status = 'in_progress', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
    } elseif ($action === 'feedback' || $action === 'complete_feedback') {
        if (seosys300_revision_work_blocked_until_paid($row)) {
            seosys300_json_error(409, 'payment_required', '고객이 온오프에서 과금 결제를 완료한 뒤에 진행할 수 있습니다.');
        }
        $feedback = trim(isset($input['feedbackNote']) ? (string) $input['feedbackNote'] : $note);
        $url = trim(isset($input['feedbackUrl']) ? (string) $input['feedbackUrl'] : '');
        if ($feedback === '') {
            seosys300_json_error(422, 'validation_error', '처리 결과를 적어주세요.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'feedback',
                feedback_note = '" . seosys300_esc($feedback) . "',
                feedback_url = '" . seosys300_esc(substr($url, 0, 500)) . "',
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $feedback . ($url !== '' ? "\n" . $url : ''));
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_FEEDBACK', $fresh);
    } elseif ($action === 'complete') {
        if ((string) $row['status'] !== 'feedback') {
            seosys300_json_error(409, 'invalid_status', '고객 확인 단계에서만 완료할 수 있습니다.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET status = 'completed', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note !== '' ? $note : '담당자가 수정 작업을 완료 처리했습니다.');
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_COMPLETED', $fresh);
    } elseif ($action === 'cancel') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'cancelled', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
    } elseif ($action === 'comment') {
        if ($note === '') {
            seosys300_json_error(422, 'validation_error', '댓글 내용을 입력해주세요.');
        }
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        seosys300_query("UPDATE `{$table}` SET updated_at = '{$now}' WHERE id = {$ticket_id}");
    } else {
        seosys300_json_error(400, 'unknown_action', '처리할 수 없는 작업입니다.');
    }

    return seosys300_revision_admin_detail($ticket_id);
}
