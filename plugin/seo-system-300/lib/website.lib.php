<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_order_to_api($row, $menus = array(), $features = array(), $refs = array(), $files = array())
{
    $menuOut = array();
    foreach ($menus as $m) {
        $menuOut[] = array(
            'id' => (int) $m['id'],
            'parentId' => (int) $m['parent_id'],
            'label' => (string) $m['label'],
            'slug' => (string) $m['slug'],
            'sortOrder' => (int) $m['sort_order'],
        );
    }
    $featOut = array();
    foreach ($features as $f) {
        $featOut[] = array(
            'key' => (string) $f['feature_key'],
            'label' => (string) $f['feature_label'],
            'isAiRecommended' => !empty($f['is_ai_recommended']),
        );
    }
    $refOut = array();
    foreach ($refs as $r) {
        $refOut[] = array(
            'id' => (int) $r['id'],
            'url' => (string) $r['url'],
            'memo' => (string) $r['memo'],
            'sortOrder' => (int) $r['sort_order'],
        );
    }

    $extra = seosys300_order_extra_public(seosys300_order_extra_decode($row));
    $readiness = seosys300_materials_readiness($files);

    return array(
        'id' => (int) $row['id'],
        'orderNo' => isset($row['order_no']) ? (string) $row['order_no'] : '',
        'projectId' => (int) $row['project_id'],
        'mbId' => (string) $row['mb_id'],
        'siteType' => (string) $row['site_type'],
        'purposes' => seosys300_decode_list($row['purposes']),
        'industry' => (string) $row['industry'],
        'siteName' => (string) $row['site_name'],
        'brandName' => (string) $row['brand_name'],
        'phone' => (string) $row['phone'],
        'email' => (string) $row['email'],
        'region' => (string) $row['region'],
        'businessDescription' => (string) $row['business_description'],
        'currentUrl' => (string) $row['current_url'],
        'designStyle' => (string) $row['design_style'],
        'primaryColor' => (string) $row['primary_color'],
        'customColor' => (string) $row['custom_color'],
        'targetRegion' => (string) $row['target_region'],
        'secondaryStyle' => isset($extra['secondaryStyle']) ? (string) $extra['secondaryStyle'] : '',
        'colorPreset' => isset($extra['colorPreset']) ? (string) $extra['colorPreset'] : '',
        'accentColor' => isset($extra['accentColor']) ? (string) $extra['accentColor'] : '',
        'contacts' => isset($extra['contacts']) && is_array($extra['contacts']) ? $extra['contacts'] : array(),
        'extraRequest' => isset($extra['extraRequest']) ? (string) $extra['extraRequest'] : '',
        'materialsRequest' => isset($extra['materialsRequest']) && is_array($extra['materialsRequest']) ? $extra['materialsRequest'] : null,
        'status' => (string) $row['status'],
        'progress' => (int) $row['progress'],
        'processStep' => seosys300_process_step_index($row['status']),
        'processTotal' => 7,
        'materialsReadiness' => $readiness['percent'],
        'materialsStatus' => $readiness['status'],
        'isDraft' => !empty($row['is_draft']),
        'wizardStep' => (string) $row['wizard_step'],
        'submittedAt' => $row['submitted_at'] ? (string) $row['submitted_at'] : null,
        'createdAt' => (string) $row['created_at'],
        'updatedAt' => (string) $row['updated_at'],
        'menus' => $menuOut,
        'features' => $featOut,
        'references' => $refOut,
        'files' => $files,
        'fileCount' => count($files),
        'history' => seosys300_order_history((int) $row['id']),
    );
}

function seosys300_order_extra_decode($row)
{
    if (!is_array($row) || empty($row['extra_json'])) {
        return array();
    }
    $data = json_decode((string) $row['extra_json'], true);
    return is_array($data) ? $data : array();
}

