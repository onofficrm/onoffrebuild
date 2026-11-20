<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once(dirname(__FILE__) . '/../../lib/revision.lib.php');

seosys300_require_login();
seosys300_revision_ensure_tables();

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$row = seosys300_revision_get_file_row($id);
if (!$row) {
    http_response_code(404);
    echo 'not found';
    exit;
}

$ticket = seosys300_revision_get_row((int) $row['ticket_id']);
if (!$ticket) {
    http_response_code(404);
    echo 'not found';
    exit;
}

$mb_id = seosys300_current_mb_id();
$is_admin = function_exists('seosys300_is_admin') && seosys300_is_admin();
if (!$is_admin && (string) $ticket['mb_id'] !== (string) $mb_id) {
    http_response_code(403);
    echo 'forbidden';
    exit;
}

$path = rtrim(seosys300_upload_root(), '/') . '/' . ltrim((string) $row['rel_path'], '/');
$real_root = realpath(seosys300_upload_root());
$real_file = realpath($path);
if ($real_root === false || $real_file === false || strpos($real_file, $real_root) !== 0 || !is_file($real_file)) {
    http_response_code(404);
    echo 'not found';
    exit;
}

$name = str_replace(array("\r", "\n", '"'), '', (string) $row['original_name']);
$mime = strtolower((string) $row['mime_type']);
$imageMimes = array(
    'image/jpeg' => 'image/jpeg',
    'image/jpg' => 'image/jpeg',
    'image/png' => 'image/png',
    'image/gif' => 'image/gif',
    'image/webp' => 'image/webp',
);
if (!isset($imageMimes[$mime])) {
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $byExt = array('jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'gif' => 'image/gif', 'webp' => 'image/webp');
    $mime = isset($byExt[$ext]) ? $byExt[$ext] : 'application/octet-stream';
} else {
    $mime = $imageMimes[$mime];
}
$inline = $mime !== 'application/octet-stream';
header('Content-Type: ' . $mime);
header('Content-Length: ' . (string) filesize($real_file));
header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . '; filename="' . $name . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
readfile($real_file);
exit;
