<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_upload_root()
{
    return rtrim(G5_DATA_PATH, '/') . '/seo-system-300';
}

function seosys300_ensure_upload_htaccess()
{
    $root = seosys300_upload_root();
    if (!is_dir($root)) {
        @mkdir($root, 0755, true);
    }
    $ht = $root . '/.htaccess';
    if (!file_exists($ht)) {
        $body = "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder deny,allow\nDeny from all\n</IfModule>\n";
        @file_put_contents($ht, $body);
    }
}

function seosys300_safe_mb_dir($mb_id)
{
    $clean = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) $mb_id);
    return $clean !== '' ? $clean : 'unknown';
}

function seosys300_file_to_api($row)
{
    return array(
        'id' => (int) $row['id'],
        'orderId' => (int) $row['order_id'],
        'projectId' => (int) $row['project_id'],
        'category' => (string) $row['category'],
        'originalName' => (string) $row['original_name'],
        'mimeType' => (string) $row['mime_type'],
        'fileSize' => (int) $row['file_size'],
        'memo' => (string) $row['memo'],
        'status' => (string) $row['status'],
        'createdAt' => (string) $row['created_at'],
        'downloadUrl' => '/plugin/seo-system-300/api/website/download.php?id=' . (int) $row['id'],
    );
}

function seosys300_file_list_for_order($order_id)
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_files_table'];
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}` WHERE order_id = {$oid} AND status <> 'deleted' ORDER BY id DESC");
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_file_to_api($row);
    }
    return $out;
}

function seosys300_normalize_category($raw)
{
    $map = seosys300_ui_category_map();
    $key = preg_replace('/[^a-z0-9_]/', '', strtolower((string) $raw));
    if (isset($map[$key])) {
        return $map[$key];
    }
    $allowed = seosys300_file_categories();
    return in_array($key, $allowed, true) ? $key : 'other';
}

function seosys300_detect_mime($tmp)
{
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mime = finfo_file($finfo, $tmp);
            finfo_close($finfo);
            if (is_string($mime) && $mime !== '') {
                return $mime;
            }
        }
    }
    return 'application/octet-stream';
}

function seosys300_upload_file($order_id, $category, $memo = '')
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $order = seosys300_get_owned_order($order_id, $mb_id);
    if (!$order) {
        seosys300_json_error(404, 'order_not_found', '주문을 찾을 수 없습니다.');
    }
    seosys300_order_assert_uploadable($order);

    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        seosys300_json_error(422, 'upload_missing', '업로드할 파일을 선택해주세요.');
    }

    $file = $_FILES['file'];
    if (!empty($file['error'])) {
        seosys300_json_error(422, 'upload_failed', '파일 업로드에 실패했습니다. 다시 시도해주세요.');
    }

    $max = 12 * 1024 * 1024;
    if ((int) $file['size'] > $max || (int) $file['size'] < 1) {
        seosys300_json_error(422, 'file_too_large', '파일 크기를 확인한 뒤 다시 시도해주세요.');
    }

    $original = isset($file['name']) ? (string) $file['name'] : 'file';
    $blocked = seosys300_blocked_upload_ext();
    if (seosys300_filename_has_blocked_ext($original, $blocked)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    $ext = seosys300_safe_ext($original);
    $allowed = seosys300_allowed_upload_ext();
    if ($ext === '' || !in_array($ext, $allowed, true) || in_array($ext, $blocked, true)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    $tmp = $file['tmp_name'];
    $mime = seosys300_detect_mime($tmp);
    $mime_l = strtolower($mime);

    if (in_array($ext, array('jpg', 'jpeg', 'png', 'webp'), true)) {
        $info = @getimagesize($tmp);
        if ($info === false) {
            seosys300_json_error(422, 'file_type_denied', '이미지 파일을 확인할 수 없습니다.');
        }
        $imageMimes = array('image/jpeg', 'image/jpg', 'image/png', 'image/webp');
        if (!in_array($mime_l, $imageMimes, true) && strpos($mime_l, 'image/') !== 0) {
            seosys300_json_error(422, 'file_type_denied', '이미지 파일을 확인할 수 없습니다.');
        }
    }

    if (strpos($mime_l, 'text/html') === 0 || strpos($mime_l, 'application/x-php') === 0 || strpos($mime_l, 'text/x-php') === 0) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    $head = @file_get_contents($tmp, false, null, 0, 256);
    if (is_string($head) && preg_match('/<\?php|<\?=|<script[\s>]/i', $head)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    seosys300_ensure_upload_htaccess();
    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    $relDir = seosys300_safe_mb_dir($mb_id) . '/' . (int) $order['project_id'] . '/' . (int) $order_id;
    $absDir = seosys300_upload_root() . '/' . $relDir;
    if (!is_dir($absDir) && !@mkdir($absDir, 0755, true)) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $absPath = $absDir . '/' . $stored;
    if (!@move_uploaded_file($tmp, $absPath)) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    @chmod($absPath, 0644);

    $now = seosys300_now();
    $cat = seosys300_normalize_category($category);
    $table = $g5['seosys300_website_files_table'];
    $relPath = $relDir . '/' . $stored;
    $sql = "INSERT INTO `{$table}` SET
        order_id = " . (int) $order_id . ",
        project_id = " . (int) $order['project_id'] . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        category = '" . seosys300_esc($cat) . "',
        original_name = '" . seosys300_esc(substr($original, 0, 255)) . "',
        stored_name = '" . seosys300_esc($stored) . "',
        file_path = '" . seosys300_esc($relPath) . "',
        mime_type = '" . seosys300_esc(substr($mime, 0, 100)) . "',
        file_size = " . (int) $file['size'] . ",
        memo = '" . seosys300_esc(substr((string) $memo, 0, 255)) . "',
        status = 'uploaded',
        created_at = '{$now}',
        updated_at = '{$now}'";
    if (!seosys300_query($sql)) {
        @unlink($absPath);
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $id = (int) sql_insert_id();
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$id} LIMIT 1");
    if (!empty($row['project_id'])) {
        $status = seosys300_normalize_order_status(isset($order['status']) ? $order['status'] : '');
        $title = $status === 'need_more_info' ? '새 자료가 제출됨' : '홈페이지 자료가 업로드되었습니다.';
        seosys300_log_activity((int) $row['project_id'], 'WEBSITE_FILE_UPLOADED', $title, array(
            'entity_type' => 'website_file',
            'entity_id' => $id,
        ));
    }
    return seosys300_file_to_api($row);
}

function seosys300_file_row_accessible($file_id, $as_admin = false)
{
    global $g5;
    $fid = (int) $file_id;
    $table = $g5['seosys300_website_files_table'];
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$fid} AND status <> 'deleted' LIMIT 1");
    if (!$row) {
        return null;
    }
    if ($as_admin) {
        return $row;
    }
    if ((string) $row['mb_id'] !== seosys300_current_mb_id()) {
        return null;
    }
    return $row;
}

function seosys300_delete_file($file_id)
{
    global $g5;
    $row = seosys300_file_row_accessible($file_id, false);
    if (!$row) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    $order = seosys300_get_owned_order($row['order_id'], seosys300_current_mb_id());
    if (!$order) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    seosys300_order_assert_uploadable($order);

    $abs = seosys300_upload_root() . '/' . ltrim((string) $row['file_path'], '/');
    $root = seosys300_upload_root();
    if (strpos(realpath($abs) ?: '', realpath($root) ?: '___') === 0 && is_file($abs)) {
        @unlink($abs);
    }
    $now = seosys300_now();
    $table = $g5['seosys300_website_files_table'];
    seosys300_query("UPDATE `{$table}` SET status = 'deleted', updated_at = '{$now}' WHERE id = " . (int) $file_id);
    return array('deleted' => true, 'id' => (int) $file_id);
}

function seosys300_send_file_download($file_id, $as_admin = false)
{
    $row = seosys300_file_row_accessible($file_id, $as_admin);
    if (!$row) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    $root = realpath(seosys300_upload_root());
    $abs = realpath(seosys300_upload_root() . '/' . ltrim((string) $row['file_path'], '/'));
    if (!$root || !$abs || strpos($abs, $root) !== 0 || !is_file($abs)) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    $name = $row['original_name'] !== '' ? $row['original_name'] : $row['stored_name'];
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . str_replace(array("\r", "\n", '"'), '', $name) . '"');
    header('Content-Length: ' . filesize($abs));
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    readfile($abs);
    exit;
}

function seosys300_update_file_meta($file_id, $input)
{
    global $g5;
    $row = seosys300_file_row_accessible($file_id, false);
    if (!$row) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    $order = seosys300_get_owned_order($row['order_id'], seosys300_current_mb_id());
    if (!$order) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    seosys300_order_assert_uploadable($order);
    $sets = array("updated_at = '" . seosys300_now() . "'");
    if (array_key_exists('memo', $input)) {
        $sets[] = "memo = '" . seosys300_esc(substr((string) $input['memo'], 0, 255)) . "'";
    }
    if (array_key_exists('category', $input)) {
        $cat = seosys300_normalize_category($input['category']);
        $sets[] = "category = '" . seosys300_esc($cat) . "'";
    }
    $table = $g5['seosys300_website_files_table'];
    seosys300_query("UPDATE `{$table}` SET " . implode(', ', $sets) . ' WHERE id = ' . (int) $file_id);
    $fresh = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = " . (int) $file_id . ' LIMIT 1');
    return seosys300_file_to_api($fresh);
}

function seosys300_replace_file($file_id, $memo = '')
{
    $old = seosys300_file_row_accessible($file_id, false);
    if (!$old) {
        seosys300_json_error(404, 'file_not_found', '파일을 찾을 수 없습니다.');
    }
    $uploaded = seosys300_upload_file((int) $old['order_id'], $old['category'], $memo !== '' ? $memo : $old['memo']);
    seosys300_delete_file((int) $file_id);
    return $uploaded;
}

function seosys300_upload_task_screenshot($project_id)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        seosys300_json_error(422, 'upload_missing', '업로드할 파일을 선택해주세요.');
    }
    $file = $_FILES['file'];
    $original = isset($file['name']) ? (string) $file['name'] : 'file';
    $blocked = seosys300_blocked_upload_ext();
    if (seosys300_filename_has_blocked_ext($original, $blocked)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }
    $ext = seosys300_safe_ext($original);
    if (!in_array($ext, array('jpg', 'jpeg', 'png', 'webp'), true)) {
        seosys300_json_error(422, 'file_type_denied', '스크린샷은 jpg, png, webp만 업로드할 수 있습니다.');
    }
    $tmp = $file['tmp_name'];
    $info = @getimagesize($tmp);
    if ($info === false) {
        seosys300_json_error(422, 'file_type_denied', '이미지 파일을 확인할 수 없습니다.');
    }
    seosys300_ensure_upload_htaccess();
    $stored = bin2hex(random_bytes(16)) . '.' . $ext;
    $relDir = seosys300_safe_mb_dir($mb_id) . '/' . (int) $project_id . '/results';
    $absDir = seosys300_upload_root() . '/' . $relDir;
    if (!is_dir($absDir) && !@mkdir($absDir, 0755, true)) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $absPath = $absDir . '/' . $stored;
    if (!@move_uploaded_file($tmp, $absPath)) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $now = seosys300_now();
    $mime = seosys300_detect_mime($absPath);
    $relPath = $relDir . '/' . $stored;
    $table = $g5['seosys300_website_files_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        order_id = 0,
        project_id = " . (int) $project_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        category = 'task_result',
        original_name = '" . seosys300_esc(substr($original, 0, 255)) . "',
        stored_name = '" . seosys300_esc($stored) . "',
        file_path = '" . seosys300_esc($relPath) . "',
        mime_type = '" . seosys300_esc(substr($mime, 0, 100)) . "',
        file_size = " . (int) $file['size'] . ",
        memo = '',
        status = 'uploaded',
        created_at = '{$now}',
        updated_at = '{$now}'");
    $id = (int) sql_insert_id();
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$id} LIMIT 1");
    return seosys300_file_to_api($row);
}