function seosys300_orders_has_column($column)
{
    static $cols = null;
    global $g5;
    if ($cols === null) {
        $cols = array();
        $table = $g5['seosys300_website_orders_table'];
        $rows = seosys300_fetch_all("SHOW COLUMNS FROM `{$table}`");
        foreach ($rows as $r) {
            if (isset($r['Field'])) {
                $cols[strtolower((string) $r['Field'])] = true;
            }
        }
    }
    return !empty($cols[strtolower((string) $column)]);
}

function seosys300_sanitize_contacts($input)
{
    $keys = array(
        'phone', 'kakao', 'telegram', 'whatsapp', 'email', 'address', 'mapUrl',
        'facebook', 'instagram', 'youtube', 'tiktok', 'naverBlog', 'otherSns',
    );
    $out = array();
    if (!is_array($input)) {
        return $out;
    }
    foreach ($keys as $key) {
        if (!array_key_exists($key, $input)) {
            continue;
        }
        $out[$key] = substr(trim((string) $input[$key]), 0, 500);
    }
    return $out;
}

function seosys300_student_extra_keys()
{
    return array('contacts', 'extraRequest', 'secondaryStyle', 'colorPreset', 'accentColor');
}

function seosys300_order_extra_public($extra)
{
    $out = array();
    if (!is_array($extra)) {
        return $out;
    }
    foreach (seosys300_student_extra_keys() as $key) {
        if (array_key_exists($key, $extra)) {
            $out[$key] = $extra[$key];
        }
    }
    if (isset($extra['materialsRequest']) && is_array($extra['materialsRequest'])) {
        $req = $extra['materialsRequest'];
        $out['materialsRequest'] = array(
            'title' => isset($req['title']) ? (string) $req['title'] : '',
            'body' => isset($req['body']) ? (string) $req['body'] : '',
            'categories' => isset($req['categories']) && is_array($req['categories']) ? $req['categories'] : array(),
            'requestedAt' => isset($req['requestedAt']) ? (string) $req['requestedAt'] : '',
        );
    }
    return $out;
}

function seosys300_order_relations($order_id)
{
    global $g5;
    $oid = (int) $order_id;
    $menus = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_website_menu_table']}` WHERE order_id = {$oid} ORDER BY sort_order ASC, id ASC");
    $features = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_website_features_table']}` WHERE order_id = {$oid} ORDER BY id ASC");
    $refs = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_website_references_table']}` WHERE order_id = {$oid} ORDER BY sort_order ASC, id ASC");
    $files = seosys300_file_list_for_order($oid);
    return array($menus, $features, $refs, $files);
}

function seosys300_get_owned_order($order_id, $mb_id)
{
    global $g5;
    $oid = (int) $order_id;
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_website_orders_table'];
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$oid} AND mb_id = '{$mb}' LIMIT 1");
}

function seosys300_current_order_for_project($project_id, $mb_id)
{
    global $g5;
    $pid = (int) $project_id;
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_website_orders_table'];
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE project_id = {$pid} AND mb_id = '{$mb}' AND status <> 'completed' ORDER BY is_draft DESC, id DESC LIMIT 1");
    if (!$row) {
        $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE project_id = {$pid} AND mb_id = '{$mb}' ORDER BY id DESC LIMIT 1");
    }
    return $row;
}

function seosys300_append_status_history($order_id, $from, $to, $role, $memo = '')
{
    global $g5;
    $oid = (int) $order_id;
    $now = seosys300_now();
    $table = $g5['seosys300_website_status_history_table'];
    $sql = "INSERT INTO `{$table}` SET
        order_id = {$oid},
        from_status = '" . seosys300_esc($from) . "',
        to_status = '" . seosys300_esc($to) . "',
        changed_by_mb_id = '" . seosys300_esc(seosys300_current_mb_id()) . "',
        changed_by_role = '" . seosys300_esc($role) . "',
        memo = '" . seosys300_esc(substr($memo, 0, 255)) . "',
        created_at = '{$now}'";
    seosys300_query($sql);
}

