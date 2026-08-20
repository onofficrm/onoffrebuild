<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_notifications_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_notifications_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_notifications_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_order_status_label_ko($status)
{
    $map = array(
        'draft' => '작성 중',
        'submitted' => '제작 요청 완료',
        'need_more_info' => '추가자료 필요',
        'material_waiting' => '자료 검토',
        'planning' => '기획 중',
        'design' => '제작 중',
        'development' => '제작 중',
        'internal_review' => '1차 확인',
        'customer_review' => '1차 확인',
        'revision' => '수정 중',
        'completed' => '제작 완료',
        'delivered' => '제작 완료',
    );
    $key = seosys300_normalize_order_status($status);
    return isset($map[$key]) ? $map[$key] : $key;
}

/**
 * @param string $event
 * @param array  $payload
 */
function seosys300_notify_order_event($event, $payload = array())
{
    $event = strtoupper(preg_replace('/[^A-Z0-9_]/', '', (string) $event));
    $orderId = isset($payload['order_id']) ? (int) $payload['order_id'] : 0;
    if ($orderId < 1) {
        return false;
    }

    global $g5;
    $order = seosys300_fetch(
        "SELECT * FROM `{$g5['seosys300_website_orders_table']}` WHERE id = {$orderId} LIMIT 1"
    );
    if (!$order) {
        return false;
    }

    $mbId = isset($payload['mb_id']) && (string) $payload['mb_id'] !== ''
        ? (string) $payload['mb_id']
        : (string) $order['mb_id'];
    $projectId = isset($payload['project_id'])
        ? (int) $payload['project_id']
        : (int) $order['project_id'];

    $built = seosys300_notify_build_message($event, $payload, $order);
    if (!$built) {
        return false;
    }

    $emailSent = 0;
    if (!empty($built['send_email'])) {
        $emailSent = seosys300_notify_send_email($mbId, $order, $built['email_subject'], $built['email_body']) ? 1 : 0;
    }

    if (seosys300_notifications_tables_ready() && $mbId !== '') {
        seosys300_notification_insert(array(
            'mb_id' => $mbId,
            'project_id' => $projectId,
            'order_id' => $orderId,
            'event_type' => $event,
            'title' => $built['title'],
            'body' => $built['body'],
            'action_tab' => $built['action_tab'],
            'action_sub_tab' => $built['action_sub_tab'],
            'severity' => $built['severity'],
            'email_sent' => $emailSent,
        ));
    }

    if ($event === 'WEBSITE_ORDER_SUBMITTED') {
        seosys300_notify_admin_new_order($order, $built);
    }

    return true;
}

