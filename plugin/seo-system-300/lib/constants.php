<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_order_statuses()
{
    return array(
        'draft',
        'submitted',
        'need_more_info',
        'material_waiting',
        'planning',
        'design',
        'development',
        'internal_review',
        'customer_review',
        'revision',
        'completed',
    );
}

function seosys300_feature_catalog()
{
    return array(
        'inquiry_form' => '문의폼',
        'phone_call' => '전화문의',
        'kakaotalk' => '카카오톡',
        'telegram' => 'Telegram',
        'whatsapp' => 'WhatsApp',
        'board' => '게시판',
        'gallery' => '갤러리',
        'blog' => 'Blog',
        'membership' => '회원가입',
        'reservation' => '예약',
        'payment' => '결제',
        'multilingual' => '다국어',
        'map' => '지도',
        'review' => '리뷰',
        'popup' => 'Popup',
        'sms' => 'SMS',
        'email_notify' => 'Email Notification',
    );
}

function seosys300_file_categories()
{
    return array(
        'logo',
        'company',
        'hero',
        'service',
        'price',
        'business',
        'contact',
        'sns',
        'brochure',
        'other',
        'task_result',
    );
}

function seosys300_ui_category_map()
{
    return array(
        'logo' => 'logo',
        'company_intro' => 'company',
        'hero_photos' => 'hero',
        'product_photos' => 'service',
        'price_table' => 'price',
        'business_info' => 'business',
        'contact_channels' => 'contact',
        'sns_links' => 'sns',
        'brochure' => 'brochure',
        'other_files' => 'other',
        'other' => 'other',
        'task_result' => 'task_result',
    );
}

function seosys300_allowed_upload_ext()
{
    return array(
        'jpg', 'jpeg', 'png', 'webp',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'txt',
        'zip', 'ai', 'psd',
    );
}

function seosys300_blocked_upload_ext()
{
    return array(
        'php', 'php3', 'php4', 'php5', 'phtml', 'phar',
        'cgi', 'pl', 'sh', 'exe', 'js', 'html', 'htm', 'svg', 'shtml',
    );
}

function seosys300_timezone()
{
    $tz = date_default_timezone_get();
    return $tz ? $tz : 'Asia/Seoul';
}

function seosys300_today_date($now = null)
{
    $ts = $now === null ? time() : (int) $now;
    $dt = new DateTime('@' . $ts);
    $dt->setTimezone(new DateTimeZone(seosys300_timezone()));
    return $dt->format('Y-m-d');
}

function seosys300_progress_percent($completed, $total)
{
    $total = (int) $total;
    $completed = (int) $completed;
    if ($total < 1) {
        return 0;
    }
    $pct = (int) floor(($completed / $total) * 100);
    if ($pct < 0) {
        return 0;
    }
    if ($pct > 100) {
        return 100;
    }
    return $pct;
}

function seosys300_website_progress_map()
{
    return array(
        'draft' => 10,
        'submitted' => 20,
        'need_more_info' => 25,
        'material_waiting' => 30,
        'planning' => 40,
        'design' => 55,
        'development' => 70,
        'internal_review' => 80,
        'customer_review' => 85,
        'revision' => 90,
        'completed' => 100,
    );
}

function seosys300_website_progress_for_status($status)
{
    $map = seosys300_website_progress_map();
    $status = seosys300_normalize_order_status($status);
    return isset($map[$status]) ? (int) $map[$status] : 0;
}

function seosys300_kanban_column_map()
{
    return array(
        'submitted' => 'new_order',
        'need_more_info' => 'awaiting_materials',
        'material_waiting' => 'awaiting_materials',
        'planning' => 'planning',
        'design' => 'design',
        'development' => 'development',
        'internal_review' => 'qa',
        'customer_review' => 'qa',
        'revision' => 'revision',
        'completed' => 'completed',
    );
}

function seosys300_kanban_column_for_status($status)
{
    $map = seosys300_kanban_column_map();
    $status = seosys300_normalize_order_status($status);
    return isset($map[$status]) ? $map[$status] : '';
}

function seosys300_status_for_kanban_column($column)
{
    $map = array(
        'new_order' => 'submitted',
        'awaiting_materials' => 'material_waiting',
        'planning' => 'planning',
        'design' => 'design',
        'development' => 'development',
        'qa' => 'customer_review',
        'revision' => 'revision',
        'completed' => 'completed',
    );
    $column = strtolower(trim((string) $column));
    return isset($map[$column]) ? $map[$column] : '';
}

function seosys300_task_statuses()
{
    return array('not_started', 'in_progress', 'completed', 'skipped');
}

function seosys300_normalize_order_status($status)
{
    $s = strtolower(str_replace(array('-', ' '), '_', trim((string) $status)));
    $alias = array(
        'reviewing' => 'material_waiting',
        'building' => 'development',
        'first_review' => 'internal_review',
        'submitted' => 'submitted',
        'need_more' => 'need_more_info',
        'needmoreinfo' => 'need_more_info',
    );
    if (isset($alias[$s])) {
        return $alias[$s];
    }
    return $s;
}

function seosys300_is_allowed_order_status($status)
{
    return in_array(seosys300_normalize_order_status($status), seosys300_order_statuses(), true);
}

function seosys300_format_order_no($order_id, $year = null)
{
    $id = (int) $order_id;
    $y = $year === null ? (int) date('Y') : (int) $year;
    return 'WEB-' . $y . '-' . str_pad((string) $id, 6, '0', STR_PAD_LEFT);
}

function seosys300_allowed_wizard_steps()
{
    return array(
        'intro',
        'step1',
        'step2',
        'step3',
        'step4',
        'step5',
        'step6',
        'step7',
        'step8',
        'step9',
        'success',
    );
}