function seosys300_order_history($order_id)
{
    global $g5;
    $rows = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_website_status_history_table']}` WHERE order_id = " . (int) $order_id . " ORDER BY id ASC");
    $out = array();
    foreach ($rows as $row) {
        $out[] = array(
            'id' => (int) $row['id'],
            'fromStatus' => (string) $row['from_status'],
            'toStatus' => (string) $row['to_status'],
            'changedBy' => (string) $row['changed_by_mb_id'],
            'role' => (string) $row['changed_by_role'],
            'memo' => (string) $row['memo'],
            'createdAt' => (string) $row['created_at'],
        );
    }
    return $out;
}

function seosys300_replace_menus($order_id, $menus)
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_menu_table'];
    seosys300_query("DELETE FROM `{$table}` WHERE order_id = {$oid}");
    $now = seosys300_now();
    $sort = 0;
    $parentMap = array();
    foreach ((array) $menus as $item) {
        if (!is_array($item)) {
            continue;
        }
        $label = isset($item['label']) ? trim((string) $item['label']) : (isset($item['title']) ? trim((string) $item['title']) : '');
        if ($label === '') {
            continue;
        }
        $clientId = isset($item['id']) ? (string) $item['id'] : ('tmp-' . $sort);
        $parentClient = isset($item['parentId']) ? (string) $item['parentId'] : '';
        if ($parentClient === '' && !empty($item['isSubItem']) && !empty($item['parentTitle'])) {
            foreach ($parentMap as $cid => $dbId) {
                // resolved later by parentTitle match after insert; store parentTitle
            }
        }
        $parentId = 0;
        if ($parentClient !== '' && isset($parentMap[$parentClient])) {
            $parentId = (int) $parentMap[$parentClient];
        }
        $isSub = !empty($item['isSubItem']);
        $slug = isset($item['slug']) ? (string) $item['slug'] : seosys300_slugify_menu($label);
        $escLabel = seosys300_esc(substr($label, 0, 191));
        $escSlug = seosys300_esc(substr($slug, 0, 191));
        $parentSql = $isSub ? $parentId : 0;
        seosys300_query("INSERT INTO `{$table}` SET order_id = {$oid}, parent_id = {$parentSql}, label = '{$escLabel}', slug = '{$escSlug}', sort_order = {$sort}, created_at = '{$now}', updated_at = '{$now}'");
        $newId = (int) sql_insert_id();
        $parentMap[$clientId] = $newId;
        if ($isSub && $parentId === 0 && !empty($item['parentTitle'])) {
            $want = trim((string) $item['parentTitle']);
            $found = seosys300_fetch("SELECT id FROM `{$table}` WHERE order_id = {$oid} AND label = '" . seosys300_esc($want) . "' AND parent_id = 0 ORDER BY id DESC LIMIT 1");
            if ($found) {
                seosys300_query("UPDATE `{$table}` SET parent_id = " . (int) $found['id'] . " WHERE id = {$newId}");
            }
        }
        $sort++;
    }
}

function seosys300_replace_features($order_id, $features)
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_features_table'];
    seosys300_query("DELETE FROM `{$table}` WHERE order_id = {$oid}");
    $catalog = seosys300_feature_catalog();
    $now = seosys300_now();
    $seen = array();
    foreach ((array) $features as $item) {
        $key = '';
        $ai = 0;
        if (is_array($item)) {
            $key = isset($item['key']) ? (string) $item['key'] : (isset($item['feature_key']) ? (string) $item['feature_key'] : '');
            $ai = !empty($item['isAiRecommended']) ? 1 : 0;
        } else {
            $key = (string) $item;
        }
        $key = preg_replace('/[^a-z0-9_]/', '', strtolower($key));
        if ($key === '' || !isset($catalog[$key]) || isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $label = seosys300_esc($catalog[$key]);
        seosys300_query("INSERT INTO `{$table}` SET order_id = {$oid}, feature_key = '" . seosys300_esc($key) . "', feature_label = '{$label}', is_ai_recommended = {$ai}, created_at = '{$now}'");
    }
}