function seosys300_notify_build_message($event, $payload, $order)
{
    $portal = rtrim(seosys300_env('SEOSYS300_PORTAL_PATH', '/seo-system-300'), '/');
    $siteName = isset($order['site_name']) && (string) $order['site_name'] !== ''
        ? (string) $order['site_name']
        : '홈페이지 제작';

    if ($event === 'WEBSITE_ORDER_SUBMITTED') {
        return array(
            'title' => '홈페이지 제작 주문이 접수되었습니다',
            'body' => $siteName . ' 주문이 접수되었습니다. 제작 현황에서 진행 상태를 확인할 수 있습니다.',
            'action_tab' => 'website',
            'action_sub_tab' => 'status',
            'severity' => 'success',
            'send_email' => true,
            'email_subject' => '[SEO SYSTEM 300] 홈페이지 제작 주문 접수',
            'email_body' => '<p>안녕하세요.</p><p><strong>' . htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8')
                . '</strong> 홈페이지 제작 주문이 접수되었습니다.</p><p>진행 현황: <a href="'
                . htmlspecialchars(G5_URL . $portal . '/website/status', ENT_QUOTES, 'UTF-8')
                . '">Control Center에서 확인</a></p>',
        );
    }

    if ($event === 'WEBSITE_MATERIALS_REQUESTED') {
        $reqTitle = '';
        if (!empty($order['extra_json'])) {
            $extra = json_decode((string) $order['extra_json'], true);
            if (is_array($extra) && !empty($extra['materialsRequest']['title'])) {
                $reqTitle = (string) $extra['materialsRequest']['title'];
            }
        }
        $detail = $reqTitle !== '' ? $reqTitle : '추가 자료를 요청했습니다.';
        return array(
            'title' => '추가 자료가 요청되었습니다',
            'body' => $detail,
            'action_tab' => 'website',
            'action_sub_tab' => 'status',
            'severity' => 'warning',
            'send_email' => true,
            'email_subject' => '[SEO SYSTEM 300] 홈페이지 추가 자료 요청',
            'email_body' => '<p>안녕하세요.</p><p>홈페이지 제작을 위해 추가 자료가 필요합니다.</p><p><strong>'
                . htmlspecialchars($detail, ENT_QUOTES, 'UTF-8')
                . '</strong></p><p><a href="'
                . htmlspecialchars(G5_URL . $portal . '/website/status', ENT_QUOTES, 'UTF-8')
                . '">Control Center에서 확인</a></p>',
        );
    }

    if ($event === 'WEBSITE_STATUS_CHANGED') {
        $to = isset($payload['to']) ? (string) $payload['to'] : (string) $order['status'];
        // Materials path already sends a richer email.
        if (seosys300_normalize_order_status($to) === 'need_more_info') {
            return array(
                'title' => '홈페이지 상태가 변경되었습니다',
                'body' => '상태가 「' . seosys300_order_status_label_ko($to) . '」로 변경되었습니다.',
                'action_tab' => 'website',
                'action_sub_tab' => 'status',
                'severity' => 'warning',
                'send_email' => false,
                'email_subject' => '',
                'email_body' => '',
            );
        }
        $label = seosys300_order_status_label_ko($to);
        $severity = ($to === 'completed' || $to === 'delivered') ? 'success' : 'info';
        return array(
            'title' => '홈페이지 제작 상태가 변경되었습니다',
            'body' => $siteName . ' 상태가 「' . $label . '」로 변경되었습니다.',
            'action_tab' => 'website',
            'action_sub_tab' => 'status',
            'severity' => $severity,
            'send_email' => true,
            'email_subject' => '[SEO SYSTEM 300] 홈페이지 상태: ' . $label,
            'email_body' => '<p>안녕하세요.</p><p><strong>' . htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8')
                . '</strong> 제작 상태가 <strong>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8')
                . '</strong> 로 변경되었습니다.</p><p><a href="'
                . htmlspecialchars(G5_URL . $portal . '/website/status', ENT_QUOTES, 'UTF-8')
                . '">Control Center에서 확인</a></p>',
        );
    }

    return null;
}

