<?php
include_once(dirname(__FILE__) . '/_common.php');
include_once(dirname(__FILE__) . '/lib/api.lib.php');

seosys300_require_method('GET');
try {
    seosys300_json_response(seosys300_session_payload(), 200);
} catch (Throwable $e) {
    seosys300_json_error(500, 'server_error', '세션을 확인하지 못했습니다.');
}