function seosys300_replace_references($order_id, $references)
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_references_table'];
    seosys300_query("DELETE FROM `{$table}` WHERE order_id = {$oid}");
    $now = seosys300_now();
    $sort = 0;
    foreach ((array) $references as $item) {
        $url = '';
        $memo = '';
        if (is_array($item)) {
            $url = isset($item['url']) ? trim((string) $item['url']) : '';
            $memo = isset($item['memo']) ? trim((string) $item['memo']) : '';
        } else {
            $url = trim((string) $item);
        }
        if ($url === '') {
            continue;
        }
        if (!seosys300_valid_http_url($url)) {
            seosys300_rollback();
            seosys300_json_error(422, 'invalid_url', '참고사이트는 http 또는 https 주소만 사용할 수 있습니다.');
        }
        seosys300_query("INSERT INTO `{$table}` SET order_id = {$oid}, url = '" . seosys300_esc(substr($url, 0, 500)) . "', memo = '" . seosys300_esc(substr($memo, 0, 255)) . "', sort_order = {$sort}, created_at = '{$now}'");
        $sort++;
    }
}

function seosys300_apply_order_fields($order_id, $input, $allow_admin_extra = false)
{
    global $g5;
    $oid = (int) $order_id;
    $now = seosys300_now();
    $table = $g5['seosys300_website_orders_table'];
    $map = array(
        'siteType' => array('site_type', 50),
        'industry' => array('industry', 100),
        'siteName' => array('site_name', 255),
        'brandName' => array('brand_name', 255),
        'phone' => array('phone', 50),
        'email' => array('email', 100),
        'region' => array('region', 150),
        'businessDescription' => array('business_description', 0),
        'currentUrl' => array('current_url', 500),
        'designStyle' => array('design_style', 80),
        'primaryColor' => array('primary_color', 30),
        'customColor' => array('custom_color', 30),
        'targetRegion' => array('target_region', 150),
    );
    $sets = array("updated_at = '{$now}'");
    foreach ($map as $inKey => $col) {
        if (array_key_exists($inKey, $input)) {
            $val = (string) $input[$inKey];
            if ($col[1] > 0) {
                $val = substr($val, 0, $col[1]);
            }
            $sets[] = "`{$col[0]}` = '" . seosys300_esc($val) . "'";
        }
    }
    if (array_key_exists('wizardStep', $input)) {
        $step = seosys300_normalize_wizard_step($input['wizardStep']);
        if ($step !== '') {
            $sets[] = "wizard_step = '" . seosys300_esc($step) . "'";
        }
    }
    if (array_key_exists('purposes', $input)) {
        $sets[] = "purposes = '" . seosys300_esc(seosys300_json_list($input['purposes'])) . "'";
    }
    $needsExtra = array_key_exists('contacts', $input)
        || array_key_exists('extraRequest', $input)
        || array_key_exists('secondaryStyle', $input)
        || array_key_exists('colorPreset', $input)
        || array_key_exists('accentColor', $input)
        || ($allow_admin_extra && array_key_exists('materialsRequest', $input));
    if ($needsExtra && seosys300_orders_has_column('extra_json')) {
        $current = seosys300_fetch("SELECT extra_json FROM `{$table}` WHERE id = {$oid} LIMIT 1");
        $extra = seosys300_order_extra_decode($current ? $current : array());
        if (array_key_exists('contacts', $input)) {
            $extra['contacts'] = seosys300_sanitize_contacts($input['contacts']);
        }
        if (array_key_exists('extraRequest', $input)) {
            $extra['extraRequest'] = substr(trim((string) $input['extraRequest']), 0, 4000);
        }
        if (array_key_exists('secondaryStyle', $input)) {
            $extra['secondaryStyle'] = substr(trim((string) $input['secondaryStyle']), 0, 80);
        }
        if (array_key_exists('colorPreset', $input)) {
            $extra['colorPreset'] = substr(trim((string) $input['colorPreset']), 0, 80);
        }
        if (array_key_exists('accentColor', $input)) {
            $extra['accentColor'] = substr(trim((string) $input['accentColor']), 0, 30);
        }
        if ($allow_admin_extra && array_key_exists('materialsRequest', $input) && is_array($input['materialsRequest'])) {
            $req = $input['materialsRequest'];
            $extra['materialsRequest'] = array(
                'title' => isset($req['title']) ? substr((string) $req['title'], 0, 191) : '',
                'body' => isset($req['body']) ? substr((string) $req['body'], 0, 4000) : '',
                'categories' => isset($req['categories']) && is_array($req['categories']) ? $req['categories'] : array(),
                'requestedAt' => isset($req['requestedAt']) ? substr((string) $req['requestedAt'], 0, 32) : seosys300_now(),
            );
        }
        $public = seosys300_order_extra_public($extra);
        $json = json_encode($public);
        if ($json === false) {
            $json = '{}';
        }
        $sets[] = "extra_json = '" . seosys300_esc($json) . "'";
    }
    seosys300_query("UPDATE `{$table}` SET " . implode(', ', $sets) . " WHERE id = {$oid}");
}