function seosys300_notification_insert($row)
{
    global $g5;
    if (!seosys300_notifications_tables_ready()) {
        return 0;
    }
    $now = seosys300_now();
    $table = $g5['seosys300_notifications_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        mb_id = '" . seosys300_esc($row['mb_id']) . "',
        project_id = " . (int) $row['project_id'] . ",
        order_id = " . (int) $row['order_id'] . ",
        event_type = '" . seosys300_esc($row['event_type']) . "',
        title = '" . seosys300_esc(substr($row['title'], 0, 191)) . "',
        body = '" . seosys300_esc(substr($row['body'], 0, 500)) . "',
        action_tab = '" . seosys300_esc(substr($row['action_tab'], 0, 40)) . "',
        action_sub_tab = '" . seosys300_esc(substr($row['action_sub_tab'], 0, 40)) . "',
        severity = '" . seosys300_esc(substr($row['severity'], 0, 20)) . "',
        is_read = 0,
        email_sent = " . (int) $row['email_sent'] . ",
        created_at = '{$now}'");
    return (int) sql_insert_id();
}

function seosys300_notify_resolve_email($mb_id, $order)
{
    $mb_id = (string) $mb_id;
    if ($mb_id !== '' && function_exists('get_member')) {
        $mb = get_member($mb_id);
        if (!empty($mb['mb_email']) && strpos((string) $mb['mb_email'], '@') !== false) {
            return (string) $mb['mb_email'];
        }
    }
    if (!empty($order['email']) && strpos((string) $order['email'], '@') !== false) {
        return (string) $order['email'];
    }
    return '';
}

function seosys300_notify_send_email($mb_id, $order, $subject, $html)
{
    global $config;
    $to = seosys300_notify_resolve_email($mb_id, $order);
    if ($to === '' || $subject === '' || $html === '') {
        return false;
    }
    if (empty($config['cf_email_use'])) {
        return false;
    }
    $fname = !empty($config['cf_admin_email_name']) ? $config['cf_admin_email_name'] : 'SEO SYSTEM 300';
    $fmail = !empty($config['cf_admin_email']) ? $config['cf_admin_email'] : '';
    if ($fmail === '' || strpos($fmail, '@') === false) {
        return false;
    }
    if (!function_exists('mailer')) {
        include_once G5_LIB_PATH . '/mailer.lib.php';
    }
    try {
        mailer($fname, $fmail, $to, $subject, $html, 1);
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function seosys300_notify_admin_new_order($order, $built)
{
    global $config;
    if (empty($config['cf_email_use']) || empty($config['cf_admin_email'])) {
        return false;
    }
    $to = (string) $config['cf_admin_email'];
    $siteName = isset($order['site_name']) ? (string) $order['site_name'] : '';
    $mb = isset($order['mb_id']) ? (string) $order['mb_id'] : '';
    $subject = '[SEO SYSTEM 300] 신규 홈페이지 주문';
    $html = '<p>신규 주문이 접수되었습니다.</p><p>수강생: '
        . htmlspecialchars($mb, ENT_QUOTES, 'UTF-8')
        . '<br>사이트: ' . htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8')
        . '<br>주문 ID: ' . (int) $order['id'] . '</p>';
    if (!function_exists('mailer')) {
        include_once G5_LIB_PATH . '/mailer.lib.php';
    }
    $fname = !empty($config['cf_admin_email_name']) ? $config['cf_admin_email_name'] : 'SEO SYSTEM 300';
    try {
        mailer($fname, $to, $to, $subject, $html, 1);
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function seosys300_notifications_list($mb_id, $limit = 40)
{
    global $g5;
    if (!seosys300_notifications_tables_ready()) {
        return array();
    }
    $limit = max(1, min(100, (int) $limit));
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_notifications_table'];
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE mb_id = '{$mb}' ORDER BY id DESC LIMIT {$limit}"
    );
    $out = array();
    foreach ($rows as $r) {
        $out[] = seosys300_notification_public($r);
    }
    return $out;
}

function seosys300_notifications_unread_count($mb_id)
{
    global $g5;
    if (!seosys300_notifications_tables_ready()) {
        return 0;
    }
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_notifications_table'];
    $row = seosys300_fetch("SELECT COUNT(*) AS cnt FROM `{$table}` WHERE mb_id = '{$mb}' AND is_read = 0");
    return $row ? (int) $row['cnt'] : 0;
}

function seosys300_notifications_mark_read($mb_id, $ids = array())
{
    global $g5;
    if (!seosys300_notifications_tables_ready()) {
        return 0;
    }
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_notifications_table'];
    $now = seosys300_now();
    if (is_array($ids) && count($ids) > 0) {
        $clean = array();
        foreach ($ids as $id) {
            $id = (int) $id;
            if ($id > 0) {
                $clean[] = $id;
            }
        }
        if (!$clean) {
            return 0;
        }
        $in = implode(',', $clean);
        seosys300_query(
            "UPDATE `{$table}` SET is_read = 1, read_at = '{$now}' WHERE mb_id = '{$mb}' AND is_read = 0 AND id IN ({$in})"
        );
    } else {
        seosys300_query(
            "UPDATE `{$table}` SET is_read = 1, read_at = '{$now}' WHERE mb_id = '{$mb}' AND is_read = 0"
        );
    }
    return seosys300_notifications_unread_count($mb_id);
}

function seosys300_notification_public($row)
{
    return array(
        'id' => (int) $row['id'],
        'projectId' => (int) $row['project_id'],
        'orderId' => (int) $row['order_id'],
        'eventType' => (string) $row['event_type'],
        'title' => (string) $row['title'],
        'message' => (string) $row['body'],
        'severity' => (string) $row['severity'],
        'read' => ((int) $row['is_read'] === 1),
        'actionTab' => (string) $row['action_tab'],
        'actionSubTab' => (string) $row['action_sub_tab'],
        'createdAt' => (string) $row['created_at'],
    );
}