function seosys300_normalize_wizard_step($raw)
{
    $s = strtolower(trim((string) $raw));
    $alias = array(
        'info' => 'step1',
        'purpose' => 'step2',
        'menu' => 'step3',
        'design' => 'step4',
        'seo' => 'step5',
        'other' => 'step6',
        'features' => 'step7',
        'upload' => 'step8',
        'review' => 'step9',
    );
    if (isset($alias[$s])) {
        $s = $alias[$s];
    }
    return in_array($s, seosys300_allowed_wizard_steps(), true) ? $s : '';
}

function seosys300_material_category_keys()
{
    return array(
        'logo',
        'company',
        'hero',
        'service',
        'price',
        'business',
        'contact',
        'sns',
        'brochure',
        'other',
    );
}

function seosys300_materials_readiness($files)
{
    $keys = seosys300_material_category_keys();
    $seen = array();
    foreach ((array) $files as $file) {
        $cat = '';
        if (is_array($file)) {
            $cat = isset($file['category']) ? (string) $file['category'] : '';
        } else {
            $cat = (string) $file;
        }
        $cat = seosys300_normalize_category_key($cat);
        if (in_array($cat, $keys, true)) {
            $seen[$cat] = true;
        }
    }
    $filled = count($seen);
    $total = count($keys);
    $pct = seosys300_progress_percent($filled, $total);
    $status = 'EMPTY';
    if ($filled === $total) {
        $status = 'COMPLETE';
    } elseif ($filled > 0) {
        $status = 'NEED_MORE';
    }
    return array(
        'percent' => $pct,
        'filled' => $filled,
        'total' => $total,
        'status' => $status,
    );
}

function seosys300_normalize_category_key($raw)
{
    if (function_exists('seosys300_ui_category_map')) {
        $map = seosys300_ui_category_map();
        $key = preg_replace('/[^a-z0-9_]/', '', strtolower((string) $raw));
        if (isset($map[$key])) {
            return $map[$key];
        }
        return $key;
    }
    return preg_replace('/[^a-z0-9_]/', '', strtolower((string) $raw));
}

function seosys300_process_step_index($status)
{
    $status = seosys300_normalize_order_status($status);
    $map = array(
        'draft' => 0,
        'submitted' => 1,
        'need_more_info' => 2,
        'material_waiting' => 2,
        'planning' => 3,
        'design' => 4,
        'development' => 4,
        'internal_review' => 5,
        'customer_review' => 5,
        'revision' => 6,
        'completed' => 7,
    );
    return isset($map[$status]) ? (int) $map[$status] : 0;
}

function seosys300_recommend_feature_keys($site_type, $industry, $purposes = array())
{
    $site = strtolower((string) $site_type);
    $ind = (string) $industry;
    $purpose = array();
    foreach ((array) $purposes as $p) {
        $purpose[] = strtolower((string) $p);
    }
    $keys = array('inquiry_form');
    if (in_array('seo', $purpose, true) || $site === 'info_blog' || $site === 'seo_affiliate') {
        $keys[] = 'blog';
    }
    if ($site === 'local_service' || strpos($ind, '지역') !== false) {
        $keys[] = 'map';
        $keys[] = 'phone_call';
        $keys[] = 'kakaotalk';
    }
    if ($site === 'travel' || $site === 'professional' || strpos($ind, '예약') !== false) {
        $keys[] = 'reservation';
    }
    if ($site === 'shopping') {
        $keys[] = 'payment';
        $keys[] = 'gallery';
    }
    $catalog = seosys300_feature_catalog();
    $out = array();
    foreach ($keys as $k) {
        if (isset($catalog[$k]) && !in_array($k, $out, true)) {
            $out[] = $k;
        }
    }
    return $out;
}

function seosys300_is_allowed_task_status($status)
{
    return in_array(strtolower((string) $status), seosys300_task_statuses(), true);
}

function seosys300_roadmap_step_keys()
{
    return array(
        'project_setup',
        'website',
        'domain',
        'technical_seo',
        'keywords',
        'content',
        'backlink',
        'traffic',
        'analytics',
        'growth',
    );
}

function seosys300_pick_mission_task_ids($rows, $limit = 3)
{
    $limit = (int) $limit;
    if ($limit < 1) {
        $limit = 3;
    }
    if ($limit > 5) {
        $limit = 5;
    }
    $eligible = array();
    foreach ((array) $rows as $row) {
        $status = isset($row['status']) ? strtolower((string) $row['status']) : 'not_started';
        if ($status === 'completed' || $status === 'skipped') {
            continue;
        }
        $inProgress = $status === 'in_progress' ? 0 : 1;
        $required = !empty($row['is_required']) ? 0 : 1;
        $current = !empty($row['is_current_step']) ? 0 : 1;
        $stepSort = isset($row['step_sort']) ? (int) $row['step_sort'] : 0;
        $taskSort = isset($row['task_sort']) ? (int) $row['task_sort'] : 0;
        $eligible[] = array(
            'task_id' => (int) $row['task_id'],
            'rank' => array($inProgress, $required, $current, $stepSort, $taskSort),
        );
    }
    usort($eligible, function ($a, $b) {
        if ($a['rank'] === $b['rank']) {
            return 0;
        }
        return $a['rank'] < $b['rank'] ? -1 : 1;
    });
    $ids = array();
    foreach ($eligible as $item) {
        if (count($ids) >= $limit) {
            break;
        }
        if ($item['task_id'] > 0) {
            $ids[] = $item['task_id'];
        }
    }
    return $ids;
}