function seosys300_order_ensure_draft($project_id)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $existing = seosys300_current_order_for_project($project_id, $mb_id);
    if ($existing) {
        list($menus, $features, $refs, $files) = seosys300_order_relations($existing['id']);
        return seosys300_order_to_api($existing, $menus, $features, $refs, $files);
    }
    $now = seosys300_now();
    $table = $g5['seosys300_website_orders_table'];
    $sql = "INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        site_type = '',
        purposes = '[]',
        industry = '',
        site_name = '',
        brand_name = '',
        phone = '',
        email = '',
        region = '',
        business_description = '',
        current_url = '',
        design_style = '',
        primary_color = '',
        custom_color = '',
        target_region = '',
        status = 'draft',
        progress = 10,
        is_draft = 1,
        wizard_step = 'intro',
        submitted_at = NULL,
        created_at = '{$now}',
        updated_at = '{$now}'";
    if (seosys300_orders_has_column('extra_json')) {
        $sql = str_replace("target_region = '',", "target_region = '', extra_json = '{}',", $sql);
    }
    if (!seosys300_query($sql)) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $id = (int) sql_insert_id();
    seosys300_append_status_history($id, '', 'draft', 'student', 'draft created');
    seosys300_log_activity((int) $project_id, 'WEBSITE_ORDER_CREATED', '홈페이지 기획 초안이 생성되었습니다.', array(
        'entity_type' => 'website_order',
        'entity_id' => $id,
    ));
    $row = seosys300_get_owned_order($id, $mb_id);
    list($menus, $features, $refs, $files) = seosys300_order_relations($id);
    return seosys300_order_to_api($row, $menus, $features, $refs, $files);
}

function seosys300_order_assert_editable($row)
{
    if ((string) $row['status'] !== 'draft' || empty($row['is_draft'])) {
        seosys300_json_error(409, 'order_locked', '제출된 주문은 이 화면에서 수정할 수 없습니다.');
    }
}

function seosys300_order_assert_uploadable($row)
{
    $status = seosys300_normalize_order_status(isset($row['status']) ? $row['status'] : '');
    if ($status === 'draft' && !empty($row['is_draft'])) {
        return;
    }
    if ($status === 'need_more_info') {
        return;
    }
    seosys300_json_error(409, 'order_locked', '지금은 파일을 변경할 수 없습니다.');
}

