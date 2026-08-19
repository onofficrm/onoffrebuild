<?php
include_once(dirname(__FILE__) . '/../_init.php');

seosys300_require_method('GET');
seosys300_require_login();
seosys300_require_tables();

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id < 1) {
    seosys300_json_error(422, 'validation_error', '파일 ID가 필요합니다.');
}

seosys300_send_file_download($id, seosys300_is_admin());