function seosys300_order_save($input, $submit = false)
{
    $mb_id = seosys300_current_mb_id();
    $project_id = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $order_id = isset($input['orderId']) ? (int) $input['orderId'] : 0;

    if ($order_id > 0) {
        $row = seosys300_get_owned_order($order_id, $mb_id);
        if (!$row) {
            seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
        }
    } else {
        if ($project_id < 1) {
            seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
        }
        $draft = seosys300_order_ensure_draft($project_id);
        $order_id = (int) $draft['id'];
        $row = seosys300_get_owned_order($order_id, $mb_id);
    }

    seosys300_order_assert_editable($row);

    if (isset($input['currentUrl']) && trim((string) $input['currentUrl']) !== '' && !seosys300_valid_http_url($input['currentUrl'])) {
        seosys300_json_error(422, 'invalid_url', '기존 사이트 주소는 http 또는 https만 사용할 수 있습니다.');
    }

    if (!seosys300_begin()) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }

    seosys300_apply_order_fields($order_id, $input);
    if (array_key_exists('menus', $input)) {
        seosys300_replace_menus($order_id, $input['menus']);
    }
    if (array_key_exists('features', $input)) {
        seosys300_replace_features($order_id, $input['features']);
    }
    if (array_key_exists('references', $input)) {
        seosys300_replace_references($order_id, $input['references']);
    }

    if (array_key_exists('keywords', $input) && !empty($row['project_id'])) {
        seosys300_replace_keywords((int) $row['project_id'], $input['keywords']);
    }

    if ($submit) {
        global $g5;
        $now = seosys300_now();
        $table = $g5['seosys300_website_orders_table'];
        $year = (int) date('Y');
        $orderNo = seosys300_format_order_no($order_id, $year);
        $orderNoSql = seosys300_orders_has_column('order_no')
            ? ", order_no = '" . seosys300_esc($orderNo) . "'"
            : '';
        seosys300_query("UPDATE `{$table}` SET status = 'submitted', is_draft = 0, progress = " . seosys300_website_progress_for_status('submitted') . ", submitted_at = '{$now}', updated_at = '{$now}' {$orderNoSql} WHERE id = {$order_id}");
        seosys300_append_status_history($order_id, (string) $row['status'], 'submitted', 'student', 'wizard submitted');
    }

    if (!seosys300_commit()) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }

    if ($submit) {
        seosys300_log_activity((int) $row['project_id'], 'WEBSITE_ORDER_SUBMITTED', '홈페이지 제작 주문이 접수되었습니다.', array(
            'entity_type' => 'website_order',
            'entity_id' => $order_id,
        ));
        seosys300_notify_order_event('WEBSITE_ORDER_SUBMITTED', array(
            'order_id' => $order_id,
            'project_id' => (int) $row['project_id'],
            'mb_id' => $mb_id,
        ));
        seosys300_sync_auto_roadmap((int) $row['project_id']);
    } elseif ((string) $row['status'] === 'draft' && empty($row['site_name']) && isset($input['siteName'])) {
        seosys300_log_activity((int) $row['project_id'], 'WEBSITE_ORDER_CREATED', '홈페이지 기획 초안이 저장되었습니다.', array(
            'entity_type' => 'website_order',
            'entity_id' => $order_id,
        ));
    }

    $fresh = seosys300_get_owned_order($order_id, $mb_id);
    list($menus, $features, $refs, $files) = seosys300_order_relations($order_id);
    return seosys300_order_to_api($fresh, $menus, $features, $refs, $files);
}

function seosys300_order_get_current($project_id)
{
    $mb_id = seosys300_current_mb_id();
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $row = seosys300_current_order_for_project($project_id, $mb_id);
    if (!$row) {
        return null;
    }
    list($menus, $features, $refs, $files) = seosys300_order_relations($row['id']);
    return seosys300_order_to_api($row, $menus, $features, $refs, $files);
}

function seosys300_admin_order_list()
{
    global $g5;
    $table = $g5['seosys300_website_orders_table'];
    $ptable = $g5['seosys300_projects_table'];
    $sql = "SELECT o.*, p.name AS project_name, p.domain AS project_domain
        FROM `{$table}` o
        LEFT JOIN `{$ptable}` p ON p.id = o.project_id
        ORDER BY o.updated_at DESC, o.id DESC
        LIMIT 200";
    $rows = seosys300_fetch_all($sql);
    $out = array();
    foreach ($rows as $row) {
        list($menus, $features, $refs, $files) = seosys300_order_relations($row['id']);
        $item = seosys300_order_to_api($row, $menus, $features, $refs, $files);
        $item['projectName'] = isset($row['project_name']) ? (string) $row['project_name'] : '';
        $item['projectDomain'] = isset($row['project_domain']) ? (string) $row['project_domain'] : '';
        $out[] = $item;
    }
    return $out;
}
